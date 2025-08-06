import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  MapPin,
  Calendar,
  User,
  Mail,
  Phone,
  DollarSign,
  Shield,
  Star,
  ArrowLeft,
  Heart,
  Share2,
  Flag,
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Header from "@/components/Header";
import { Item, LostItem, FoundItem, MatchSuggestion } from "@shared/types";

export default function ItemDetails() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchesLoading, setMatchesLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchItem();
      fetchMatches();
    }
  }, [id]);

  const fetchItem = async () => {
    try {
      const response = await fetch(`/api/items/${id}`);
      const data = await response.json();

      if (data.success) {
        setItem(data.data);
      }
    } catch (error) {
      console.error("Error fetching item:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMatches = async () => {
    setMatchesLoading(true);
    try {
      const response = await fetch(`/api/items/${id}/matches`);
      const data = await response.json();

      if (data.success) {
        setMatches(data.data);
      }
    } catch (error) {
      console.error("Error fetching matches:", error);
    } finally {
      setMatchesLoading(false);
    }
  };

  const handleMatchAction = async (
    matchId: string,
    action: "accepted" | "rejected",
  ) => {
    try {
      const response = await fetch(`/api/matches/${matchId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: action }),
      });

      if (response.ok) {
        // Refresh matches
        fetchMatches();
      }
    } catch (error) {
      console.error("Error updating match status:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMMM d, yyyy");
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 0.8) return "text-green-600";
    if (score >= 0.6) return "text-yellow-600";
    return "text-red-600";
  };

  const getMatchScoreLabel = (score: number) => {
    if (score >= 0.8) return "Excellent Match";
    if (score >= 0.6) return "Good Match";
    return "Possible Match";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading item details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <Card>
            <CardContent className="py-12 text-center">
              <h3 className="text-lg font-semibold mb-2">Item not found</h3>
              <p className="text-muted-foreground mb-4">
                The item you're looking for doesn't exist or has been removed.
              </p>
              <Link to="/search">
                <Button>Back to Search</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/search">
            <Button variant="ghost" className="pl-0">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Search
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Item Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Item Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant={
                          item.type === "lost" ? "destructive" : "default"
                        }
                        className="text-sm"
                      >
                        {item.type === "lost"
                          ? "📱 Lost Item"
                          : "✋ Found Item"}
                      </Badge>
                      <Badge variant="outline">{item.category}</Badge>
                    </div>
                    <CardTitle className="text-2xl mb-2">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {item.description}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="icon">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Flag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Key Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {item.type === "lost"
                        ? `Lost on ${formatDate((item as LostItem).dateLost || item.dateReported)}`
                        : `Found on ${formatDate((item as FoundItem).dateFound)}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {item.location.city}, {item.location.state}
                    </span>
                  </div>

                  {item.type === "lost" && (item as LostItem).reward && (
                    <div className="flex items-center gap-2 text-success">
                      <DollarSign className="h-4 w-4" />
                      <span className="text-sm font-semibold">
                        Reward: ${(item as LostItem).reward}
                      </span>
                    </div>
                  )}

                  {item.type === "found" &&
                    (item as FoundItem).handedToAuthority && (
                      <div className="flex items-center gap-2 text-blue-600">
                        <Shield className="h-4 w-4" />
                        <span className="text-sm">Handed to authorities</span>
                      </div>
                    )}
                </div>

                {/* Tags */}
                {item.tags.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Location Details */}
                <div>
                  <h4 className="text-sm font-semibold mb-2">
                    Location Details
                  </h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>{item.location.address}</p>
                    <p>
                      {item.location.city}, {item.location.state}{" "}
                      {item.location.zipCode}
                    </p>
                    {item.location.landmark && (
                      <p className="italic">Near: {item.location.landmark}</p>
                    )}
                  </div>
                </div>

                {/* Authority Info for Found Items */}
                {item.type === "found" &&
                  (item as FoundItem).handedToAuthority && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2">
                        Authority Contact
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {(item as FoundItem).authorityContact}
                      </p>
                    </div>
                  )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!item.contactInfo.anonymous ? (
                  <div>
                    <p className="font-semibold">{item.contactInfo.name}</p>
                    <div className="flex flex-col gap-2 mt-2">
                      <Button className="w-full" size="sm">
                        {item.contactInfo.preferredContact === "email" ? (
                          <>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Email
                          </>
                        ) : (
                          <>
                            <Phone className="h-4 w-4 mr-2" />
                            Call Now
                          </>
                        )}
                      </Button>
                      <Button variant="outline" className="w-full" size="sm">
                        <Shield className="h-4 w-4 mr-2" />
                        Report Match
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Shield className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-3">
                      This user prefers to keep their contact information
                      private
                    </p>
                    <Button className="w-full" size="sm">
                      Request Contact
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Intelligent Matches */}
            {matches.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Smart Match Suggestions
                  </CardTitle>
                  <CardDescription>
                    Our AI found potential matches for this item
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {matchesLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="ml-2 text-sm">Finding matches...</span>
                    </div>
                  ) : (
                    matches.slice(0, 3).map((match) => (
                      <div
                        key={match.id}
                        className="border rounded-lg p-3 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs",
                              getMatchScoreColor(match.score),
                            )}
                          >
                            <Star className="h-3 w-3 mr-1" />
                            {getMatchScoreLabel(match.score)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {Math.round(match.score * 100)}% match
                          </span>
                        </div>

                        <h5 className="text-sm font-semibold line-clamp-1">
                          {match.matchedItem?.title}
                        </h5>

                        <div className="text-xs text-muted-foreground space-y-1">
                          {match.reasons.slice(0, 2).map((reason, index) => (
                            <p key={index}>• {reason}</p>
                          ))}
                        </div>

                        {match.status === "pending" && (
                          <div className="flex gap-2 pt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleMatchAction(match.id, "accepted")
                              }
                              className="flex-1 text-xs"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Yes
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleMatchAction(match.id, "rejected")
                              }
                              className="flex-1 text-xs"
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              No
                            </Button>
                          </div>
                        )}

                        {match.status === "accepted" && (
                          <div className="flex items-center gap-1 pt-2">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            <span className="text-xs text-green-600">
                              Match confirmed
                            </span>
                          </div>
                        )}

                        {match.status === "rejected" && (
                          <div className="flex items-center gap-1 pt-2">
                            <XCircle className="h-3 w-3 text-red-600" />
                            <span className="text-xs text-red-600">
                              Not a match
                            </span>
                          </div>
                        )}
                      </div>
                    ))
                  )}

                  {matches.length > 3 && (
                    <Button variant="outline" className="w-full" size="sm">
                      View All {matches.length} Matches
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Report Time */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  Report Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Reported: {formatDate(item.dateReported)}</p>
                  <p>Last updated: {formatDate(item.updatedAt)}</p>
                  <p>
                    Status: <span className="capitalize">{item.status}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
