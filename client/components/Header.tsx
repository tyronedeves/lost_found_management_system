import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  Search,
  Plus,
  Menu,
  MapPin,
  Shield,
  LogIn,
  LogOut,
  User,
  Settings,
  UserPlus,
  Package,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import NotificationDropdown from "./NotificationDropdown";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <MapPin className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              FoundIt
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/search"
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Browse Items
            </Link>
            <Link
              to="/how-it-works"
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              How It Works
            </Link>
            <Link
              to="/success-stories"
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Success Stories
            </Link>
            {user && isAdmin() && (
              <Link
                to="/admin"
                className="text-foreground/80 hover:text-foreground transition-colors flex items-center gap-1"
              >
                <Shield className="h-4 w-4" />
                Admin
              </Link>
            )}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* Notifications - only show if logged in */}
            {user && (
              <div className="hidden sm:flex">
                <NotificationDropdown />
              </div>
            )}

            {/* Quick Search */}
            <Link to="/search">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 h-10 px-3 bg-white hover:bg-blue-50 border-blue-200 text-blue-700 hover:text-blue-800 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-medium"
              >
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Search</span>
              </Button>
            </Link>

            {/* Report Item Button */}
            <Link to="/report">
              <Button
                size="sm"
                className="h-10 px-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 font-semibold"
              >
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Report Item</span>
                <span className="sm:hidden">Report</span>
              </Button>
            </Link>

            {/* Authentication */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getUserInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                      <Badge variant="outline" className="w-fit text-xs">
                        {user.role}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  {isAdmin() && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="flex items-center bg-gradient-to-r from-red-50 to-orange-50 hover:from-red-100 hover:to-orange-100 text-red-700 font-semibold border border-red-200 rounded-md">
                          <Shield className="mr-2 h-4 w-4 text-red-600" />
                          <span>🛡️ Admin Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/admin/items" className="flex items-center text-orange-700 hover:bg-orange-50">
                          <Package className="mr-2 h-4 w-4" />
                          <span>Manage Items</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/admin/users" className="flex items-center text-orange-700 hover:bg-orange-50">
                          <Users className="mr-2 h-4 w-4" />
                          <span>Manage Users</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                {/* Admin Login Button */}
                <Link to="/admin/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 px-3 bg-gradient-to-r from-red-50 to-orange-50 hover:from-red-100 hover:to-orange-100 text-red-700 font-semibold border-red-200 hover:border-red-300 shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Admin Login</span>
                  </Button>
                </Link>

                <Link to="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 px-3"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Sign In</span>
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    size="sm"
                    className="h-10 px-3 bg-primary text-primary-foreground"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Sign Up</span>
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-3">
              <Link
                to="/search"
                className="text-foreground/80 hover:text-foreground transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse Items
              </Link>
              <Link
                to="/how-it-works"
                className="text-foreground/80 hover:text-foreground transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                to="/success-stories"
                className="text-foreground/80 hover:text-foreground transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Success Stories
              </Link>
              {user && isAdmin() && (
                <Link
                  to="/admin"
                  className="text-foreground/80 hover:text-foreground transition-colors py-2 flex items-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Shield className="h-4 w-4" />
                  Admin Dashboard
                </Link>
              )}
              {!user && (
                <>
                  <div className="pt-3 border-t mt-3 space-y-2">
                    <Link
                      to="/admin/login"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button
                        variant="outline"
                        className="w-full justify-start bg-gradient-to-r from-red-50 to-orange-50 text-red-700 border-red-200 font-semibold"
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        🛡️ Admin Login
                      </Button>
                    </Link>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-left"
                      >
                        <LogIn className="h-4 w-4 mr-2" />
                        Sign In
                      </Button>
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button
                        className="w-full justify-start bg-primary text-primary-foreground"
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Create Account
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
