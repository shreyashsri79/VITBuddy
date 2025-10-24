package config

import (
	"fmt"
	"log"
	"os"

	"github.com/shreyashsri79/vitbuddy-backend/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() {

	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=require",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("❌ Failed to connect to database:", err)
	}

	DB = db

	err = db.AutoMigrate(
		&models.User{},
		&models.LostFound{},
		&models.MarketplaceItem{},
		&models.Delibuddy{},
		&models.Cab{},
	)
	if err != nil {
		log.Fatal("❌ Failed to migrate database:", err)
	}

	log.Println("✅ Connected to Amazon RDS PostgreSQL!")
}
