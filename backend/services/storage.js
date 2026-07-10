const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { isMongoDB } = require('./database');

// Define Mongoose Schemas if using MongoDB
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  description: { type: String },
  category: { type: String, required: true },
  images: [{ type: String }],
  inStock: { type: Boolean, default: true },
  isTrending: { type: Boolean, default: false },
  sizes: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

const BrandSchema = new mongoose.Schema({
  name: { type: String, default: "Swara Cotton Thread" },
  tagline: { type: String, default: "Threads of Heritage, Comfort of Cotton" },
  description: { type: String, default: "Welcome to Swara Cotton Thread, where we curate the finest handcrafted cotton sarees, kurtis, and dress materials. Each piece is selected for its superior quality thread, ethnic prints, and comfortable fit, celebrating traditional Indian craftsmanship in modern silhouettes." },
  logo: { type: String, default: "/images/sctlogo.jpeg" },
  categories: [{ type: String }],
  banners: [{
    image: { type: String },
    title: { type: String },
    subtitle: { type: String }
  }],
  whatsappNumber: { type: String, default: "919876543210" },
  email: { type: String, default: "contact@swaracottonthread.com" },
  address: { type: String, default: "Swara Cotton Thread, 12, Handloom Market, Ring Road, Surat, Gujarat - 395002" }
});

let MongoProduct;
let MongoBrand;

try {
  MongoProduct = mongoose.model('Product');
} catch (e) {
  MongoProduct = mongoose.model('Product', ProductSchema);
}

try {
  MongoBrand = mongoose.model('Brand');
} catch (e) {
  MongoBrand = mongoose.model('Brand', BrandSchema);
}

// Local JSON File Store setup
const localDbPath = path.join(__dirname, '../data/db.json');

// Seed Data
const defaultBrand = {
  name: "Swara Cotton Thread",
  tagline: "Threads of Heritage, Comfort of Cotton",
  description: "Welcome to Swara Cotton Thread, where we curate the finest handcrafted cotton sarees, kurtis, and dress materials. Each piece is selected for its superior quality thread, ethnic prints, and comfortable fit, celebrating traditional Indian craftsmanship in modern silhouettes.",
  logo: "/images/sctlogo.jpeg",
  categories: ["Cotton Sarees", "Kurtis", "Dress Materials"],
  banners: [
    { image: "/images/banner1.jpg", title: "Summer Handloom Edit", subtitle: "Experience pure comfort in our handcrafted cotton sarees" },
    { image: "/images/banner2.jpg", title: "Ethnic Kurtis Collection", subtitle: "Trendy block prints for your everyday look" }
  ],
  whatsappNumber: "919876543210",
  email: "contact@swaracottonthread.com",
  address: "Swara Cotton Thread, 12, Handloom Market, Ring Road, Surat, Gujarat - 395002"
};

