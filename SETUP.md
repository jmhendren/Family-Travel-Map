# Family Travel Map — Private Deployment Setup

## One-Time Setup (5 minutes)

### 1. Create a private GitHub repo

- Go to https://github.com/new
- **Repository name:** `Family-Travel-Map`
- **Visibility:** Private
- Click **Create repository**

### 2. Upload the deploy-family files

- On the new repo page, click **"uploading an existing file"** (or go to Add file > Upload files)
- Drag everything from this `deploy-family/` folder into the upload area:
  - `index.html`
  - `config.json` (contains your API key)
  - `destinations.json`
  - `destinations/` folder (all 16 JSON files)
- Commit the files

### 3. Enable GitHub Pages

- Go to **Settings** > **Pages** (left sidebar)
- Under **Source**, select **Deploy from a branch**
- Branch: `main`, folder: `/ (root)`
- Click **Save**
- Wait 1-2 minutes for deployment

### 4. Access your family map

Your private map will be at:
```
https://jmhendren.github.io/Family-Travel-Map/
```

The AI chat and itinerary generator will work immediately — no API key entry needed.

---

## How It Works

- `config.json` contains your Anthropic API key
- On page load, the map reads `config.json` and auto-configures the AI tools
- Since the repo is **private**, the key is not publicly visible
- The "Change API key" option in the chat still works if you ever need to override it

## Keeping It Updated

When you update the public travel map:
1. Copy the updated `index.html` and any changed `destinations/*.json` files into `deploy-family/`
2. Upload to the `Family-Travel-Map` repo
3. The `config.json` stays the same — you don't need to re-add it each time

## Security Notes

- Set a **monthly spending limit** on your Anthropic account as a safeguard
- Even in a private repo, anyone with repo access can see the API key
- If you ever rotate the key, just update `config.json` and re-upload
