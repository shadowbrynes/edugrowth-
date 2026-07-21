import React, { useState } from 'react';

interface ContactTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  onSendMessage: (teacherName: string, message: string) => void;
}

export const ContactTeacherModal: React.FC<ContactTeacherModalProps> = ({ isOpen, onClose, studentName, onSendMessage }) => {
  const [selectedTeacher, setSelectedTeacher] = useState('Ms. Sarah Jenkins (Mathematics)');
  const [subject, setSubject] = useState(`Inquiry regarding ${studentName}'s term progress`);
  const [message, setMessage] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const teacherPhoneNumbers: Record<string, string> = {
    'Ms. Sarah Jenkins (Mathematics)': '+2348012345678',
    'Mr. David Roth (Physical Education)': '+2348087654321',
    'Dr. Elena Rostova (Robotics & Science)': '+2348123456789',
    'Prof. Arthur Pendelton (World Literature)': '+2348098765432',
    'Dr. Richard Vance (School Principal)': '+2348198765432'
  };

  const teacherEmails: Record<string, string> = {
    'Ms. Sarah Jenkins (Mathematics)': 's.jenkins@edugrowth.edu',
    'Mr. David Roth (Physical Education)': 'd.roth@edugrowth.edu',
    'Dr. Elena Rostova (Robotics & Science)': 'e.rostova@edugrowth.edu',
    'Prof. Arthur Pendelton (World Literature)': 'a.pendelton@edugrowth.edu',
    'Dr. Richard Vance (School Principal)': 'principal@edugrowth.edu'
  };

  const handleEmailChat = () => {
    const email = teacherEmails[selectedTeacher] || 'faculty@edugrowth.edu';
    const emailSubject = `EduGrowth Inquiry: ${subject}`;
    const emailBody = `Hello ${selectedTeacher},\n\nI am contacting you regarding ${studentName}.\n\nMessage:\n${message || 'Please reach out to me regarding academic progress.'}\n\nThank you.`;
    window.open(`mailto:${email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`, '_blank');
  };

  const handleWhatsAppChat = () => {
    const phoneNumber = teacherPhoneNumbers[selectedTeacher];
    if (!phoneNumber) return;
    
    const messageText = `Hello, I am contacting you via EduGrowth regarding ${studentName}. ${message ? `Message: ${message}` : ''}`;
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(messageText)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSendMessage(selectedTeacher, message);
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setMessage('');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl border border-outline-variant shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="p-6 bg-secondary text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>mail</span>
            <div>
              <h3 className="text-lg font-bold">Contact Faculty Member</h3>
              <p className="text-xs text-secondary-fixed">Student: {studentName} • Direct WhatsApp & Email Communication</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1 rounded-full">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {sentSuccess ? (
          <div className="p-12 text-center space-y-3 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-tertiary-container text-tertiary-fixed flex items-center justify-center mx-auto shadow-md">
              <span className="material-symbols-outlined text-4xl">check_circle</span>
            </div>
            <h4 className="text-lg font-bold text-on-surface">Message Sent Successfully!</h4>
            <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
              Your inquiry has been routed to {selectedTeacher}. Expect a response via WhatsApp or Email within 24 business hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">Recipient Faculty Member</label>
              <select
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-secondary text-sm font-semibold"
              >
                <option value="Ms. Sarah Jenkins (Mathematics)">Ms. Sarah Jenkins (Mathematics)</option>
                <option value="Mr. David Roth (Physical Education)">Mr. David Roth (Physical Education)</option>
                <option value="Dr. Elena Rostova (Robotics & Science)">Dr. Elena Rostova (Robotics & Science)</option>
                <option value="Prof. Arthur Pendelton (World Literature)">Prof. Arthur Pendelton (World Literature)</option>
                <option value="Dr. Richard Vance (School Principal)">Dr. Richard Vance (School Principal)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">Subject Line</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-secondary text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">Your Message</label>
              <textarea
                rows={4}
                required
                placeholder="Write your inquiry or schedule request regarding recent grades, laboratory sessions, or attendance..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
              />
            </div>

            {/* Direct Instant Channels */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">Direct Communication Points</span>
                <span className="text-[10px] font-bold bg-emerald-200/60 text-emerald-900 px-2 py-0.5 rounded-full">INSTANT</span>
              </div>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Connect directly with {selectedTeacher.split(' ')[1] || 'Faculty'} via WhatsApp or official Email:
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleWhatsAppChat}
                  className="flex-1 py-2 px-3 bg-[#25d366] hover:bg-[#20ba5a] text-white font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer border-none"
                >
                  <span className="material-symbols-outlined text-sm">call</span>
                  <span>WhatsApp Chat</span>
                </button>
                <button
                  type="button"
                  onClick={handleEmailChat}
                  className="flex-1 py-2 px-3 bg-secondary hover:bg-secondary/90 text-white font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer border-none"
                >
                  <span className="material-symbols-outlined text-sm">mail</span>
                  <span>Send Direct Email</span>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-outline-variant flex justify-end gap-3">
              <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-outline-variant hover:bg-surface">
                Cancel
              </button>
              <button type="submit" className="px-6 py-2.5 rounded-xl text-xs font-bold bg-secondary text-white shadow-md hover:bg-secondary/90 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">send</span>
                Send Inquiry
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
