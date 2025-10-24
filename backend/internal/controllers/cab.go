package controllers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/shreyashsri79/vitbuddy-backend/internal/config"
	"github.com/shreyashsri79/vitbuddy-backend/internal/models"
)

// Create cab post
func CreateCab(c *gin.Context) {
	var input models.Cab
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Required fields
	if input.UserID == "" || input.Username == "" || input.FromLocation == "" || input.ToLocation == "" || input.Date.IsZero() || input.SeatsAvailable <= 0 || input.Phone == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing required fields"})
		return
	}

	// Female-only logic: only female users can enable
	if input.FemaleOnly && input.Gender != "female" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Only female users can enable FemaleOnly rides"})
		return
	}

	if err := config.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create cab post"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Cab post created", "data": input})
}

// Get cab posts (filters: from/to/date with female-only filtering)
func GetCabs(c *gin.Context) {
	var posts []models.Cab
	from := c.Query("from")
	to := c.Query("to")
	dateStr := c.Query("date")
	currentUserGender := c.Query("gender")

	query := config.DB.Order("created_at desc")

	if from != "" {
		query = query.Where("from_location = ?", from)
	}
	if to != "" {
		query = query.Where("to_location = ?", to)
	}
	if dateStr != "" {
		if date, err := time.Parse("2006-01-02", dateStr); err == nil {
			query = query.Where("date::date = ?", date)
		}
	}

	if currentUserGender != "female" {
		query = query.Where("female_only = false")
	}

	query.Find(&posts)
	c.JSON(http.StatusOK, posts)
}

// Update cab post (owner only)
func UpdateCab(c *gin.Context) {
	id := c.Param("id")
	userID := c.Query("user_id")

	var post models.Cab
	if err := config.DB.First(&post, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
		return
	}

	if post.UserID != userID {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Not allowed to update"})
		return
	}

	var input models.Cab
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Female-only rule during update
	if input.FemaleOnly && post.Gender != "female" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Only female users can enable FemaleOnly rides"})
		return
	}

	// Partial update fields
	config.DB.Model(&post).Updates(map[string]interface{}{
		"from_location":   input.FromLocation,
		"to_location":     input.ToLocation,
		"date":            input.Date,
		"seats_available": input.SeatsAvailable,
		"phone":           input.Phone,
		"female_only":     input.FemaleOnly,
	})

	c.JSON(http.StatusOK, gin.H{"message": "Cab post updated", "data": post})
}

// Delete cab post (owner only)
func DeleteCab(c *gin.Context) {
	id := c.Param("id")
	userID := c.Query("user_id")

	var post models.Cab
	if err := config.DB.First(&post, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
		return
	}

	if post.UserID != userID {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Not allowed to delete"})
		return
	}

	config.DB.Delete(&post)
	c.JSON(http.StatusOK, gin.H{"message": "Cab post deleted"})
}
