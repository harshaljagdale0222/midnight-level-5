git init
git config user.name "Midnight Hacker"
git config user.email "hacker@midnight.network"

git add README.md
git commit -m "docs: Initial project documentation and architecture"

git add frontend/package.json
git commit -m "chore: Setup frontend Next.js dependencies"

git add frontend/src/app/globals.css
git commit -m "style: Setup global CSS and Tailwind theme"

git add frontend/src/app/layout.tsx
git commit -m "feat: Implement root layout and navigation header"

git add frontend/src/app/page.tsx
git commit -m "feat: Build landing page with architecture overview"

git add frontend/src/components/ui.tsx
git commit -m "feat: Create reusable UI components"

git add frontend/src/lib/api.ts
git commit -m "feat: Implement frontend API client"

git add frontend/src/app/login/
git commit -m "feat: Implement multi-role authentication system"

git add frontend/src/app/claimant/
git commit -m "feat: Implement claimant dashboard and submission flow"

git add frontend/src/app/insurer/
git commit -m "feat: Implement insurer verification dashboard"

git add frontend/src/app/auditor/
git commit -m "feat: Implement auditor compliance dashboard"

git add backend/
git commit -m "feat: Implement Express backend with SQLite and Prisma ORM"

git add midnight/index.ts
git commit -m "feat: Implement Midnight ZK proof simulator"

git add midnight/PrivacyGuard.compact
git commit -m "feat: Write Midnight Compact smart contract"

git add .github/
git commit -m "ci: Configure GitHub Actions for CI/CD"

git add .
git commit -m "chore: Final project polishing"
