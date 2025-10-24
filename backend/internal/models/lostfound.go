package models

import "time"

const (
	CategoryLost  = "lost"
	CategoryFound = "found"
)

type LostFound struct {
	ID          uint    `gorm:"primaryKey;autoIncrement" json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Category    string    `gorm:"type:varchar(10);check:category IN ('lost','found');not null" json:"category"`
	ImageURL    string    `json:"image_url"`
	Location    string    `json:"location"`
	Phone       string    `gorm:"not null" json:"phone"`
	OwnerID     string    `gorm:"not null" json:"owner_id"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
