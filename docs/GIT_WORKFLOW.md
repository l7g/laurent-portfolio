# Git Workflow Guide

## Branch Strategy

```
main (production) ← develop (integration) ← feature branches
```

## Rules

1. **`main` branch**: Production-ready code only
2. **`develop` branch**: Integration branch for all features
3. **Feature branches**: Created from up-to-date `develop`
4. **All changes**: Must go through `develop` before `main`

## Daily Workflow

### Starting a New Feature

```bash
# 1. Switch to develop and get latest
git checkout develop
git pull origin develop

# 2. Create feature branch from develop
git checkout -b feature/your-feature-name

# 3. Work on your feature
# Make commits...

# 4. Push feature branch
git push origin feature/your-feature-name

# 5. Create PR: feature/your-feature-name → develop
```

### Integrating Features

```bash
# After PR is merged to develop:
git checkout develop
git pull origin develop
git branch -d feature/your-feature-name  # Clean up local branch
```

### Releasing to Production

```bash
# When develop is stable and ready for production:
# Create PR: develop → main
# After merge:
git checkout main
git pull origin main
git checkout develop
git merge main  # Keep develop in sync
```

## Branch Protection Rules

- **main**: Requires PR review, no direct pushes
- **develop**: Requires PR review, no direct pushes
- **feature branches**: Can be pushed directly

## Example Commands

```bash
# Quick feature workflow
git checkout develop && git pull origin develop
git checkout -b feature/add-blog-comments
# ... make changes ...
git push origin feature/add-blog-comments
# Create PR via GitHub UI

# After PR merged
git checkout develop && git pull origin develop
git branch -d feature/add-blog-comments
```

## Benefits

- ✅ Clean commit history in main
- ✅ All features tested in develop first
- ✅ Easy rollbacks
- ✅ Clear separation of concerns
- ✅ No more 40-commit PRs!
