import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { auth } from "@/firebase"; // Import Firebase auth
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
} from "firebase/auth";
import { login, signup } from "@/api/authentication/auth"; // Import your backend login and signup functions
import { User } from "@/types";

interface UserContextType {
  user: User | null;
  token: string | null;
  error: string | null;
  loading: boolean | null;
  // Updated to return a Promise<string> (token)
  signUpWithEmail: (
    email: string,
    password: string,
    username: string
  ) => Promise<string>;
  // Updated to return a Promise<string> (token)
  loginWithEmail: (email: string, password: string) => Promise<string>;
  logout: () => void;
  signUpWithGoogle: () => Promise<string>;
  loginWithGoogle: () => void;
  signUpWithFacebook: () => void;
  loginWithFacebook: () => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setError: (error: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const userData: User = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || "Unknown",
              email: firebaseUser.email || "Unknown",
              username: "",
            };
            setUser(userData);

            const idToken = await firebaseUser.getIdToken();
            setToken(idToken);
          } catch (err) {
            console.error("Error retrieving user token:", err);
            setError("Failed to retrieve user token.");
          }
        } else {
          setUser(null);
          setToken(null);
        }
        setLoading(false); // Authentication check completed
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Signup with Email and Password
  const signUpWithEmail = async (
    email: string,
    password: string,
    username: string
  ): Promise<string> => {
    try {
      // Create user with Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Call backend signup API
      const backendResponse = await signup(user.uid, email, "", username);
      if (!backendResponse) {
        throw new Error("Error during registration. Please try again.");
      }

      // Retrieve and set the token
      const token = await user.getIdToken();
      localStorage.setItem("accessToken", token);
      setToken(token);

      // Return the token for further processing (e.g., navigation)
      return token;
    } catch (error) {
      setError((error as Error).message);
      throw error; // Rethrow the error so the caller can handle it
    }
  };
  const loginWithEmail = async (
    email: string,
    password: string
  ): Promise<string> => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      if (!user?.emailVerified) {
        const errMsg = "Please verify your email before logging in.";
        setError(errMsg);
        throw new Error(errMsg);
      }
      const token = await user.getIdToken();
      localStorage.setItem("accessToken", token);
      setUser({
        id: user.uid,
        name: user.displayName || "Unknown",
        email: user.email || "Unknown",
        username: "", // Add the username property
      });
      setToken(token);
      const backendResponse = await login(token);
      if (backendResponse) {
        return token;
      } else {
        const errMsg = "Error during login. Please try again.";
        setError(errMsg);
        throw new Error(errMsg);
      }
    } catch (error) {
      setError((error as Error).message);
      throw error;
    }
  };

  // Google Sign-Up or Login
  const signUpWithGoogle = async (): Promise<string> => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      // call api to check if not exist by email, create user with email
      // signup nestjs
      const user = userCredential.user;
      const signupResponse = await signup(
        user.uid,
        user.email!,
        "",
        user.displayName || ""
      );
      console.log("signupResopnse: ", signupResponse);
      const token = await user.getIdToken();
      localStorage.setItem("accessToken", token);
      let loginResponse = null;
      if (signupResponse.success) {
        loginResponse = await login(token);
      }
      setUser({
        id: user.uid,
        name: user.displayName || "Unknown",
        email: user.email || "Unknown",
        username: "", // Add the username property with a default value
      });
      setToken(token);
      localStorage.setItem("accessToken", token);
      // Call backend login API after Firebase authentication
      if (loginResponse && loginResponse.success) {
        window.location.href = "/home"; // Redirect to home
      }
      return token; // Return the token
    } catch (error) {
      setError((error as Error).message);
      throw error; // Rethrow the error to maintain the Promise<string> contract
    }
  };

  // Facebook Sign-Up or Login
  const signUpWithFacebook = async () => {
    const provider = new FacebookAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      const token = await user.getIdToken();
      setUser({
        id: user.uid,
        name: user.displayName || "Unknown",
        email: user.email || "Unknown",
        username: "", // Add the username property with a default value
      });
      setToken(token);
      // Call backend login API after Firebase authentication
      const backendResponse = await login(token);
      if (backendResponse.success) {
        window.location.href = "/home"; // Redirect to home
      } else {
        // Handle new user registration
        const signupResponse = await signup(
          user.uid,
          user.email!,
          "",
          user.displayName || ""
        );
        if (signupResponse.success) {
          window.location.href = "/home"; // Redirect to home after registration
        } else {
          setError("Error with Facebook login.");
        }
      }
    } catch (error) {
      setError((error as Error).message);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setToken(null);
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        error,
        loading,
        loginWithEmail,
        signUpWithEmail,
        logout,
        signUpWithGoogle,
        loginWithGoogle: signUpWithGoogle, // Reusing the same function for Google login
        signUpWithFacebook,
        loginWithFacebook: signUpWithFacebook, // Reusing the same function for Facebook login
        setUser,
        setToken,
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
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
