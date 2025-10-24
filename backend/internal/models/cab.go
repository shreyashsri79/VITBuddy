package models

import "time"

type Cab struct {
	ID             uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID         string    `gorm:"not null" json:"user_id"`       // Clerk user id
	Username       string    `gorm:"not null" json:"username"`      // display name
	Gender         string    `json:"gender"`                        // gender of poster
	FemaleOnly     bool      `gorm:"default:false" json:"female_only"` // only female users can join
	FromLocation   string    `gorm:"not null" json:"from_location"` // start
	ToLocation     string    `gorm:"not null" json:"to_location"`   // destination
	Date           time.Time `gorm:"not null" json:"date"`          // ride date
	TimeSlot       string    `json:"time_slot,omitempty"`           // optional
	SeatsAvailable int       `gorm:"not null" json:"seats_available"`
	Phone          string    `gorm:"not null" json:"phone"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
