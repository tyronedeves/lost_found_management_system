import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  BarChart3, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  Database,
  Users,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      // Redirect directly to analytics after successful admin login
      navigate("/admin/analytics");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-700/25 bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]"></div>
      
      <div className="relative w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Analytics Preview */}
        <div className="hidden lg:block space-y-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-orange-600 shadow-xl">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">FoundIt Admin</h1>
                <p className="text-slate-300">Analytics Dashboard</p>
              </div>
            </div>
            
            <Badge className="bg-red-100 text-red-800 border-red-200 font-semibold text-sm px-4 py-2">
              🛡️ ADMINISTRATOR ACCESS REQUIRED
            </Badge>
          </div>

          {/* Analytics Preview Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-blue-400" />
                  <CardTitle className="text-white text-sm">Live Analytics</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">2,847</div>
                <p className="text-xs text-slate-400">Total Users</p>
                <div className="flex items-center space-x-1 mt-2">
                  <TrendingUp className="h-3 w-3 text-green-400" />
                  <span className="text-xs text-green-400">+12.5%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-green-400" />
                  <CardTitle className="text-white text-sm">Active Now</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">1,623</div>
                <p className="text-xs text-slate-400">Online Users</p>
                <div className="flex items-center space-x-1 mt-2">
                  <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-400">Live</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-purple-400" />
                  <CardTitle className="text-white text-sm">System Status</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-white font-semibold">99.8%</span>
                </div>
                <p className="text-xs text-slate-400">Uptime</p>
                <div className="flex items-center space-x-1 mt-2">
                  <Activity className="h-3 w-3 text-green-400" />
                  <span className="text-xs text-green-400">Operational</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  <CardTitle className="text-white text-sm">Alerts</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">3</div>
                <p className="text-xs text-slate-400">Pending Reviews</p>
                <div className="flex items-center space-x-1 mt-2">
                  <div className="h-2 w-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-yellow-400">Attention</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Features List */}
          <Card className="bg-slate-800/30 border-slate-700 backdrop-blur">
            <CardContent className="pt-6">
              <h3 className="text-white font-semibold mb-4">Admin Analytics Features</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3 text-slate-300">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>Real-time user activity monitoring</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-300">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>Item matching success analytics</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-300">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>Geographic user distribution</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-300">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>System performance metrics</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-300">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>Automated reporting & alerts</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          <Card className="bg-slate-800/95 border-slate-700 shadow-2xl backdrop-blur">
            <CardHeader className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 shadow-xl">
                  <Lock className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-white">Admin Login</CardTitle>
                <CardDescription className="text-slate-400 mt-2">
                  Access analytics dashboard and admin controls
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-200 font-medium">
                    Admin Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@foundit.com"
                    required
                    className="h-12 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-200 font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your admin password"
                      required
                      className="h-12 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 pr-12"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-12 px-3 py-2 text-slate-400 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" />
                      <span>Authenticating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Shield className="h-5 w-5" />
                      <span>Access Analytics Dashboard</span>
                    </div>
                  )}
                </Button>
              </form>

              <div className="pt-4 border-t border-slate-700 space-y-4">
                <div className="text-center">
                  <Link 
                    to="/" 
                    className="inline-flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Main Site</span>
                  </Link>
                </div>
                
                <div className="text-center">
                  <p className="text-xs text-slate-500">
                    Regular user? <Link to="/login" className="text-blue-400 hover:text-blue-300">Login here</Link>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admin Demo Info */}
          <Card className="mt-6 bg-blue-900/20 border-blue-800/50 backdrop-blur">
            <CardContent className="pt-4">
              <div className="text-center space-y-2">
                <p className="text-blue-200 text-sm font-medium">Demo Admin Access</p>
                <p className="text-blue-300 text-xs">
                  Use: walter@foundit.com or walterenebeli@gmail.com
                </p>
                <p className="text-blue-400 text-xs">
                  Password: any (demo mode when Appwrite unavailable)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
