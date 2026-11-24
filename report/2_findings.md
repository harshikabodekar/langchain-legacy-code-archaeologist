# 2. Cleanup Candidates

> Items under the first two headings are AI-generated judgments. Verify before acting.

## Files nobody imports

None found.

## Very similar files

### `app/admin/page.js` and `app/admin/(dashboard)/page.js` (95% similar)
- Issue: Duplicate admin page files exist at app/admin/page.js and app/admin/(dashboard)/page.js, which creates route conflicts and confusion since app/admin/page.js includes sign out logic and router navigation while the other does not.
- Risk: low
- Suggestion: Delete app/admin/(dashboard)/page.js if the route group layout is not needed, or keep app/admin/(dashboard)/page.js and move the sign-out functionality there if the dashboard layout structure is intended.

## Other checks (done by code, not AI)

- `.history/` (editor backup copies) is in the repo. Add it to `.gitignore`.
