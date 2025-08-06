# Immobiliare Acireale - Real Estate Platform

## Overview

This is a modern full-stack real estate web application built for the Acireale area in Sicily, Italy. The application provides a platform for browsing, searching, and viewing property listings with support for sales, rentals, and vacation rentals. It features a clean, responsive design with Italian localization and modern web technologies.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **UI Framework**: Tailwind CSS with shadcn/ui component library
- **Build Tool**: Vite for development and production builds
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful API with JSON responses
- **Development**: tsx for TypeScript execution in development

### Project Structure
- `client/` - React frontend application
- `server/` - Express.js backend server
- `shared/` - Shared TypeScript schemas and types
- `migrations/` - Database migration files (Drizzle)

## Key Components

### Database Schema
The application uses a single main table `properties` with the following key fields:
- Property details (title, description, price, type, location)
- Physical attributes (bedrooms, bathrooms, area)
- Media (images array, YouTube video ID)
- Agent information (name, phone, email, image)
- Status flags (featured, available)
- Pricing types (total, monthly, nightly)

### Property Types
- **Vendita** (Sales) - Properties for purchase
- **Affitto** (Rentals) - Properties for rent
- **Casa Vacanza** (Vacation Rentals) - Short-term vacation properties

### Search and Filtering
- Municipality-based location filtering
- Property type filtering
- Price range filtering
- Bedroom/bathroom count filtering
- Area size filtering

### User Interface
- Hero section with property search
- Property grid with responsive cards
- Detailed property pages with image galleries
- Contact forms for inquiries
- Mobile-responsive navigation

## Data Flow

1. **Property Display**: Frontend fetches property data from `/api/properties` endpoints
2. **Search**: User searches trigger API calls to `/api/properties/search` with query parameters
3. **Property Details**: Individual property pages load data from `/api/properties/:id`
4. **Featured Properties**: Homepage displays featured properties from `/api/properties/featured`

### API Endpoints
- `GET /api/properties` - Get all properties
- `GET /api/properties/featured` - Get featured properties only
- `GET /api/properties/search` - Search properties with filters
- `GET /api/properties/:id` - Get single property by ID

## External Dependencies

### Frontend Dependencies
- **UI Components**: Extensive use of Radix UI primitives through shadcn/ui
- **Icons**: Lucide React for consistent iconography
- **Date Handling**: date-fns for date manipulation
- **Carousel**: Embla Carousel for image galleries

### Backend Dependencies
- **Database**: @neondatabase/serverless for PostgreSQL connection
- **ORM**: drizzle-orm with drizzle-zod for schema validation
- **Session Management**: connect-pg-simple for PostgreSQL session storage

### Development Tools
- **TypeScript**: Full type safety across frontend and backend
- **ESBuild**: Production bundling for server code
- **Replit Integration**: Special Replit plugins for development environment

## Deployment Strategy

### Development
- Uses tsx for TypeScript execution
- Vite dev server for hot module replacement
- Development runs on port 5000

### Production Build
1. Frontend: `vite build` creates optimized static files in `dist/public`
2. Backend: `esbuild` bundles server code to `dist/index.js`
3. Database: `drizzle-kit push` applies schema changes

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **NODE_ENV**: Environment flag (development/production)
- **REPL_ID**: Replit-specific environment detection

### Hosting
- Configured for Replit deployment with autoscaling
- Static files served from `dist/public`
- API routes handled by Express server
- PostgreSQL database hosted on Neon

## Changelog

- August 6, 2025: Ottimizzata galleria foto per caricamento immediato e professionale
  * ELIMINATI MICROFLASH: Rimossi lazy loading e intersection observers che causavano scatti visivi
  * CARICAMENTO IMMEDIATO: loading="eager" e decoding="sync" per foto istantanee come siti moderni
  * DIMENSIONI OTTIMALI: Foto ridimensionate al 80% viewport, perfettamente centrate
  * UX FLUIDA: Galleria fullscreen elegante senza ritardi o artifacts di caricamento
  * DESIGN PULITO: Componente SimpleImage semplificato, controlli intuitivi, navigazione tastiera
  * PERFORMANCE: Eliminata complessità virtual scrolling, focus su velocità e fluidità
- August 6, 2025: Footer aggiornato con informazioni complete agenzia e credit sviluppatore
  * AGENZIA 2 - Via San Girolamo, 20 - P.I.04505220873
  * Credit "Realizzato da WEBPROITALIA" con link https://webproitalia.com
