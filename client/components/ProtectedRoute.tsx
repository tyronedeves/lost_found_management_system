import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Lock, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "./Header";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  requireModerator?: boolean;
}

export default function ProtectedRoute({
  children,
  requireAdmin = false,
  requireModerator = false,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-2" />
            <span>Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check admin permission
  if (requireAdmin && user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto">
            <Card className="border-red-200 bg-red-50">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                    <Lock className="h-6 w-6 text-red-600" />
                  </div>
                </div>
                <CardTitle className="text-xl text-red-900">
                  Access Denied
                </CardTitle>
                <CardDescription className="text-red-700">
                  You need administrator privileges to access this page.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 justify-center text-sm text-red-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Admin access required</span>
                  </div>
                  <div className="space-y-2">
                    <Link to="/">
                      <Button variant="outline" className="w-full">
                        Return to Home
                      </Button>
                    </Link>
                    <p className="text-xs text-red-600">
                      Current role: {user.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Check moderator permission
  if (requireModerator && user.role !== "moderator" && user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto">
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                    <Shield className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
                <CardTitle className="text-xl text-yellow-900">
                  Access Restricted
                </CardTitle>
                <CardDescription className="text-yellow-700">
                  You need moderator or administrator privileges to access this
                  page.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 justify-center text-sm text-yellow-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Moderator access required</span>
                  </div>
                  <div className="space-y-2">
                    <Link to="/">
                      <Button variant="outline" className="w-full">
                        Return to Home
                      </Button>
                    </Link>
                    <p className="text-xs text-yellow-600">
                      Current role: {user.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // User has proper permissions, render the protected content
  return <>{children}</>;
}
