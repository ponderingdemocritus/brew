import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import CoffeeNavigation from "../components/CoffeeNavigation";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { getSession, signOut } from "../services/authService";

export const Route = createRootRoute({
  component: () => {
    const [authenticated, setAuthenticated] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Check authentication status on component mount
    useEffect(() => {
      const checkAuth = async () => {
        try {
          const session = await getSession();
          setAuthenticated(!!session);
        } catch (err) {
          console.error("Error checking authentication:", err);
          setAuthenticated(false);
        } finally {
          setAuthChecked(true);
        }
      };

      checkAuth();
    }, []);

    const handleSignOut = async () => {
      try {
        await signOut();
        setAuthenticated(false);
      } catch (err) {
        console.error("Error signing out:", err);
      }
    };

    const resetForm = () => {
      // Reset form logic would go here
      // This is just a placeholder since we don't have the form state in this component
    };

    // If authentication is still being checked, show loading
    if (!authChecked) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700 mx-auto mb-4"></div>
            <p className="text-gray-700">Loading...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar
          authenticated={authenticated}
          showForm={showForm}
          setShowForm={setShowForm}
          editingId={editingId}
          setEditingId={setEditingId}
          resetForm={resetForm}
          setAuthenticated={setAuthenticated}
        />
        {authenticated && <CoffeeNavigation />}
        <div className="container mx-auto px-4 py-6">
          <Outlet />
        </div>
        <TanStackRouterDevtools />
      </div>
    );
  },
});
