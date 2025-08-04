// Script para verificar variables de entorno durante el build
import fs from 'fs';
import path from 'path';

console.log("🔍 Verificando variables de entorno...");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("VITE_API_BASE_URL:", process.env.VITE_API_BASE_URL);
console.log("VITE_CLOUDINARY_CLOUD_NAME:", process.env.VITE_CLOUDINARY_CLOUD_NAME);
console.log("VITE_Maps_API_KEY:", process.env.VITE_Maps_API_KEY ? "✅ Definida" : "❌ No definida");
console.log("VITE_PEXELS_API_KEY:", process.env.VITE_PEXELS_API_KEY ? "✅ Definida" : "❌ No definida");
console.log("VITE_OPENWEATHER_API_KEY:", process.env.VITE_OPENWEATHER_API_KEY ? "✅ Definida" : "❌ No definida");

// Verificar archivos .env disponibles
const envFiles = [
  '.env',
  '.env.local',
  '.env.development',
  '.env.production'
];

console.log("\n📁 Archivos .env encontrados:");
envFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} existe`);
    
    // Leer contenido del archivo
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n').filter(line => line.trim() && !line.startsWith('#'));
      console.log(`   Variables definidas: ${lines.length}`);
      lines.forEach(line => {
        const [key] = line.split('=');
        console.log(`   - ${key}`);
      });
    } catch (err) {
      console.log(`   Error leyendo archivo: ${err.message}`);
    }
  } else {
    console.log(`❌ ${file} no existe`);
  }
});
