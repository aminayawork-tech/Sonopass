# 🚀 Quick Image Update Guide

I've created an **interactive helper tool** to make adding real Radiopaedia images super easy!

## Option 1: Interactive Mode (Recommended) ⭐

This walks you through each question step-by-step:

```bash
python3 update-images.py
```

**What it does:**
1. Shows you which Radiopaedia page to visit for each question
2. Tells you exactly which image to look for
3. Prompts you to paste the image URL
4. Automatically updates the JSON file
5. Saves everything when done

**Time:** ~10-15 minutes for all 10 images

---

## Option 2: Manual Update (For Specific Questions)

If you just want to update a few specific questions:

### Example: Update Question 148 (Carotid Plaque)

1. **Visit:** https://radiopaedia.org/cases/carotid-artery-stenosis-5
2. **Find:** B-mode ultrasound image showing plaque
3. **Right-click** the image → "Copy image address"
4. **Edit** `src/data/vascular-questions.json`:
   ```json
   {
     "id": "exam1_q148",
     "imageUrl": "PASTE_URL_HERE",
     "imageCaption": "Carotid plaque. Image: Radiopaedia.org (CC BY-NC-SA)"
   }
   ```

---

## 📋 All 10 Questions Reference

| Q# | Topic | Radiopaedia Link |
|----|-------|------------------|
| 148 | Carotid plaque | [Case](https://radiopaedia.org/cases/carotid-artery-stenosis-5) |
| 149 | Triphasic waveform | [Article](https://radiopaedia.org/articles/doppler-waveforms) |
| 150 | DVT | [Case](https://radiopaedia.org/cases/deep-vein-thrombosis-of-lower-extremity) |
| 151 | Aliasing | [Case](https://radiopaedia.org/cases/carotid-artery-stenosis-5) |
| 152 | Baker's cyst | [Article](https://radiopaedia.org/articles/baker-cyst-2) |
| 153 | Monophasic waveform | [Article](https://radiopaedia.org/articles/doppler-waveforms) |
| 154 | Heterogeneous plaque | [Case](https://radiopaedia.org/cases/carotid-artery-stenosis-5) |
| 155 | Subclavian steal | [Case](https://radiopaedia.org/cases/subclavian-steal-syndrome-9) |
| 156 | Pseudoaneurysm | [Article](https://radiopaedia.org/articles/femoral-artery-pseudoaneurysm) |
| 157 | Portal vein | [Article](https://radiopaedia.org/articles/portal-venous-flow) |

---

## 🎯 How to Get Image URLs from Radiopaedia

### Method 1: Copy Image Address (Easiest)
1. Visit the case/article page
2. Right-click on the ultrasound image
3. Select **"Copy image address"** (Chrome) or **"Copy Image Link"** (Firefox)
4. Paste into the script or JSON file

### Method 2: Open in New Tab
1. Right-click the image → **"Open image in new tab"**
2. Copy the URL from the browser address bar
3. Paste into the script or JSON file

**Example URL format:**
```
https://prod-images-static.radiopaedia.org/images/12345678/abc123_big_gallery.jpeg
```

---

## ⚖️ Attribution Requirements

**ALWAYS** include proper attribution for Radiopaedia images:

```json
"imageCaption": "Description. Image: Radiopaedia.org (CC BY-NC-SA)"
```

This is required by Radiopaedia's Creative Commons license (CC BY-NC-SA 3.0).

---

## 🔧 Troubleshooting

### "Image doesn't load in app"
- Make sure the URL starts with `https://`
- Check that it's the actual image URL (should end with `.jpg`, `.jpeg`, or `.png`)
- Test the URL by pasting it directly in your browser

### "Can't find the right image on Radiopaedia"
- Some articles may have multiple images - choose the clearest ultrasound example
- For waveforms, look for labeled diagrams showing the pattern mentioned
- If a case doesn't have good images, search for similar cases on Radiopaedia

### "Getting 403 or access denied errors"
- Radiopaedia images should be publicly accessible
- Make sure you're copying the full URL including the `https://` prefix
- Try refreshing the Radiopaedia page and copying the URL again

---

## 📊 After Updating

Once you've added the real URLs:

```bash
# Test in your app
npm start  # or however you run your app

# Commit the changes
git add src/data/vascular-questions.json
git commit -m "Add real Radiopaedia images to 10 image-based questions"
git push
```

---

## ⏱️ Quick Stats

- **Total questions with images:** 10
- **Estimated time:** 10-15 minutes (interactive mode)
- **License:** CC BY-NC-SA 3.0 (educational use ✅)
- **Cost:** Free!

Happy image hunting! 🎨✨
