# 🌸 Perfume Store – Multi-Vendor E-Commerce Platform

**Perfume Store** is a modern, full-featured e-commerce website for perfumes.  
It offers a **multi-vendor marketplace** experience built with **Next.js 15**, **Prisma**, **MongoDB**, **Cloudinary**, and **Clerk**, and deployed on **Vercel**.

Designed for **speed, scalability, and simplicity**, it provides a seamless shopping experience for both customers and sellers with a clean and elegant interface.

---

## 🚀 Features Overview

### 👥 Role-Based System
The platform supports **three main roles**:

- **Admin** 🛠️ – Full control over the system: manage users, approve or reject seller requests, and track orders.
- **Seller** 💼 – Manage personal products, inventory, and view order updates for their own items.
- **Client** 🛍️ – Regular users who can browse products, add them to cart, and make purchases.

> Users can **apply to become a seller**, and their request will be **approved or rejected** by the admin.

---

### 💳 Shopping & Checkout
- Add products to the **shopping cart** before checkout.  
- **Cash on Delivery (COD)** payment option.  
- Smooth and modern purchase flow with a user-friendly interface.

---

### 🔐 Authentication & Security
- Secure authentication powered by **Clerk**.  
- **Login with Google** or traditional **email & password**.  
- Session management handled safely and efficiently.

---

### 🧾 Order Management
- **Admins** can view and track all orders across the platform.  
- **Sellers** can track only their own orders.  
- Order statuses are clear and easy to follow — from creation to delivery.

---

### ☁️ Cloud Storage
All product images are uploaded and served via **Cloudinary**, ensuring:
- High-quality visuals  
- Fast image delivery  
- Easy image management  

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-------------|----------|
| **Next.js 15** | Frontend framework |
| **Prisma ORM** | Database interaction |
| **MongoDB** | Main database |
| **Cloudinary** | Image hosting and management |
| **Clerk** | Authentication & authorization |
| **Vercel** | Deployment and hosting |

---

## ✨ Key Highlights
- **Multi-Vendor Marketplace** – multiple sellers in one platform  
- **Responsive Design** – works perfectly on all devices  
- **Modern UI/UX** – elegant, minimal, and easy to navigate  
- **Powerful Admin Dashboard** – manage users, sellers, and orders  
- **Seller Panel** – manage products, inventory, and order updates  
- **Seamless Shopping Experience** – from browsing to checkout
- ### 🌍 Internationalization & Theme Support
- **Multi-Language Support** – The platform supports multiple languages, allowing users to easily switch between them for a personalized experience.  
- **Light & Dark Theme** – Users can toggle between light and dark modes for a comfortable and stylish browsing experience.

---

## ⚙️ Getting Started (Local Setup)

Follow these steps to run the project locally:

# 1️⃣ Clone the repository
git clone https://github.com/username/perfume-store.git
cd perfume-store

# 2️⃣ Install dependencies
npm install

# 3️⃣ Configure environment variables
# Create a `.env` file in the root directory and add:
DATABASE_URL=your_mongodb_connection_string
CLOUDINARY_URL=your_cloudinary_url
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# 4️⃣ Run the development server
npm run dev
Your app will be running on http://localhost:3000
