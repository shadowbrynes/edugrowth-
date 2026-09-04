import React, { useRef } from 'react';

interface ProfileUploadProps {
  image: string;
  onChange: (dataUrl: string) => void;
  label?: string;
}

export const ProfileUpload: React.FC<ProfileUploadProps> = ({
  image,
  onChange,
  label = 'Passport Photograph'
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      onChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
        {label}
      </label>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shrink-0 flex items-center justify-center shadow-inner">
          {image ? (
            <img src={image} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="material-symbols-outlined text-slate-400 text-3xl">account_circle</span>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="space-y-1">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">photo_camera</span>
            <span>Upload Photo</span>
          </button>
          <span className="text-[10px] text-slate-400 block font-mono">PNG, JPG up to 2MB</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileUpload;
