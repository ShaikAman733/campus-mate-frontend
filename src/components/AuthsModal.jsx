// src/components/AuthsModal.jsx
import React, { useState, useEffect } from 'react';
import { 
  X, User, Lock, ChevronRight, GraduationCap, Briefcase, 
  Loader2, AlertCircle, IdCard, ArrowRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import guestIcon from '../assets/guest-avatar.png'; // Import Toast

const AuthModal = ({ isOpen, onClose, onLogin, canClose = true }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [role, setRole] = useState('student');
  
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');
  const [employeeId, setEmployeeId] = useState(''); 
  
  const [error, setError] = useState(''); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setError('');
      setUsername('');
      setPassword('');
      setEmployeeId('');
    }
  }, [isOpen, isRegistering, role]);

  if (!isOpen) return null;

  // --- FIXED: UNIQUE GUEST ID + TOAST NOTIFICATION ---
  const handleGuestAccess = () => {
    // 1. Trigger the Bottom Toast Notification
    toast.error("Guest Mode: Your history will not be saved.", {
        position: "bottom-center",
        duration: 4000,
        style: {
            background: '#333',
            color: '#fff',
            borderRadius: '10px',
            fontSize: '14px',
        },
        icon: '⚠️',
    });

    // 2. Generate a random unique string
    const uniqueId = Math.random().toString(36).substr(2, 9);
    
    // 3. Create a unique Guest User object
    const guestUser = {
      _id: `guest_${uniqueId}_${Date.now()}`, 
      username: `Guest`, 
      role: 'guest',
      isGuest: true,
      avatar: guestIcon
    };

    // 4. Pass this unique user to the parent
    if (onLogin) onLogin(guestUser);
    
    // 5. Close modal
    if (onClose) onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username.trim() || !password) {
        setError('Please enter Username and Password.');
        setLoading(false);
        return;
    }

    if (role === 'teacher' && isRegistering && !employeeId.trim()) {
        setError('Please enter your Employee ID.');
        setLoading(false);
        return;
    }

    const endpoint = isRegistering 
      ? 'https://campus-bot-node.onrender.com/api/register' 
      : 'https://campus-bot-node.onrender.com/api/login';

    try {
      const payload = { 
        username: username.trim(), 
        password,
        role: role === 'teacher' ? 'Teacher' : 'Student',
        ...(role === 'teacher' && isRegistering ? { employeeId: employeeId.trim() } : {})
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        let serverError = data.error || 'Authentication failed';
        let lowerError = serverError.toLowerCase();

        if (isRegistering) {
            if (lowerError.includes('exist') || lowerError.includes('duplicate')) {
                serverError = 'Account already exists. Please Login.';
            } else if (lowerError.includes('username')) {
                serverError = 'Try changing username.';
            }
        } else {
            if (lowerError.includes('found') || lowerError.includes('invalid') || lowerError.includes('match')) {
                serverError = 'No account found. Please Register.';
            }
        }
        throw new Error(serverError);
      }

      onLogin(data.user);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-[#0a0a0a] rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col animate-scale-in">
        
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#00B291] opacity-10 blur-[100px] pointer-events-none"></div>

        {/* Close Button */}
        <button onClick={handleGuestAccess} className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-all z-20 active:scale-90">
            <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="px-8 pt-10 pb-4 relative z-10 text-center">
          <div className="mx-auto flex items-center justify-center mb-5">
             <div className={`p-4 rounded-full border-2 ${role === 'student' ? 'border-[#00B291]/30 text-[#00B291]' : 'border-blue-500/30 text-blue-500'} bg-transparent transition-colors duration-300`}>
                {role === 'student' ? <GraduationCap className="w-10 h-10" strokeWidth={1.5} /> : <Briefcase className="w-10 h-10" strokeWidth={1.5} />}
             </div>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
            {isRegistering ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {isRegistering ? `Register as a ${role}` : `Login to your ${role} account`}
          </p>
        </div>

        <div className="px-8 pb-8 relative z-10">
          
          {/* Role Switcher */}
          <div className="relative bg-gray-100 dark:bg-[#1a1a1a] p-1.5 rounded-xl flex items-center mb-6 border border-gray-200 dark:border-gray-800">
            <div className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white dark:bg-[#2d2d2d] rounded-lg shadow-sm transition-all duration-300 ease-spring ${role === 'student' ? 'left-1.5' : 'left-[calc(50%+3px)]'}`}></div>
            <button type="button" onClick={() => setRole('student')} className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold uppercase tracking-wide transition-colors ${role === 'student' ? 'text-[#00B291]' : 'text-gray-500 dark:text-gray-400'}`}>Student</button>
            <button type="button" onClick={() => setRole('teacher')} className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold uppercase tracking-wide transition-colors ${role === 'teacher' ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'}`}>Faculty</button>
          </div>

          {error && <div className="mb-5 p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2 animate-shake"><AlertCircle className="w-4 h-4 shrink-0" />{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username */}
            <div className="group animate-slide-up">
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 ml-1 transition-colors group-focus-within:text-[#00B291]">Username</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00B291] transition-colors"><User className="w-5 h-5" /></div>
                <input 
                  type="text" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-[#00B291]/10 focus:border-[#00B291] outline-none transition-all dark:text-white placeholder:text-gray-400 font-medium text-sm" 
                  placeholder="e.g  'Zara'" 
                />
              </div>
            </div>

            {/* Password */}
            <div className="group animate-slide-up" style={{ animationDelay: '50ms' }}>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 ml-1 transition-colors group-focus-within:text-[#00B291]">Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00B291] transition-colors"><Lock className="w-5 h-5" /></div>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-[#00B291]/10 focus:border-[#00B291] outline-none transition-all dark:text-white placeholder:text-gray-400 font-medium text-sm" 
                  placeholder="Enter your password" 
                />
              </div>
            </div>

            {/* Employee ID */}
            {role === 'teacher' && isRegistering && (
              <div className="group animate-slide-up" style={{ animationDelay: '100ms' }}>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 ml-1 transition-colors group-focus-within:text-[#00B291]">Employee ID</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00B291] transition-colors"><IdCard className="w-5 h-5" /></div>
                  <input 
                    type="text" 
                    value={employeeId} 
                    onChange={(e) => setEmployeeId(e.target.value)} 
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-[#00B291]/10 focus:border-[#00B291] outline-none transition-all dark:text-white placeholder:text-gray-400 font-medium text-sm" 
                    placeholder="Enter Employee ID" 
                  />
                </div>
              </div>
            )}

            <button type="submit" disabled={loading} className={`w-full mt-4 py-4 rounded-xl text-white font-bold text-sm tracking-wide transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl ${role === 'student' ? 'bg-gradient-to-r from-[#00B291] to-[#009e80] shadow-[#00B291]/25' : 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-blue-500/25'}`}>
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{isRegistering ? 'Register' : 'Login'} <ChevronRight className="w-4 h-4" /></>}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="p-5 bg-gray-50 dark:bg-[#121212] border-t border-gray-100 dark:border-gray-800 text-center flex flex-col gap-3">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
            <button onClick={() => { setIsRegistering(!isRegistering); setError(''); }} className={`font-bold hover:underline ml-1 uppercase text-[10px] tracking-wider transition-colors ${role === 'student' ? 'text-[#00B291]' : 'text-blue-500'}`}>
              {isRegistering ? 'Login' : 'Register'}
            </button>
          </p>

          <div className="w-full pt-3 border-t border-gray-200 dark:border-gray-800">
            <button 
                type="button" 
                onClick={handleGuestAccess} 
                className="group flex items-center justify-center gap-1 mx-auto text-xs font-semibold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-all"
            >
                Continue as Guest 
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuthModal;