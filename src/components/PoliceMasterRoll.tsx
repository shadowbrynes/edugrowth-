import React, { useState } from 'react';

export interface Specialist {
  id: string;
  serialNo: string;
  name: string;
  rank: string;
  role: string;
  command: string;
  status: 'READY' | 'DEPLOYED' | 'ON_CALL' | 'MAINTENANCE';
  specialisation: string;
  assignedGear: string;
  phone: string;
}

export interface TacticalAsset {
  id: string;
  assetTag: string;
  name: string;
  category: 'HAZMAT' | 'ROBOTICS' | 'ARMOR' | 'DETECTION';
  status: 'OPERATIONAL' | 'DEPLOYED' | 'SERVICE_DUE' | 'INACTIVE';
  location: string;
  lastCalibrated: string;
}

export interface DeploymentOp {
  id: string;
  dispatchId: string;
  title: string;
  location: string;
  commander: string;
  threatLevel: 'LEVEL 1 (LOW)' | 'LEVEL 2 (HIGH)' | 'LEVEL 3 (EMERGENCY)';
  status: 'ACTIVE' | 'CONTAINED' | 'COMPLETED';
  officersCount: number;
  gearCount: number;
  timeStarted: string;
}

export interface TelemetryAlert {
  id: string;
  type: 'critical' | 'high' | 'info';
  timestamp: string;
  title: string;
  message: string;
}

const INITIAL_SPECIALISTS: Specialist[] = [
  { id: 'SPEC-01', serialNo: 'AP/78412', name: 'CSP Desmond Agbala', rank: 'CSP', role: 'Commander, EOD Maritime', command: 'Apapa Sea Port EOD Unit', status: 'READY', specialisation: 'Commercial Explosives & Maritime EOD', assignedGear: 'EOD Suit Mk-V, Disruptor', phone: '+234 803 456 7890' },
  { id: 'SPEC-02', serialNo: 'AP/52918', name: 'Dr. Elena Rostova', rank: 'DCP', role: 'CBRN Incident Commander', command: 'National CBRN Emergency Centre', status: 'DEPLOYED', specialisation: 'Bio-Hazard Containment', assignedGear: 'HAZ-DETECTOR-12, Level-A Suit', phone: '+234 802 111 2233' },
  { id: 'SPEC-03', serialNo: 'AP/61029', name: 'Capt. Marcus Vance', rank: 'ACP', role: 'Aviation EOD Specialist', command: 'Murtala Muhammed Airport EOD Unit', status: 'DEPLOYED', specialisation: 'Aviation Cargo Diagnostics', assignedGear: 'X-Ray Scanner-400', phone: '+234 802 333 4455' },
  { id: 'SPEC-04', serialNo: 'AP/45120', name: 'CP Babatunde Olarinde', rank: 'CP', role: 'Strategic Commander', command: 'Force HQ EOD-CBRN Command', status: 'READY', specialisation: 'Strategic Arms & Counter-IED', assignedGear: 'Tactical C2 Radio Matrix', phone: '+234 803 000 1122' }
];

const INITIAL_ASSETS: TacticalAsset[] = [
  { id: 'AST-01', assetTag: 'HAZ-DETECTOR-12', name: 'Multi-Gas Monitor (HAZ-DETECTOR-12)', category: 'HAZMAT', status: 'DEPLOYED', location: 'Downtown Terminal Sector 4', lastCalibrated: '2026-07-01' },
  { id: 'AST-02', assetTag: 'ROBOT-UGV-04', name: 'PackBot 510 UGV Bomb Robot', category: 'ROBOTICS', status: 'OPERATIONAL', location: 'Sector 4 HQ Armory', lastCalibrated: '2026-07-15' },
  { id: 'AST-03', assetTag: 'XRAY-PORT-09', name: 'RTR-4 Portable Digital X-Ray System', category: 'DETECTION', status: 'DEPLOYED', location: 'International Convention Center', lastCalibrated: '2026-06-20' },
  { id: 'AST-04', assetTag: 'SUIT-EOD-07', name: 'EOD 10E Bomb Suit & Helmet Assembly', category: 'ARMOR', status: 'OPERATIONAL', location: 'Sector 4 HQ Armory', lastCalibrated: '2026-07-10' }
];

