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

export interface AuditLog {
  timestamp: string;
  admin: string;
  action: string;
  officer: string;
  prevValue: string;
  newValue: string;
  reason: string;
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
  // STRATEGIC COMMAND (ACP - CP)
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

  // SENIOR OFFICERS (DSP - CSP)
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
      { date: '2023-04-10', fromRank: 'SP', toRank: 'CSP', gazette: 'PSC/SP/2023/12' },
      { date: '2018-03-01', fromRank: 'DSP', toRank: 'SP', gazette: 'PSC/SP/2018/09' }
    ],
    postings: [
      { date: '2021-01-10', command: 'Apapa Sea Port EOD Unit', location: 'Lagos' },
      { date: '2016-05-12', command: 'Force HQ EOD Armory', location: 'Abuja' }
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

  // ASSISTANT SUPERINTENDENTS (ASP)
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

  // INSPECTORATE (INSPECTORS)
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

  // RANK & FILE (PC - SGT)
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

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    timestamp: '2026-07-29 14:10:22',
    admin: 'Super Admin (AP/45120)',
    action: 'PROMOTION',
    officer: 'CSP Desmond Agbala (AP/78412)',
    prevValue: 'Rank: SP',
    newValue: 'Rank: CSP (Automated Transfer to Senior Officers)',
    reason: 'Police Service Commission Special Promotion 2026'
  },
  {
    timestamp: '2026-07-29 12:45:00',
    admin: 'Personnel Admin (AP/52918)',
    action: 'TRANSFER',
    officer: 'Sgt Haruna Garba (F/458901)',
    prevValue: 'Location: Zone 1 Kano',
    newValue: 'Location: Maiduguri Counter-IED Theatre (Borno)',
    reason: 'IGP Counter-IED Deployment Signal #402'
  }
];

