import React, { useState, useEffect, useCallback } from 'react';
import {
  Lock, LogOut, Users, RefreshCw, Search, ChevronDown, ChevronUp,
  CheckCircle2, Clock, Mail, Phone, User, Briefcase, ArrowUpDown, X,
  Shield, Eye, EyeOff,
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// ── Auth ──
const ADMIN_USER = 'adminrob';
const ADMIN_PASS = 'Robbin#15';
const SESSION_KEY = 'admin_auth_v1';

// ── Supabase (reads leads table via service role key or anon if RLS allows) ──
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? 'https://aexrgtpxyzfxjecozstf.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY ?? import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFleHJndHB4eXpmeGplY296c3RmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyOTY0MjcsImV4cCI6MjA4Nzg3MjQyN30._ZSmh9iTP3etyGj5XrkEGJtRp9kR8z6jAmLOMesIvkg';
const supabase = createClient(supabaseUrl, supabaseKey);


// ── Types ──
interface Lead {
  id: string;
  email: string;
  name: string | null;
  role: string | null;
  whatsapp: string | null;
  stage: string;
  followup_1_at: string | null;
  followup_2_at: string | null;
  followup_3_at: string | null;
  created_at: string;
  updated_at: string;
}

// ── Stage config ──
const STAGES: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  'sketchup-free':  { label: 'SketchUp Free',   color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200',   dot: 'bg-blue-500' },
  'render-bundle':  { label: 'Render Bundle',   color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200', dot: 'bg-orange-500' },
  'full-bundle':    { label: 'Full Bundle',      color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200', dot: 'bg-purple-500' },
  'books-bundle':   { label: 'Books Bundle',     color: 'text-emerald-700',bg: 'bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
  'books-downsell': { label: 'Books Downsell',   color: 'text-slate-700',  bg: 'bg-slate-50 border-slate-200',  dot: 'bg-slate-400' },
};

const stageMeta = (stage: string) =>
  STAGES[stage] ?? { label: stage, color: 'text-gray-700', bg: 'bg-gray-50 border-gray-200', dot: 'bg-gray-400' };

const fmtDate = (s: string | null) => {
  if (!s) return '—';
  return new Date(s).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
};

const fmtTimeAgo = (s: string) => {
  const diff = Date.now() - new Date(s).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

// ─────────────────────────────────────
// LOGIN SCREEN
// ─────────────────────────────────────
const LoginScreen: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      if (user === ADMIN_USER && pass === ADMIN_PASS) {
        sessionStorage.setItem(SESSION_KEY, '1');
        onLogin();
      } else {
        setError('Invalid username or password.');
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }} />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-orange-500 rounded-2xl mb-4 shadow-lg shadow-orange-500/30">
            <Shield size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Admin Portal</h1>
          <p className="text-slate-400 text-sm mt-1">Avada Design — Restricted Access</p>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Username</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={user}
                  onChange={e => setUser(e.target.value)}
                  placeholder="Username"
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={pass}
                  onChange={e => setPass(e.target.value)}
                  placeholder="Password"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-900/30 border border-red-700/50 rounded-xl px-4 py-3">
                <X size={14} className="text-red-400 shrink-0" />
                <p className="text-red-400 text-sm font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:from-orange-400 hover:to-amber-400 transition-all disabled:opacity-60 shadow-lg shadow-orange-500/20"
            >
              {loading ? (
                <span className="flex items-center gap-2"><RefreshCw size={16} className="animate-spin" /> Signing in…</span>
              ) : (
                <span className="flex items-center gap-2"><Lock size={16} /> Sign In</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────
// STAGE BADGE
// ─────────────────────────────────────
const StageBadge: React.FC<{ stage: string }> = ({ stage }) => {
  const m = stageMeta(stage);
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border ${m.bg} ${m.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  );
};

// ─────────────────────────────────────
// FOLLOWUP DOTS
// ─────────────────────────────────────
const FollowupDots: React.FC<{ f1: string | null; f2: string | null; f3: string | null }> = ({ f1, f2, f3 }) => (
  <div className="flex items-center gap-1" title={`F1: ${fmtDate(f1)}\nF2: ${fmtDate(f2)}\nF3: ${fmtDate(f3)}`}>
    {[f1, f2, f3].map((f, i) => (
      <span
        key={i}
        className={`w-2.5 h-2.5 rounded-full border ${f ? 'bg-emerald-500 border-emerald-600' : 'bg-slate-200 border-slate-300'}`}
        title={`Followup ${i + 1}: ${fmtDate(f)}`}
      />
    ))}
    <span className="text-[10px] text-slate-400 ml-1">
      {[f1, f2, f3].filter(Boolean).length}/3 sent
    </span>
  </div>
);

// ─────────────────────────────────────
// LEAD DETAIL DRAWER
// ─────────────────────────────────────
const LeadDrawer: React.FC<{ lead: Lead; onClose: () => void }> = ({ lead, onClose }) => (
  <div className="fixed inset-0 z-50 flex justify-end" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
    <div className="relative w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
      {/* Header */}
      <div className="bg-slate-900 px-6 py-5 flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Lead Details</p>
          <h3 className="text-white font-black text-lg">{lead.name || lead.email}</h3>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1">
          <X size={20} />
        </button>
      </div>

      <div className="p-6 space-y-6 flex-1">
        {/* Stage */}
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Current Stage</p>
          <StageBadge stage={lead.stage} />
        </div>

        {/* Funnel Progress */}
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Funnel Steps Completed</p>
          <div className="space-y-2">
            {Object.entries(STAGES).map(([key, meta]) => {
              const stageOrder = Object.keys(STAGES);
              const leadIdx = stageOrder.indexOf(lead.stage);
              const thisIdx = stageOrder.indexOf(key);
              const completed = thisIdx <= leadIdx;
              return (
                <div key={key} className={`flex items-center gap-3 p-3 rounded-xl border ${completed ? meta.bg : 'bg-slate-50 border-slate-100'}`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${completed ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                    {completed ? <CheckCircle2 size={12} className="text-white" strokeWidth={3} /> : <span className="w-2 h-2 rounded-full bg-slate-400" />}
                  </div>
                  <span className={`text-sm font-semibold ${completed ? meta.color : 'text-slate-400'}`}>{meta.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* User Info */}
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">User Details</p>
          <div className="space-y-3">
            {[
              { icon: <Mail size={14} />, label: 'Email', value: lead.email },
              { icon: <User size={14} />, label: 'Name', value: lead.name || '—' },
              { icon: <Briefcase size={14} />, label: 'Role', value: lead.role || '—' },
              { icon: <Phone size={14} />, label: 'Phone', value: lead.whatsapp || '—' },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex items-start gap-3 bg-slate-50 rounded-xl px-4 py-3">
                <span className="text-slate-400 mt-0.5 shrink-0">{icon}</span>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">{label}</p>
                  <p className="text-sm text-slate-900 font-semibold">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Follow-ups */}
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Follow-up Emails</p>
          <div className="space-y-2">
            {[
              { label: 'Follow-up 1', sent: lead.followup_1_at },
              { label: 'Follow-up 2', sent: lead.followup_2_at },
              { label: 'Follow-up 3', sent: lead.followup_3_at },
            ].map(({ label, sent }) => (
              <div key={label} className={`flex items-center justify-between p-3 rounded-xl border ${sent ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center gap-2">
                  {sent
                    ? <CheckCircle2 size={14} className="text-emerald-600" />
                    : <Clock size={14} className="text-slate-400" />}
                  <span className={`text-sm font-semibold ${sent ? 'text-emerald-800' : 'text-slate-500'}`}>{label}</span>
                </div>
                <span className="text-xs text-slate-400">{fmtDate(sent)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Timestamps */}
        <div className="border-t border-slate-100 pt-4 space-y-1">
          <p className="text-[11px] text-slate-400"><span className="font-bold">Signed up:</span> {fmtDate(lead.created_at)}</p>
          <p className="text-[11px] text-slate-400"><span className="font-bold">Last updated:</span> {fmtDate(lead.updated_at)}</p>
          <p className="text-[11px] text-slate-400"><span className="font-bold">Lead ID:</span> {lead.id}</p>
        </div>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────
const Dashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filtered, setFiltered] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [sortField, setSortField] = useState<keyof Lead>('created_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error: err } = await supabase.rpc('get_leads_secure', { auth_pass: 'Robbin#15' });
      if (err) throw err;
      setLeads(data ?? []);
    } catch (e: any) {
      setError(e.message ?? 'Failed to load leads');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  // Filter + sort
  useEffect(() => {
    let rows = [...leads];
    if (stageFilter !== 'all') rows = rows.filter(l => l.stage === stageFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(l =>
        l.email.toLowerCase().includes(q) ||
        (l.name ?? '').toLowerCase().includes(q) ||
        (l.whatsapp ?? '').includes(q) ||
        (l.role ?? '').toLowerCase().includes(q)
      );
    }
    rows.sort((a, b) => {
      const av = (a[sortField] as string) ?? '';
      const bv = (b[sortField] as string) ?? '';
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });
    setFiltered(rows);
  }, [leads, search, stageFilter, sortField, sortDir]);

  const toggleSort = (field: keyof Lead) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  // Stats
  const statsByStage = Object.keys(STAGES).map(key => ({
    ...STAGES[key],
    key,
    count: leads.filter(l => l.stage === key).length,
  }));
  const totalFollowups = leads.reduce((s, l) => s + [l.followup_1_at, l.followup_2_at, l.followup_3_at].filter(Boolean).length, 0);

  const SortIcon: React.FC<{ field: keyof Lead }> = ({ field }) =>
    sortField === field
      ? sortDir === 'asc' ? <ChevronUp size={13} className="text-orange-500" /> : <ChevronDown size={13} className="text-orange-500" />
      : <ArrowUpDown size={12} className="text-slate-300" />;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Top Bar ── */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <Shield size={16} className="text-white" />
          </div>
          <div>
            <p className="text-white font-black text-sm leading-none">Avada Admin</p>
            <p className="text-slate-500 text-[10px] font-medium">Signups Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchLeads}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-500 transition-colors"
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button
            onClick={() => { sessionStorage.removeItem(SESSION_KEY); onLogout(); }}
            className="flex items-center gap-1.5 text-slate-400 hover:text-red-400 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-700 hover:border-red-700 transition-colors"
          >
            <LogOut size={12} /> Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* ── Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          <div className="col-span-2 md:col-span-1 bg-slate-900 text-white rounded-2xl p-4 flex flex-col justify-between">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Total Signups</p>
            <p className="text-4xl font-black">{leads.length}</p>
            <p className="text-slate-500 text-xs mt-1">Follow-ups sent: {totalFollowups}</p>
          </div>
          {statsByStage.map(s => (
            <button
              key={s.key}
              onClick={() => setStageFilter(stageFilter === s.key ? 'all' : s.key)}
              className={`rounded-2xl p-4 border text-left transition-all hover:shadow-md ${stageFilter === s.key ? s.bg + ' ring-2 ring-offset-1 ring-orange-400' : 'bg-white border-slate-200'}`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                <p className={`text-[10px] font-bold uppercase tracking-widest ${stageFilter === s.key ? s.color : 'text-slate-500'}`}>{s.label}</p>
              </div>
              <p className={`text-2xl font-black ${stageFilter === s.key ? s.color : 'text-slate-900'}`}>{s.count}</p>
            </button>
          ))}
        </div>

        {/* ── Filters ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, phone or role…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-400 transition-colors"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={14} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
            <Users size={14} />
            <span>{filtered.length} lead{filtered.length !== 1 ? 's' : ''}</span>
            {stageFilter !== 'all' && (
              <button onClick={() => setStageFilter('all')} className="text-orange-500 hover:text-orange-700 font-bold flex items-center gap-1">
                <X size={12} /> Clear filter
              </button>
            )}
          </div>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 mb-5 text-red-700 text-sm font-medium flex items-center gap-2">
            <X size={16} className="text-red-500 shrink-0" /> {error}
          </div>
        )}

        {/* ── Table ── */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-24 flex flex-col items-center gap-4 text-slate-400">
              <RefreshCw size={28} className="animate-spin text-orange-400" />
              <p className="text-sm font-medium">Loading leads…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-24 text-center">
              <Users size={36} className="mx-auto text-slate-200 mb-3" />
              <p className="text-slate-400 font-semibold">No leads found</p>
              <p className="text-slate-300 text-sm">Try changing your search or filter</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    {[
                      { label: 'Name / Email', field: 'email' as keyof Lead },
                      { label: 'Role', field: 'role' as keyof Lead },
                      { label: 'Phone', field: 'whatsapp' as keyof Lead },
                      { label: 'Stage', field: 'stage' as keyof Lead },
                      { label: 'Follow-ups', field: null },
                      { label: 'Signed Up', field: 'created_at' as keyof Lead },
                    ].map(({ label, field }) => (
                      <th
                        key={label}
                        onClick={field ? () => toggleSort(field) : undefined}
                        className={`text-left px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap ${field ? 'cursor-pointer hover:text-slate-700 select-none' : ''}`}
                      >
                        <span className="flex items-center gap-1">
                          {label}
                          {field && <SortIcon field={field} />}
                        </span>
                      </th>
                    ))}
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map(lead => (
                    <tr
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className="hover:bg-orange-50/40 transition-colors cursor-pointer group"
                    >
                      {/* Name / Email */}
                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-900 text-sm">{lead.name || <span className="text-slate-400 font-normal italic">No name</span>}</p>
                        <p className="text-slate-400 text-xs">{lead.email}</p>
                      </td>
                      {/* Role */}
                      <td className="px-5 py-4">
                        {lead.role ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                            <Briefcase size={10} /> {lead.role}
                          </span>
                        ) : <span className="text-slate-300 text-xs">—</span>}
                      </td>
                      {/* Phone */}
                      <td className="px-5 py-4 text-slate-600 text-xs">{lead.whatsapp || <span className="text-slate-300">—</span>}</td>
                      {/* Stage */}
                      <td className="px-5 py-4"><StageBadge stage={lead.stage} /></td>
                      {/* Follow-ups */}
                      <td className="px-5 py-4">
                        <FollowupDots f1={lead.followup_1_at} f2={lead.followup_2_at} f3={lead.followup_3_at} />
                      </td>
                      {/* Date */}
                      <td className="px-5 py-4">
                        <p className="text-slate-600 text-xs">{fmtDate(lead.created_at)}</p>
                        <p className="text-slate-400 text-[10px]">{fmtTimeAgo(lead.created_at)}</p>
                      </td>
                      {/* Arrow */}
                      <td className="px-5 py-4">
                        <ChevronDown size={14} className="text-slate-300 group-hover:text-orange-400 -rotate-90 transition-colors" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="text-center text-[11px] text-slate-300 mt-6 font-medium">
          Avada Design Admin · {leads.length} total leads · Last refreshed {new Date().toLocaleTimeString()}
        </p>
      </div>

      {/* Lead Drawer */}
      {selectedLead && <LeadDrawer lead={selectedLead} onClose={() => setSelectedLead(null)} />}
    </div>
  );
};

// ─────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────
const AdminPage: React.FC = () => {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === '1');

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;
  return <Dashboard onLogout={() => setAuthed(false)} />;
};

export default AdminPage;
