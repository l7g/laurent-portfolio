# Repository Branch Protection Guide

## Quick Setup Steps

### 1. Branch Protection Rules (GitHub Web Interface)

Go to: `Settings` → `Branches` → `Add rule`

**Branch name pattern:** `main`

**Enable these protections:**

```
✅ Require a pull request before merging
  ✅ Require approvals: 1
  ✅ Dismiss stale PR approvals when new commits are pushed
  ✅ Require review from code owners

✅ Require status checks to pass before merging
  ✅ Require branches to be up to date before merging
  ✅ Required status checks: build (GitHub Actions), vercel

  Note: Status checks appear in the list only after they run once.
  Create a PR first to trigger CI, then configure protection.

✅ Require conversation resolution before merging
✅ Require signed commits (recommended)
✅ Require linear history
✅ Do not allow bypassing the above settings

❌ Allow force pushes (keep disabled)
❌ Allow deletions (keep disabled)
```

### 2. Repository Rulesets (Modern Approach)

Go to: `Settings` → `Rules` → `New ruleset`

**Ruleset configuration:**

- **Name:** Main Branch Protection
- **Target:** Branches
- **Target branches:** `main`
- **Enforcement status:** Active

**Rules to add:**

- Restrict pushes
- Require a pull request before merging
- Require status checks to pass
- Require signed commits
- Block force pushes

### 3. Additional Security

- Enable Dependabot alerts
- Set up required status checks in CI/CD
- Use repository secrets for sensitive data
- Enable two-factor authentication on your account

## Why These Rules Matter

- **Pull request requirement:** Prevents direct pushes to main
- **Status checks:** Ensures code builds and deploys successfully
- **Review requirement:** Code quality control
- **Linear history:** Clean git history
- **Signed commits:** Verify commit authenticity
- **No force pushes:** Prevents history rewriting

## Development Workflow

1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes and commit
3. Push: `git push origin feature/new-feature`
4. Create PR on GitHub
5. Wait for status checks
6. Review and merge (squash merge recommended)
