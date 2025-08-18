import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LogOut, User, Trash2, Copy, Key, Eye, EyeOff, UserPlus } from "lucide-react";
import { Account } from "./EmailClient";
import { useToast } from "@/hooks/use-toast";
import { copyToClipboard, getAvatarColor } from "@/lib/email-utils";
import AuthDialog from "./AuthDialog";

interface HeaderProps {
  currentAccount: Account | null;
  accounts: Account[];
  onSwitchAccount: (accountId: string) => void;
  onLogout: () => void;
  onDeleteAccount: (accountId: string) => void;
  onChangePassword: (accountId: string, newPassword: string) => void;
  onRemoveAccount: (accountId: string) => void;
  onCreateAccount: (email: string, password: string, domain: string) => void;
  onLogin: (email: string, password: string) => void;
  isLoading: boolean;
  onGoHome: () => void;
}

const Header = ({ 
  currentAccount, 
  accounts, 
  onSwitchAccount, 
  onLogout, 
  onDeleteAccount,
  onChangePassword,
  onRemoveAccount,
  onCreateAccount,
  onLogin,
  isLoading,
  onGoHome
}: HeaderProps) => {
  const { toast } = useToast();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [deleteAccountId, setDeleteAccountId] = useState<string | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const handleCopyEmail = async (email: string) => {
    const success = await copyToClipboard(email);
    if (success) {
      toast({
        title: "Email скопирован",
        description: `${email} скопирован в буфер обмена`
      });
    }
  };

  const handleCopyPassword = async (password: string) => {
    const success = await copyToClipboard(password);
    if (success) {
      toast({
        title: "Пароль скопирован",
        description: "Пароль скопирован в буфер обмена"
      });
    }
  };

  const handleChangePassword = () => {
    if (!currentAccount) return;
    
    if (!newPassword || newPassword.length < 8) {
      toast({
        title: "Ошибка",
        description: "Пароль должен содержать минимум 8 символов",
        variant: "destructive"
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Ошибка", 
        description: "Пароли не совпадают",
        variant: "destructive"
      });
      return;
    }

    onChangePassword(currentAccount.id, newPassword);
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-brand-accent rounded-full"></div>
          <button onClick={onGoHome} className="text-lg sm:text-xl font-semibold hover:text-brand-accent transition-colors">
            Почта <span className="text-brand-accent font-bold">x69x.fun</span>
          </button>
          <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
            демо
          </span>
        </div>

        {currentAccount && (
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopyEmail(currentAccount.email)}
              className="gap-2 hidden sm:flex"
            >
              <Copy className="w-4 h-4" />
              <span className="hidden md:inline">{currentAccount.email}</span>
              <span className="md:hidden">{currentAccount.email.split('@')[0]}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative h-10 w-10 rounded-full p-0"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback 
                      className="text-primary-foreground font-semibold"
                      style={{ backgroundColor: getAvatarColor(currentAccount.email) }}
                    >
                      {currentAccount.email[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent className="w-80 sm:w-96 max-h-[80vh] overflow-y-auto" align="end">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Аккаунты ({accounts.length}/20)</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAuthDialog(true)}
                    className="gap-2 h-8 px-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    Войти
                  </Button>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {/* Текущий пароль */}
                <div className="p-3 space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    Текущий пароль
                  </Label>
                  <div className="relative">
                    <Input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentAccount.password}
                      onClick={() => handleCopyPassword(currentAccount.password)}
                      readOnly
                      className="h-8 cursor-pointer"
                      title="Нажмите для копирования"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                
                <DropdownMenuSeparator />
                
                {/* Смена пароля */}
                <div className="p-3 space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    Смена пароля
                  </Label>
                  <div className="space-y-2">
                    <Input
                      type="password"
                      placeholder="Новый пароль"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="h-8"
                    />
                    <Input
                      type="password" 
                      placeholder="Повторите пароль"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-8"
                    />
                    <Button 
                      size="sm" 
                      onClick={handleChangePassword}
                      className="w-full"
                      disabled={!newPassword || !confirmPassword}
                    >
                      Сменить пароль
                    </Button>
                  </div>
                </div>
                
                <DropdownMenuSeparator />
                
                {/* Список аккаунтов */}
                <div className="max-h-60 overflow-y-auto">
                  {accounts.map((account) => (
                    <DropdownMenuItem
                      key={account.id}
                      className={`flex items-center gap-3 p-2 sm:p-3 ${
                        account.isActive ? 'bg-accent' : ''
                      }`}
                    >
                      <div className="flex gap-1 items-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveAccount(account.id);
                          }}
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                          title="Выйти из аккаунта"
                        >
                          <LogOut className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarFallback 
                          className="text-xs font-medium"
                          style={{ backgroundColor: getAvatarColor(account.email) }}
                        >
                          {account.email[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <button
                          onClick={() => handleCopyEmail(account.email)}
                          className="text-sm font-medium truncate w-full text-left hover:text-brand-accent"
                          title="Нажмите чтобы скопировать"
                        >
                          {account.email}
                        </button>
                        <p className="text-xs text-muted-foreground">
                          {account.domain}
                        </p>
                      </div>
                      
                      <div className="flex gap-1">
                        {!account.isActive && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSwitchAccount(account.id);
                            }}
                            className="h-7 w-7 p-0"
                            title="Переключиться"
                          >
                            <User className="w-3 h-3" />
                          </Button>
                        )}
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteAccountId(account.id);
                              }}
                              className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                              title="Удалить аккаунт"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Удалить аккаунт?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Вы уверены, что хотите удалить аккаунт {account.email}? 
                                Это действие нельзя отменить.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Отмена</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => {
                                  onDeleteAccount(account.id);
                                  setDeleteAccountId(null);
                                }}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Удалить
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
                
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onLogout}
                  className="gap-2 text-destructive focus:text-destructive"
                >
                  <LogOut className="w-4 h-4" />
                  Выйти из всех аккаунтов
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      <AuthDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        onCreateAccount={onCreateAccount}
        onLogin={onLogin}
        isLoading={isLoading}
      />
    </header>
  );
};

export default Header;