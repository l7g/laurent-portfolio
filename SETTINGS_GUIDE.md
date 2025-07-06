# Portfolio Admin Settings System

## Overview

Your portfolio now includes a comprehensive settings management system that allows you to update content dynamically without redeploying your website.

## Features

✅ **Dynamic CV/Resume URL** - Update your CV link instantly
✅ **Social Media Links** - Manage GitHub, LinkedIn, and other social links
✅ **Site Content** - Update titles, descriptions, and hero content
✅ **Profile Information** - Manage your location, experience, contact details
✅ **Public/Private Settings** - Control which settings are accessible to the frontend
✅ **Type Safety** - Support for text, number, boolean, and JSON settings

## How to Use

### 1. Access Admin Panel

Navigate to `/admin` in your browser and log in to access the admin dashboard.

### 2. Go to Settings Tab

Click on the "Settings" tab in the admin navigation.

### 3. Quick Setup

Use the predefined settings cards to quickly set up common portfolio elements:

- **CV/Resume URL** - Link to your CV file (hosted anywhere)
- **LinkedIn Profile** - Your LinkedIn profile URL
- **GitHub Profile** - Your GitHub profile URL
- **Profile Image** - URL to your profile photo
- **Site Title** - Main title of your portfolio
- **Hero Subtitle** - Subtitle in the hero section
- **Contact Phone** - Your contact phone number
- **Location** - Your current city/location
- **Years of Experience** - Professional experience count

### 4. Edit Existing Settings

Click on any setting card or value to edit it inline. Changes are saved automatically.

### 5. Add Custom Settings

Use the "Add Custom Setting" button to create your own settings:

- **Key**: Unique identifier (e.g., "twitter_url")
- **Value**: The setting value
- **Type**: text, number, boolean, or JSON
- **Description**: What this setting is for
- **Public**: Whether this setting can be accessed by your website

## Using Settings in Your Components

### Option 1: usePublicSettings Hook

```tsx
import { usePublicSettings } from "@/lib/use-settings";

function MyComponent() {
  const { getSetting, loading } = usePublicSettings();

  const cvUrl = getSetting("cv_url", "/default-cv.pdf");
  const githubUrl = getSetting("github_url", "https://github.com");

  if (loading) return <div>Loading...</div>;

  return (
    <a href={cvUrl} target="_blank">
      Download CV
    </a>
  );
}
```

### Option 2: Direct API Call

```tsx
import { getPublicSetting } from "@/lib/use-settings";

// In a server component or API route
const cvUrl = await getPublicSetting("cv_url", "/default-cv.pdf");
```

### Option 3: API Endpoint

```javascript
// Get all public settings
fetch("/api/public/settings")
  .then((res) => res.json())
  .then((data) => {
    const settings = data.data;
    console.log(settings.cv_url);
  });
```

## Example Integration

The hero section has been updated to use dynamic settings:

```tsx
const HeroSection = () => {
  const { getSetting } = usePublicSettings();

  const cvUrl = getSetting("cv_url", "/Laurent_Cv.pdf");
  const heroSubtitle = getSetting("hero_subtitle", "Full Stack Developer");
  const githubUrl = getSetting("github_url", siteConfig.links.github);

  return (
    <div>
      <Button href={cvUrl}>View CV</Button>
      <a href={githubUrl}>GitHub</a>
    </div>
  );
};
```

## Benefits

1. **No Redeployment** - Update content instantly without code changes
2. **Version Control Safe** - Settings are stored in database, not code
3. **Type Safety** - Different data types supported
4. **Fallback Values** - Graceful degradation if settings don't exist
5. **Public/Private Control** - Sensitive settings stay private
6. **Easy Management** - User-friendly admin interface

## API Endpoints

- `GET /api/settings` - Get all settings (admin only)
- `POST /api/settings` - Create/update setting (admin only)
- `PUT /api/settings/[key]` - Update specific setting (admin only)
- `DELETE /api/settings/[key]` - Delete setting (admin only)
- `GET /api/public/settings` - Get public settings (public access)

## Database Schema

```prisma
model site_settings {
  id          String   @id @default(cuid())
  key         String   @unique
  value       String
  type        String   @default("text")
  description String?
  isPublic    Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## Security

- Only public settings are accessible via the public API
- Admin settings require authentication
- Settings are validated on the server side
- SQL injection protection via Prisma ORM

---

Now you can update your portfolio content dynamically! 🚀
