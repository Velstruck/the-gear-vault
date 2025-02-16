# The Gear Vault

A modern product showcase website built with React, Tailwind CSS, and Appwrite. Display your favorite gadgets and tech products with links to purchase them from various e-commerce platforms.

## Features

- Modern, responsive UI with a beautiful product grid
- Admin authentication for managing products
- Easy product management with image upload support
- Product suggestion system for visitors
- Integration with major e-commerce platforms (Amazon, Flipkart, etc.)
- Built with React and Tailwind CSS for a modern development experience

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Appwrite instance (self-hosted or cloud)

## Setup

1. Clone the repository:
```bash
git clone https://github.com/Velstruck/the-gear-vault.git
cd thegearvault
```

2. Install dependencies:
```bash
npm install
```
3. Configure environment variables:
   Create a `.env` file in the root directory:
```env
VITE_APPWRITE_ENDPOINT=your-appwrite-endpoint
VITE_APPWRITE_PROJECT_ID=your-project-id
VITE_APPWRITE_DATABASE_ID=your-database-id
VITE_APPWRITE_BUCKET_ID=your-bucket-id
```

4. Start the development server:
```bash
npm run dev
```
