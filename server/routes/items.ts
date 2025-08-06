import { RequestHandler } from "express";
import { database } from "../services/database";
import {
  Item,
  SearchFilters,
  ItemsResponse,
  ItemResponse,
  MatchesResponse,
} from "@shared/types";

// Get all items with filtering and pagination
export const getItems: RequestHandler = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      type,
      category,
      location,
      status = "active",
      keyword,
      startDate,
      endDate,
    } = req.query;

    const filters: SearchFilters = {
      type: type as any,
      category: category as any,
      location: location as string,
      status: status as any,
      keyword: keyword as string,
    };

    if (startDate && endDate) {
      filters.dateRange = {
        start: startDate as string,
        end: endDate as string,
      };
    }

    const result = await database.searchItems(
      filters,
      parseInt(page as string),
      parseInt(limit as string),
    );

    const response: ItemsResponse = {
      success: true,
      data: {
        items: result.items,
        total: result.total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        hasMore: result.hasMore,
      },
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch items",
    });
  }
};

// Get single item by ID
export const getItem: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await database.getItem(id);

    if (!item) {
      const response: ItemResponse = {
        success: false,
        error: "Item not found",
      };
      return res.status(404).json(response);
    }

    const response: ItemResponse = {
      success: true,
      data: item,
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching item:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch item",
    });
  }
};

// Create new item
export const createItem: RequestHandler = async (req, res) => {
  try {
    const itemData = req.body;

    // Basic validation
    if (
      !itemData.title ||
      !itemData.description ||
      !itemData.category ||
      !itemData.location
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Missing required fields: title, description, category, location",
      });
    }

    const newItem = await database.createItem({
      ...itemData,
      status: "active",
      dateReported: new Date().toISOString(),
      images: itemData.images || [],
      tags: itemData.tags || [],
    });

    const response: ItemResponse = {
      success: true,
      data: newItem,
      message: "Item reported successfully",
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create item",
    });
  }
};

// Update item
export const updateItem: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedItem = await database.updateItem(id, updates);

    if (!updatedItem) {
      const response: ItemResponse = {
        success: false,
        error: "Item not found",
      };
      return res.status(404).json(response);
    }

    const response: ItemResponse = {
      success: true,
      data: updatedItem,
      message: "Item updated successfully",
    };

    res.json(response);
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update item",
    });
  }
};

// Delete item
export const deleteItem: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await database.deleteItem(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: "Item not found",
      });
    }

    res.json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete item",
    });
  }
};

// Get matches for an item
export const getItemMatches: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const matches = await database.getMatches(id);

    // Get the actual matched items
    const matchesWithItems = await Promise.all(
      matches.map(async (match) => {
        const matchedItemId =
          match.itemId === id ? match.matchedItemId : match.itemId;
        const matchedItem = await database.getItem(matchedItemId);
        return {
          ...match,
          matchedItem,
        };
      }),
    );

    const response: MatchesResponse = {
      success: true,
      data: matchesWithItems,
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching matches:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch matches",
    });
  }
};

// Update match status
export const updateMatchStatus: RequestHandler = async (req, res) => {
  try {
    const { matchId } = req.params;
    const { status } = req.body;

    if (!["pending", "accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status. Must be pending, accepted, or rejected",
      });
    }

    const updatedMatch = await database.updateMatchStatus(matchId, status);

    if (!updatedMatch) {
      return res.status(404).json({
        success: false,
        error: "Match not found",
      });
    }

    res.json({
      success: true,
      data: updatedMatch,
      message: "Match status updated successfully",
    });
  } catch (error) {
    console.error("Error updating match status:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update match status",
    });
  }
};

// Get categories
export const getCategories: RequestHandler = async (req, res) => {
  try {
    const categories = database.getCategories();
    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch categories",
    });
  }
};
