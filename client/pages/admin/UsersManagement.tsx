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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  MoreHorizontal,
  User,
  Mail,
  Phone,
  Calendar,
  Package,
  CheckCircle,
  XCircle,
  Shield,
  Ban,
  RefreshCw,
  UserPlus,
  Download,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { format } from "date-fns";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  status: "active" | "suspended" | "banned";
  role: "user" | "admin" | "moderator";
  itemsReported: number;
  itemsClaimed: number;
  successRate: number;
  createdAt: string;
  lastActive: string;
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    role: "",
  });

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Mock data for demonstration
      const mockUsers: User[] = [
        {
          id: "user_1",
          name: "John Doe",
          email: "john.doe@email.com",
          phone: "+1-555-0123",
          status: "active",
          role: "user",
          itemsReported: 3,
          itemsClaimed: 1,
          successRate: 85,
          createdAt: new Date(
            Date.now() - 30 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "user_2",
          name: "Jane Smith",
          email: "jane.smith@email.com",
          status: "active",
          role: "moderator",
          itemsReported: 7,
          itemsClaimed: 3,
          successRate: 92,
          createdAt: new Date(
            Date.now() - 60 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          lastActive: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "user_3",
          name: "Mike Johnson",
          email: "mike.j@email.com",
          phone: "+1-555-0456",
          status: "active",
          role: "user",
          itemsReported: 1,
          itemsClaimed: 2,
          successRate: 100,
          createdAt: new Date(
            Date.now() - 7 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "user_4",
          name: "Sarah Wilson",
          email: "sarah.w@email.com",
          status: "suspended",
          role: "user",
          itemsReported: 5,
          itemsClaimed: 0,
          successRate: 60,
          createdAt: new Date(
            Date.now() - 45 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          lastActive: new Date(
            Date.now() - 7 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        {
          id: "user_5",
          name: "Admin User",
          email: "admin@foundit.com",
          status: "active",
          role: "admin",
          itemsReported: 0,
          itemsClaimed: 0,
          successRate: 0,
          createdAt: new Date(
            Date.now() - 365 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          lastActive: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        },
      ];

      // Apply filters
      let filteredUsers = mockUsers;

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredUsers = filteredUsers.filter(
          (user) =>
            user.name.toLowerCase().includes(searchLower) ||
            user.email.toLowerCase().includes(searchLower),
        );
      }

      if (filters.status && filters.status !== "all") {
        filteredUsers = filteredUsers.filter(
          (user) => user.status === filters.status,
        );
      }

      if (filters.role && filters.role !== "all") {
        filteredUsers = filteredUsers.filter(
          (user) => user.role === filters.role,
        );
      }

      setUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    userId: string,
    newStatus: "active" | "suspended" | "banned",
  ) => {
    try {
      // In a real app, you'd make an API call here
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, status: newStatus } : user,
        ),
      );
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const handleRoleChange = async (
    userId: string,
    newRole: "user" | "admin" | "moderator",
  ) => {
    try {
      // In a real app, you'd make an API call here
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user,
        ),
      );
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedUsers.length === 0) return;

    if (
      action === "suspend" &&
      !confirm(`Suspend ${selectedUsers.length} users?`)
    ) {
      return;
    }
    if (action === "ban" && !confirm(`Ban ${selectedUsers.length} users?`)) {
      return;
    }

    try {
      // In a real app, you'd make bulk API calls here
      if (action === "suspend") {
        setUsers((prev) =>
          prev.map((user) =>
            selectedUsers.includes(user.id)
              ? { ...user, status: "suspended" as const }
              : user,
          ),
        );
      } else if (action === "ban") {
        setUsers((prev) =>
          prev.map((user) =>
            selectedUsers.includes(user.id)
              ? { ...user, status: "banned" as const }
              : user,
          ),
        );
      } else if (action === "activate") {
        setUsers((prev) =>
          prev.map((user) =>
            selectedUsers.includes(user.id)
              ? { ...user, status: "active" as const }
              : user,
          ),
        );
      }

      setSelectedUsers([]);
    } catch (error) {
      console.error("Error performing bulk action:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "suspended":
        return "secondary";
      case "banned":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "moderator":
        return "default";
      case "user":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <AdminLayout title="Users Management">
      <div className="space-y-6">
        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="search">Search Users</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by name or email..."
                    className="pl-8"
                    value={filters.search}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        search: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={filters.status || "all"}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      status: value === "all" ? "" : value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="banned">Banned</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  value={filters.role || "all"}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      role: value === "all" ? "" : value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All roles</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {selectedUsers.length} user(s) selected
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction("activate")}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Activate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction("suspend")}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Suspend
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleBulkAction("ban")}
                  >
                    <Ban className="h-4 w-4 mr-2" />
                    Ban
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Users Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Users ({users.length})</CardTitle>
                <CardDescription>
                  Manage platform users and permissions
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
                <Button onClick={fetchUsers} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading users...</div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No users found with current filters
              </div>
            ) : (
              <div className="space-y-4">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center space-x-4 p-4 border rounded-lg"
                  >
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers((prev) => [...prev, user.id]);
                        } else {
                          setSelectedUsers((prev) =>
                            prev.filter((id) => id !== user.id),
                          );
                        }
                      }}
                      className="rounded"
                    />

                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>
                        {getUserInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{user.name}</h4>
                        <Badge variant={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                        <Badge variant={getRoleColor(user.role)}>
                          {user.role}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {user.phone}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Package className="h-3 w-3" />
                          {user.itemsReported} reported, {user.itemsClaimed}{" "}
                          claimed
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Joined {format(new Date(user.createdAt), "MMM yyyy")}
                        </div>
                      </div>

                      <div className="text-sm">
                        <span className="text-muted-foreground">
                          Success Rate:{" "}
                        </span>
                        <span
                          className={
                            user.successRate >= 80
                              ? "text-green-600"
                              : user.successRate >= 60
                                ? "text-yellow-600"
                                : "text-red-600"
                          }
                        >
                          {user.successRate}%
                        </span>
                        <span className="text-muted-foreground ml-4">
                          Last active:{" "}
                          {format(new Date(user.lastActive), "MMM d, HH:mm")}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Status Actions */}
                      <div className="flex gap-1">
                        {user.status === "active" && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleStatusChange(user.id, "suspended")
                              }
                              title="Suspend User"
                            >
                              <XCircle className="h-4 w-4 text-yellow-500" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleStatusChange(user.id, "banned")
                              }
                              title="Ban User"
                            >
                              <Ban className="h-4 w-4 text-red-500" />
                            </Button>
                          </>
                        )}

                        {user.status !== "active" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleStatusChange(user.id, "active")
                            }
                            title="Activate User"
                          >
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </Button>
                        )}

                        {user.role !== "admin" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleRoleChange(
                                user.id,
                                user.role === "moderator"
                                  ? "user"
                                  : "moderator",
                              )
                            }
                            title={
                              user.role === "moderator"
                                ? "Remove Moderator"
                                : "Make Moderator"
                            }
                          >
                            <Shield className="h-4 w-4 text-blue-500" />
                          </Button>
                        )}
                      </div>

                      {/* More Actions */}
                      <Button variant="ghost" size="sm" title="More Actions">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
