import { login, signup } from '@/api/authentication/auth';
import { getUserProfile } from '@/features/user-profile-private/api/get-user-profile';
import { auth } from '@/firebase';
import { User } from '@/types';
import {
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  getAdditionalUserInfo,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  isOnboard: boolean;
  error: string | null;
  loading: boolean | null;
  signUpWithEmail: (
    email: string,
    password: string,
    username: string,
  ) => Promise<string>;
  loginWithEmail: (email: string, password: string) => Promise<string>;
  logout: () => void;
  authenWithGoogle: () => Promise<void>;
  signUpWithFacebook: () => void;
  loginWithFacebook: () => void;
  setUser: (user: User | null) => void;
  setError: (error: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = auth.onIdTokenChanged(
      async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const fbToken = await firebaseUser.getIdToken();
            const { access_token } = await login(fbToken);
            localStorage.setItem('accessToken', access_token);
            const data = await getUserProfile();
            setUser(data);
          } catch (err) {
            console.error('Error retrieving user token:', err);
            setError('Failed to retrieve user token.');
          }
        } else {
          setUser(null);
        }
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const signUpWithEmail = async (
    email: string,
    password: string,
    username: string,
  ): Promise<string> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      await signup(user.uid, email, '', username);
      const token = await user.getIdToken();
      return token;
    } catch (error) {
      setError((error as Error).message);
      throw error;
    }
  };

  const loginWithEmail = async (
    email: string,
    password: string,
  ): Promise<string> => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      if (!user?.emailVerified) {
        const errMsg = 'Please verify your email before logging in.';
        setError(errMsg);
        throw new Error(errMsg);
      }

      const data = await getUserProfile();
      setUser(data);

      const token = await user.getIdToken();
      const backendResponse = await login(token);
      if (backendResponse) {
        return token;
      } else {
        const errMsg = 'Error during login. Please try again.';
        setError(errMsg);
        throw new Error(errMsg);
      }
    } catch (error) {
      setError((error as Error).message);
      throw error;
    }
  };

  const authenWithGoogle = async (): Promise<void> => {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const { user: googleUser } = result;
      const isNewUser = getAdditionalUserInfo(result)?.isNewUser;

      if (isNewUser) {
        await signup(
          googleUser.uid,
          googleUser.email!,
          '',
          googleUser.displayName || '',
        );
      }

      const googleToken = await googleUser.getIdToken();
      const loginResponse = await login(googleToken);
      localStorage.setItem('accessToken', loginResponse.access_token);

      const data = await getUserProfile();
      setUser(data);
    } catch (error) {
      setError((error as Error).message);
      console.error('Google sign-in error:', error);
      throw error;
    }
  };

  const signUpWithFacebook = async () => {
    const provider = new FacebookAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      const token = await user.getIdToken();

      const backendResponse = await login(token);
      if (backendResponse.success) {
        navigate('/home', { replace: true });
      } else {
        const signupResponse = await signup(
          user.uid,
          user.email!,
          '',
          user.displayName || '',
        );
        if (signupResponse.success) {
          navigate('/home', { replace: true });
        } else {
          setError('Error with Facebook login.');
        }
      }
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem('accessToken');
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated: !!user, // <- NEW flag
        isOnboard: user?.is_onboard ?? false,
        error,
        loading,
        loginWithEmail,
        signUpWithEmail,
        logout,
        authenWithGoogle,
        signUpWithFacebook,
        loginWithFacebook: signUpWithFacebook,
        setUser,
        setError,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
