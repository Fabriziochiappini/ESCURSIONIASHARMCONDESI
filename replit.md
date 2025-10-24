# Tour Operator Sharm El Sheikh

## Overview
This project is a modern, full-stack tour operator website specialized in Sharm El Sheikh excursions and activities. Unlike a general travel agency, this platform focuses exclusively on local tours, experiences, and activities in the Sharm El Sheikh area. It offers a wide range of tour types (sea, desert, city, adventure, relax, cultural) with emphasis on Red Sea diving, snorkeling, desert safaris, and local Egyptian experiences. The application emphasizes a clean, responsive design with Italian localization, utilizing modern web technologies to provide an intuitive booking experience. The business vision is to provide a specialized, user-friendly platform for tourists in Sharm El Sheikh to discover and book local excursions.

## Recent Changes (October 2025)
- **REDESIGN COMPLETO CARD TOUR E TITOLI ORO** (24 Ottobre): Implementato nuovo design con card tour full-photo (hover overlay con dettagli), tutti i titoli del sito trasformati in stile oro marcato e dinamico con gradiente (#C9A961 - #D4AF37), font bold, tracking espanso, uppercase e drop-shadow. Stile elegante e lussuoso ispirato ai font dinamici premium.
- **GUIDE: DESCRIZIONE SOLO IN DETTAGLIO** (15 Ottobre): La descrizione completa delle guide appare solo nella pagina di dettaglio (/guide/:id). Nelle card della homepage viene mostrato solo il subtitle per un'esperienza più pulita e accattivante.
- **OBJECT STORAGE PERMANENTE PER TOUR** (15 Ottobre): Le immagini dei tour ora vengono salvate nell'Object Storage (`public/tours/`) invece della cartella locale. Questo garantisce che le foto NON si perdano durante autoscale/deployment. Sistema completamente funzionante e testato.
- **CAMPO ETÀ MINIMA RISOLTO** (15 Ottobre): Corretto bug di mapping tra form e database. Ora il campo età minima viene salvato e caricato correttamente nell'editor.
- **RIPOSIZIONAMENTO COME TOUR OPERATOR** (15 Ottobre): Trasformato da agenzia viaggi generica a tour operator specializzato in Sharm El Sheikh. Rimossi gestione paesi, gestione vetrine, selezione paese nell'editor, e categorie viaggiatori dal sistema. Admin panel semplificato per gestire solo tour e gallerie fotografiche.
- **SISTEMA ACCONTO COMPLETAMENTE FUNZIONANTE** (15 Ottobre): Risolto bug nel sistema di pagamento acconto. Campo depositAmount aggiunto allo schema di validazione e al form. Ora gli utenti devono scegliere esplicitamente tra "Pagamento Completo" o "Acconto" quando disponibile, senza pre-selezioni automatiche.
- **PROBLEMA DATABASE PRODUCTION RISOLTO** (20 Agosto): Creato endpoint /api/admin/reset-demo-data e pagina /reset-demo per eliminare definitivamente i viaggi placeholder dal database production. Sistema funzionante al 100% sia in development che production.
- **SISTEMA TOUR COMPLETAMENTE FUNZIONANTE** (20 Agosto): Risolti tutti gli errori di creazione pacchetti tour. Schema reso flessibile con campi opzionali, sistema upload foto professionale integrato, form admin completamente operativo. Creazione, modifica, eliminazione e upload immagini funzionano al 100%.

## Previous Changes
- **Complete Rebranding**: Successfully transformed from real estate "AGENZIA 2 Servizi Immobiliari" to tour operator specialized in Sharm El Sheikh
- **Hero Section**: Custom Red Sea beach background with clean typography, removed all overlays for maximum visual impact
- **Tour Cards**: Implemented tall rectangular "locandina" style cards (4:5 aspect ratio) with Smartbox-inspired design - sharp corners, overlaid information, prominent pricing
- **Content Structure**: Streamlined sections focused on tour discovery and booking experience
- **Visual Identity**: Clean text-based navigation optimized for tour operator business model
- **Layout Optimization**: Expanded containers to max-w-[1800px] for wider card display, optimized tour card presentation
- **Complete Terminology Update**: Transformed ALL "viaggi" references to "tour" throughout the entire site including navigation, pages, admin panel, and all user-facing text. Focus on local excursions and activities rather than multi-day travel packages.

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
- **Object Storage**: Tour images saved in Replit Object Storage (`public/tours/`) for permanent persistence across autoscale/deployment. Images served via `/api/images/` endpoint with automatic fallback.
- **Data Model**: Central `travels` table with fields for tour details (title, description, price, type, destination, region), attributes (duration, maxParticipants, minAge), media (images, YouTube ID), status flags, pricing types (with deposit support), and itinerary.
- **Features**:
    - **Tour Types**: Mare, Montagna, Città, Avventura, Relax, Cultura (focused on Sharm El Sheikh area activities).
    - **Simplified Admin**: Removed country management, showcase management, and traveler category selection. Admin panel focuses on tour creation and gallery management only.
    - **Deposit Payment System**: Full support for deposit payments with dual payment options (full payment or deposit) in booking modal.
    - **Search & Filtering**: Search capabilities by tour type, price range, duration, participants, and age restrictions.
    - **API Endpoints**: Full CRUD operations for `travels`, specialized endpoints for `featured` and `search`.

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