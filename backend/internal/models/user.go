package models

import "time"

type User struct {
	ID        string    `gorm:"primaryKey" json:"id"` // Clerk User ID
	Email     string    `gorm:"unique;not null" json:"email"`
	Username  string    `gorm:"unique" json:"username"`
	AvatarURL string    `json:"avatar_url"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
