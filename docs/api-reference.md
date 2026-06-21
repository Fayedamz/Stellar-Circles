# Stellar Circles — API Reference

Base URL: `http://localhost:4000/api`

All authenticated endpoints require: `Authorization: Bearer <jwt_token>`

---

## Auth

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | — | Create a new user account |
| POST | `/auth/login` | — | Login and receive JWT token |
| GET | `/auth/me` | ✅ | Get current authenticated user |

### POST /auth/register
```json
{
  "username": "alice",
  "email": "alice@example.com",
  "password": "securepassword",
  "stellarAddress": "G..." // optional
}
```

### POST /auth/login
```json
{ "email": "alice@example.com", "password": "securepassword" }
```
Response: `{ "token": "...", "user": { ... } }`

---

## Circles

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/circles` | — | List/search circles (supports `?type=LEARNING&search=web3`) |
| POST | `/circles` | ✅ | Create a new circle |
| GET | `/circles/:id` | — | Get circle details |
| PUT | `/circles/:id` | ✅ | Update circle (admin only) |
| POST | `/circles/:id/join` | ✅ | Join a circle |
| POST | `/circles/:id/leave` | ✅ | Leave a circle |
| GET | `/circles/:id/members` | — | List circle members |

---

## Activities

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/circles/:id/activities` | ✅ | Log an activity |
| GET | `/circles/:id/activities` | — | Get activity feed |

### POST /circles/:id/activities
```json
{
  "type": "SESSION_ATTENDED",
  "description": "Attended weekly Soroban workshop",
  "metadata": { "duration_minutes": 60 },
  "anchorOnStellar": false
}
```

---

## Influence

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/circles/:id/influence` | — | Circle leaderboard |
| GET | `/circles/:id/my-influence` | ✅ | Your influence in this circle |
| GET | `/users/:id/influence` | — | User's influence across all circles |

---

## Decisions

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/circles/:id/decisions` | — | List decisions in a circle |
| POST | `/circles/:id/decisions` | ✅ | Create a proposal |
| GET | `/decisions/:id/results` | — | Get vote results |
| POST | `/decisions/:id/vote` | ✅ | Cast a vote |

### POST /decisions/:id/vote
```json
{ "choice": "FOR" }   // FOR | AGAINST | ABSTAIN
```

---

## Users

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/users/:id/profile` | — | Get public user profile |
| GET | `/users/:id/influence` | — | User's influence across circles |

---

## WebSocket

Connect: `ws://localhost:4000/ws?token=<jwt>`

Subscribe to a circle channel:
```json
{ "type": "subscribe", "circleId": "<uuid>" }
```

Events you'll receive:
- `circle:activity_logged`
- `circle:member_joined`
- `circle:member_left`
- `circle:decision_created`
- `circle:vote_cast`
- `influence:updated`
