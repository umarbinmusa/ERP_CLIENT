import { useState, useRef, useEffect } from "react";
import { Bell, User, ChevronDown, LogOut, Settings, UserCircle } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useAuth } from "./AuthContext";

const getRoleBadgeVariant = (role: string) => {
  switch (role) {
    case "Managing Director": return "default";
    case "Finance Manager": return "secondary";
    default: return "outline";
  }
};

export function TopNavigation() {
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  return (
    <div className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between relative z-50">
      {/* Company Branding */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 flex items-center justify-center">
            
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Hari Industries Limited</h1>
            <p className="text-xs text-gray-500">Excellence in Water Processing & Distribution</p>
          </div>
        </div>
      </div>

      {/* Right Side Navigation */}
      <div className="flex items-center space-x-4">
        {/* Role Badge */}
        <Badge variant={getRoleBadgeVariant(user?.role || "")} className="px-3 py-1">
          {user?.role}
        </Badge>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
            3
          </span>
        </Button>

        {/* User Menu - Custom Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <Button 
            variant="ghost" 
            className="flex items-center space-x-2"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          >
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="h-4 w-4" />
            </div>
            <span className="hidden md:block">{user?.fullName}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
          </Button>

          {/* Dropdown Menu */}
          {isUserMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-[100]">
              {/* User Info */}
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm text-gray-900">{user?.fullName}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>

              {/* Menu Items */}
              <button
                className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                onClick={() => {
                  setIsUserMenuOpen(false);
                  // Add navigation logic here
                }}
              >
                <UserCircle className="h-4 w-4" />
                <span>Profile Settings</span>
              </button>

              <button
                className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                onClick={() => {
                  setIsUserMenuOpen(false);
                  // Add navigation logic here
                }}
              >
                <Settings className="h-4 w-4" />
                <span>Account Settings</span>
              </button>

              {/* Separator */}
              <div className="border-t border-gray-100 my-1"></div>

              {/* Logout */}
              <button
                className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 flex items-center space-x-2"
                onClick={() => {
                  setIsUserMenuOpen(false);
                  logout();
                }}
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}