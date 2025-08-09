// lib/appwrite-utils.ts
import { databases, storage, APPWRITE_CONFIG, ID } from "@/lib/appwrite";
import { Query } from "appwrite";
import type { Item, SearchFilters } from "@shared/types";

/**
 * Upload multiple images to Appwrite storage
 */
export async function uploadImages(files: File[]): Promise<string[]> {
  const uploadPromises = files.map(async (file) => {
    // Validate file
    if (!file.type.startsWith('image/')) {
      throw new Error(`${file.name} is not an image file`);
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      throw new Error(`${file.name} is too large (max 5MB)`);
    }

    // Upload to Appwrite
    const fileId = ID.unique();
    const uploadResult = await storage.createFile(
      APPWRITE_CONFIG.buckets.images,
      fileId,
      file
    );

    // Return the file view URL
    return storage.getFileView(
      APPWRITE_CONFIG.buckets.images,
      uploadResult.$id
    ).toString();
  });

  return Promise.all(uploadPromises);
}

/**
 * Delete an image from Appwrite storage
 */
export async function deleteImage(imageUrl: string): Promise<void> {
  try {
    // Extract file ID from URL
    const fileId = extractFileIdFromUrl(imageUrl);
    if (fileId) {
      await storage.deleteFile(APPWRITE_CONFIG.buckets.images, fileId);
    }
  } catch (error) {
    console.error('Failed to delete image:', error);
    // Don't throw - image deletion failure shouldn't break the app
  }
}

/**
 * Extract file ID from Appwrite storage URL
 */
function extractFileIdFromUrl(url: string): string | null {
  try {
    const urlParts = url.split('/');
    const filesIndex = urlParts.indexOf('files');
    if (filesIndex !== -1 && urlParts[filesIndex + 1]) {
      return urlParts[filesIndex + 1];
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Transform Appwrite document to Item type
 */
export function transformAppwriteDocumentToItem(doc: any): Item {
  return {
    id: doc.$id,
    type: doc.type as "lost" | "found",
    title: doc.title,
    description: doc.description,
    category: doc.category,
    location: {
      address: doc.location?.address || "",
      city: doc.location?.city || "",
      state: doc.location?.state || "",
      zipCode: doc.location?.zipCode || "",
      landmark: doc.location?.landmark || "",
      latitude: doc.location?.latitude,
      longitude: doc.location?.longitude,
    },
    contactInfo: {
      name: doc.contactInfo?.name || "",
      email: doc.contactInfo?.email || "",
      phone: doc.contactInfo?.phone || "",
      preferredContact: doc.contactInfo?.preferredContact || "email",
      anonymous: doc.contactInfo?.anonymous || false,
    },
    status: doc.status || "active",
    dateReported: doc.dateReported || doc.$createdAt,
    updatedAt: doc.$updatedAt,
    tags: doc.tags || [],
    images: doc.images || [],
    userId: doc.userId,
    // Type-specific fields
    ...(doc.type === "lost" && {
      dateLost: doc.dateLost,
      reward: doc.reward,
    }),
    ...(doc.type === "found" && {
      dateFound: doc.dateFound,
      handedToAuthority: doc.handedToAuthority || false,
      authorityContact: doc.authorityContact || "",
      currentLocation: doc.currentLocation || doc.location,
    }),
  };
}

/**
 * Build Appwrite queries from search filters
 */
export function buildSearchQueries(
  filters: SearchFilters,
  activeTab: "all" | "lost" | "found",
  page: number = 1,
  limit: number = 12
): string[] {
  const queries: string[] = [];

  // Always filter by active status
  queries.push(Query.equal("status", "active"));

  // Type filter
  if (activeTab !== "all") {
    queries.push(Query.equal("type", activeTab));
  }

  // Category filter
  if (filters.category) {
    queries.push(Query.equal("category", filters.category));
  }

  // Pagination
  queries.push(Query.limit(limit));
  queries.push(Query.offset((page - 1) * limit));

  // Ordering
  queries.push(Query.orderDesc("dateReported"));

  return queries;
}

/**
 * Client-side filtering for keyword and location
 * (since Appwrite has limited full-text search capabilities)
 */
export function applyClientSideFilters(items: Item[], filters: SearchFilters): Item[] {
  let filteredItems = [...items];

  // Keyword search
  if (filters.keyword) {
    const keyword = filters.keyword.toLowerCase();
    filteredItems = filteredItems.filter(item =>
      item.title.toLowerCase().includes(keyword) ||
      item.description.toLowerCase().includes(keyword) ||
      item.category.toLowerCase().includes(keyword) ||
      item.tags.some(tag => tag.toLowerCase().includes(keyword))
    );
  }

  // Location search
  if (filters.location) {
    const location = filters.location.toLowerCase();
    filteredItems = filteredItems.filter(item =>
      item.location.city.toLowerCase().includes(location) ||
      item.location.state.toLowerCase().includes(location) ||
      item.location.address.toLowerCase().includes(location) ||
      (item.location.landmark && item.location.landmark.toLowerCase().includes(location))
    );
  }

  return filteredItems;
}

/**
 * Get items with pagination and filtering
 */
export async function searchItems(
  filters: SearchFilters,
  activeTab: "all" | "lost" | "found" = "all",
  page: number = 1,
  limit: number = 12
): Promise<{ items: Item[]; total: number; hasMore: boolean }> {
  try {
    const queries = buildSearchQueries(filters, activeTab, page, limit);
    
    const response = await databases.listDocuments(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.items,
      queries
    );

    // Transform documents
    let items = response.documents.map(transformAppwriteDocumentToItem);

    // Apply client-side filters
    items = applyClientSideFilters(items, filters);

    return {
      items,
      total: response.total,
      hasMore: response.total > page * limit
    };
  } catch (error) {
    console.error('Error searching items:', error);
    throw error;
  }
}

/**
 * Get a single item by ID
 */
export async function getItemById(id: string): Promise<Item> {
  try {
    const response = await databases.getDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.items,
      id
    );

    return transformAppwriteDocumentToItem(response);
  } catch (error) {
    console.error('Error fetching item:', error);
    throw error;
  }
}

/**
 * Create a new item
 */
export async function createItem(itemData: any, userId: string): Promise<Item> {
  try {
    const documentData = {
      ...itemData,
      userId,
      status: "active",
      dateReported: new Date().toISOString(),
    };

    const response = await databases.createDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.items,
      ID.unique(),
      documentData
    );

    return transformAppwriteDocumentToItem(response);
  } catch (error) {
    console.error('Error creating item:', error);
    throw error;
  }
}

/**
 * Update an existing item
 */
export async function updateItem(id: string, itemData: any): Promise<Item> {
  try {
    const response = await databases.updateDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.items,
      id,
      itemData
    );

    return transformAppwriteDocumentToItem(response);
  } catch (error) {
    console.error('Error updating item:', error);
    throw error;
  }
}

