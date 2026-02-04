# Project Split Implementation Checklist

Use this checklist to track progress when splitting the repository into two projects.

## Pre-Split Preparation

- [ ] Read `SPLIT_ARCHITECTURE.md` to understand the split
- [ ] Read `SPLIT_QUICKSTART.md` for step-by-step instructions
- [ ] Read `PROJECT_SPLIT_GUIDE.md` for detailed information
- [ ] Backup current repository (create a branch or fork)
- [ ] Document all current environment variables
- [ ] Make note of all current deployment settings

## Phase 1: Create Discord Bot Dashboard (New Repository)

### 1.1 Repository Setup
- [ ] Create new GitHub repository: `Discord-Bot-Dashboard`
- [ ] Clone the new repository locally
- [ ] Initialize Next.js project with TypeScript and Tailwind

### 1.2 Copy Discord Features
- [ ] Copy `src/app/guilds/` directory
- [ ] Copy `src/app/azure-supporter/` directory
- [ ] Copy `src/app/api/auth/discord/` directory
- [ ] Copy `src/app/api/discord/` directory
- [ ] Copy `src/app/api/guilds/` directory
- [ ] Copy `src/components/rank-card/` directory
- [ ] Copy `src/components/main/` directory (shared UI components)
- [ ] Copy `src/lib/firebase-admin.ts`
- [ ] Copy `src/lib/rank-card/` directory
- [ ] Copy `src/lib/rank-card-utils.ts`
- [ ] Copy `src/lib/utils.ts`

### 1.3 Setup Configuration
- [ ] Install dependencies: `discord.js`, `firebase-admin`, etc.
- [ ] Create `.env.example` with Discord variables
- [ ] Copy `tailwind.config.ts` and adjust
- [ ] Copy `tsconfig.json` and adjust
- [ ] Update `package.json` name and dependencies
- [ ] Setup `.gitignore` file

### 1.4 Documentation
- [ ] Create README.md with Discord bot setup
- [ ] Copy `RANK_CARD_DOCS.md`
- [ ] Copy `RANK_CARD_SETUP.md`
- [ ] Copy `SECURITY_SUMMARY.md`
- [ ] Document environment variables needed
- [ ] Add deployment instructions

### 1.5 Testing New Repository
- [ ] Run `npm install`
- [ ] Run `npm run build` (should succeed)
- [ ] Run `npm run dev`
- [ ] Test rank card pages work
- [ ] Test role selection page works
- [ ] Test OAuth flow works
- [ ] Test API endpoints work
- [ ] Fix any import path issues

## Phase 2: Clean Up Main Website (This Repository)

### 2.1 Remove Discord Code
- [ ] Remove `src/app/guilds/` directory
- [ ] Remove `src/app/azure-supporter/` directory
- [ ] Remove `src/app/api/auth/discord/` directory
- [ ] Remove `src/app/api/discord/` directory
- [ ] Remove `src/app/api/guilds/` directory
- [ ] Remove `src/components/rank-card/` directory
- [ ] Remove `src/lib/firebase-admin.ts`
- [ ] Remove `src/lib/rank-card/` directory
- [ ] Remove `src/lib/rank-card-utils.ts`

### 2.2 Remove Discord Documentation
- [ ] Remove `RANK_CARD_DOCS.md`
- [ ] Remove `RANK_CARD_SETUP.md`
- [ ] Remove `SECURITY_SUMMARY.md`
- [ ] Remove `RANK_CARD_SETUP.md`
- [ ] Archive `INTEGRATION_SUMMARY.md` or remove it

### 2.3 Update Dependencies
- [ ] Run `npm uninstall discord.js`
- [ ] Run `npm uninstall firebase-admin`
- [ ] Run `npm uninstall bufferutil`
- [ ] Run `npm uninstall utf-8-validate`
- [ ] Run `npm uninstall zlib-sync`
- [ ] Clean up `package.json`

### 2.4 Update Configuration
- [ ] Update `.env.example` (remove Discord variables)
- [ ] Update `.gitignore` if needed
- [ ] Check `next.config.mjs` for Discord-specific settings
- [ ] Verify `tailwind.config.ts` doesn't have unused imports

### 2.5 Update Documentation
- [ ] Update `README.md` to remove Discord sections
- [ ] Add link to Discord-Bot-Dashboard repository
- [ ] Update `HOMEPAGE_GUIDE.md` if needed
- [ ] Remove references to rank cards from homepage docs
- [ ] Add note about split in README

### 2.6 Testing Main Website
- [ ] Run `npm install`
- [ ] Run `npm run build` (should succeed)
- [ ] Run `npm run dev`
- [ ] Test homepage works
- [ ] Test portfolio page works
- [ ] Test blog works
- [ ] Test MNSW page works
- [ ] Test WebGL background renders
- [ ] Test intent parser works
- [ ] Verify no broken links to Discord features

## Phase 3: Deployment Setup

### 3.1 Deploy Personal Website (Azuret.me)
- [ ] Create/update Vercel project for personal website
- [ ] Set domain: `azuret.net`
- [ ] Configure environment variables (only portfolio/Firebase client)
- [ ] Deploy and verify
- [ ] Test all pages in production
- [ ] Update DNS if needed

