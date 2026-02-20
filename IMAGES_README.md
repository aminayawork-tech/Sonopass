# Adding Real Ultrasound Images to Questions

The app now supports image-based questions! Currently, placeholder image URLs are used. Here's how to add real images:

## Recommended Image Sources (All Legal & Free)

### 1. **Radiopaedia** (Best Option)
- **URL**: https://radiopaedia.org
- **License**: CC BY-NC-SA 3.0 (Non-commercial, attribution required)
- **How to use**:
  1. Search for vascular ultrasound cases
  2. Find high-quality images
  3. Right-click → Copy image address
  4. Use the direct image URL in your question JSON
  5. **MUST** credit in `imageCaption`: "Image: Radiopaedia.org, Dr. [Name]"

Example:
```json
"imageUrl": "https://prod-images-static.radiopaedia.org/images/52891195/abc123.jpg",
"imageCaption": "Carotid plaque with calcification. Image: Radiopaedia.org, Dr. John Smith (CC BY-NC-SA)"
```

### 2. **POCUS Atlas**
- **URL**: https://www.thepocusatlas.com/
- Educational ultrasound images
- Check individual image licensing

### 3. **Sono.gallery**
- **URL**: https://sono.gallery
- 1000+ ultrasound video sequences
- CC BY-NC-ND license

### 4. **Your Own Images**
- Use de-identified images from your own practice
- Store in `/public/images/` folder
- Reference as: `"imageUrl": "/images/carotid-plaque-01.jpg"`

## How to Add/Edit Image Questions

### Format
```json
{
  "id": "img_q1",
  "number": 1,
  "question": "What does this image show?",
  "imageUrl": "https://radiopaedia.org/path/to/image.jpg",
  "imageCaption": "Optional caption with attribution",
  "options": [
    { "letter": "A", "text": "Answer A" },
    { "letter": "B", "text": "Answer B" },
    { "letter": "C", "text": "Answer C" },
    { "letter": "D", "text": "Answer D" }
  ],
  "category": "Cerebrovascular",
  "correctAnswer": "B",
  "explanation": "Detailed explanation here..."
}
```

### Where to Add
- **Image-only questions**: `src/data/image-questions.json`
- **Mixed with text questions**: Add directly to `src/data/vascular-questions.json` in `exam1` or `exam2` arrays

## Next Steps

1. Browse Radiopaedia for vascular ultrasound cases
2. Replace placeholder URLs in `image-questions.json` with real images
3. Add proper attribution in `imageCaption`
4. Test that images load correctly

## Image Guidelines

- **Format**: JPG or PNG
- **Size**: Under 500KB (will load faster on mobile)
- **Resolution**: 800-1200px width recommended
- **Aspect ratio**: 4:3 or 16:9 works best

## Legal Requirements

When using Radiopaedia images:
- ✅ Educational/non-commercial use is allowed
- ✅ Must provide attribution (done via imageCaption)
- ❌ Cannot use for commercial purposes
- ❌ Cannot modify and redistribute without same license
