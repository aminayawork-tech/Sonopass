# 📸 Radiopaedia Image URLs for Questions

I've found the best Radiopaedia cases for each of your 10 image questions. Follow these steps to add real images:

---

## 🎯 Questions with Matching Radiopaedia Cases

### **Question 1: Carotid Plaque with Calcification**
**Radiopaedia Case:** https://radiopaedia.org/cases/carotid-artery-stenosis-5
- Shows hypoechoic plaque in carotid bulb
- Has B-mode ultrasound images

**How to get the image:**
1. Visit the case URL above
2. Look for the ultrasound images in the gallery
3. Right-click on the best image → "Copy image address"
4. Update question `exam1_q148` in `vascular-questions.json`:
   ```json
   "imageUrl": "[paste the copied URL here]",
   "imageCaption": "Carotid plaque. Image: Radiopaedia.org (CC BY-NC-SA)"
   ```

---

### **Question 2: Triphasic Arterial Waveform**
**Radiopaedia Article:** https://radiopaedia.org/articles/doppler-waveforms
- Reference article with example waveforms
- Look for peripheral artery examples

**Alternative sources:**
- StatPearls Figure: https://www.ncbi.nlm.nih.gov/books/NBK567746/figure/article-128653.image.f1/
  (Public domain - free to use!)

**Update question `exam1_q149`:**
```json
"imageUrl": "[URL from Radiopaedia or StatPearls]",
"imageCaption": "Triphasic arterial waveform. Image: [Source] (Public Domain/CC BY-NC-SA)"
```

---

### **Question 3: Deep Vein Thrombosis**
**Radiopaedia Case:** https://radiopaedia.org/cases/deep-vein-thrombosis-of-lower-extremity
- Shows DVT with compression ultrasound
- Multiple ultrasound images available

**Radiopaedia Article:** https://radiopaedia.org/articles/deep-vein-thrombosis
- Has example images in the article

**Update question `exam1_q150`:**
```json
"imageUrl": "[URL from case or article]",
"imageCaption": "DVT - incompressible femoral vein. Image: Radiopaedia.org (CC BY-NC-SA)"
```

---

### **Question 4: Color Doppler Aliasing (Carotid Stenosis)**
**Same as Question 1:** https://radiopaedia.org/cases/carotid-artery-stenosis-5
- Look for color Doppler images showing aliasing
- May have spectral Doppler with elevated velocities

**Update question `exam1_q151`:**
```json
"imageUrl": "[Color Doppler image URL]",
"imageCaption": "Carotid stenosis with aliasing. Image: Radiopaedia.org (CC BY-NC-SA)"
```

---

### **Question 5: Baker's Cyst (Popliteal Cyst)**
**Radiopaedia Article:** https://radiopaedia.org/articles/baker-cyst-2
- Reference article with example images
- Shows anechoic fluid collection

**Search for cases:** https://radiopaedia.org/search?q=baker+cyst+ultrasound&scope=cases

**Update question `exam1_q152`:**
```json
"imageUrl": "[Baker's cyst ultrasound URL]",
"imageCaption": "Baker's cyst - anechoic popliteal collection. Image: Radiopaedia.org (CC BY-NC-SA)"
```

---

### **Question 6: Monophasic Waveform (Proximal Disease)**
**Radiopaedia Article:** https://radiopaedia.org/articles/doppler-waveforms
- Same waveform reference article
- Look for monophasic examples

**StatPearls Alternative:** https://www.ncbi.nlm.nih.gov/books/NBK570577/
- Peripheral arterial assessment chapter
- May have waveform examples (public domain)

**Update question `exam1_q153`:**
```json
"imageUrl": "[Monophasic waveform image URL]",
"imageCaption": "Monophasic arterial waveform indicating proximal stenosis. Image: [Source]"
```

---

### **Question 7: Heterogeneous Carotid Plaque**
**Same as Question 1:** https://radiopaedia.org/cases/carotid-artery-stenosis-5
- OR search for more: https://radiopaedia.org/search?q=carotid+plaque+ultrasound&scope=cases
- Look for plaque with mixed echogenicity

