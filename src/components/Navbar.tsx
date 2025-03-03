import React from "react";
import { Coffee, Plus, X } from "lucide-react";
import UserProfile from "./UserProfile";
import { signOut } from "../services/authService";
import { useNavigate } from "@tanstack/react-router";

interface NavbarProps {
  authenticated: boolean;
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  resetForm: () => void;
  setAuthenticated: (auth: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({
  authenticated,
  showForm,
  setShowForm,
  editingId,
  setEditingId,
  resetForm,
  setAuthenticated,
}) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      setAuthenticated(false);
      // Navigate to auth page
      navigate({ to: "/auth" });
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  if (!authenticated) {
    return (
      <header className="bg-[#3c3027] text-[#f8f5f0] p-4 md:p-6 shadow-md">
        <div className="container mx-auto">
          <h1
            className="text-2xl md:text-3xl font-bold flex items-center justify-center"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <Coffee className="mr-3" strokeWidth={1.5} />
            <span>Loafs Brew Journal</span>
            <span className="ml-2 text-sm font-handwritten font-normal text-[#d3c5a9] mt-1">
              est. 2025
            </span>
          </h1>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-[#3c3027] text-[#f8f5f0] p-4 md:p-6 shadow-md">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <h1
          className="text-2xl md:text-3xl font-bold flex items-center mb-4 sm:mb-0"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          <Coffee className="mr-3" strokeWidth={1.5} />
          <span>Loafs Brew Journal</span>
          <span className="ml-2 text-sm font-handwritten font-normal text-[#d3c5a9] mt-1">
            est. 2025
          </span>
        </h1>
        <div className="flex items-center space-x-4">
          <UserProfile onSignOut={handleSignOut} />
          <button
            onClick={() => {
              setShowForm(!showForm);
              if (editingId) {
                setEditingId(null);
                resetForm();
              }
            }}
            className="btn-hipster flex items-center"
          >
            {showForm ? (
              <>
                <X className="mr-2" size={18} /> Cancel
              </>
            ) : (
              <>
                <Plus className="mr-2" size={18} /> New Extraction
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
