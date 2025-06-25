# ProfileCard SaaS

A Next.js-based SaaS platform for creating customizable profile cards as a link aggregator, similar to Linktree. Users can manage their profile cards via a CMS dashboard with a live preview, featuring advanced effects like tilt and gradients from the `reactbits.dev` ProfileCard component. Built with Next.js 15.3.4, Prisma 6.10.1, Tailwind CSS, and TypeScript.

## Features
- **Authentication**: NextAuth.js with email/password login.
- **Dashboard**: CMS for customizing `ProfileCard` settings (name, title, handle, images, gradients, etc.) with real-time preview.
- **ProfileCard**: Customizable card with tilt effects, gradients, and mobile device orientation support.
- **Link Management**: Add, edit, and delete links at `/dashboard/links`.
- **Database**: PostgreSQL with Prisma for managing users, profiles, links, and analytics.
- **Styling**: Dark theme (`#0a0a0a` background, `#ededed` text) using Tailwind CSS.
- **Deployment**: Ready for Vercel with environment variable support.

## Prerequisites
- Node.js >= 18.x
- PostgreSQL >= 14.x
- Git
- Vercel CLI (`npm install -g vercel`)
- GitHub account
- Cloudinary account (optional, for image uploads)
- Stripe account (optional, for payments)

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/profilecard-saas.git
cd profilecard-saas
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the root directory with the following:
```plaintext
DATABASE_URL="postgresql://postgres@localhost:5432/profilecard"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

- Generate a `NEXTAUTH_SECRET`:
  ```bash
  openssl rand -base64 32
  ```
- Replace `DATABASE_URL` with your PostgreSQL connection string.
- Obtain Stripe and Cloudinary keys from their respective dashboards (optional for now).

### 4. Set Up PostgreSQL Database
- Ensure PostgreSQL is running locally.
- Create a database named `profilecard`:
  ```bash
  psql -U postgres -c "CREATE DATABASE profilecard;"
  ```
- Run Prisma migrations:
  ```bash
  npx prisma migrate dev --name init
  ```
- Add a test user:
  ```bash
  psql -h localhost -p 5432 -U postgres -d profilecard -c "INSERT INTO \"User\" (id, email, name, password, plan, \"createdAt\") VALUES ('550e8400-e29b-41d4-a716-446655440000', 'test@example.com', 'Test User', '\$2b\$10\$jmTOxpFXHCJBbx3EVTRgDOT.MiCmxMu8Yzv9ondEnWtX7Zq/yXnqi', 'free', NOW());"
  ```

### 5. Add Placeholder Images
Place placeholder images in `public/` for `ProfileCard`:
```bash
mkdir -p public
curl https://via.placeholder.com/150 > public/avatar.png
curl https://via.placeholder.com/50 > public/icon.png
curl https://via.placeholder.com/220 > public/grain.png
```

### 6. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser:
- Log in at `/login` with `test@example.com` and `password123`.
- Navigate to `/dashboard` and `/dashboard/profile` to customize the `ProfileCard`.
- Navigate to `/dashboard/links` to manage links (URL, type, order).

### 7. Deploy to Vercel
- Install Vercel CLI:
  ```bash
  npm install -g vercel
  ```
- Log in:
  ```bash
  vercel login
  ```
- Deploy:
  ```bash
  vercel
  ```
- Add environment variables in Vercel’s dashboard (Settings > Environment Variables), matching `.env`.
- Update `DATABASE_URL` with a production PostgreSQL URL (e.g., from Neon or Vercel Postgres).
- Run migrations on the production database:
  ```bash
  vercel env pull .env
  npx prisma migrate deploy
  ```
- Add the test user to the production database (as above).

### Project Structure
- `src/app/`: Next.js App Router pages (`/login`, `/dashboard`, `/dashboard/profile`).
- `src/components/blocks/ProfileCard/`: `ProfileCard.tsx` and `ProfileCard.css` for the customizable card.
- `src/lib/`: Authentication (`auth.ts`) and Prisma client (`db.ts`).
- `prisma/`: Schema and migrations for PostgreSQL.
- `public/`: Static assets (images).

### Contributing
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

### License
MIT License. See [LICENSE](LICENSE) for details.

### Learn More
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Vercel Deployment](https://vercel.com/docs)
