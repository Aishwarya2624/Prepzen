import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  type User as FirebaseUser,
  type AuthError,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile as firebaseUpdateProfile,
} from 'firebase/auth';
import { auth } from '@/lib/firebase-config'; // Make sure you have this file
import type { User as AppUser } from '@/types';
import axios from 'axios';

// The base URL for your backend API
const API_URL = 'http://localhost:5001/api'; // Change if your backend runs elsewhere

interface AuthContextType {
  user: AppUser | null;
  userId: string | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updateProfile: (updates: { name?: string; imageUrl?: string }) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replaced Supabase listener with Firebase's onAuthStateChanged
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Sync user data with our backend (MongoDB)
        await syncUserProfile(firebaseUser);
        
        // Map Firebase user to our app's user type
        const appUser: AppUser = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'Anonymous',
          email: firebaseUser.email || 'N/A',
          imageUrl: firebaseUser.photoURL || null,
          createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
          updatedAt: firebaseUser.metadata.lastSignInTime || new Date().toISOString(),
        };
        setUser(appUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // New function to create/update user profile in our MongoDB via the backend API
  const syncUserProfile = async (firebaseUser: FirebaseUser) => {
    try {
      const token = await firebaseUser.getIdToken();
      await axios.post(
        `${API_URL}/users/sync`,
        {
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          firebaseId: firebaseUser.uid,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Secure the endpoint
          },
        }
      );
    } catch (error) {
      console.error('Error syncing user profile to backend:', error);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Update Firebase profile with the name
      await firebaseUpdateProfile(userCredential.user, { displayName: name });
      
      // Sync new user to our MongoDB database
      await syncUserProfile(userCredential.user);
      
      return { error: null };
    } catch (e) {
      return { error: e as AuthError };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { error: null };
    } catch (e) {
      return { error: e as AuthError };
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { error: null };
    } catch (e) {
      return { error: e as AuthError };
    }
  };

  const updateProfile = async (updates: { name?: string; imageUrl?: string }) => {
    if (!auth.currentUser) return { error: { code: 'no-user', message: 'No user is signed in.' } as AuthError };

    try {
      // Update Firebase profile
      await firebaseUpdateProfile(auth.currentUser, {
        displayName: updates.name,
        photoURL: updates.imageUrl,
      });

      // TODO: Add an API call here to update user details in your MongoDB
      // For example: await axios.put(`${API_URL}/users/${auth.currentUser.uid}`, updates);

      return { error: null };
    } catch (e) {
      return { error: e as AuthError };
    }
  };

  const value = {
    user,
    userId: user?.id || null,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
  };

  // By always rendering `children`, we allow other components (like your routes)
  // to handle the loading state themselves, which is a more flexible pattern.
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};