/**
 * Delete an item and its associated images
 */
export async function deleteItem(id: string): Promise<void> {
  try {
    // First get the item to access its images
    const item = await getItemById(id);
    
    // Delete associated images
    if (item.images.length > 0) {
      await Promise.all(item.images.map(deleteImage));
    }

    // Delete the document
    await databases.deleteDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.items,
      id
    );
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
}

/**
 * Find potential matches for an item
 */
export async function findPotentialMatches(item: Item): Promise<any[]> {
  try {
    const oppositeType = item.type === "lost" ? "found" : "lost";
    
    const response = await databases.listDocuments(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.items,
      [
        Query.equal("type", oppositeType),
        Query.equal("category", item.category),
        Query.equal("status", "active"),
        Query.limit(10)
      ]
    );

    // Calculate match scores
    const matches = response.documents.map(doc => {
      let score = 0;
      const reasons: string[] = [];

      // Category match (base score)
      if (doc.category === item.category) {
        score += 0.4;
        reasons.push(`Same category: ${doc.category}`);
      }

      // Location proximity
      if (doc.location?.city?.toLowerCase() === item.location.city?.toLowerCase()) {
        score += 0.3;
        reasons.push(`Same city: ${doc.location.city}`);
      }

      // Keywords matching
      const itemKeywords = `${item.title} ${item.description} ${item.tags?.join(' ')}`.toLowerCase();
      const docKeywords = `${doc.title} ${doc.description} ${doc.tags?.join(' ')}`.toLowerCase();
      
      const commonWords = itemKeywords.split(' ').filter(word => 
        word.length > 3 && docKeywords.includes(word)
      );
      
      if (commonWords.length > 0) {
        score += Math.min(commonWords.length * 0.1, 0.3);
        reasons.push(`Matching keywords: ${commonWords.slice(0, 3).join(', ')}`);
      }

      // Date proximity
      const itemDate = new Date(item.type === "lost" ? item.dateLost || item.dateReported : item.dateFound);
      const docDate = new Date(doc.type === "lost" ? doc.dateLost || doc.dateReported : doc.dateFound);
      const daysDiff = Math.abs((itemDate.getTime() - docDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= 7) {
        score += 0.2;
        reasons.push(`Reported within ${Math.round(daysDiff)} days`);
      }

      return {
        id: `match_${doc.$id}`,
        matchedItem: transformAppwriteDocumentToItem(doc),
        score,
        reasons,
        status: "pending",
        confidence: score >= 0.7 ? "high" : score >= 0.4 ? "medium" : "low",
      };
    }).filter(match => match.score > 0.3)
      .sort((a, b) => b.score - a.score);

    return matches;
  } catch (error) {
    console.error('Error finding matches:', error);
    return [];
  }
}

/**
 * Get user's items
 */
export async function getUserItems(userId: string): Promise<Item[]> {
  try {
    const response = await databases.listDocuments(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.items,
      [
        Query.equal("userId", userId),
        Query.orderDesc("dateReported"),
        Query.limit(100) // Reasonable limit for user's items
      ]
    );

    return response.documents.map(transformAppwriteDocumentToItem);
  } catch (error) {
    console.error('Error fetching user items:', error);
    throw error;
  }
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: `${file.name} is not an image file` };
  }
  
  if (file.size > 5 * 1024 * 1024) { // 5MB limit
    return { valid: false, error: `${file.name} is too large (max 5MB)` };
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: `${file.name} has unsupported format. Use JPEG, PNG, GIF, or WebP` };
  }

  return { valid: true };
}