- August 6, 2025: Sistema WhatsApp integrato completamente per ogni proprietà
  * PULSANTE SPECIFICO: "INVIA RICHIESTA" WhatsApp personalizzato per ogni singola proprietà
  * MESSAGGI PERSONALIZZATI: Ogni proprietà genera messaggio WhatsApp con dettagli specifici (titolo, prezzo, ubicazione, caratteristiche)
  * CONTATTI RIORGANIZZATI: Pulsanti principali "CHIAMA" + "INVIA RICHIESTA" nella pagina dettagli proprietà
  * WHATSAPP VELOCE: Pulsante WhatsApp rapido aggiunto alle property cards per contatti diretti dalle liste
  * LAYOUT OTTIMIZZATO: Email spostata sotto i pulsanti principali, rimosso "Chiama Ora" duplicato
  * NUMERO AGENZIA: Configurato +39 346 800 3234 come numero WhatsApp AGENZIA 2
  * DUE MODALITÀ: Messaggio completo (pagina dettagli) e messaggio veloce (dalle card)
  * FUNZIONALITÀ COMPLETA: Ogni proprietà ha ora contatto WhatsApp immediato e specifico
- August 6, 2025: Sistema foto immobili COMPLETAMENTE rivoluzionato - standard enterprise
  * PERFORMANCE: Compressione client-side con browser-image-compression (WebP, max 2MB)
  * RESPONSIVE: Immagini responsive con srcset per mobile/tablet/desktop (400w-2048w)
  * PROGRESSIVE: Blur placeholder SVG per caricamento progressivo professionale
  * VIRTUAL SCROLLING: Gallery ottimizzata per 100+ immagini senza rallentamenti
  * FORMATO MODERNO: WebP automatico con fallback JPEG per compatibilità totale
  * LAZY LOADING: Intersection Observer per caricamento immagini on-demand
  * CORE WEB VITALS: Ottimizzazioni complete per ranking Google
  * UX WORDPRESS: Caricamento immediato senza chiudere finestre - workflow naturale
  * DRAG & DROP: Riordinamento intuitivo con @dnd-kit e grip handle (⋮⋮)
  * INCREMENTALE: Nuove foto si aggiungono senza cancellare esistenti
  * DOPPIA COMPRESSIONE: Client-side (browser-image-compression) + server (Sharp)
  * OBJECT STORAGE: Persistenza garantita con Replit Cloud Storage
  * FEEDBACK: Progress real-time con toast notification per operazioni lunghe
  * SICUREZZA: Messaggi chiari "foto esistenti mantenute" + rollback automatico
- August 5, 2025: Risolti problemi caricamento multiplo foto immobili
  * Aumentati limiti server da 20 a 30 foto per proprietà
  * Ottimizzata gestione payload fino a 50MB per upload batch
  * Implementato timeout esteso (5 minuti) per caricamenti grandi
  * Aggiunto processing parallelo in batch da 5 immagini per performance
  * Sistema Object Storage permanente: foto non spariscono più con autoscale
  * Migrazione completata: 7 immagini esistenti spostate su cloud storage
  * Interfaccia admin aggiornata con feedback progressivo per upload multipli
  * Supporto completo WordPress-level per gestione foto immobili professionali
- January 31, 2025: Implementata conformità GDPR completa per agenzia immobiliare
  * Pagina Privacy Policy dettagliata con informazioni specifiche settore immobiliare
  * Cookie Banner minimalista con gestione preferenze avanzata
  * Design coerente con l'identità visiva del sito (colori brand, tipografia)
  * Accordion espandibile per sezioni Privacy Policy (dati raccolti, finalità, diritti)
  * Cookie categorizzati: necessari, analitici, marketing con controllo granulare
  * Footer aggiornato con link Privacy Policy e Cookie Policy
  * Navigazione estesa con sezione Privacy accessibile
  * Sistema di salvataggio preferenze cookie in localStorage
  * Informazioni titolare del trattamento (AGENZIA 2 - Geometra Antonio Cannavò)
  * Base giuridica specifica per servizi immobiliari e comunicazioni commerciali
- July 29, 2025: Implementati nuovi tipi di proprietà specifici
  * VILLA, APPARTAMENTO, VILLA SINGOLA, CASA SINGOLA CON TERRENO, RUSTICI E TERRENI
  * Aggiunto campo propertyType al database schema
  * Filtri di ricerca aggiornati con nuove categorie di proprietà
  * Property cards mostrano ora sia tipo contratto che categoria proprietà
  * Database aggiornato con categorizzazione completa proprietà esistenti
