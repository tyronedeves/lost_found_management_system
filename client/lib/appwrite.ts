import { Client, Account, Databases, Storage, ID } from 'appwrite';

// Appwrite configuration from environment variables
export const APPWRITE_CONFIG = {
  endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT,
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  usersCollectionId: import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
  itemsCollectionId: import.meta.env.VITE_APPWRITE_ITEMS_COLLECTION_ID,
};

// Create Appwrite client
export const client = new Client()
  .setEndpoint(APPWRITE_CONFIG.endpoint)
  .setProject(APPWRITE_CONFIG.projectId);

// Initialize Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Export ID utility
export { ID };

// User roles enum
export enum UserRole {
  USER = 'user',
  MODERATOR = 'moderator',
  ADMIN = 'admin'
}

// Demo users for testing (you mentioned these in your AuthContext)
export const DEMO_USERS = [
  {
    email: 'admin@foundit.com',
    password: 'AdminFoundIt2024!',
    name: 'Admin User',
    role: UserRole.ADMIN
  },
  {
    email: 'walter@foundit.com', 
    password: 'WalterFoundIt2024!',
    name: 'Walter Enebeli-uzor',
    role: UserRole.ADMIN
  },
  {
    email: 'walterenebeli@gmail.com',
    password: 'WalterFoundIt2024!', 
    name: 'Walter Enebeli-uzor',
    role: UserRole.ADMIN
  }
];

// Function to create fresh account instance (for auth issues)
export const createFreshAccount = () => {
  const freshClient = new Client()
    .setEndpoint(APPWRITE_CONFIG.endpoint)
    .setProject(APPWRITE_CONFIG.projectId);
  
  return new Account(freshClient);
};

// Collection IDs for easy reference
export const COLLECTIONS = {
  USERS: APPWRITE_CONFIG.usersCollectionId,
  ITEMS: APPWRITE_CONFIG.itemsCollectionId,
  // You can add more collections here as needed
  MATCHES: 'matches', // Create this collection if you want to store AI matches
  CONTACTS: 'contacts', // Create this collection for contact requests
  NOTIFICATIONS: 'notifications', // For user notifications
};

// Database ID for easy reference
export const DATABASE_ID = APPWRITE_CONFIG.databaseId;

// Helper function to handle Appwrite errors
export const handleAppwriteError = (error: any) => {
  console.error('Appwrite error:', error);
  
  if (error.code === 401) {
    return 'Authentication required. Please log in.';
  } else if (error.code === 404) {
    return 'Item not found.';
  } else if (error.code === 409) {
    return 'Item already exists.';
  } else if (error.message?.includes('Failed to fetch')) {
    return 'Unable to connect to the server. Please check your internet connection.';
  } else {
    return error.message || 'An unexpected error occurred.';
  }
};

// Helper function to create item document structure
export const createItemDocument = (itemData: any) => {
  return {
    type: itemData.type,
    title: itemData.title,
    description: itemData.description,
    category: itemData.category,
    // Store location as separate fields for easier querying
    address: itemData.location?.address || '',
    city: itemData.location?.city || '',
    state: itemData.location?.state || '',
    zipCode: itemData.location?.zipCode || '',
    country: itemData.location?.country || 'US',
    landmark: itemData.location?.landmark || '',
    // Store contact info as separate fields
    contactName: itemData.contactInfo?.name || '',
    contactEmail: itemData.contactInfo?.email || '',
    contactPhone: itemData.contactInfo?.phone || '',
    preferredContact: itemData.contactInfo?.preferredContact || 'email',
    anonymous: itemData.contactInfo?.anonymous || false,
    // Arrays and other fields
    tags: itemData.tags || [],
    images: itemData.images || [],
    status: itemData.status || 'active',
    userId: itemData.userId,
    // Type-specific fields
    ...(itemData.type === 'lost' && {
      dateLost: itemData.dateLost,
      reward: itemData.reward || 0,
    }),
    ...(itemData.type === 'found' && {
      dateFound: itemData.dateFound,
      handedToAuthority: itemData.handedToAuthority || false,
      authorityContact: itemData.authorityContact || '',
    }),
  };
};