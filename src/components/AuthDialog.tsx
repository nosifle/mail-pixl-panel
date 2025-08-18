import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Loader2 } from "lucide-react";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateAccount: (email: string, password: string, domain: string) => void;
  onLogin: (email: string, password: string) => void;
  isLoading: boolean;
}

const AuthDialog = ({ isOpen, onClose, onCreateAccount, onLogin, isLoading }: AuthDialogProps) => {
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  const domain = "x69x.fun";

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regEmail || !regPassword || !regConfirm) return;
    if (regPassword !== regConfirm) return;
    onCreateAccount(regEmail, regPassword, domain);
    onClose();
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;
    onLogin(loginEmail, loginPassword);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Вход в почту</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Вход</TabsTrigger>
            <TabsTrigger value="register">Регистрация</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Войти в аккаунт</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="dialog-login-email">Email</Label>
                    <Input
                      id="dialog-login-email"
                      type="email"
                      placeholder={`user@${domain}`}
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dialog-login-password">Пароль</Label>
                    <div className="relative">
                      <Input
                        id="dialog-login-password"
                        type={showLoginPassword ? "text" : "password"}
                        placeholder="Ваш пароль"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isLoading || !loginEmail || !loginPassword}
                  >
                    {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Войти
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Создать новый ящик</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="dialog-reg-email">Имя пользователя</Label>
                    <div className="flex">
                      <Input
                        id="dialog-reg-email"
                        placeholder="username"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="rounded-r-none"
                        disabled={isLoading}
                      />
                      <div className="flex items-center px-3 bg-muted border border-l-0 rounded-r-md text-sm text-muted-foreground">
                        @{domain}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dialog-reg-password">Пароль</Label>
                    <div className="relative">
                      <Input
                        id="dialog-reg-password"
                        type={showRegPassword ? "text" : "password"}
                        placeholder="Минимум 8 символов"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                      >
                        {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dialog-reg-confirm">Повторите пароль</Label>
                    <div className="relative">
                      <Input
                        id="dialog-reg-confirm"
                        type={showRegConfirm ? "text" : "password"}
                        placeholder="Ещё раз пароль"
                        value={regConfirm}
                        onChange={(e) => setRegConfirm(e.target.value)}
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowRegConfirm(!showRegConfirm)}
                      >
                        {showRegConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading || !regEmail || !regPassword || regPassword !== regConfirm}
                  >
                    {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Создать ящик
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;