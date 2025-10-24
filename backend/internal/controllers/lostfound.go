package controllers

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/shreyashsri79/vitbuddy-backend/internal/config"
	"github.com/shreyashsri79/vitbuddy-backend/internal/models"
)

// Create Lost & Found Post
func CreateLostFound(c *gin.Context) {
	var input models.LostFound

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON format"})
		return
	}

	// Validate required fields
	if input.Category == "" || input.OwnerID == "" || input.Phone == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing required fields"})
		return
	}

	// Validate category ENUM
	input.Category = strings.ToLower(input.Category)
	if input.Category != models.CategoryLost && input.Category != models.CategoryFound {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Category must be 'lost' or 'found'"})
		return
	}

	if err := config.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create lost/found entry"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Entry created successfully", "data": input})
}

// Get all Lost & Found entries (optional filter by category)
func GetLostFound(c *gin.Context) {
	var items []models.LostFound
	category := c.Query("category")

	query := config.DB.Order("created_at desc")

	if category != "" {
		category = strings.ToLower(category)
		if category != models.CategoryLost && category != models.CategoryFound {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid category filter"})
			return
		}
		query = query.Where("category = ?", category)
	}

	query.Find(&items)
	c.JSON(http.StatusOK, items)
}

// Update Lost & Found entry (owner only)
func UpdateLostFound(c *gin.Context) {
	id := c.Param("id")
	ownerID := c.Query("owner_id")

	var item models.LostFound
	if err := config.DB.First(&item, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
		return
	}

	if item.OwnerID != ownerID {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized action"})
		return
	}

	var input models.LostFound
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid data format"})
		return
	}

	updateData := map[string]interface{}{}

	if input.Title != "" {
		updateData["title"] = input.Title
	}
	if input.Description != "" {
		updateData["description"] = input.Description
	}
	if input.ImageURL != "" {
		updateData["image_url"] = input.ImageURL
	}
	if input.Location != "" {
		updateData["location"] = input.Location
	}
	if input.Phone != "" {
		updateData["phone"] = input.Phone
	}
	if input.Category != "" {
		input.Category = strings.ToLower(input.Category)
		if input.Category != models.CategoryLost && input.Category != models.CategoryFound {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Category must be 'lost' or 'found'"})
			return
		}
		updateData["category"] = input.Category
	}

	if len(updateData) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No valid fields to update"})
		return
	}

	config.DB.Model(&item).Updates(updateData)

	c.JSON(http.StatusOK, gin.H{"message": "Item updated successfully", "data": item})
}

// Delete Lost & Found entry (owner only)
func DeleteLostFound(c *gin.Context) {
	id := c.Param("id")
	ownerID := c.Query("owner_id")

	var item models.LostFound
	if err := config.DB.First(&item, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
		return
	}

	if item.OwnerID != ownerID {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized action"})
		return
	}

	config.DB.Delete(&item)
	c.JSON(http.StatusOK, gin.H{"message": "Item deleted successfully"})
}
