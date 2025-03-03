import { createFileRoute, useNavigate } from "@tanstack/react-router";
import Auth from "../components/Auth";
import SimpleAuth from "../components/SimpleAuth";
import { Coffee } from "lucide-react";
import { getSession } from "../services/authService";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  console.log("AuthPage component rendering");
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);
  const [useSimpleAuth, setUseSimpleAuth] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Auth page checking session");
        const session = await getSession();
        console.log("Auth page session check:", !!session);

        if (session) {
          console.log(
            "Auth page: User already authenticated, navigating to home"
          );
          // Use a timeout to prevent immediate redirect which could cause loops
          setTimeout(() => {
            navigate({ to: "/" });
          }, 100);
        }
      } catch (err) {
        console.error("Error checking authentication:", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleAuthSuccess = () => {
    console.log("Auth success, navigating to home");
    // Redirect to the home page after successful authentication
    navigate({ to: "/" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f5f0] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8c7851] mx-auto mb-4"></div>
          <p className="text-[#3c3027]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <main
        className="container mx-auto p-4 md:p-6 flex items-center justify-center flex-col"
        style={{ minHeight: "calc(100vh - 80px)" }}
      >
        {authError ? (
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 card-border max-w-md mx-auto">
            <h2 className="text-2xl md:text-3xl mb-6 text-[#3c3027] text-center">
              Authentication Error
            </h2>
            <p className="text-red-600 mb-4">{authError}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-hipster w-full py-3"
            >
              Reload Page
            </button>
          </div>
        ) : (
          <>
            <Auth onAuthSuccess={handleAuthSuccess} />
          </>
        )}
      </main>
    </div>
  );
}
