export interface BaseItem {
  id: string;
  title: string;
  description: string;
  category: ItemCategory;
  location: LocationInfo;
  dateReported: string;
  images: string[];
  contactInfo: ContactInfo;
  status: ItemStatus;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LostItem extends BaseItem {
  type: "lost";
  dateLost: string;
  reward?: number;
  lastSeenLocation?: LocationInfo;
}

export interface FoundItem extends BaseItem {
  type: "found";
  dateFound: string;
  currentLocation: LocationInfo;
  handedToAuthority?: boolean;
  authorityContact?: string;
}

export type Item = LostItem | FoundItem;

export interface LocationInfo {
  address: string;
  city: string;
  state: string;
  zipCode?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  landmark?: string;
}

export interface ContactInfo {
  name: string;
  email: string;
  phone?: string;
  preferredContact: "email" | "phone";
  anonymous?: boolean;
}

export type ItemCategory =
  | "electronics"
  | "jewelry"
  | "clothing"
  | "bags"
  | "keys"
  | "documents"
  | "pets"
  | "vehicles"
  | "sports"
  | "books"
  | "toys"
  | "other";

export type ItemStatus =
  | "active"
  | "matched"
  | "claimed"
  | "expired"
  | "archived";

export interface MatchSuggestion {
  id: string;
  itemId: string;
  matchedItemId: string;
  score: number;
  reasons: string[];
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

export interface SearchFilters {
  category?: ItemCategory;
  location?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  type?: "lost" | "found";
  status?: ItemStatus;
  keyword?: string;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  matchAlerts: boolean;
  proximityAlerts: boolean;
  dailyDigest: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  preferences: NotificationPreferences;
  itemsReported: string[];
  itemsClaimed: string[];
  createdAt: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ItemsResponse extends ApiResponse<PaginatedResponse<Item>> {}
export interface ItemResponse extends ApiResponse<Item> {}
export interface MatchesResponse extends ApiResponse<MatchSuggestion[]> {}
