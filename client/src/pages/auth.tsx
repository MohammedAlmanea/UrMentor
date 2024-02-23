import { BsGoogle } from "react-icons/bs"; 
import AuthSocialButton from "../components/auth/sociaButtons";

const Auth = () => {
    const handleLogin = async () => {
        window.location.href = 'http://localhost:5600/auth/google';
    }
    
  return (
      <AuthSocialButton
        icon={BsGoogle}
        onClick={handleLogin}
      />
  );
};

export default Auth;