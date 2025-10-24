package controllers

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/shreyashsri79/vitbuddy-backend/internal/config"
	"github.com/shreyashsri79/vitbuddy-backend/internal/models"
)

// Validate marketplace input before saving
func validateMarketplaceInput(item *models.MarketplaceItem) string {
	if strings.TrimSpace(item.OwnerID) == "" {
		return "owner_id is required"
	}
	if strings.TrimSpace(item.Phone) == "" {
		return "phone is required"
	}
	if len(item.Phone) < 10 || len(item.Phone) > 15 {
		return "phone must be between 10-15 digits"
	}
	if item.Price < 0 {
		return "price cannot be negative"
	}
	return ""
}

// ✅ Create marketplace item
func CreateMarketplaceItem(c *gin.Context) {
	var input models.MarketplaceItem
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON format"})
		return
	}

	// Validate before DB write
	if msg := validateMarketplaceInput(&input); msg != "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": msg})
		return
	}

	if err := config.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create item"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Item created", "data": input})
}

// ✅ Get all marketplace items
func GetMarketplaceItems(c *gin.Context) {
	var items []models.MarketplaceItem
	config.DB.Order("created_at desc").Find(&items)
	c.JSON(http.StatusOK, items)
}

// ✅ Update marketplace item (owner only)
func UpdateMarketplaceItem(c *gin.Context) {
	id := c.Param("id")
	ownerID := c.Query("owner_id")

	var item models.MarketplaceItem
	if err := config.DB.First(&item, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
		return
	}

	// Ownership check
	if item.OwnerID != ownerID {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Not allowed to update"})
		return
	}

	// Bind partial update
	var input map[string]interface{}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON format"})
		return
	}

	// Protect immutable fields
	delete(input, "id")
	delete(input, "owner_id")
	delete(input, "created_at")

	// Validate price if present
	if price, ok := input["price"]; ok {
		if price.(float64) < 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Price cannot be negative"})
			return
		}
	}

	// Execute update
	if err := config.DB.Model(&item).Updates(input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update item"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Item updated", "data": item})
}

// ✅ Delete marketplace item (owner only)
func DeleteMarketplaceItem(c *gin.Context) {
	id := c.Param("id")
	ownerID := c.Query("owner_id")

	var item models.MarketplaceItem
	if err := config.DB.First(&item, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
		return
	}

	if item.OwnerID != ownerID {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Not allowed to delete"})
		return
	}

	if err := config.DB.Delete(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete item"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Item deleted"})
}
