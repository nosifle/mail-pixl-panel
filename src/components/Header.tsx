import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Trash2, Copy } from "lucide-react";
import { Account } from "./EmailClient";
import { useToast } from "@/hooks/use-toast";
import { copyToClipboard, getAvatarColor } from "@/lib/email-utils";

interface HeaderProps {
  currentAccount: Account | null;
  accounts: Account[];
  onSwitchAccount: (accountId: string) => void;
  onLogout: () => void;
  onDeleteAccount: (accountId: string) => void;
}

const Header = ({ 
  currentAccount, 
  accounts, 
  onSwitchAccount, 
  onLogout, 
  onDeleteAccount 
}: HeaderProps) => {
  const { toast } = useToast();

  const handleCopyEmail = async (email: string) => {
    const success = await copyToClipboard(email);
    if (success) {
      toast({
        title: "Email скопирован",
        description: `${email} скопирован в буфер обмена`
      });
    }
  };

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-brand-accent rounded-full"></div>
          <h1 className="text-xl font-semibold">
            Почта <span className="text-brand-accent font-bold">x69x.fun</span>
          </h1>
          <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
            демо
          </span>
        </div>

        {currentAccount && (
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopyEmail(currentAccount.email)}
              className="gap-2"
            >
              <Copy className="w-4 h-4" />
              {currentAccount.email}
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
              
              <DropdownMenuContent className="w-80" align="end">
                <DropdownMenuLabel>Аккаунты ({accounts.length}/20)</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {accounts.map((account) => (
                  <DropdownMenuItem
                    key={account.id}
                    className={`flex items-center gap-3 p-3 ${
                      account.isActive ? 'bg-accent' : ''
                    }`}
                  >
                    <Avatar className="h-8 w-8">
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
                        >
                          <User className="w-4 h-4" />
                        </Button>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Удалить аккаунт ${account.email}?`)) {
                            onDeleteAccount(account.id);
                          }
                        }}
                        className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </DropdownMenuItem>
                ))}
                
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
    </header>
  );
};

export default Header;