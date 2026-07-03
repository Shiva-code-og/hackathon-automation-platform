import { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Zap, Database, Server } from 'lucide-react';

interface ActiveSession {
  id: string;
  timestamp: string;
  user: string;
  workflowName: string;
  stepStatus: string;
  type: 'auth' | 'workflow' | 'data';
}

const MOCK_SESSIONS = [
  { user: 'Client A (demo-123)', workflowName: 'Lead Generation Sync', stepStatus: 'Stage 1: Input Received', type: 'auth' },
  { user: 'System (Automated)', workflowName: 'Data Enrichment', stepStatus: 'Stage 2: Processing AI Extraction', type: 'data' },
  { user: 'Manager Review', workflowName: 'Invoice Approval', stepStatus: 'Stage 3: Manager Approved', type: 'workflow' },
  { user: 'Client B (prod-99x)', workflowName: 'Webhook Dispatch', stepStatus: 'Stage 4: n8n Workflow Dispatched Successfully', type: 'workflow' }
];

export const AdminPanel = () => {
  const [sessions, setSessions] = useState<ActiveSession[]>([]);

  useEffect(() => {
    let count = 0;
    
    setSessions([
      { id: '1', timestamp: new Date().toLocaleTimeString(), user: 'Admin User', workflowName: 'System Boot', stepStatus: 'Stage 0: Init', type: 'auth' }
    ]);

    const interval = setInterval(() => {
      if (count < MOCK_SESSIONS.length) {
        const newLog: ActiveSession = {
          id: Math.random().toString(36).substring(7),
          timestamp: new Date().toLocaleTimeString(),
          user: MOCK_SESSIONS[count].user,
          workflowName: MOCK_SESSIONS[count].workflowName,
          stepStatus: MOCK_SESSIONS[count].stepStatus,
          type: MOCK_SESSIONS[count].type as 'auth' | 'workflow' | 'data'
        };
        
        setSessions(prev => [newLog, ...prev].slice(0, 8));
        count++;
      } else {
        count = 0;
      }
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'auth': return <ShieldCheck size={16} className="text-[#60a5fa]" />;
      case 'workflow': return <Zap size={16} className="text-[#fbbf24]" />;
      case 'data': return <Database size={16} className="text-[#a78bfa]" />;
      default: return <Activity size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#FFF8EF] w-full items-center p-8 overflow-y-auto">
      <div className="w-full max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-medium text-[#1F2937] flex items-center gap-3">
              <Server className="text-[#FF6B00]" />
              Centralized Admin Panel
            </h2>
            <p className="text-gray-500 mt-1">Live monitoring of incoming runs streaming through the backend engine.</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-[#FF6B00] bg-[#FF6B00]/10 px-3 py-1.5 rounded-lg border border-[#FF6B00]/20">
            <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse"></span>
            Live Stream Active
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#F2E5D5] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-500 border-b border-[#F2E5D5] bg-[#F9F3EA] text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium w-40">Timestamp</th>
                  <th className="px-6 py-4 font-medium">User ID</th>
                  <th className="px-6 py-4 font-medium">Workflow Name</th>
                  <th className="px-6 py-4 font-medium">Step Status</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr key={session.id} className="border-b border-[#F2E5D5] bg-white hover:bg-[#F9F3EA] transition-colors animate-in fade-in duration-300">
                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">{session.timestamp}</td>
                    <td className="px-6 py-4 text-[#1F2937] text-sm font-medium">{session.user}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{session.workflowName}</td>
                    <td className="px-6 py-4 text-[#1F2937] text-sm">
                      <div className="flex items-center gap-2 bg-[#F9F3EA] w-fit px-3 py-1.5 rounded-md border border-[#F2E5D5]">
                        {getIcon(session.type)}
                        <span>{session.stepStatus}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
