package main

import (
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/shreyashsri79/vitbuddy-backend/internal/config"
	"github.com/shreyashsri79/vitbuddy-backend/internal/controllers"
)

func main() {

	err := godotenv.Load()
	if err != nil {
		panic(err)
	}

	config.InitDB()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	r := gin.Default()

	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "server is running",
		})
	})

	r.GET("/users/:id", controllers.GetUserByID)
	r.POST("/users", controllers.CreateUser)
	r.PUT("/users/:id", controllers.UpdateUser)

	r.POST("/lostfound", controllers.CreateLostFound)
	r.GET("/lostfound", controllers.GetLostFound)
	r.PUT("/lostfound/:id", controllers.UpdateLostFound)
	r.DELETE("/lostfound/:id", controllers.DeleteLostFound)

	r.POST("/marketplace", controllers.CreateMarketplaceItem)
	r.GET("/marketplace", controllers.GetMarketplaceItems)
	r.PUT("/marketplace/:id", controllers.UpdateMarketplaceItem)
	r.DELETE("/marketplace/:id", controllers.DeleteMarketplaceItem)

	r.POST("/delibuddy", controllers.CreateDelibuddy)
	r.GET("/delibuddy", controllers.GetDelibuddy)
	r.PUT("/delibuddy/:id", controllers.UpdateDelibuddy)
	r.DELETE("/delibuddy/:id", controllers.DeleteDelibuddy)

	r.POST("/cab", controllers.CreateCab)
	r.GET("/cab", controllers.GetCabs)
	r.PUT("/cab/:id", controllers.UpdateCab)
	r.DELETE("/cab/:id", controllers.DeleteCab)


	r.POST("/upload", controllers.UploadImage)

	r.Run(":" + port)

}
