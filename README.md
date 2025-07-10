# Modern Portfolio Website

A professional portfolio website built with Next.js 15, featuring a comprehensive blog system, admin panel, and responsive design. Perfect for developers, designers, and professionals looking to showcase their work.

## ✨ Features

### Core Features

- 📱 **Fully Responsive** - Optimized for desktop, tablet, and mobile
- 🎨 **Modern UI/UX** - Clean design with smooth animations
- 🌙 **Dark/Light Theme** - Automatic theme switching support
- 📧 **Contact System** - Integrated contact form with email notifications
- 🚀 **Fast Performance** - Built with Next.js 15 App Router

### Content Management

- 📝 **Blog System** - Full-featured blog with rich text editor
- 🏷️ **Categories & Series** - Organize content with visual selectors
- 👨‍💼 **Admin Panel** - Complete admin interface for content management
- 🎓 **Education Tracking** - Academic achievements and course progress
- 💼 **Project Showcase** - Interactive project gallery
- 🛠️ **Skills Management** - Dynamic skills display with categories

### Technical Features

- 🔐 **Authentication** - Secure admin access with NextAuth.js
- 🗃️ **Database Integration** - PostgreSQL with Prisma ORM
- 📁 **File Management** - Image upload and storage system
- 🔍 **SEO Optimized** - Meta tags, sitemap, and structured data

## Tech Stack

- **Frontend**: Next.js 15 with App Router, TypeScript
- **UI Framework**: HeroUI components with Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Email Service**: Resend API
- **File Storage**: Vercel Blob
- **Animations**: Framer Motion
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Resend account for email functionality

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd portfolio
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Environment setup:

   ```bash
   cp .env.example .env.local
   ```

4. Configure your environment variables in `.env.local`:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/portfolio"
   NEXTAUTH_SECRET="your-secret-key"
   RESEND_API_KEY="your-resend-api-key"
   ADMIN_EMAIL="your-email@domain.com"
   ADMIN_PASSWORD="secure-password"
   ```

5. Set up the database:

   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
portfolio/
├── app/                     # Next.js 15 App Router
│   ├── admin/              # Admin panel pages
│   │   ├── blog/           # Blog management
│   │   └── projects/       # Project management
│   ├── api/                # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── blog/           # Blog API
│   │   └── contact/        # Contact form API
│   ├── blog/               # Public blog pages
│   ├── projects/           # Project showcase pages
│   └── (other pages)       # Home, contact, education, etc.
├── components/             # Reusable React components
│   ├── admin/              # Admin-specific components
│   │   ├── category-selector.tsx
│   │   ├── series-selector.tsx
│   │   └── rich-text-editor.tsx
│   └── (ui components)     # Public UI components
├── lib/                    # Utility functions and configurations
├── prisma/                 # Database schema and migrations
├── public/                 # Static assets
├── scripts/                # Database and setup scripts
├── styles/                 # Global styles
└── types/                  # TypeScript type definitions
```

│ ├── api/ # API routes
│ ├── education/ # Education page
│ ├── projects/ # Projects showcase
│ ├── blog/ # Blog system
│ ├── admin/ # Admin dashboard
│ └── degree/ # Academic details
├── components/ # Reusable React components
├── lib/ # Utility functions and configurations
├── prisma/ # Database schema and seeds
├── public/ # Static assets
└── config/ # Site configuration

````

## Key Features

### Dynamic Content Management

- Admin panel for managing projects, blog posts, and education data
- Real-time content updates without redeployment
- Image upload and management system

### Academic Progress Tracking

- University program progress with real-time calculations
- Course management and grade tracking
- Skills development timeline

### Contact System

- Form validation and spam protection
- Email notifications with professional templates
- Database storage for all inquiries

## Development Notes

This project demonstrates modern web development practices including:

- Server-side rendering with Next.js 15
- Type-safe database operations with Prisma
- Component-driven architecture
- Responsive design principles
- Performance optimization techniques

The application uses server components where possible for optimal performance and SEO, with client components only when interactivity is required.

## Database Schema

The application uses PostgreSQL with the following main entities:

- Projects with categories and technologies
- Blog posts with rich content
- Academic programs and courses
- Contact form submissions
- User authentication and sessions

## Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Configure environment variables in the dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

Ensure all environment variables are configured in your production environment:

- Database connection string
- Email service credentials
- Authentication secrets
- File storage configuration

## 🛠️ Admin Features

### Blog Management
- **Rich Text Editor** - Full WYSIWYG editor with formatting options
- **Category System** - Visual category selector with icons and colors
- **Series Organization** - Group related posts with difficulty levels
- **SEO Optimization** - Meta descriptions and slug management

### Content Management
- **Project Showcase** - Add/edit projects with images and technologies
- **Skills Management** - Organize skills by categories
- **Education Tracking** - Academic programs and course progress
- **Settings Panel** - Toggle visibility and manage content

### Security
- **Admin Authentication** - Secure login system
- **Protected Routes** - Admin-only access to management features
- **Input Validation** - Comprehensive form validation and sanitization

## 🎨 Customization

### Theming
The project uses HeroUI with Tailwind CSS for easy customization:

```javascript
// tailwind.config.js
module.exports = {
  content: [/* ... */],
  theme: {
    extend: {
      colors: {
        primary: {
          // Your brand colors
        }
      }
    }
  }
}
````

### Components

All components are modular and can be easily customized:

- `components/` - Reusable UI components
- `styles/globals.css` - Global styles and CSS variables
- `config/site.ts` - Site configuration and metadata

## Contributing

This is a personal portfolio project. While it's primarily for showcasing my work, feedback and suggestions are welcome.

## License

This project is open source and available under the MIT License.

---

_Built with Next.js, TypeScript, and modern web technologies._
