import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatInterface } from './components/ChatInterface';
import { AdminPanel } from './components/AdminPanel';
import { LoginPage } from './components/LoginPage';
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = "295953201021-6nejhkk8cf3t1e2rm6smdu4t87ofbrnf.apps.googleusercontent.com"; // User's real client ID

function App() {
  const [currentView, setCurrentView] = useState<'chat' | 'admin'>('chat');
  const [activeSessionId, setActiveSessionId] = useState<string>(() => Date.now().toString());
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem('manager_profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('manager_profile');
    setProfile(null);
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {!profile ? (
        <LoginPage onLoginSuccess={setProfile} />
      ) : (
        <div className="flex h-screen w-full bg-[#FFF8EF] text-[#1F2937] font-sans overflow-hidden selection:bg-[#FF6B00]/30">
          <Sidebar 
            currentView={currentView} 
            setView={setCurrentView} 
            profile={profile} 
            onLogout={handleLogout} 
            activeSessionId={activeSessionId}
            setActiveSessionId={setActiveSessionId}
          />
          
          <main className="flex-1 flex flex-col min-w-0">
            {currentView === 'chat' ? (
              <ChatInterface sessionId={activeSessionId} />
            ) : (
              <AdminPanel />
            )}
          </main>
        </div>
      )}
    </GoogleOAuthProvider>
  );
}

export default App;
