import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  Package,
  Users,
  BarChart3,
  Settings,
  Shield,
  ArrowLeft,
  LogOut,
  Search,
  Flag,
  MessageSquare,
  Database,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import NotificationDropdown from "../NotificationDropdown\";wn\";tionDropdown\";onDropdown";

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      current: location.pathname === "/admin",
    },
    {
      name: "Items Management",
      href: "/admin/items",
      icon: Package,
      current: location.pathname.startsWith("/admin/items"),
      badge: "156",
    },
    {
      name: "User Management",
      href: "/admin/users",
      icon: Users,
      current: location.pathname.startsWith("/admin/users"),
      badge: "89",
    },
    {
      name: "Match Reviews",
      href: "/admin/matches",
      icon: Search,
      current: location.pathname.startsWith("/admin/matches"),
      badge: "12",
    },
    {
      name: "Reports & Flags",
      href: "/admin/reports",
      icon: Flag,
      current: location.pathname.startsWith("/admin/reports"),
      badge: "3",
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
      current: location.pathname.startsWith("/admin/analytics"),
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
      current: location.pathname.startsWith("/admin/settings"),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Professional Admin Header */}
      <header className="sticky top-0 z-50 border-b border-slate-700 bg-slate-800/95 backdrop-blur supports-[backdrop-filter]:bg-slate-800/90 shadow-xl">
        <div className="flex h-18 items-center justify-between px-8">
          {/* Admin Brand */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-orange-600 shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">FoundIt Admin</h1>
                <p className="text-xs text-slate-300">Management Console</p>
              </div>
            </div>
            <Badge className="bg-red-100 text-red-800 border-red-200 font-semibold">
              ADMIN ACCESS
            </Badge>
          </div>

          {/* Admin Actions */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-slate-300">
              <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">System Online</span>
            </div>
            <Separator orientation="vertical" className="h-6 bg-slate-600" />
            <Link to="/" className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Exit Admin
              </Button>
            </Link>
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-700">
              <MessageSquare className="h-4 w-4 mr-2" />
              Support
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-red-300 hover:text-red-200 hover:bg-red-900/20"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Professional Admin Sidebar */}
        <nav className="w-72 border-r border-slate-700 bg-slate-800 min-h-[calc(100vh-4.5rem)] shadow-2xl">
          <div className="p-6">
            {/* User Info */}
            <div className="mb-8 p-4 bg-slate-700/50 rounded-xl border border-slate-600">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{user?.name?.charAt(0) || 'A'}</span>
                </div>
                <div>
                  <p className="text-white font-semibold">{user?.name || 'Admin'}</p>
                  <p className="text-slate-300 text-xs">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="space-y-3">
              <h2 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-4">
                Management Console
              </h2>
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 group",
                    item.current
                      ? "bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg transform scale-105"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white hover:transform hover:scale-102",
                  )}
                >
                  <div className={cn(
                    "h-8 w-8 rounded-lg flex items-center justify-center",
                    item.current
                      ? "bg-white/20"
                      : "bg-slate-600 group-hover:bg-slate-500"
                  )}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <span className="font-semibold flex-1">{item.name}</span>
                  {item.badge && (
                    <Badge
                      className={cn(
                        "text-xs font-bold",
                        item.current
                          ? "bg-white/20 text-white"
                          : "bg-red-100 text-red-800"
                      )}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              ))}
            </div>

            {/* Admin Tools */}
            <div className="mt-8 pt-6 border-t border-slate-700">
              <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-4">
                System Tools
              </h3>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700">
                  <Settings className="h-4 w-4 mr-3" />
                  System Settings
                </Button>
                <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700">
                  <Database className="h-4 w-4 mr-3" />
                  Database Tools
                </Button>
                <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700">
                  <Activity className="h-4 w-4 mr-3" />
                  System Logs
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 bg-slate-900 p-8 min-h-screen">
          {title && (
            <div className="mb-8 pb-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-white">{title}</h1>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-slate-300 text-sm font-medium">Live Data</span>
                </div>
              </div>
            </div>
          )}
          <div className="text-white">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
