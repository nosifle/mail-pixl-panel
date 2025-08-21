import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Eye, EyeOff, Loader2, Trash2, ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

interface PasswordChangeCardProps {
  onChangePassword: (currentPassword: string, newPassword: string, confirmPassword: string) => void;
  onLogoutFromAllAccounts: () => void;
  isLoading: boolean;
  userEmail?: string;
}

const PasswordChangeCard = ({ 
  onChangePassword, 
  onLogoutFromAllAccounts, 
  isLoading, 
  userEmail = "asd13@x68x.fun" 
}: PasswordChangeCardProps) => {
  const navigate = useNavigate();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) return;
    if (newPassword !== confirmPassword) return;
    onChangePassword(currentPassword, newPassword, confirmPassword);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back button */}
        <div className="mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
        </div>
        
        {/* Header with user info */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <Avatar className="h-16 w-16 bg-pink-500">
              <AvatarFallback className="bg-pink-500 text-white text-xl font-semibold">
                A
              </AvatarFallback>
            </Avatar>
          </div>
          <h1 className="text-white text-xl font-medium mb-1">{userEmail}</h1>
        </div>

        {/* Accounts section */}
        <div className="mb-6">
          <h2 className="text-white text-lg font-medium mb-4">Аккаунты (1/20)</h2>
          
          {/* Password change form */}
          <Card className="bg-slate-800 border-slate-700 mb-4">
            <CardHeader className="pb-4">
              <div className="flex items-center text-white">
                <Eye className="w-5 h-5 mr-2" />
                <span className="font-medium">Смена пароля</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password" className="text-slate-300">
                    Новый пароль
                  </Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder=""
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      disabled={isLoading}
                      className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-slate-300">
                    Повторите пароль
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder=""
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                      className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isLoading || !currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                >
                  {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Сменить пароль
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Account info */}
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 bg-pink-500 mr-3">
                    <AvatarFallback className="bg-pink-500 text-white">
                      A
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-white font-medium">{userEmail}</div>
                    <div className="text-slate-400 text-sm">x68x.fun</div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  onClick={onLogoutFromAllAccounts}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Logout from all accounts */}
        <Button
          variant="ghost"
          className="w-full text-red-400 hover:text-red-300 hover:bg-red-900/20"
          onClick={onLogoutFromAllAccounts}
        >
          Выйти из всех аккаунтов
        </Button>
      </div>
    </div>
  );
};

export default PasswordChangeCard;