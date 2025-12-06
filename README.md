# Visit Iraq - Tourism Directory Platform

A comprehensive tourism directory platform for discovering Iraq's accommodations, attractions, and tours. Built with Next.js 14, Neon PostgreSQL, and Stack Auth.

## Features

### User Roles
- **Admin**: Full platform management via environment credentials
- **Host**: Create and manage listings (requires approval)
- **User**: Browse listings with full contact/pricing access
- **Guest**: Limited listing view (sign up required for details)

### Key Features
- 🏨 **Mixed Listings**: Accommodations, attractions, and tours
- 🔐 **Authentication**: Neon Auth with Google OAuth
- ✅ **Approval Workflow**: Admin reviews all listings
- 🎨 **Iraqi Heritage Theme**: Vibrant Mesopotamian-inspired design
- 📱 **Responsive**: Mobile-first design

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Neon PostgreSQL
- **Auth**: Stack Auth (Neon Auth)
- **Styling**: Tailwind CSS
- **Deployment**: Netlify

## Getting Started

### Prerequisites
- Node.js 18+
- Neon account
- Google OAuth credentials (configured in Stack Auth)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd visit-iraq
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your credentials:
```env
DATABASE_URL=your-neon-connection-string
NEXT_PUBLIC_STACK_PROJECT_ID=your-stack-project-id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your-publishable-key
STACK_SECRET_SERVER_KEY=your-secret-key
ADMIN_EMAIL=admin@visitiraq.com
ADMIN_PASSWORD=your-secure-password
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. Run development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Database Setup

The database schema is automatically created when provisioning Neon Auth. Additional tables include:

- `user_roles`: Stores user role assignments
- `listings`: All listing data
- `admin_actions`: Audit log for admin actions

## Deployment to Netlify

1. Push your code to a Git repository
2. Connect the repository to Netlify
3. Set the build command: `npm run build`
4. Set the publish directory: `.next`
5. Add environment variables in Netlify dashboard

### Required Environment Variables for Production
```
DATABASE_URL
NEXT_PUBLIC_STACK_PROJECT_ID
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY
STACK_SECRET_SERVER_KEY
ADMIN_EMAIL
ADMIN_PASSWORD
NEXT_PUBLIC_APP_URL=https://your-netlify-domain.netlify.app
```

## User Guides

### For Admins
1. Visit `/admin/login` with env credentials
2. Review pending listings at `/admin/listings`
3. Approve or reject with reasons
4. Manage users at `/admin/users`

### For Hosts
1. Sign up with Google
2. Go to Dashboard and click "Become a Host"
3. Create listings at `/host/new`
4. Wait for admin approval
5. Manage listings at `/host`

### For Users
1. Sign up to see full listing details
2. Browse listings at `/listings`
3. Filter by type and region

## Project Structure

```
visit-iraq/
├── app/
│   ├── admin/          # Admin dashboard
│   ├── api/            # API routes
│   ├── auth/           # Auth pages
│   ├── dashboard/      # User dashboard
│   ├── host/           # Host dashboard
│   ├── listings/       # Public listings
│   └── page.tsx        # Homepage
├── components/
│   ├── layout/         # Header, Footer
│   ├── listings/       # Listing components
│   └── ui/             # Reusable UI components
├── lib/
│   ├── auth.ts         # Auth utilities
│   ├── db.ts           # Database queries
│   └── utils.ts        # Helpers
└── middleware.ts       # Route protection
```

## Color Theme

Iraqi Heritage Palette:
- **Primary**: #1e3a5f (Royal Blue - Ishtar Gate)
- **Secondary**: #d4a853 (Mesopotamian Gold)
- **Accent**: #c45d3e (Terracotta)
- **Background**: #faf6f1 (Warm Cream)

## License

MIT License
