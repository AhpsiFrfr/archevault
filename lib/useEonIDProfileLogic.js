import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

const defaultTitles = [
  'Builder',
  'Founder',
  'King of the Rats',
  'Oracle',
  'Visionary'
];

const eonThemes = {
  'Nebula Blue': 'nebula-blue',
  'Solar Flare': 'solar-flare',
  'Quantum Violet': 'quantum-violet',
  'Emerald Pulse': 'emerald-pulse',
  'Cosmic Storm': 'cosmic-storm',
  'Digital Aurora': 'digital-aurora',
  'Void Walker': 'void-walker',
  'Glitchcore': 'glitchcore'
};

export default function useEonIDProfileLogic() {
  const [username, setUsername] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [xpLevel, setXPLevel] = useState(0);
  const [avatar, setAvatar] = useState('');
  const [domain, setDomain] = useState('');
  const [theme, setTheme] = useState('');
  const [domainAvailable, setDomainAvailable] = useState(null);
  const [checkingDomain, setCheckingDomain] = useState(false);

  useEffect(() => {
    if (domain.length < 3) {
      setDomainAvailable(null);
      return;
    }
    
    const check = setTimeout(async () => {
      setCheckingDomain(true);
      try {
        // Use the correct Bonfida SNS SDK proxy endpoint
        const res = await fetch(`https://sns-sdk-proxy.bonfida.workers.dev/resolve/${domain}`);
        const data = await res.json();
        
        if (data.s === 'ok' && data.result) {
          // Domain is taken (has an owner)
          setDomainAvailable(false);
        } else if (data.s === 'error' && data.result === 'Domain not found') {
          // Domain is available
          setDomainAvailable(true);
        } else {
          // Unexpected response
          setDomainAvailable(null);
        }
      } catch (error) {
        console.error('Domain check failed:', error);
        setDomainAvailable(null);
      } finally {
        setCheckingDomain(false);
      }
    }, 500);
    
    return () => clearTimeout(check);
  }, [domain]);

  const saveProfile = async () => {
    const { error } = await supabase.from('profiles').upsert({
      username,
      title,
      bio,
      avatar,
      theme,
      domain
    });
    return error;
  };

  return {
    username, setUsername,
    title, setTitle,
    bio, setBio,
    xpLevel, setXPLevel,
    avatar, setAvatar,
    domain, setDomain,
    theme, setTheme,
    domainAvailable,
    checkingDomain,
    saveProfile,
    defaultTitles,
    eonThemes
  };
} 