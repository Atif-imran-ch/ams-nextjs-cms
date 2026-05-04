# AMS - Ultimate Article Management System

**AMS (Article Management System)** is a high-performance, full-stack CMS built with **Next.js 16/15**, **MongoDB**, and **Tailwind CSS**. Designed for both professional publishers and community platforms, it features a sleek dark-mode aesthetic with glassmorphism and a suite of powerful management tools.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![NextAuth](https://img.shields.io/badge/NextAuth-FFD000?style=for-the-badge&logo=nextauth&logoColor=black)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## 🚀 Key Features

- **🔐 Robust Authentication**: Secure multi-role authentication (Admin/Author) powered by **NextAuth.js (Auth.js)** and **BcryptJS**.
- **📊 Interactive Admin Dashboard**: A comprehensive management panel for moderating articles, managing members, and organizing taxonomies.
- **📄 Advanced Rich-Text Editor**: A custom-built **Tiptap** editor for creating beautiful articles with headings, alignment, links, and formatting.
- **🛡️ Secure Route Middleware**: Strict backend checks to ensure only authorized administrators can access sensitive management tools.
- **👤 User Profile & Security**: Self-service profile management allowing users to update their identity and account credentials (passwords).
- **🌱 Automated Seeding**: A Laravel-style seeder to populate the database with realistic sample data for testing.
- **🎨 Premium UI/UX**: Professional dark-themed interface with glassmorphism effects, custom modals, and smooth animations using **Lucide Icons**.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) using [Mongoose](https://mongoosejs.com/)
- **Auth**: [NextAuth.js](https://next-auth.js.org/)
- **Editor**: [Tiptap](https://tiptap.dev/)
- **Icons**: [Lucide-React](https://lucide.dev/)

---

## 🏗️ Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Local or Cloud)

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/YourUsername/ams.git
cd ams
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and add your connection details:
```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

### 4. Database Seeding (Optional)
To populate the database with sample users and articles:
```bash
npm run db:seeder
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the result.

---

## 📁 Project Structure

- `src/app/` - Next.js App Router (Pages, API routes, Layouts)
- `src/components/` - Reusable UI components and specific business logic
- `src/models/` - Mongoose schemas for MongoDB
- `src/lib/` - Shared utility functions and database connection logic
- `scripts/` - Database seeder and automation scripts

---

## 🛡️ License
Distributed under the MIT License. See `LICENSE` for more information.

## 🤝 Contributing
Contributions are welcome! Please feel free to open a Pull Request or report an Issue.

---

**Developed with ❤️ by [Atif imran]**
