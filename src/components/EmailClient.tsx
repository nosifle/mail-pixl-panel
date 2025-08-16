import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
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
    try {
      // Simulate account creation
      const newAccount: Account = {
        id: crypto.randomUUID(),
        email: `${email}@${domain}`,
        password,
        domain,
        isActive: accounts.length === 0
      };
      
      const updatedAccounts = [...accounts, newAccount];
      setAccounts(updatedAccounts);
      
      if (accounts.length === 0) {
        setCurrentAccount(newAccount);
      }
      
      toast({
        title: "Аккаунт создан",
        description: `Ящик ${newAccount.email} успешно создан`
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось создать аккаунт",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loginToAccount = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Check if account already exists
      const existingAccount = accounts.find(acc => acc.email === email);
      
      if (existingAccount) {
        // Update password and activate
        const updatedAccounts = accounts.map(acc => ({
          ...acc,
          isActive: acc.id === existingAccount.id,
          password: acc.id === existingAccount.id ? password : acc.password
        }));
        setAccounts(updatedAccounts);
        setCurrentAccount({...existingAccount, password, isActive: true});
      } else {
        // Create new account
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
      
      toast({
        title: "Вход выполнен",
        description: `Добро пожаловать, ${email}`
      });
    } catch (error) {
      toast({
        title: "Ошибка входа",
        description: "Неверные данные для входа",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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

  const deleteAccount = (accountId: string) => {
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
      title: "Аккаунт удален",
      description: "Аккаунт успешно удален"
    });
  };

  const changePassword = (accountId: string, newPassword: string) => {
    const updatedAccounts = accounts.map(acc => 
      acc.id === accountId ? { ...acc, password: newPassword } : acc
    );
    setAccounts(updatedAccounts);
    
    if (currentAccount?.id === accountId) {
      setCurrentAccount({ ...currentAccount, password: newPassword });
    }
    
    toast({
      title: "Пароль изменен",
      description: "Пароль успешно обновлен"
    });
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

  // Mock email data loading
  const loadEmails = () => {
    if (!currentAccount) return;
    
    setIsLoading(true);
    
    // Mock data
    setTimeout(() => {
      const mockEmails: Email[] = [
        {
          uid: 1,
          subject: "Добро пожаловать в x69x.fun",
          fromName: "x69x Team",
          fromEmail: "noreply@x69x.fun",
          date: "2024-01-16T10:30:00Z"
        },
        {
          uid: 2,
          subject: "Важное уведомление о безопасности",
          fromName: "Security Team",
          fromEmail: "security@x69x.fun", 
          date: "2024-01-15T14:20:00Z"
        },
        {
          uid: 3,
          subject: "Ваш отчет готов",
          fromName: "Reports System",
          fromEmail: "reports@x69x.fun",
          date: "2024-01-14T09:15:00Z"
        }
      ];
      setEmails(mockEmails);
      setIsLoading(false);
    }, 500);
  };

  useEffect(() => {
    if (currentAccount) {
      loadEmails();
    }
  }, [currentAccount]);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        currentAccount={currentAccount}
        accounts={accounts}
        onSwitchAccount={switchAccount}
        onLogout={logout}
        onDeleteAccount={deleteAccount}
        onChangePassword={changePassword}
        onRemoveAccount={removeAccount}
      />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {!currentAccount ? (
          <AuthCard 
            onCreateAccount={createAccount}
            onLogin={loginToAccount}
            isLoading={isLoading}
          />
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
            <div className="xl:col-span-1">
              <EmailList 
                emails={emails}
                onSelectEmail={setSelectedEmail}
                onRefresh={loadEmails}
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
      
      <footer className="border-t border-border mt-auto py-6">
        <div className="container mx-auto px-4 text-center text-email-meta">
          © x69x.fun • Email Demo Interface
        </div>
      </footer>
    </div>
  );
};

export default EmailClient;