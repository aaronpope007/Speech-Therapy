# 🚨 Git History Cleanup - Security Emergency

## ⚠️ CRITICAL: Secrets Exposed in Git History

GitGuardian has detected that secrets have been exposed in your Git history. This is a **security emergency** that requires immediate action.

## 🔍 What Was Exposed

The following secrets were found in your Git history:
- Hardcoded passwords: `admin123`, `clinician123`
- Firebase API key patterns: `AIzaSyC...`
- Default user credentials in documentation

## 🛠️ Immediate Actions Required

### 1. **Revoke/Reset All Exposed Secrets**

**Firebase API Keys:**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Project Settings → Service Accounts
3. Generate new API keys
4. Update your `.env` file with new keys

**User Passwords:**
1. Change all default user passwords in Firebase Console
2. Update your `.env` file with new passwords
3. Notify any users who may have used the default credentials

### 2. **Clean Git History**

**Option A: If secrets are in the last commit only**

```bash
# 1. Remove secrets from files (already done)
git add .

# 2. Amend the last commit
git commit --amend --no-edit

# 3. Force push to overwrite history
git push --force-with-lease origin main
```

**Option B: If secrets are in multiple commits**

```bash
# 1. Use BFG Repo-Cleaner (recommended)
# Download BFG: https://rtyley.github.io/bfg-repo-cleaner/
java -jar bfg.jar --replace-text passwords.txt your-repo.git

# 2. Or use git filter-branch (more complex)
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch FIREBASE_SETUP.md' \
  --prune-empty --tag-name-filter cat -- --all
```

### 3. **Create passwords.txt for BFG**

Create a file called `passwords.txt` with the secrets to remove:

```txt
admin123
clinician123
AIzaSyC
```

## 🔒 Post-Cleanup Security Measures

### 1. **Update Environment Variables**

Create a new `.env` file with secure credentials:

```bash
# Generate secure passwords
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"

# Update your .env file with new values
VITE_ADMIN_PASSWORD=your-new-secure-password
VITE_CLINICIAN_PASSWORD=your-new-secure-password
```

### 2. **Verify Cleanup**

```bash
# Check if secrets are still in history
git log --all --full-history -- FIREBASE_SETUP.md
git log --all --full-history -- src/utils/
git log --all --full-history -- *.md

# Search for any remaining secrets
git log -p | grep -i "admin123\|clinician123\|AIzaSyC"
```

### 3. **Notify Collaborators**

If you have collaborators:
1. Inform them about the security breach
2. Ask them to delete their local copies
3. Have them re-clone the repository
4. Update their local `.env` files

## 🚨 Emergency Contact List

If you need immediate assistance:

1. **Firebase Support**: https://firebase.google.com/support
2. **GitHub Security**: https://github.com/security
3. **Your Development Team**

## 📋 Checklist

- [ ] Revoke Firebase API keys
- [ ] Change default user passwords
- [ ] Clean Git history
- [ ] Update `.env` file with new credentials
- [ ] Verify no secrets remain in history
- [ ] Notify collaborators
- [ ] Test application with new credentials
- [ ] Monitor for unauthorized access

## 🔄 Prevention for Future

1. **Use Environment Variables**: Never hardcode secrets
2. **Pre-commit Hooks**: Install git-secrets or similar
3. **Code Reviews**: Always review for hardcoded secrets
4. **Regular Audits**: Use tools like GitGuardian regularly
5. **Documentation**: Keep credentials out of documentation

## ⚡ Quick Commands

```bash
# Check current status
git status

# See what was in the last commit
git show --name-only HEAD

# Search for secrets in current files
grep -r "admin123\|clinician123\|AIzaSyC" . --exclude-dir=node_modules

# Clean and force push (BE CAREFUL!)
git add .
git commit --amend --no-edit
git push --force-with-lease origin main
```

## 🆘 If You Need Help

1. **Don't panic** - This is fixable
2. **Act quickly** - The longer secrets are exposed, the higher the risk
3. **Follow the steps** - Complete all cleanup steps
4. **Ask for help** - Contact your team or security experts

---

**Remember**: This is a security emergency. Complete all steps immediately and thoroughly.
