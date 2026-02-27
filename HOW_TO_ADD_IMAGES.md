# How to Add Images to the RVT Study Guide

The study guide is now set up and ready for your images! Follow these simple steps to add your images from your local folder.

## Quick Start

### Step 1: Copy Your Images

Copy all images from your `Documents/sonopass` folder to the `public/images/study-guide/` folder in this project:

```bash
# Create the images directory
mkdir -p public/images/study-guide

# Copy your images (adjust the source path to your actual folder location)
cp ~/Documents/sonopass/*.{jpg,jpeg,png,gif} public/images/study-guide/
```

### Step 2: Rename Images to Match the Study Guide

The study guide expects specific image filenames. Rename your images to match these names:

#### Anatomy Images
- `lower-extremity-arteries.jpg` - Lower extremity arterial anatomy diagram
- `lower-extremity-veins.jpg` - Lower extremity venous anatomy
- `carotid-anatomy.jpg` - Carotid bifurcation anatomy

#### Hemodynamics & Doppler Images
- `laminar-turbulent-flow.jpg` - Laminar vs turbulent flow patterns
- `arterial-waveforms.jpg` - Triphasic, biphasic, and monophasic waveforms
- `venous-waveforms.jpg` - Normal and abnormal venous waveforms
- `doppler-angle.jpg` - Proper Doppler angle placement

#### Pathology Images
- `stenosis-doppler.jpg` - Doppler findings in arterial stenosis
- `dvt-compression.jpg` - Compression technique showing DVT
- `acute-chronic-dvt.jpg` - Acute vs chronic DVT appearance
- `venous-reflux.jpg` - Venous reflux on Doppler
- `aaa-measurement.jpg` - AAA measurement technique
- `pseudoaneurysm.jpg` - Pseudoaneurysm with yin-yang sign

#### Protocol Images
- `carotid-protocol.jpg` - Carotid duplex scanning positions
- `le-arterial-protocol.jpg` - Lower extremity arterial scanning technique
- `compression-technique.jpg` - Proper compression technique
- `dvt-protocol.jpg` - Lower extremity vein segments

#### Physics Images
- `sound-wave.jpg` - Sound wave properties
- `ultrasound-artifacts.jpg` - Common ultrasound artifacts

## Alternative: Update Image Filenames in the JSON

If you prefer to keep your original image filenames, you can update the study guide content file:

1. Open `public/study-guide-content.json`
2. Find the `images` array in each topic
3. Update the `filename` to match your actual image names

Example:
```json
"images": [
  {
    "filename": "your-actual-image-name.jpg",
    "caption": "Lower extremity arterial anatomy diagram"
  }
]
```

## Supported Image Formats

The study guide supports:
- `.jpg` / `.jpeg`
- `.png`
- `.gif`
- `.svg`

## Adding More Images

To add additional images to any topic:

1. Copy your image to `public/images/study-guide/`
2. Edit `public/study-guide-content.json`
3. Find the topic you want to add the image to
4. Add to the `images` array:

```json
"images": [
  {
    "filename": "your-new-image.jpg",
    "caption": "Description of what the image shows"
  }
]
```

## Adding New Topics

To add entirely new topics to the study guide:

1. Edit `public/study-guide-content.json`
2. Find the appropriate category (anatomy, hemodynamics, pathology, protocols, physics)
3. Add a new topic object to the `topics` array:

```json
{
  "id": "unique-topic-id",
  "title": "Your Topic Title",
  "content": "The main content text here...\n\nUse \\n\\n for new paragraphs.",
  "keyTerms": [
    "Important Term 1",
    "Important Term 2"
  ],
  "images": [
    {
      "filename": "your-image.jpg",
      "caption": "Image description"
    }
  ]
}
```

## Adding New Categories

To add a new category (like "Clinical Applications" or "Patient Care"):

1. Edit `public/study-guide-content.json`
2. Add a new category object to the `categories` array:

```json
{
  "id": "unique-category-id",
  "title": "Category Name",
  "icon": "brain",
  "color": "blue",
  "topics": []
}
```

Available icons: `brain`, `activity`, `alert-triangle`, `clipboard-list`, `zap`, `book-open`
Available colors: `blue`, `red`, `orange`, `green`, `purple`

## Testing Your Images

After adding images:

1. Save your changes
2. Refresh your browser
3. Navigate to the Study Guide
4. Click through the topics to see your images

The images will display in a grid layout with captions underneath.

## Tips

- **Image Size**: Recommended width of 800-1200px for best quality
- **File Size**: Keep images under 1MB for faster loading
- **Format**: JPG works best for photographs, PNG for diagrams
- **Naming**: Use lowercase and hyphens (e.g., `my-image-name.jpg`)

## Need Help?

If images aren't displaying:
1. Check that the filename in the JSON matches exactly (including extension)
2. Verify the image is in `public/images/study-guide/`
3. Try refreshing your browser with Ctrl+Shift+R (hard refresh)
4. Check the browser console (F12) for any errors
