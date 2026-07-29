import React, { useState } from 'react';

export interface PoliceOfficer {
  id: string;
  serviceNo: string;
  name: string;
  rank: 'CP' | 'DCP' | 'ACP' | 'CSP' | 'SP' | 'DSP' | 'ASP_I' | 'ASP_II' | 'INSPR' | 'SGT' | 'CPL' | 'PC';
  role: string;
  command: string;
  state: string;
  zone: string;
  formation: string;
  unit: string;
  location: string;
  specialisation: string;
  status: 'ACTIVE_READY' | 'FIELD_DEPLOYED' | 'ON_ESCORT' | 'ON_LEAVE' | 'MEDICAL_HOLD';
  appointmentDate: string;
  lastPromotionDate: string;
  phone: string;
  email: string;
  photo: string;
  promotions: { date: string; fromRank: string; toRank: string; gazette: string }[];
  postings: { date: string; command: string; location: string }[];
  qualifications: string[];
}

const RANK_HIERARCHY: Record<string, number> = {
  'CP': 1, 'DCP': 2, 'ACP': 3,
  'CSP': 4, 'SP': 5, 'DSP': 6,
  'ASP_I': 7, 'ASP_II': 8,
  'INSPR': 9,
  'SGT': 10, 'CPL': 11, 'PC': 12
};

export function deriveCategory(rank: string): string {
  if (['CP', 'DCP', 'ACP'].includes(rank)) return 'ACP-CP';
  if (['CSP', 'SP', 'DSP'].includes(rank)) return 'DSP-CSP';
  if (['ASP_I', 'ASP_II', 'ASP'].includes(rank)) return 'ASP';
  if (rank === 'INSPR') return 'INSPECTORS';
  return 'PC-SGT';
}

