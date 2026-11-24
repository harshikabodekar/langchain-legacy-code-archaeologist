# 4. Refactor Plan

> AI-generated plan. Verify each step before changing any code.

## Step 1: Update .gitignore to exclude editor backups
- Why: It prevents local backup files in `.history/` from being tracked in the repository.
- Risk: low
- How to verify: Run `git status` after adding `.history/` to `.gitignore`.
- Human check needed: no

## Step 2: Clean up duplicate admin dashboard pages
- Why: Duplicate admin page files exist and create route conflicts and confusion.
- Risk: medium
- How to verify: Run `npm run build` to ensure Next.js compiles the admin route successfully without conflicts.
- Human check needed: yes
CONFLICT
AI finding said: Delete app/admin/(dashboard)/page.js if the route group layout is not needed, or keep app/admin/(dashboard)/page.js and move the sign-out functionality there if the dashboard layout structure is intended.
Human review said: the tool's advice (keep app/admin/page.js, delete the dashboard one) is wrong. Sign out lives in the layout, so app/admin/page.js is the older copy.