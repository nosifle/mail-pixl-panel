import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMailcowAPI } from "@/hooks/useMailcowAPI";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";
import Header from "./Header";
import AuthCard from "./AuthCard";
import EmailList from "./EmailList";
import EmailView from "./EmailView";

export interface Account {
  id: string;
  email: string;
  password: string;
  domain: string;
  isActive: boolean;
}

export interface Email {
  uid: number;
  subject: string;
  fromName: string;
  fromEmail: string;
  date: string;
  content?: string;
  attachments?: Attachment[];
}

export interface Attachment {
  name: string;
  size: string;
  type: string;
  url: string;
  isImage: boolean;
}

const EmailClient = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null);
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const mailcowAPI = useMailcowAPI();
  
  // Auto-refresh emails every 30 seconds
  useAutoRefresh({
    enabled: !!currentAccount,
    interval: 30000,
    onRefresh: () => loadEmails()
  });

  // Load accounts from localStorage on mount
  useEffect(() => {
    const savedAccounts = localStorage.getItem('email-accounts');
    if (savedAccounts) {
      const parsedAccounts = JSON.parse(savedAccounts);
      setAccounts(parsedAccounts);
      const activeAccount = parsedAccounts.find((acc: Account) => acc.isActive);
      if (activeAccount) {
        setCurrentAccount(activeAccount);
      }
    }
  }, []);

  // Save accounts to localStorage whenever they change
  useEffect(() => {
    if (accounts.length > 0) {
      localStorage.setItem('email-accounts', JSON.stringify(accounts));
    }
  }, [accounts]);

  const createAccount = async (email: string, password: string, domain: string) => {
    setIsLoading(true);
    const result = await mailcowAPI.createAccount(email, domain, password);
    
    if (result.success && result.email) {
      const newAccount: Account = {
        id: crypto.randomUUID(),
        email: result.email,
        password,
        domain,
        isActive: accounts.length === 0
      };
      
      const updatedAccounts = [...accounts, newAccount];
      setAccounts(updatedAccounts);
      
      if (accounts.length === 0) {
        setCurrentAccount(newAccount);
        await loadEmails(result.email, password);
      }
    }
    
    setIsLoading(false);
  };

  const loginToAccount = async (email: string, password: string) => {
    setIsLoading(true);
    const result = await mailcowAPI.loginToAccount(email, password);
    
    if (result.success) {
      const existingAccount = accounts.find(acc => acc.email === email);
      
      if (existingAccount) {
        const updatedAccounts = accounts.map(acc => ({
          ...acc,
          isActive: acc.id === existingAccount.id,
          password: acc.id === existingAccount.id ? password : acc.password
        }));
        setAccounts(updatedAccounts);
        setCurrentAccount({...existingAccount, password, isActive: true});
      } else {
        const newAccount: Account = {
          id: crypto.randomUUID(),
          email,
          password,
          domain: email.split('@')[1],
          isActive: true
        };
        
        const updatedAccounts = accounts.map(acc => ({...acc, isActive: false}));
        updatedAccounts.push(newAccount);
        setAccounts(updatedAccounts);
        setCurrentAccount(newAccount);
      }
      
      await loadEmails(email, password);
    }
    
    setIsLoading(false);
  };

  const switchAccount = (accountId: string) => {
    const account = accounts.find(acc => acc.id === accountId);
    if (account) {
      const updatedAccounts = accounts.map(acc => ({
        ...acc,
        isActive: acc.id === accountId
      }));
      setAccounts(updatedAccounts);
      setCurrentAccount(account);
      setEmails([]);
      setSelectedEmail(null);
      
      toast({
        title: "Аккаунт переключен",
        description: `Переключились на ${account.email}`
      });
    }
  };

  const logout = () => {
    const updatedAccounts = accounts.map(acc => ({...acc, isActive: false}));
    setAccounts(updatedAccounts);
    setCurrentAccount(null);
    setEmails([]);
    setSelectedEmail(null);
  };

  const deleteAccount = async (accountId: string) => {
    const account = accounts.find(acc => acc.id === accountId);
    if (!account) return;
    
    const result = await mailcowAPI.deleteAccount(account.email);
    
    if (result.success) {
      const updatedAccounts = accounts.filter(acc => acc.id !== accountId);
      setAccounts(updatedAccounts);
      
      if (currentAccount?.id === accountId) {
        const nextAccount = updatedAccounts.find(acc => acc.isActive) || updatedAccounts[0];
        if (nextAccount) {
          const finalAccounts = updatedAccounts.map(acc => ({
            ...acc,
            isActive: acc.id === nextAccount.id
          }));
          setAccounts(finalAccounts);
          setCurrentAccount(nextAccount);
          await loadEmails(nextAccount.email, nextAccount.password);
        } else {
          setCurrentAccount(null);
        }
      }
    }
  };

  const changePassword = async (accountId: string, newPassword: string) => {
    const account = accounts.find(acc => acc.id === accountId);
    if (!account) return;
    
    const result = await mailcowAPI.changePassword(account.email, newPassword);
    
    if (result.success) {
      const updatedAccounts = accounts.map(acc => 
        acc.id === accountId ? { ...acc, password: newPassword } : acc
      );
      setAccounts(updatedAccounts);
      
      if (currentAccount?.id === accountId) {
        setCurrentAccount({ ...currentAccount, password: newPassword });
      }
    }
  };

  const removeAccount = (accountId: string) => {
    const updatedAccounts = accounts.filter(acc => acc.id !== accountId);
    setAccounts(updatedAccounts);
    
    if (currentAccount?.id === accountId) {
      const nextAccount = updatedAccounts.find(acc => acc.isActive) || updatedAccounts[0];
      if (nextAccount) {
        const finalAccounts = updatedAccounts.map(acc => ({
          ...acc,
          isActive: acc.id === nextAccount.id
        }));
        setAccounts(finalAccounts);
        setCurrentAccount(nextAccount);
      } else {
        setCurrentAccount(null);
      }
    }
    
    toast({
      title: "Выход выполнен",
      description: "Вы вышли из аккаунта"
    });
  };

  // Load emails from Mailcow API
  const loadEmails = async (email?: string, password?: string) => {
    const targetEmail = email || currentAccount?.email;
    const targetPassword = password || currentAccount?.password;
    
    if (!targetEmail || !targetPassword) return;
    
    setIsLoading(true);
    
    try {
      const mailcowEmails = await mailcowAPI.getEmails(targetEmail, targetPassword);
      
      const formattedEmails: Email[] = mailcowEmails.map(email => ({
        uid: parseInt(email.uid),
        subject: email.subject,
        fromName: email.from.name,
        fromEmail: email.from.email,
        date: email.date,
        content: email.content
      }));
      
      setEmails(formattedEmails);
    } catch (error) {
      console.error('Error loading emails:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentAccount) {
      loadEmails();
    }
  }, [currentAccount]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header 
        currentAccount={currentAccount}
        accounts={accounts}
        onSwitchAccount={switchAccount}
        onLogout={logout}
        onDeleteAccount={deleteAccount}
        onChangePassword={changePassword}
        onRemoveAccount={removeAccount}
        onCreateAccount={createAccount}
        onLogin={loginToAccount}
        isLoading={isLoading}
        onGoHome={() => {
          setCurrentAccount(null);
          setAccounts([]);
          setEmails([]);
          setSelectedEmail(null);
          localStorage.removeItem('email-accounts');
        }}
      />
      
      <main className="max-w-7xl mx-auto px-4 py-8 flex-1">
        {!currentAccount ? (
          <AuthCard />
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
            <div className="xl:col-span-1">
              <EmailList 
                emails={emails}
                onSelectEmail={setSelectedEmail}
                onRefresh={() => loadEmails()}
                isLoading={isLoading}
                currentAccount={currentAccount}
              />
            </div>
            
            <div className="xl:col-span-1">
              {selectedEmail && (
                <EmailView 
                  email={selectedEmail}
                  onClose={() => setSelectedEmail(null)}
                />
              )}
            </div>
          </div>
        )}
      </main>
      
      <footer className="border-t border-border mt-auto py-4">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm text-muted-foreground">
          <div className="text-email-meta">
            Память: <span className="font-medium">2.4 МБ</span> из <span className="font-medium">20 МБ</span>
          </div>
          <div>
            © x69x.fun • Email Demo Interface
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EmailClient;