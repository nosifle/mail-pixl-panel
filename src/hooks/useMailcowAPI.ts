import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export interface MailcowAccount {
  email: string;
  domain: string;
  active: boolean;
}

export interface MailcowEmail {
  uid: string;
  subject: string;
  from: {
    name: string;
    email: string;
  };
  date: string;
  content: string;
  attachments: any[];
  isRead: boolean;
}

export const useMailcowAPI = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const createAccount = async (localPart: string, domain: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('mailcow-api?action=create_account', {
        body: { local_part: localPart, domain, password }
      });

      if (error) throw error;

      if (data.success === false) {
        throw new Error(data.msg || 'Ошибка создания аккаунта');
      }

      toast({
        title: "Аккаунт создан",
        description: `${localPart}@${domain} успешно создан`
      });

      return { success: true, email: `${localPart}@${domain}` };
    } catch (error: any) {
      toast({
        title: "Ошибка создания аккаунта",
        description: error.message,
        variant: "destructive"
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const loginToAccount = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('mailcow-api?action=login', {
        body: { email, password }
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Ошибка входа');
      }

      return { success: true, account: data.account };
    } catch (error: any) {
      toast({
        title: "Ошибка входа",
        description: error.message,
        variant: "destructive"
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const getEmails = async (email: string, password: string): Promise<MailcowEmail[]> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('mailcow-api?action=get_emails', {
        body: { email, password }
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Ошибка получения писем');
      }

      return data.emails || [];
    } catch (error: any) {
      toast({
        title: "Ошибка получения писем",
        description: error.message,
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async (email: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('mailcow-api?action=delete_account', {
        body: { email }
      });

      if (error) throw error;

      toast({
        title: "Аккаунт удален",
        description: `${email} успешно удален`
      });

      return { success: true };
    } catch (error: any) {
      toast({
        title: "Ошибка удаления аккаунта",
        description: error.message,
        variant: "destructive"
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (email: string, newPassword: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('mailcow-api?action=change_password', {
        body: { email, new_password: newPassword }
      });

      if (error) throw error;

      toast({
        title: "Пароль изменен",
        description: `Пароль для ${email} успешно изменен`
      });

      return { success: true };
    } catch (error: any) {
      toast({
        title: "Ошибка изменения пароля",
        description: error.message,
        variant: "destructive"
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    createAccount,
    loginToAccount,
    getEmails,
    deleteAccount,
    changePassword,
    loading
  };
};