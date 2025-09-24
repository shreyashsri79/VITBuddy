# VIT Buddy

**Centralized Campus Connect App**

---

## Overview

VIT Buddy is a centralized campus connect mobile application designed to streamline campus life for students and faculty. It integrates multiple campus services into a single platform, improving accessibility, efficiency, and user experience.

---

## Features

* **Cab Services:** Request and track rides within or around campus.
* **Food Ordering:** Browse food outlets, place orders, and track delivery.
* **Faculty Information:** Access faculty details including cabin numbers.
* **Marketplace:** Buy, sell, or exchange items within the campus community.
* **Lost & Found:** Report and search for lost items.
* **Mess Menu Viewer:** View daily and weekly mess menus.

---

## Future Enhancements

* Takeout ordering from campus food outlets.
* Community-driven platform for announcements and discussions (Reddit-style).

---

## Tech Stack

* **Frontend:** React Native (Mobile App), Web Interface (Future)
* **Backend:** Node.js + Express
* **Database:** MongoDB (Primary + Replica), Redis (Cache)
* **Data Sources:** Google Sheets (Faculty Info + Mess Menu) with Apps Script triggers

---

## System Architecture

VIT Buddy follows a layered architecture:

1. **Users:** Students, Faculty, Admins
2. **Frontend:** Mobile app & future web interface
3. **API Gateway / Load Balancer:** Handles requests from frontend
4. **Backend:** API Server & Google Sheets Coordinator
5. **Database Layer:** MongoDB Primary/Replica + Redis cache
6. **Other Services:** Cab, Food Ordering, Marketplace, Lost & Found

---

## Workflow

* **Update Flow:** Faculty/Admin update Google Sheets → Apps Script triggers backend → Backend updates DB + invalidates Redis cache.
* **Read Flow:** Student requests data → Frontend → API Gateway → Backend → Redis (cache hit) or MongoDB Replica (cache miss) → Frontend.
* **Other Services:** Cab, Food Ordering, Marketplace, Lost & Found interact directly with the backend.

---

## Getting Started

1. Clone the repository.
2. Install dependencies for frontend and backend.
3. Configure environment variables (DB connection, API keys).
4. Run backend server.
5. Run frontend app (React Native / Web).

---

## Contributing

Contributions are welcome! Please submit pull requests or open issues for suggestions and improvements.

---

## License

MIT 
