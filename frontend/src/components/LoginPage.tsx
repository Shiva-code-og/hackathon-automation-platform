import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { ShieldCheck } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (profile: any) => void;
}

export const LoginPage = ({ onLoginSuccess }: LoginPageProps) => {
  const handleLoginSuccess = (credentialResponse: any) => {
    if (credentialResponse.credential) {
      const decoded: any = jwtDecode(credentialResponse.credential);
      const userProfile = {
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture
      };
      localStorage.setItem('manager_profile', JSON.stringify(userProfile));
      onLoginSuccess(userProfile);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#FFF8EF] items-center justify-center font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-[#E8DCCB] p-8 text-center space-y-8">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-[#F9F3EA] rounded-2xl flex items-center justify-center border border-[#FF6B00]/20">
            <ShieldCheck size={32} className="text-[#FF6B00]" />
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-[#1F2937] mb-2">Welcome Back</h2>
          <p className="text-gray-500 text-sm">Sign in to access your automation dashboard and manage workflows.</p>
        </div>

        <div className="flex justify-center pt-4">
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={() => console.log('Login Failed')}
            useOneTap
            theme="outline"
            size="large"
            shape="pill"
          />
        </div>
      </div>
    </div>
  );
};
