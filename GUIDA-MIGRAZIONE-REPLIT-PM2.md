# Guida Migrazione: Replit → PM2 + Supabase + Nginx

> **Destinazione AI**: Questa guida è per l'assistente AI che gestirà le migrazioni future.
> Leggila per intero prima di iniziare qualsiasi migrazione.

---

## Infrastruttura Server

| Parametro | Valore |
|---|---|
| **Server** | Hetzner VPS |
| **IP** | `49.13.204.226` |
| **OS** | Ubuntu 24.04 LTS (Noble Numbat) |
| **Node.js** | v20.20.0 |
| **npm** | 10.8.2 |
| **Process Manager** | PM2 (globale) |
| **Reverse Proxy** | Nginx |
| **Directory progetti** | `/root/progetti/` |
| **Database** | Supabase (PostgreSQL remoto) |
| **File uploads** | Disco locale (`uploads/` dentro ogni progetto) |

---

## Porte già assegnate

> [!CAUTION]
> Prima di assegnare una porta a un nuovo progetto, controlla questa tabella
> e verifica con `pm2 list` che non ci siano conflitti.

| Porta | Progetto | Nome PM2 |
|---|---|---|
| 4300 | InkJuliArt | INKJULIART |
| 5003 | Super Garage Kennedy | supergarage |

Quando aggiungi un nuovo progetto, **aggiorna questa tabella**.
Convenzione suggerita: usa porte nel range **4000-5999**.

---

## Workflow completo di migrazione

### FASE 1: Preparazione lato Replit

Prima di toccare qualsiasi cosa sul VPS, esegui questi passaggi su Replit.

#### 1.1 — Scarica il codice sorgente

```bash
# Se il progetto è su GitHub, clonalo direttamente sul VPS:
cd /root/progetti
git clone https://github.com/UTENTE/NOMEPROGETTO.git

# Se NON è su GitHub, l'utente deve scaricare lo ZIP da Replit
# e caricarlo sul VPS (via scp, sftp, o file manager)
```

#### 1.2 — Scarica la cartella uploads (CRITICO!)

> [!WARNING]
> Questo è il passaggio più importante. Se le immagini vengono perse,
> dovranno essere ricaricate manualmente dal cliente.

**Controlla dove sono le immagini nel progetto Replit:**

```bash
# Nel progetto Replit, cerca le cartelle di upload
find . -type d -name "uploads" -o -name "public" -o -name "images" | head -20

# Controlla anche i percorsi delle immagini nel database
# (vedi sezione "Migrazione immagini" più avanti)
```

Scarica l'intera cartella `uploads/` (o equivalente) da Replit prima di eliminare il progetto.

#### 1.3 — Esporta il database (dump)

Il database potrebbe essere su:
- **Neon** (tipico di Replit recenti)
- **PostgreSQL Replit integrato** (progetti più vecchi)

```bash
# Da Replit o dalla macchina locale con accesso al DB:
pg_dump "LA_CONNECTION_STRING_NEON_O_REPLIT" \
  --no-owner \
  --no-privileges \
  --clean \
  --if-exists \
  -f dump_nomeprogetto.sql

# Copia il dump sul VPS
scp dump_nomeprogetto.sql root@49.13.204.226:/root/progetti/NOMEPROGETTO/
```

> [!TIP]
> Se non hai `pg_dump` locale, puoi usare il tool `run_sql` di Neon MCP
> per estrarre i dati tabella per tabella, oppure scaricare il dump
> dalla dashboard Neon/Supabase.

---

### FASE 2: Configurazione database Supabase

#### 2.1 — Crea un nuovo progetto Supabase (o usa un progetto esistente)

Per ogni sito, è consigliabile creare uno **schema separato** sullo stesso progetto Supabase,
anziché creare un progetto Supabase per ogni sito. Questo riduce il numero di risorse e semplifica la gestione.

**Convenzione**: uno schema per ogni progetto, con un nome breve e chiaro.

```sql
-- Crea lo schema per il nuovo progetto
CREATE SCHEMA IF NOT EXISTS nome_progetto;
```

#### 2.2 — Importa il dump

```bash
# Dal VPS, importa il dump nel database Supabase
# Sostituisci la connection string con quella corretta

psql "postgresql://postgres:PASSWORD@db.XXXX.supabase.co:5432/postgres" \
  -f dump_nomeprogetto.sql
```

> [!IMPORTANT]
> Se il dump è stato esportato dallo schema `public` e vuoi importarlo
> in uno schema specifico (es. `sgk`), modifica il dump oppure usa:
>
> ```bash
> psql "postgresql://postgres:PASSWORD@db.XXXX.supabase.co:5432/postgres?options=-c%20search_path%3Dnome_schema" \
>   -f dump_nomeprogetto.sql
> ```

