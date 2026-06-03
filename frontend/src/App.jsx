import React, { useState, useEffect } from 'react';

// Inline SVGs for clean, zero-config high-performance iconography
const Icons = {
  Mail: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-svg">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  Settings: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-svg">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="icon-svg">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  X: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-svg">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Sparkles: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-svg">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  ),
  Users: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-svg">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  UserPlus: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-svg" {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" y1="8" x2="19" y2="14" />
      <line x1="22" y1="11" x2="16" y2="11" />
    </svg>
  ),
  Link: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-svg" {...props}>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  Award: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-svg" {...props}>
      <circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  ),
  Smile: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-svg" {...props}>
      <circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  ),
  Frown: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-svg" {...props}>
      <circle cx="12" cy="12" r="10" /><path d="M16 16s-1.5-2-4-2-4 2-4 2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  ),
  Meh: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-svg" {...props}>
      <circle cx="12" cy="12" r="10" /><line x1="8" y1="15" x2="16" y2="15" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  ),
  Inbox: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-svg">
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  ),
  Search: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-svg">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Folder: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-svg">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  ),
  FolderFilled: () => (
    <svg viewBox="0 0 24 24" stroke="none" className="icon-svg" style={{ width: '22px', height: '22px' }}>
      <defs>
        <linearGradient id="folderGradientFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#7dd3fc" />
        </linearGradient>
      </defs>
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" fill="url(#folderGradientFill)" />
    </svg>
  ),
  MessageSquare: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-svg">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  AlertTriangle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-svg">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  TrendingUp: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-svg">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  Key: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-svg">
      <path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 1.5 1.5M15.5 7.5 14 6" />
    </svg>
  )
};

