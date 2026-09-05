import React, { useState, useRef } from 'react';
import { imageApi, resolveImageUrl } from '../../services/api';

interface ImageUploaderProps {
  label?: string;
  imageType?: 'student_passport' | 'parent_passport' | 'father_passport' | 'mother_passport' | 'guardian_passport' | 'teacher_passport';
  targetType?: string; // Compatibility alias
  userId?: number;
  studentId?: number;
  parentId?: number;
  teacherId?: number;
  currentImage?: string;
  onUploadSuccess?: (newImageUrl: string) => void;
  onSuccess?: (newImageUrl: string) => void; // Compatibility alias
  onClose?: () => void;
  title?: string;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label = 'Upload Passport',
  imageType,
  targetType,
  userId,
  studentId,
  parentId,
  teacherId,
  currentImage,
  onUploadSuccess,
  onSuccess,
  onClose,
  title,
  className = ''
}) => {
  const effectiveImageType = (imageType || targetType || 'student_passport') as any;
  const [preview, setPreview] = useState<string | null>(() => {
    return currentImage ? resolveImageUrl(currentImage) : null;
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(Boolean(targetType && !imageType));

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Auto-compress and crop image to passport standard (400x400 square)
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const size = 400; // Passport square resolution
          canvas.width = size;
          canvas.height = size;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(event.target?.result as string);
            return;
          }

          // Center-crop to square
          const minDim = Math.min(img.width, img.height);
          const startX = (img.width - minDim) / 2;
          const startY = (img.height - minDim) / 2;

          ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, size, size);
          // Compress to JPEG at 90% quality
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.90);
          resolve(compressedDataUrl);
        };
        img.onerror = (e) => reject(e);
      };
      reader.onerror = (e) => reject(e);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Validate MIME type strictly (JPG, JPEG, PNG, WEBP)
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
    const validExts = ['jpg', 'jpeg', 'png', 'webp'];

    if (!validTypes.includes(file.type.toLowerCase()) && !validExts.includes(fileExt)) {
      setErrorMsg('Image format not supported');
      return;
    }

    // 2. Validate max size strictly (2MB limit)
    const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2MB
    if (file.size > MAX_SIZE_BYTES) {
      setErrorMsg('File size exceeded');
      return;
    }

    setSelectedFile(file);
    try {
      const compressed = await compressImage(file);
      setPreview(compressed);
      setShowModal(true);
    } catch (err: any) {
      setErrorMsg('Error processing image preview.');
    }
  };

  const handleConfirmUpload = async () => {
    if (!preview) return;

    setIsUploading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const response = await imageApi.uploadPassport({
        user_id: userId,
        student_id: studentId,
        parent_id: parentId,
        teacher_id: teacherId,
        image_type: effectiveImageType,
        base64_image: preview
      });

      if (response.success) {
        setSuccessMsg('Passport uploaded successfully');

        // Extract returned image URL or fallback to base64 preview
        const rawUrl = response.data?.image_url || response.data?.raw_url || response.data?.relative_url || preview;
        const resolved = resolveImageUrl(rawUrl);
        const cacheBuster = resolved.includes('?') ? `&updated=${Date.now()}` : `?updated=${Date.now()}`;
        const finalUrlWithCacheBust = resolved.startsWith('data:') ? resolved : `${resolved}${cacheBuster}`;

        setPreview(finalUrlWithCacheBust);

        // Notify parent components immediately
        onUploadSuccess?.(finalUrlWithCacheBust);
        onSuccess?.(finalUrlWithCacheBust);

        // Update local session if currently active user is updated
        const savedUserStr = localStorage.getItem('excelmind_user');
        if (savedUserStr) {
          try {
            const savedUser = JSON.parse(savedUserStr);
            if (!userId || Number(savedUser.id) === Number(userId) || (savedUser.student_id && Number(savedUser.student_id) === Number(studentId))) {
              savedUser.photo = finalUrlWithCacheBust;
              savedUser.student_passport = finalUrlWithCacheBust;
              savedUser.profile_image = finalUrlWithCacheBust;
              localStorage.setItem('excelmind_user', JSON.stringify(savedUser));
            }
          } catch (e) {}
        }

        setTimeout(() => {
          setShowModal(false);
          setSuccessMsg(null);
          onClose?.();
        }, 1200);
      } else {
        const backendError = response.error || response.data?.message;
        if (backendError && backendError.toLowerCase().includes('format')) {
          setErrorMsg('Image format not supported');
        } else if (backendError && backendError.toLowerCase().includes('size')) {
          setErrorMsg('File size exceeded');
        } else {
          setErrorMsg('Failed to upload passport');
        }
      }
    } catch (err: any) {
      setErrorMsg('Failed to upload passport');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setErrorMsg(null);
    setSuccessMsg(null);
    onClose?.();
  };

  return (
    <>
      <div className={`inline-block ${className}`}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer hover:shadow-blue-500/25"
        >
          <span className="material-symbols-outlined text-base">photo_camera</span>
          <span>{label}</span>
        </button>
      </div>

      {/* Passport Preview & Crop Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
            
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600">crop_square</span>
                <span>{title || 'Crop & Preview Passport'}</span>
              </h3>
              <button
                onClick={handleClose}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Square Passport Frame */}
            <div className="relative mx-auto w-48 h-48 rounded-2xl overflow-hidden shadow-inner border-4 border-dashed border-blue-500/60 p-1 bg-slate-100 dark:bg-slate-800">
              {preview ? (
                <img
                  key={preview}
                  src={preview}
                  alt="Passport Preview"
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <span className="material-symbols-outlined text-4xl mb-1">add_a_photo</span>
                  <span className="text-xs font-semibold">Select an image</span>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 py-1 bg-slate-950/70 text-[10px] text-white font-mono uppercase tracking-wider">
                Official 1:1 Passport Standard (Max 2MB)
              </div>
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
              {selectedFile ? (
                <p className="font-semibold text-slate-700 dark:text-slate-300">
                  {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                </p>
              ) : (
                <p className="font-semibold text-slate-700 dark:text-slate-300">
                  Select a photo (JPG, PNG, WEBP under 2MB)
                </p>
              )}
              <p>Square biometric framing suitable for official school student identification cards.</p>
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 text-xs font-bold border border-rose-200 dark:border-rose-800 flex items-center gap-1.5 justify-center">
                <span className="material-symbols-outlined text-base">error</span>
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5 justify-center">
                <span className="material-symbols-outlined text-base">check_circle</span>
                <span>{successMsg}</span>
              </div>
            )}

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={isUploading}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Cancel
              </button>
              
              {!selectedFile ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">photo_camera</span>
                  <span>Choose Photo</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleConfirmUpload}
                  disabled={isUploading}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      <span>Confirm & Save</span>
                    </>
                  )}
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
};
