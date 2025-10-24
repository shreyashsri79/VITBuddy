package controllers

import (
	"context"
	"net/http"

	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/gin-gonic/gin"
	"github.com/shreyashsri79/vitbuddy-backend/internal/config"
)

// Generic upload endpoint for images
func UploadImage(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file is received"})
		return
	}

	src, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cannot open file"})
		return
	}
	defer src.Close()

	resp, err := config.CLD.Upload.Upload(context.Background(), src, uploader.UploadParams{
		Folder: "vitbuddy",
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Upload failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":  "Upload successful",
		"imageURL": resp.SecureURL,
	})
}
