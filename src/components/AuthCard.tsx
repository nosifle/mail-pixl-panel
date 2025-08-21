import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface AuthCardProps {
  // Remove these props as we'll use the hook directly
}

const AuthCard = ({}: AuthCardProps) => {
  const navigate = useNavigate();
  const { signUp, signIn, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  const domain = "x69x.fun";

  // Redirect to profile if already authenticated
  if (user) {
    navigate('/profile');
    return null;
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regEmail || !regPassword) return;
    
    setIsLoading(true);
    try {
      const result = await signUp(`${regEmail}@${domain}`, regPassword);
      if (result?.success) {
        navigate('/profile');
      }
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;
    
    setIsLoading(true);
    try {
      const result = await signIn(loginEmail, loginPassword);
      if (result?.success) {
        navigate('/profile');
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Добро пожаловать</h1>
        <p className="text-muted-foreground">
          Создайте новый аккаунт или войдите в существующий
        </p>
      </div>

      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full max-w-6xl mx-auto grid-cols-2 mb-6">
          <TabsTrigger value="login">Вход</TabsTrigger>
          <TabsTrigger value="register">Регистрация</TabsTrigger>
        </TabsList>

        <div className="max-w-2xl mx-auto">
          <TabsContent value="login" className="mt-0">
            <div className="w-96">
              <Card>
                <CardHeader>
                  <CardTitle>Войти в аккаунт</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder={`user@${domain}`}
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password">Пароль</Label>
                      <div className="relative">
                        <Input
                          id="login-password"
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

                    <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                      <strong>IMAP настройки:</strong><br />
                      Хост: <strong>mail.x69x.fun</strong> • Порт: <strong>993</strong> • 
                      Шифрование: <strong>TLS/SSL</strong>
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
            </div>
          </TabsContent>

          <TabsContent value="register" className="mt-0">
            <div className="w-96 ml-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Создать новый ящик</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reg-email">Имя пользователя</Label>
                      <div className="flex">
                        <Input
                          id="reg-email"
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
                      <Label htmlFor="reg-password">Пароль</Label>
                      <div className="relative">
                        <Input
                          id="reg-password"
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

                    <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                      <strong>Настройки почтового ящика:</strong><br />
                      Домен: <strong>@x69x.fun</strong> • Лимит: <strong>20 MB</strong> • 
                      Протокол: <strong>IMAP/SMTP</strong>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isLoading || !regEmail || !regPassword}
                    >
                      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Создать ящик
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default AuthCard;