import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer, getDoc, setDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
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
    
    // If role is student, also create an academic record entry in the 'students' collection
    if (role === 'student') {
      const studentRecord = {
        id: `st-${user.uid.slice(0, 10)}`,
        name: name,
        initials: name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
        gpa: 3.85,
        status: 'Good Standing',
        rank: 1,
        totalStudents: 1240,
        attendance: 98,
        gradeLevel: 'Grade 10 - Alpha'
      };
      await setDoc(doc(db, 'students', studentRecord.id), studentRecord).catch(err => {
        console.error("Auto-creating student academic record failed:", err);
      });
    }

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

// Synchronize a student's GPA, rank, and status across the registry (transcripts, students, children collections)
export async function syncStudentPerformance(transcriptDocId: string) {
  try {
    // 1. Fetch transcript doc
    const transcriptRef = doc(db, 'transcripts', transcriptDocId);
    const transcriptSnap = await getDoc(transcriptRef);
    if (!transcriptSnap.exists()) return;
    const transcriptData = transcriptSnap.data();

    const finalGpa = Number(transcriptData.finalGpa);
    const fullName = transcriptData.fullName;
    const studentStatus = transcriptData.status === 'PROBATION' ? 'Academic Probation' : 
                          (finalGpa >= 4.5 ? 'High Honor' : (finalGpa >= 3.8 ? 'Honor Roll' : 'Good Standing'));

    // 2. Find and update corresponding student in 'students' collection
    const studentsRef = collection(db, 'students');
    const studentQuery = query(studentsRef, where('name', '==', fullName));
    const studentSnap = await getDocs(studentQuery);
    
    let matchedStudentId = '';
    studentSnap.forEach((doc) => {
      matchedStudentId = doc.id;
    });

    if (matchedStudentId) {
      await updateDoc(doc(db, 'students', matchedStudentId), {
        gpa: finalGpa,
        status: studentStatus
      });
    }

    // 3. Find and update corresponding child record in 'children' collection (Parent Portal)
    const childrenRef = collection(db, 'children');
    const childrenQuery = query(childrenRef, where('name', '==', fullName));
    const childrenSnap = await getDocs(childrenQuery);
    
    let matchedChildId = '';
    childrenSnap.forEach((doc) => {
      matchedChildId = doc.id;
    });

    if (matchedChildId) {
      await updateDoc(doc(db, 'children', matchedChildId), {
        currentGpa: finalGpa
      });
    }

    // 4. Recalculate ranks across the 'students' collection
    const allStudentsSnap = await getDocs(studentsRef);
    const studentsList: { id: string; gpa: number; name: string }[] = [];
    allStudentsSnap.forEach((doc) => {
      const data = doc.data();
      studentsList.push({
        id: doc.id,
        gpa: Number(data.gpa || 0),
        name: data.name
      });
    });

    // Sort students by GPA descending
    studentsList.sort((a, b) => b.gpa - a.gpa);

    // Update ranks in Firestore
    for (let i = 0; i < studentsList.length; i++) {
      const rank = i + 1;
      const s = studentsList[i];
      await updateDoc(doc(db, 'students', s.id), {
        rank: rank,
        totalStudents: studentsList.length
      });

      // If this student has a parent portal child record, also update their rank string
      const cQuery = query(childrenRef, where('name', '==', s.name));
      const cSnap = await getDocs(cQuery);
      cSnap.forEach(async (cDoc) => {
        await updateDoc(doc(db, 'children', cDoc.id), {
          rank: `#${rank} / ${studentsList.length}`
        });
      });
    }

    console.log(`Successfully synchronized academic performance for ${fullName}`);
  } catch (error) {
    console.error("Failed to sync student performance:", error);
  }
}

