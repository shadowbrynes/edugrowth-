import React, { useState } from 'react';
import { SchoolProfile } from '../types';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface SchoolProfileSectionProps {
  schoolProfile: SchoolProfile;
}

export const SchoolProfileSection: React.FC<SchoolProfileSectionProps> = ({ schoolProfile }) => {
  const [activeSubTab, setActiveSubTab] = useState<'identity' | 'contact' | 'branding' | 'admin' | 'system'>('identity');
  
  // Local Form States
  const [name, setName] = useState(schoolProfile.name);
  const [logoUrl, setLogoUrl] = useState(schoolProfile.logoUrl);
  const [coverBannerUrl, setCoverBannerUrl] = useState(schoolProfile.coverBannerUrl);
  const [motto, setMotto] = useState(schoolProfile.motto);
  const [vision, setVision] = useState(schoolProfile.vision);
  const [mission, setMission] = useState(schoolProfile.mission);
  const [description, setDescription] = useState(schoolProfile.description);
  const [coreValues, setCoreValues] = useState<string[]>(schoolProfile.coreValues || []);
  const [newValueInput, setNewValueInput] = useState('');

  // Contact Info States
  const [address, setAddress] = useState(schoolProfile.address);
  const [city, setCity] = useState(schoolProfile.city);
  const [state, setState] = useState(schoolProfile.state);
  const [country, setCountry] = useState(schoolProfile.country);
  const [postalCode, setPostalCode] = useState(schoolProfile.postalCode);
  const [email, setEmail] = useState(schoolProfile.email);
  const [phone, setPhone] = useState(schoolProfile.phone);
  const [website, setWebsite] = useState(schoolProfile.website);
  const [facebook, setFacebook] = useState(schoolProfile.socialLinks?.facebook || '');
  const [twitter, setTwitter] = useState(schoolProfile.socialLinks?.twitter || '');
  const [linkedin, setLinkedin] = useState(schoolProfile.socialLinks?.linkedin || '');
  const [instagram, setInstagram] = useState(schoolProfile.socialLinks?.instagram || '');

  // Branding States
  const [primaryColor, setPrimaryColor] = useState(schoolProfile.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(schoolProfile.secondaryColor);
  const [faviconUrl, setFaviconUrl] = useState(schoolProfile.faviconUrl);
  const [reportCardHeader, setReportCardHeader] = useState(schoolProfile.reportCardHeader);
  const [certificateHeader, setCertificateHeader] = useState(schoolProfile.certificateHeader);
  const [digitalStampUrl, setDigitalStampUrl] = useState(schoolProfile.digitalStampUrl);
  const [principalSignatureUrl, setPrincipalSignatureUrl] = useState(schoolProfile.principalSignatureUrl);
  const [watermarkUrl, setWatermarkUrl] = useState(schoolProfile.watermarkUrl);

  // Admin States
  const [principal, setPrincipal] = useState(schoolProfile.principal);
  const [vicePrincipal, setVicePrincipal] = useState(schoolProfile.vicePrincipal);
  const [registrar, setRegistrar] = useState(schoolProfile.registrar);
  const [bursar, setBursar] = useState(schoolProfile.bursar);
  const [schoolType, setSchoolType] = useState(schoolProfile.schoolType);
  const [academicSession, setAcademicSession] = useState(schoolProfile.academicSession);
  const [academicCalendar, setAcademicCalendar] = useState(schoolProfile.academicCalendar);

  // System States
  const [timezone, setTimezone] = useState(schoolProfile.timezone);
  const [language, setLanguage] = useState(schoolProfile.language);
  const [gradingSystem, setGradingSystem] = useState(schoolProfile.gradingSystem);
  const [attendanceMethod, setAttendanceMethod] = useState(schoolProfile.attendanceMethod);
  const [currency, setCurrency] = useState(schoolProfile.currency);
  const [smsEmailSettings, setSmsEmailSettings] = useState(schoolProfile.smsEmailSettings);

  // UI status states
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Core values helper
  const handleAddCoreValue = () => {
    if (newValueInput.trim() && !coreValues.includes(newValueInput.trim())) {
      setCoreValues([...coreValues, newValueInput.trim()]);
      setNewValueInput('');
    }
  };

  const handleRemoveCoreValue = (val: string) => {
    setCoreValues(coreValues.filter(v => v !== val));
  };

  // Generic Base64 Image File Reader Helper
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 200 * 1024) {
      alert("Image is too large. Please upload an image smaller than 200KB for high-fidelity sync.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        setter(evt.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Submit to Firestore
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setSaveError(null);

    const updatedProfile: SchoolProfile = {
      id: 'default',
      name,
      logoUrl,
      coverBannerUrl,
      motto,
      vision,
      mission,
      description,
      coreValues,
      address,
      city,
      state,
      country,
      postalCode,
      email,
      phone,
      website,
      socialLinks: {
        facebook,
        twitter,
        linkedin,
        instagram
      },
      primaryColor,
      secondaryColor,
      faviconUrl,
      reportCardHeader,
      certificateHeader,
      digitalStampUrl,
      principalSignatureUrl,
      watermarkUrl,
      principal,
      vicePrincipal,
      registrar,
      bursar,
      schoolType,
      academicSession,
      academicCalendar,
      timezone,
      language,
      gradingSystem,
      attendanceMethod,
      currency,
      smsEmailSettings
    };

    try {
      await setDoc(doc(db, 'school_profile', 'default'), updatedProfile);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      console.error("Error saving institutional profile:", err);
      setSaveError(err?.message || "Failed to save profile. Ensure you have network connectivity.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header with Title and Save Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">Institutional Profile</h2>
          <p className="text-sm text-on-surface-variant mt-1">Configure your school's official identity, branding color themes, contact details, and system rules.</p>
        </div>
        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="bg-secondary hover:bg-secondary/90 disabled:opacity-50 text-white text-xs font-black uppercase tracking-widest px-6 py-3 rounded-full flex items-center gap-2 shadow-lg hover:shadow-secondary/20 transition-all cursor-pointer self-stretch sm:self-auto justify-center"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full" />
              Saving Profile...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-sm">save</span>
              Save Custom Profile
            </>
          )}
        </button>
      </div>

      {/* Notifications */}
      {saveSuccess && (
        <div className="bg-emerald-950/80 text-emerald-400 p-4 border border-emerald-500/30 rounded-xl flex items-center gap-3 animate-fade-in shadow-md">
          <span className="material-symbols-outlined text-emerald-400">check_circle</span>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider">Configuration Applied Successfully!</p>
            <p className="text-[11px] text-emerald-400/80 mt-0.5">Your dynamic school logo, name, motto, and theme variables are updated instantly across all dashboards, transcripts, and credentials.</p>
          </div>
        </div>
      )}

      {saveError && (
        <div className="bg-red-950/80 text-red-400 p-4 border border-red-500/30 rounded-xl flex items-center gap-3 animate-fade-in shadow-md">
          <span className="material-symbols-outlined text-red-400">error</span>
          <p className="text-xs font-semibold">{saveError}</p>
        </div>
      )}

      {/* Horizontal Tab Navigation */}
      <div className="flex border-b border-outline-variant/60 overflow-x-auto whitespace-nowrap scrollbar-hide">
        <button
          onClick={() => setActiveSubTab('identity')}
          className={`px-5 py-3 text-xs uppercase tracking-wider font-bold transition-all border-b-2 ${activeSubTab === 'identity' ? 'border-[#ff3e00] text-white' : 'border-transparent text-on-surface-variant hover:text-white'}`}
        >
          🏰 Identity & Motto
        </button>
        <button
          onClick={() => setActiveSubTab('contact')}
          className={`px-5 py-3 text-xs uppercase tracking-wider font-bold transition-all border-b-2 ${activeSubTab === 'contact' ? 'border-[#ff3e00] text-white' : 'border-transparent text-on-surface-variant hover:text-white'}`}
        >
          📞 Contact & Socials
        </button>
        <button
          onClick={() => setActiveSubTab('branding')}
          className={`px-5 py-3 text-xs uppercase tracking-wider font-bold transition-all border-b-2 ${activeSubTab === 'branding' ? 'border-[#ff3e00] text-white' : 'border-transparent text-on-surface-variant hover:text-white'}`}
        >
          🎨 Color & Assets
        </button>
        <button
          onClick={() => setActiveSubTab('admin')}
          className={`px-5 py-3 text-xs uppercase tracking-wider font-bold transition-all border-b-2 ${activeSubTab === 'admin' ? 'border-[#ff3e00] text-white' : 'border-transparent text-on-surface-variant hover:text-white'}`}
        >
          👩‍💼 Administration
        </button>
        <button
          onClick={() => setActiveSubTab('system')}
          className={`px-5 py-3 text-xs uppercase tracking-wider font-bold transition-all border-b-2 ${activeSubTab === 'system' ? 'border-[#ff3e00] text-white' : 'border-transparent text-on-surface-variant hover:text-white'}`}
        >
          ⚙️ Settings & System
        </button>
      </div>

      {/* Profile Form Canvas */}
      <form onSubmit={handleSaveProfile} className="bg-[#131313] border border-outline-variant rounded-2xl p-6 md:p-8 space-y-8 shadow-xl">
        
        {/* SUBTAB 1: IDENTITY */}
        {activeSubTab === 'identity' && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider border-b border-outline-variant pb-2">Institutional Identity Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] uppercase font-bold tracking-wider text-on-surface-variant">School / Institution Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Saint Jude's Academy of Sciences"
                  className="w-full bg-[#1c1c1c] border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ff3e00] text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] uppercase font-bold tracking-wider text-on-surface-variant">School Motto <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={motto}
                  onChange={(e) => setMotto(e.target.value)}
                  placeholder="e.g. Ad Astra Per Aspera"
                  className="w-full bg-[#1c1c1c] border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ff3e00] text-white"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[11px] uppercase font-bold tracking-wider text-on-surface-variant">School Vision Statement</label>
                <textarea
                  rows={2}
                  value={vision}
                  onChange={(e) => setVision(e.target.value)}
                  placeholder="The official vision statement of the school..."
                  className="w-full bg-[#1c1c1c] border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ff3e00] text-white"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[11px] uppercase font-bold tracking-wider text-on-surface-variant">School Mission Statement</label>
                <textarea
                  rows={2}
                  value={mission}
                  onChange={(e) => setMission(e.target.value)}
                  placeholder="The official mission statement of the school..."
                  className="w-full bg-[#1c1c1c] border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ff3e00] text-white"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[11px] uppercase font-bold tracking-wider text-on-surface-variant">Description / About</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Write a brief background of your institution, which will display on the parent and teacher portals..."
                  className="w-full bg-[#1c1c1c] border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ff3e00] text-white"
                />
              </div>

              {/* Core Values Tag Editor */}
              <div className="space-y-3 md:col-span-2">
                <label className="text-[11px] uppercase font-bold tracking-wider text-on-surface-variant">Core Institutional Values</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newValueInput}
                    onChange={(e) => setNewValueInput(e.target.value)}
                    placeholder="Add core value (e.g. Integrity, Discipline)"
                    className="flex-1 bg-[#1c1c1c] border border-outline-variant rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#ff3e00] text-white"
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCoreValue(); } }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCoreValue}
                    className="px-4 py-2.5 bg-secondary hover:bg-secondary/80 text-white text-xs font-bold rounded-xl transition-all"
                  >
                    Add Value
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {coreValues.map((val) => (
                    <span key={val} className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-low text-xs text-white rounded-full border border-outline-variant">
                      {val}
                      <button
                        type="button"
                        onClick={() => handleRemoveCoreValue(val)}
                        className="text-red-400 hover:text-red-600 focus:outline-none"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {coreValues.length === 0 && (
                    <span className="text-xs text-on-surface-variant italic">No core values specified. Add some above.</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 2: CONTACT & SOCIALS */}
        {activeSubTab === 'contact' && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider border-b border-outline-variant pb-2">Institutional Contact Points</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-[11px] uppercase font-bold tracking-wider text-on-surface-variant">Physical Street Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 100 Academic Boulevard, Science District"
                  className="w-full bg-[#1c1c1c] border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ff3e00] text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] uppercase font-bold tracking-wider text-on-surface-variant">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Lagos"
                  className="w-full bg-[#1c1c1c] border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ff3e00] text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] uppercase font-bold tracking-wider text-on-surface-variant">State / Province</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Lagos State"
                  className="w-full bg-[#1c1c1c] border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ff3e00] text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] uppercase font-bold tracking-wider text-on-surface-variant">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. Nigeria"
                  className="w-full bg-[#1c1c1c] border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ff3e00] text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] uppercase font-bold tracking-wider text-on-surface-variant">Postal / Zip Code</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="e.g. 100001"
                  className="w-full bg-[#1c1c1c] border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ff3e00] text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] uppercase font-bold tracking-wider text-on-surface-variant">Official Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. info@stjudesacademy.edu"
                  className="w-full bg-[#1c1c1c] border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ff3e00] text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] uppercase font-bold tracking-wider text-on-surface-variant">Official Phone Numbers</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +234 1 555 0192"
                  className="w-full bg-[#1c1c1c] border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ff3e00] text-white"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[11px] uppercase font-bold tracking-wider text-on-surface-variant">Official Website URL</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="e.g. https://stjudesacademy.edu"
                  className="w-full bg-[#1c1c1c] border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ff3e00] text-white"
                />
              </div>

              {/* Social Media */}
              <div className="space-y-4 md:col-span-2 pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white/70">Social Media Links</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg text-[#ff3e00]">link</span>
                    <input
                      type="url"
                      value={facebook}
                      onChange={(e) => setFacebook(e.target.value)}
                      placeholder="Facebook Page URL..."
                      className="flex-1 bg-[#1c1c1c] border border-outline-variant rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#ff3e00] text-white"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg text-[#ff3e00]">link</span>
                    <input
                      type="url"
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      placeholder="X (Twitter) Profile URL..."
                      className="flex-1 bg-[#1c1c1c] border border-outline-variant rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#ff3e00] text-white"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg text-[#ff3e00]">link</span>
                    <input
                      type="url"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="LinkedIn Company Page URL..."
                      className="flex-1 bg-[#1c1c1c] border border-outline-variant rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#ff3e00] text-white"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg text-[#ff3e00]">link</span>
                    <input
                      type="url"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="Instagram Handle URL..."
                      className="flex-1 bg-[#1c1c1c] border border-outline-variant rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#ff3e00] text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 3: COLOR & ASSETS */}
        {activeSubTab === 'branding' && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider border-b border-outline-variant pb-2">Theme & Custom Branding Assets</h3>
              <p className="text-xs text-on-surface-variant mt-1">Upload high-contrast vector assets and signatures that automatically brand printable PDF cards, certificates, and seals.</p>
            </div>

            {/* Logo, Banner, Favicon */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Logo Card */}
              <div className="bg-[#1c1c1c] border border-outline-variant rounded-2xl p-5 flex flex-col items-center justify-between gap-4 text-center">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">Institutional Logo</h4>
                  <p className="text-[10px] text-on-surface-variant mt-1">Primary seal/crest. Displayed on Login page, head banners, transcripts, and official letters.</p>
                </div>
                
                <div className="w-24 h-24 bg-black border border-white/10 rounded-xl flex items-center justify-center overflow-hidden p-2">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo Preview" className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="text-[10px] text-on-surface-variant uppercase font-mono font-bold">No Crest</span>
                  )}
                </div>

                <div className="w-full">
                  <label className="w-full bg-[#ff3e00]/10 hover:bg-[#ff3e00]/20 text-[#ff3e00] hover:text-[#ff3e00]/90 text-[10px] font-bold uppercase tracking-wider py-2.5 rounded-xl border border-[#ff3e00]/25 transition-all cursor-pointer flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-sm">upload_file</span>
                    Upload Crest (Max 200KB)
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, setLogoUrl)}
                      className="hidden"
                    />
                  </label>
                  {logoUrl && (
                    <button
                      type="button"
                      onClick={() => setLogoUrl('')}
                      className="text-[9px] text-red-400 uppercase tracking-wider font-bold mt-2 hover:underline focus:outline-none"
                    >
                      Clear Logo
                    </button>
                  )}
                </div>
              </div>

              {/* Cover Banner Card */}
              <div className="bg-[#1c1c1c] border border-outline-variant rounded-2xl p-5 flex flex-col items-center justify-between gap-4 text-center md:col-span-2">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">Institutional Cover Banner</h4>
                  <p className="text-[10px] text-on-surface-variant mt-1">Wide horizontal graphic. Used at the top of portal homepages and printable brochures.</p>
                </div>
                
                <div className="w-full h-24 bg-black border border-white/10 rounded-xl flex items-center justify-center overflow-hidden">
                  {coverBannerUrl ? (
                    <img src={coverBannerUrl} alt="Banner Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="text-[10px] text-on-surface-variant uppercase font-mono font-bold">No Banner</span>
                  )}
                </div>

                <div className="w-full">
                  <label className="w-full bg-secondary/10 hover:bg-secondary/20 text-secondary text-[10px] font-bold uppercase tracking-wider py-2.5 rounded-xl border border-secondary/25 transition-all cursor-pointer flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-sm">upload_file</span>
                    Upload Banner
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, setCoverBannerUrl)}
                      className="hidden"
                    />
                  </label>
                  {coverBannerUrl && (
                    <button
                      type="button"
                      onClick={() => setCoverBannerUrl('')}
                      className="text-[9px] text-red-400 uppercase tracking-wider font-bold mt-2 hover:underline focus:outline-none"
                    >
                      Clear Banner
                    </button>
                  )}
                </div>
              </div>

              {/* Favicon Card */}
              <div className="bg-[#1c1c1c] border border-outline-variant rounded-2xl p-5 flex flex-col items-center justify-between gap-4 text-center">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">Favicon (.ico/.png)</h4>
                  <p className="text-[10px] text-on-surface-variant mt-1">Browser tab icon, bookmark badge, and tiny receipt icon.</p>
                </div>
                
                <div className="w-12 h-12 bg-black border border-white/10 rounded-xl flex items-center justify-center overflow-hidden p-1.5">
                  {faviconUrl ? (
                    <img src={faviconUrl} alt="Favicon Preview" className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="text-[9px] text-on-surface-variant uppercase font-mono font-bold">None</span>
                  )}
                </div>

                <div className="w-full">
                  <label className="w-full bg-secondary/10 hover:bg-secondary/20 text-secondary text-[10px] font-bold uppercase tracking-wider py-2 rounded-xl border border-secondary/25 transition-all cursor-pointer flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-sm">upload_file</span>
                    Upload Favicon
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, setFaviconUrl)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Theme Colors */}
              <div className="bg-[#1c1c1c] border border-outline-variant rounded-2xl p-5 flex flex-col gap-4 justify-between md:col-span-2">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">Brand Color Palette</h4>
                  <p className="text-[10px] text-on-surface-variant mt-1">Customize accents and layouts. Select predefined presets or pick custom hex codes.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-white/60">Primary Accent</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-10 h-10 bg-transparent border border-outline-variant/60 rounded cursor-pointer p-0.5"
                      />
                      <input
                        type="text"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="flex-1 bg-black border border-outline-variant rounded-lg px-3 py-1.5 text-xs font-mono uppercase text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-white/60">Secondary Accent</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="w-10 h-10 bg-transparent border border-outline-variant/60 rounded cursor-pointer p-0.5"
                      />
                      <input
                        type="text"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="flex-1 bg-black border border-outline-variant rounded-lg px-3 py-1.5 text-xs font-mono uppercase text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Predefined preset color chips */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase mr-2">Presets:</span>
                  <button
                    type="button"
                    onClick={() => { setPrimaryColor('#ff3e00'); setSecondaryColor('#00d2ff'); }}
                    className="px-2.5 py-1 rounded bg-[#ff3e00]/10 hover:bg-[#ff3e00]/20 text-[#ff3e00] border border-[#ff3e00]/30 text-[9px] font-black uppercase tracking-wider"
                  >
                    Cosmic Neon
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPrimaryColor('#4f46e5'); setSecondaryColor('#06b6d4'); }}
                    className="px-2.5 py-1 rounded bg-[#4f46e5]/10 hover:bg-[#4f46e5]/20 text-indigo-400 border border-indigo-500/30 text-[9px] font-black uppercase tracking-wider"
                  >
                    Classic Royal
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPrimaryColor('#10b981'); setSecondaryColor('#f59e0b'); }}
                    className="px-2.5 py-1 rounded bg-[#10b981]/10 hover:bg-[#10b981]/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-black uppercase tracking-wider"
                  >
                    Eco Forest
                  </button>
                </div>
              </div>
            </div>

            {/* Headers, Stamp, Watermark, Signature */}
            <div className="space-y-6 pt-4 border-t border-white/5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white/70">Document headers & Official Signatures</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] uppercase font-bold tracking-wider text-on-surface-variant">Report Card Official Header Title</label>
                  <input
                    type="text"
                    value={reportCardHeader}
                    onChange={(e) => setReportCardHeader(e.target.value)}
                    placeholder="e.g. SAINT JUDE'S ACADEMY OFFICIAL PROGRESS REPORT"
                    className="w-full bg-[#1c1c1c] border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ff3e00] text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] uppercase font-bold tracking-wider text-on-surface-variant">Certificate Official Header Title</label>
                  <input
                    type="text"
                    value={certificateHeader}
                    onChange={(e) => setCertificateHeader(e.target.value)}
                    placeholder="e.g. SAINT JUDE'S ACADEMY CERTIFICATE OF GRADUATION"
                    className="w-full bg-[#1c1c1c] border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ff3e00] text-white"
                  />
                </div>

                {/* Digital Stamp, signature, watermark */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:col-span-2 pt-2">
                  
                  {/* Digital Stamp */}
                  <div className="bg-[#1c1c1c] border border-outline-variant/60 rounded-xl p-4 flex flex-col items-center justify-between text-center gap-3">
                    <span className="text-[10px] uppercase font-bold text-white/70">Digital Stamp / Seal</span>
                    <div className="w-16 h-16 bg-black border border-white/5 rounded-full flex items-center justify-center p-1 overflow-hidden">
                      {digitalStampUrl ? (
                        <img src={digitalStampUrl} alt="Stamp" className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
                      ) : (
                        <span className="text-[9px] text-on-surface-variant">None</span>
                      )}
                    </div>
                    <label className="w-full bg-white/5 hover:bg-white/10 text-white text-[9px] font-bold uppercase tracking-wider py-1.5 rounded-lg border border-white/10 transition-all cursor-pointer flex items-center justify-center">
                      Upload Seal
                      <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setDigitalStampUrl)} className="hidden" />
                    </label>
                  </div>

                  {/* Principal's Signature */}
                  <div className="bg-[#1c1c1c] border border-outline-variant/60 rounded-xl p-4 flex flex-col items-center justify-between text-center gap-3">
                    <span className="text-[10px] uppercase font-bold text-white/70">Principal's Signature</span>
                    <div className="w-16 h-16 bg-white border border-white/5 rounded flex items-center justify-center p-1 overflow-hidden">
                      {principalSignatureUrl ? (
                        <img src={principalSignatureUrl} alt="Signature" className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
                      ) : (
                        <span className="text-[9px] text-[#0c0c0c]">None</span>
                      )}
                    </div>
                    <label className="w-full bg-white/5 hover:bg-white/10 text-white text-[9px] font-bold uppercase tracking-wider py-1.5 rounded-lg border border-white/10 transition-all cursor-pointer flex items-center justify-center">
                      Upload Signature
                      <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setPrincipalSignatureUrl)} className="hidden" />
                    </label>
                  </div>

                  {/* Watermark */}
                  <div className="bg-[#1c1c1c] border border-outline-variant/60 rounded-xl p-4 flex flex-col items-center justify-between text-center gap-3">
                    <span className="text-[10px] uppercase font-bold text-white/70">Certificate Watermark</span>
                    <div className="w-16 h-16 bg-black border border-white/5 rounded flex items-center justify-center p-1 overflow-hidden">
                      {watermarkUrl ? (
                        <img src={watermarkUrl} alt="Watermark" className="max-w-full max-h-full object-contain opacity-50" referrerPolicy="no-referrer" />
                      ) : (
                        <span className="text-[9px] text-on-surface-variant">None</span>
                      )}
                    </div>
                    <label className="w-full bg-white/5 hover:bg-white/10 text-white text-[9px] font-bold uppercase tracking-wider py-1.5 rounded-lg border border-white/10 transition-all cursor-pointer flex items-center justify-center">
                      Upload Watermark
                      <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setWatermarkUrl)} className="hidden" />
                    </label>
                  </div>

                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 4: ADMINISTRATION */}
        {activeSubTab === 'admin' && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider border-b border-outline-variant pb-2">Academic Administration Roles</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] uppercase font-bold tracking-wider text-on-surface-variant">Principal / Head Teacher</label>
                <input
                  type="text"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                  placeholder="e.g. Professor Alexander Sterling"
                  className="w-full bg-[#1c1c1c] border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ff3e00] text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] uppercase font-bold tracking-wider text-on-surface-variant">Vice Principal(s)</label>
                <input
                  type="text"
                  value={vicePrincipal}
                  onChange={(e) => setVicePrincipal(e.target.value)}
                  placeholder="e.g. Dr. Evelyn Carter"
                  className="w-full bg-[#1c1c1c] border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ff3e00] text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] uppercase font-bold tracking-wider text-on-surface-variant">Chief Registrar</label>
                <input
                  type="text"
                  value={registrar}
                  onChange={(e) => setRegistrar(e.target.value)}
                  placeholder="e.g. Chief Registrar Marcus Sterling"
                  className="w-full bg-[#1c1c1c] border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ff3e00] text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] uppercase font-bold tracking-wider text-on-surface-variant">Institutional Bursar</label>
                <input
                  type="text"
                  value={bursar}
                  onChange={(e) => setBursar(e.target.value)}
                  placeholder="e.g. Bursar Robert Vance"
                  className="w-full bg-[#1c1c1c] border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ff3e00] text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] uppercase font-bold tracking-wider text-on-surface-variant">School Type / Classification</label>
                <select
                  value={schoolType}
                  onChange={(e) => setSchoolType(e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ff3e00] text-white"
                >
                  <option value="Primary">🎒 Primary / Elementary School</option>
                  <option value="Secondary">🏫 Secondary / High School</option>
                  <option value="University">🏛️ University / Higher Education</option>
                  <option value="Polytechnic">⚙️ Polytechnic / Technology Institute</option>
                  <option value="College">🎓 College of Education</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] uppercase font-bold tracking-wider text-on-surface-variant">Current Academic Session</label>
                <input
                  type="text"
                  value={academicSession}
                  onChange={(e) => setAcademicSession(e.target.value)}
                  placeholder="e.g. 2023/2024"
                  className="w-full bg-[#1c1c1c] border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ff3e00] text-white"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[11px] uppercase font-bold tracking-wider text-on-surface-variant">Active Term System / Academic Calendar</label>
                <input
                  type="text"
                  value={academicCalendar}
                  onChange={(e) => setAcademicCalendar(e.target.value)}
                  placeholder="e.g. Semester System (Harmattan & Rain Semesters)"
                  className="w-full bg-[#1c1c1c] border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ff3e00] text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 5: SYSTEM & SETTINGS */}
        {activeSubTab === 'system' && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider border-b border-outline-variant pb-2">System Configurations & Operations</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] uppercase font-bold tracking-wider text-on-surface-variant">Local Time Zone</label>
                <input
                  type="text"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  placeholder="e.g. GMT+1 (Africa/Lagos)"
                  className="w-full bg-[#1c1c1c] border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ff3e00] text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] uppercase font-bold tracking-wider text-on-surface-variant">Instruction Language</label>
                <input
                  type="text"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  placeholder="e.g. English (UK)"
                  className="w-full bg-[#1c1c1c] border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ff3e00] text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] uppercase font-bold tracking-wider text-on-surface-variant">Default Grading Scale</label>
                <input
                  type="text"
                  value={gradingSystem}
                  onChange={(e) => setGradingSystem(e.target.value)}
                  placeholder="e.g. West African WAEC Scale / US 4.0 GPA"
                  className="w-full bg-[#1c1c1c] border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ff3e00] text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] uppercase font-bold tracking-wider text-on-surface-variant">Attendance Capture Method</label>
                <input
                  type="text"
                  value={attendanceMethod}
                  onChange={(e) => setAttendanceMethod(e.target.value)}
                  placeholder="e.g. RFID Daily Badge Scan"
                  className="w-full bg-[#1c1c1c] border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ff3e00] text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] uppercase font-bold tracking-wider text-on-surface-variant">School Fees Default Currency</label>
                <input
                  type="text"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  placeholder="e.g. NGN (₦) or USD ($)"
                  className="w-full bg-[#1c1c1c] border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ff3e00] text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] uppercase font-bold tracking-wider text-on-surface-variant">Automated Alerts Settings</label>
                <input
                  type="text"
                  value={smsEmailSettings}
                  onChange={(e) => setSmsEmailSettings(e.target.value)}
                  placeholder="e.g. Instant Parent SMS Alerts Enabled"
                  className="w-full bg-[#1c1c1c] border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ff3e00] text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Footer Area inside form */}
        <div className="pt-6 border-t border-outline-variant/60 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-on-surface-variant text-xs">
            <span className="material-symbols-outlined text-sm text-[#ff3e00]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
            <span>Ledger Signed Configuration • Synced over TLS 1.3</span>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-6 py-3 bg-secondary hover:bg-secondary/90 disabled:opacity-50 text-white text-xs font-black uppercase tracking-widest rounded-full transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            {saving ? 'Applying...' : 'Apply Modifications'}
          </button>
        </div>
      </form>
    </div>
  );
};
