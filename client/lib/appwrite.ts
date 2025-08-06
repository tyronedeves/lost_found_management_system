import { Client, Account, Databases, ID } from "appwrite";

// Initialize Appwrite client
const client = new Client();

// Get configuration from environment variables or use defaults
const APPWRITE_ENDPOINT =
  import.meta.env.VITE_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
const APPWRITE_PROJECT_ID =
  import.meta.env.VITE_APPWRITE_PROJECT_ID || "foundit-demo";

client.setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);

export { ID, client };

// Helper functions to create fresh instances to avoid body stream conflicts
export const createFreshClient = () => {
  const freshClient = new Client();
  freshClient.setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID);
  return freshClient;
};

export const createFreshAccount = () => {
  return new Account(createFreshClient());
};

// Appwrite configuration - update these with your project details
export const APPWRITE_CONFIG = {
  endpoint: APPWRITE_ENDPOINT,
  projectId: APPWRITE_PROJECT_ID,
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID || "foundit-db",
  usersCollectionId:
    import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID || "users",
  itemsCollectionId:
    import.meta.env.VITE_APPWRITE_ITEMS_COLLECTION_ID || "items",
};

// User roles
export enum UserRole {
  USER = "user",
  ADMIN = "admin",
  MODERATOR = "moderator",
}

// For demo purposes, we'll use localStorage to simulate user roles
// In production, this would be managed through Appwrite's user attributes or teams
export const DEMO_USERS = {
  "admin@foundit.com": { role: UserRole.ADMIN, name: "Admin User" },
  "moderator@foundit.com": { role: UserRole.MODERATOR, name: "Moderator User" },
  "user@foundit.com": { role: UserRole.USER, name: "Regular User" },
};
