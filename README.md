Project Name
EventSphere

Description
Discover, create, and manage events with a clean, fast interface.

User Stories
- 404: As a guest user I can see a 404 page if I try to reach a page that does not exist so that I know it's my fault
- Signup: As a guest user I can sign up so that I can RSVP, save events, and create my own
- Login: As a user I can login so that I can access my profile and events
- Logout: As a user I can logout so no one else can use my account
- List Events: As a user I want to see events so that I can choose one to attend
- Search Events: As a user I want to search by keywords/postal code/category so that I can find relevant events
- Event Detail: As a user I can see event details so that I can decide to attend or save it
- RSVP: As a user I can RSVP/Cancel so that I can manage attendance
- Save Events: As a user I can save/unsave an event so that I can bookmark events I like
- My Events: As a user I can see Attending, Hosting, and Saved tabs so that I can manage my events
- Create Events: As a user I can create an event so that I can host and share it
- Edit/Delete Events: As a hosting user I can edit or delete my own events so that I can keep information up to date

Backlog
User profile:
- See other users' public profiles and hosted events
- Add profile picture

Geo Location:
- See events on a map
- Location-based suggestions

Advanced:
- Image uploads for event covers
- Ticket tiers and payment integration
- Notifications and email reminders

Client

Routes
- / — Homepage (Events list)
- /auth/signup — Signup form
- /auth/login — Login form
- /events — Event list
- /events/new — Create an event (protected)
- /events/:id — Event detail
- /events/:id/edit — Edit an event (protected)
- /myevents — My events (attending/hosting/saved) (protected)
- /profile — My profile (protected)
- /about — About page
- /contact — Contact page
- 404 — Not found

Pages
- Home Page (public)
- Sign up Page (anon only)
- Log in Page (anon only)
- Events List Page (public)
- Event Create Page (user only)
- Event Edit Page (user only)
- Event Detail Page (public)
- My Profile Page (user only)
- My Events Page (user only)
- About Page (public)
- Contact Page (public)
- 404 Page (public)

Components
- Event Card component
  - Input: event: object
  - Output: onSaveToggle(eventId: string, saved: boolean)
- Search component
  - Output: change(terms: { q?: string; postalCode?: string; category?: string })
- ConfirmDialog component
  - Input: open: boolean, title: string, onConfirm?(): void, onCancel(): void

IO
Services
- Auth Service
  - auth.login({ email, password })
  - auth.signup({ email, password, firstName, lastName })
  - auth.logout()
  - auth.me() // verify token
  - auth.getUser() // synchronous (from context/localStorage)

- Event Service
  - event.list({ q?, postalCode?, category?, page?, limit? })
  - event.create(data)
  - event.detail(id)
  - event.update(id, data)
  - event.delete(id)
  - event.toggleRsvp(id)
  - event.saved.list()
  - event.saved.add(id)
  - event.saved.remove(id)

Server
Models
- User model
  - email — String // required, unique, lowercase, trimmed
  - password — String // required
  - firstName — String // required, trimmed
  - lastName — String // optional, trimmed
  - prefix — String // optional, trimmed
  - jobTitle — String // optional, trimmed
  - phoneNumber — String // optional, trimmed
  - address — Object
    - line1, line2, city, country, zipcode — String // trimmed
  - timestamps enabled

- Event model
  - userId — ObjectID<User> // required, ref User
  - title — String // required, trimmed
  - description — String // required, trimmed
  - category — String // required, trimmed
  - startAt — Date // required
  - endAt — Date // required
  - price — { amount: Number (default 0), currency: String enum(EUR, USD, GBP) uppercase }
  - capacity — { number: Number min 1 required, seatsRemaining: Number required }
  - location — required when eventMode === "Inperson"
    - address — String
    - city — String // required when Inperson
    - postCode — String
    - country — String // default "Netherlands"
    - coords — { type: "Point", coordinates: [Number] required when Inperson }
  - eventMode — String enum("Online","Inperson") // required
  - coverUrl — String
  - active — Boolean // default true
  - timestamps enabled

- RSVP model
  - eventId — ObjectID<Event> // required, ref Event
  - userId — ObjectID<User> // required, ref User
  - status — String enum("reserved","cancelled") // default "reserved"
  - timestamps — reservedAt; updateAt disabled

- SavedEvent model
  - userId — ObjectID<User> // required, ref User
  - eventId — ObjectID<Event> // required, ref Event
  - active — Boolean // default true
  - unique index on (userId, eventId)
  - timestamps enabled

API Endpoints/Backend Routes (expected)
- GET /auth/verify
- POST /auth/signup
  - body: { firstName, lastName, email, password }
- POST /auth/login
  - body: { email, password }
- POST /auth/logout
  - body: (empty)

- GET /api/events
- POST /api/events
  - body: { title, description, category, startAt, endAt, price: { amount, currency }, capacity: { number, seatsRemaining }, eventMode, location?: { address, city, postCode, country, coords }, coverUrl }
- GET /api/events/:id
- PATCH /api/events/:id
  - body: partial event fields
- DELETE /api/events/:id

- GET /api/my-events/attending
- POST /api/my-events/attending/:id/rsvp/toggle

- GET /api/my-events/hosting

- GET /api/saved-events/
- POST /api/saved-events/:id
- DELETE /api/saved-events/:id

Links

Git
- [Client repository Link](https://github.com/thathsaraudari/eventsphere-frontend)
- [Server repository Link](https://github.com/thathsaraudari/eventsphere-backend)

Deploy Link
- [Deployed app URL](https://eventsphere-dev.netlify.app/)

Slides
- [Slides Link] ()
