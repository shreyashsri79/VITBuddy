package models

import "time"

const (
	DelibuddyTypeRequest = "request"
	DelibuddyTypeOffer   = "offer"
)

type Delibuddy struct {
	ID           uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID       string    `gorm:"not null" json:"user_id"`         // Clerk user id
	Username     string    `gorm:"not null" json:"username"`        // required
	Type         string    `gorm:"type:varchar(10);check:type IN ('request','offer');not null" json:"type"`
	Location     string    `gorm:"not null" json:"location"`        // required for both types
	Date         time.Time `gorm:"not null" json:"date"`            // required for both types
	TimeSlot     string    `json:"time_slot,omitempty"`             // optional
	PriceOffered float64   `json:"price_offered,omitempty"`         // only for offer
	Phone        string    `gorm:"not null" json:"phone"`           // required

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
