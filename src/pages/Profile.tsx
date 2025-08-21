import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PasswordChangeCard from "@/components/PasswordChangeCard";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, updatePassword, signOutFromAllDevices } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  const handleChangePassword = async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    if (newPassword !== confirmPassword) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await updatePassword(newPassword);
      if (result.success) {
        // Password changed successfully, toast is shown in the hook
      }
    } catch (error) {
      console.error("Password change error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoutFromAllAccounts = async () => {
    try {
      const result = await signOutFromAllDevices();
      if (result.success) {
        navigate('/');
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  // Don't render if user is not authenticated (will redirect)
  if (!user) {
    return null;
  }

  return (
    <PasswordChangeCard
      onChangePassword={handleChangePassword}
      onLogoutFromAllAccounts={handleLogoutFromAllAccounts}
      isLoading={isLoading}
      userEmail={user.email || "asd13@x68x.fun"}
    />
  );
};

export default Profile;