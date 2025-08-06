import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Package,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Search,
  Heart,
  MapPin,
  Calendar,
  DollarSign,
  Zap,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Eye,
} from "lucide-react";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Item } from "@shared/types";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalItems: 0,
    totalUsers: 0,
    activeMatches: 0,
    successRate: 0,
  });
  const [recentItems, setRecentItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Use demo data for admin dashboard
      const demoRecentItems = [
        {
          id: "admin-1",
          title: "iPhone 13 Pro",
          type: "lost",
          category: "Electronics",
          location: { city: "New York", state: "NY" },
          status: "active",
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "admin-2",
          title: "Brown Leather Wallet",
          type: "found",
          category: "Accessories",
          location: { city: "San Francisco", state: "CA" },
          status: "matched",
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "admin-3",
          title: "House Keys",
          type: "lost",
          category: "Keys",
          location: { city: "Boston", state: "MA" },
          status: "active",
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "admin-4",
          title: "MacBook Pro",
          type: "found",
          category: "Electronics",
          location: { city: "Seattle", state: "WA" },
          status: "pending",
          createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "admin-5",
          title: "Gold Watch",
          type: "lost",
          category: "Jewelry",
          location: { city: "Miami", state: "FL" },
          status: "active",
          createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        }
      ];

      setRecentItems(demoRecentItems);

      // Set realistic demo stats
      setStats({
        totalItems: 1247,
        totalUsers: 2856,
        activeMatches: 89,
        successRate: 87,
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const quickStats = [
    {
      title: "Total Items",
      value: stats.totalItems,
      icon: Package,
      change: "+12%",
      changeType: "positive" as const,
      description: "Items reported this month",
    },
    {
      title: "Active Users",
      value: stats.totalUsers,
      icon: Users,
      change: "+5%",
      changeType: "positive" as const,
      description: "Registered users",
    },
    {
      title: "Success Rate",
      value: `${stats.successRate}%`,
      icon: CheckCircle,
      change: "+2%",
      changeType: "positive" as const,
      description: "Items successfully reunited",
    },
    {
      title: "Pending Matches",
      value: stats.activeMatches,
      icon: Search,
      change: "-8%",
      changeType: "negative" as const,
      description: "Awaiting review",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: "item_reported",
      message: "New iPhone 14 Pro reported lost in San Francisco",
      time: "2 minutes ago",
      priority: "medium",
    },
    {
      id: 2,
      type: "match_found",
      message: "Potential match found for lost wallet",
      time: "15 minutes ago",
      priority: "high",
    },
    {
      id: 3,
      type: "item_claimed",
      message: "Lost keys successfully claimed by owner",
      time: "1 hour ago",
      priority: "low",
    },
    {
      id: 4,
      type: "user_registered",
      message: "New user registered: john.doe@email.com",
      time: "2 hours ago",
      priority: "low",
    },
    {
      id: 5,
      type: "report_flagged",
      message: "Item report flagged for review",
      time: "3 hours ago",
      priority: "high",
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "item_reported":
        return <Package className="h-4 w-4 text-blue-500" />;
      case "match_found":
        return <Zap className="h-4 w-4 text-yellow-500" />;
      case "item_claimed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "user_registered":
        return <Users className="h-4 w-4 text-purple-500" />;
      case "report_flagged":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <AdminLayout title="Dashboard Overview">
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => (
            <Card key={stat.title} className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-all duration-200 hover:transform hover:scale-105 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="space-y-2">
                  <CardTitle className="text-sm font-medium text-slate-300">
                    {stat.title}
                  </CardTitle>
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                </div>
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                  index === 0 ? 'bg-blue-500/20' :
                  index === 1 ? 'bg-green-500/20' :
                  index === 2 ? 'bg-purple-500/20' : 'bg-orange-500/20'
                }`}>
                  <stat.icon className={`h-6 w-6 ${
                    index === 0 ? 'text-blue-400' :
                    index === 1 ? 'text-green-400' :
                    index === 2 ? 'text-purple-400' : 'text-orange-400'
                  }`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 text-sm">
                  {stat.changeType === "positive" ? (
                    <ArrowUp className="h-4 w-4 text-green-400" />
                  ) : (
                    <ArrowDown className="h-4 w-4 text-red-400" />
                  )}
                  <span
                    className={`font-semibold ${
                      stat.changeType === "positive"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-slate-400">from last month</span>
                </div>
                <p className="text-slate-400 text-sm mt-2">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="recent">Recent Items</TabsTrigger>
            <TabsTrigger value="activity">Activity Feed</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>
                    Key performance indicators for the platform
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Items Reunited This Month</span>
                    <Badge variant="outline">47</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Match Time</span>
                    <Badge variant="outline">2.3 hours</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">User Satisfaction</span>
                    <Badge variant="outline">4.8/5</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Locations</span>
                    <Badge variant="outline">12 cities</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link to="/admin/items">
                    <Button variant="outline" className="w-full justify-start">
                      <Package className="h-4 w-4 mr-2" />
                      Review Pending Items
                    </Button>
                  </Link>
                  <Link to="/admin/matches">
                    <Button variant="outline" className="w-full justify-start">
                      <Search className="h-4 w-4 mr-2" />
                      Review Matches
                    </Button>
                  </Link>
                  <Link to="/admin/users">
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      Manage Users
                    </Button>
                  </Link>
                  <Link to="/admin/reports">
                    <Button variant="outline" className="w-full justify-start">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Handle Reports
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="recent" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Items</CardTitle>
                <CardDescription>
                  Latest reported lost and found items
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              item.type === "lost" ? "destructive" : "default"
                            }
                          >
                            {item.type}
                          </Badge>
                          <Badge variant="outline">{item.category}</Badge>
                        </div>
                        <h4 className="font-medium">{item.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {item.location.city}, {item.location.state}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(item.dateReported).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link to={`/items/${item.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest platform activity and events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-3 border rounded-lg"
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.time}
                        </p>
                      </div>
                      <Badge
                        variant={
                          activity.priority === "high"
                            ? "destructive"
                            : activity.priority === "medium"
                              ? "default"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {activity.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
