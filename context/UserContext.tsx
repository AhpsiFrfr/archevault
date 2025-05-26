import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { supabase } from '@/lib/supabaseClient';

interface User {
  id: string;
  email?: string;
  username?: string;
  avatar?: string;
  status?: 'online' | 'offline' | 'away' | 'dnd';
  wallet?: string;
  tokenBalance?: number;
  xpLevel?: number;
  evolution?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { connected, publicKey } = useWallet();

  useEffect(() => {
    // Check for wallet authentication only if wallet is connected
    const checkWalletAuth = async () => {
      try {
        // Only authenticate if wallet is actually connected
        if (!connected || !publicKey) {
          // Clear any stored auth data if wallet is not connected
          localStorage.removeItem('wallet_address');
          localStorage.removeItem('wallet_user');
          localStorage.removeItem('auth_data');
          setUser(null);
          setLoading(false);
          return;
        }

        const walletAddress = publicKey.toBase58();
        const storedWalletAddress = localStorage.getItem('wallet_address');
        const walletUserData = localStorage.getItem('wallet_user');

        // Check if the connected wallet matches the stored wallet
        if (walletAddress === storedWalletAddress && walletUserData) {
          const walletUser = JSON.parse(walletUserData);
          
          // Verify the wallet user still exists in the database
          const { data, error } = await supabase
            .from('wallet_users')
            .select('*')
            .eq('wallet_address', walletAddress)
            .single();

          if (data && !error) {
            setUser({
              id: data.id,
              username: data.username || `Pilot_${walletAddress.slice(0, 8)}`,
              avatar: data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${walletAddress}`,
              status: 'online',
              wallet: walletAddress,
              tokenBalance: data.token_balance || 0,
              xpLevel: data.xp_level || 1,
              evolution: data.evolution || 'Initiate',
            });
          } else {
            // Clear invalid wallet data
            localStorage.removeItem('wallet_address');
            localStorage.removeItem('wallet_user');
            localStorage.removeItem('auth_data');
            setUser(null);
          }
        } else {
          // Wallet address doesn't match or no stored data
          // Clear any mismatched stored data
          if (storedWalletAddress && storedWalletAddress !== walletAddress) {
            localStorage.removeItem('wallet_address');
            localStorage.removeItem('wallet_user');
            localStorage.removeItem('auth_data');
          }
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking wallet auth:', error);
        localStorage.removeItem('wallet_address');
        localStorage.removeItem('wallet_user');
        localStorage.removeItem('auth_data');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkWalletAuth();
  }, [connected, publicKey]); // Re-run when wallet connection state changes

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
}
