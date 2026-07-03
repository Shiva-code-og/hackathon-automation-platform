import { useState, useEffect } from 'react';
import { Plus, MessageSquare, LayoutDashboard, Settings, LogOut } from 'lucide-react';

interface UserProfile {
  email: string;
  name: string;
  picture: string;
}

interface SidebarProps {
  currentView: 'chat' | 'admin';
  setView: (view: 'chat' | 'admin') => void;
  profile: UserProfile;
  onLogout: () => void;
  activeSessionId: string;
  setActiveSessionId: (id: string) => void;
}

export const Sidebar = ({ currentView, setView, profile, onLogout, activeSessionId, setActiveSessionId }: SidebarProps) => {
  const [sessions, setSessions] = useState<any[]>([]);

  const loadSessions = () => {
    const saved = localStorage.getItem('agentops_sessions');
    if (saved) {
      setSessions(JSON.parse(saved).sort((a: any, b: any) => b.updatedAt - a.updatedAt));
    } else {
      setSessions([]);
    }
  };

  useEffect(() => {
    loadSessions();
    window.addEventListener('sessions-updated', loadSessions);
    return () => window.removeEventListener('sessions-updated', loadSessions);
  }, []);
  return (
    <div className="w-64 bg-[#F9F3EA] border-r border-[#E8DCCB] h-full flex flex-col flex-shrink-0">
      <div className="p-4">
        <button 
          onClick={() => {
            setView('chat');
            setActiveSessionId(Date.now().toString());
          }}
          className="w-full flex items-center gap-2 bg-white border border-[#E8DCCB] shadow-sm hover:border-[#FF6B00] transition-colors text-[#1F2937] px-3 py-2 rounded-lg text-sm font-medium"
        >
          <Plus size={16} />
          New automation chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        <div className="mb-6">
          <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-4">
            Recent Chats
          </p>
          <div className="space-y-1">
            {sessions.map((s) => (
              <button 
                key={s.id}
                onClick={() => {
                  setView('chat');
                  setActiveSessionId(s.id);
                }}
                className={`w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-all truncate ${
                  activeSessionId === s.id ? 'bg-white shadow-sm text-[#FF6B00] border border-[#E8DCCB]' : 'text-[#1F2937] hover:bg-white hover:shadow-sm border border-transparent'
                }`}
              >
                <MessageSquare size={14} className={`flex-shrink-0 ${activeSessionId === s.id ? 'text-[#FF6B00]' : 'text-gray-400'}`} />
                {s.title}
              </button>
            ))}
            {sessions.length === 0 && (
              <div className="px-2 text-xs text-gray-400 italic">No saved chats yet.</div>
            )}
          </div>
        </div>
      </div>

      <div className="p-2 border-t border-[#E8DCCB]">
        <button 
          onClick={() => setView('chat')}
          className={`w-full text-left flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition-colors ${
            currentView === 'chat' ? 'bg-white shadow-sm text-[#FF6B00]' : 'text-[#1F2937] hover:bg-white hover:shadow-sm'
          }`}
        >
          <MessageSquare size={16} className={currentView === 'chat' ? 'text-[#FF6B00]' : 'text-gray-400'} />
          Chat Interface
        </button>
        <button 
          onClick={() => setView('admin')}
          className={`w-full text-left flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition-colors mt-1 ${
            currentView === 'admin' ? 'bg-white shadow-sm text-[#FF6B00]' : 'text-[#1F2937] hover:bg-white hover:shadow-sm'
          }`}
        >
          <LayoutDashboard size={16} className={currentView === 'admin' ? 'text-[#FF6B00]' : 'text-gray-400'} />
          Admin Panel
        </button>
        <button 
          onClick={() => {
            if(confirm("Are you sure you want to delete all saved chats?")) {
              localStorage.removeItem('agentops_sessions');
              setActiveSessionId(Date.now().toString());
              window.dispatchEvent(new Event('sessions-updated'));
            }
          }}
          className="w-full text-left flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-[#1F2937] hover:bg-white hover:shadow-sm transition-all mt-1 hover:text-red-500"
        >
          <Settings size={16} className="text-gray-400" />
          Clear All History
        </button>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-t border-[#E8DCCB] bg-white/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <img src={profile.picture} alt={profile.name} className="w-8 h-8 rounded-full border border-[#E8DCCB]" />
            <div className="flex flex-col truncate">
              <span className="text-sm font-medium text-[#1F2937] truncate">{profile.name}</span>
              <span className="text-xs text-gray-500 truncate">{profile.email}</span>
            </div>
          </div>
          <button onClick={onLogout} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
