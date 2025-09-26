require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/products'); // ojo que el archivo sea product.js en src/models

// Productos de supermercado
const products = [
  {
    title: "Leche entera 1L",
    description: "Leche entera larga vida 1 litro",
    price: 1200,
    category: "Lácteos",
    stock: 100,
    status: true,
    thumbnails: []
  },
  {
    title: "Pan de molde 500g",
    description: "Pan lactal blanco 500 gramos",
    price: 1800,
    category: "Panificados",
    stock: 80,
    status: true,
    thumbnails: []
  },
  {
    title: "Aceite de girasol 1.5L",
    description: "Aceite de girasol botella plástica 1.5 litros",
    price: 3500,
    category: "Almacén",
    stock: 60,
    status: true,
    thumbnails: []
  },
  {
    title: "Arroz largo fino 1kg",
    description: "Arroz largo fino en paquete de 1 kilogramo",
    price: 2100,
    category: "Almacén",
    stock: 90,
    status: true,
    thumbnails: []
  },
  {
    title: "Yerba mate 1kg",
    description: "Yerba mate elaborada con palo 1 kilogramo",
    price: 4200,
    category: "Infusiones",
    stock: 70,
    status: true,
    thumbnails: []
  },
  {
    title: "Café instantáneo 170g",
    description: "Café instantáneo frasco vidrio 170 gramos",
    price: 5600,
    category: "Infusiones",
    stock: 50,
    status: true,
    thumbnails: []
  },
  {
    title: "Detergente líquido 750ml",
    description: "Detergente para vajilla 750ml",
    price: 1500,
    category: "Limpieza",
    stock: 120,
    status: true,
    thumbnails: []
  },
  {
    title: "Gaseosa cola 2.25L",
    description: "Bebida gaseosa sabor cola 2.25 litros",
    price: 2800,
    category: "Bebidas",
    stock: 200,
    status: true,
    thumbnails: []
  },
  {
    title: "Agua mineral 2L",
    description: "Agua mineral sin gas 2 litros",
    price: 1000,
    category: "Bebidas",
    stock: 150,
    status: true,
    thumbnails: []
  },
  {
    title: "Papel higiénico x4",
    description: "Pack de 4 rollos de papel higiénico doble hoja",
    price: 2200,
    category: "Limpieza",
    stock: 130,
    status: true,
    thumbnails: []
  }
];

(async () => {
  try {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/coder_entrega_final";
    await mongoose.connect(uri);
    console.log("✅ Conectado a MongoDB");

    // Limpiar colección
    await Product.deleteMany({});
    console.log("🗑️ Colección products vaciada");

    // Insertar productos
    await Product.insertMany(products);
    console.log("🌱 Productos de supermercado insertados");

    mongoose.connection.close();
    console.log("🔌 Conexión cerrada");
  } catch (err) {
    console.error("❌ Error al hacer seed:", err);
    process.exit(1);
  }
})();