### 3.2 Deploy Discord Bot Dashboard
- [ ] Create new Vercel project for bot dashboard
- [ ] Set domain: `bot.azuret.net` or chosen subdomain
- [ ] Configure environment variables (Discord + Firebase admin)
- [ ] Deploy and verify
- [ ] Test rank card system in production
- [ ] Test role selection in production
- [ ] Test OAuth flow in production
- [ ] Update Discord OAuth redirect URLs

### 3.3 Update Cross-References
- [ ] Update links in personal website to point to bot dashboard
- [ ] Update README links in both repos
- [ ] Add navigation between projects if needed
- [ ] Update any external documentation

## Phase 4: Verification & Cleanup

### 4.1 Functionality Testing
- [ ] Personal website: Test all pages
- [ ] Personal website: Test all interactive features
- [ ] Personal website: Test mobile responsiveness
- [ ] Bot dashboard: Test rank card lookups
- [ ] Bot dashboard: Test role assignment
- [ ] Bot dashboard: Test OAuth login
- [ ] Bot dashboard: Test mobile responsiveness

### 4.2 Performance Testing
- [ ] Personal website: Check bundle size (should be ~40% of original)
- [ ] Personal website: Check load times
- [ ] Bot dashboard: Check bundle size (should be ~60% of original)
- [ ] Bot dashboard: Check load times
- [ ] Both: Verify no unnecessary dependencies loaded

### 4.3 Security Review
- [ ] Verify Discord secrets not in personal website repo
- [ ] Verify Firebase Admin SDK only in bot dashboard
- [ ] Check `.env.example` files don't contain real secrets
- [ ] Verify production environment variables set correctly
- [ ] Test that unauthorized access is blocked

### 4.4 Documentation Review
- [ ] Personal website README is clear and accurate
- [ ] Bot dashboard README is clear and accurate
- [ ] Environment variable examples are complete
- [ ] Setup instructions are tested and work
- [ ] Links between repos are correct

### 4.5 Git & GitHub Cleanup
- [ ] Commit all changes to personal website
- [ ] Commit all changes to bot dashboard
- [ ] Tag both repos with version numbers
- [ ] Update repo descriptions on GitHub
- [ ] Update repo topics/tags on GitHub
- [ ] Archive old branches if needed

## Phase 5: Final Steps

### 5.1 Communication
- [ ] Announce split to users/collaborators
- [ ] Update any external links
- [ ] Update social media links if applicable
- [ ] Update portfolio/resume with new architecture

### 5.2 Monitoring
- [ ] Set up monitoring for personal website
- [ ] Set up monitoring for bot dashboard
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Monitor for any 404s or broken links
- [ ] Watch for deployment issues

### 5.3 Backup & Archive
- [ ] Create backup of pre-split repository
- [ ] Archive `SPLIT_ARCHITECTURE.md` and related docs
- [ ] Document the split in project history
- [ ] Keep old deployment for rollback if needed

## Rollback Plan

If issues arise, you can rollback:

### Quick Rollback Steps
- [ ] Keep old deployment running until split is verified
- [ ] Have backup of pre-split code (branch/fork)
- [ ] Document original environment variables
- [ ] Can restore from backup branch
- [ ] Can revert DNS changes

### When to Rollback
- Critical functionality broken in either project
- Database/Firebase issues
- OAuth authentication broken
- Performance significantly degraded
- User-facing errors not quickly fixable

## Success Criteria

The split is successful when:

- [ ] ✅ Personal website deploys and works independently
- [ ] ✅ Bot dashboard deploys and works independently
- [ ] ✅ No broken links or 404 errors
- [ ] ✅ All features work as before the split
- [ ] ✅ Bundle sizes are reduced
- [ ] ✅ Build times are faster
- [ ] ✅ Security is improved (secrets isolated)
- [ ] ✅ Documentation is clear and complete
- [ ] ✅ Both projects can be updated independently

## Time Tracking

Track your progress:

- **Phase 1** (New repo setup): _____ hours
- **Phase 2** (Cleanup main repo): _____ hours
- **Phase 3** (Deployment): _____ hours
- **Phase 4** (Verification): _____ hours
- **Phase 5** (Final steps): _____ hours
- **Total Time**: _____ hours

**Estimated Time**: 6-11 hours total

## Notes & Issues

Use this section to track any issues or notes during the split:

```
Date: ____________
Issue: ____________________________________________________________
Solution: _________________________________________________________

Date: ____________
Issue: ____________________________________________________________
Solution: _________________________________________________________

Date: ____________
Issue: ____________________________________________________________
Solution: _________________________________________________________
```

## Resources

- `SPLIT_ARCHITECTURE.md` - Visual overview of split
- `SPLIT_QUICKSTART.md` - Quick start guide
- `PROJECT_SPLIT_GUIDE.md` - Detailed guide
- `INTEGRATION_SUMMARY.md` - Original feature integration docs

## Support

If you encounter issues:
1. Check the error messages carefully
2. Review the relevant documentation
3. Check environment variables are set correctly
4. Verify all files were copied/removed correctly
5. Test in development before deploying to production
6. Keep backup deployment running until verified

---

**Started**: ___________
**Completed**: ___________
**Status**: ⬜ Not Started | ⬜ In Progress | ⬜ Complete | ⬜ Rolled Back
