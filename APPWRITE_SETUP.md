# 🔐 Appwrite Authentication Setup Guide

This guide will help you set up real Appwrite authentication for your FoundIt application.

## 📋 Prerequisites

1. **Appwrite Account**: Sign up at [https://cloud.appwrite.io](https://cloud.appwrite.io)
2. **Project Access**: You'll need to create a new Appwrite project

## 🚀 Step-by-Step Setup

### 1. Create Appwrite Project

1. Go to [Appwrite Cloud Console](https://cloud.appwrite.io)
2. Click **"Create Project"**
3. Enter project name: `FoundIt` (or your preferred name)
4. Note down your **Project ID** (you'll need this)

### 2. Configure Authentication

In your Appwrite project dashboard:

1. Go to **Auth** → **Settings**
2. Enable **Email/Password** authentication
3. Set your app domain in **Platforms**:
   - Click **Add Platform** → **Web**
   - Add your domain (e.g., `http://localhost:8080` for development)

### 3. Update Environment Variables

You have two options:

#### Option A: Use .env file (not recommended for production)

Update the `.env` file in your project root:

```bash
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-actual-project-id-here
```

#### Option B: Use DevServerControl (recommended)

Use the DevServerControl tool to set environment variables:

```bash
# Set your Appwrite Project ID
VITE_APPWRITE_PROJECT_ID=your-actual-project-id-here

# Endpoint is usually the same for Appwrite Cloud
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
```

### 4. Restart Development Server

After updating environment variables, restart your development server:

```bash
npm run dev
```

## ✅ Testing Authentication

### Demo Mode (Default)

If you haven't set up a real project ID, the app runs in demo mode with these credentials:

- **Admin**: `admin@foundit.com` / `password`
- **User**: `user@foundit.com` / `password`

### Real Authentication

Once you've configured your Appwrite project:

1. Go to `/register` to create a new account
2. Use real email/password combinations
3. All new users will have "user" role by default

## 🔧 Advanced Configuration

### User Roles Management

By default, all new users get the "user" role. To create admin users:

1. **Option 1**: Manually update user attributes in Appwrite console
2. **Option 2**: Create an admin user through the demo mode first
3. **Option 3**: Modify the registration logic to assign roles based on email domains

### Custom Collections (Optional)

If you want to store additional user data:

1. Create a **Database** in Appwrite console
2. Create **Collections** for users and items
3. Update the collection IDs in your environment variables:

```bash
VITE_APPWRITE_DATABASE_ID=your-database-id
VITE_APPWRITE_USERS_COLLECTION_ID=your-users-collection-id
VITE_APPWRITE_ITEMS_COLLECTION_ID=your-items-collection-id
```

## 🛠️ Environment Variables Reference

| Variable                            | Required | Description                        | Default                        |
| ----------------------------------- | -------- | ---------------------------------- | ------------------------------ |
| `VITE_APPWRITE_ENDPOINT`            | Yes      | Appwrite API endpoint              | `https://cloud.appwrite.io/v1` |
| `VITE_APPWRITE_PROJECT_ID`          | Yes      | Your Appwrite project ID           | `foundit-demo` (demo mode)     |
| `VITE_APPWRITE_DATABASE_ID`         | No       | Database ID for custom collections | `foundit-db`                   |
| `VITE_APPWRITE_USERS_COLLECTION_ID` | No       | Users collection ID                | `users`                        |
| `VITE_APPWRITE_ITEMS_COLLECTION_ID` | No       | Items collection ID                | `items`                        |

## 🐛 Troubleshooting

### Common Issues

1. **"Invalid credentials" error**: Make sure your Project ID is correct
2. **CORS errors**: Add your domain to Appwrite platform settings
3. **Demo mode still active**: Verify environment variables are set correctly

### Verification Steps

1. Check if environment variables are loaded:

   ```javascript
   console.log("Project ID:", import.meta.env.VITE_APPWRITE_PROJECT_ID);
   ```

2. Verify Appwrite connection in browser console:
   - Should show your actual project ID, not "foundit-demo"

## 📞 Support

If you need help:

1. Check [Appwrite Documentation](https://appwrite.io/docs)
2. Visit [Appwrite Discord](https://appwrite.io/discord)
3. Review the authentication code in `client/contexts/AuthContext.tsx`

---

**Note**: The application automatically detects if you're using demo mode (project ID = "foundit-demo") and switches to mock authentication. Once you set your real project ID, it will use actual Appwrite authentication.
