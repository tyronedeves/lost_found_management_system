import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  Activity,
  MapPin,
  Clock,
  Target,
  Eye,
  Search,
  Download,
  Calendar,
  DollarSign,
  UserCheck,
  AlertTriangle,
} from "lucide-react";

export default function Analytics() {
  // Demo analytics data
  const analyticsData = {
    overview: {
      totalUsers: 2847,
      activeUsers: 1623,
      totalItems: 8934,
      matchedItems: 4672,
      successRate: 52.3,
      avgResponseTime: "2.4 hours",
    },
    userStats: {
      newUsersToday: 47,
      newUsersThisWeek: 312,
      topCities: [
        { name: "Lagos", users: 892, growth: 12.5 },
        { name: "Abuja", users: 543, growth: 8.7 },
        { name: "Port Harcourt", users: 387, growth: -2.1 },
        { name: "Kano", users: 256, growth: 15.2 },
        { name: "Ibadan", users: 234, growth: 5.8 },
      ],
    },
    itemStats: {
      mostReportedCategories: [
        { category: "Electronics", count: 2341, percentage: 26.2 },
        { category: "Personal Items", count: 1876, percentage: 21.0 },
        { category: "Documents", count: 1654, percentage: 18.5 },
        { category: "Jewelry", count: 1234, percentage: 13.8 },
        { category: "Bags", count: 987, percentage: 11.0 },
        { category: "Other", count: 842, percentage: 9.4 },
      ],
      recentMatches: [
        { id: "M001", item: "iPhone 14 Pro", matchTime: "2 hours ago", status: "Verified" },
        { id: "M002", item: "Leather Wallet", matchTime: "5 hours ago", status: "Pending" },
        { id: "M003", item: "Car Keys", matchTime: "1 day ago", status: "Completed" },
        { id: "M004", item: "Gold Ring", matchTime: "2 days ago", status: "Verified" },
        { id: "M005", item: "Laptop Bag", matchTime: "3 days ago", status: "Completed" },
      ],
    },
    performance: {
      systemUptime: "99.8%",
      avgLoadTime: "1.2s",
      errorRate: "0.03%",
      apiResponseTime: "145ms",
    },
  };

  const StatCard = ({ 
    title, 
    value, 
    change, 
    changeType, 
    icon: Icon, 
    description 
  }: {
    title: string;
    value: string | number;
    change?: string;
    changeType?: "positive" | "negative" | "neutral";
    icon: any;
    description?: string;
  }) => (
    <Card className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-all duration-200 hover:transform hover:scale-105 shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-200">{title}</CardTitle>
        <Icon className="h-4 w-4 text-slate-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white mb-1">{value}</div>
        {change && (
          <div className="flex items-center space-x-1">
            {changeType === "positive" ? (
              <TrendingUp className="h-3 w-3 text-green-400" />
            ) : changeType === "negative" ? (
              <TrendingDown className="h-3 w-3 text-red-400" />
            ) : (
              <Activity className="h-3 w-3 text-blue-400" />
            )}
            <p className={`text-xs ${
              changeType === "positive" ? "text-green-400" : 
              changeType === "negative" ? "text-red-400" : "text-blue-400"
            }`}>
              {change}
            </p>
          </div>
        )}
        {description && (
          <p className="text-xs text-slate-400 mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <AdminLayout title="Analytics Dashboard">
      <div className="space-y-8">
        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={analyticsData.overview.totalUsers.toLocaleString()}
            change="+12.5% from last month"
            changeType="positive"
            icon={Users}
            description="Registered users"
          />
          <StatCard
            title="Active Users"
            value={analyticsData.overview.activeUsers.toLocaleString()}
            change="+8.2% from last week"
            changeType="positive"
            icon={UserCheck}
            description="Users active this week"
          />
          <StatCard
            title="Total Items"
            value={analyticsData.overview.totalItems.toLocaleString()}
            change="+156 today"
            changeType="positive"
            icon={Package}
            description="Items reported"
          />
          <StatCard
            title="Success Rate"
            value={`${analyticsData.overview.successRate}%`}
            change="+2.1% improvement"
            changeType="positive"
            icon={Target}
            description="Items successfully matched"
          />
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700">Overview</TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-slate-700">Users</TabsTrigger>
            <TabsTrigger value="items" className="data-[state=active]:bg-slate-700">Items</TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-slate-700">Performance</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Real-time Activity */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-400" />
                    Real-time Activity
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Live system activity and user interactions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-slate-200">New item reported</span>
                    </div>
                    <span className="text-xs text-slate-400">2 min ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <span className="text-slate-200">Match found</span>
                    </div>
                    <span className="text-xs text-slate-400">5 min ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-yellow-400 rounded-full animate-pulse"></div>
                      <span className="text-slate-200">User registered</span>
                    </div>
                    <span className="text-xs text-slate-400">8 min ago</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-400" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Avg Response Time</span>
                    <Badge className="bg-green-100 text-green-800">
                      {analyticsData.overview.avgResponseTime}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">System Uptime</span>
                    <Badge className="bg-green-100 text-green-800">
                      {analyticsData.performance.systemUptime}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">API Response</span>
                    <Badge className="bg-blue-100 text-blue-800">
                      {analyticsData.performance.apiResponseTime}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Error Rate</span>
                    <Badge className="bg-green-100 text-green-800">
                      {analyticsData.performance.errorRate}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Growth */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">User Growth</CardTitle>
                  <CardDescription className="text-slate-400">
                    New user registrations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Today</span>
                      <span className="text-white font-semibold">+{analyticsData.userStats.newUsersToday}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">This Week</span>
                      <span className="text-white font-semibold">+{analyticsData.userStats.newUsersThisWeek}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Cities */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-400" />
                    Top Cities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analyticsData.userStats.topCities.map((city, index) => (
                      <div key={city.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                            #{index + 1}
                          </span>
                          <span className="text-slate-200">{city.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-white">{city.users}</span>
                          <span className={`text-xs ${city.growth > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {city.growth > 0 ? '+' : ''}{city.growth}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Items Tab */}
          <TabsContent value="items" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Categories */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Most Reported Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analyticsData.itemStats.mostReportedCategories.map((category) => (
                      <div key={category.category} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-200">{category.category}</span>
                          <span className="text-white">{category.count}</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all"
                            style={{ width: `${category.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Matches */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Search className="h-5 w-5 text-green-400" />
                    Recent Matches
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analyticsData.itemStats.recentMatches.map((match) => (
                      <div key={match.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                        <div>
                          <p className="text-slate-200 font-medium">{match.item}</p>
                          <p className="text-xs text-slate-400">{match.matchTime}</p>
                        </div>
                        <Badge className={
                          match.status === "Completed" ? "bg-green-100 text-green-800" :
                          match.status === "Verified" ? "bg-blue-100 text-blue-800" :
                          "bg-yellow-100 text-yellow-800"
                        }>
                          {match.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="System Uptime"
                value={analyticsData.performance.systemUptime}
                icon={Activity}
                description="Last 30 days"
              />
              <StatCard
                title="Avg Load Time"
                value={analyticsData.performance.avgLoadTime}
                icon={Clock}
                description="Page load performance"
              />
              <StatCard
                title="Error Rate"
                value={analyticsData.performance.errorRate}
                icon={AlertTriangle}
                description="System errors"
              />
              <StatCard
                title="API Response"
                value={analyticsData.performance.apiResponseTime}
                icon={Activity}
                description="Average response time"
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 pt-6 border-t border-slate-700">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" className="border-slate-600 text-slate-200 hover:bg-slate-800">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Report
          </Button>
          <Button variant="outline" className="border-slate-600 text-slate-200 hover:bg-slate-800">
            <Eye className="h-4 w-4 mr-2" />
            View Raw Data
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
