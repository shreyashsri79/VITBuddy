package models

import "time"

type MarketplaceItem struct {
	ID          uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	Title       string    `json:"title"`       
	Description string    `json:"description"` 
	Price       float64   `gorm:"not null" json:"price"`
	ImageURL    string    `json:"image_url"`
	Phone       string    `gorm:"not null" json:"phone"`
	OwnerID     string    `gorm:"not null" json:"owner_id"` 
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
