# How to Add Screenshots

## Quick Guide

### Step 1: Start the Application

Make sure WorkOS is running:

```bash
# Start all services
docker-compose -f docker/docker-compose.dev.yml up -d

# Or start manually
cd backend && npm run dev
cd frontend && npm run dev
```

### Step 2: Take Screenshots

Navigate to http://localhost:3000 and take screenshots of:

1. **Home/Landing Page** → Save as `01-home.png`
2. **Login Page** → Save as `02-login.png`
3. **Dashboard** (after login) → Save as `03-dashboard.png`
4. **Board View** (with items) → Save as `04-board-view.png`
5. **Item Details** → Save as `05-item-details.png`
6. **Workflow Management** → Save as `06-workflows.png`
7. **Analytics Dashboard** → Save as `07-analytics.png`
8. **Automation Builder** → Save as `08-automations.png`

### Step 3: Save Screenshots

Save all screenshots in this directory (`screenshots/`) with descriptive names.

### Step 4: Optimize (Optional)

Reduce file sizes if needed:

```bash
# Using ImageMagick (if installed)
for file in screenshots/*.png; do
  convert "$file" -quality 85 -resize 1920x1080 "${file%.png}-optimized.png"
done
```

### Step 5: Update README

After adding screenshots, update the main `README.md` to display them:

```markdown
## 📸 Screenshots

![Dashboard](screenshots/03-dashboard.png)
![Board View](screenshots/04-board-view.png)
![Analytics](screenshots/07-analytics.png)
```

### Step 6: Commit and Push

```bash
git add screenshots/*.png
git commit -m "Add application screenshots"
git push origin main
```

## Screenshot Tips

- **Use consistent browser window size** (1920x1080 recommended)
- **Hide sensitive data** (blur emails, names, etc.)
- **Show key features** clearly
- **Use descriptive filenames** with numbers for ordering
- **Keep file sizes reasonable** (< 1MB per image when possible)

## Tools

- **macOS:** Cmd + Shift + 4 (select area), Cmd + Shift + 3 (full screen)
- **Windows:** Win + Shift + S (Snipping Tool)
- **Browser:** Full Page Screen Capture extension
- **Online:** Screenshot.guru, Awesome Screenshot

