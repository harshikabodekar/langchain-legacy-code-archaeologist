# 1. Module Map

Project: leaddesk | Files analysed: 15

> Summaries are AI-generated.

| File | Lines | What it does |
|------|-------|--------------|
| `middleware.js` | 50 | It protects admin routes by redirecting unauthenticated users to login. |
| `supabase.sql` | 39 | This script creates a secure `leads` table in Supabase, allowing public submissions and admin management. |
| `components/AdminHeader.js` | 44 | It renders an admin header component that manages authentication state and handles user sign-out. |
| `components/Footer.js` | 19 | It renders a styled footer component with a link to the Digital Heroes training task. |
| `components/core/in-view.jsx` | 27 | It animates children using Framer Motion when they scroll into view. |
| `lib/validateLead.js` | 38 | It validates lead contact form data and returns validation errors or sanitized data. |
| `lib/supabase/client.js` | 8 | It initializes and returns a Supabase client for use in browser environments. |
| `lib/supabase/server.js` | 38 | It creates Supabase clients for server-side authentication and database operations in Next.js. |
| `app/layout.js` | 14 | It defines the root HTML layout, global styles, and metadata for the LeadDesk application. |
| `app/page.js` | 353 | This file renders the interactive homepage with animated parallax effects and a lead generation form. |
| `app/admin/page.js` | 163 | It provides an authenticated admin dashboard to view, search, update, and manage customer leads. |
| `app/admin/(dashboard)/layout.js` | 12 | It provides a consistent layout with a header and footer for admin pages. |
| `app/admin/(dashboard)/page.js` | 146 | This React component renders an admin dashboard to view, search, and update customer leads. |
| `app/admin/login/page.js` | 91 | This file renders an admin login form and authenticates users via Supabase. |
| `app/api/leads/route.js` | 34 | It validates incoming lead data and securely saves it to the Supabase database. |
