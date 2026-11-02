# Module Map: leaddesk

Files analysed: 15

| File | Lines | What it does |
|------|-------|--------------|
| `middleware.js` | 50 | This Next.js middleware file refreshes user authentication sessions and protects admin routes by redirecting unauthenticated users to the login page and already-authenticated users away from it. |
| `supabase.sql` | 39 | This SQL script sets up a secure `leads` table in Supabase with Row Level Security, allowing the public to submit new leads while restricting viewing and updating privileges exclusively to authenticated administrators. |
| `components/AdminHeader.js` | 44 | This file renders an admin header component for a Next.js application that displays the logged-in user's email and provides a sign-out button using Supabase authentication. |
| `components/Footer.js` | 19 | This file exports a React footer component with dynamic light or dark theme styling that links to the Digital Heroes Training Task website. |
| `components/core/in-view.jsx` | 27 | This file exports a reusable React component that automatically animates its children using Framer Motion when they scroll into the viewport. |
| `lib/validateLead.js` | 38 | This file validates lead submission data (name, email, budget range, and message) against specific rules and returns validation errors along with cleaned data. |
| `lib/supabase/client.js` | 8 | This file exports a helper function to initialize and return a Supabase client configured for use in the browser within a Next.js application. |
| `lib/supabase/server.js` | 38 | This file exports two utility functions to initialize Supabase clients for Next.js server-side operations: one using user cookies for standard SSR and another using the service-role key for privileged backend tasks. |
| `app/layout.js` | 14 | This file serves as the root layout for a Next.js application named "LeadDesk," defining the global HTML structure, metadata, and CSS styles for all pages. |
| `app/page.js` | 353 | This React component renders the homepage for a website featuring a styled layout with scroll-based parallax animations and a validated lead-generation contact form that submits user data to an API endpoint. |
| `app/admin/page.js` | 163 | This file renders a Next.js admin dashboard component that allows administrators to securely view, search, update the status of, and sign out from a list of user leads fetched from Supabase. |
| `app/admin/(dashboard)/layout.js` | 12 | This file defines a shared layout component for the admin section, wrapping page content between a standardized header and footer. |
| `app/admin/(dashboard)/page.js` | 146 | This file renders an interactive React admin dashboard that fetches, searches, and updates the status of customer leads using Supabase. |
| `app/admin/login/page.js` | 91 | This file renders an admin login page in a Next.js application that authenticates users with Supabase using their email and password before redirecting them to the admin dashboard. |
| `app/api/leads/route.js` | 34 | This file is a Next.js API route that validates incoming lead data from a POST request and saves it to a Supabase database. |

## Findings

- `.history/` (editor backup copies) was committed into the repo. It should be in `.gitignore`.
