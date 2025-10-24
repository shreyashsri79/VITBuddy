package controllers

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/shreyashsri79/vitbuddy-backend/internal/config"
	"github.com/shreyashsri79/vitbuddy-backend/internal/models"
)

// Create Delibuddy entry (delivery offer or request)
func CreateDelibuddy(c *gin.Context) {
	var input models.Delibuddy
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid data format"})
		return
	}

	// Validate required fields
	if input.Type == "" || input.UserID == "" || input.Username == "" || input.Location == "" || input.Phone == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing required fields"})
		return
	}

	// Validate type
	input.Type = strings.ToLower(input.Type)
	if input.Type != "offer" && input.Type != "request" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Type must be 'offer' or 'request'"})
		return
	}

	if err := config.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create entry"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Entry created", "data": input})
}

// Get all Delibuddy posts
func GetDelibuddy(c *gin.Context) {
	var entries []models.Delibuddy
	entryType := c.Query("type")

	query := config.DB.Order("created_at desc")

	if entryType != "" {
		entryType = strings.ToLower(entryType)
		if entryType != "offer" && entryType != "request" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid type filter"})
			return
		}
		query = query.Where("type = ?", entryType)
	}

	query.Find(&entries)
	c.JSON(http.StatusOK, entries)
}


// Update Delibuddy entry (owner only)
func UpdateDelibuddy(c *gin.Context) {
	id := c.Param("id")
	userID := c.Query("user_id")

	var entry models.Delibuddy
	if err := config.DB.First(&entry, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Entry not found"})
		return
	}

	if entry.UserID != userID {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Not allowed to update"})
		return
	}

	var input models.Delibuddy
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid data format"})
		return
	}

	// Validate type if provided
	if input.Type != "" {
		input.Type = strings.ToLower(input.Type)
		if input.Type != "offer" && input.Type != "request" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Type must be 'offer' or 'request'"})
			return
		}
	}

	// Apply partial update
	updateData := map[string]interface{}{}

	if input.Type != "" {
		updateData["type"] = input.Type
	}
	if input.PriceOffered != 0 {
		updateData["price_offered"] = input.PriceOffered
	}
	if input.Location != "" {
		updateData["location"] = input.Location
	}
	if !input.Date.IsZero() {
		updateData["date"] = input.Date
	}
	if input.TimeSlot != "" {
		updateData["time_slot"] = input.TimeSlot
	}
	if input.Phone != "" {
		updateData["phone"] = input.Phone
	}

	if len(updateData) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No valid fields to update"})
		return
	}

	config.DB.Model(&entry).Updates(updateData)

	c.JSON(http.StatusOK, gin.H{"message": "Entry updated", "data": entry})
}


// Delete Delibuddy entry
func DeleteDelibuddy(c *gin.Context) {
	id := c.Param("id")
	userID := c.Query("user_id")

	var entry models.Delibuddy
	if err := config.DB.First(&entry, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Entry not found"})
		return
	}

	if entry.UserID != userID {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Not allowed to delete"})
		return
	}

	config.DB.Delete(&entry)
	c.JSON(http.StatusOK, gin.H{"message": "Entry deleted"})
}
