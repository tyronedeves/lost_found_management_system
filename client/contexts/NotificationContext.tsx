import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "@/components/ui/use-toast";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "match" | "contact" | "update" | "system";
  priority: "high" | "medium" | "low";
  read: boolean;
  itemId?: string;
  matchId?: string;
  createdAt: string;
  actionUrl?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (
    notification: Omit<Notification, "id" | "read" | "createdAt">,
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  requestPermission: () => Promise<boolean>;
  sendBrowserNotification: (
    title: string,
    message: string,
    options?: NotificationOptions,
  ) => void;
  triggerLostItemAlert: (itemDetails: { category: string; location: string; description: string }) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }
  return context;
}

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasPermission, setHasPermission] = useState<boolean>(false);

  useEffect(() => {
    // Check if browser supports notifications
    if ("Notification" in window) {
      setHasPermission(Notification.permission === "granted");
    }

    // Simulate some initial notifications
    const initialNotifications: Notification[] = [
      {
        id: "notif_1",
        title: "New Match Found!",
        message: "We found a potential match for your lost iPhone",
        type: "match",
        priority: "high",
        read: false,
        itemId: "item_1",
        matchId: "match_1",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        actionUrl: "/items/item_1",
      },
      {
        id: "notif_2",
        title: "Someone contacted you",
        message: "John Doe sent you a message about your found wallet",
        type: "contact",
        priority: "medium",
        read: false,
        itemId: "item_2",
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        actionUrl: "/items/item_2",
      },
      {
        id: "notif_3",
        title: "Item Status Updated",
        message: "Your lost keys report has been updated",
        type: "update",
        priority: "low",
        read: true,
        itemId: "item_3",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        actionUrl: "/items/item_3",
      },
    ];
    setNotifications(initialNotifications);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = (
    notification: Omit<Notification, "id" | "read" | "createdAt">,
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      read: false,
      createdAt: new Date().toISOString(),
    };

    setNotifications((prev) => [newNotification, ...prev]);

    // Show toast notification
    toast({
      title: notification.title,
      description: notification.message,
      duration: notification.priority === "high" ? 8000 : 5000,
    });

    // Send browser notification if permitted
    if (hasPermission && notification.priority === "high") {
      sendBrowserNotification(notification.title, notification.message);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const requestPermission = async (): Promise<boolean> => {
    if (!("Notification" in window)) {
      return false;
    }

    if (Notification.permission === "granted") {
      setHasPermission(true);
      return true;
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      const granted = permission === "granted";
      setHasPermission(granted);
      return granted;
    }

    return false;
  };

  const sendBrowserNotification = (
    title: string,
    message: string,
    options?: NotificationOptions,
  ) => {
    if (!hasPermission) return;

    const notification = new Notification(title, {
      body: message,
      icon: "/placeholder.svg",
      badge: "/placeholder.svg",
      tag: "foundit-notification",
      requireInteraction: true,
      ...options,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    // Auto close after 10 seconds
    setTimeout(() => {
      notification.close();
    }, 10000);
  };

  // Real-time notification trigger for lost items only
  const triggerLostItemAlert = (itemDetails: { category: string; location: string; description: string }) => {
    const notification = {
      title: "🚨 New Lost Item Alert",
      message: `Lost ${itemDetails.category} reported near ${itemDetails.location}`,
      type: "system" as const,
      priority: "high" as const,
      actionUrl: "/search",
    };

    addNotification(notification);

    // Also trigger browser notification for immediate alert
    if (hasPermission) {
      sendBrowserNotification(
        notification.title,
        notification.message,
        {
          icon: "📱",
          requireInteraction: true,
          tag: "lost-item-alert",
        }
      );
    }
  };

  // Simulate checking for lost items every minute (in production, this would be WebSocket/SSE)
  useEffect(() => {
    const interval = setInterval(() => {
      // This would normally check a real-time API for new lost items
      // For demo, occasionally simulate a lost item being reported
      if (Math.random() < 0.05) { // 5% chance every minute for demo
        const lostItems = [
          { category: "iPhone", location: "Downtown Area", description: "Black iPhone 13" },
          { category: "Wallet", location: "Central Park", description: "Brown leather wallet" },
          { category: "Keys", location: "University Campus", description: "Set of house keys with red keychain" },
          { category: "Laptop", location: "Coffee Shop District", description: "MacBook Pro with stickers" },
        ];

        const randomItem = lostItems[Math.floor(Math.random() * lostItems.length)];
        triggerLostItemAlert(randomItem);
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [hasPermission]);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    requestPermission,
    sendBrowserNotification,
    triggerLostItemAlert,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