#### 2.3 — Verifica l'importazione

```sql
-- Connettiti e verifica le tabelle
\dt nome_schema.*

-- Controlla che ci siano dati
SELECT count(*) FROM nome_schema.tabella_principale;
```

---

### FASE 3: Setup del progetto sul VPS

#### 3.1 — Installa dipendenze e build

```bash
cd /root/progetti/NOMEPROGETTO

# Installa le dipendenze
npm install

# Build del frontend e del backend
npm run build
```

> [!NOTE]
> La maggior parte dei progetti Replit usa `vite` per il frontend
> e `esbuild` o `tsc` per il server. Il comando `npm run build`
> dovrebbe compilare entrambi. Se fallisce, controlla il `package.json`
> per capire la struttura dei build scripts.

#### 3.2 — Configura il file `.env`

Crea il file `.env` nella root del progetto con tutte le variabili necessarie.

```bash
# Prendi le variabili dal progetto Replit (dashboard Replit → Secrets)
# e crea il file .env locale

cat > .env << 'EOF'
# Database - SEMPRE Supabase, SEMPRE con search_path per lo schema
DATABASE_URL="postgresql://postgres:PASSWORD@db.XXXX.supabase.co:5432/postgres?options=-c%20search_path%3Dnome_schema"
PGDATABASE="postgres"

# Sessione
SESSION_SECRET="genera-una-stringa-casuale-lunga"

# Aggiungi qui tutte le altre variabili del progetto
# (Stripe, Twilio, SendGrid, email, ecc.)
EOF
```

> [!CAUTION]
> Il file `.env` contiene credenziali sensibili.
> **NON** committarlo su Git. Assicurati che `.gitignore` lo contenga.

#### 3.3 — Crea il file `ecosystem.config.cjs`

Questo file configura PM2. Usa questo template standard:

```javascript
const fs = require('fs');

const envConfig = {};
try {
  const envFile = fs.readFileSync('.env', 'utf-8');
  envFile.split('\n').forEach(line => {
    const match = line.match(/^([^#=][^=]*)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let val = match[2].trim();
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.substring(1, val.length - 1);
      }
      envConfig[key] = val;
    }
  });
} catch(e) {
  console.log("Could not parse .env file", e);
}

module.exports = {
  apps: [{
    name: "NOME-PM2",          // <-- Nome visibile in pm2 list (tutto maiuscolo)
    script: "dist/index.js",   // <-- Percorso allo script compilato
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: "1G",
    env: {
      ...envConfig,
      NODE_ENV: "production",
      PORT: XXXX               // <-- Porta unica, controlla la tabella porte!
    }
  }]
}
```

> [!IMPORTANT]
> - Il `name` deve essere unico in tutto il server
> - La `PORT` deve essere unica — controlla la tabella porte in cima a questa guida
> - Lo `script` è tipicamente `dist/index.js` ma potrebbe variare

#### 3.4 — Avvia con PM2

```bash
cd /root/progetti/NOMEPROGETTO

# Avvio iniziale
pm2 start ecosystem.config.cjs

# Verifica che sia online
pm2 list

# Controlla i log per eventuali errori
pm2 logs NOME-PM2 --lines 50

# Salva la configurazione PM2 (così riparte dopo un reboot)
pm2 save
```

---

### FASE 4: Migrazione immagini

> [!IMPORTANT]
> Ci sono due casi possibili. Controlla nel codice sorgente come
> vengono gestite le immagini prima di procedere.

#### CASO A: Immagini in cartella locale (`uploads/`)

Questo è il caso più comune. L'app Replit usa `multer` e salva i file in una cartella
locale (tipicamente `uploads/`, `public/uploads/`, o simili).

**Come riconoscerlo:**
```bash
# Cerca nel codice la configurazione di multer
grep -r "multer" server/ --include="*.ts" --include="*.js" -l
grep -r "destination" server/ --include="*.ts" --include="*.js" | grep -i upload
```

**Migrazione:**
1. Copia la cartella uploads dal progetto Replit (già scaricata nella Fase 1)
2. Posizionala nello stesso percorso relativo nel progetto sul VPS:

```bash
# Esempio: se in Replit la cartella era ./uploads/
cp -r /percorso/uploads_scaricati/* /root/progetti/NOMEPROGETTO/uploads/

# Imposta i permessi corretti
chmod -R 755 /root/progetti/NOMEPROGETTO/uploads/
```

3. **Verifica i percorsi nel database:**

