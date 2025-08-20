import { db } from "./db";
import { travels, showcases, countries, users } from "@shared/schema";

async function seed() {
  console.log("🌱 Seeding database per PROPATO TRAVEL...");

  try {
    // Create admin user for PROPATO TRAVEL
    await db.insert(users).values({
      id: "admin-user-1",
      email: "info@propatotravel.it",
      firstName: "Admin",
      lastName: "Propato Travel",
      role: "admin",
      profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    }).onConflictDoUpdate({
      target: users.id,
      set: {
        role: "admin",
        updatedAt: new Date(),
      },
    });

    console.log("✅ Admin user Propato Travel creato/aggiornato");

    // NON CREARE DATI DI ESEMPIO
    // Il cliente ha già i suoi viaggi reali caricati
    console.log("ℹ️  Seed viaggi disabilitato - Propato Travel usa i propri pacchetti reali");
    
    console.log("✅ Database PROPATO TRAVEL inizializzato correttamente");
    console.log("✅ NESSUN DATO IMMOBILIARE CREATO - Solo dati viaggi");
    
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

export { seed };

// Auto-run when executed directly
if (import.meta.url.endsWith(process.argv[1])) {
  seed()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}