import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useNotifications } from "@/contexts/NotificationContext";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  Upload,
  MapPin,
  Plus,
  X,
  AlertCircle,
  CheckCircle,
  Camera,
  Clock,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Header from "@/components/Header";
import { ItemCategory, LostItem, FoundItem } from "@shared/types";

export default function Report() {
  const navigate = useNavigate();
  const { type } = useParams<{ type?: "lost" | "found" }>();
  const { triggerLostItemAlert } = useNotifications();
  const [formType, setFormType] = useState<"lost" | "found">(type || "lost");

  // Enhanced input styling classes
  const enhancedInputStyles = "h-12 text-base border-2 border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 bg-white";
  const enhancedLabelStyles = "text-base font-semibold text-slate-700 mb-2 block";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<ItemCategory[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  // Form data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "" as ItemCategory,
    location: {
      address: "",
      city: "",
      state: "",
      zipCode: "",
      landmark: "",
    },
    contactInfo: {
      name: "",
      email: "",
      phone: "",
      preferredContact: "email" as "email" | "phone",
      anonymous: false,
    },
    dateLost: null as Date | null,
    dateFound: null as Date | null,
    reward: "",
    handedToAuthority: false,
    authorityContact: "",
    images: [] as string[],
  });

  // Load categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
        return;
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }

    // Fallback to default categories if API fails
    const defaultCategories = [
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

  const handleInputChange = (field: string, value: any) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = {
        type: formType,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        contactInfo: formData.contactInfo,
        tags,
        images: formData.images,
        ...(formType === "lost"
          ? {
              dateLost: formData.dateLost?.toISOString(),
              reward: formData.reward ? parseFloat(formData.reward) : undefined,
            }
          : {
              dateFound: formData.dateFound?.toISOString(),
              handedToAuthority: formData.handedToAuthority,
              authorityContact: formData.authorityContact,
              currentLocation: formData.location,
            }),
      };

      const response = await fetch("/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();

      if (result.success) {
        // Trigger real-time alert only for lost items
        if (formType === "lost") {
          triggerLostItemAlert({
            category: formData.category,
            location: `${formData.location.city}, ${formData.location.state}`,
            description: formData.description
          });
        }

        // Redirect to item details or success page
        navigate(`/search?submitted=true`);
      } else {
        alert("Error submitting item: " + result.error);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting item. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryOptions = [
    { value: "electronics", label: "📱 Electronics", icon: "📱" },
    { value: "jewelry", label: "💍 Jewelry", icon: "💍" },
    { value: "clothing", label: "👕 Clothing", icon: "👕" },
    { value: "bags", label: "🎒 Bags & Wallets", icon: "🎒" },
    { value: "keys", label: "🔑 Keys", icon: "🔑" },
    { value: "documents", label: "📄 Documents", icon: "📄" },
    { value: "pets", label: "🐕 Pets", icon: "🐕" },
    { value: "vehicles", label: "🚗 Vehicles", icon: "🚗" },
    { value: "sports", label: "⚽ Sports Equipment", icon: "⚽" },
    { value: "books", label: "📚 Books", icon: "📚" },
    { value: "toys", label: "🧸 Toys", icon: "🧸" },
    { value: "other", label: "📦 Other", icon: "📦" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mx-auto max-w-3xl">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Report Lost or Found Item
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Help reunite lost items with their owners or report items you've found.
              Our AI-powered matching system will notify relevant users immediately.
            </p>
          </div>

          {/* Type Selection */}
          <div className="mb-8">
            <div className="flex gap-6 justify-center">
              <Button
                variant={formType === "lost" ? "default" : "outline"}
                size="lg"
                onClick={() => setFormType("lost")}
                className="w-40 h-14 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                📱 Lost Item
              </Button>
              <Button
                variant={formType === "found" ? "default" : "outline"}
                size="lg"
                onClick={() => setFormType("found")}
                className="w-40 h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
              >
                ✨ I Found Something!
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {formType === "lost"
                  ? "📱 Report Lost Item"
                  : "✋ Report Found Item"}
              </CardTitle>
              <CardDescription>
                Provide detailed information to help{" "}
                {formType === "lost"
                  ? "us find your item"
                  : "reunite this item with its owner"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <div className="space-y-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-lg">📋</span>
                    </div>
                    Basic Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="title" className="text-base font-semibold text-slate-700 mb-2 block">
                        Item Title *
                      </Label>
                      <Input
                        id="title"
                        placeholder="e.g., iPhone 14 Pro in blue case"
                        value={formData.title}
                        onChange={(e) =>
                          handleInputChange("title", e.target.value)
                        }
                        required
                        className="h-12 text-base border-2 border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 bg-white"
                      />
                    </div>

                    <div>
                      <Label htmlFor="category" className="text-base font-semibold text-slate-700 mb-2 block">
                        Category *
                      </Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          handleInputChange("category", value)
                        }
                        required
                      >
                        <SelectTrigger className="h-12 text-base border-2 border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                          <SelectValue placeholder="Select category..." />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryOptions.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="date">
                        {formType === "lost" ? "Date Lost" : "Date Found"} *
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !(formType === "lost"
                                ? formData.dateLost
                                : formData.dateFound) &&
                                "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {(
                              formType === "lost"
                                ? formData.dateLost
                                : formData.dateFound
                            ) ? (
                              format(
                                formType === "lost"
                                  ? formData.dateLost!
                                  : formData.dateFound!,
                                "PPP",
                              )
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={
                              formType === "lost"
                                ? formData.dateLost
                                : formData.dateFound
                            }
                            onSelect={(date) =>
                              handleInputChange(
                                formType === "lost" ? "dateLost" : "dateFound",
                                date,
                              )
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-base font-semibold text-slate-700 mb-2 block">
                      Detailed Description *
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Provide a detailed description including color, size, brand, unique features, etc."
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      className="min-h-32 text-base border-2 border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 bg-white resize-none"
                      required
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <Label>Tags (Help others find your item)</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        placeholder="Add tags like 'black', 'leather', 'iPhone'..."
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && (e.preventDefault(), addTag())
                        }
                      />
                      <Button type="button" onClick={addTag} size="icon">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {tag}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Location Information */}
                <div className="space-y-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-blue-600" />
                    </div>
                    Location Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <Label htmlFor="address" className="text-base font-semibold text-slate-700 mb-2 block">
                        Address *
                      </Label>
                      <Input
                        id="address"
                        placeholder="123 Main Street"
                        value={formData.location.address}
                        onChange={(e) =>
                          handleInputChange("location.address", e.target.value)
                        }
                        required
                        className="h-12 text-base border-2 border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 bg-white"
                      />
                    </div>

                    <div>
                      <Label htmlFor="city" className="text-base font-semibold text-slate-700 mb-2 block">
                        City *
                      </Label>
                      <Input
                        id="city"
                        placeholder="San Francisco"
                        value={formData.location.city}
                        onChange={(e) =>
                          handleInputChange("location.city", e.target.value)
                        }
                        required
                        className="h-12 text-base border-2 border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 bg-white"
                      />
                    </div>

                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        placeholder="CA"
                        value={formData.location.state}
                        onChange={(e) =>
                          handleInputChange("location.state", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        placeholder="94105"
                        value={formData.location.zipCode}
                        onChange={(e) =>
                          handleInputChange("location.zipCode", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="landmark">Nearby Landmark</Label>
                      <Input
                        id="landmark"
                        placeholder="Near Starbucks, park entrance, etc."
                        value={formData.location.landmark}
                        onChange={(e) =>
                          handleInputChange("location.landmark", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Type-specific fields */}
                {formType === "lost" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Additional Information
                    </h3>

                    <div>
                      <Label htmlFor="reward">Reward Amount (Optional)</Label>
                      <Input
                        id="reward"
                        type="number"
                        placeholder="0"
                        value={formData.reward}
                        onChange={(e) =>
                          handleInputChange("reward", e.target.value)
                        }
                      />
                    </div>
                  </div>
                )}

                {formType === "found" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Found Item Details
                    </h3>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="handedToAuthority"
                        checked={formData.handedToAuthority}
                        onCheckedChange={(checked) =>
                          handleInputChange("handedToAuthority", checked)
                        }
                      />
                      <Label htmlFor="handedToAuthority">
                        I have handed this item to authorities (police,
                        security, etc.)
                      </Label>
                    </div>

                    {formData.handedToAuthority && (
                      <div>
                        <Label htmlFor="authorityContact">
                          Authority Contact Information
                        </Label>
                        <Input
                          id="authorityContact"
                          placeholder="SFPD (415) 553-0123, Security desk at..."
                          value={formData.authorityContact}
                          onChange={(e) =>
                            handleInputChange(
                              "authorityContact",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    )}
                  </div>
                )}

                <Separator />

                {/* Contact Information */}
                <div className="space-y-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-lg">👤</span>
                    </div>
                    Contact Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className={enhancedLabelStyles}>
                        Your Name *
                      </Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={formData.contactInfo.name}
                        onChange={(e) =>
                          handleInputChange("contactInfo.name", e.target.value)
                        }
                        required
                        className={enhancedInputStyles}
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.contactInfo.email}
                        onChange={(e) =>
                          handleInputChange("contactInfo.email", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="+1-555-0123"
                        value={formData.contactInfo.phone}
                        onChange={(e) =>
                          handleInputChange("contactInfo.phone", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="preferredContact">
                        Preferred Contact Method
                      </Label>
                      <Select
                        value={formData.contactInfo.preferredContact}
                        onValueChange={(value) =>
                          handleInputChange(
                            "contactInfo.preferredContact",
                            value,
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="phone">Phone</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="anonymous"
                      checked={formData.contactInfo.anonymous}
                      onCheckedChange={(checked) =>
                        handleInputChange("contactInfo.anonymous", checked)
                      }
                    />
                    <Label htmlFor="anonymous">
                      Keep my contact information private (only share when
                      there's a potential match)
                    </Label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-8 rounded-2xl border-2 border-blue-200 text-center">
                  <div className="mb-6">
                    <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-blue-600" />
                    </div>
                    <h4 className="text-xl font-bold text-slate-800 mb-2">
                      Ready to submit your {formType === "lost" ? "lost" : "found"} item report?
                    </h4>
                    <p className="text-slate-600">
                      Our AI-powered system will start matching immediately
                    </p>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full max-w-md h-16 text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 rounded-xl mb-4"
                  >
                    {isSubmitting ? (
                      <>
                        <Clock className="mr-3 h-6 w-6 animate-spin" />
                        Submitting Your Report...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-3 h-6 w-6" />
                        🚀 Submit {formType === "lost" ? "Lost" : "Found"} Item Report
                      </>
                    )}
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                    <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></span>
                    We'll notify you immediately if we find a match!
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
