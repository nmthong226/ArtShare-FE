import { login, signup } from '@/api/authentication/auth';
import api from '@/api/baseApi';
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

// Constants for better maintainability
const BACKEND_TOKEN_PROCESSING_DELAY_MS = 100;
const AUTH_RETRY_DELAY_MS = 500;
const LOADING_DELAY_MS = 1000;

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log("🔐 UserProvider: Setting up auth listener");
    const unsubscribe = auth.onIdTokenChanged(
      async (firebaseUser) => {
        if (firebaseUser) {
          console.log(
            "🔐 UserProvider: Firebase user detected, fetching backend token",
          );
          try {
            const fbToken = await firebaseUser.getIdToken();
            const { access_token } = await login(fbToken);
            localStorage.setItem("accessToken", access_token);
            api.defaults.headers.common["Authorization"] =
              `Bearer ${access_token}`;

            console.log(
              "🔐 UserProvider: Token set, waiting 100ms before fetching profile",
            );
            // Add a small delay to ensure the backend has processed the token
            await new Promise((resolve) =>
              setTimeout(resolve, BACKEND_TOKEN_PROCESSING_DELAY_MS),
            );

            console.log("🔐 UserProvider: Fetching user profile");
            const data = await getUserProfile();
            setUser(data);
            console.log("🔐 UserProvider: User profile set successfully");
          } catch (err) {
            console.error("🔐 UserProvider: Error retrieving user token:", err);

            // If it's an authentication error, retry once after a short delay
            if (
              err instanceof Error &&
              err.message.includes("not authenticated yet")
            ) {
              console.log("🔐 UserProvider: Auth not ready, retrying in 500ms");
              setTimeout(async () => {
                try {
                  const data = await getUserProfile();
                  setUser(data);
                  console.log("🔐 UserProvider: Retry successful");
                } catch (retryErr) {
                  console.error("🔐 UserProvider: Retry failed:", retryErr);
                  setError("Failed to retrieve user profile after retry.");
                }
              }, AUTH_RETRY_DELAY_MS);
            } else {
              setError("Failed to retrieve user token.");
            }
          }
        } else {
          console.log("🔐 UserProvider: No Firebase user, clearing state");
          setUser(null);
          // Clear authorization header when user logs out
          delete api.defaults.headers.common["Authorization"];
          localStorage.removeItem("accessToken");
        }
        setTimeout(() => {
          setLoading(false);
        }, LOADING_DELAY_MS);
      },
      (err) => {
        console.error("🔐 UserProvider: Auth listener error:", err);
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

      // Don't call getUserProfile here - let onIdTokenChanged handle it
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

      // Don't call getUserProfile here - let onIdTokenChanged handle it
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
