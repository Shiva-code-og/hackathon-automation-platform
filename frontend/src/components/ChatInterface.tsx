import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, User, Copy, Check, Bot, Terminal } from 'lucide-react';
import type { Message, ChatSession } from '../types';

interface ChatInterfaceProps {
  sessionId: string;
}

export const ChatInterface = ({ sessionId }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('agentops_sessions');
    if (saved) {
      const sessions = JSON.parse(saved) as ChatSession[];
      const current = sessions.find(s => s.id === sessionId);
      if (current) return current.messages;
    }
    return [{
      id: '1',
      role: 'assistant',
      content: 'Hello! I am your automation engineer. Describe the workflow you want to integrate, and I will generate the embed script for your application.'
    }];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('agentops_sessions');
    let loaded = false;
    if (saved) {
      const sessions = JSON.parse(saved) as ChatSession[];
      const current = sessions.find(s => s.id === sessionId);
      if (current) {
        setMessages(current.messages);
        loaded = true;
      }
    }
    if (!loaded) {
      setMessages([{
        id: '1',
        role: 'assistant',
        content: 'Hello! I am your automation engineer. Describe the workflow you want to integrate, and I will generate the embed script for your application.'
      }]);
    }
  }, [sessionId]);

  // Save to memory (localStorage) whenever messages change
  useEffect(() => {
    const saved = localStorage.getItem('agentops_sessions');
    let sessions: ChatSession[] = saved ? JSON.parse(saved) : [];
    
    const existingIndex = sessions.findIndex(s => s.id === sessionId);
    
    // Only save if we actually have some conversation (more than just the greeting)
    if (messages.length > 1 || existingIndex >= 0) {
      let title = "New Chat";
      if (messages.length > 1) {
        const firstUserMsg = messages.find(m => m.role === 'user');
        title = firstUserMsg ? firstUserMsg.content.substring(0, 30) + (firstUserMsg.content.length > 30 ? '...' : '') : "New Chat";
      }

      if (existingIndex >= 0) {
        sessions[existingIndex] = { ...sessions[existingIndex], messages, updatedAt: Date.now(), title };
      } else {
        sessions.push({ id: sessionId, title, updatedAt: Date.now(), messages });
      }
      localStorage.setItem('agentops_sessions', JSON.stringify(sessions));
      window.dispatchEvent(new Event('sessions-updated'));
    }
  }, [messages, sessionId]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Get manager's email from localStorage
      const savedProfile = localStorage.getItem('manager_profile');
      let managerEmail = null;
      if (savedProfile) {
        try {
          managerEmail = JSON.parse(savedProfile).email;
        } catch (e) {
          console.error("Failed to parse manager profile");
        }
      }

      // Hit the backend (supporting dynamic VITE_API_URL environment variable for production)
      const apiBaseUrl = import.meta.env.VITE_API_URL || '';
      const response = await axios.post(`${apiBaseUrl}/api/automations/generate-prompt`, { 
        userQuery: userMessage.content,
        managerEmail: managerEmail
      });
      
      const aiMessage: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: response.data.prompt,
        snippet: response.data.snippet
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Error communicating with the backend automation engine. Ensure the server is running.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#FFF8EF] w-full items-center">
      <div className="w-full flex items-center gap-2 px-6 py-4 border-b border-[#E8DCCB] bg-white sticky top-0 z-10 shadow-sm">
        <Terminal size={18} className="text-[#FF6B00]" />
        <span className="font-semibold text-gray-800 text-sm">
          Agentops
        </span>
      </div>

      {/* Chat Area */}
      <div className="flex-1 w-full max-w-3xl overflow-y-auto px-4 py-8 space-y-8 scroll-smooth">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-[#FF6B00] text-white' : 'bg-[#1F2937] text-white'}`}>
              {msg.role === 'user' ? <User size={18} /> : <Bot size={20} />}
            </div>
            
            <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className="text-sm font-medium text-gray-500 mb-1">
                {msg.role === 'user' ? 'You' : 'Agentops'}
              </div>
              
              <div className="text-[#1F2937] whitespace-pre-wrap leading-relaxed text-[15px]">
                {msg.content}
              </div>
              
              {msg.snippet && (
                <div className="w-full bg-white rounded-lg border border-[#F2E5D5] shadow-sm overflow-hidden text-left mt-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex justify-between items-center px-4 py-2 bg-[#F9F3EA] border-b border-[#F2E5D5]">
                    <span className="text-xs font-mono text-gray-500">integration-snippet.html</span>
                    <button 
                      onClick={() => copyToClipboard(msg.snippet!, msg.id)}
                      className="text-gray-500 hover:text-[#FF6B00] transition-colors flex items-center gap-1.5 text-xs font-medium"
                    >
                      {copiedId === msg.id ? <><Check size={14} className="text-emerald-500" /> Copied</> : <><Copy size={14} /> Copy code</>}
                    </button>
                  </div>
                  <div className="p-4 bg-[#1F2937]">
                    <pre className="text-sm font-mono text-gray-300 whitespace-pre-wrap break-words">
                      <code>{msg.snippet}</code>
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-4 mb-6">
              <div className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center flex-shrink-0">
                <Bot size={20} className="text-[#F9F3EA]" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-500 mb-1">Agentops</div>
                <div className="text-[#1F2937] leading-relaxed">
                  <div className="flex items-center gap-1.5 h-6">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
          </div>
        )}
        
        <div ref={endOfMessagesRef} className="h-4" />
      </div>

      {/* Input Area */}
      <div className="w-full max-w-3xl p-4 flex-shrink-0">
        <form onSubmit={handleSubmit} className="relative flex flex-col bg-white border border-[#F2E5D5] rounded-2xl shadow-sm focus-within:border-[#FF6B00] focus-within:ring-1 focus-within:ring-[#FF6B00] transition-all">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Reply to Agentops..."
            className="w-full bg-transparent text-[#1F2937] placeholder-gray-400 px-4 py-4 pr-12 rounded-2xl focus:outline-none resize-none min-h-[56px] max-h-48"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-3 bottom-3 p-1.5 rounded-lg bg-[#FF6B00] text-white hover:bg-[#E65A00] disabled:opacity-50 disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
