import React, { useState, useEffect } from 'react';
import { X, Download, Trash2, User } from 'lucide-react';
import { getLeads, clearLeads, Lead } from '../services/mockBackend';
import { PRICING_PLANS } from '../constants';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    if (isOpen) {
      setLeads(getLeads());
    }
  }, [isOpen]);

  const handleClear = () => {
    if (confirm("Are you sure you want to delete all leads?")) {
      clearLeads();
      setLeads([]);
    }
  };

  const handleDownload = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Phone,Plan,Date\n"
      + leads.map(l => `${l.phone},${l.planId},${new Date(l.date).toLocaleString()}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "avada_leads.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div>
            <h2 className="text-2xl font-display font-bold text-gray-900">Admin Dashboard</h2>
            <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Lead Management</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100 bg-white">
          <div className="text-sm text-gray-500">
            Total Leads: <span className="text-brand-primary font-bold">{leads.length}</span>
          </div>
          <div className="flex gap-2">
             <button 
               onClick={handleDownload}
               disabled={leads.length === 0}
               className="flex items-center gap-2 px-4 py-2 bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
             >
               <Download size={14} /> Export CSV
             </button>
             <button 
               onClick={handleClear}
               disabled={leads.length === 0}
               className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
             >
               <Trash2 size={14} /> Clear All
             </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-gray-50">
          {leads.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <User size={48} className="opacity-20" />
              <p>No transactions yet.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-500 uppercase text-[10px] tracking-wider font-semibold">
                  <tr>
                    <th className="px-6 py-3">User</th>
                    <th className="px-6 py-3">Plan Selected</th>
                    <th className="px-6 py-3">Time</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {leads.map((lead) => {
                     const plan = PRICING_PLANS.find(p => p.id === lead.planId);
                     return (
                      <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-mono text-gray-800">{lead.phone}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] border font-bold ${plan?.id === 'lifetime-plus' ? 'border-brand-primary/30 text-brand-primary bg-brand-primary/5' : 'border-gray-200 text-gray-500 bg-gray-100'}`}>
                            {plan ? plan.duration : lead.planId}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{new Date(lead.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-1.5 text-green-600 text-xs font-bold">
                             <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                             Intent
                          </span>
                        </td>
                      </tr>
                     );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};