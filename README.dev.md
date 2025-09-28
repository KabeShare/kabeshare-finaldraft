# KabeShare Development Setup

## Quick Start (Development Mode)

The application is now configured to work without a database or authentication service for development purposes.

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The application should now run at `http://localhost:3000` using dummy data.

## Full Setup (Production Ready)

### 1. Database Setup (MongoDB)

1. Create a MongoDB database (local or cloud)
2. Update `.env.local` with your MongoDB connection string:
   ```
   MONGODB_URI=mongodb://localhost:27017/your-database-name
   # OR for MongoDB Atlas:
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/your-database-name
   ```

### 2. Authentication Setup (Clerk)

1. Create a free account at [Clerk.dev](https://dashboard.clerk.dev/)
2. Create a new application
3. Copy your keys and update `.env.local`:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
   CLERK_SECRET_KEY=sk_test_your_actual_key_here
   ```

### 3. Environment Variables

Copy `.env.example` to `.env.local` and fill in your actual values:

```bash
cp .env.example .env.local
```

## Current Features

- ✅ Product listing with dummy data fallback
- ✅ Responsive design
- ✅ SEO optimization with canonical links
- ✅ Japanese localization
- ✅ Error handling for missing services
- ✅ Development mode without authentication

## File Structure

```
app/
├── layout.js          # Root layout with conditional authentication
├── page.jsx           # Homepage
├── api/product/       # Product API endpoints with fallbacks
├── all-products/      # Product listing page
├── vision/           # About/Vision page
└── product/[id]/     # Product detail pages

components/
├── ConditionalClerkProvider.jsx  # Safe authentication wrapper
├── HomeProducts.jsx              # Recent products display
└── ...

config/
└── db.js             # Database connection with error handling

models/
└── Product.js        # Product data model
```

## Troubleshooting

### Error: "Publishable key not valid"

- The app is now configured to work without valid Clerk keys in development
- For production, set up proper Clerk authentication keys

### Error: "Failed to fetch products"

- The app will automatically use dummy data if database is unavailable
- Check your MongoDB connection string in `.env.local`

### Database Connection Issues

- Ensure MongoDB is running (if using local)
- Verify connection string format
- Check network connectivity for cloud databases

## Development Notes

- The application gracefully degrades when services are unavailable
- Dummy data is used as fallback for missing database
- Authentication is optional in development mode
- All API routes have error handling with fallbacks