const defaultProducts = [
  {
    id: "seed-saree-1",
    name: "Handloom Pure Cotton Saree",
    price: 1299,
    originalPrice: 1899,
    category: "Cotton Sarees",
    description: "Premium quality handloom cotton saree with traditional zari border. Soft, breathable, and perfect for all occasions.",
    images: ["/images/saree1.jpg", "/images/saree1_detail.jpg"],
    inStock: true,
    isTrending: true,
    sizes: ["Free Size"]
  },
  {
    id: "seed-kurti-1",
    name: "Elegant Indigo A-Line Kurti",
    price: 799,
    originalPrice: 1199,
    category: "Kurtis",
    description: "Beautiful A-line indigo blue kurti with block print details. Made from 100% pure cotton for absolute comfort.",
    images: ["/images/kurti1.jpg", "/images/kurti1_detail.jpg"],
    inStock: true,
    isTrending: true,
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: "seed-material-1",
    name: "Unstitched Cotton Dress Material",
    price: 950,
    originalPrice: 1450,
    category: "Dress Materials",
    description: "Traditional Jaipur block printed dress material. Includes fabric for top, bottom, and a beautiful cotton dupatta.",
    images: ["/images/material1.jpg"],
    inStock: true,
    isTrending: false,
    sizes: ["Unstitched"]
  },
  {
    id: "seed-saree-2",
    name: "Mulmul Cotton Floral Saree",
    price: 1499,
    originalPrice: 2199,
    category: "Cotton Sarees",
    description: "Lightweight and ultra-soft mulmul cotton saree with hand-printed floral motifs. Elegant and comfortable.",
    images: ["/images/saree2.jpg"],
    inStock: true,
    isTrending: true,
    sizes: ["Free Size"]
  },
  {
    id: "seed-kurti-2",
    name: "Block Print Straight Kurta",
    price: 650,
    originalPrice: 999,
    category: "Kurtis",
    description: "Straight-cut cotton kurta featuring classic block prints and v-neck. Ideal for daily wear.",
    images: ["/images/kurti2.jpg"],
    inStock: true,
    isTrending: false,
    sizes: ["M", "L", "XL"]
  },
  {
    id: "seed-material-2",
    name: "Chanderi Cotton Suit Set",
    price: 1850,
    originalPrice: 2500,
    category: "Dress Materials",
    description: "Luxurious Chanderi cotton dress material set. Perfect for festive and semi-formal wear.",
    images: ["/images/material2.jpg"],
    inStock: true,
    isTrending: true,
    sizes: ["Unstitched"]
  }
];

function normalizeCategoryData(db) {
  const brandCategories = Array.isArray(db?.brand?.categories) && db.brand.categories.length > 0
    ? db.brand.categories
    : [...defaultBrand.categories];

  const productCategories = (db?.products || [])
    .map((product) => product.category)
    .filter(Boolean);

  const mergedCategories = [...new Set([...brandCategories, ...productCategories])];

  const normalizedProducts = (db?.products || []).map((product) => {
    const trimmedCategory = typeof product.category === 'string' ? product.category.trim() : '';
    const matchingCategory = mergedCategories.find((cat) => cat.toLowerCase() === trimmedCategory.toLowerCase());
    return {
      ...product,
      category: matchingCategory || mergedCategories[0] || defaultBrand.categories[0]
    };
  });

  return {
    ...db,
    products: normalizedProducts,
    brand: {
      ...(db?.brand || {}),
      categories: mergedCategories
    }
  };
}

