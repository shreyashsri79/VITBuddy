package controllers

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/shreyashsri79/vitbuddy-backend/internal/config"
	"github.com/shreyashsri79/vitbuddy-backend/internal/models"
)

// Validate user input
func validateUserInput(user *models.User) string {
	if strings.TrimSpace(user.Email) == "" || !strings.Contains(user.Email, "@") {
		return "Valid email is required"
	}
	if strings.TrimSpace(user.Username) == "" {
		return "Username is required"
	}
	return ""
}

// ✅ Create user
func CreateUser(c *gin.Context) {
	var input models.User

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON format"})
		return
	}

	// Input validation
	if msg := validateUserInput(&input); msg != "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": msg})
		return
	}

	// Prevent duplicate users
	var existing models.User
	if err := config.DB.Where("email = ? OR username = ?", input.Email, input.Username).First(&existing).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Email or username already taken"})
		return
	}

	if err := config.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "User created", "data": input})
}

// ✅ Get user by ID
func GetUserByID(c *gin.Context) {
	id := c.Param("id")
	var user models.User

	if err := config.DB.First(&user, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, user)
}

// ✅ Update user
func UpdateUser(c *gin.Context) {
	id := c.Param("id")
	var user models.User

	// Find existing user
	if err := config.DB.First(&user, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Bind json safely into map
	var input map[string]interface{}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
		return
	}

	// Block sensitive fields from being modified
	delete(input, "id")
	delete(input, "created_at")

	// If email is being updated, check duplicates
	if newEmail, ok := input["email"]; ok {
		var check models.User
		if err := config.DB.Where("email = ?", newEmail).First(&check).Error; err == nil && check.ID != id {
			c.JSON(http.StatusConflict, gin.H{"error": "Email already in use"})
			return
		}
	}

	// If username is being updated, check duplicates
	if newUsername, ok := input["username"]; ok {
		var check models.User
		if err := config.DB.Where("username = ?", newUsername).First(&check).Error; err == nil && check.ID != id {
			c.JSON(http.StatusConflict, gin.H{"error": "Username already in use"})
			return
		}
	}

	// Update in DB
	if err := config.DB.Model(&user).Updates(input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User updated", "data": user})
}
