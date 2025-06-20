# Resend Subdomain Setup Guide

## Overview

To avoid MX record conflicts between Resend (sending) and ProtonMail (receiving), we're using a subdomain approach:

- **Root domain** (`laurentgagne.com`): ProtonMail handles receiving emails
- **Mail subdomain** (`mail.laurentgagne.com`): Resend handles sending emails

## Resend Configuration

### 1. Update Resend Domain

1. Go to your Resend dashboard
2. Remove `laurentgagne.com` from domains
3. Add `mail.laurentgagne.com` as your new domain

### 2. DNS Records to Add

After adding the subdomain in Resend, you'll get specific DNS records. They should look similar to:

#### MX Record (for bounce handling)

```
Type: MX
Name: send (or send.mail.laurentgagne.com)
Value: feedback-smtp.eu-west-1.amazonaws.com
Priority: 10
TTL: 3600
```

#### SPF Record

```
Type: TXT
Name: send (or send.mail.laurentgagne.com)
Value: v=spf1 include:amazonses.com ~all
TTL: 3600
```

#### DKIM Record

```
Type: TXT
Name: resend._domainkey (or resend._domainkey.mail.laurentgagne.com)
Value: [Long DKIM key from Resend]
TTL: 3600
```

## Email Address Usage

### Sending Emails (via Resend)

- Contact form notifications: `contact@mail.laurentgagne.com`
- Auto-reply confirmations: `noreply@mail.laurentgagne.com`

### Receiving Emails (via ProtonMail)

- Contact inbox: `contact@laurentgagne.com`

## Code Changes Made

1. **Environment Variables**: Added `RESEND_FROM_EMAIL` and `RESEND_NOREPLY_EMAIL`
2. **Email Library**: Updated all `from` addresses to use the new subdomain variables
3. **Fallback Values**: Code includes fallback values if env vars are missing

## Benefits

✅ **No MX Conflicts**: Different domains handle sending vs receiving
✅ **Professional Setup**: Proper bounce handling and authentication
✅ **Scalable**: Easy to add more subdomains for different purposes
✅ **Reliable**: Each service operates independently

## Testing

After DNS propagation (2-24 hours):

1. Test contact form submission
2. Check Resend dashboard for successful sending
3. Check ProtonMail inbox for received emails
4. Verify bounce handling works

## Notes

- The `NEXT_PUBLIC_CONTACT_EMAIL` remains `contact@laurentgagne.com` (this is what users see)
- Internally, emails are sent from `contact@mail.laurentgagne.com`
- Users receive emails at `contact@laurentgagne.com` via ProtonMail