**Update question `exam1_q154`:**
```json
"imageUrl": "[Heterogeneous plaque image URL]",
"imageCaption": "Heterogeneous carotid plaque. Image: Radiopaedia.org (CC BY-NC-SA)"
```

---

### **Question 8: Subclavian Steal Syndrome**
**Radiopaedia Case:** https://radiopaedia.org/cases/subclavian-steal-syndrome-9
- Shows vertebral artery flow reversal
- Doppler ultrasound images

**Radiopaedia Article:** https://radiopaedia.org/articles/subclavian-steal-syndrome
- Reference article with examples

**Update question `exam1_q155`:**
```json
"imageUrl": "[Subclavian steal ultrasound URL]",
"imageCaption": "Subclavian steal - reversed vertebral flow. Image: Radiopaedia.org (CC BY-NC-SA)"
```

---

### **Question 9: Pseudoaneurysm with Yin-Yang Sign**
**Radiopaedia Article:** https://radiopaedia.org/articles/femoral-artery-pseudoaneurysm
- Reference article with images
**Yin-Yang Sign Article:** https://radiopaedia.org/articles/yin-yang-sign-vascular
- Specific article about the sign

**Search for cases:** https://radiopaedia.org/search?q=pseudoaneurysm+femoral&scope=cases

**Update question `exam1_q156`:**
```json
"imageUrl": "[Pseudoaneurysm with yin-yang sign URL]",
"imageCaption": "Femoral pseudoaneurysm - yin-yang sign. Image: Radiopaedia.org (CC BY-NC-SA)"
```

---

### **Question 10: Portal Vein Flow**
**Radiopaedia Article:** https://radiopaedia.org/articles/portal-venous-flow
- Reference article about portal vein flow
- May have Doppler examples

**Alternative - RadioGraphics:** https://pubs.rsna.org/doi/full/10.1148/rg.230118
- "US of the Portal Vein" comprehensive article

**Update question `exam1_q157`:**
```json
"imageUrl": "[Portal vein Doppler URL]",
"imageCaption": "Normal hepatopetal portal vein flow. Image: Radiopaedia.org (CC BY-NC-SA)"
```

---

## 🚀 Quick Update Script

After you've gathered the image URLs, you can update them in bulk. Here's a Python helper:

```bash
# Navigate to your project
cd /home/user/Sonopass

# Use this to update a question's image URL:
python3 << 'EOF'
import json

with open('src/data/vascular-questions.json', 'r') as f:
    data = json.load(f)

# Example: Update question 148 (carotid plaque)
for q in data['exam1']:
    if q['id'] == 'exam1_q148':
        q['imageUrl'] = 'YOUR_URL_HERE'
        q['imageCaption'] = 'Carotid plaque. Image: Radiopaedia.org (CC BY-NC-SA)'
        break

with open('src/data/vascular-questions.json', 'w') as f:
    json.dump(data, f, indent=2)

print("Updated!")
EOF
```

---

## 📋 Checklist

- [ ] Question 1 (Q148): Carotid plaque
- [ ] Question 2 (Q149): Triphasic waveform
- [ ] Question 3 (Q150): DVT
- [ ] Question 4 (Q151): Carotid aliasing
- [ ] Question 5 (Q152): Baker's cyst
- [ ] Question 6 (Q153): Monophasic waveform
- [ ] Question 7 (Q154): Heterogeneous plaque
- [ ] Question 8 (Q155): Subclavian steal
- [ ] Question 9 (Q156): Pseudoaneurysm
- [ ] Question 10 (Q157): Portal vein flow

---

## ⚖️ Legal Requirements

**You MUST include attribution for Radiopaedia images:**
- Format: `"Image: Radiopaedia.org (CC BY-NC-SA)"`
- Or with author: `"Image: Radiopaedia.org, Dr. [Name] (CC BY-NC-SA)"`
- Non-commercial use only
- Educational purposes ✅

**Public Domain images (StatPearls, NIH):**
- No attribution required
- Free for any use