export const PoliceMasterRoll: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('MASTER_ROLL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [rankFilter, setRankFilter] = useState<string>('ALL');
  const [zoneFilter, setZoneFilter] = useState<string>('ALL');
  const [stateFilter, setStateFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('SENIORITY');
  const [rbacRole, setRbacRole] = useState<string>('SUPER_ADMIN');

  const [officers, setOfficers] = useState<PoliceOfficer[]>(INITIAL_OFFICERS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [selectedOfficer, setSelectedOfficer] = useState<PoliceOfficer | null>(null);
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState<boolean>(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState<boolean>(false);
  const [targetOfficerId, setTargetOfficerId] = useState<string>('');
  
  // Form inputs
  const [promoteNewRank, setPromoteNewRank] = useState<string>('CSP');
  const [promoteReason, setPromoteReason] = useState<string>('');
  const [transferPosting, setTransferPosting] = useState<string>('Apapa Sea Port EOD Unit|Lagos|Zone 2 Lagos|South West|Seaport Formation|Apapa Port Complex');
  const [transferReason, setTransferReason] = useState<string>('');

  // 11 Dynamic Summary Metrics Calculations (NO HARDCODING RULE)
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

  // Filtered Nominal Roll
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
    const matchState = stateFilter === 'ALL' || off.state === stateFilter;
    const matchStatus = statusFilter === 'ALL' || off.status === statusFilter;

    const q = searchQuery.toLowerCase();
    const matchSearch =
      off.name.toLowerCase().includes(q) ||
      off.serviceNo.toLowerCase().includes(q) ||
      off.command.toLowerCase().includes(q) ||
      off.unit.toLowerCase().includes(q) ||
      off.zone.toLowerCase().includes(q) ||
      off.location.toLowerCase().includes(q);

    return matchTab && matchRank && matchZone && matchState && matchStatus && matchSearch;
  });

  // Sort Logic (Seniority Hierarchy Order vs Alphabetical vs Date)
  filtered.sort((a, b) => {
    if (sortBy === 'SENIORITY') return (RANK_HIERARCHY[a.rank] || 99) - (RANK_HIERARCHY[b.rank] || 99);
    if (sortBy === 'NAME_ASC') return a.name.localeCompare(b.name);
    if (sortBy === 'NAME_DESC') return b.name.localeCompare(a.name);
    if (sortBy === 'APPOINTMENT_DATE') return new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime();
    return 0;
  });

  // Promotion Handler
  const handlePromoteConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const target = officers.find(o => o.id === targetOfficerId);
    if (!target) return;

    const oldRank = target.rank;
    const oldCat = deriveCategory(oldRank);
    const newCat = deriveCategory(promoteNewRank);
    const today = new Date().toISOString().split('T')[0];

    const updated = officers.map(o => {
      if (o.id === targetOfficerId) {
        return {
          ...o,
          rank: promoteNewRank as any,
          lastPromotionDate: today,
          promotions: [
            { date: today, fromRank: oldRank, toRank: promoteNewRank, gazette: promoteReason || 'PSC Special Promotion 2026' },
            ...(o.promotions || [])
          ]
        };
      }
      return o;
    });

    setOfficers(updated);
    const newLog: AuditLog = {
      timestamp: new Date().toLocaleString(),
      admin: `${rbacRole} Admin`,
      action: 'PROMOTION',
      officer: `${target.name} (${target.serviceNo})`,
      prevValue: `Rank: ${oldRank} (${oldCat})`,
      newValue: `Rank: ${promoteNewRank} (${newCat})`,
      reason: promoteReason || 'Police Service Commission Special Promotion 2026'
    };
    setAuditLogs([newLog, ...auditLogs]);

    setIsPromoteModalOpen(false);
    setSelectedOfficer(updated.find(o => o.id === targetOfficerId) || null);
    alert(`Officer ${target.name} promoted from ${oldRank} to ${promoteNewRank}! Automatically assigned to category tier ${newCat}.`);
  };

  // Transfer Handler
  const handleTransferConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const target = officers.find(o => o.id === targetOfficerId);
    if (!target) return;

    const [command, state, zone, region, formation, location] = transferPosting.split('|');
    const today = new Date().toISOString().split('T')[0];
    const prevLocation = `${target.command} (${target.state})`;

    const updated = officers.map(o => {
      if (o.id === targetOfficerId) {
        return {
          ...o,
          command, state, zone, formation, location,
          postings: [
            { date: today, command, location },
            ...(o.postings || [])
          ]
        };
      }
      return o;
    });

    setOfficers(updated);
    const newLog: AuditLog = {
      timestamp: new Date().toLocaleString(),
      admin: `${rbacRole} Admin`,
      action: 'TRANSFER',
      officer: `${target.name} (${target.serviceNo})`,
      prevValue: prevLocation,
      newValue: `${command} (${state})`,
      reason: transferReason || 'Inspector-General Transfer Signal #2026'
    };
    setAuditLogs([newLog, ...auditLogs]);

    setIsTransferModalOpen(false);
    setSelectedOfficer(updated.find(o => o.id === targetOfficerId) || null);
    alert(`Officer ${target.name} transferred to ${command} (${state})! Past posting history retained.`);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 p-4 md:p-6 space-y-6 font-sans antialiased selection:bg-emerald-600 selection:text-white">
      
      {/* 1. TOP MODULE HEADER BAR WITH RBAC */}
      <header className="bg-slate-900 border border-slate-800 p-4 md:p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            🇳🇬
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-black text-white uppercase tracking-wider">
                NIGERIA POLICE FORCE
              </h1>
              <span className="bg-emerald-600 text-black text-[10px] font-black px-2.5 py-0.5 rounded font-mono uppercase">
                MASTER ROLL & DIRECTORY
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">AUTHORISED POLICE PERSONNEL & COMMAND STRUCTURE DATABASE</p>
          </div>
        </div>

        {/* RBAC Control & Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg">
            <span className="text-[10px] text-slate-400 font-bold uppercase">ROLE:</span>
            <select
              value={rbacRole}
              onChange={e => setRbacRole(e.target.value)}
              className="bg-transparent text-emerald-400 font-black text-xs focus:outline-none cursor-pointer"
            >
              <option value="SUPER_ADMIN">SUPER ADMINISTRATOR</option>
              <option value="PERSONNEL_ADMIN">PERSONNEL ADMINISTRATOR</option>
              <option value="COMMAND_ADMIN">COMMAND ADMINISTRATOR</option>
              <option value="SENIOR_MGMT">SENIOR MANAGEMENT VIEWER</option>
              <option value="OFFICER">OFFICER</option>
              <option value="READ_ONLY">READ-ONLY USER</option>
            </select>
          </div>

          {['SUPER_ADMIN', 'PERSONNEL_ADMIN'].includes(rbacRole) && (
            <button onClick={() => setIsAddModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-500 text-black font-black px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 shadow-lg">
              <span>➕ ADD OFFICER</span>
            </button>
          )}

          <button onClick={() => window.print()} className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-3 py-2 rounded-lg border border-slate-700 transition flex items-center gap-1.5">
            <span>🖨️ PRINT</span>
          </button>
        </div>
      </header>

      {/* 2. DYNAMIC DASHBOARD SUMMARY CARDS (DYNAMICALLY CALCULATED FROM DATABASE) */}
      <section className="bg-slate-950 border border-slate-800 p-4 rounded-2xl shadow-xl space-y-2">
        <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
          <span>⚡ NATIONAL COMMAND & PERSONNEL METRICS (DYNAMIC REAL-TIME DATABASE CALCULATIONS)</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-11 gap-2 text-xs">
          <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl flex flex-col justify-between">
            <span className="text-[9px] text-slate-400 font-bold uppercase">TOTAL PERSONNEL</span>
            <span className="text-xl font-black text-white font-mono mt-1">{totalCount}</span>
          </div>

          <div className="bg-slate-900 border border-amber-500/30 p-2.5 rounded-xl flex flex-col justify-between">
            <span className="text-[9px] text-amber-400 font-bold uppercase">STRATEGIC COMMAND</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl font-black text-amber-400 font-mono">{acpCpCount}</span>
              <span className="text-[8px] text-slate-500 font-mono">CP/DCP/ACP</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-sky-500/30 p-2.5 rounded-xl flex flex-col justify-between">
            <span className="text-[9px] text-sky-400 font-bold uppercase">SENIOR OFFICERS</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl font-black text-sky-400 font-mono">{dspCspCount}</span>
              <span className="text-[8px] text-slate-500 font-mono">CSP/SP/DSP</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-emerald-500/30 p-2.5 rounded-xl flex flex-col justify-between">
            <span className="text-[9px] text-emerald-400 font-bold uppercase">ASSISTANT SUPTS</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl font-black text-emerald-400 font-mono">{aspCount}</span>
              <span className="text-[8px] text-slate-500 font-mono">ASP I & II</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-purple-500/30 p-2.5 rounded-xl flex flex-col justify-between">
            <span className="text-[9px] text-purple-400 font-bold uppercase">INSPECTORS</span>
            <span className="text-xl font-black text-purple-400 font-mono mt-1">{insprCount}</span>
          </div>

          <div className="bg-slate-900 border border-indigo-500/30 p-2.5 rounded-xl flex flex-col justify-between">
            <span className="text-[9px] text-indigo-400 font-bold uppercase">SERGEANTS</span>
            <span className="text-xl font-black text-indigo-400 font-mono mt-1">{sgtCount}</span>
          </div>

          <div className="bg-slate-900 border border-indigo-500/30 p-2.5 rounded-xl flex flex-col justify-between">
            <span className="text-[9px] text-indigo-400 font-bold uppercase">CORPORALS</span>
            <span className="text-xl font-black text-indigo-300 font-mono mt-1">{cplCount}</span>
          </div>

          <div className="bg-slate-900 border border-indigo-500/30 p-2.5 rounded-xl flex flex-col justify-between">
            <span className="text-[9px] text-indigo-400 font-bold uppercase">CONSTABLES</span>
            <span className="text-xl font-black text-indigo-200 font-mono mt-1">{pcCount}</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl flex flex-col justify-between">
            <span className="text-[9px] text-slate-400 font-bold uppercase">COMMANDS</span>
            <span className="text-xl font-black text-teal-400 font-mono mt-1">{uniqueCommands}</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl flex flex-col justify-between">
            <span className="text-[9px] text-slate-400 font-bold uppercase">ZONES</span>
            <span className="text-xl font-black text-teal-400 font-mono mt-1">{uniqueZones}</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl flex flex-col justify-between">
            <span className="text-[9px] text-slate-400 font-bold uppercase">FORMATIONS</span>
            <span className="text-xl font-black text-teal-400 font-mono mt-1">{uniqueFormations}</span>
          </div>
        </div>
      </section>

      {/* 3. MAIN NAVIGATION TABS FOR MODULE */}
      <nav className="flex gap-2 overflow-x-auto text-xs pb-1 border-b border-slate-800">
        {[
          { id: 'MASTER_ROLL', label: '1. MASTER ROLL' },
          { id: 'ACP-CP', label: '2. 👑 STRATEGIC COMMAND' },
          { id: 'DSP-CSP', label: '3. 🎖️ SENIOR OFFICERS' },
          { id: 'ASP', label: '4. 🎗️ ASSISTANT SUPTS' },
          { id: 'INSPECTORS', label: '5. 🔍 INSPECTORATE' },
          { id: 'PC-SGT', label: '6. 🛡️ RANK & FILE' },
          { id: 'BASES', label: '7. 🏰 ALL NIGERIAN BASES' },
          { id: 'AUDIT_LOGS', label: '8. 📜 AUDIT TRAIL LOGS' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setCurrentTab(t.id)}
            className={`px-3.5 py-2 rounded-xl font-black transition whitespace-nowrap border ${
              currentTab === t.id
                ? 'bg-emerald-600 text-black border-emerald-500 shadow-lg'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* 4. GLOBAL SEARCH BAR & ADVANCED FILTERS */}
      {!['BASES', 'AUDIT_LOGS'].includes(currentTab) && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-xl">
          <div>
            <label className="text-[10px] text-emerald-400 font-black block mb-1 uppercase tracking-wider">GLOBAL PROMINENT SEARCH BAR:</label>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search officer name, service number, command, unit, zone or location..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono shadow-inner"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs">
            <div>
              <label className="text-[9px] text-slate-400 block mb-1 font-bold">RANK:</label>
              <select value={rankFilter} onChange={e => setRankFilter(e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-white rounded px-2.5 py-1.5 font-mono">
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
              <select value={zoneFilter} onChange={e => setZoneFilter(e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-white rounded px-2.5 py-1.5">
                <option value="ALL">ALL ZONES</option>
                <option value="Zone 1 Kano">Zone 1 (Kano)</option>
                <option value="Zone 2 Lagos">Zone 2 (Lagos)</option>
                <option value="Zone 7 Abuja">Zone 7 (Abuja)</option>
                <option value="Zone 13 Awka">Zone 13 (Awka)</option>
                <option value="Zone 15 Maiduguri">Zone 15 (Maiduguri)</option>
              </select>
            </div>

            <div>
              <label className="text-[9px] text-slate-400 block mb-1 font-bold">STATE COMMAND:</label>
              <select value={stateFilter} onChange={e => setStateFilter(e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-white rounded px-2.5 py-1.5">
                <option value="ALL">ALL STATES</option>
                <option value="FCT Abuja">FCT Abuja</option>
                <option value="Lagos">Lagos State</option>
                <option value="Borno">Borno State</option>
                <option value="Anambra">Anambra State</option>
              </select>
            </div>

            <div>
              <label className="text-[9px] text-slate-400 block mb-1 font-bold">STATUS:</label>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-white rounded px-2.5 py-1.5">
                <option value="ALL">ALL STATUSES</option>
                <option value="ACTIVE_READY">ACTIVE & READY</option>
                <option value="FIELD_DEPLOYED">FIELD DEPLOYED</option>
                <option value="ON_ESCORT">ON ESCORT</option>
              </select>
            </div>

            <div>
              <label className="text-[9px] text-slate-400 block mb-1 font-bold">SORT BY:</label>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-white rounded px-2.5 py-1.5">
                <option value="SENIORITY">SENIORITY (RANK HIERARCHY)</option>
                <option value="NAME_ASC">ALPHABETICAL (A-Z)</option>
                <option value="APPOINTMENT_DATE">APPOINTMENT DATE</option>
              </select>
            </div>

            <div className="flex items-end">
              <button onClick={() => { setSearchQuery(''); setRankFilter('ALL'); setZoneFilter('ALL'); setStateFilter('ALL'); setStatusFilter('ALL'); setSortBy('SENIORITY'); }} className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-1.5 rounded text-xs border border-slate-700">
                RESET FILTERS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. MAIN CONTENT DISPLAY */}
      {currentTab === 'BASES' ? (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 shadow-xl">
            <h3 className="text-xs font-black uppercase text-emerald-400 tracking-wider">17 ZONAL COMMAND HEADQUARTERS</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <div className="font-bold text-white">Zone 1 Command HQ (Kano)</div>
                <div className="text-slate-400">HQ: Kano City | Jurisdiction: Kano, Jigawa, Katsina</div>
                <div className="text-emerald-400 font-bold">Commander: AIG Usman Garba (420 Officers)</div>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <div className="font-bold text-white">Zone 2 Command HQ (Lagos)</div>
                <div className="text-slate-400">HQ: Onikan / Ikeja | Jurisdiction: Lagos, Ogun</div>
                <div className="text-emerald-400 font-bold">Commander: AIG Segun Ogunleye (680 Officers)</div>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <div className="font-bold text-white">Zone 13 Command HQ (Awka)</div>
                <div className="text-slate-400">HQ: Ukpo / Awka | Jurisdiction: Anambra, Enugu</div>
                <div className="text-emerald-400 font-bold">Commander: AIG Chukwudi Nnamdi (390 Officers)</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 shadow-xl">
            <h3 className="text-xs font-black uppercase text-sky-400 tracking-wider">SEAPORT & AVIATION POLICE FORMATIONS</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <div className="font-bold text-white">Apapa Sea Port Police Formation</div>
                <div className="text-slate-400">Location: Apapa Port Complex, Lagos</div>
                <div className="text-sky-400 font-bold">Commander: CSP Desmond Agbala (AP/78412)</div>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <div className="font-bold text-white">Tin Can Island Port Unit</div>
                <div className="text-slate-400">Location: Tin Can Port, Lagos</div>
                <div className="text-sky-400 font-bold">Commander: SP Michael Oladipo (AP/90214)</div>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <div className="font-bold text-white">MMIA Aviation EOD Unit</div>
                <div className="text-slate-400">Location: MMIA Ikeja, Lagos</div>
                <div className="text-sky-400 font-bold">Commander: ACP Kemi Adebayo (AP/61029)</div>
              </div>
            </div>
          </div>
        </div>
      ) : currentTab === 'AUDIT_LOGS' ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
            <span className="font-black text-xs uppercase text-white">IMMUTABLE ADMINISTRATIVE AUDIT TRAIL LOGS</span>
            <span className="text-xs font-mono text-emerald-400 font-bold">{auditLogs.length} AUDIT ENTRIES</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Timestamp</th>
                  <th className="p-3.5">Administrator</th>
                  <th className="p-3.5">Action Event</th>
                  <th className="p-3.5">Affected Officer</th>
                  <th className="p-3.5">Previous Value</th>
                  <th className="p-3.5">New Value</th>
                  <th className="p-3.5">Audit Reason / Gazette Ref</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {auditLogs.map((log, i) => (
                  <tr key={i} className="hover:bg-slate-800/50">
                    <td className="p-3.5 text-slate-400">{log.timestamp}</td>
                    <td className="p-3.5 font-bold text-white">{log.admin}</td>
                    <td className="p-3.5"><span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded font-bold">{log.action}</span></td>
                    <td className="p-3.5 font-bold text-sky-400">{log.officer}</td>
                    <td className="p-3.5 text-slate-400">{log.prevValue}</td>
                    <td className="p-3.5 text-emerald-400 font-bold">{log.newValue}</td>
                    <td className="p-3.5 text-slate-300">{log.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          {currentTab === 'PC-SGT' && (
            <div className="p-3 bg-slate-950/90 border-b border-slate-800 flex gap-4 text-xs font-mono">
              <span className="text-indigo-400 font-bold">SGTs (Sergeants): {sgtCount}</span>
              <span className="text-indigo-300 font-bold">CPLs (Corporals): {cplCount}</span>
              <span className="text-indigo-200 font-bold">PCs (Constables): {pcCount}</span>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] border-b border-slate-800 font-mono">
                <tr>
                  <th className="p-3.5 w-12 text-center">S/N</th>
                  <th className="p-3.5">Photo & Officer Name</th>
                  <th className="p-3.5">Service No</th>
                  <th className="p-3.5">Rank & Category</th>
                  <th className="p-3.5">Command & Formation</th>
                  <th className="p-3.5">State & Zone</th>
                  <th className="p-3.5">Duty Station</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-slate-500 font-mono text-sm">
                      No authorised personnel record found matching search criteria.
                    </td>
                  </tr>
                ) : filtered.map((off, idx) => (
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
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        deriveCategory(off.rank) === 'ACP-CP' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                        deriveCategory(off.rank) === 'DSP-CSP' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' :
                        deriveCategory(off.rank) === 'ASP' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                        deriveCategory(off.rank) === 'INSPECTORS' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' :
                        'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                      }`}>
                        {off.rank} ({deriveCategory(off.rank)})
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-emerald-400 text-xs font-sans">{off.command}</div>
                      <div className="text-[9px] text-slate-400 font-sans">{off.formation}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-white font-sans">{off.state}</div>
                      <span className="text-[9px] text-slate-400 font-sans">{off.zone}</span>
                    </td>
                    <td className="p-3.5 text-slate-300 font-sans">{off.location}</td>
                    <td className="p-3.5">
                      <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded text-[9px] font-bold">
                        {off.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button onClick={() => setSelectedOfficer(off)} className="bg-slate-800 hover:bg-slate-700 text-sky-400 px-3 py-1 rounded text-[11px] font-extrabold transition border border-slate-700">
                        VIEW PROFILE
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. OFFICER PROFILE MODAL (PROMINENT REQUIREMENT) */}
      {selectedOfficer && (
        <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full p-6 space-y-5 shadow-2xl my-8 overflow-y-auto max-h-[90vh]">
            
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div className="flex items-center gap-4">
                <img src={selectedOfficer.photo} alt={selectedOfficer.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-lg" />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-white">{selectedOfficer.name}</h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      {selectedOfficer.rank} ({deriveCategory(selectedOfficer.rank)})
                    </span>
                  </div>
                  <p className="text-xs text-sky-400 font-mono font-bold mt-0.5">{selectedOfficer.serviceNo}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{selectedOfficer.role}</p>
                </div>
              </div>

              <button onClick={() => setSelectedOfficer(null)} className="bg-emerald-600 hover:bg-emerald-500 text-black font-extrabold px-3.5 py-2 rounded-lg text-xs transition">
                &larr; BACK TO MASTER ROLL
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <h4 className="text-[10px] font-black uppercase text-emerald-400 border-b border-slate-800 pb-1">OFFICIAL ASSIGNMENT & COMMAND</h4>
                <div className="flex justify-between"><span className="text-slate-400">Rank Category:</span><span className="font-bold text-amber-400">{deriveCategory(selectedOfficer.rank)} Tier</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Command:</span><span className="font-bold text-white text-right">{selectedOfficer.command}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">State Command:</span><span className="font-bold text-sky-400">{selectedOfficer.state}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Zone:</span><span className="font-bold text-slate-300">{selectedOfficer.zone}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Duty Location:</span><span className="font-bold text-emerald-400">{selectedOfficer.location}</span></div>
                <div className="flex justify-between"><span class="text-slate-400">Specialisation:</span><span className="font-bold text-slate-300">{selectedOfficer.specialisation}</span></div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <h4 className="text-[10px] font-black uppercase text-emerald-400 border-b border-slate-800 pb-1">CAREER DATES & RBAC DATA</h4>
                <div className="flex justify-between"><span className="text-slate-400">Date of Appointment:</span><span className="font-bold text-white font-mono">{selectedOfficer.appointmentDate}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Last Promotion Date:</span><span className="font-bold text-amber-400 font-mono">{selectedOfficer.lastPromotionDate}</span></div>
                <div className="flex justify-between border-t border-slate-800/80 pt-2"><span className="text-slate-400">Contact Info (RBAC):</span><span className="font-bold text-sky-400 font-mono">
                  {['SUPER_ADMIN', 'PERSONNEL_ADMIN'].includes(rbacRole) ? `${selectedOfficer.phone} | ${selectedOfficer.email}` : '[RESTRICTED BY RBAC]'}
                </span></div>
              </div>
            </div>

            {/* Promotion & Posting Timelines */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <h4 className="text-[10px] font-black uppercase text-amber-400 border-b border-slate-800 pb-1">PROMOTION HISTORY TIMELINE</h4>
                <div className="space-y-1.5 font-mono text-[11px]">
                  {selectedOfficer.promotions && selectedOfficer.promotions.length > 0 ? (
                    selectedOfficer.promotions.map((p, idx) => (
                      <div key={idx} className="border-l-2 border-amber-500 pl-2 py-0.5">
                        <span className="text-amber-400 font-bold">{p.date}</span> &bull; {p.fromRank} &rarr; <b>{p.toRank}</b> ({p.gazette})
                      </div>
                    ))
                  ) : <span className="text-slate-500 italic">No previous promotions recorded.</span>}
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <h4 className="text-[10px] font-black uppercase text-sky-400 border-b border-slate-800 pb-1">POSTING HISTORY TIMELINE</h4>
                <div className="space-y-1.5 font-mono text-[11px]">
                  {selectedOfficer.postings && selectedOfficer.postings.length > 0 ? (
                    selectedOfficer.postings.map((ps, idx) => (
                      <div key={idx} className="border-l-2 border-sky-500 pl-2 py-0.5">
                        <span className="text-sky-400 font-bold">{ps.date}</span> &bull; Transferred to <b>{ps.command}</b> ({ps.location})
                      </div>
                    ))
                  ) : <span className="text-slate-500 italic">No previous postings.</span>}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
              <div className="flex gap-2">
                {['SUPER_ADMIN', 'PERSONNEL_ADMIN'].includes(rbacRole) && (
                  <>
                    <button onClick={() => { setTargetOfficerId(selectedOfficer.id); setIsPromoteModalOpen(true); }} className="bg-amber-500 hover:bg-amber-400 text-black font-extrabold px-3 py-1.5 rounded-lg text-xs">
                      PROMOTE OFFICER
                    </button>
                    <button onClick={() => { setTargetOfficerId(selectedOfficer.id); setIsTransferModalOpen(true); }} className="bg-sky-500 hover:bg-sky-400 text-black font-extrabold px-3 py-1.5 rounded-lg text-xs">
                      TRANSFER OFFICER
                    </button>
                  </>
                )}
              </div>

              <button onClick={() => setSelectedOfficer(null)} className="bg-emerald-600 hover:bg-emerald-500 text-black font-extrabold px-4 py-2 rounded-lg text-xs">
                BACK TO MASTER ROLL
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 7. PROMOTION AUTOMATION MODAL */}
      {isPromoteModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-sm font-extrabold text-white uppercase border-b border-slate-800 pb-2">
              PROMOTE OFFICER (AUTOMATIC CATEGORY TRANSFER)
            </h3>
            <form onSubmit={handlePromoteConfirm} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-bold">SELECT NEW PROMOTION RANK:</label>
                <select value={promoteNewRank} onChange={e => setPromoteNewRank(e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-white rounded px-3 py-2 font-mono">
                  <option value="CP">CP - Commissioner of Police (Strategic Command)</option>
                  <option value="DCP">DCP - Deputy Commissioner (Strategic Command)</option>
                  <option value="ACP">ACP - Assistant Commissioner (Strategic Command)</option>
                  <option value="CSP">CSP - Chief Superintendent (Senior Officers)</option>
                  <option value="SP">SP - Superintendent (Senior Officers)</option>
                  <option value="DSP">DSP - Deputy Superintendent (Senior Officers)</option>
                  <option value="ASP_I">ASP I - Assistant Superintendent I (Assistant Supts)</option>
                  <option value="ASP_II">ASP II - Assistant Superintendent II (Assistant Supts)</option>
                  <option value="INSPR">INSPR - Inspector of Police (Inspectorate)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-bold">PROMOTION REASON / GAZETTE REF:</label>
                <input type="text" value={promoteReason} onChange={e => setPromoteReason(e.target.value)} required placeholder="e.g. Police Service Commission Special Promotion 2026" className="w-full bg-slate-950 border border-slate-800 text-white rounded px-3 py-2" />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setIsPromoteModalOpen(false)} className="w-1/2 bg-slate-800 text-white py-2 rounded font-bold">CANCEL</button>
                <button type="submit" className="w-1/2 bg-amber-500 text-black py-2 rounded font-extrabold">CONFIRM PROMOTION</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. TRANSFER MANAGEMENT MODAL */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-sm font-extrabold text-white uppercase border-b border-slate-800 pb-2">
              TRANSFER OFFICER (UPDATE COMMAND & POSTING)
            </h3>
            <form onSubmit={handleTransferConfirm} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-bold">SELECT NEW COMMAND & LOCATION:</label>
                <select value={transferPosting} onChange={e => setTransferPosting(e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-white rounded px-3 py-2">
                  <option value="Apapa Sea Port EOD Unit|Lagos|Zone 2 Lagos|South West|Seaport Formation|Apapa Port Complex">Apapa Sea Port EOD Unit (Lagos)</option>
                  <option value="Murtala Muhammed Airport Aviation EOD Unit|Lagos|Zone 2 Lagos|South West|Aviation Unit|MMIA Ikeja">Murtala Muhammed Airport Unit (MMIA Lagos)</option>
                  <option value="Maiduguri Counter-IED Command Theatre|Borno|Zone 15 Maiduguri|North East|Tactical Theatre|Maiduguri HQ">Maiduguri Counter-IED Theatre (Borno)</option>
                  <option value="Force HQ EOD-CBRN Command HQ|FCT Abuja|Zone 7 Abuja|North Central|Force Headquarters|Louis Edet House">Force HQ EOD Command (Abuja)</option>
                  <option value="National CBRN Emergency Response Centre|FCT Abuja|Zone 7 Abuja|North Central|CBRN Centre|Guzape Complex">National CBRN Centre of Excellence (Abuja)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-bold">TRANSFER REASON / SIGNAL REF:</label>
                <input type="text" value={transferReason} onChange={e => setTransferReason(e.target.value)} required placeholder="e.g. Inspector-General Signal NPF/FHQ/TR/2026/88" className="w-full bg-slate-950 border border-slate-800 text-white rounded px-3 py-2" />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setIsTransferModalOpen(false)} className="w-1/2 bg-slate-800 text-white py-2 rounded font-bold">CANCEL</button>
                <button type="submit" className="w-1/2 bg-sky-500 text-black py-2 rounded font-extrabold">CONFIRM TRANSFER</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
