# Portfolio Customization Guide

This guide explains how to customize your portfolio to match your personal brand and showcase your unique projects and skills.

## Theming and Colors

### Tailwind Configuration

The portfolio uses a custom saffron color theme. To change the color scheme:

1. Open `tailwind.config.js`
2. Modify the color palette in the theme section:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#fff9eb',
        100: '#ffefc7',
        200: '#ffdf8a',
        300: '#ffc94d',
        400: '#ffb020',
        500: '#f98a07',  // Primary color
        600: '#e56b02',
        700: '#bd4b06',
        800: '#983b0c',
        900: '#7c330f',
        950: '#481700',
      },
      // Add more custom colors here
    },
  },
},
```

### HeroUI Theme

To modify the HeroUI components styling:

1. Update the theme in `app/providers.tsx`:

```tsx
const theme = createTheme({
  theme: {
    colors: {
      primary: {
        DEFAULT: "#f98a07",
        foreground: "#ffffff",
      },
      // Other colors
    },
  },
});
```

### Dark Mode Colors

Dark mode styling can be adjusted in both the Tailwind configuration and HeroUI theme setup.

## Personal Information

### Site Configuration

Edit your personal information in `config/site.ts`:

```typescript
export const siteConfig = {
  name: "Your Name's Portfolio",
  description: "Your personal tagline or description",
  navItems: [
    // Navigation items
  ],
  links: {
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
    // Other social links
  },
};
```

### Hero Section

Customize your landing section in `components/hero-section.tsx`:

1. Change your name, title, and introduction
2. Update the call-to-action buttons
3. Modify the hero image (replace `/public/hero-image.png`)

### About Section

Edit your personal story in `components/about-section.tsx`:

1. Update your biography text
2. Change your experience highlights
3. Modify the values/principles section
4. Replace the profile image (`/public/profile-image.jpg`)

## Projects

### Adding Projects

Update your projects in `components/projects-section.tsx`:

```typescript
const projects = [
  {
    title: "Your Project Name",
    description: "A detailed description of your project...",
    image: "/projects/your-project-image.png", // Add image to public/projects/
    technologies: ["React", "Node.js", "MongoDB"], // Your tech stack
    featured: true, // Set to true for the main featured project
    links: {
      live: "https://your-project-url.com",
      github: "https://github.com/yourusername/your-project",
    },
    highlights: ["Key feature one", "Key feature two", "Key feature three"],
  },
  // Add more projects...
];
```

### Project Images

1. Add project images to the `/public/projects/` directory
2. Recommended image size: 1280x720px (16:9 ratio)
3. Optimize images for web (JPG or WebP format, <200KB)

## Skills

Customize your skills in `components/skills-section.tsx`:

```typescript
const frontendSkills = [
  { name: "React", level: 90 },
  { name: "TypeScript", level: 85 },
  // Add more skills
];

const backendSkills = [
  { name: "Node.js", level: 85 },
  { name: "Express", level: 80 },
  // Add more skills
];

const additionalCompetencies = [
  {
    title: "UI/UX Design",
    icon: <Palette />,
    description: "Your description here",
  },
  // Add more competencies
];
```

## Contact Forms

### Form Configuration

Both contact forms (general contact and demo request) are pre-configured. To customize:

1. Edit form fields in `components/contact-section.tsx`
2. Modify form validation rules
3. Update success/error messages

### Email Templates

Customize email notifications in the API route handlers:

1. General contact: `app/api/contact/route.ts`
2. Demo request: `app/api/demo-request/route.ts`

## Navigation

### Menu Items

Update the navigation in `config/site.ts`:

```typescript
export const siteConfig = {
  // ...other config
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    // Add or remove menu items
  ],
  navMenuItems: [
    // Mobile menu items (can be different from desktop)
  ],
};
```

### Adding New Pages

To add a new page to your portfolio:

1. Create a new directory in the `app` folder (e.g., `app/projects/`)
2. Add a `page.tsx` file in the new directory
3. Update navigation in `config/site.ts` to link to your new page

## SEO Optimization

### Metadata

Update SEO metadata in `app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: {
    default: "Your Name - Your Title",
    template: `%s - Your Name`,
  },
  description: "Your SEO-optimized description",
  keywords: [
    // Your keywords
  ],
  // Other metadata
};
```

### Open Graph

Customize social sharing preview data in `app/layout.tsx`:

```typescript
openGraph: {
  type: "website",
  locale: "en_US",
  url: "https://your-portfolio-url.com",
  title: "Your Name - Portfolio",
  description: "Your description for social sharing",
  siteName: "Your Name's Portfolio",
},
```

## Advanced Customization

### Custom Components

To add new components:

1. Create a new file in the `components` directory
2. Import and use it in your page files

### CSS Customization

1. Global styles can be edited in `styles/globals.css`
2. Component-specific styling can be added using Tailwind classes

### Animation Settings

Framer Motion animations can be customized in each component file:

```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  transition={{ duration: 0.5, delay: 0.2 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
>
  {/* Your content */}
</motion.div>
```

### Adding External Libraries

1. Install new packages: `npm install package-name`
2. Import and use in your components

---

Remember to rebuild your application (`npm run build`) after making significant changes to ensure everything works correctly.
