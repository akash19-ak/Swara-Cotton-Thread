# Swara Cotton Thread - Ethnic E-Commerce Platform

Welcome to the official repository of **Swara Cotton Thread**, a premium full-stack ethnic branding and e-commerce shopping web application. 

Dresses are browsed, sorted, filtered, and loaded from the catalog. The purchase workflow is designed to happen directly via **WhatsApp communication**, pre-filling items details, sizes, quantities, and pricing summaries for a personalized shop experience.

---

## 🚀 Tech Stack

- **Frontend:** React.js (Vite-based single-page application)
- **Backend:** Node.js + Express.js
- **Database:** MongoDB (Preferred) with **Local JSON File Fallback** (requires zero configuration, works out-of-the-box!)
- **Styling:** Premium Light-Theme Vanilla CSS (Custom serif heading typography, terracotta & forest green details, smooth slider animations, and slide-in panels)
- **Auth:** JSON Web Tokens (JWT) for secure Admin settings

---

## 📁 Project Structure

```text
Swara-Cotton-Thread/
├── backend/
│   ├── data/
│   │   └── db.json              # Auto-created local JSON database fallback
│   ├── middleware/
│   │   └── auth.js              # Express JWT auth validator
│   ├── public/
│   │   └── uploads/             # Dynamically uploaded images directory
│   ├── routes/
│   │   ├── admin.js             # Admin authentication Router
│   │   ├── brand.js             # Store branding settings CRUD Router
│   │   ├── products.js          # Products catalog CRUD Router
│   │   └── upload.js            # Multer images uploader Router
│   ├── services/
│   │   ├── database.js          # Database connection manager (Mongo/File fallback)
│   │   └── storage.js           # CRUD repository abstractions and DB seeds
│   ├── .env                     # Backend settings and MongoDB strings
│   ├── package.json
│   └── server.js                # Express server entry point
└── frontend/
    ├── public/
    │   └── images/              # Seeded designer assets (Banners, Sarees, Kurtis)
    ├── src/
    │   ├── components/          # Reusable UI components (Navbar, Footer, ProductCard)
    │   ├── context/             # React states providers (CartContext, BrandContext)
    │   ├── pages/               # Main layout canvases (Home, Shop, Details, Cart, Admin)
    │   ├── App.css              # Main layout variables and rules
    │   ├── index.css            # Base stylesheet resets and utility animations
    │   ├── App.jsx              # Routing configurations
    │   └── main.jsx
```

---

## 🔐 Admin Panel Credentials

Access the administrator board under: `/admin/login` or via the **Admin Panel** link in the navigation header.

- **Username:** `admin123`
- **Password:** `swara123`

---

## ⚙️ How to Run Locally

### Prerequisites
Make sure you have **Node.js** (v18 or higher recommended) and **npm** installed on your system.

### Step 1: Start the Backend Server

1. Open your terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Set up MongoDB:
   - By default, the application runs on a local JSON file store (`backend/data/db.json`) and seeds it with default products. **No database setup is required to run!**
   - If you prefer to use MongoDB, copy or modify the `backend/.env` file and uncomment the `MONGODB_URI` line:
     ```env
     MONGODB_URI=mongodb://localhost:27017/swara_cotton_thread
     ```
4. Launch the Express server:
   ```bash
   npm run dev
   ```
   The backend will start listening on port `5000`.

---

### Step 2: Start the Frontend Client

1. Open a new terminal window/tab and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Launch the React development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the URL printed in the terminal (typically `http://localhost:5173`).

---

## 🧶 Key Features & Workflows

### 1. Dual-Mode Database Layer
We have built an abstraction service layer (`backend/services/storage.js`). If `MONGODB_URI` is present in the environmental variables, it initiates connected MongoDB collections. Otherwise, it writes database states to the local `db.json` file. Seed scripts populate images and initial sarees, kurtis, and materials automatically on boot.

### 2. WhatsApp Redirection Engine
When clients click **Buy via WhatsApp** in the Cart or on the product details sheet:
- The system encodes purchase items list, sizes, and quantities.
- Calculates subtotal and grand totals.
- Generates a pre-filled customer ordering card.
- Redirects users using `https://wa.me/<whatsappNumber>?text=<encodedMessage>`.
- The seller's WhatsApp number can be modified dynamically on the Admin dashboard.

### 3. File Upload Architecture
Administrators can upload images for dresses catalog, branding logo, and hero banners. The frontend uploads files as multipart form-data to `/api/upload`. The server uses Multer to store the image under `backend/public/uploads/` and yields relative URLs back to React.
