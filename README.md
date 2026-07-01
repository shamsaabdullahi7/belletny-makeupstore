# Belletny Luxury Makeup E-Commerce

Production-ready MERN storefront for a premium beauty brand, with JWT auth, product catalog filters, cart context, admin CRUD, MongoDB/Mongoose, and Cloudinary image uploads.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Context API, Axios
- Backend: Node.js, Express, MongoDB, Mongoose
- Auth: JWT with protected/admin routes
- Media: Cloudinary via multipart product uploads

## Setup

1. Install dependencies:

```bash
cd backend
npm install

cd ../frontend
npm install
```

2. Create environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. Update `backend/.env` with your MongoDB URI, JWT secret, and Cloudinary credentials.

4. Optional: upload sample product images to your Cloudinary account and seed MongoDB.

Add image sources to `backend/.env` first. They can be local file paths or remote image URLs:

```bash
SEED_IMAGE_VELVET_ROUGE=/absolute/path/to/lipstick.jpg
SEED_IMAGE_SILK_FOUNDATION=/absolute/path/to/foundation.jpg
SEED_IMAGE_ROSE_PALETTE=/absolute/path/to/palette.jpg
```

Then run:

```bash
cd backend
npm run seed:products
```

This uploads the starter product images to the Cloudinary folder from `CLOUDINARY_FOLDER` and stores the Cloudinary `secure_url` plus `public_id` on each MongoDB product.

5. Run the API:

```bash
cd backend
npm run dev
```

6. Run the storefront:

```bash
cd frontend
npm run dev
```

7. Open `http://localhost:5173`.

## API Routes

- `POST /api/auth/register` creates an account.
- `POST /api/auth/login` returns user details and a JWT.
- `GET /api/auth/me` returns the authenticated user.
- `GET /api/products` lists products with `search`, `category`, `brand`, and `sort` query params.
- `GET /api/products/:id` returns one product.
- `POST /api/products` creates a product. Admin JWT required. Upload files as `images`.
- `PUT /api/products/:id` updates a product. Admin JWT required.
- `DELETE /api/products/:id` deletes a product and Cloudinary assets. Admin JWT required.

## Admin Access

Users register as non-admin by default. Promote an admin in MongoDB:

```js
db.users.updateOne({ email: "admin@example.com" }, { $set: { isAdmin: true } })
```

Then log in and visit `/admin`.

## Notes

The shop includes a small demo product fallback so the luxury storefront renders before you seed MongoDB. Real products from `/api/products` automatically replace it once records exist.
# belletny-makeupstore
