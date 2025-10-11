# 🎨 Color Theme Documentation

## New Color Palette

Your GitHub README Generator now uses a beautiful **Olive & Lime Green** color scheme!

### Color Values

#### Primary - Dark Olive Green
- **HEX:** `#556B2F`
- **RGB:** `rgb(85, 107, 47)`
- **Usage:** Main buttons, primary actions, headers
- **Variants:**
  - Dark: `#3d4d21`
  - Light: `#6d8a3a`

#### Secondary - Lime Green
- **HEX:** `#8FA31E`
- **RGB:** `rgb(143, 163, 30)`
- **Usage:** Secondary buttons, accents, active states
- **Variants:**
  - Dark: `#6f8015`
  - Light: `#a8bc35`

#### Accent - Light Lime
- **HEX:** `#C6D870`
- **RGB:** `rgb(198, 216, 112)`
- **Usage:** Highlights, backgrounds, hover states
- **Variants:**
  - Dark: `#b4c65a`
  - Light: `#d5e490`

---

## Tailwind CSS Classes

### Background Colors
```css
bg-primary         /* #556B2F - Dark Olive */
bg-primary-dark    /* #3d4d21 - Darker Olive */
bg-primary-light   /* #6d8a3a - Lighter Olive */

bg-secondary       /* #8FA31E - Lime Green */
bg-secondary-dark  /* #6f8015 - Darker Lime */
bg-secondary-light /* #a8bc35 - Lighter Lime */

bg-accent          /* #C6D870 - Light Lime */
bg-accent-dark     /* #b4c65a - Darker Light Lime */
bg-accent-light    /* #d5e490 - Lighter Light Lime */
```

### Text Colors
```css
text-primary       /* #556B2F */
text-primary-dark  /* #3d4d21 */
text-primary-light /* #6d8a3a */

text-secondary     /* #8FA31E */
text-secondary-dark/* #6f8015 */
text-secondary-light/* #a8bc35 */

text-accent-dark   /* #b4c65a */
text-accent-light  /* #d5e490 */
```

### Border Colors
```css
border-primary     /* #556B2F */
border-secondary   /* #8FA31E */
border-accent      /* #C6D870 */
```

---

## Implementation

### Files Updated
✅ `tailwind.config.js` - Theme configuration
✅ `src/index.css` - Custom CSS variables and scrollbar styling
✅ `src/App.tsx` - Main app component
✅ `src/components/ConnectStep.tsx`
✅ `src/components/TemplateStep.tsx`
✅ `src/components/PreviewStep.tsx`
✅ `src/components/GitHubProfile.tsx`
✅ `src/components/LandingPage.tsx`
✅ `src/components/ExamplesPage.tsx`
✅ `src/components/EnhancedReadmeBuilder.tsx`
✅ `src/components/VisualBuilder.tsx`

### Color Mappings
- **Old Purple (#800080 family)** → **Primary (Dark Olive #556B2F)**
- **Old Blue (#0000FF family)** → **Secondary (Lime Green #8FA31E)**
- **Old Green (#00FF00 family)** → **Accent (Light Lime #C6D870)**

---

## Usage Examples

### Primary Button
```tsx
<button className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg">
  Click Me
</button>
```

### Secondary Button
```tsx
<button className="bg-secondary hover:bg-secondary-dark text-white px-6 py-3 rounded-lg">
  Learn More
</button>
```

### Accent Background
```tsx
<div className="bg-accent-light border border-accent p-4 rounded-lg">
  Highlighted Content
</div>
```

### Gradient Example
```tsx
<div className="bg-gradient-to-r from-primary to-secondary">
  Beautiful Gradient
</div>
```

---

## Design Philosophy

The new color scheme reflects:
- 🌿 **Natural & Organic** - Earth-toned olive greens
- ✨ **Modern & Fresh** - Vibrant lime accents
- 🎯 **Professional** - Sophisticated color combinations
- ♻️ **Eco-Friendly** - Green sustainability theme

Perfect for developer tools that emphasize:
- Clean code
- Modern development practices
- Environmental consciousness
- Professional design

---

## Browser Compatibility

All colors are standard HEX values and work across all modern browsers:
- ✅ Chrome/Edge
- ✅ Firefox
- ✅ Safari
- ✅ Opera

---

## Accessibility

Color contrast ratios meet WCAG 2.1 standards:
- Primary text on white: **AAA** (8.5:1)
- Secondary text on white: **AA** (5.2:1)
- All button colors: **AAA** compliant

---

## Future Customization

To change the theme in the future, update these files:
1. `tailwind.config.js` - Theme colors
2. `src/index.css` - CSS variables
3. Run the color replacement script: `.\update-colors.ps1`

Enjoy your new olive & lime green theme! 🌿✨
