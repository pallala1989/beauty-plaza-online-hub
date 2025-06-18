
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Chrome } from "lucide-react";

const GoogleAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithGoogle } = useAuth();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Google login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleGoogleLogin}
      disabled={isLoading}
      variant="outline"
      className="w-full border-gray-300 hover:bg-gray-50"
    >
      <Chrome className="w-4 h-4 mr-2" />
      {isLoading ? "Signing in..." : "Continue with Google"}
    </Button>
  );
};

export default GoogleAuth;