- July 29, 2025: Implementata palette colori brand professionale per agenzia immobiliare di alto livello
  * Primary: Blu Navy (#1e3a5f) - 40% dell'uso per trasmettere autorità e fiducia
  * Secondary: Grigio Antracite (#2c3e50) - 30% dell'uso per competenza professionale
  * Background: Bianco Puro (#ffffff) - 20% dell'uso per pulizia e modernità
  * Luxury: Oro Champagne (#d4af37) - 5% dell'uso per accenti di lusso
  * Growth: Verde Salvia (#87a96b) - 3% dell'uso per pulsanti call-to-action
  * Balance: Grigio Chiaro (#f8f9fa) - 2% dell'uso per sfondi delicati
  * Aggiornate tutte le variabili CSS e configurazione Tailwind
  * Pulsante "CONSULENZA GRATUITA" aggiornato con colore Growth per maggior impatto
- July 26, 2025: Design overhaul completo ispirato a immobiliaremichelangelo.it
  * Implementato design elegante con sfondo bianco pulito per tutto il sito
  * Sfondo scuro mantenuto SOLO per la sezione proprietà come richiesto
  * Navigazione moderna pulita con dropdown eleganti e sfondo bianco
  * Hero section ridisegnata con overlay leggero e contenitori glass moderni
  * Situazioni complesse rinnovate con card pulite su sfondo grigio chiaro
  * Property cards aggiornate con design minimalista e ombre sottili
  * Footer scuro professionale con layout pulito
  * Nuova palette colori: arancione primario, blu secondario, giallo accent
  * Tipografia elegante con font-weight leggeri per titoli principali
  * Transizioni dolci e effetti hover sottili per eleganza
- July 24, 2025: Implementato layout homepage con sidebar come i vecchi siti web
  * Layout 2/3 proprietà + 1/3 sidebar con tutti i servizi sempre visibili
  * Proprietà limitate a 2 colonne e aumentate a 12 per homepage
  * Sidebar destra con servizi dettagliati, situazioni complesse e contatti
  * Rimossi ServicesSection e SpecializedServices dalla homepage (solo in sidebar)
  * Hero con bordi arancioni ridotti e ombreggiature per rilievo
- July 23, 2025: Rimossa completamente sezione blog/news dal sito
  * Eliminati link navigazione, route, componenti e API del blog
  * Semplificato pannello amministrativo (solo gestione proprietà)
  * Migliorato allineamento servizi homepage con layout flexbox
- July 22, 2025: Implementato schema colori brand completo basato su biglietti da visita
  * Colore principale: Blu scuro (#1e3a8a)
  * Colore secondario: Rosso (#dc2626) 
  * Colore accent: Giallo/oro (#fbbf24)
- July 22, 2025: Aggiornati servizi completi con struttura reale agenzia
  * Perizie e valutazioni (Visure catastali, CRIF, A.P.E.)
  * Servizi legali (Diritto immobiliare, sanatorie, successioni)
  * Compravendita immobili (Appartamenti, ville, terreni)
  * Servizi finanziari (Mutui agevolati)
- July 29, 2025: Aggiornati contatti completi AGENZIA 2 Servizi Immobiliari
  * Geometra: Antonio Cannavò
  * Via San Girolamo, 20 - 95024 ACIREALE (CT)
  * Cell: 346 800 3234
  * Email: agenzia2acireale@virgilio.it
  * Email: antoniocannavo@msn.com
  * Widget WhatsApp floating in tutte le pagine
  * Pulsanti call-to-action per chiamate e WhatsApp
  * Mappa Google Maps integrata nella pagina Chi Siamo
- July 23, 2025: Aggiunto riquadro trasparente nella hero home attorno a testi e filtri
  * Tre contenitori glassmorphism per testi, filtri e informazioni
  * Effetto backdrop-blur con trasparenze progressive
  * Design coerente con stile biglietto da visita
- July 22, 2025: Aggiunti mappa Google Maps e orari di apertura
- January 21, 2025: Uniformato design hero di tutte le pagine con stile coerente
- January 21, 2025: Aggiunto database PostgreSQL e seeded con dati di esempio
- January 21, 2025: Create pagine Chi Siamo e Proprietà con design uniforme
- June 19, 2025: Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.