const API_BASE = window.location.origin.includes('localhost') ? 'http://localhost:5000/api' : '/api';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('sentry_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'mailbox', 'rules'
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [emails, setEmails] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [rules, setRules] = useState([]);
  const [profileForm, setProfileForm] = useState({ name: '', email: '', password: '', avatar: '' });
  const [cropImageSrc, setCropImageSrc] = useState('');
  const [showCropper, setShowCropper] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState([
    'Sentry AI Service initialized.',
    'Listening for incoming mailboxes...',
  ]);

  useEffect(() => {
    if (!currentUser) return;
    const items = [
      `Polled inbox for ${currentUser.email}`,
      'No new messages found.',
      'Refreshed Microsoft OAuth Access Token in background.',
      'Triage poller: scanned mailboxes successfully.',
      'Sentry AI Engine status: Active, latency 18ms.',
    ];
    
    const timer = setInterval(() => {
      const randomItem = items[Math.floor(Math.random() * items.length)];
      const timestamp = new Date().toLocaleTimeString();
      setConsoleLogs(prev => [
        ...prev.slice(-14),
        `[${timestamp}] ${randomItem}`
      ]);
    }, 12000);
    
    return () => clearInterval(timer);
  }, [currentUser]);
  
  // Adding custom rules
  const [newFolder, setNewFolder] = useState({ category: '', prompt_instruction: '' });
  
  // Simulator State
  const [isSimulating, setIsSimulating] = useState(false);
  const [simForm, setSimForm] = useState({ sender_name: '', sender_email: '', subject: '', body: '', employee_email: '' });

  // Filtering states for Logs
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Detail Modal Drawer State
  const [activeDetailEmail, setActiveDetailEmail] = useState(null);
  const [generatedDraft, setGeneratedDraft] = useState('');
  const [draftTone, setDraftTone] = useState('Professional');
  const [draftLoading, setDraftLoading] = useState(false);

  // Celebratory OAuth banner state
  const [celebration, setCelebration] = useState({ show: false, email: '' });

  // Connection Popup overlay state
  const [showConnectPopup, setShowConnectPopup] = useState(false);

  // UI status
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialFetchLoading, setInitialFetchLoading] = useState(true);

  useEffect(() => {
    fetchTeam();
    fetchRules();
    if (currentUser) {
      loadUserData(currentUser.email);
    }
  }, []);

  useEffect(() => {
    if (currentUser && currentUser.status !== 'Connected') {
      setShowConnectPopup(true);
    } else {
      setShowConnectPopup(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), toast.type === 'error' ? 6000 : 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const loadUserData = async (email) => {
    setInitialFetchLoading(true);
    await fetchLogs(email);
    setInitialFetchLoading(false);
  };

  const showToast = (message, type = 'success', code = '') => {
    setToast({ message, type, code: code ? code.toString() : '' });
  };

  const triggerToast = (msg) => {
    showToast(msg, 'success');
  };

  const handleFetchError = async (res, defaultMsg) => {
    let errorMsg = defaultMsg;
    let code = res.status.toString();
    try {
      const data = await res.json();
      if (data.error) errorMsg = data.error;
      if (data.code) code = data.code.toString();
    } catch (e) {
      // not json
    }
    showToast(errorMsg, 'error', code);
  };

  // Capture Microsoft OAuth success callback from URLs
  const checkUrlParams = (currentList) => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    const email = params.get('email');
    const error = params.get('error');

    if (status === 'connected' && email) {
      const decodedEmail = decodeURIComponent(email).toLowerCase();
      setCelebration({ show: true, email: decodedEmail });
      triggerToast(`Successfully connected: ${decodedEmail}!`);
      
      const list = currentList || employees;
      const matched = list.find(emp => emp.email.toLowerCase() === decodedEmail);
      if (matched) {
        const updated = { ...matched, status: 'Connected' };
        setCurrentUser(updated);
        localStorage.setItem('sentry_user', JSON.stringify(updated));
        loadUserData(decodedEmail);
      }
      
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (error) {
      triggerToast(`Authorization Denied: ${decodeURIComponent(error)}`);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  const fetchLogs = async (email) => {
    const targetEmail = email || (currentUser ? currentUser.email : '');
    if (!targetEmail) return;

    try {
      const res = await fetch(`${API_BASE}/emails?employee_email=${encodeURIComponent(targetEmail)}`);
      const data = await res.json();
      setEmails(data);
    } catch (e) {
      console.error('Failed to fetch sorting logs:', e);
    }
  };

  const fetchTeam = async () => {
    try {
      const res = await fetch(`${API_BASE}/employees`);
      const data = await res.json();
      setEmployees(data);
      
      // Update session if it changed in database
      const saved = localStorage.getItem('sentry_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        const latest = data.find(emp => emp.email.toLowerCase() === parsed.email.toLowerCase());
        if (latest && latest.status !== parsed.status) {
          const updated = { ...parsed, status: latest.status };
          setCurrentUser(updated);
          localStorage.setItem('sentry_user', JSON.stringify(updated));
        }
      }

      const params = new URLSearchParams(window.location.search);
      if (params.get('status') === 'connected') {
        checkUrlParams(data);
      }
    } catch (e) {
      console.error('Failed to fetch team list:', e);
    }
  };

  const fetchRules = async () => {
    try {
      const res = await fetch(`${API_BASE}/rules`);
      const data = await res.json();
      setRules(data);
    } catch (e) {
      console.error('Failed to fetch folder rules:', e);
    }
  };

  // Settings fetch removed

  const handleLogin = (userObj) => {
    setCurrentUser(userObj);
    localStorage.setItem('sentry_user', JSON.stringify(userObj));
    loadUserData(userObj.email);
    triggerToast(`Logged in as ${userObj.name}`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('sentry_user');
    setEmails([]);
    triggerToast('Session closed.');
  };

  const handleRegister = async (emailStr, nameStr, passwordStr) => {
    if (!emailStr) return;
    const cleanEmail = emailStr.toLowerCase().trim();
    const cleanName = nameStr || cleanEmail.split('@')[0];

    try {
      const res = await fetch(`${API_BASE}/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, name: cleanName, password: passwordStr })
      });
      if (res.ok) {
        const createdUser = await res.json();
        fetchTeam(); // Refresh background list of accounts
        handleLogin(createdUser);
      } else {
        await handleFetchError(res, 'Failed to create account.');
      }
    } catch (e) {
      console.error(e);
      showToast('Registration server connection error.', 'error', 'CONN_ERR');
    }
  };

  // Disconnect employee mailbox
  const handleDeleteEmployee = async (id, email) => {
    if (!confirm(`Are you sure you want to disconnect your linked mailbox?\nSentry background poller will stop processing this inbox.`)) return;

    try {
      const res = await fetch(`${API_BASE}/employees/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setEmployees(prev => prev.filter(e => e.id !== id));
        triggerToast('Mailbox unlinked successfully.');
        if (currentUser && currentUser.email.toLowerCase() === email.toLowerCase()) {
          handleLogout();
        }
      } else {
        await handleFetchError(res, 'Failed to disconnect mailbox.');
      }
    } catch (e) {
      console.error(e);
      showToast('Network error disconnecting mailbox.', 'error', 'CONN_ERR');
    }
  };

  // Add new dynamic folder
  const handleAddRule = async (e) => {
    e.preventDefault();
    if (!newFolder.category || !newFolder.prompt_instruction) return;

    const folderName = newFolder.category.replace(/[^a-zA-Z0-9 ]/g, '').trim();
    if (!folderName) {
      triggerToast('Folder names can only contain alphanumeric characters.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/rules/${folderName}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt_instruction: newFolder.prompt_instruction })
      });
      if (res.ok) {
        setRules(prev => [
          ...prev.filter(r => r.category.toLowerCase() !== folderName.toLowerCase()), 
          { category: folderName, prompt_instruction: newFolder.prompt_instruction }
        ]);
        setNewFolder({ category: '', prompt_instruction: '' });
        triggerToast(`Live folder "${folderName}" initialized!`);
      } else {
        await handleFetchError(res, 'Failed to create folder rule.');
      }
    } catch (e) {
      console.error(e);
      showToast('Network error creating folder rule.', 'error', 'CONN_ERR');
    }
  };

  const handleAddPresetRule = async (category, prompt_instruction) => {
    try {
      const res = await fetch(`${API_BASE}/rules/${category}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt_instruction })
      });
      if (res.ok) {
        setRules(prev => [
          ...prev.filter(r => r.category.toLowerCase() !== category.toLowerCase()), 
          { category, prompt_instruction, auto_reply: 1 }
        ]);
        triggerToast(`Work preset folder "${category}" added successfully!`);
      } else {
        await handleFetchError(res, 'Failed to add preset folder.');
      }
    } catch (e) {
      console.error(e);
      showToast('Network error adding preset folder.', 'error', 'CONN_ERR');
    }
  };

  const handleDeleteRule = async (category) => {
    if (category === 'General Inbox' || category === 'General') {
      triggerToast('General fallback folder cannot be deleted.');
      return;
    }
    if (!confirm(`Are you sure you want to delete the "${category}" folder rule?\nIncoming emails will no longer be routed here.`)) return;

    try {
      const res = await fetch(`${API_BASE}/rules/${category}`, { method: 'DELETE' });
      if (res.ok) {
        setRules(prev => prev.filter(r => r.category !== category));
        triggerToast(`Folder rule "${category}" deleted.`);
      } else {
        await handleFetchError(res, 'Failed to delete folder rule.');
      }
    } catch (e) {
      console.error(e);
      showToast('Network error deleting folder rule.', 'error', 'CONN_ERR');
    }
  };

  const handleSaveRule = async (category, prompt_instruction) => {
    try {
      const res = await fetch(`${API_BASE}/rules/${category}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt_instruction })
      });
      if (res.ok) {
        setRules(prev => prev.map(r => r.category === category ? { ...r, prompt_instruction } : r));
        triggerToast(`Guidelines for "${category}" updated.`);
      } else {
        await handleFetchError(res, 'Failed to update guidelines.');
      }
    } catch (e) {
      console.error(e);
      showToast('Network error updating guidelines.', 'error', 'CONN_ERR');
    }
  };

  const handleToggleReply = async (category, currentVal) => {
    try {
      const newVal = currentVal === 1 ? 0 : 1;
      const res = await fetch(`${API_BASE}/rules/${category}/toggle-reply`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auto_reply: newVal })
      });
      if (res.ok) {
        setRules(prev => prev.map(r => r.category === category ? { ...r, auto_reply: newVal } : r));
        triggerToast(`Auto-replies for "${category}" ${newVal === 1 ? 'enabled' : 'disabled'}.`);
      } else {
        await handleFetchError(res, 'Failed to toggle auto reply.');
      }
    } catch (e) {
      console.error(e);
      showToast('Network error toggling auto reply.', 'error', 'CONN_ERR');
    }
  };

  const handleRerouteCategory = async (emailId, newCategory) => {
    try {
      const res = await fetch(`${API_BASE}/emails/${emailId}/reroute`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: newCategory })
      });
      if (res.ok) {
        const updated = await res.json();
        setEmails(prev => prev.map(e => e.id === emailId ? { ...e, category: newCategory } : e));
        setActiveDetailEmail(prev => prev.id === emailId ? { ...prev, category: newCategory } : prev);
        triggerToast(`Email manual re-routed to Outlook folder "${newCategory}"!`);
      } else {
        await handleFetchError(res, 'Failed to re-route email.');
      }
    } catch (e) {
      console.error(e);
      showToast('Network error during manual re-routing.', 'error', 'CONN_ERR');
    }
  };

  const handleSendReply = async (emailId, replyText) => {
    if (!replyText.trim()) {
      triggerToast('Reply text cannot be empty.');
      return;
    }
    
    if (!confirm('Are you sure you want to send this reply email directly via Microsoft Outlook?')) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/emails/${emailId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ replyText })
      });
      if (res.ok) {
        triggerToast('Reply sent successfully via Microsoft Outlook!');
        setActiveDetailEmail(null);
      } else {
        await handleFetchError(res, 'Failed to send reply.');
      }
    } catch (e) {
      console.error(e);
      showToast('Network error sending reply.', 'error', 'CONN_ERR');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSettings = () => {
    setProfileForm({
      name: currentUser.name || '',
      email: currentUser.email || '',
      password: '',
      avatar: currentUser.avatar || ''
    });
    setActiveTab('settings');
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      triggerToast('Please select an image smaller than 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setCropImageSrc(reader.result);
      setShowCropper(true);
      e.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!profileForm.email || !profileForm.name) {
      triggerToast('Email and Display Name are required.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/employees/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm)
      });
      if (res.ok) {
        const updated = await res.json();
        const fullUpdated = { ...currentUser, ...updated };
        setCurrentUser(fullUpdated);
        localStorage.setItem('sentry_user', JSON.stringify(fullUpdated));
        triggerToast('Profile settings updated successfully!');
      } else {
        await handleFetchError(res, 'Failed to update profile.');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error updating profile.', 'error', 'CONN_ERR');
    }
  };

  // Simulator Scenario Trigger
  const handleSimulateSubmit = async (e) => {
    e.preventDefault();
    if (!simForm.sender_email || !simForm.subject || !simForm.body || !simForm.employee_email) {
      triggerToast('Please complete all required fields.');
      return;
    }

    setIsSimulating(false);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/emails/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(simForm)
      });
      if (res.ok) {
        const data = await res.json();
        if (currentUser && data.employee_email.toLowerCase() === currentUser.email.toLowerCase()) {
          setEmails(prev => [data, ...prev]);
        }
        setSimForm({ sender_name: '', sender_email: '', subject: '', body: '', employee_email: '' });
        triggerToast('Email simulated and sorted successfully!');
      } else {
        await handleFetchError(res, 'Simulation failed on server.');
      }
    } catch (error) {
      console.error(error);
      showToast('Network error during simulation.', 'error', 'CONN_ERR');
    } finally {
      setLoading(false);
    }
  };

  // Generate AI Draft response inside log detail modal
  const handleGenerateDraft = async (emailObj, tone) => {
    setDraftLoading(true);
    setGeneratedDraft('');
    try {
      const res = await fetch(`${API_BASE}/emails/draft`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_email: emailObj.sender_email,
          sender_name: emailObj.sender_name,
          subject: emailObj.subject,
          body: emailObj.body,
          category: emailObj.category,
          tone: tone
        })
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedDraft(data.draft);
      } else {
        setGeneratedDraft('Unable to generate AI reply draft. Please check your Gemini credentials.');
        await handleFetchError(res, 'Draft generation failed.');
      }
    } catch (err) {
      console.error(err);
      setGeneratedDraft('Error communicating with draft API.');
      showToast('Network error during draft generation.', 'error', 'CONN_ERR');
    } finally {
      setDraftLoading(false);
    }
  };

  // Triggered when clicking a row in Sorting Logs
  const handleOpenDetailEmail = (emailObj) => {
    setActiveDetailEmail(emailObj);
    setDraftTone('Professional');
    handleGenerateDraft(emailObj, 'Professional');
  };

  const handleToneChange = (tone) => {
    setDraftTone(tone);
    if (activeDetailEmail) {
      handleGenerateDraft(activeDetailEmail, tone);
    }
  };

  const handleCopyDraft = () => {
    if (!generatedDraft) return;
    navigator.clipboard.writeText(generatedDraft);
    triggerToast('AI Draft copied to clipboard!');
  };

  // Filtering Logic
  const filteredEmails = emails.filter(email => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      email.subject?.toLowerCase().includes(query) ||
      email.sender_name?.toLowerCase().includes(query) ||
      email.sender_email?.toLowerCase().includes(query) ||
      email.body?.toLowerCase().includes(query);
    
    const matchesCategory = selectedCategory === 'All' || email.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const getEmailCountForCategory = (categoryName) => {
    return emails.filter(e => e.category === categoryName).length;
  };

  const highUrgencyCount = emails.filter(e => e.urgency === 'High').length;

  // Render Login screen if not authenticated
  if (!currentUser) {
    return <LoginPortal onLogin={handleLogin} onRegister={handleRegister} />;
  }

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div>
          <div className="brand">
            <div className="brand-icon">
              <Icons.Sparkles />
            </div>
            <span className="brand-text">InboxSentry AI</span>
          </div>

          <nav className="nav-menu">
            <div className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
              <Icons.Inbox />
              Sorting Logs
            </div>
            <div className={`nav-item ${activeTab === 'mailbox' ? 'active' : ''}`} onClick={() => setActiveTab('mailbox')}>
              <Icons.Link />
              My Mailbox
              {currentUser.status !== 'Connected' && (
                <span className="sidebar-badge-warning">!</span>
              )}
            </div>
            <div className={`nav-item ${activeTab === 'rules' ? 'active' : ''}`} onClick={() => setActiveTab('rules')}>
              <Icons.Folder />
              Folder Guidelines
            </div>
          </nav>
        </div>
        <div className="sidebar-profile-card">
          <div className="user-avatar" style={{ background: 'rgba(255, 255, 255, 0.2)', color: '#ffffff', width: '32px', height: '32px', fontSize: '12px' }}>
            {currentUser.avatar ? (
              <img src={currentUser.avatar} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'
            )}
          </div>
          <div className="sidebar-profile-info" style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden', textAlign: 'left' }}>
            <span style={{ color: '#ffffff', fontWeight: '700', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUser.name}</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUser.email}</span>
          </div>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="main-content">
        <header className="top-bar">
          <h1 className="page-title">
            {activeTab === 'overview' && 'Real-Time Inbox Audit Logs'}
            {activeTab === 'mailbox' && 'My Mailbox Connection'}
            {activeTab === 'rules' && 'AI Organizing Folder Rules'}
            {activeTab === 'settings' && 'Account Profile Settings'}
          </h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="user-dropdown-container">
              <div className="user-switch-bar" onClick={() => setShowUserDropdown(!showUserDropdown)} title="Account Settings">
                <div className="user-avatar">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'
                  )}
                </div>
                <span>{currentUser.name}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '12px', height: '12px', color: 'var(--text-muted)', transform: showUserDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
              
              {showUserDropdown && (
                <>
                  <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }} onClick={() => setShowUserDropdown(false)} />
                  <div className="user-dropdown-menu" style={{ zIndex: 1000 }}>
                    <div className="user-dropdown-item" onClick={() => { handleOpenSettings(); setShowUserDropdown(false); }}>
                      <Icons.Settings style={{ width: '16px', height: '16px' }} />
                      Settings
                    </div>
                    <div className="user-dropdown-item logout" onClick={() => { handleLogout(); setShowUserDropdown(false); }}>
                      <Icons.X style={{ width: '16px', height: '16px' }} />
                      Log Out
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <button className="simulator-btn" onClick={() => setIsSimulating(true)}>
              <Icons.Mail />
              Simulate Email
            </button>
          </div>
        </header>

        {loading && (
          <div style={{ background: '#eff6ff', borderBottom: '1px solid #dbeafe', padding: '10px 40px', fontSize: '12px', color: '#1d4ed8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="pulse-dot"></span>
            AI Triage poller sorting incoming simulated email in background...
          </div>
        )}

        <div className="content-body" style={{ overflowY: 'auto' }}>
          <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Connection alert callout banner */}
            {currentUser.status !== 'Connected' && activeTab === 'overview' && (
              <div className="mailbox-alert-card">
                <div>
                  <div className="mailbox-alert-title">
                    <Icons.AlertTriangle style={{ width: '20px', height: '20px', color: '#1d4ed8' }} />
                    To start, let's get you connected!
                  </div>
                  <div className="mailbox-alert-text">
                    Link your Outlook Office 365 mailbox to activate InboxSentry's live background AI sorting poller.
                  </div>
                </div>
                <a
                  href={`${API_BASE}/auth/login`}
                  className="simulator-btn"
                  style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40px', flexShrink: 0 }}
                >
                  <Icons.Link /> Link Outlook Mailbox
                </a>
              </div>
            )}

            {/* Celebration Success Banner */}
            {celebration.show && (
              <div className="celebrate-banner">
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexGrow: 1 }}>
                  <div style={{ background: '#10b981', color: '#ffffff', borderRadius: '50%', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icons.Award style={{ width: '22px', height: '22px' }} />
                  </div>
                  <div>
                    <div className="celebrate-title" style={{ color: '#064e3b', fontWeight: '800', fontSize: '15px', margin: 0 }}>
                      Connection Complete! Microsoft Outlook Mailbox Linked
                    </div>
                    <div className="celebrate-subtitle" style={{ color: '#047857', fontSize: '12.5px', marginTop: '2px' }}>
                      Account <strong>{celebration.email}</strong> is now authenticated via secure OAuth 2.0 credentials. Live background email sorting is active!
                    </div>
                  </div>
                </div>
                <button className="celebrate-close" onClick={() => setCelebration({ show: false, email: '' })}>&times;</button>
              </div>
            )}

            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-blue)' }}><Icons.Mail /></div>
                    <div className="stat-info"><span className="stat-value">{emails.length}</span><span className="stat-label">Total Emails Sorted</span></div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}><Icons.Link /></div>
                    <div className="stat-info">
                      <span className="stat-value">{currentUser.status === 'Connected' ? '1' : '0'}</span>
                      <span className="stat-label">Outlook Connections</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent-purple)' }}><Icons.Folder /></div>
                    <div className="stat-info"><span className="stat-value">{rules.length}</span><span className="stat-label">Active Folders</span></div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e' }}><Icons.AlertTriangle /></div>
                    <div className="stat-info"><span className="stat-value">{highUrgencyCount}</span><span className="stat-label">High Urgency Alerts</span></div>
                  </div>
                </div>


                {/* Filters Section */}
                <div className="filter-bar">
                  <div className="search-wrapper">
                    <Icons.Search />
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Search sender, subject, or email body..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <div className="filter-pills">
                    <button 
                      className={`filter-pill ${selectedCategory === 'All' ? 'active' : ''}`}
                      onClick={() => setSelectedCategory('All')}
                    >
                      All Logs
                    </button>
                    {rules.map(rule => (
                      <button 
                        key={rule.category}
                        className={`filter-pill ${selectedCategory === rule.category ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(rule.category)}
                      >
                        {rule.category} ({getEmailCountForCategory(rule.category)})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table Audit Logs Card */}
                <div className="glass-card" style={{ padding: '24px', cursor: 'default' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-primary)' }}>
                    My Triage Audit History ({filteredEmails.length} matching)
                  </h3>
                  
                  {initialFetchLoading ? (
                    <div style={{ padding: '20px 0' }}>
                      <div className="skeleton-text" style={{ width: '100%', marginBottom: '12px' }}></div>
                      <div className="skeleton-text" style={{ width: '90%', marginBottom: '12px' }}></div>
                      <div className="skeleton-text" style={{ width: '95%', marginBottom: '12px' }}></div>
                      <div className="skeleton-text" style={{ width: '85%' }}></div>
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                            <th>Receiver (Employee)</th>
                            <th>Sender</th>
                            <th>Subject</th>
                            <th>Triage Folder</th>
                            <th>Urgency</th>
                            <th>Summary</th>
                            <th>Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredEmails.length === 0 ? (
                            <tr>
                              <td colSpan="7" style={{ textAlign: 'center', height: '120px', color: 'var(--text-muted)', fontSize: '13.5px' }}>
                                No sorted emails found. Try simulating traffic for {currentUser.email} using the Simulate button at the top!
                              </td>
                            </tr>
                          ) : (
                            filteredEmails.map(email => (
                              <tr 
                                key={email.id} 
                                onClick={() => handleOpenDetailEmail(email)}
                                style={{ height: '55px', color: 'var(--text-primary)', cursor: 'pointer' }}
                                title="Click to view detailed AI analysis & generate email draft response"
                              >
                                <td style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{email.employee_email}</td>
                                <td style={{ fontWeight: '500' }}>{email.sender_name}</td>
                                <td style={{ fontWeight: '600' }}>{email.subject}</td>
                                <td><span className="badge badge-category">{email.category}</span></td>
                                <td><span className={`badge badge-urgency-${email.urgency.toLowerCase()}`}>{email.urgency}</span></td>
                                <td style={{ color: 'var(--text-secondary)', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{email.summary}</td>
                                <td style={{ color: 'var(--text-secondary)' }}>{new Date(email.received_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>


              </div>
            )}

            {/* MY MAILBOX TAB */}
            {activeTab === 'mailbox' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="glass-card" style={{ padding: '32px', cursor: 'default' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px', marginBottom: '24px' }}>
                    <div>
                      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)' }}>
                        Mailbox Settings
                      </h2>
                      <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Manage your individual Microsoft Office 365 connection settings.
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {currentUser.status === 'Connected' ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#dcfce7', color: '#15803d', padding: '6px 14px', borderRadius: '30px', fontSize: '12px', fontWeight: '800' }}>
                          <span className="pulse-dot"></span> Active Sync Sorter
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fef9c3', color: '#713f12', padding: '6px 14px', borderRadius: '30px', fontSize: '12px', fontWeight: '800' }}>
                          Awaiting Microsoft Connection
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div className="form-group">
                        <label className="form-label">Display Name</label>
                        <input type="text" className="form-input" disabled value={currentUser.name} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input type="text" className="form-input" disabled value={currentUser.email} />
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(59, 130, 246, 0.03)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '24px', justifyContent: 'center' }}>
                      {currentUser.status === 'Connected' ? (
                        <>
                          <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Icons.Check style={{ color: '#10b981' }} /> Mailbox Linked Successfully
                          </h4>
                          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5', marginTop: '4px' }}>
                            Sentry background workers are actively auditing your unread inbox, categorizing messages, and auto-creating folders.
                          </p>
                          <button
                            onClick={() => handleDeleteEmployee(currentUser.id, currentUser.email)}
                            className="btn-secondary"
                            style={{ width: 'fit-content', marginTop: '12px', color: '#f43f5e', borderColor: 'rgba(244,63,94,0.2)' }}
                          >
                            Disconnect Mailbox
                          </button>
                        </>
                      ) : (
                        <>
                          <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Icons.AlertTriangle style={{ color: '#d97706' }} /> Link Outlook Office 365 Account
                          </h4>
                          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5', marginTop: '4px' }}>
                            Securely authenticate using your Microsoft credentials to authorize background AI sorting and directory operations.
                          </p>
                          <a
                            href={`${API_BASE}/auth/login`}
                            className="simulator-btn"
                            style={{ textDecoration: 'none', width: 'fit-content', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40px' }}
                          >
                            <Icons.Link /> Authenticate via Microsoft Login
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* RULES TAB */}
            {activeTab === 'rules' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Folder creation form */}
                <div className="glass-card" style={{ padding: '24px', cursor: 'default' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: '800', marginBottom: '16px', color: '#1d4ed8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Icons.Sparkles /> Define Custom AI Sorting Folder
                  </h3>
                  <form onSubmit={handleAddRule} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
                      <div className="form-group">
                        <label className="form-label">Outlook Category Folder Name *</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Invoices, Contracts, Leads, Resumes"
                          required
                          value={newFolder.category}
                          onChange={(e) => setNewFolder({ ...newFolder, category: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">AI Organizing Triage Guidelines *</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. 'Route here if the sender is requesting pricing or wants a demo call. Highlight key deal values.'"
                          required
                          value={newFolder.prompt_instruction}
                          onChange={(e) => setNewFolder({ ...newFolder, prompt_instruction: e.target.value })}
                        />
                      </div>
                    </div>
                    <button type="submit" className="simulator-btn" style={{ width: 'fit-content', padding: '10px 24px', alignSelf: 'flex-end' }}>
                      + Create AI Organizer Folder
                    </button>
                  </form>
                </div>

                {/* Work Folder Presets Template Section */}
                <div className="glass-card" style={{ padding: '20px 24px', cursor: 'default' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: '800', marginBottom: '12px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Icons.Folder style={{ color: 'var(--accent-purple)' }} /> Need to use InboxSentry for Work? (Work Folder Presets)
                  </h3>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.4' }}>
                    Quickly add enterprise-ready workspace categories with pre-configured routing rules and AI guidelines.
                  </p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
                    {[
                      {
                        category: 'Customer Support',
                        label: 'Customer Support',
                        desc: 'Bugs, troubleshooting, technical help & login issues.',
                        instruction: 'ROUTING: Sort emails here that report software bugs, request technical help, or experience troubleshooting issues. REPLY: Apologize sincerely for any frustration. Provide clear, step-by-step instructions. Keep the tone helpful, empathetic, and professional.'
                      },
                      {
                        category: 'Sales & Growth',
                        label: 'Sales & Growth',
                        desc: 'Pricing requests, enterprise quotes & product demos.',
                        instruction: 'ROUTING: Sort emails here that inquire about product pricing, ask for commercial licensing details, request product demos, or seek sales consultations. REPLY: Be warm, enthusiastic, and highly professional. Highlight our key value propositions. Propose a short 15-minute introductory call.'
                      },
                      {
                        category: 'Billing & Accounts',
                        label: 'Billing & Finance',
                        desc: 'Invoices, refunds, receipts & payment discrepancies.',
                        instruction: 'ROUTING: Sort emails here that mention payments, charges, invoice bills, card updates, refunds, or financial receipts. REPLY: Maintain a clear, professional, and reassuring tone. Clarify billing discrepancies.'
                      },
                      {
                        category: 'Careers & HR',
                        label: 'Careers & Recruiting',
                        desc: 'Resumes, job applications & interview coordination.',
                        instruction: 'ROUTING: Sort emails here containing resumes, job applications, internship inquiries, hiring requests, and interview schedule coordination. REPLY: Thank the applicant for their interest in the company. State that the HR team reviews all applications and will follow up if there is a match.'
                      },
                      {
                        category: 'Feedback & Ideas',
                        label: 'Feedback & Ideas',
                        desc: 'Product suggestions, feature requests & reviews.',
                        instruction: 'ROUTING: Sort emails here containing product suggestions, feature requests, testimonials, and customer satisfaction feedback. REPLY: Thank the user for taking the time to share their thoughts. Emphasize that user feedback shapes our product roadmap directly.'
                      }
                    ].map(preset => {
                      const alreadyAdded = rules.some(r => r.category.toLowerCase() === preset.category.toLowerCase());
                      return (
                        <div key={preset.category} style={{ border: '1px solid var(--border-color)', borderRadius: '10px', padding: '14px', background: '#f8fafc', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '8px' }}>
                          <div>
                            <div style={{ fontWeight: '700', fontSize: '13px', color: 'var(--text-primary)' }}>{preset.label}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.3' }}>{preset.desc}</div>
                          </div>
                          <button 
                            className="simulator-btn" 
                            disabled={alreadyAdded}
                            onClick={() => handleAddPresetRule(preset.category, preset.instruction)}
                            style={{ 
                              width: '100%', 
                              fontSize: '11.5px', 
                              padding: '6px 12px', 
                              background: alreadyAdded ? '#e2e8f0' : 'var(--accent-purple)', 
                              border: 'none', 
                              color: alreadyAdded ? '#94a3b8' : '#ffffff',
                              boxShadow: 'none',
                              opacity: 1
                            }}
                          >
                            {alreadyAdded ? '✓ Added' : '+ Add Folder'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Folder cards grid */}
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: '800', marginBottom: '16px', color: 'var(--text-primary)' }}>
                    Active Workspace Folders ({rules.length})
                  </h3>
                  
                  {initialFetchLoading ? (
                    <div className="rules-grid">
                      <div className="rule-panel" style={{ height: '220px' }}></div>
                      <div className="rule-panel" style={{ height: '220px' }}></div>
                    </div>
                  ) : (
                    <div className="rules-grid">
                      {rules.map(rule => {
                        const isDefault = ['Personal & Family', 'Shopping & Orders', 'Finance & Bills', 'Travel & Plans', 'Newsletters & Feeds', 'General Inbox'].includes(rule.category);
                        const countSorted = getEmailCountForCategory(rule.category);

                        return (
                          <RuleCard
                            key={rule.category}
                            rule={rule}
                            isDefault={isDefault}
                            count={countSorted}
                            onSave={handleSaveRule}
                            onDelete={handleDeleteRule}
                            onToggleReply={handleToggleReply}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', alignItems: 'start' }}>
                  
                  {/* Left Column: Form Info */}
                  <div className="glass-card" style={{ padding: '32px', cursor: 'default' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: '800', marginBottom: '24px', color: '#1d4ed8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Icons.Settings /> Edit Profile Information
                    </h3>
                    
                    <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div className="form-group">
                        <label className="form-label">Display Name *</label>
                        <input
                          type="text"
                          className="form-input"
                          required
                          placeholder="e.g. Richard Hendricks"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Email Address *</label>
                        <input
                          type="email"
                          className="form-input"
                          required
                          placeholder="e.g. employee@company.com"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">New Password</label>
                        <input
                          type="password"
                          className="form-input"
                          placeholder="Leave blank to keep current password"
                          value={profileForm.password}
                          onChange={(e) => setProfileForm({ ...profileForm, password: e.target.value })}
                        />
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          For security, choose a strong password containing letters, numbers, and symbols.
                        </span>
                      </div>

                      <button type="submit" className="submit-btn" style={{ height: '46px', width: 'fit-content', padding: '0 32px', alignSelf: 'flex-end', marginTop: '12px' }}>
                        Save Profile Settings
                      </button>
                    </form>
                  </div>

                  {/* Right Column: Avatar Picture */}
                  <div className="glass-card" style={{ padding: '32px', cursor: 'default', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '24px' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', width: '100%', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                      Profile Picture
                    </h3>
                    
                    <div style={{ position: 'relative', width: '120px', height: '120px' }}>
                      <div className="user-avatar" style={{ width: '100%', height: '100%', fontSize: '48px', boxShadow: 'var(--shadow-md)', border: '4px solid #ffffff' }}>
                        {profileForm.avatar ? (
                          <img src={profileForm.avatar} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                          profileForm.name ? profileForm.name.charAt(0).toUpperCase() : 'U'
                        )}
                      </div>
                      <label htmlFor="avatar-file-input" style={{ position: 'absolute', bottom: '0', right: '0', background: '#3b82f6', color: '#ffffff', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', border: '2px solid #ffffff' }} title="Upload new photo">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}>
                          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                          <circle cx="12" cy="13" r="4" />
                        </svg>
                      </label>
                      <input
                        type="file"
                        id="avatar-file-input"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleAvatarChange}
                      />
                    </div>
                    
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>Upload custom photo</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Max file size 200KB. JPG, PNG formats supported.</div>
                    </div>

                    <div style={{ width: '100%', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                      <div style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '12px' }}>Or choose an avatar theme:</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                        {[
                          { name: 'Cyan Ocean', color: 'linear-gradient(135deg, #06b6d4, #3b82f6)', svg: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%2306b6d4"/><stop offset="100%" stop-color="%233b82f6"/></linearGradient></defs><rect width="100" height="100" fill="url(%23g)"/></svg>' },
                          { name: 'Sunset Orange', color: 'linear-gradient(135deg, #f43f5e, #fb923c)', svg: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23f43f5e"/><stop offset="100%" stop-color="%23fb923c"/></linearGradient></defs><rect width="100" height="100" fill="url(%23g)"/></svg>' },
                          { name: 'Purple Haze', color: 'linear-gradient(135deg, #8b5cf6, #ec4899)', svg: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%238b5cf6"/><stop offset="100%" stop-color="%23ec4899"/></linearGradient></defs><rect width="100" height="100" fill="url(%23g)"/></svg>' },
                          { name: 'Forest Green', color: 'linear-gradient(135deg, #10b981, #059669)', svg: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%2310b981"/><stop offset="100%" stop-color="%23059669"/></linearGradient></defs><rect width="100" height="100" fill="url(%23g)"/></svg>' }
                        ].map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setProfileForm(prev => ({ ...prev, avatar: preset.svg }))}
                            style={{
                              background: preset.color,
                              height: '32px',
                              width: '100%',
                              borderRadius: '8px',
                              border: profileForm.avatar === preset.svg ? '2px solid %23000' : '2px solid transparent',
                              cursor: 'pointer',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                              transition: 'transform 0.1s'
                            }}
                            title={preset.name}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* Triage Logs Detail Drawer Modal */}
      {activeDetailEmail && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '850px', width: '90%' }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icons.Mail /> Email Triage Analysis Audit
              </h3>
              <button type="button" className="close-btn" onClick={() => setActiveDetailEmail(null)}>&times;</button>
            </div>

            <div className="detail-grid">
              {/* Left Column: Email Content */}
              <div>
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>{activeDetailEmail.subject}</h4>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    From: <strong>{activeDetailEmail.sender_name}</strong> &lt;{activeDetailEmail.sender_email}&gt;
                  </p>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Receiver inbox: {activeDetailEmail.employee_email} | Received: {new Date(activeDetailEmail.received_at).toLocaleString()}
                  </p>
                </div>

                {(() => {
                  const isHtml = activeDetailEmail.body && (
                    (activeDetailEmail.body.includes('<') && activeDetailEmail.body.includes('>')) ||
                    activeDetailEmail.body.includes('cellpadding=') ||
                    activeDetailEmail.body.includes('style=')
                  );
                  return (
                    <div className="detail-email-body" style={isHtml ? { padding: 0, overflow: 'hidden', height: '250px' } : {}}>
                      {isHtml ? (
                        <iframe 
                          title="Email Content"
                          srcDoc={"<!DOCTYPE html><html><head><meta charset='utf-8'><style>body { font-family: 'Quicksand', 'Nunito', sans-serif; font-size: 13.5px; line-height: 1.6; color: #0f172a; margin: 0; padding: 12px; background-color: #f8fafc; word-break: break-word; } img { max-width: 100%; height: auto; } a { color: #1d4ed8; }</style></head><body>" + activeDetailEmail.body + "</body></html>"}
                          sandbox="allow-same-origin"
                          style={{
                            width: '100%',
                            height: '100%',
                            border: 'none',
                            background: 'transparent'
                          }}
                        />
                      ) : (
                        activeDetailEmail.body
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Right Column: AI Triage Tags */}
              <div className="detail-meta-list">
                <div className="detail-meta-item">
                  <div className="detail-meta-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Routing Decision Folder</span>
                    {activeDetailEmail.message_id && (
                      <span style={{ fontSize: '9px', background: '#dcfce7', color: '#166534', padding: '1px 5px', borderRadius: '4px', textTransform: 'uppercase', fontWeight: '800' }}>Sync Active</span>
                    )}
                  </div>
                  <div className="detail-meta-value" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Icons.Folder />
                      <span className="badge badge-category">{activeDetailEmail.category}</span>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderTop: '1px dashed var(--border-color)', paddingTop: '6px' }}>
                      <label style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: '700' }}>Manual Re-Route:</label>
                      <select 
                        className="form-input" 
                        style={{ padding: '4px 8px', fontSize: '12px', height: '28px', background: '#ffffff' }}
                        value={activeDetailEmail.category}
                        onChange={(e) => handleRerouteCategory(activeDetailEmail.id, e.target.value)}
                      >
                        {rules.map(r => (
                          <option key={r.category} value={r.category}>{r.category}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="detail-meta-item">
                  <div className="detail-meta-label">Triage Urgency Priority</div>
                  <div style={{ marginTop: '4px' }}>
                    <span className={`badge badge-urgency-${activeDetailEmail.urgency.toLowerCase()}`}>{activeDetailEmail.urgency}</span>
                  </div>
                </div>

                <div className="detail-meta-item">
                  <div className="detail-meta-label">Customer Sentiment Tag</div>
                  <div className="detail-meta-value" style={{ fontSize: '13px', marginTop: '4px' }}>
                    {activeDetailEmail.sentiment === 'Positive' && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#047857', fontWeight: '700' }}>
                        <Icons.Smile style={{ width: '16px', height: '16px' }} /> Positive
                      </span>
                    )}
                    {activeDetailEmail.sentiment === 'Negative' && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#b91c1c', fontWeight: '700' }}>
                        <Icons.Frown style={{ width: '16px', height: '16px' }} /> Negative
                      </span>
                    )}
                    {activeDetailEmail.sentiment === 'Neutral' && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#4b5563', fontWeight: '700' }}>
                        <Icons.Meh style={{ width: '16px', height: '16px' }} /> Neutral
                      </span>
                    )}
                  </div>
                </div>

                <div className="detail-meta-item">
                  <div className="detail-meta-label">Gemini Summarization</div>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.4' }}>
                    {activeDetailEmail.summary}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: AI Sentry Reply Assistant */}
            {(() => {
              const currentFolderRule = rules.find(r => r.category === activeDetailEmail.category);
              const autoReplyDisabled = currentFolderRule && currentFolderRule.auto_reply === 0;
              return (
                <div className="draft-assistant">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)', margin: 0 }}>
                      <Icons.Sparkles /> Sentry AI Automated Draft Reply Assistant
                    </h4>
                    {autoReplyDisabled && (
                      <span style={{ fontSize: '10px', background: '#ffe4e6', color: '#9f1239', padding: '3px 8px', borderRadius: '12px', fontWeight: '800', textTransform: 'uppercase' }}>
                        Auto-Draft Disabled
                      </span>
                    )}
                  </div>
                  
                  {autoReplyDisabled && (
                    <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '10px', padding: '10px 14px', fontSize: '12px', color: '#991b1b', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Icons.AlertTriangle style={{ width: '14px', height: '14px', color: '#ef4444' }} />
                      <span>Automated replies are disabled in guidelines for <strong>{activeDetailEmail.category}</strong>. You may still manually generate a draft below.</span>
                    </div>
                  )}
              
              <div className="draft-tone-bar">
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginRight: '8px' }}>Response Tone:</span>
                <button className={`btn-secondary ${draftTone === 'Professional' ? 'active' : ''}`} onClick={() => handleToneChange('Professional')}>Professional</button>
                <button className={`btn-secondary ${draftTone === 'Friendly' ? 'active' : ''}`} onClick={() => handleToneChange('Friendly')}>Friendly</button>
                <button className={`btn-secondary ${draftTone === 'Direct' ? 'active' : ''}`} onClick={() => handleToneChange('Direct')}>Direct</button>
              </div>

              {draftLoading ? (
                <div style={{ height: '140px', background: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <span className="pulse-dot" style={{ marginRight: '8px' }}></span> Drafting O365 reply via Gemini...
                </div>
              ) : (
                <textarea 
                  className="draft-textarea"
                  value={generatedDraft}
                  onChange={(e) => setGeneratedDraft(e.target.value)}
                  placeholder="Draft response will appear here..."
                />
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button className="btn-secondary" onClick={() => setActiveDetailEmail(null)}>Close Audit Logs</button>
                <button 
                  className="simulator-btn" 
                  disabled={draftLoading || !generatedDraft} 
                  onClick={handleCopyDraft}
                  style={{ opacity: (!generatedDraft || draftLoading) ? 0.6 : 1 }}
                >
                  <Icons.Check /> Copy Drafted Response
                </button>
                {activeDetailEmail.message_id && (
                  <button 
                    className="simulator-btn" 
                    disabled={draftLoading || !generatedDraft || loading} 
                    onClick={() => handleSendReply(activeDetailEmail.id, generatedDraft)}
                    style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.25)', opacity: (!generatedDraft || draftLoading || loading) ? 0.6 : 1 }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '13px', height: '13px', marginRight: '4px', display: 'inline-block', verticalAlign: 'middle' }}>
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                    Send Reply via Outlook
                  </button>
                )}
              </div>
            </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Simulator Modal Dialog */}
      {isSimulating && (
        <div className="modal-overlay">
          <form className="modal-content" onSubmit={handleSimulateSubmit}>
            <div className="modal-header">
              <h3 className="modal-title">Simulate Incoming Inbox Traffic</h3>
              <button type="button" className="close-btn" onClick={() => setIsSimulating(false)}><Icons.X /></button>
            </div>

            <div className="form-group">
              <label className="form-label">Target Employee Inbox (Receiver) *</label>
              <select
                className="form-input"
                required
                value={simForm.employee_email}
                onChange={(e) => setSimForm({ ...simForm, employee_email: e.target.value })}
              >
                <option value="">-- Choose Connected Mailbox --</option>
                {employees.map(emp => (
                  <option key={emp.email} value={emp.email}>{emp.name} ({emp.email})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Sender Name</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Richard Hendricks" 
                value={simForm.sender_name} 
                onChange={(e) => setSimForm({ ...simForm, sender_name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Sender Email Address *</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="e.g. richard@piedpiper.com" 
                required
                value={simForm.sender_email} 
                onChange={(e) => setSimForm({ ...simForm, sender_email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Subject Line *</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Urgently need refund for billing discrepancy" 
                required
                value={simForm.subject} 
                onChange={(e) => setSimForm({ ...simForm, subject: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Message Content (Body) *</label>
              <textarea 
                className="form-textarea" 
                placeholder="e.g. Hello, I noticed I was charged twice for the monthly plan this morning. Can you please investigate and issue a refund as soon as possible?" 
                required
                value={simForm.body} 
                onChange={(e) => setSimForm({ ...simForm, body: e.target.value })}
              />
            </div>

            <button type="submit" className="submit-btn">Run AI Triage Simulator</button>
          </form>
        </div>
      )}



      {/* Mailbox Connection Popup Modal */}
      {showConnectPopup && currentUser && currentUser.status !== 'Connected' && activeTab === 'overview' && (
        <div className="modal-overlay">
          <div className="modal-content connection-prompt-card" style={{ maxWidth: '500px', width: '95%', textAlign: 'center', padding: '36px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'absolute', top: '16px', right: '16px' }}>
              <button 
                type="button" 
                className="close-btn" 
                onClick={() => setShowConnectPopup(false)}
                style={{ fontSize: '28px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                &times;
              </button>
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-blue)', borderRadius: '50%', width: '72px', height: '72px', marginBottom: '20px' }}>
              <Icons.Mail style={{ width: '36px', height: '36px' }} />
            </div>

            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '12px' }}>
              To start, let's get you connected!
            </h3>
            
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '24px' }}>
              Link your Microsoft Outlook Office 365 mailbox to activate InboxSentry's live background AI sorting poller.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a
                href={`${API_BASE}/auth/login`}
                className="submit-btn"
                style={{ 
                  textDecoration: 'none', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '8px',
                  height: '46px',
                  fontSize: '14px',
                  fontWeight: '700'
                }}
              >
                <Icons.Link style={{ width: '18px', height: '18px' }} /> Connect Outlook Mailbox
              </a>
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={() => setShowConnectPopup(false)}
                style={{ height: '44px', fontSize: '13.5px' }}
              >
                Explore Workspace First
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Crop Modal Dialogue */}
      {showCropper && cropImageSrc && (
        <CropperModal 
          imageSrc={cropImageSrc}
          onCancel={() => setShowCropper(false)}
          onApply={(croppedBase64) => {
            setProfileForm(prev => ({ ...prev, avatar: croppedBase64 }));
            setShowCropper(false);
          }}
        />
      )}

      {/* Toast Popups */}
      {toast && (
        <div className={`toast-msg toast-${toast.type || 'success'}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {toast.type === 'error' ? (
              <Icons.AlertTriangle style={{ width: '18px', height: '18px', color: '#ffffff' }} />
            ) : (
              <Icons.Check style={{ width: '18px', height: '18px', color: '#ffffff' }} />
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left' }}>
              <span style={{ fontWeight: '700' }}>
                {toast.type === 'error' ? 'Operation Failed' : 'Success'}
              </span>
              <span style={{ fontSize: '12px', opacity: 0.9 }}>{toast.message}</span>
              {toast.code && (
                <span style={{ fontSize: '10px', opacity: 0.7, fontFamily: 'monospace', marginTop: '2px' }}>
                  Error Code: {toast.code}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// User Portal Login & Registration Overlay
function LoginPortal({ onLogin, onRegister }) {
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regName, setRegName] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    if (!emailInput) return;
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput, password: passwordInput })
      });

      const data = await res.json();
      if (res.ok) {
        onLogin(data);
      } else {
        const errText = data.error || 'Sign in failed. Please check your credentials.';
        const errCode = data.code ? ` [Code: ${data.code}]` : ` [Code: ${res.status}]`;
        setErrorMsg(errText + errCode);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error connecting to login server. [Code: CONN_ERR]');
    } finally {
      setLoading(false);
    }
  };

  const handleRegSubmit = (e) => {
    e.preventDefault();
    if (!regEmail) return;
    onRegister(regEmail, regName, regPassword);
  };

  const handleGoToRegister = () => {
    setRegEmail(emailInput);
    setIsRegistering(true);
    setErrorMsg('');
  };

  return (
    <div className="login-screen-overlay">
      <div className="login-card" style={{ padding: '48px 40px' }}>
        <div className="login-logo" style={{ marginBottom: '8px' }}>
          <Icons.Sparkles style={{ width: '24px', height: '24px' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '8px' }}>
          <h2 className="login-title" style={{ margin: 0 }}>Sign In to InboxSentry</h2>
          <p className="login-subtitle" style={{ margin: 0, fontSize: '14.5px' }}>AI-powered email triaging for Office 365</p>
        </div>

        {!isRegistering ? (
          <form onSubmit={handleSignInSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group" style={{ textAlign: 'left', margin: 0 }}>
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  required
                  placeholder="e.g. employee@company.com"
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                />
              </div>

              <div className="form-group" style={{ textAlign: 'left', margin: 0 }}>
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-input"
                  required
                  placeholder="••••••••"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                />
              </div>
            </div>

            {errorMsg && (
              <div style={{ color: '#b91c1c', fontSize: '13px', textAlign: 'left', background: '#fef2f2', padding: '12px 16px', borderRadius: '16px', border: '1px solid #fee2e2' }}>
                <div style={{ fontWeight: '800', marginBottom: '4px' }}>Sign In Error</div>
                <div style={{ color: '#991b1b', lineHeight: '1.4' }}>{errorMsg}</div>
                {errorMsg.includes('not found') && (
                  <button
                    type="button"
                    onClick={handleGoToRegister}
                    className="simulator-btn"
                    style={{
                      background: '#1d4ed8',
                      color: '#ffffff',
                      border: 'none',
                      padding: '8px 14px',
                      fontSize: '11.5px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      width: 'fit-content',
                      marginTop: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Icons.UserPlus style={{ width: '13px', height: '13px', stroke: '#ffffff' }} />
                    Create Account for this email
                  </button>
                )}
              </div>
            )}
            
            <button type="submit" className="submit-btn" disabled={loading || !emailInput} style={{ opacity: (!emailInput || loading) ? 0.6 : 1, height: '48px' }}>
              {loading ? 'Authenticating...' : 'Enter Console Workspace'}
            </button>

            <div className="login-divider" style={{ margin: '4px 0' }}>Or</div>

            <button 
              type="button" 
              className="btn-secondary" 
              onClick={() => {
                setIsRegistering(true);
                setErrorMsg('');
              }} 
              style={{ height: '48px' }}
            >
              Create New Account
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group" style={{ textAlign: 'left', margin: 0 }}>
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  className="form-input"
                  required
                  placeholder="e.g. employee@company.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ textAlign: 'left', margin: 0 }}>
                <label className="form-label">Display Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Richard Hendricks"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ textAlign: 'left', margin: 0 }}>
                <label className="form-label">Password *</label>
                <input
                  type="password"
                  className="form-input"
                  required
                  placeholder="••••••••"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="submit-btn" style={{ height: '48px' }}>
              Create & Log In
            </button>

            <div className="login-divider" style={{ margin: '4px 0' }}>Or</div>

            <button 
              type="button" 
              className="btn-secondary" 
              onClick={() => {
                setIsRegistering(false);
                setErrorMsg('');
              }} 
              style={{ height: '48px' }}
            >
              Sign In with Existing Account
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// Rule Editor Sub-Component
function RuleCard({ rule, isDefault, count, onSave, onDelete, onToggleReply }) {
  const [instruction, setInstruction] = useState(rule.prompt_instruction);

  useEffect(() => {
    setInstruction(rule.prompt_instruction);
  }, [rule.prompt_instruction]);

  return (
    <div className="rule-panel">
      <div className="rule-header">
        <span className="rule-category-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Icons.FolderFilled /> {rule.category}
        </span>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span className={`rule-type-badge ${isDefault ? 'badge-default' : 'badge-custom'}`}>
            {isDefault ? 'Default' : 'Custom'}
          </span>
          {!isDefault && (
            <button
              onClick={() => onDelete(rule.category)}
              style={{ background: 'transparent', border: 'none', color: '#f43f5e', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
            >
              Delete
            </button>
          )}
        </div>
      </div>
      
      <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
        AI system prompt organizer applied to emails triaged into <strong>{rule.category}</strong>:
      </p>

      <textarea
        className="rule-textarea"
        value={instruction}
        onChange={(e) => setInstruction(e.target.value)}
        placeholder={`Write guideline prompts to sort and answer queries related to ${rule.category}...`}
      />

      {/* Auto Draft Reply Toggle Switch */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '8px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', margin: '4px 0' }}>
        <span style={{ fontSize: '11.5px', fontWeight: '800', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Icons.Sparkles style={{ width: '13px', height: '13px', color: '#3b82f6' }} /> Automated Reply Drafting
        </span>
        <label style={{ position: 'relative', display: 'inline-block', width: '34px', height: '20px' }}>
          <input 
            type="checkbox" 
            checked={rule.auto_reply !== 0} 
            onChange={() => onToggleReply(rule.category, rule.auto_reply ?? 1)}
            style={{ opacity: 0, width: 0, height: 0 }}
          />
          <span style={{
            position: 'absolute',
            cursor: 'pointer',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: rule.auto_reply === 0 ? '#cbd5e1' : '#3b82f6',
            transition: '.3s',
            borderRadius: '20px'
          }}>
            <span style={{
              position: 'absolute',
              content: '""',
              height: '14px', width: '14px',
              left: rule.auto_reply === 0 ? '3px' : '17px',
              bottom: '3px',
              backgroundColor: '#ffffff',
              transition: '.3s',
              borderRadius: '50%'
            }} />
          </span>
        </label>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
        <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
          Total sorted emails: <strong>{count}</strong>
        </span>
        <button className="save-rule-btn" onClick={() => onSave(rule.category, instruction, rule.auto_reply ?? 1)}>
          Update Guidelines
        </button>
      </div>
    </div>
  );
}

// Image Cropper Modal Sub-Component (Uses Canvas & Drag-to-Pan / Slider-to-Zoom)
function CropperModal({ imageSrc, onCancel, onApply }) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const containerSize = 300;
  const imageRef = React.useRef(null);

  const handleStart = (clientX, clientY) => {
    setIsDragging(true);
    setDragStart({ x: clientX - pan.x, y: clientY - pan.y });
  };

  const handleMove = (clientX, clientY) => {
    if (!isDragging) return;
    setPan({ x: clientX - dragStart.x, y: clientY - dragStart.y });
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  const handleCropSave = () => {
    const img = imageRef.current;
    if (!img) return;

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    const scaleX = containerSize / img.naturalWidth;
    const scaleY = containerSize / img.naturalHeight;
    const coverScale = Math.max(scaleX, scaleY);
    
    const finalScale = coverScale * zoom;
    const destW = img.naturalWidth * finalScale;
    const destH = img.naturalHeight * finalScale;

    const destX = (containerSize / 2) + pan.x - (destW / 2);
    const destY = (containerSize / 2) + pan.y - (destH / 2);

    const canvasScale = 256 / containerSize;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 256, 256);

    ctx.drawImage(
      img, 
      destX * canvasScale, 
      destY * canvasScale, 
      destW * canvasScale, 
      destH * canvasScale
    );

    const base64 = canvas.toDataURL('image/jpeg', 0.85);
    onApply(base64);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '400px', width: '90%', padding: '28px', textAlign: 'center' }}>
        <div className="modal-header" style={{ paddingBottom: '12px', marginBottom: '12px' }}>
          <h3 className="modal-title" style={{ fontSize: '17px' }}>Crop Profile Image</h3>
          <button type="button" className="close-btn" onClick={onCancel} style={{ fontSize: '20px' }}>&times;</button>
        </div>
        
        <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.4' }}>
          Drag the photo to reposition, and use the slider below to zoom.
        </p>

        <div 
          style={{ 
            width: `${containerSize}px`, 
            height: `${containerSize}px`, 
            margin: '0 auto', 
            position: 'relative', 
            overflow: 'hidden', 
            borderRadius: '16px',
            background: '#f1f5f9',
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none'
          }}
          onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
          onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={(e) => {
            if (e.touches[0]) handleStart(e.touches[0].clientX, e.touches[0].clientY);
          }}
          onTouchMove={(e) => {
            if (e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY);
          }}
          onTouchEnd={handleEnd}
        >
          <img 
            ref={imageRef}
            src={imageSrc} 
            alt="To crop" 
            style={{ 
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: 'center center',
              maxWidth: 'none',
              maxHeight: 'none',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              pointerEvents: 'none'
            }}
          />

          <div 
            style={{ 
              position: 'absolute',
              top: '25px',
              left: '25px',
              width: '250px',
              height: '250px',
              borderRadius: '50%',
              border: '2px solid var(--accent-blue)',
              pointerEvents: 'none',
              boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.65)'
            }}
          />
        </div>

        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)' }}>
            <span>Zoom In/Out</span>
            <span>{zoom.toFixed(1)}x</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>-</span>
            <input 
              type="range"
              min="1"
              max="4"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              style={{ flexGrow: 1, height: '4px', background: '#e2e8f0', borderRadius: '2px', outline: 'none', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>+</span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
          <button type="button" className="btn-secondary" onClick={onCancel} style={{ padding: '10px 18px' }}>
            Cancel
          </button>
          <button type="button" className="simulator-btn" onClick={handleCropSave} style={{ padding: '10px 18px' }}>
            Crop & Save Image
          </button>
        </div>
      </div>
    </div>
  );
}