const INITIAL_OFFICERS: PoliceOfficer[] = [
  {
    id: 'POL-001',
    serviceNo: 'AP/45120',
    name: 'CP Babatunde Olarinde',
    rank: 'CP',
    role: 'Commissioner of Police, EOD-CBRN Command',
    command: 'Force HQ EOD-CBRN Command',
    state: 'FCT Abuja',
    zone: 'Zone 7 Abuja',
    formation: 'Force Headquarters',
    unit: 'Command HQ',
    location: 'Louis Edet House, Abuja',
    specialisation: 'National Strategic EOD Command & Arms Control',
    status: 'ACTIVE_READY',
    appointmentDate: '1998-03-15',
    lastPromotionDate: '2024-01-10',
    phone: '+234 803 000 1122',
    email: 'babatunde.olarinde@npf.gov.ng',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    promotions: [
      { date: '2024-01-10', fromRank: 'DCP', toRank: 'CP', gazette: 'PSC/SP/2024/01' },
      { date: '2019-06-20', fromRank: 'ACP', toRank: 'DCP', gazette: 'PSC/SP/2019/04' }
    ],
    postings: [
      { date: '2024-01-15', command: 'Force HQ EOD Command', location: 'Abuja' }
    ],
    qualifications: ['M.Sc Security Studies', 'NATO Master EOD Certificate', 'Interpol Counter-Terrorism Diploma']
  },
  {
    id: 'POL-002',
    serviceNo: 'AP/52918',
    name: 'DCP Amina Bello',
    rank: 'DCP',
    role: 'Director, National CBRN Emergency Centre',
    command: 'National CBRN Emergency Response Centre',
    state: 'FCT Abuja',
    zone: 'Zone 7 Abuja',
    formation: 'CBRN Centre of Excellence',
    unit: 'Bio-Hazard Response',
    location: 'Guzape Complex, Abuja',
    specialisation: 'Bio-Chemical Mitigation & Radiological Safety',
    status: 'ACTIVE_READY',
    appointmentDate: '2002-09-01',
    lastPromotionDate: '2023-11-15',
    phone: '+234 802 111 2233',
    email: 'amina.bello@npf.gov.ng',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    promotions: [
      { date: '2023-11-15', fromRank: 'ACP', toRank: 'DCP', gazette: 'PSC/SP/2023/88' }
    ],
    postings: [
      { date: '2023-11-20', command: 'National CBRN Centre', location: 'Abuja' }
    ],
    qualifications: ['B.Sc Chemistry (Unilag)', 'IAEA Nuclear Safety Cert']
  },
  {
    id: 'POL-003',
    serviceNo: 'AP/61029',
    name: 'ACP Kemi Adebayo',
    rank: 'ACP',
    role: 'Commander, Aviation Security EOD Unit',
    command: 'Murtala Muhammed Airport EOD Unit',
    state: 'Lagos',
    zone: 'Zone 2 Lagos',
    formation: 'Aviation Police Command',
    unit: 'Airport EOD Detachment',
    location: 'MMIA Ikeja, Lagos',
    specialisation: 'Aviation Cargo Diagnostics & Aircraft EOD',
    status: 'ACTIVE_READY',
    appointmentDate: '2005-04-12',
    lastPromotionDate: '2022-08-01',
    phone: '+234 802 333 4455',
    email: 'kemi.adebayo@npf.gov.ng',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    promotions: [
      { date: '2022-08-01', fromRank: 'CSP', toRank: 'ACP', gazette: 'PSC/SP/2022/14' }
    ],
    postings: [
      { date: '2022-08-10', command: 'MMIA Airport EOD Unit', location: 'Lagos' }
    ],
    qualifications: ['ICAO Aviation Security Master', 'EOD Level 3 Tech']
  },
  {
    id: 'POL-006',
    serviceNo: 'AP/78412',
    name: 'CSP Desmond Agbala',
    rank: 'CSP',
    role: 'Commander, Apapa Sea Port EOD Unit',
    command: 'Apapa Sea Port EOD Unit',
    state: 'Lagos',
    zone: 'Zone 2 Lagos',
    formation: 'Seaport Police Command',
    unit: 'EOD Maritime Detachment',
    location: 'Apapa Port Complex, Lagos',
    specialisation: 'Commercial Explosives Escort, Maritime EOD & Post-Blast Forensics',
    status: 'ACTIVE_READY',
    appointmentDate: '2006-02-18',
    lastPromotionDate: '2023-04-10',
    phone: '+234 803 456 7890',
    email: 'desmond.agbala@npf.gov.ng',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    promotions: [
      { date: '2023-04-10', fromRank: 'SP', toRank: 'CSP', gazette: 'PSC/SP/2023/12' }
    ],
    postings: [
      { date: '2021-01-10', command: 'Apapa Sea Port EOD Unit', location: 'Lagos' }
    ],
    qualifications: ['B.Sc Criminology', 'UK Defence EOD Master Tech', 'Post-Blast Investigator']
  },
  {
    id: 'POL-007',
    serviceNo: 'AP/79104',
    name: 'CSP Chukwudi Nnamdi',
    rank: 'CSP',
    role: 'Base Commander, Zone 13 Command',
    command: 'Zone 13 Command EOD Base',
    state: 'Anambra',
    zone: 'Zone 13 Awka',
    formation: 'Zonal Command HQ',
    unit: 'Counter-IED Squad',
    location: 'Ukpo / Awka, Anambra',
    specialisation: 'Field Demolition & High-Threat IED Clearance',
    status: 'ACTIVE_READY',
    appointmentDate: '2007-06-20',
    lastPromotionDate: '2024-02-01',
    phone: '+234 803 222 1100',
    email: 'chukwudi.nnamdi@npf.gov.ng',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    promotions: [
      { date: '2024-02-01', fromRank: 'SP', toRank: 'CSP', gazette: 'PSC/SP/2024/05' }
    ],
    postings: [
      { date: '2024-02-05', command: 'Zone 13 EOD Base', location: 'Anambra' }
    ],
    qualifications: ['B.Eng Electrical', 'IEDD Threat Master']
  },
  {
    id: 'POL-008',
    serviceNo: 'AP/90214',
    name: 'SP Michael Oladipo',
    rank: 'SP',
    role: 'Commander, Tin Can Island Port Unit',
    command: 'Tin Can Island Port EOD Unit',
    state: 'Lagos',
    zone: 'Zone 2 Lagos',
    formation: 'Seaport Police Command',
    unit: 'Container Diagnostics',
    location: 'Tin Can Port, Lagos',
    specialisation: 'Port Container Scanning & Explosives Escort',
    status: 'ACTIVE_READY',
    appointmentDate: '2009-10-10',
    lastPromotionDate: '2022-12-15',
    phone: '+234 803 999 8877',
    email: 'michael.oladipo@npf.gov.ng',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    promotions: [
      { date: '2022-12-15', fromRank: 'DSP', toRank: 'SP', gazette: 'PSC/SP/2022/99' }
    ],
    postings: [
      { date: '2022-12-20', command: 'Tin Can Port Unit', location: 'Lagos' }
    ],
    qualifications: ['Port Cargo Security Specialist']
  },
  {
    id: 'POL-012',
    serviceNo: 'AP/110293',
    name: 'ASP I Adebayo Williams',
    rank: 'ASP_I',
    role: 'Commercial Escort Officer',
    command: 'Apapa Sea Port EOD Unit',
    state: 'Lagos',
    zone: 'Zone 2 Lagos',
    formation: 'Seaport Police Command',
    unit: 'Explosives Transit Escort',
    location: 'Apapa Port Complex, Lagos',
    specialisation: 'High-Risk Explosives Transit Escort',
    status: 'ON_ESCORT',
    appointmentDate: '2014-05-01',
    lastPromotionDate: '2023-01-10',
    phone: '+234 805 123 9988',
    email: 'adebayo.williams@npf.gov.ng',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    promotions: [],
    postings: [{ date: '2023-01-15', command: 'Apapa Sea Port EOD Unit', location: 'Lagos' }],
    qualifications: ['UGV Robotics Level 2']
  },
  {
    id: 'POL-018',
    serviceNo: 'F/410982',
    name: 'Inspr Chidi Okonkwo',
    rank: 'INSPR',
    role: 'Explosives Escort Inspector',
    command: 'Apapa Sea Port EOD Unit',
    state: 'Lagos',
    zone: 'Zone 2 Lagos',
    formation: 'Seaport Police Command',
    unit: 'Highway Security',
    location: 'Apapa Port Complex, Lagos',
    specialisation: 'Commercial Explosives Escort & Magazine Audit',
    status: 'ON_ESCORT',
    appointmentDate: '2015-08-14',
    lastPromotionDate: '2021-06-01',
    phone: '+234 805 999 1122',
    email: 'chidi.okonkwo@npf.gov.ng',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    promotions: [],
    postings: [{ date: '2021-06-10', command: 'Apapa Sea Port Unit', location: 'Lagos' }],
    qualifications: ['Explosives Vault Custodian']
  },
  {
    id: 'POL-024',
    serviceNo: 'F/458901',
    name: 'Sgt Haruna Garba',
    rank: 'SGT',
    role: 'UGV Robotics Operator',
    command: 'Maiduguri Counter-IED Theatre',
    state: 'Borno',
    zone: 'Zone 15 Maiduguri',
    formation: 'Tactical Counter-IED Command',
    unit: 'Bomb Robotics Squad',
    location: 'Maiduguri HQ, Borno',
    specialisation: 'Remote UGV Robot Manipulation & Cannon Firing',
    status: 'FIELD_DEPLOYED',
    appointmentDate: '2018-02-10',
    lastPromotionDate: '2022-04-15',
    phone: '+234 806 111 2233',
    email: 'haruna.garba@npf.gov.ng',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    promotions: [],
    postings: [{ date: '2022-04-20', command: 'Maiduguri Counter-IED Theatre', location: 'Borno' }],
    qualifications: ['UGV Operator Cert']
  },
  {
    id: 'POL-025',
    serviceNo: 'F/478902',
    name: 'Cpl Emeka Nwosu',
    rank: 'CPL',
    role: 'EOD Bomb Suit Technician',
    command: 'Force HQ EOD Command',
    state: 'FCT Abuja',
    zone: 'Zone 7 Abuja',
    formation: 'Force Headquarters',
    unit: 'EOD Response Unit',
    location: 'Louis Edet House, Abuja',
    specialisation: 'Manual Bomb Suit Approach & Recon',
    status: 'ACTIVE_READY',
    appointmentDate: '2020-01-15',
    lastPromotionDate: '2023-09-01',
    phone: '+234 803 777 5544',
    email: 'emeka.nwosu@npf.gov.ng',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    promotions: [],
    postings: [{ date: '2023-09-05', command: 'Force HQ EOD Command', location: 'Abuja' }],
    qualifications: ['Bomb Suit Cert']
  },
  {
    id: 'POL-026',
    serviceNo: 'F/510293',
    name: 'PC Musa Ibrahim',
    rank: 'PC',
    role: 'Perimeter Security Constable',
    command: 'Apapa Sea Port EOD Unit',
    state: 'Lagos',
    zone: 'Zone 2 Lagos',
    formation: 'Seaport Police Command',
    unit: 'Port Gate Patrol',
    location: 'Apapa Port Complex, Lagos',
    specialisation: 'Port Gate Access Control & Explosives Sniffing K9 Lead',
    status: 'ACTIVE_READY',
    appointmentDate: '2023-03-01',
    lastPromotionDate: '2023-03-01',
    phone: '+234 809 111 8899',
    email: 'musa.ibrahim@npf.gov.ng',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    promotions: [],
    postings: [{ date: '2023-03-05', command: 'Apapa Sea Port EOD Unit', location: 'Lagos' }],
    qualifications: ['K9 Handler Cert']
  }
];

