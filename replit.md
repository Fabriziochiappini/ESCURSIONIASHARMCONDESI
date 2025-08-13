# Agenzia Viaggi - Travel Agency Platform

## Overview
This project is a modern, full-stack travel agency web application designed to be a comprehensive platform for browsing, searching, and booking various travel packages. It aims to offer a wide range of travel types (sea, mountain, city, adventure, relax, cultural) and cater to different categories of travelers (individuals, couples, families, groups). The application emphasizes a clean, responsive design with Italian localization, utilizing modern web technologies to provide an intuitive user experience. The business vision is to provide a user-friendly and efficient online presence for a travel agency, attracting a broad customer base and streamlining the travel booking process.

## Recent Changes (August 2025)
- **Complete Rebranding**: Successfully transformed from real estate "AGENZIA 2 Servizi Immobiliari" to travel agency "PROPATO TRAVEL"
- **Hero Section**: Custom tropical beach background with clean typography, removed all overlays for maximum visual impact
- **Travel Cards**: Implemented tall rectangular "locandina" style cards (4:5 aspect ratio) with Smartbox-inspired design - sharp corners, overlaid information, prominent pricing
- **Content Structure**: Replaced complex situations section with statistics banner while maintaining service cards
- **Visual Identity**: Complete removal of old logos and branding, clean text-based navigation
- **Layout Optimization**: Expanded containers to max-w-[1800px] for wider card display, 10 travel cards in 2 rows of 5 columns
- **Section Background**: Changed travels section from dark to white background with adapted text colors for better readability

## User Preferences
Preferred communication style: Simple, everyday language.
Design preferences: Full-width sections, solid/hard style, impactful visual elements.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter
- **State Management**: TanStack Query
- **UI**: Tailwind CSS with shadcn/ui components
- **Build Tool**: Vite
- **Form Handling**: React Hook Form with Zod validation
- **UI/UX Decisions**:
    - **Color Palette**: Primary (Navy Blue: #1e3a5f), Secondary (Anthracite Gray: #2c3e50), Background (Pure White: #ffffff), Luxury (Champagne Gold: #d4af37), Growth (Sage Green: #87a96b), Balance (Light Gray: #f8f9fa).
    - **Design Approach**: Clean, elegant design with a white background, modern navigation, glassmorphism effects for key sections, and minimalist property/travel cards. Emphasis on professional aesthetic and fluid user experience.
    - **Typography**: Elegant fonts with lighter font-weights for main titles.
    - **Image Handling**: Professional image gallery with client-side compression (WebP, max 2MB), responsive srcset, progressive blur placeholders, and optimized for performance (e.g., `loading="eager"`, `decoding="sync"`). Support for virtual scrolling for large image sets.
    - **Travel Cards**: Tall rectangular "locandina" style cards (3:4 aspect ratio) with full background image coverage, overlaid text elements, sharp corners, and Smartbox-inspired layout with destination info, badges, titles, and prominent pricing.
    - **Localization**: Full Italian localization.
    - **Communication**: Integrated WhatsApp buttons for direct inquiries on travel pages and cards.

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Drizzle ORM (using Neon Database serverless provider)
- **API Design**: RESTful API with JSON responses
- **Development**: tsx for TypeScript execution
- **Project Structure**: Separated `client/` for frontend, `server/` for backend, and `shared/` for common types/schemas.
- **Data Model**: Central `travels` table with fields for travel details (title, description, price, type, destination, country, region), attributes (duration, maxParticipants, minAge), media (images, YouTube ID), agent info, status flags, pricing types, included/excluded services, and itinerary.
- **Features**:
    - **Travel Types**: Mare, Montagna, Città, Avventura, Relax, Cultura.
    - **Travel Categories**: Singolo, Coppia, Famiglia, Gruppo.
    - **Search & Filtering**: Comprehensive search capabilities by country, travel type, category, price range, duration, participants, and age restrictions.
    - **API Endpoints**: Full CRUD operations for `travels`, specialized endpoints for `featured` and `search`, and retrieval of `countries` and `destinations`.

## External Dependencies

### Frontend
- **UI Components**: Radix UI primitives via shadcn/ui
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Carousel**: Embla Carousel

### Backend
- **Database Connection**: @neondatabase/serverless
- **ORM**: drizzle-orm with drizzle-zod
- **Session Management**: connect-pg-simple (for PostgreSQL session storage)
- **Image Processing**: Sharp (server-side image compression)

### Development & Deployment
- **TypeScript**: Used across the stack for type safety.
- **Bundling**: Vite (frontend), esbuild (backend).
- **Deployment Platform**: Optimized for Replit deployment with specific Replit plugins and cloud storage integration.