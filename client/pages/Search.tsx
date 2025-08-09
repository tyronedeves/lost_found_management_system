import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Search as SearchIcon,
  Filter,
  MapPin,
  Clock,
  Phone,
  Mail,
  Eye,
  Calendar,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Header from "@/components/Header";
import { databases, DATABASE_ID, COLLECTIONS, handleAppwriteError } from "@/lib/appwrite";
import { Query } from "appwrite";
import {
  Item,
  LostItem,
  FoundItem,
  ItemCategory,
  SearchFilters,
} from "@shared/types";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<ItemCategory[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "lost" | "found">("all");
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search filters - check both 'q' and 'keyword' parameters
  const [filters, setFilters] = useState<SearchFilters>({
    keyword: searchParams.get("keyword") || searchParams.get("q") || "",
    category: (searchParams.get("category") as ItemCategory) || undefined,
    location: searchParams.get("location") || "",
    type: (searchParams.get("type") as "lost" | "found") || undefined,
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const itemsPerPage = 12;

  useEffect(() => {
    // Check if coming from successful submission
    if (searchParams.get("submitted") === "true") {
      setShowSuccess(true);
      // Remove the parameter after showing success
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("submitted");
      setSearchParams(newParams);
      setTimeout(() => setShowSuccess(false), 5000);
    }

    fetchCategories();
    fetchItems();
  }, []);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    // Debounce search when keyword changes
    const timeoutId = setTimeout(() => {
      fetchItems();
    }, 300); // Wait 300ms after user stops typing

    return () => clearTimeout(timeoutId);
  }, [filters.keyword, filters.category, filters.location, currentPage, activeTab]);

  // Update filters when URL parameters change
  useEffect(() => {
    const keyword = searchParams.get("keyword") || searchParams.get("q") || "";
    const category = searchParams.get("category") as ItemCategory || undefined;
    const location = searchParams.get("location") || "";
    const type = searchParams.get("type") as "lost" | "found" || undefined;

    console.log("URL parameters:", { keyword, category, location, type });

    setFilters(prev => ({
      ...prev,
      keyword,
      category,
      location,
      type
    }));

    if (type) {
      setActiveTab(type);
    }
  }, [searchParams]);

  const fetchCategories = async () => {
    // Use predefined categories - these should match what's used in the Report form
    const defaultCategories: ItemCategory[] = [
      "Electronics",
      "Clothing", 
      "Jewelry",
      "Books",
      "Keys",
      "Bags",
      "Documents",
      "Sports Equipment",
      "Toys",
      "Accessories",
      "Other"
    ];
    setCategories(defaultCategories);
  };

  const fetchItems = async () => {
    console.log("Fetching items with filters:", filters, "activeTab:", activeTab);
    setLoading(true);
    setError(null);

    try {
      // Build Appwrite queries
      const queries: string[] = [];

      // Add pagination
      const offset = (currentPage - 1) * itemsPerPage;
      queries.push(Query.limit(itemsPerPage));
      queries.push(Query.offset(offset));

      // Add ordering by creation date (newest first)
      queries.push(Query.orderDesc('$createdAt'));

      // Add status filter (only show active items)
      queries.push(Query.equal('status', 'active'));

      // Filter by type if specified
      if (activeTab !== "all") {
        queries.push(Query.equal('type', activeTab));
      }

      // Filter by category if specified
      if (filters.category) {
        queries.push(Query.equal('category', filters.category));
      }

      // For keyword search, we'll need to use multiple queries since Appwrite doesn't support full-text search
      // We'll search in title, description, and tags
      if (filters.keyword) {
        const keyword = filters.keyword.toLowerCase();
        // Note: This is a simplified approach. For better search, you might want to implement
        // a more sophisticated search solution or use Appwrite's full-text search when available
        queries.push(Query.search('title', keyword));
      }

      // For location search
      if (filters.location) {
        const location = filters.location.toLowerCase();
        // Search in city, state, and address fields
        queries.push(Query.search('city', location));
      }

      console.log("Appwrite queries:", queries);

      // Fetch items from Appwrite
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.ITEMS,
        queries
      );

      console.log("Appwrite response:", response);

      // Transform Appwrite documents to our Item interface
      const transformedItems: Item[] = response.documents.map((doc: any) => ({
        id: doc.$id,
        type: doc.type,
        title: doc.title,
        description: doc.description,
        category: doc.category,
        location: {
          address: doc.address || '',
          city: doc.city || '',
          state: doc.state || '',
          zipCode: doc.zipCode || '',
          country: doc.country || 'US',
          landmark: doc.landmark || ''
        },
        contactInfo: {
          name: doc.contactName || '',
          email: doc.contactEmail || '',
          phone: doc.contactPhone || '',
          preferredContact: doc.preferredContact || 'email',
          anonymous: doc.anonymous || false
        },
        status: doc.status,
        dateReported: doc.$createdAt,
        updatedAt: doc.$updatedAt,
        tags: doc.tags || [],
        images: doc.images || [],
        userId: doc.userId,
        // Type-specific fields
        ...(doc.type === 'lost' && {
          dateLost: doc.dateLost,
          reward: doc.reward || 0,
        }),
        ...(doc.type === 'found' && {
          dateFound: doc.dateFound,
          handedToAuthority: doc.handedToAuthority || false,
          authorityContact: doc.authorityContact || '',
        }),
      }));

      // Apply client-side filtering for advanced search if needed
      let filteredItems = transformedItems;

      // Additional keyword filtering (since Appwrite search might not cover all fields)
      if (filters.keyword && !queries.some(q => q.includes('search'))) {
        const keyword = filters.keyword.toLowerCase();
        filteredItems = filteredItems.filter(item =>
          item.title.toLowerCase().includes(keyword) ||
          item.description.toLowerCase().includes(keyword) ||
          item.category.toLowerCase().includes(keyword) ||
          item.tags.some(tag => tag.toLowerCase().includes(keyword)) ||
          item.location.city.toLowerCase().includes(keyword) ||
          item.location.state.toLowerCase().includes(keyword) ||
          item.location.address.toLowerCase().includes(keyword)
        );
      }

      // Additional location filtering if needed
      if (filters.location && !queries.some(q => q.includes('city'))) {
        const location = filters.location.toLowerCase();
        filteredItems = filteredItems.filter(item =>
          item.location.city.toLowerCase().includes(location) ||
          item.location.state.toLowerCase().includes(location) ||
          item.location.address.toLowerCase().includes(location)
        );
      }

      setItems(filteredItems);
      setTotalItems(response.total);
      setHasMore(response.total > offset + filteredItems.length);

      console.log(`Loaded ${filteredItems.length} items out of ${response.total} total`);

    } catch (error: any) {
      console.error("Error fetching items:", error);
      const errorMessage = handleAppwriteError(error);
      setError(errorMessage);

      // Fallback to empty array on error
      setItems([]);
      setTotalItems(0);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page on manual search
    fetchItems();
  };

  const clearFilters = () => {
    setFilters({
      keyword: "",
      category: undefined,
      location: "",
      type: undefined,
    });
    setActiveTab("all");
    setCurrentPage(1);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) {
      return "Unknown date";
    }

    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (date.toString() === "Invalid Date") {
        return "Unknown date";
      }
      return format(date, "MMM d, yyyy");
    } catch (error) {
      return "Unknown date";
    }
  };

  const getItemTypeColor = (type: "lost" | "found") => {
    return type === "lost" ? "destructive" : "default";
  };

  const categoryOptions = [
    { value: "Electronics", label: "📱 Electronics" },
    { value: "Jewelry", label: "💍 Jewelry" },
    { value: "Clothing", label: "👕 Clothing" },
    { value: "Bags", label: "🎒 Bags & Wallets" },
    { value: "Keys", label: "🔑 Keys" },
    { value: "Documents", label: "📄 Documents" },
    { value: "Pets", label: "🐕 Pets" },
    { value: "Vehicles", label: "🚗 Vehicles" },
    { value: "Sports Equipment", label: "⚽ Sports Equipment" },
    { value: "Books", label: "📚 Books" },
    { value: "Toys", label: "🧸 Toys" },
    { value: "Accessories", label: "👜 Accessories" },
    { value: "Other", label: "📦 Other" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Alert */}
        {showSuccess && (
          <Alert className="mb-6 border-success bg-success/10">
            <CheckCircle className="h-4 w-4 text-success" />
            <AlertDescription className="text-success">
              Your item has been successfully reported! We'll notify you
              immediately if we find a match.
            </AlertDescription>
          </Alert>
        )}

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-destructive bg-destructive/10">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-6 text-slate-900">
            Browse Lost & Found Items
          </h1>
          <p className="text-lg text-slate-700 max-w-3xl mx-auto font-medium mb-8">
            Search through {totalItems} reported items to find what you're looking for
          </p>

          {/* Prominent Search Input */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <SearchIcon className="h-7 w-7 text-blue-500" />
              </div>
              <Input
                placeholder="🔍 Search for lost items: iPhone, wallet, keys, laptop, backpack..."
                value={filters.keyword || ""}
                onChange={(e) =>
                  handleFilterChange("keyword", e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
                className="h-20 pl-20 pr-36 text-xl bg-white border-3 border-blue-300 focus:border-blue-600 focus:ring-6 focus:ring-blue-200 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 placeholder:text-slate-400 text-slate-900 font-medium"
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <Button
                  onClick={handleSearch}
                  disabled={loading}
                  size="lg"
                  className="h-14 px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 text-lg"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <SearchIcon className="h-5 w-5 mr-3" />
                      Search Now
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Quick Search Suggestions */}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <span className="text-sm text-slate-600 font-medium">Quick search:</span>
              {["iPhone", "wallet", "keys", "laptop", "backpack", "watch", "jewelry"].map((hint) => (
                <button
                  key={hint}
                  onClick={() => {
                    handleFilterChange("keyword", hint);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 rounded-full text-sm font-semibold transition-all duration-200 border-2 border-blue-200 hover:border-blue-400 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  {hint}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SearchIcon className="h-5 w-5" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Secondary Search Bar (for advanced filtering) */}
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Refine your search..."
                  value={filters.keyword || ""}
                  onChange={(e) =>
                    handleFilterChange("keyword", e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSearch();
                    }
                  }}
                  className="bg-slate-50 border-slate-200 focus:border-blue-400"
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={loading}
                variant="outline"
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2" />
                    Searching...
                  </>
                ) : (
                  <>
                    <SearchIcon className="h-4 w-4 mr-2" />
                    Filter
                  </>
                )}
              </Button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={filters.category || "all"}
                  onValueChange={(value) =>
                    handleFilterChange(
                      "category",
                      value === "all" ? undefined : value,
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {categoryOptions.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="City, state, or address"
                  value={filters.location || ""}
                  onChange={(e) =>
                    handleFilterChange("location", e.target.value)
                  }
                />
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Type Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as any)}
          className="mb-10"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Items ({totalItems})</TabsTrigger>
            <TabsTrigger value="lost">Lost Items</TabsTrigger>
            <TabsTrigger value="found">Found Items</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading items...</span>
          </div>
        ) : items.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-slate-900">
                No items found
              </h3>
              <p className="text-slate-600 mb-4">
                Try adjusting your search criteria or check back later for new
                items.
              </p>
              <Link to="/report">
                <Button>Report an Item</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {items.map((item) => (
                <Card
                  key={item.id}
                  className="hover:shadow-lg transition-shadow border border-slate-200"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Badge
                          variant={getItemTypeColor(item.type)}
                          className="mb-2"
                        >
                          {item.type === "lost" ? "📱 Lost" : "✋ Found"}
                        </Badge>
                        <CardTitle className="text-lg line-clamp-2 text-slate-900 font-semibold">
                          {item.title}
                        </CardTitle>
                      </div>
                    </div>
                    <CardDescription className="line-clamp-3 text-slate-700">
                      {item.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {/* Category */}
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="secondary">
                        {categoryOptions.find(
                          (cat) => cat.value === item.category,
                        )?.label || item.category}
                      </Badge>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {item.location.city}, {item.location.state}
                      </span>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {item.type === "lost"
                          ? `Lost: ${formatDate((item as LostItem).dateLost || item.dateReported)}`
                          : `Found: ${formatDate((item as FoundItem).dateFound)}`}
                      </span>
                    </div>

                    {/* Reward for lost items */}
                    {item.type === "lost" && (item as LostItem).reward && (
                      <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                        <DollarSign className="h-4 w-4" />
                        <span>Reward: ${(item as LostItem).reward}</span>
                      </div>
                    )}

                    {/* Tags */}
                    {item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {item.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{item.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}

                    <Separator />

                    {/* Contact Options */}
                    <div className="flex gap-2">
                      <Link to={`/items/${item.id}`} className="flex-1">
                        <Button size="sm" variant="outline" className="w-full">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </Link>
                      <Button size="sm" className="flex-1">
                        {item.contactInfo.preferredContact === "email" ? (
                          <Mail className="h-4 w-4 mr-1" />
                        ) : (
                          <Phone className="h-4 w-4 mr-1" />
                        )}
                        Contact
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {(currentPage > 1 || hasMore) && (
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4 text-sm text-muted-foreground">
                  Page {currentPage}
                </span>
                <Button
                  variant="outline"
                  disabled={!hasMore}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}