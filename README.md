# 🎉 **EventSphere**  
> _Discover, create, and manage events with a clean, fast interface._

🔗 **Live App** → [https://eventsphere-dev.netlify.app](https://eventsphere-dev.netlify.app)  
💻 **Frontend Repo** → [eventsphere-frontend](https://github.com/thathsaraudari/eventsphere-frontend)  
🛠️ **Backend Repo** → [eventsphere-backend](https://github.com/thathsaraudari/eventsphere-backend)  
📝 **Slides** → [Slides Link]() (Coming soon)

---

## 📌 **Table of Contents**
- [✨ Description](#-description)  
- [🧑‍💻 User Stories](#-user-stories)  
- [📝 Backlog](#-backlog)  
- [🧭 Client](#-client)  
- [🧰 Components](#-components)  
- [🔌 Services (IO)](#-services-io)  
- [🗄️ Server](#%EF%B8%8F-server)  
- [🌐 API Endpoints](#-api-endpointsbackend-routes-expected)  
- [🔗 Links](#-links)

---

## ✨ **Description**

EventSphere is a full-stack web app where users can:  
- 🔍 **Discover** events nearby or online  
- ✍️ **Create** & host their own events  
- 📅 **RSVP** and **save** their favorites  
- 🧭 Explore through a clean, responsive UI

---

## 🧑‍💻 **User Stories**

| Feature              | As a...        | I can...                                                                                   | So that...                                           |
|-----------------------|---------------|---------------------------------------------------------------------------------------------|-----------------------------------------------------|
| 🚫 404 Page           | Guest         | See a 404 page for unknown URLs                                                             | I know I mistyped                                  |
| 📝 Signup            | Guest         | Create an account                                                                          | RSVP, save, and create events                       |
| 🔐 Login              | User          | Log into my account                                                                        | Access my profile and events                        |
| 🚪 Logout             | User          | Log out                                                                                     | No one else can use my account                      |
| 📜 List Events        | User          | See all events                                                                             | I can pick one to attend                            |
| 🔎 Search Events      | User          | Search by keywords, postal code, category                                                  | Find relevant events                                |
| 📝 Event Detail       | User          | View full event info                                                                      | Decide whether to attend                            |
| 📅 RSVP               | User          | RSVP or cancel                                                                            | Manage my attendance                                |
| 💾 Save Events       | User          | Save/unsave events                                                                        | Bookmark interesting events                         |
| 🧍 My Events         | User          | View attending, hosting, saved tabs                                                        | Manage my events easily                             |
| 🪄 Create Events      | User (host)   | Create new events                                                                         | Host & share them                                   |
| ✏️ Edit/Delete Events | User (host)   | Edit or delete my events                                                                  | Keep info up to date                                |

---

## 📝 **Backlog**

### 👤 **User Profile**
- View others’ public profiles & hosted events  
- Add profile picture

### 🗺️ **Geo Location**
- Show events on a map  
- Location-based suggestions

### 🚀 **Advanced**
- Event cover image uploads  
- Ticket tiers & payments  
- Notifications & email reminders

---

## 🧭 **Client**

### 🛣️ Routes

| Route | Page | Access |
|-------|------|--------|
| `/` | 🏠 Homepage (Events list) | Public |
| `/auth/signup` | 📝 Signup | Guest only |
| `/auth/login` | 🔐 Login | Guest only |
| `/events` | 📜 Event List | Public |
| `/events/new` | 🪄 Create Event | Protected |
| `/events/:id` | 📝 Event Detail | Public |
| `/events/:id/edit` | ✏️ Edit Event | Protected |
| `/myevents` | 📅 My Events | Protected |
| `/profile` | 👤 My Profile | Protected |
| `/about` | ℹ️ About | Public |
| `/contact` | 📬 Contact | Public |
| `*` | 🚫 404 | Public |

---

## 🧰 **Components**

| Component | Description |
|----------|-------------|
| 🪪 **EventCard** | Displays event info.<br>**Input:** `event` object<br>**Output:** `onSaveToggle(eventId, saved)` |
| 🔍 **Search** | Filters events.<br>**Output:** `change({ q?, postalCode?, category? })` |
| ⚠️ **ConfirmDialog** | Reusable confirmation modal.<br>**Input:** `open`, `title`, `onConfirm()`, `onCancel()` |

---

## 🔌 **Services (IO)**

### 🔐 Auth Service
```ts
auth.login({ email, password })
auth.signup({ email, password, firstName, lastName })
auth.logout()
auth.me()          // verify token
auth.getUser()     // from context/localStorage
```

### 📅 Event Service
```ts
event.list({ q?, postalCode?, category?, page?, limit? })
event.create(data)
event.detail(id)
event.update(id, data)
event.delete(id)
event.toggleRsvp(id)
event.saved.list()
event.saved.add(id)
event.saved.remove(id)
```

---

## 🗄️ **Server**

### 👤 **User Model**
```ts
email, password, firstName, lastName, prefix, jobTitle, phoneNumber
address: { line1, line2, city, country, zipcode }
timestamps: true
```

### 📅 **Event Model**
```ts
userId (ref User)
title, description, category
startAt, endAt
price: { amount, currency }
capacity: { number, seatsRemaining }
location (when Inperson): address, city, postCode, country, coords
eventMode: "Online" | "Inperson"
coverUrl, active, timestamps
```

### 📝 RSVP Model
```ts
eventId (ref Event)
userId (ref User)
status: "reserved" | "cancelled"
timestamps
```

### 💾 SavedEvent Model
```ts
userId, eventId
active: Boolean (default true)
unique index on (userId, eventId)
timestamps
```

---

## 🌐 **API Endpoints/Backend Routes (Expected)**

### 🔐 **Auth**
- `GET /auth/verify`  
- `POST /auth/signup` — `{ firstName, lastName, email, password }`  
- `POST /auth/login` — `{ email, password }`  
- `POST /auth/logout`

### 📅 **Events**
- `GET /api/events`  
- `POST /api/events`  
- `GET /api/events/:id`  
- `PATCH /api/events/:id`  
- `DELETE /api/events/:id`

### 🙋 **My Events**
- `GET /api/my-events/attending`  
- `POST /api/my-events/attending/:id/rsvp/toggle`  
- `GET /api/my-events/hosting`

### 💾 **Saved Events**
- `GET /api/saved-events`  
- `POST /api/saved-events/:id`  
- `DELETE /api/saved-events/:id`

---

## 🔗 **Links**

- 🌐 **Live App** — [https://eventsphere-dev.netlify.app](https://eventsphere-dev.netlify.app)  
- 💻 **Frontend Repo** — [eventsphere-frontend](https://github.com/thathsaraudari/eventsphere-frontend)  
- 🛠️ **Backend Repo** — [eventsphere-backend](https://github.com/thathsaraudari/eventsphere-backend)  
- 📝 **Slides** — [Slides Link]() (Coming soon)
