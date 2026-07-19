import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer, getDoc, setDoc } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Auth & Firestore with Database ID from configuration
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId); /* CRITICAL: The app will break without this line */
export const auth = getAuth(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Error Handling helper
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection Validation - MUST be executed on startup
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}

// Google Sign-In helper using signInWithPopup as mandated for sandbox safety
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Google Authentication failed:", error);
    throw error;
  }
}

// Log out helper
export async function logOut() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
}

// Register user with email, password, name, and role
export async function registerWithEmailAndPassword(
  email: string,
  password: string,
  name: string,
  role: 'admin' | 'teacher' | 'student' | 'parent',
  institutionalId?: string
) {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    
    const profileData: any = {
      uid: user.uid,
      name,
      fullName: name,
      email,
      role,
      createdAt: new Date().toISOString()
    };
    
    if (institutionalId) {
      if (role === 'student') {
        profileData.studentId = institutionalId;
      } else {
        profileData.employeeId = institutionalId;
      }
    }
    
    // Save user profile in Firestore under the 'users' collection using UID
    await setDoc(doc(db, 'users', user.uid), profileData);
    
    return user;
  } catch (error) {
    console.error("Failed to register user:", error);
    throw error;
  }
}

// Sign in with email and password
export async function loginWithEmailAndPassword(email: string, password: string) {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    return res.user;
  } catch (error) {
    console.error("Failed to login user:", error);
    throw error;
  }
}

// Fetch user profile from Firestore users collection
export async function getUserProfile(uid: string) {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error("Failed to get user profile:", error);
    throw error;
  }
}

// Create or update profile (e.g. for Google Sign-In fallback)
export async function createUserProfileIfNotExist(
  uid: string,
  name: string,
  email: string,
  role: 'admin' | 'teacher' | 'student' | 'parent' = 'student'
) {
  try {
    const profile = await getUserProfile(uid);
    if (!profile) {
      const newProfile = {
        uid,
        name,
        fullName: name,
        email,
        role,
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'users', uid), newProfile);
      return newProfile;
    }
    return profile;
  } catch (error) {
    console.error("Failed to ensure user profile:", error);
    throw error;
  }
}