const INITIAL_DEPLOYS: DeploymentOp[] = [
  { id: 'DEP-1', dispatchId: 'DEP-2026-091', title: 'Operation Bio-Shield Safety Sweep', location: 'Downtown Terminal Sector 4', commander: 'Dr. Elena Rostova', threatLevel: 'LEVEL 3 (EMERGENCY)', status: 'ACTIVE', officersCount: 1, gearCount: 1, timeStarted: '2026-07-29 08:00' },
  { id: 'DEP-2', dispatchId: 'DEP-2026-088', title: 'Convention Center Inspection', location: 'International Convention Center', commander: 'Capt. Marcus Vance', threatLevel: 'LEVEL 2 (HIGH)', status: 'ACTIVE', officersCount: 2, gearCount: 3, timeStarted: '2026-07-28 14:00' }
];

const INITIAL_ALERTS: TelemetryAlert[] = [
  { id: 'ALT-01', type: 'high', timestamp: '2026-07-29 08:15', title: 'CALIBRATION REMINDER', message: 'Multi-Gas Monitor (HAZ-DETECTOR-12) calibration due in 15 days.' },
  { id: 'ALT-02', type: 'critical', timestamp: '2026-07-28 14:05', title: 'EMERGENCY OPERATION ACTIVE', message: 'Operation Bio-Shield active in Sector 4. Level 3 containment protocol engaged.' }
];