export const PoliceMasterRoll: React.FC = () => {
  const [officers] = useState<PoliceOfficer[]>(INITIAL_OFFICERS);
  const [currentTab, setCurrentTab] = useState<string>('MASTER_ROLL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [rankFilter, setRankFilter] = useState<string>('ALL');
  const [zoneFilter, setZoneFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('SENIORITY');
  const [selectedOfficer, setSelectedOfficer] = useState<PoliceOfficer | null>(null);

  // Dynamic Metrics Calculation
  const totalCount = officers.length;
  const acpCpCount = officers.filter(o => deriveCategory(o.rank) === 'ACP-CP').length;
  const dspCspCount = officers.filter(o => deriveCategory(o.rank) === 'DSP-CSP').length;
  const aspCount = officers.filter(o => deriveCategory(o.rank) === 'ASP').length;
  const insprCount = officers.filter(o => o.rank === 'INSPR').length;
  const sgtCount = officers.filter(o => o.rank === 'SGT').length;
  const cplCount = officers.filter(o => o.rank === 'CPL').length;
  const pcCount = officers.filter(o => o.rank === 'PC').length;
  const uniqueCommands = new Set(officers.map(o => o.command)).size;
  const uniqueZones = new Set(officers.map(o => o.zone)).size;
  const uniqueFormations = new Set(officers.map(o => o.formation)).size;

  // Filtered List
  const filtered = officers.filter(off => {
    const cat = deriveCategory(off.rank);
    const matchTab =
      currentTab === 'MASTER_ROLL' ||
      (currentTab === 'ACP-CP' && cat === 'ACP-CP') ||
      (currentTab === 'DSP-CSP' && cat === 'DSP-CSP') ||
      (currentTab === 'ASP' && cat === 'ASP') ||
      (currentTab === 'INSPECTORS' && off.rank === 'INSPR') ||
      (currentTab === 'PC-SGT' && ['SGT', 'CPL', 'PC'].includes(off.rank));

    const matchRank = rankFilter === 'ALL' || off.rank === rankFilter;
    const matchZone = zoneFilter === 'ALL' || off.zone === zoneFilter;
    const matchStatus = statusFilter === 'ALL' || off.status === statusFilter;

    const q = searchQuery.toLowerCase();
    const matchSearch =
      off.name.toLowerCase().includes(q) ||
      off.serviceNo.toLowerCase().includes(q) ||
      off.command.toLowerCase().includes(q) ||
      off.unit.toLowerCase().includes(q) ||
      off.zone.toLowerCase().includes(q) ||
      off.location.toLowerCase().includes(q);

    return matchTab && matchRank && matchZone && matchStatus && matchSearch;
  });

  // Sort
  filtered.sort((a, b) => {
    if (sortBy === 'SENIORITY') return (RANK_HIERARCHY[a.rank] || 99) - (RANK_HIERARCHY[b.rank] || 99);
    if (sortBy === 'NAME_ASC') return a.name.localeCompare(b.name);
    if (sortBy === 'NAME_DESC') return b.name.localeCompare(a.name);
    if (sortBy === 'APPOINTMENT_DATE') return new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime();
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 p-4 md:p-6 space-y-6 font-sans">
      
      {/* Top Title Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-black tracking-widest uppercase">
            <span>🇳🇬 NIGERIA POLICE FORCE MASTER ROLL MODULE</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-white uppercase mt-1">
            AUTHORISED PERSONNEL & COMMAND DIRECTORY
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete dynamic database of police personnel across all 17 Zonal Commands, Seaports, Airports, and Counter-IED Frontlines.
          </p>
        </div>

        <button onClick={() => window.print()} className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2 rounded-lg border border-slate-700 flex items-center gap-2">
          <span>🖨️ PRINT DIRECTORY</span>
        </button>
      </div>

      {/* Dynamic Summary Cards Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-11 gap-2 text-xs">
        <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
          <span className="text-[9px] text-slate-400 font-bold uppercase block">TOTAL OFFICERS</span>
          <span className="text-xl font-black text-white font-mono">{totalCount}</span>
        </div>
        <div className="bg-slate-900 border border-amber-500/30 p-2.5 rounded-xl">
          <span className="text-[9px] text-amber-400 font-bold uppercase block">STRATEGIC COMMAND</span>
          <span className="text-xl font-black text-amber-400 font-mono">{acpCpCount}</span>
        </div>
        <div className="bg-slate-900 border border-sky-500/30 p-2.5 rounded-xl">
          <span className="text-[9px] text-sky-400 font-bold uppercase block">SENIOR OFFICERS</span>
          <span className="text-xl font-black text-sky-400 font-mono">{dspCspCount}</span>
        </div>
        <div className="bg-slate-900 border border-emerald-500/30 p-2.5 rounded-xl">
          <span className="text-[9px] text-emerald-400 font-bold uppercase block">ASSISTANT SUPTS</span>
          <span className="text-xl font-black text-emerald-400 font-mono">{aspCount}</span>
        </div>
        <div className="bg-slate-900 border border-purple-500/30 p-2.5 rounded-xl">
          <span className="text-[9px] text-purple-400 font-bold uppercase block">INSPECTORS</span>
          <span className="text-xl font-black text-purple-400 font-mono">{insprCount}</span>
        </div>
        <div className="bg-slate-900 border border-indigo-500/30 p-2.5 rounded-xl">
          <span className="text-[9px] text-indigo-400 font-bold uppercase block">SERGEANTS</span>
          <span className="text-xl font-black text-indigo-400 font-mono">{sgtCount}</span>
        </div>
        <div className="bg-slate-900 border border-indigo-500/30 p-2.5 rounded-xl">
          <span className="text-[9px] text-indigo-400 font-bold uppercase block">CORPORALS</span>
          <span className="text-xl font-black text-indigo-300 font-mono">{cplCount}</span>
        </div>
        <div className="bg-slate-900 border border-indigo-500/30 p-2.5 rounded-xl">
          <span className="text-[9px] text-indigo-400 font-bold uppercase block">CONSTABLES</span>
          <span className="text-xl font-black text-indigo-200 font-mono">{pcCount}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
          <span className="text-[9px] text-slate-400 font-bold uppercase block">COMMANDS</span>
          <span className="text-xl font-black text-teal-400 font-mono">{uniqueCommands}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
          <span className="text-[9px] text-slate-400 font-bold uppercase block">ZONES</span>
          <span className="text-xl font-black text-teal-400 font-mono">{uniqueZones}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
          <span className="text-[9px] text-slate-400 font-bold uppercase block">FORMATIONS</span>
          <span className="text-xl font-black text-teal-400 font-mono">{uniqueFormations}</span>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto text-xs pb-1 border-b border-slate-800">
        {[
          { id: 'MASTER_ROLL', label: '1. MASTER ROLL' },
          { id: 'ACP-CP', label: '2. 👑 STRATEGIC COMMAND' },
          { id: 'DSP-CSP', label: '3. 🎖️ SENIOR OFFICERS' },
          { id: 'ASP', label: '4. 🎗️ ASSISTANT SUPTS' },
          { id: 'INSPECTORS', label: '5. 🔍 INSPECTORATE' },
          { id: 'PC-SGT', label: '6. 🛡️ RANK & FILE' },
          { id: 'BASES', label: '7. 🏰 ALL NIGERIAN BASES' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setCurrentTab(t.id)}
            className={`px-3.5 py-2 rounded-lg font-black transition whitespace-nowrap border ${
              currentTab === t.id
                ? 'bg-emerald-600 text-black border-emerald-500 shadow-lg'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {currentTab !== 'BASES' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <div>
            <label className="text-[10px] text-emerald-400 font-black block mb-1 uppercase">GLOBAL PROMINENT SEARCH BAR:</label>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search officer name, service number, command, unit, zone or location..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-xs">
            <div>
              <label className="text-[9px] text-slate-400 block mb-1 font-bold">RANK:</label>
              <select value={rankFilter} onChange={e => setRankFilter(e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-white rounded px-2 py-1 font-mono">
                <option value="ALL">ALL RANKS</option>
                <option value="CP">CP</option>
                <option value="DCP">DCP</option>
                <option value="ACP">ACP</option>
                <option value="CSP">CSP</option>
                <option value="SP">SP</option>
                <option value="DSP">DSP</option>
                <option value="ASP_I">ASP I</option>
                <option value="ASP_II">ASP II</option>
                <option value="INSPR">INSPR</option>
                <option value="SGT">SGT</option>
                <option value="CPL">CPL</option>
                <option value="PC">PC</option>
              </select>
            </div>

            <div>
              <label className="text-[9px] text-slate-400 block mb-1 font-bold">ZONE:</label>
              <select value={zoneFilter} onChange={e => setZoneFilter(e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-white rounded px-2 py-1">
                <option value="ALL">ALL ZONES</option>
                <option value="Zone 1 Kano">Zone 1 (Kano)</option>
                <option value="Zone 2 Lagos">Zone 2 (Lagos)</option>
                <option value="Zone 7 Abuja">Zone 7 (Abuja)</option>
                <option value="Zone 13 Awka">Zone 13 (Awka)</option>
                <option value="Zone 15 Maiduguri">Zone 15 (Maiduguri)</option>
              </select>
            </div>

            <div>
              <label className="text-[9px] text-slate-400 block mb-1 font-bold">STATUS:</label>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-white rounded px-2 py-1">
                <option value="ALL">ALL STATUSES</option>
                <option value="ACTIVE_READY">ACTIVE & READY</option>
                <option value="FIELD_DEPLOYED">FIELD DEPLOYED</option>
                <option value="ON_ESCORT">ON ESCORT</option>
              </select>
            </div>

            <div>
              <label className="text-[9px] text-slate-400 block mb-1 font-bold">SORT BY:</label>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-white rounded px-2 py-1">
                <option value="SENIORITY">SENIORITY (RANK HIERARCHY)</option>
                <option value="NAME_ASC">ALPHABETICAL (A-Z)</option>
                <option value="APPOINTMENT_DATE">APPOINTMENT DATE</option>
              </select>
            </div>

            <div className="flex items-end">
              <button onClick={() => { setSearchQuery(''); setRankFilter('ALL'); setZoneFilter('ALL'); setStatusFilter('ALL'); setSortBy('SENIORITY'); }} className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-1 rounded text-xs">
                RESET FILTERS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Master Roll Table */}
      {currentTab !== 'BASES' ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] border-b border-slate-800 font-mono">
                <tr>
                  <th className="p-3.5 w-12 text-center">S/N</th>
                  <th className="p-3.5">Photo & Officer Name</th>
                  <th className="p-3.5">Service No</th>
                  <th className="p-3.5">Rank & Tier</th>
                  <th className="p-3.5">Command & Formation</th>
                  <th className="p-3.5">Duty Location</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono">
                {filtered.map((off, idx) => (
                  <tr key={off.id} className="hover:bg-slate-800/50 transition">
                    <td className="p-3.5 text-center text-slate-500 font-bold">{idx + 1}</td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img src={off.photo} alt={off.name} className="w-9 h-9 rounded-full object-cover border border-slate-700" />
                        <div>
                          <div className="font-extrabold text-white text-xs font-sans">{off.name}</div>
                          <div className="text-[10px] text-slate-400 font-sans">{off.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 font-bold text-sky-400">{off.serviceNo}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        {off.rank} ({deriveCategory(off.rank)})
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-emerald-400 text-xs font-sans">{off.command}</div>
                      <div className="text-[9px] text-slate-400 font-sans">{off.formation}</div>
                    </td>
                    <td className="p-3.5 text-slate-300 font-sans">{off.location}</td>
                    <td className="p-3.5">
                      <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded text-[9px] font-bold">
                        {off.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button onClick={() => setSelectedOfficer(off)} className="bg-slate-800 hover:bg-slate-700 text-sky-400 px-3 py-1 rounded text-[11px] font-extrabold border border-slate-700">
                        VIEW PROFILE
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <h3 className="text-sm font-bold text-emerald-400">17 ZONAL COMMAND HEADQUARTERS</h3>
            <p className="text-xs text-slate-400">Zones 1 to 17 covering Kano, Lagos, Calabar, Abuja, Awka, Maiduguri, etc.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <h3 className="text-sm font-bold text-sky-400">SEAPORT & AVIATION FORMATIONS</h3>
            <p className="text-xs text-slate-400">Apapa Sea Port, Tin Can Island Port, Onne Deep Sea Port, MMIA Lagos, NAIA Abuja.</p>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {selectedOfficer && (
        <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white">{selectedOfficer.name} ({selectedOfficer.serviceNo})</h3>
              <button onClick={() => setSelectedOfficer(null)} className="bg-emerald-600 hover:bg-emerald-500 text-black font-extrabold px-3 py-1 rounded text-xs">
                BACK TO MASTER ROLL
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div><span className="text-slate-400">Rank:</span> <span className="font-bold text-white">{selectedOfficer.rank}</span></div>
              <div><span className="text-slate-400">Command:</span> <span className="font-bold text-emerald-400">{selectedOfficer.command}</span></div>
              <div><span className="text-slate-400">Duty Location:</span> <span className="font-bold text-sky-400">{selectedOfficer.location}</span></div>
              <div><span className="text-slate-400">Specialisation:</span> <span className="font-bold text-amber-400">{selectedOfficer.specialisation}</span></div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button onClick={() => setSelectedOfficer(null)} className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2 rounded text-xs">
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
