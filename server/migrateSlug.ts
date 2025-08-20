import { db } from "./db";
import { travels } from "@shared/schema";
import { 
  generatePropertySlug, 
  generatePropertyMetaTitle, 
  generatePropertyMetaDescription 
} from "@shared/schema";
import { eq, isNull } from "drizzle-orm";

export async function migratePropertySlugs() {
  console.log("⚠️  MIGRATION DISABLED: Slug migration disabled to prevent data conflicts during deploy");
  console.log("ℹ️  Travel slugs are auto-generated on creation - no migration needed");
  return;
  
  /* DISABLED FOR DEPLOY SAFETY
  console.log("Starting slug migration for existing properties...");
  
  try {
    // Get all properties that don't have slugs
    const allProperties = await db
      .select()
      .from(travels)
      .where(isNull(travels.slug));
    
    console.log(`Found ${allProperties.length} properties without slugs`);
    
    let migratedCount = 0;
    const slugCounts: { [key: string]: number } = {};
    
    for (const property of allProperties) {
      try {
        // Generate base slug
        const baseSlug = generatePropertySlug({
          type: property.type,
          municipality: property.municipality,
          propertyType: property.propertyType,
          title: property.title
        });
        
        // Ensure slug is unique
        let uniqueSlug = baseSlug;
        const count = slugCounts[baseSlug] || 0;
        if (count > 0) {
          uniqueSlug = `${baseSlug}-${count + 1}`;
        }
        slugCounts[baseSlug] = count + 1;
        
        // Generate meta data
        const metaTitle = generatePropertyMetaTitle({
          type: property.type,
          municipality: property.municipality,
          propertyType: property.propertyType,
          price: property.price
        });
        
        const metaDescription = generatePropertyMetaDescription({
          type: property.type,
          municipality: property.municipality,
          propertyType: property.propertyType,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          area: property.area,
          price: property.price
        });
        
        // Update the property
        await db
          .update(travels)
          .set({
            slug: uniqueSlug,
            metaTitle,
            metaDescription
          })
          .where(eq(travels.id, property.id));
        
        migratedCount++;
        console.log(`✓ Migrated property ${property.id}: ${uniqueSlug}`);
        
      } catch (error) {
        console.error(`✗ Failed to migrate property ${property.id}:`, error);
      }
    }
    
    console.log(`\n✅ Migration completed! Updated ${migratedCount} of ${allProperties.length} properties`);
    return migratedCount;
    
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migratePropertySlugs()
    .then(() => {
      console.log("✅ Slug migration completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Slug migration failed:", error);
      process.exit(1);
    });
}