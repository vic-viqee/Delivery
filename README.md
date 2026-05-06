# Delivery - Grocery Delivery Platform for Embu

> Fast and reliable grocery delivery service tailored for Embu, Kenya. Built with a focus on solving the addressing problem that plagues last-mile delivery in Kenya.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.136-green?style=flat-square&logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=flat-square&logo=postgresql)
![PWA](https://img.shields.io/badge/PWA-Ready-purple?style=flat-square)

## Overview

Delivery is a mobile-first grocery delivery platform designed specifically for Embu, Kenya. Unlike generic delivery apps, we've built our platform to handle Kenya's unique addressing challenges by combining GPS coordinates, landmark identification, and photo verification to ensure riders can always find customers.

## Why Delivery?

- **Built for Kenya**: Custom addressing system that works where street addresses don't exist
- **The Embu Edge**:
  - **Stage Anchors**: Navigation starts from local Matatu/Boda stages (Dallas, Kiritiri, etc.)
  - **Voice Directions**: Record 15-second verbal instructions for riders
  - **Plus Codes**: Precise mapping for unmapped estate houses
  - **Offline Sync**: Save addresses in low-signal areas; auto-sync when back online
- **Mobile-First**: PWA installable on any device, works offline for browsing
- **Grocery-Focused**: Optimized for the grocery shopping experience (not restaurants)
- **Affordable**: Built using free tiers of services - no paid APIs needed to start
- **Scalable**: Modern tech stack that can grow with your business

## Tech Stack

| Layer | Technology | Why |
|-------|------------|-----|
| **Frontend** | Next.js 16 + React 19 | SSR, PWA support, excellent developer experience |
| **UI Components** | shadcn/ui + Tailwind CSS v4 | Beautiful, accessible components with dark/light mode |
| **State Management** | Zustand | Simple, lightweight state management with persistence |
| **Backend** | FastAPI (Python) | Fast, async, easy to extend |
| **Database** | PostgreSQL | Reliable, relational database |
| **ORM** | SQLAlchemy | Type-safe database operations |
| **Authentication** | JWT + Phone OTP | Kenya-native authentication |
| **Payments** | M-Pesa (Safaricom API) | Essential for Kenyan market |
| **Maps** | Mapbox GL JS | Interactive maps with free tier |
| **Hosting** | Vercel (frontend) + Railway (backend) | Free tiers for MVP |

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    MOBILE PWA                               │
│         (Installable, Offline-capable)                      │
└─────────────────────────────────────────────────────────────┘
                              │
                    HTTPS REST API
                              │
┌─────────────────────────────┴───────────────────────────────┐
│                      FASTAPI BACKEND                        │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│  │   Auth  │ │Products │ │ Orders  │ │Riders   │           │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘           │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────┴───────────────────────────────┐
│                    POSTGRESQL DATABASE                      │
└─────────────────────────────────────────────────────────────┘
```

## Key Features

### Customer App
- Phone-based authentication (no email required)
- Custom address system with GPS, landmarks, and photos
- Browse products by category
- Search functionality
- Persistent shopping cart
- M-Pesa payment integration
- Order tracking
- Order history

### Seller Dashboard (Future)
- Product management
- Order management
- Earnings tracking

### Rider App (Future)
- Order acceptance/rejection
- GPS navigation
- Real-time location updates
- Earnings tracking

## Project Structure

```
Delivery/
├── web/                          # Frontend (Next.js)
│   ├── src/
│   │   ├── app/                 # Next.js App Router
│   │   │   ├── (main)/         # Main layout (with navigation)
│   │   │   │   ├── page.tsx    # Home page
│   │   │   │   ├── cart/       # Shopping cart
│   │   │   │   ├── checkout/   # Checkout flow
│   │   │   │   ├── orders/     # Order history
│   │   │   │   ├── addresses/  # Address management
│   │   │   │   ├── search/     # Product search
│   │   │   │   └── account/    # User account
│   │   │   ├── (auth)/        # Auth pages
│   │   │   │   ├── login/      # Login page
│   │   │   │   └── register/   # Registration page
│   │   │   └── layout.tsx     # Root layout
│   │   ├── components/         # React components
│   │   │   ├── ui/            # shadcn/ui components
│   │   │   ├── layout/        # Layout components
│   │   │   ├── address/       # Address form & cards
│   │   │   └── cart/          # Cart components
│   │   ├── stores/            # Zustand stores
│   │   │   ├── cart.ts        # Cart state
│   │   │   └── auth.ts        # Auth & location state
│   │   ├── lib/               # Utilities
│   │   │   └── api.ts         # API client
│   │   └── types/             # TypeScript types
│   ├── public/                # Static assets
│   │   ├── manifest.json     # PWA manifest
│   │   └── icons/            # App icons
│   └── backend/              # Backend (FastAPI)
│       └── app/
│           ├── main.py       # FastAPI app entry
│           ├── api/          # API routes
│           │   └── endpoints/  # Auth, products, orders, etc.
│           ├── core/         # Config, DB, security
│           ├── models/       # SQLAlchemy models
│           └── schemas/      # Pydantic schemas
���── docs/                     # Documentation
```

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- PostgreSQL 14+
- npm or yarn

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Delivery
```

### 2. Set Up PostgreSQL

```bash
# Install PostgreSQL (if not installed)
# On Ubuntu/Debian:
sudo apt update
sudo apt install postgresql postgresql-contrib

# Create database
sudo -u postgres createdb delivery

# Create user (optional, or use default postgres user)
sudo -u postgres createuser -P delivery_user
# Enter password when prompted
```

### 3. Set Up Backend

```bash
cd web/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn sqlalchemy pydantic python-dotenv python-jose passlib bcrypt psycopg2-binary pydantic-settings

# Copy environment file
cp .env.example .env

# Edit .env with your settings
nano .env
```

Edit `.env` with your database connection string:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/delivery
SECRET_KEY=your-very-long-secret-key-here
```

### 4. Set Up Frontend

```bash
cd web

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Edit .env.local with your settings
```

### 5. Run the Backend

```bash
cd web/backend
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at http://localhost:8000

### 6. Run the Frontend

```bash
cd web
npm run dev
```

The app will be available at http://localhost:3000

## Testing

### API Health Check

```bash
curl http://localhost:8000/api/health
# Response: {"status":"healthy","service":"Delivery API"}
```

### Frontend

1. Open http://localhost:3000
2. You should see the home page with demo products
3. Try adding items to cart
4. Try the address form

### Running Tests

```bash
# Frontend tests (when added)
cd web
npm test

# Backend tests (when added)
cd web/backend
pytest
```

## Environment Variables

### Backend (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `SECRET_KEY` | JWT signing key | Yes |
| `M_PESA_CONSUMER_KEY` | Safaricom API key | No (for production) |
| `M_PESA_CONSUMER_SECRET` | Safaricom API secret | No (for production) |
| `M_PESA_SHORTCODE` | Business shortcode | No (for production) |
| `MAPBOX_ACCESS_TOKEN` | Mapbox API token | No (for production) |

### Frontend (.env.local)

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Mapbox public token | No (for production) |

## Deployment

### Frontend (Vercel)

```bash
cd web
vercel
```

### Backend (Railway/Render/Heroku)

1. Push your backend code to GitHub
2. Connect to Railway/Render
3. Set environment variables
4. Deploy

### Database (Supabase/Railway)

1. Create PostgreSQL instance
2. Get connection string
3. Set `DATABASE_URL` in backend

## Troubleshooting

### "Module not found" errors
```bash
cd web
npm install
```

### Database connection errors
- Ensure PostgreSQL is running
- Check `DATABASE_URL` format
- Verify credentials

### Build errors
```bash
cd web
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary and for demonstration purposes.

## Support

For questions or support, please reach out to the development team.

---

Built with ❤️ for Embu, Kenya 🇰🇪# Delivery
# Delivery
