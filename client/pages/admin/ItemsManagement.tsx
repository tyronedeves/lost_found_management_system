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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Flag,
  MapPin,
  Calendar,
  User,
  DollarSign,
  Archive,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Item, ItemCategory, ItemStatus } from "@shared/types";
import { format } from "date-fns";

export default function ItemsManagement() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    type: "",
    status: "active",
  });

  useEffect(() => {
    fetchItems();
  }, [filters]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: "50",
        ...(filters.search && { keyword: filters.search }),
        ...(filters.category &&
          filters.category !== "all" && { category: filters.category }),
        ...(filters.type && filters.type !== "all" && { type: filters.type }),
        ...(filters.status &&
          filters.status !== "all" && { status: filters.status }),
      });

      const response = await fetch(`/api/items?${params}`);
      const data = await response.json();

      if (data.success) {
        setItems(data.data.items);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (itemId: string, newStatus: ItemStatus) => {
    try {
      const response = await fetch(`/api/items/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchItems(); // Refresh the list
      }
    } catch (error) {
      console.error("Error updating item status:", error);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        const response = await fetch(`/api/items/${itemId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          fetchItems(); // Refresh the list
        }
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedItems.length === 0) return;

    if (
      action === "delete" &&
      !confirm(`Delete ${selectedItems.length} items?`)
    ) {
      return;
    }

    try {
      // In a real app, you'd have a bulk API endpoint
      const promises = selectedItems.map((itemId) => {
        if (action === "delete") {
          return fetch(`/api/items/${itemId}`, { method: "DELETE" });
        } else if (action === "archive") {
          return fetch(`/api/items/${itemId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "archived" }),
          });
        }
        return Promise.resolve();
      });

      await Promise.all(promises);
      setSelectedItems([]);
      fetchItems();
    } catch (error) {
      console.error("Error performing bulk action:", error);
    }
  };

  const categories = [
    "electronics",
    "jewelry",
    "clothing",
    "bags",
    "keys",
    "documents",
    "pets",
    "vehicles",
    "sports",
    "books",
    "toys",
    "other",
  ];

  const statuses: ItemStatus[] = [
    "active",
    "matched",
    "claimed",
    "expired",
    "archived",
  ];

  const getStatusColor = (status: ItemStatus) => {
    switch (status) {
      case "active":
        return "default";
      case "matched":
        return "secondary";
      case "claimed":
        return "outline";
      case "expired":
        return "destructive";
      case "archived":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getItemTypeColor = (type: string) => {
    return type === "lost" ? "destructive" : "default";
  };

  return (
    <AdminLayout title="Items Management">
      <div className="space-y-6">
        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search items..."
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
                <Label htmlFor="category">Category</Label>
                <Select
                  value={filters.category || "all"}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      category: value === "all" ? "" : value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  value={filters.type || "all"}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      type: value === "all" ? "" : value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                    <SelectItem value="found">Found</SelectItem>
                  </SelectContent>
                </Select>
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
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {selectedItems.length} item(s) selected
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction("archive")}
                  >
                    <Archive className="h-4 w-4 mr-2" />
                    Archive
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleBulkAction("delete")}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Items Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Items ({items.length})</CardTitle>
                <CardDescription>Manage lost and found items</CardDescription>
              </div>
              <Button onClick={fetchItems} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading items...</div>
            ) : items.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No items found with current filters
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-4 p-4 border rounded-lg"
                  >
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems((prev) => [...prev, item.id]);
                        } else {
                          setSelectedItems((prev) =>
                            prev.filter((id) => id !== item.id),
                          );
                        }
                      }}
                      className="rounded"
                    />

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={getItemTypeColor(item.type)}>
                          {item.type}
                        </Badge>
                        <Badge variant="outline">{item.category}</Badge>
                        <Badge variant={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </div>

                      <h4 className="font-medium">{item.title}</h4>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {item.contactInfo.name}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {item.location.city}, {item.location.state}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(item.dateReported), "MMM d, yyyy")}
                        </div>
                      </div>

                      {item.type === "lost" && (item as any).reward && (
                        <div className="flex items-center gap-1 text-sm text-success">
                          <DollarSign className="h-3 w-3" />
                          Reward: ${(item as any).reward}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Status Actions */}
                      <div className="flex gap-1">
                        {item.status === "active" && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleStatusChange(item.id, "matched")
                              }
                              title="Mark as Matched"
                            >
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleStatusChange(item.id, "expired")
                              }
                              title="Mark as Expired"
                            >
                              <XCircle className="h-4 w-4 text-red-500" />
                            </Button>
                          </>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          title="Flag for Review"
                        >
                          <Flag className="h-4 w-4 text-yellow-500" />
                        </Button>
                      </div>

                      {/* Actions Menu */}
                      <div className="flex gap-1">
                        <Link to={`/items/${item.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm" title="Edit Item">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteItem(item.id)}
                          title="Delete Item"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
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
