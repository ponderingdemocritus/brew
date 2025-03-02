import React, { useState, useEffect } from "react";
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGitHub,
} from "../services/authService";
import { Lock, Mail, User, ArrowRight, Github, Loader } from "lucide-react";
import { supabase } from "../lib/supabase";

interface AuthProps {
  onAuthSuccess: () => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for OAuth redirect
  useEffect(() => {
    const checkOAuthRedirect = async () => {
      const hash = window.location.hash;
      if (hash && hash.includes("access_token")) {
        // This is a redirect from OAuth
        try {
          const { data, error } = await supabase.auth.getSession();
          if (data.session) {
            onAuthSuccess();
          }
        } catch (err) {
          console.error("Error processing OAuth redirect:", err);
        }
      }
    };

    checkOAuthRedirect();
  }, [onAuthSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
      onAuthSuccess();
    } catch (err: any) {
      console.error("Authentication error:", err);
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubSignIn = async () => {
    setGithubLoading(true);
    setError(null);

    try {
      await signInWithGitHub();
      // Note: We don't call onAuthSuccess() here because the page will redirect to GitHub
    } catch (err: any) {
      console.error("GitHub authentication error:", err);
      setError(
        err.message || "GitHub authentication failed. Please try again."
      );
      setGithubLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 md:p-8 card-border max-w-md mx-auto">
      <h2
        className="text-2xl md:text-3xl mb-6 text-[#3c3027] text-center"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {isLogin ? "Welcome Back" : "Create Account"}
      </h2>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail size={18} className="text-gray-400" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 w-full p-3 border border-gray-200 rounded-md focus:ring-[#8c7851] focus:border-[#8c7851] input-hipster"
              placeholder="your@email.com"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock size={18} className="text-gray-400" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 w-full p-3 border border-gray-200 rounded-md focus:ring-[#8c7851] focus:border-[#8c7851] input-hipster"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn-hipster w-full py-3 flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              {isLogin ? "Sign In" : "Sign Up"}{" "}
              <ArrowRight className="ml-2" size={18} />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handleGitHubSignIn}
          className="w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8c7851] flex items-center justify-center"
          disabled={githubLoading}
        >
          {githubLoading ? (
            <Loader className="animate-spin h-5 w-5 text-gray-500" />
          ) : (
            <>
              <Github className="mr-2" size={18} />
              Sign in with GitHub
            </>
          )}
        </button>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-[#8c7851] hover:underline text-sm"
        >
          {isLogin
            ? "Need an account? Sign up"
            : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
};

export default Auth;