// Helper to read JSON DB
function readLocalDb() {
  try {
    if (!fs.existsSync(localDbPath)) {
      const dataDir = path.dirname(localDbPath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      const initialDb = normalizeCategoryData({ products: defaultProducts, brand: defaultBrand });
      fs.writeFileSync(localDbPath, JSON.stringify(initialDb, null, 2));
      return initialDb;
    }
    const fileData = fs.readFileSync(localDbPath, 'utf8');
    const parsedDb = JSON.parse(fileData);
    const normalizedDb = normalizeCategoryData(parsedDb);
    if (JSON.stringify(normalizedDb) !== fileData) {
      writeLocalDb(normalizedDb);
    }
    return normalizedDb;
  } catch (err) {
    console.error('Error reading local JSON DB', err);
    return { products: [], brand: {} };
  }
}

// Helper to write JSON DB
function writeLocalDb(data) {
  try {
    fs.writeFileSync(localDbPath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing to local JSON DB', err);
  }
}

// Initialization and seeding
async function initStorage() {
  if (isMongoDB()) {
    try {
      const count = await MongoProduct.countDocuments();
      if (count === 0) {
        await MongoProduct.insertMany(defaultProducts.map(p => {
          const { id, ...rest } = p;
          return rest;
        }));
        console.log('MongoDB Products seeded successfully.');
      }
      const brandCount = await MongoBrand.countDocuments();
      if (brandCount === 0) {
        await MongoBrand.create(defaultBrand);
        console.log('MongoDB Brand seeded successfully.');
      }
    } catch (err) {
      console.error('Error seeding MongoDB data:', err);
    }
  } else {
    // Read local db to force creation/seeding
    readLocalDb();
    console.log('Local JSON Database seeded and ready.');
  }
}

// CRUD Abstractions
async function getProducts() {
  if (isMongoDB()) {
    return await MongoProduct.find({}).sort({ createdAt: -1 });
  } else {
    const db = readLocalDb();
    return db.products;
  }
}

async function getProductById(id) {
  if (isMongoDB()) {
    return await MongoProduct.findById(id);
  } else {
    const db = readLocalDb();
    return db.products.find(p => p.id === id);
  }
}

async function createProduct(productData) {
  if (isMongoDB()) {
    const newProduct = new MongoProduct(productData);
    return await newProduct.save();
  } else {
    const db = readLocalDb();
    const normalizedCategory = productData.category && typeof productData.category === 'string'
      ? productData.category.trim()
      : '';
    const validCategory = normalizedCategory
      ? (db.brand.categories || []).find((cat) => cat.toLowerCase() === normalizedCategory.toLowerCase()) || normalizedCategory
      : (db.brand.categories || [defaultBrand.categories[0]])[0];

    const newProduct = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      ...productData,
      category: validCategory,
      createdAt: new Date().toISOString()
    };

    db.products.unshift(newProduct);
    db.brand.categories = [...new Set([...(db.brand.categories || []), validCategory])];
    writeLocalDb(db);
    return newProduct;
  }
}

async function updateProduct(id, productData) {
  if (isMongoDB()) {
    return await MongoProduct.findByIdAndUpdate(id, productData, { new: true });
  } else {
    const db = readLocalDb();
    const index = db.products.findIndex(p => p.id === id);
    if (index !== -1) {
      const nextProduct = { ...db.products[index], ...productData };
      const normalizedCategory = productData.category && typeof productData.category === 'string'
        ? productData.category.trim()
        : nextProduct.category;
      const matchingCategory = (db.brand.categories || []).find((cat) => cat.toLowerCase() === normalizedCategory.toLowerCase());
      nextProduct.category = matchingCategory || normalizedCategory || (db.brand.categories || [defaultBrand.categories[0]])[0];
      db.products[index] = nextProduct;
      db.brand.categories = [...new Set([...(db.brand.categories || []), nextProduct.category])];
      writeLocalDb(db);
      return db.products[index];
    }
    return null;
  }
}

async function deleteProduct(id) {
  if (isMongoDB()) {
    return await MongoProduct.findByIdAndDelete(id);
  } else {
    const db = readLocalDb();
    const index = db.products.findIndex(p => p.id === id);
    if (index !== -1) {
      const deleted = db.products.splice(index, 1);
      writeLocalDb(db);
      return deleted[0];
    }
    return null;
  }
}

async function getBrand() {
  if (isMongoDB()) {
    let brand = await MongoBrand.findOne({});
    if (!brand) {
      brand = await MongoBrand.create(defaultBrand);
    }
    if (!brand.categories || brand.categories.length === 0) {
      brand.categories = [...defaultBrand.categories];
      await brand.save();
    }
    return brand;
  } else {
    const db = readLocalDb();
    if (!db.brand || Object.keys(db.brand).length === 0) {
      db.brand = { ...defaultBrand };
      writeLocalDb(db);
    }
    if (!db.brand.categories || db.brand.categories.length === 0) {
      db.brand.categories = [...defaultBrand.categories];
      writeLocalDb(db);
    }
    return db.brand;
  }
}

async function updateBrand(brandData) {
  if (isMongoDB()) {
    let brand = await MongoBrand.findOne({});
    if (brand) {
      return await MongoBrand.findByIdAndUpdate(brand._id, brandData, { new: true });
    } else {
      return await MongoBrand.create({ ...defaultBrand, ...brandData });
    }
  } else {
    const db = readLocalDb();
    db.brand = { ...db.brand, ...brandData };
    if (!db.brand.categories || db.brand.categories.length === 0) {
      db.brand.categories = [...defaultBrand.categories];
    }
    writeLocalDb(db);
    return db.brand;
  }
}

module.exports = {
  initStorage,
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getBrand,
  updateBrand
};