```sql
-- Trova le colonne che contengono percorsi immagine
-- (cerca colonne che si chiamano image, photo, url, path, ecc.)
SELECT column_name, table_name 
FROM information_schema.columns 
WHERE table_schema = 'nome_schema' 
AND (column_name LIKE '%image%' OR column_name LIKE '%photo%' 
     OR column_name LIKE '%url%' OR column_name LIKE '%media%');

-- Controlla il formato dei percorsi
SELECT DISTINCT image_column FROM nome_schema.tabella LIMIT 10;
```

Se i percorsi sono **relativi** (es. `/uploads/abc.jpg` o `uploads/abc.jpg`) → **funziona subito, non serve fare nulla**.

Se i percorsi iniziano con `http` o `https` → vedi il Caso B.

---

#### CASO B: Immagini da Google Cloud Storage (Replit Object Storage)

Replit recenti usano GCS (Google Cloud Storage) dietro le quinte tramite il modulo
`@replit/object-storage`. Le immagini vengono salvate su un bucket GCS e nel database
vengono memorizzati gli URL completi di GCS.

**Come riconoscerlo:**
```bash
# Cerca nel codice riferimenti a object storage
grep -r "objectStorage\|object-storage\|@replit" server/ --include="*.ts" --include="*.js" -l

# Cerca nel database URL di GCS
# (connessione SQL al database originale Neon/Replit)
SELECT image_column FROM tabella WHERE image_column LIKE '%googleapis%' LIMIT 5;
SELECT image_column FROM tabella WHERE image_column LIKE '%replit%' LIMIT 5;
```

**Migrazione:**

##### Passo 1: Scarica le immagini da GCS

```bash
# Se hai ancora accesso al progetto Replit, scarica da lì.
# Altrimenti, estrai gli URL dal database e scaricali:

# Lista tutti gli URL unici delle immagini
psql "CONNECTION_STRING_VECCHIO_DB" -t -A -c \
  "SELECT DISTINCT image_column FROM tabella WHERE image_column IS NOT NULL;" \
  > image_urls.txt

# Scarica ogni immagine
mkdir -p /root/progetti/NOMEPROGETTO/uploads
while IFS= read -r url; do
  filename=$(basename "$url")
  wget -q -O "/root/progetti/NOMEPROGETTO/uploads/$filename" "$url"
done < image_urls.txt
```

##### Passo 2: Aggiorna i percorsi nel database Supabase

```sql
-- Esempio: le immagini in DB hanno URL tipo:
-- https://storage.googleapis.com/replit/images/abc123.jpg
-- Devi sostituirli con: /uploads/abc123.jpg

-- Prima controlla il pattern esatto degli URL
SELECT DISTINCT 
  LEFT(image_column, 60)
FROM nome_schema.tabella 
WHERE image_column LIKE 'http%' 
LIMIT 10;

-- Poi esegui l'update massivo
-- ADATTA il pattern al formato reale degli URL nel database!
UPDATE nome_schema.tabella
SET image_column = '/uploads/' || SUBSTRING(image_column FROM '[^/]+$')
WHERE image_column LIKE 'https://storage.googleapis.com/%';

-- Se ci sono più tabelle con immagini, ripeti per ognuna
-- UPDATE nome_schema.altra_tabella SET ...
```

##### Passo 3: Aggiorna il codice sorgente

Sostituisci le importazioni di `objectStorage` con la logica di upload locale:

```typescript
// PRIMA (Replit Object Storage) — DA RIMUOVERE:
// import { Client } from "@replit/object-storage";
// const objectStorageClient = new Client();

// DOPO (upload locale con Multer):
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const uploadDir = path.join(process.cwd(), "uploads");

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});
```

E assicurati che Express serva la cartella uploads come file statici:

```typescript
// In server/index.ts o dove configuri Express
import express from "express";
const app = express();

// Serve i file uploadati
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
```

> [!TIP]
> Se il file `server/objectStorage.ts` esiste ma NON è importato
> da nessuna parte (come nel caso di Super Garage Kennedy), puoi
> semplicemente eliminarlo. Controlla con:
> ```bash
> grep -r "objectStorage" server/ --include="*.ts" --include="*.js"
> ```

---

### FASE 5: Configurazione Nginx

#### 5.1 — Crea il file di configurazione

```bash
# Crea il file di configurazione per il nuovo sito
nano /etc/nginx/sites-available/NOMESITO
```

**Template base (senza upload cache):**

```nginx
server {
    listen 80;
    server_name dominio.it www.dominio.it;

    location / {
        proxy_pass http://127.0.0.1:PORTA;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    client_max_body_size 50M;
}
```

**Template avanzato (con cache per immagini statiche — consigliato):**

