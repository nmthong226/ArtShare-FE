import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth } from "@/firebase"; // Firebase auth instance
import {
  verifyPasswordResetCode,
  confirmPasswordReset,
  applyActionCode,
} from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { validatePassword } from "@/utils/validation";

const AuthAction = () => {
  const location = useLocation(); // Access the URL parameters (e.g., mode, oobCode)
  const navigate = useNavigate();
  const [mode, setMode] = useState<string | null>(null); // To store the mode from URL (verifyEmail/resetPassword)
  const [oobCode, setOobCode] = useState<string | null>(null); // Store the reset or verification code
  const [email, setEmail] = useState<string | null>(null); // Store the email for password reset or email verification
  const [password, setPassword] = useState(""); // For the new password input (if mode is resetPassword)
  const [message, setMessage] = useState<string | null>(null); // Success message
  const [error, setError] = useState<string | null>(null); // Error message
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const modeFromUrl = params.get("mode");
    const oobCodeFromUrl = params.get("oobCode");

    setMode(modeFromUrl);
    setOobCode(oobCodeFromUrl);

    if (oobCodeFromUrl) {
      if (modeFromUrl === "resetPassword") {
        // Verify the password reset code
        verifyPasswordResetCode(auth, oobCodeFromUrl)
          .then((email) => {
            setEmail(email); // Store the user's email for password reset
          })
          .catch((e) => {
            if (e) setError("Invalid or expired reset code.");
          });
      } else if (modeFromUrl === "verifyEmail") {
        console.log("Verify Email Mode");
        // Use applyActionCode to verify the email
        applyActionCode(auth, oobCodeFromUrl)
          .then(() => {
            // Optionally, reload the user to update emailVerified status:
            // await auth.currentUser?.reload();
            setMessage("Email verified successfully!");
            setError(null);
            navigate("/login"); // Redirect to login after successful email verification
          })
          .catch((error) => {
            console.log(error);
            setError("Invalid or expired verification code.");
          });
      }
    }
  }, [location, navigate]);
  // Handle password reset
  const handleSubmitPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password using the validation function
    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setError(passwordValidationError);
      return;
    }

    if (oobCode) {
      setLoading(true);
      try {
        await confirmPasswordReset(auth, oobCode, password);
        setMessage("Password has been reset successfully!");
        setError(null);
        navigate("/login"); // Redirect to login after successful password reset
      } catch (error) {
        setMessage(null);
        setError((error as Error).message); // Handle any errors (invalid token, etc.)
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex-1 space-y-4 px-10 md:px-0 lg:px-10 xl:px-20 py-8">
      <div className="flex flex-col space-x-3">
        <h1 className="font-bold text-mountain-800 dark:text-mountain-50 text-2xl xl:text-3xl leading-6">
          {mode === "resetPassword"
            ? "Reset Your Password"
            : "Verify Your Email"}
        </h1>
        <p className="mt-4 text-mountain-500 dark:text-mountain-300 text-xs xl:text-sm">
          {mode === "resetPassword"
            ? "Enter a new password below."
            : "Email successfully verified! Please check your inbox."}
        </p>
      </div>
      {/* Reset Password Form */}
      {mode === "resetPassword" && oobCode && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block font-semibold text-mountain-600 dark:text-mountain-50 text-sm"
            >
              New Password
            </label>{" "}
            <Input
              type="password"
              id="password"
              placeholder="Choose Your New Password"
              className="dark:bg-mountain-900 shadow-sm mt-1 p-3 border border-mountain-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="mt-1 text-mountain-500 dark:text-mountain-400 text-xs">
              Password must be at least 8 characters with numbers & symbols
            </p>
            <Button
              type="submit"
              className="bg-mountain-800 hover:bg-mountain-700 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-10 font-bold text-white"
              onClick={handleSubmitPasswordReset}
              disabled={loading}
            >
              {loading ? "Resetting..." : "Recover My Account"}
            </Button>
          </div>
        </div>
      )}
      {/* Success and Error Messages */}
      {error && (
        <p className="mt-4 text-red-600 dark:text-red-400 text-sm">{error}</p>
      )}
      {message && (
        <p className="mt-4 text-green-600 dark:text-green-400 text-sm">
          {message}
        </p>
      )}
      {mode === "verifyEmail" && email && (
        <div>
          {message && (
            <p className="mt-4 text-green-600 dark:text-green-400 text-sm">
              {message}
            </p>
          )}
        </div>
      )}
      <p className="text-indigo-600 dark:text-indigo-300 text-sm">
        If you need any help, don't hesitate to go to the
        <span className="ml-1 font-bold">Help Center</span>
      </p>
    </div>
  );
};

export default AuthAction;
