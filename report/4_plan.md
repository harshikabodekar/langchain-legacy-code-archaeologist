# 4. Refactor Plan

> AI-generated plan. Verify each step before changing any code.

## Step 1: Add editor backup copies to `.gitignore`
- Why: `.history/` editor backup copies should not be tracked in version control.
- Risk: low
- How to verify: `git status`
- Human check needed: no

## Step 2: Clean up the duplicate admin pages
- Why: Duplicate admin page files exist at `app/admin/page.js` and `app/admin/(dashboard)/page.js`, which creates route conflicts and confusion.
- Risk: low
- How to verify: `npm run build`
- Human check needed: yes

CONFLICT
- AI finding said: Delete `app/admin/(dashboard)/page.js` if the route group layout is not needed, or keep `app/admin/(dashboard)/page.js` and move the sign-out functionality there if the dashboard layout structure is intended.
- Human review said: The tool's first option (delete the dashboard page) is wrong. Sign out already lives in AdminHeader in the layout, so `app/admin/page.js` is the older copy. Nothing needs moving. Proof: grep shows signOut only in `app/admin/page.js`, and `<AdminHeader />` (which has sign out) in `app/admin/(dashboard)/layout.js`.