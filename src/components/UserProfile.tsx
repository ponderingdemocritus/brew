import React, { useState, useEffect } from "react";
import { User, LogOut } from "lucide-react";
import { getCurrentUser, signOut } from "../services/authService";

interface UserProfileProps {
  onSignOut: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onSignOut }) => {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const user = await getCurrentUser();
        setEmail(user?.email || null);
        setError(null);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to load user information.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      onSignOut();
    } catch (err) {
      console.error("Error signing out:", err);
      setError("Failed to sign out. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <div className="bg-[#6a5c3d] rounded-full p-2 mr-2">
        <User size={16} className="text-white" />
      </div>
      <div className="mr-4">
        <p className="text-sm font-medium">{email}</p>
      </div>
      <button
        onClick={handleSignOut}
        className="text-white hover:text-[#d3c5a9] transition-colors flex items-center"
        title="Sign out"
      >
        <LogOut size={16} />
      </button>
    </div>
  );
};

export default UserProfile;