export const PoliceMasterRoll: React.FC = () => {
  const [hudTab, setHudTab] = useState<'HUD' | 'PERSONNEL' | 'ASSETS' | 'DEPLOYMENTS' | 'AUDIT'>('HUD');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [specialists] = useState<Specialist[]>(INITIAL_SPECIALISTS);
  const [assets] = useState<TacticalAsset[]>(INITIAL_ASSETS);
  const [deployments] = useState<DeploymentOp[]>(INITIAL_DEPLOYS);
  const [alerts] = useState<TelemetryAlert[]>(INITIAL_ALERTS);

  const readySpecialists = specialists.filter(s => s.status === 'READY').length;
  const operationalAssets = assets.filter(a => a.status === 'OPERATIONAL').length;
  const activeOps = deployments.filter(d => d.status === 'ACTIVE').length;

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 p-4 md:p-6 space-y-6 font-sans antialiased selection:bg-emerald-600 selection:text-white">
      
      {/* C2 TOP SECURITY HEADER */}
      <header className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-5 shadow-2xl flex flex-wrap items-center justify-between gap-4 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 font-black text-xl shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            🛡️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-black text-white uppercase tracking-wider">
                EOD & CBRN COMMAND C2
              </h1>
              <span className="bg-emerald-600 text-black text-[10px] font-black px-2 py-0.5 rounded font-mono uppercase">
                HAZMAT DISPOSAL SYSTEM
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              EXPLOSIVE ORDNANCE & HAZMAT DISPOSAL SYSTEM &bull; TACTICAL COMMAND MATRIX
            </p>
          </div>
        </div>

        {/* Global Search */}
        <div className="w-full md:w-80">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Global Search (Officer name, Serial No, Dispatch ID)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono shadow-inner"
            />
            <span className="absolute right-3 top-2 text-slate-500 text-xs">🔍</span>
          </div>
        </div>
      </header>

      {/* C2 NAVIGATION TABS */}
      <div className="flex gap-2 overflow-x-auto text-xs pb-1 border-b border-slate-800/80">
        {[
          { id: 'HUD', label: 'HUD Dashboard', count: null },
          { id: 'PERSONNEL', label: 'Personnel', count: specialists.length },
          { id: 'ASSETS', label: 'Assets', count: assets.length },
          { id: 'DEPLOYMENTS', label: 'Deployments', count: deployments.length },
          { id: 'AUDIT', label: 'Audit Log', count: null }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setHudTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-2 border whitespace-nowrap ${
              hudTab === tab.id
                ? 'bg-emerald-600 text-black border-emerald-500 font-black shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== null && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${hudTab === tab.id ? 'bg-black/30 text-white' : 'bg-slate-800 text-slate-400'}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {hudTab === 'HUD' && (
        <>
          {/* OPERATIONAL STATUS & GRID BAR */}
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
              <div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-emerald-400 font-black">OPERATIONAL STATUS: READY</span>
                  <span className="text-slate-600">|</span>
                  <span class="text-sky-400 font-bold">GRID LOCATION: SECTOR 4 HQ</span>
                </div>
                <h2 className="text-base font-black text-white uppercase mt-0.5 tracking-wide">
                  EXPLOSIVE ORDNANCE & CBRN COMMAND HUD
                </h2>
                <p className="text-xs text-slate-400">
                  Real-time telemetry, squad deployment matrix, and high-threat neutralization tracking.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-black font-mono">
                THREAT LEVEL: DEFCON 4 / GUARDED
              </span>
            </div>
          </div>

          {/* TELEMETRY METRICS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1 shadow-xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">AVAILABLE SPECIALISTS</span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-emerald-400 font-mono">{readySpecialists}</span>
                <span className="text-xs text-slate-500 font-mono">/ {specialists.length} Total</span>
              </div>
              <p className="text-[10px] text-slate-400">Ready for Immediate Dispatch</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1 shadow-xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">FIELD ASSETS</span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-sky-400 font-mono">{operationalAssets}</span>
                <span className="text-xs text-slate-500 font-mono">/ {assets.length} Operational</span>
              </div>
              <p className="text-[10px] text-slate-400">Robotics & Detection Gear</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1 shadow-xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">ACTIVE OPERATIONS</span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-amber-400 font-mono">{activeOps}</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono font-bold">LIVE DISPATCH</span>
              </div>
              <p className="text-[10px] text-slate-400">Tactical Sweeps & Inspection</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1 shadow-xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">SERVICE REQUIRED</span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-slate-300 font-mono">0</span>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">ATTENTION</span>
              </div>
              <p className="text-[10px] text-slate-400">All Gear Fully Calibrated</p>
            </div>

          </div>

          {/* TACTICAL COMMAND QUICK ACTIONS */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
            <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
              <span>⚡ TACTICAL COMMAND QUICK ACTIONS</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold">
              <button onClick={() => alert("Initiating Live Operation Dispatch Matrix...")} className="bg-emerald-600 hover:bg-emerald-500 text-black py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg">
                <span>⚡</span>
                <span>Dispatch Operation</span>
              </button>
              <button onClick={() => alert("RFID / Serial Scanner Active...")} className="bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2">
                <span>📡</span>
                <span>Scan Serial / RFID</span>
              </button>
              <button onClick={() => alert("Opening Specialist Registration Portal...")} className="bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2">
                <span>👤</span>
                <span>Register Specialist</span>
              </button>
              <button onClick={() => alert("Opening Asset Inventory Vault...")} className="bg-slate-800 hover:bg-slate-700 text-purple-400 border border-slate-700 py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2">
                <span>🛡️</span>
                <span>Add Gear / Asset</span>
              </button>
            </div>
          </div>

          {/* ACTIVE TACTICAL OPERATIONS & TELEMETRY ALERTS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Active Operations List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <span>🎯 ACTIVE TACTICAL OPERATIONS ({deployments.length})</span>
                </h3>
                <button onClick={() => setHudTab('DEPLOYMENTS')} className="text-xs text-emerald-400 hover:underline font-bold font-mono">
                  View Matrix &rarr;
                </button>
              </div>

              <div className="space-y-3">
                {deployments.map(op => (
                  <div key={op.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-xl hover:border-slate-700 transition">
                    <div className="flex flex-wrap justify-between items-start gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black font-mono ${
                            op.threatLevel.includes('EMERGENCY') ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}>
                            {op.threatLevel}
                          </span>
                          <span className="text-xs font-mono font-bold text-sky-400">{op.dispatchId}</span>
                        </div>
                        <h4 className="text-base font-black text-white mt-1">{op.title}</h4>
                        <p className="text-xs text-slate-400">{op.location}</p>
                      </div>

                      <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] px-2.5 py-1 rounded-lg font-mono font-bold">
                        {op.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-2 border-t border-slate-800/80 font-mono">
                      <div>
                        <span className="text-[10px] text-slate-500 block">INCIDENT COMMANDER</span>
                        <span className="font-bold text-white">{op.commander}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">RESOURCES DEPLOYED</span>
                        <span className="font-bold text-emerald-400">{op.officersCount} Officers | {op.gearCount} Gear</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">START TIME</span>
                        <span className="font-bold text-slate-300">{op.timeStarted}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Telemetry Alerts Bar */}
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-2">
                <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <span>📡 COMMAND TELEMETRY ALERTS</span>
                </h3>
              </div>

              <div className="space-y-3">
                {alerts.map(alt => (
                  <div key={alt.id} className={`p-4 rounded-2xl border space-y-1 ${
                    alt.type === 'critical' ? 'bg-red-950/30 border-red-500/40 text-red-200' : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                  }`}>
                    <div className="flex justify-between items-center text-[10px] font-mono font-bold">
                      <span className="uppercase px-1.5 py-0.5 rounded bg-black/40">{alt.type}</span>
                      <span className="text-slate-400">{alt.timestamp}</span>
                    </div>
                    <h4 className="text-xs font-black uppercase tracking-wide">{alt.title}</h4>
                    <p className="text-xs text-slate-300">{alt.message}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </>
      )}

      {hudTab === 'PERSONNEL' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 overflow-x-auto shadow-2xl">
          <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-3">EOD & CBRN PERSONNEL DIRECTORY</h3>
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Serial No</th>
                <th className="p-3">Specialist Name</th>
                <th className="p-3">Rank & Role</th>
                <th className="p-3">Command Unit</th>
                <th className="p-3">Specialisation</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {specialists.map(sp => (
                <tr key={sp.id} className="hover:bg-slate-800/50">
                  <td className="p-3 text-sky-400 font-bold">{sp.serialNo}</td>
                  <td className="p-3 font-bold text-white">{sp.name}</td>
                  <td className="p-3 text-slate-300">{sp.rank} - {sp.role}</td>
                  <td className="p-3 text-emerald-400">{sp.command}</td>
                  <td className="p-3 text-slate-400">{sp.specialisation}</td>
                  <td className="p-3">
                    <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded text-[9px] font-bold">
                      {sp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {hudTab === 'ASSETS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 overflow-x-auto shadow-2xl">
          <h3 className="text-xs font-black text-sky-400 uppercase tracking-widest mb-3">TACTICAL ASSETS & HAZMAT GEAR INVENTORY</h3>
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Asset Tag</th>
                <th className="p-3">Asset Description</th>
                <th className="p-3">Category</th>
                <th className="p-3">Current Location</th>
                <th className="p-3">Last Calibrated</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {assets.map(ast => (
                <tr key={ast.id} className="hover:bg-slate-800/50">
                  <td className="p-3 text-amber-400 font-bold">{ast.assetTag}</td>
                  <td className="p-3 font-bold text-white">{ast.name}</td>
                  <td className="p-3 text-sky-400">{ast.category}</td>
                  <td className="p-3 text-slate-300">{ast.location}</td>
                  <td className="p-3 text-slate-400">{ast.lastCalibrated}</td>
                  <td className="p-3">
                    <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded text-[9px] font-bold">
                      {ast.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {hudTab === 'DEPLOYMENTS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 overflow-x-auto shadow-2xl">
          <h3 className="text-xs font-black text-amber-400 uppercase tracking-widest mb-3">TACTICAL DEPLOYMENTS MATRIX</h3>
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Dispatch ID</th>
                <th className="p-3">Operation Title</th>
                <th className="p-3">Target Location</th>
                <th className="p-3">Incident Commander</th>
                <th className="p-3">Threat Level</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {deployments.map(dp => (
                <tr key={dp.id} className="hover:bg-slate-800/50">
                  <td className="p-3 text-sky-400 font-bold">{dp.dispatchId}</td>
                  <td className="p-3 font-bold text-white">{dp.title}</td>
                  <td className="p-3 text-slate-300">{dp.location}</td>
                  <td className="p-3 text-emerald-400">{dp.commander}</td>
                  <td className="p-3 text-amber-400">{dp.threatLevel}</td>
                  <td className="p-3">
                    <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded text-[9px] font-bold">
                      {dp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {hudTab === 'AUDIT' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl space-y-3 font-mono text-xs">
          <h3 className="text-xs font-black text-purple-400 uppercase tracking-widest">COMMAND AUDIT LOGS & EVENT TELEMETRY</h3>
          <div className="space-y-2">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-500">2026-07-29 08:15:02 &bull;</span> <span className="text-amber-400 font-bold">SYSTEM TELEMETRY</span> &bull; Multi-Gas Monitor HAZ-DETECTOR-12 calibration alert logged.
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-500">2026-07-28 14:05:10 &bull;</span> <span className="text-red-400 font-bold">DISPATCH ENGAGED</span> &bull; Operation Bio-Shield Safety Sweep dispatched to Sector 4.
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
