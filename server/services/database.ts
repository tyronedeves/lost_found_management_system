import {
  Item,
  LostItem,
  FoundItem,
  MatchSuggestion,
  SearchFilters,
  ItemCategory,
} from "@shared/types";

// In-memory database for demonstration (in production, use a real database)
class InMemoryDatabase {
  private items: Map<string, Item> = new Map();
  private matches: Map<string, MatchSuggestion> = new Map();
  private idCounter = 1;

  constructor() {
    // Seed with sample data
    this.seedDatabase();
  }

  private generateId(): string {
    return `item_${this.idCounter++}`;
  }

  private seedDatabase() {
    const sampleItems: Item[] = [
      {
        id: this.generateId(),
        type: "lost",
        title: "iPhone 14 Pro in Blue Case",
        description:
          "Lost my iPhone 14 Pro in a blue protective case. Has a crack on the screen protector.",
        category: "electronics",
        location: {
          address: "123 Main St",
          city: "San Francisco",
          state: "CA",
          zipCode: "94105",
          landmark: "Near Starbucks",
        },
        dateReported: new Date().toISOString(),
        dateLost: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        images: [],
        contactInfo: {
          name: "John Doe",
          email: "john.doe@email.com",
          phone: "+1-555-0123",
          preferredContact: "email",
          anonymous: false,
        },
        status: "active",
        tags: ["phone", "apple", "blue", "cracked"],
        reward: 100,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as LostItem,
      {
        id: this.generateId(),
        type: "found",
        title: "Black Leather Wallet",
        description:
          "Found a black leather wallet with multiple cards inside. No cash visible.",
        category: "bags",
        location: {
          address: "456 Market St",
          city: "San Francisco",
          state: "CA",
          zipCode: "94102",
          landmark: "Bus stop on Market Street",
        },
        currentLocation: {
          address: "SFPD Station",
          city: "San Francisco",
          state: "CA",
          landmark: "Police station front desk",
        },
        dateReported: new Date().toISOString(),
        dateFound: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        images: [],
        contactInfo: {
          name: "Jane Smith",
          email: "jane.smith@email.com",
          preferredContact: "email",
          anonymous: false,
        },
        status: "active",
        tags: ["wallet", "black", "leather", "cards"],
        handedToAuthority: true,
        authorityContact: "SFPD (415) 553-0123",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as FoundItem,
      {
        id: this.generateId(),
        type: "lost",
        title: "Silver Car Keys with Honda Keychain",
        description:
          "Lost my car keys with a Honda keychain and a small flashlight attachment.",
        category: "keys",
        location: {
          address: "789 Golden Gate Park",
          city: "San Francisco",
          state: "CA",
          landmark: "Near the playground",
        },
        dateReported: new Date().toISOString(),
        dateLost: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        images: [],
        contactInfo: {
          name: "Mike Johnson",
          email: "mike.j@email.com",
          phone: "+1-555-0456",
          preferredContact: "phone",
          anonymous: false,
        },
        status: "active",
        tags: ["keys", "honda", "silver", "flashlight"],
        reward: 50,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as LostItem,
    ];

    sampleItems.forEach((item) => {
      this.items.set(item.id, item);
    });
  }

  // Item operations
  async createItem(
    item: Omit<Item, "id" | "createdAt" | "updatedAt">,
  ): Promise<Item> {
    const newItem: Item = {
      ...item,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.items.set(newItem.id, newItem);

    // Generate potential matches
    this.generateMatches(newItem);

    return newItem;
  }

  async getItem(id: string): Promise<Item | null> {
    return this.items.get(id) || null;
  }

  async updateItem(id: string, updates: Partial<Item>): Promise<Item | null> {
    const item = this.items.get(id);
    if (!item) return null;

    const updatedItem: Item = {
      ...item,
      ...updates,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
    };

    this.items.set(id, updatedItem);
    return updatedItem;
  }

  async deleteItem(id: string): Promise<boolean> {
    return this.items.delete(id);
  }

  async searchItems(
    filters: SearchFilters = {},
    page = 1,
    limit = 20,
  ): Promise<{
    items: Item[];
    total: number;
    hasMore: boolean;
  }> {
    let filteredItems = Array.from(this.items.values());

    // Apply filters
    if (filters.type) {
      filteredItems = filteredItems.filter(
        (item) => item.type === filters.type,
      );
    }

    if (filters.category) {
      filteredItems = filteredItems.filter(
        (item) => item.category === filters.category,
      );
    }

    if (filters.status) {
      filteredItems = filteredItems.filter(
        (item) => item.status === filters.status,
      );
    }

    if (filters.location) {
      const locationLower = filters.location.toLowerCase();
      filteredItems = filteredItems.filter(
        (item) =>
          item.location.city.toLowerCase().includes(locationLower) ||
          item.location.address.toLowerCase().includes(locationLower) ||
          item.location.state.toLowerCase().includes(locationLower),
      );
    }

    if (filters.keyword) {
      const keywordLower = filters.keyword.toLowerCase();
      filteredItems = filteredItems.filter(
        (item) =>
          item.title.toLowerCase().includes(keywordLower) ||
          item.description.toLowerCase().includes(keywordLower) ||
          item.tags.some((tag) => tag.toLowerCase().includes(keywordLower)),
      );
    }

    if (filters.dateRange) {
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      filteredItems = filteredItems.filter((item) => {
        const itemDate = new Date(item.dateReported);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    // Sort by most recent
    filteredItems.sort(
      (a, b) =>
        new Date(b.dateReported).getTime() - new Date(a.dateReported).getTime(),
    );

    // Pagination
    const total = filteredItems.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedItems = filteredItems.slice(startIndex, endIndex);

    return {
      items: paginatedItems,
      total,
      hasMore: endIndex < total,
    };
  }

  // Matching operations
  private generateMatches(newItem: Item) {
    const oppositeType = newItem.type === "lost" ? "found" : "lost";
    const potentialMatches = Array.from(this.items.values()).filter(
      (item) =>
        item.type === oppositeType &&
        item.category === newItem.category &&
        item.status === "active",
    );

    potentialMatches.forEach((match) => {
      const score = this.calculateMatchScore(newItem, match);
      if (score > 0.5) {
        // Only create matches with decent confidence
        const matchId = `match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const matchSuggestion: MatchSuggestion = {
          id: matchId,
          itemId: newItem.id,
          matchedItemId: match.id,
          score,
          reasons: this.getMatchReasons(newItem, match),
          status: "pending",
          createdAt: new Date().toISOString(),
        };
        this.matches.set(matchId, matchSuggestion);
      }
    });
  }

  private calculateMatchScore(item1: Item, item2: Item): number {
    let score = 0;
    let factors = 0;

    // Category match (required)
    if (item1.category === item2.category) {
      score += 0.3;
      factors++;
    } else {
      return 0; // Must match category
    }

    // Location proximity
    const distance = this.calculateDistance(item1.location, item2.location);
    if (distance < 5) {
      // Within 5 miles
      score += 0.3 * (1 - distance / 5);
      factors++;
    }

    // Date proximity
    const date1 = new Date(
      item1.type === "lost"
        ? (item1 as LostItem).dateLost || item1.dateReported
        : (item1 as FoundItem).dateFound,
    );
    const date2 = new Date(
      item2.type === "lost"
        ? (item2 as LostItem).dateLost || item2.dateReported
        : (item2 as FoundItem).dateFound,
    );
    const daysDiff =
      Math.abs(date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24);
    if (daysDiff < 7) {
      // Within 7 days
      score += 0.2 * (1 - daysDiff / 7);
      factors++;
    }

    // Description and tag similarity
    const similarity = this.calculateTextSimilarity(
      `${item1.title} ${item1.description} ${item1.tags.join(" ")}`,
      `${item2.title} ${item2.description} ${item2.tags.join(" ")}`,
    );
    score += 0.2 * similarity;
    factors++;

    return factors > 0 ? score : 0;
  }

  private calculateDistance(loc1: any, loc2: any): number {
    // Simplified distance calculation (in real app, use proper geolocation)
    if (loc1.city === loc2.city && loc1.state === loc2.state) {
      return 1; // Same city
    }
    return 10; // Different city
  }

  private calculateTextSimilarity(text1: string, text2: string): number {
    const words1 = text1.toLowerCase().split(/\s+/);
    const words2 = text2.toLowerCase().split(/\s+/);
    const intersection = words1.filter((word) => words2.includes(word));
    const union = [...new Set([...words1, ...words2])];
    return intersection.length / union.length;
  }

  private getMatchReasons(item1: Item, item2: Item): string[] {
    const reasons: string[] = [];

    reasons.push(`Same category: ${item1.category}`);

    if (item1.location.city === item2.location.city) {
      reasons.push(`Same city: ${item1.location.city}`);
    }

    const commonTags = item1.tags.filter((tag) =>
      item2.tags.some((tag2) => tag2.toLowerCase().includes(tag.toLowerCase())),
    );
    if (commonTags.length > 0) {
      reasons.push(`Similar descriptions: ${commonTags.join(", ")}`);
    }

    return reasons;
  }

  async getMatches(itemId: string): Promise<MatchSuggestion[]> {
    return Array.from(this.matches.values())
      .filter(
        (match) => match.itemId === itemId || match.matchedItemId === itemId,
      )
      .sort((a, b) => b.score - a.score);
  }

  async updateMatchStatus(
    matchId: string,
    status: MatchSuggestion["status"],
  ): Promise<MatchSuggestion | null> {
    const match = this.matches.get(matchId);
    if (!match) return null;

    match.status = status;
    this.matches.set(matchId, match);
    return match;
  }

  // Get all categories for filtering
  getCategories(): ItemCategory[] {
    return [
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
  }
}

export const database = new InMemoryDatabase();