```nginx
server {
    listen 80;
    server_name dominio.it www.dominio.it;

    # Upload limit
    client_max_body_size 50M;

    # Servi le immagini staticamente con cache lunga (30 giorni)
    # Questo è più efficiente: Nginx serve i file direttamente,
    # senza passare per Node.js
    location /uploads/ {
        alias /root/progetti/NOMEPROGETTO/uploads/;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000, immutable";
        add_header Access-Control-Allow-Origin "*";
    }

    # Tutto il resto va al server Node.js
    location / {
        proxy_pass http://127.0.0.1:PORTA;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### 5.2 — Attiva il sito e ricarica Nginx

```bash
# Crea il symlink per attivare il sito
ln -s /etc/nginx/sites-available/NOMESITO /etc/nginx/sites-enabled/NOMESITO

# Testa la configurazione (SEMPRE prima di ricaricare!)
nginx -t

# Se il test è OK, ricarica
systemctl reload nginx
```

---

### FASE 6: SSL con Certbot (HTTPS)

> [!NOTE]
> Il DNS del dominio deve già puntare all'IP `49.13.204.226`
> PRIMA di eseguire certbot, altrimenti la verifica fallirà.

```bash
# Installa certbot se non presente
apt install -y certbot python3-certbot-nginx

# Attiva SSL per il dominio (modifica automaticamente la config Nginx)
certbot --nginx -d dominio.it -d www.dominio.it

# Il rinnovo automatico è già configurato via systemd timer
# Verifica con:
systemctl list-timers | grep certbot
```

---

### FASE 7: DNS

Configura i record DNS del dominio per puntare al server:

| Tipo | Nome | Valore |
|---|---|---|
| A | `@` | `49.13.204.226` |
| A | `www` | `49.13.204.226` |

> [!TIP]
> Il TTL basso (300s) durante la migrazione accelera la propagazione.
> Dopo aver verificato che tutto funziona, puoi alzarlo a 3600s.

---

## Comandi di gestione quotidiana

```bash
# Stato di tutte le app
pm2 list

# Log di un'app specifica
pm2 logs NOME-PM2 --lines 100

# Restart di un'app (dopo modifiche)
pm2 restart NOME-PM2

# Rebuild e restart completo
cd /root/progetti/NOMEPROGETTO
npm run build
pm2 restart NOME-PM2

# Monitoraggio risorse in tempo reale
pm2 monit

# Salvare la configurazione (così PM2 riparte dopo reboot)
pm2 save

# Attivare PM2 all'avvio del server (fare UNA VOLTA)
pm2 startup
```

---

## Checklist finale post-migrazione

Per ogni nuovo sito migrato, verifica tutti questi punti:

- [ ] **Build** — `npm run build` completato senza errori
- [ ] **Database** — Dump importato, tabelle e dati presenti su Supabase
- [ ] **Immagini** — Cartella `uploads/` presente con tutti i file
- [ ] **Percorsi immagini** — URL nel DB corrispondono ai file locali
- [ ] **`.env`** — Tutte le variabili settate (DATABASE_URL, chiavi API, ecc.)
- [ ] **PM2** — App online e senza errori nei log
- [ ] **Nginx** — Config attiva, `nginx -t` OK, reload fatto
- [ ] **DNS** — Dominio puntato all'IP `49.13.204.226`
- [ ] **SSL** — Certbot attivato, HTTPS funzionante
- [ ] **Test funzionale** — Il sito si apre, le pagine caricano, le immagini si vedono
- [ ] **Test admin** — Login admin funziona, upload nuove immagini funziona
- [ ] **Tabella porte** — Aggiornata in questa guida con la nuova porta
- [ ] **`pm2 save`** — Configurazione salvata

---

## Struttura tipo di un progetto migrato

```
/root/progetti/NOMEPROGETTO/
├── .env                     # Credenziali e DATABASE_URL
├── ecosystem.config.cjs     # Configurazione PM2
├── package.json
├── node_modules/
├── dist/                    # Build di produzione (server + client)
│   ├── index.js             # Entry point server compilato
│   └── public/              # Frontend compilato (Vite output)
├── uploads/                 # Immagini caricate dagli utenti
│   ├── abc123.jpg
│   └── ...
├── server/                  # Sorgenti server (TypeScript)
└── client/                  # Sorgenti frontend (React/Vite)
```

---

## Note importanti per l'AI

1. **Non modificare MAI le rotte Express** — il vantaggio di PM2 è che il codice non cambia
2. **Controlla sempre `package.json`** per capire il build command corretto
3. **Se il build fallisce**, spesso è per dipendenze mancanti o per riferimenti a moduli Replit (`@replit/*`). Rimuovili e sostituiscili con equivalenti locali
4. **Se il progetto usa WebSocket**, la configurazione Nginx base è sufficiente (i proxy header Upgrade sono già inclusi)
5. **Un solo `pm2 save` alla fine** — non serve farlo dopo ogni restart
6. **Backup**: la cartella `uploads/` NON è su Git. Assicurati che sia inclusa nei backup del server
