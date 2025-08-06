import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Zap,
  Brain,
  Shield,
  Smartphone,
  Bell,
  MapPin,
  Clock,
  Users,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Star,
  LogIn,
  UserPlus,
} from "lucide-react";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";

export default function Index() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/search');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100 py-24 sm:py-40">
        <div className="absolute inset-0 bg-grid-slate-100/30 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.8))]" />
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 text-sm px-4 py-2">
              🚀 Real-time • AI-Powered • Mobile-First
            </Badge>
            <h1 className="text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-8xl leading-tight">
              Lost Something?{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                We'll Find It
              </span>
            </h1>
            <p className="mt-8 text-xl leading-8 text-slate-700 sm:text-2xl font-medium max-w-4xl mx-auto">
              The world's most advanced lost and found platform with real-time
              notifications, intelligent matching algorithms, and instant alerts
              the moment your item is found.
            </p>

            {/* Quick Action Buttons */}
            <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:justify-center sm:gap-4">
              <Link to="/report/lost">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-14 px-8 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-200"
                >
                  <Search className="mr-3 h-6 w-6" />I Lost Something
                </Button>
              </Link>
              <Link to="/report/found">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto h-14 px-8 text-lg font-semibold border-2 border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
                >
                  <MapPin className="mr-3 h-6 w-6" />I Found Something
                </Button>
              </Link>
            </div>

            {/* Authentication Buttons for non-authenticated users */}
            {!user && (
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-4">
                <Link to="/login">
                  <Button
                    size="lg"
                    variant="ghost"
                    className="w-full sm:w-auto h-12 px-6 border border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
                  >
                    <LogIn className="mr-2 h-5 w-5" />
                    Sign In to Your Account
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto h-12 px-6 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                  >
                    <UserPlus className="mr-2 h-5 w-5" />
                    Create Free Account
                  </Button>
                </Link>
              </div>
            )}

            {/* Quick Search */}
            <div className="mt-12 mx-auto max-w-2xl">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Quick search: wallet, keys, phone, laptop..."
                  className="h-14 pl-12 pr-24 text-lg bg-white/95 backdrop-blur border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-slate-900 placeholder:text-slate-500 shadow-xl rounded-xl"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleSearch}
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-4 bg-blue-600 hover:bg-blue-700 text-sm font-semibold rounded-lg shadow-lg"
                >
                  Search
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-40 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Why FoundIt Succeeds Where Others Fail
            </h2>
            <p className="mt-6 text-xl text-slate-700 font-medium sm:text-2xl">
              We've solved the critical gaps in traditional lost and found systems
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {/* Real-time Updates */}
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-105 bg-white/80 backdrop-blur">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1">Live</Badge>
                </div>
                <CardTitle className="text-xl font-bold text-slate-900">Real-time Everything</CardTitle>
                <CardDescription className="text-base text-slate-700 font-medium">
                  Instant notifications and live data synchronization. Get
                  alerts the moment your item is reported.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                  <Bell className="h-5 w-5 text-blue-600" />
                  <span>Immediate push notifications</span>
                </div>
              </CardContent>
            </Card>

            {/* Intelligent Matching */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                    <Brain className="h-6 w-6 text-purple-600" />
                  </div>
                  <Badge variant="secondary">AI</Badge>
                </div>
                <CardTitle>Smart Matching</CardTitle>
                <CardDescription>
                  Our algorithm considers categories, locations, dates, and
                  descriptions simultaneously for accurate matches.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span>94% match accuracy</span>
                </div>
              </CardContent>
            </Card>

            {/* Mobile-First */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                    <Smartphone className="h-6 w-6 text-green-600" />
                  </div>
                  <Badge variant="secondary">Mobile</Badge>
                </div>
                <CardTitle>Mobile-First Design</CardTitle>
                <CardDescription>
                  Optimized touch interfaces and responsive design. Report items
                  instantly from anywhere.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4" />
                  <span>Works on any device</span>
                </div>
              </CardContent>
            </Card>

            {/* Administrative Tools */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <Badge variant="secondary">Admin</Badge>
                </div>
                <CardTitle>Powerful Admin Tools</CardTitle>
                <CardDescription>
                  Comprehensive management capabilities for institutions and
                  organizations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Multi-user management</span>
                </div>
              </CardContent>
            </Card>

            {/* Scalability */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                  <Badge variant="secondary">Scale</Badge>
                </div>
                <CardTitle>Enterprise Ready</CardTitle>
                <CardDescription>
                  Built with Appwrite for institutional-scale deployment and
                  reliability.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>99.9% uptime guaranteed</span>
                </div>
              </CardContent>
            </Card>

            {/* Security */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                    <Shield className="h-6 w-6 text-red-600" />
                  </div>
                  <Badge variant="secondary">Secure</Badge>
                </div>
                <CardTitle>Privacy Protected</CardTitle>
                <CardDescription>
                  Your personal information is encrypted and protected with
                  enterprise-grade security.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>End-to-end encryption</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-br from-blue-50 to-blue-100 py-24 sm:py-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Trusted by Thousands
            </h2>
            <p className="mt-6 text-xl text-slate-700 font-medium sm:text-2xl">
              See how we're revolutionizing lost and found
            </p>
          </div>

          <div className="mt-20 grid grid-cols-2 gap-10 sm:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 sm:text-4xl">
                15,847
              </div>
              <div className="mt-2 text-sm text-slate-600 font-medium">
                Items Reunited
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 sm:text-4xl">
                94%
              </div>
              <div className="mt-2 text-sm text-slate-600 font-medium">
                Success Rate
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 sm:text-4xl">
                2.3hrs
              </div>
              <div className="mt-2 text-sm text-slate-600 font-medium">
                Avg. Match Time
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 sm:text-4xl">
                50+
              </div>
              <div className="mt-2 text-sm text-slate-600 font-medium">
                Partner Institutions
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            {user ? (
              <>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  Welcome back, {user.name}!
                </h2>
                <p className="mt-4 text-lg text-slate-700 font-medium">
                  Ready to report an item or search for matches?
                </p>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <Link to="/report/lost">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-primary hover:bg-primary/90"
                    >
                      Report Lost Item
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/search">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      Browse Found Items
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  Join FoundIt Today
                </h2>
                <p className="mt-4 text-lg text-slate-700 font-medium">
                  Create your free account to start finding lost items with AI-powered matching
                </p>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <Link to="/register">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-primary hover:bg-primary/90"
                    >
                      <UserPlus className="mr-2 h-5 w-5" />
                      Create Free Account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto border-blue-200 text-blue-700 hover:bg-blue-50"
                    >
                      <LogIn className="mr-2 h-5 w-5" />
                      Sign In
                    </Button>
                  </Link>
                </div>
                <div className="mt-6">
                  <p className="text-sm text-slate-600">
                    Or browse items without an account:{" "}
                    <Link to="/search" className="text-blue-600 hover:text-blue-800 underline">
                      Search Items
                    </Link>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center space-x-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground">
                <MapPin className="h-4 w-4" />
              </div>
              <span className="font-semibold">FoundIt</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>© 2024 FoundIt. All rights reserved.</span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>4.9/5 rating</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
