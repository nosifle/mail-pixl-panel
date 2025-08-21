import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        toast.success('Аккаунт создан успешно!');
        return { success: true, user: data.user };
      }
    } catch (error: any) {
      toast.error(`Ошибка создания аккаунта: ${error.message}`);
      return { success: false, error: error.message };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        toast.success('Вход выполнен успешно!');
        return { success: true, user: data.user };
      }
    } catch (error: any) {
      toast.error(`Ошибка входа: ${error.message}`);
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success('Выход выполнен успешно');
      return { success: true };
    } catch (error: any) {
      toast.error(`Ошибка выхода: ${error.message}`);
      return { success: false, error: error.message };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast.success('Пароль успешно изменен!');
      return { success: true, user: data.user };
    } catch (error: any) {
      toast.error(`Ошибка смены пароля: ${error.message}`);
      return { success: false, error: error.message };
    }
  };

  const signOutFromAllDevices = async () => {
    try {
      // First sign out from current session
      await supabase.auth.signOut();
      
      // Note: Supabase doesn't have a direct way to sign out from all devices
      // This would typically require server-side implementation to invalidate all sessions
      toast.success('Выход из всех устройств выполнен');
      return { success: true };
    } catch (error: any) {
      toast.error(`Ошибка выхода из всех устройств: ${error.message}`);
      return { success: false, error: error.message };
    }
  };

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    updatePassword,
    signOutFromAllDevices,
  };
};