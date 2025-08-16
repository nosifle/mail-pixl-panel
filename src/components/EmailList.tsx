import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Inbox } from "lucide-react";
import { Email, Account } from "./EmailClient";
import { formatEmailDate, getAvatarColor } from "@/lib/email-utils";

interface EmailListProps {
  emails: Email[];
  onSelectEmail: (email: Email) => void;
  onRefresh: () => void;
  isLoading: boolean;
  currentAccount: Account;
}

const EmailList = ({ emails, onSelectEmail, onRefresh, isLoading, currentAccount }: EmailListProps) => {
  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="flex items-center gap-2">
              <Inbox className="w-5 h-5" />
              ВХОДЯЩИЕ
            </CardTitle>
            <Badge variant="secondary">INBOX</Badge>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Обновить
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Аккаунт: {currentAccount.email}
        </p>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-0">
        {emails.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            {isLoading ? "Загружаем письма..." : "Нет писем"}
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {emails.map((email) => (
              <button
                key={email.uid}
                onClick={() => onSelectEmail(email)}
                className="w-full p-3 rounded-lg text-left hover:bg-email-hover transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10 flex-shrink-0">
                    <AvatarFallback 
                      className="text-primary-foreground font-medium"
                      style={{ backgroundColor: getAvatarColor(email.fromEmail) }}
                    >
                      {(email.fromName || email.fromEmail)[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-medium text-email-subject truncate group-hover:text-brand-accent">
                        {email.subject || "(без темы)"}
                      </h3>
                      <time className="text-xs text-email-meta flex-shrink-0">
                        {formatEmailDate(email.date)}
                      </time>
                    </div>
                    
                    <p className="text-sm text-email-meta truncate">
                      {email.fromName || email.fromEmail}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmailList;