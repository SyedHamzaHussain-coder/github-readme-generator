# 🔧 Changing Website URL - Complete Guide

When you change your website URL (from development to production, or changing domains), you need to update several configuration points. This guide covers everything you need to know.

## 📋 Quick Checklist

- [ ] Update environment variables
- [ ] Update GitHub OAuth App settings
- [ ] Update deployment configuration
- [ ] Test the OAuth flow

## 🛠️ Step-by-Step Instructions

### 1. Update Environment Variables

**File: `.env`**
```bash
# Update this to your new URL
REACT_APP_BASE_URL=https://yournewdomain.com

# You may need a new GitHub Client ID for production
REACT_APP_GITHUB_CLIENT_ID=your_new_github_client_id
```

**Different environments example:**
```bash
# Development
REACT_APP_BASE_URL=http://localhost:3000

# Staging
REACT_APP_BASE_URL=https://staging.yourdomain.com

# Production
REACT_APP_BASE_URL=https://yourdomain.com
```

### 2. Update GitHub OAuth App

**Go to GitHub Settings:**
1. Navigate to: https://github.com/settings/developers
2. Click "OAuth Apps"
3. Select your app (or create a new one for production)
4. Update these fields:

**Authorization callback URL:**
```
[YOUR_NEW_URL]/auth/callback
```

**Examples:**
- Development: `http://localhost:3000/auth/callback`
- Staging: `https://staging.yourdomain.com/auth/callback`
- Production: `https://yourdomain.com/auth/callback`

### 3. Multiple Environments Setup

For professional deployment, create separate OAuth apps:

**Development OAuth App:**
- Application name: `README Generator (Development)`
- Homepage URL: `http://localhost:3000`
- Callback URL: `http://localhost:3000/auth/callback`

**Production OAuth App:**
- Application name: `README Generator`
- Homepage URL: `https://yourdomain.com`
- Callback URL: `https://yourdomain.com/auth/callback`

### 4. Environment Files Setup

**`.env.development`**
```bash
REACT_APP_BASE_URL=http://localhost:3000
REACT_APP_GITHUB_CLIENT_ID=your_development_client_id
```

**`.env.production`**
```bash
REACT_APP_BASE_URL=https://yourdomain.com
REACT_APP_GITHUB_CLIENT_ID=your_production_client_id
```

**`.env.staging`** (optional)
```bash
REACT_APP_BASE_URL=https://staging.yourdomain.com
REACT_APP_GITHUB_CLIENT_ID=your_staging_client_id
```

### 5. Deployment Platform Configuration

**Vercel:**
```bash
# In Vercel dashboard, add environment variables:
REACT_APP_BASE_URL=https://yourdomain.vercel.app
REACT_APP_GITHUB_CLIENT_ID=your_production_client_id
```

**Netlify:**
```bash
# In Netlify dashboard, add environment variables:
REACT_APP_BASE_URL=https://yourdomain.netlify.app
REACT_APP_GITHUB_CLIENT_ID=your_production_client_id
```

**Custom Domain:**
```bash
REACT_APP_BASE_URL=https://yourdomain.com
REACT_APP_GITHUB_CLIENT_ID=your_production_client_id
```

## 🧪 Testing the Setup

### 1. Check Configuration
Open browser console and look for:
```
🔧 App Configuration
Environment: production
Base URL: https://yourdomain.com
GitHub Client ID: abcd123456...
Callback URL: https://yourdomain.com/auth/callback
```

### 2. Test OAuth Flow
1. Click "Login with GitHub"
2. Should redirect to GitHub with correct callback URL
3. After authorization, should return to your domain
4. Check browser console for any errors

### 3. Verify Callback URL
In the GitHub OAuth redirect, check that the `redirect_uri` parameter matches your configured callback URL.

## 🚨 Common Issues & Solutions

### Issue: "Redirect URI mismatch"
**Solution:** The callback URL in your GitHub OAuth app doesn't match the one being sent.
- Check `.env` file has correct `REACT_APP_BASE_URL`
- Verify GitHub OAuth app callback URL matches exactly
- Ensure no trailing slashes mismatch

### Issue: "Invalid client_id"
**Solution:** Wrong GitHub Client ID for the environment.
- Check you're using the correct Client ID for your environment
- Verify the Client ID is correctly set in environment variables
- Make sure the OAuth app exists and is active

### Issue: Environment variables not loading
**Solution:** 
- Environment variables must start with `REACT_APP_` in React
- Restart development server after changing `.env` files
- Check deployment platform environment variable settings

## 🔍 Debug Mode

The app includes helpful debugging. Check browser console for:
- Current configuration details
- OAuth URLs being generated
- Callback URL validation

## 📚 Additional Resources

- [GitHub OAuth Apps Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [React Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Netlify Environment Variables](https://docs.netlify.com/configure-builds/environment-variables/)

## 🆘 Need Help?

If you encounter issues:
1. Check browser console for error messages
2. Verify all URLs match exactly (no trailing slashes, correct protocol)
3. Test OAuth flow step by step
4. Check GitHub OAuth app settings
5. Verify environment variables are loading correctly
