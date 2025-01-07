import {
  createContext,
  useContext,
  useState,
  useEffect
} from "react";

import { useNavigate } from "react-router-dom";

import api from "../lib/api";
import sb from "../lib/supabase";

const AuthContext = createContext({
  isLoading: true,
  isAuth: false,
  user: { id: 0 },
  profileBuffer: null,
  signIn: async (username, password) => {
    return { ok: false, message: "" };
  },
  signUp: async (username, email, password) => {
    return { ok: false, message: "" };
  },
  signOut: async () => {
    return { ok: false, message: "" };
  },
  anon: async () => {
    return { ok: false, message: "" };
  },
  update: async (username, handle, email, bio, password, imageName, imageType, imageData) => {
    return { ok: false, message: "" };
  },
});

const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState({});
  const [profileBuffer, setProfileBuffer] = useState(null);
  const navigate = useNavigate(); 

  const setTheUser = async (newUser) => {
    setUser(newUser);
    if (newUser.image_name) {
      const downloaded = await sb.storage.getImage("user-" + newUser.id, newUser.image_name);
      setProfileBuffer(downloaded);
    }
  };

  useState(() => {
    const checkAuth = async () => {
      const result = await api.user.isAuth();
      if (result.ok) {
        setIsAuth(true);
        await setTheUser(result.user);
      } else {
        navigate("/sign-in");
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const signIn = async (username, password) => {
    const result = await api.user.signIn(username, password);
    if (result.ok) {
      await setTheUser(result.user);
      setIsAuth(true);
    }
    setIsLoading(false);
    return result;
  };

  const signUp = async (username, handle, email, password) => {
    const result = await api.user.signUp(username, handle, email, password);
    return result;
  };

  const signOut = async () => {
    api.user.signOut();
    setIsAuth(false);
    navigate("/sign-in");
  };
  
  const anon = async () => {
    const result = await api.user.anon();
    if (result.ok) {
      await setTheUser(result.user);
      setIsAuth(true);
    }
    
    setIsLoading(false);
    return result;
  };
  
  const update = async (username, handle, email, bio, password, imageName, imageType, imageData) => {
    const result = await api.user.update(username, handle, email, bio, password, imageName, imageType, imageData);
    if (result.ok) {
      result.ok = !result.errMessages.some(element => element !== "");
      if (result.ok) {
        await setTheUser(result.newUser);
      } else {
        result.message = "An Error On Some Field";
      }
    }
    return result;
  };

  return (
    <AuthContext.Provider value={{ isLoading, isAuth, user, signIn, signUp, signOut, anon, update, profileBuffer }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthContext, AuthProvider, useAuth };
