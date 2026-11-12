---
name: Monochrome Glass
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c4c7c8'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8e9192'
  outline-variant: '#444748'
  surface-tint: '#c6c6c7'
  primary: '#ffffff'
  on-primary: '#2f3131'
  primary-container: '#e2e2e2'
  on-primary-container: '#636565'
  inverse-primary: '#5d5f5f'
  secondary: '#c7c6ca'
  on-secondary: '#2f3034'
  secondary-container: '#48494c'
  on-secondary-container: '#b8b8bc'
  tertiary: '#ffffff'
  on-tertiary: '#2f3131'
  tertiary-container: '#e2e2e2'
  on-tertiary-container: '#636565'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c7'
  on-primary-fixed: '#1a1c1c'
  on-primary-fixed-variant: '#454747'
  secondary-fixed: '#e3e2e6'
  secondary-fixed-dim: '#c7c6ca'
  on-secondary-fixed: '#1a1b1f'
  on-secondary-fixed-variant: '#46474a'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.03em
  display-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: '0'
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.01em
  mono-metric:
    fontFamily: JetBrains Mono
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
    letterSpacing: -0.02em
  mono-data:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: '0'
  mono-label:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-lg: 1.5rem
  margin: 1rem
  margin-md: 2rem
  margin-lg: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
---

## Brand & Style
This design system embodies uncompromising clarity, precision, and optical sophistication. Rooted in pure monochrome and optical realism, it merges the spatial translucency of Apple visionOS with the razor-sharp execution and density of Linear. 

The aesthetic is austere yet luminous: strict black-and-white tones with zero chromatic accents. Depth and hierarchy are achieved entirely through variable opacity, multi-layered glassmorphic refraction, subtle specular highlights, and crisp typography. It targets professionals who demand focused, high-density tooling wrapped in an atmosphere of quiet luxury and spatial depth.

## Colors
The palette is strictly achromatic—no hue tinting, cold blues, or warm ambers. Visual structure relies on calibrated alpha channels over absolute black and off-white bases.

### Dark Theme (Default)
- **Canvas Base:** `#050505`
- **Atmospheric Glow:** Diffuse light orbs of pure white `#FFFFFF` at 5% to 8% opacity, blurred across 120px–180px behind primary glass planes.
- **Glass Fill:** `rgba(255, 255, 255, 0.05)`
- **Glass Border:** `1px solid rgba(255, 255, 255, 0.10)`
- **Specular Top Highlight:** Inset `box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.15)`
- **Text Layers:**
  - High Emphasis / Headings: `rgba(255, 255, 255, 0.95)`
  - Medium Emphasis / Body: `rgba(255, 255, 255, 0.60)`
  - Low Emphasis / Tertiary & Placeholders: `rgba(255, 255, 255, 0.40)`
- **Interactive Element (Primary):** Solid `#FFFFFF` fill with `#050505` label.

### Light Theme
- **Canvas Base:** `#F2F2F3`
- **Atmospheric Glow:** Diffuse light orbs of `#FFFFFF` and neutral grays at 20% opacity.
- **Glass Fill:** `rgba(255, 255, 255, 0.55)`
- **Glass Border:** `1px solid rgba(0, 0, 0, 0.08)`
- **Specular Top Highlight:** Inset `box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.80)`
- **Text Layers:**
  - High Emphasis: `rgba(0, 0, 0, 0.95)`
  - Medium Emphasis: `rgba(0, 0, 0, 0.60)`
  - Low Emphasis: `rgba(0, 0, 0, 0.40)`
- **Interactive Element (Primary):** Solid `#050505` fill with `#FFFFFF` label.

### Status Indicators
Status states (Success, Warning, Critical, Neutral) do not use semantic colors. They rely exclusively on distinct geometric glyphs (e.g., solid circles, slash rings, dotted perimeters) and paired uppercase label text at appropriate opacity tiers.

## Typography
The system employs a dual-font structure:
- **Inter** governs all UI chrome, navigational elements, headers, and standard prose, delivering geometric balance and tight neutral tracking.
- **JetBrains Mono** is mandatory for all quantitative data, financial metrics, specs, keys, timestamps, and status chips, ensuring strict tabular alignment and technical distinction.

Contrast is maintained strictly by opacity tiers rather than decorative weights. Regular (400) and Medium (500) serve for all dense workflows; SemiBold (600) is reserved for prominent structural headers.

## Layout & Spacing
The layout adheres to a strict 8px structural grid. All padding, component dimensions, and layouts scale cleanly in increments of 8px (with 4px `space-xs` reserved for internal compact controls).

### Layout System
- **Desktop (≥1280px):** 12-column fluid grid, `24px` (`1.5rem`) gutters, minimum `48px` (`3rem`) page margins.
- **Tablet (768px - 1279px):** 8-column fluid grid, `16px` (`1rem`) gutters, `32px` (`2rem`) page margins.
- **Mobile (<768px):** 4-column fluid grid, `16px` (`1rem`) gutters, `16px` (`1rem`) outer page margins.

Translucent glass panels must maintain at least `16px` outer separation to avoid visual collision of their refractive borders. Multi-column dashboards default to flex and CSS grid containers with strict `space-md` (`16px`) or `space-lg` (`24px`) gaps.

## Elevation & Depth
Elevation is realized entirely through optical glass physics: translucency, backdrop diffusion, borders, and ambient light distribution. Drop shadows are strictly suppressed in favor of edge illumination and backdrop filtering.

### Layer Hierarchy
1. **Canvas Layer (Z-0):**
   - Solid base color (`#050505` dark / `#F2F2F3` light).
   - Radial white blur orbs placed asynchronously behind interactive focal zones (`width: 400px–600px`, `filter: blur(120px)`, opacity `5–8%` in dark mode).
2. **Surface Layer / Cards & Panels (Z-10):**
   - Background: `rgba(255, 255, 255, 0.05)`
   - Backdrop Filter: `blur(24px)`
   - Perimeter Border: `1px solid rgba(255, 255, 255, 0.10)`
   - Highlight: Inset top rule `box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.15)`
3. **Elevated Floating Layer / Menus, Popovers, Modals (Z-20):**
   - Background: `rgba(255, 255, 255, 0.08)`
   - Backdrop Filter: `blur(32px)`
   - Perimeter Border: `1px solid rgba(255, 255, 255, 0.18)`
   - Highlight: `box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.25), 0 24px 48px -12px rgba(0, 0, 0, 0.50)`

## Shapes
Shapes define the tactile hierarchy between spatial containers and interactive nodes:
- **Structural Containers & Cards:** Strictly `20px` border radius (`rounded-xl` equivalent in this system).
- **Interactive Controls (Buttons, Form Inputs, Dropdown Triggers):** Strictly `12px` border radius.
- **Pills & Status Chips:** Fully pill-shaped (`9999px` border radius) with compact height.
- **Nested Corner Rule:** When an interactive element (`12px` radius) or sub-card sits within a `20px` card container, maintain uniform padding (`≥12px`) so inner and outer radii remain concentric.

## Components

### Buttons
- **Primary:** Solid `#FFFFFF` fill with `#050505` label text. Font: `Inter`, 14px, weight 500. Height: 40px, border-radius: 12px, padding: 0 16px. No border or shadow. Hover: opacity 0.88.
- **Secondary (Glass):** `rgba(255, 255, 255, 0.05)` fill, `1px solid rgba(255, 255, 255, 0.12)`, `inset 0 1px 0 0 rgba(255, 255, 255, 0.15)` top highlight. Label text: `rgba(255, 255, 255, 0.95)`. Hover: `rgba(255, 255, 255, 0.10)` fill.
- **Tertiary / Ghost:** Transparent background, no border. Label: `rgba(255, 255, 255, 0.60)`. Hover: `rgba(255, 255, 255, 0.95)` label with `rgba(255, 255, 255, 0.04)` fill.

### Input Fields
- Height: 40px, border-radius: 12px.
- Background: `rgba(255, 255, 255, 0.03)`.
- Border: `1px solid rgba(255, 255, 255, 0.10)`.
- Text: `rgba(255, 255, 255, 0.95)` in `Inter` 14px (or `JetBrains Mono` 13px for quantitative values).
- Placeholder: `rgba(255, 255, 255, 0.40)`.
- Focus State: Border transitions to `rgba(255, 255, 255, 0.40)`, with an inner top highlight `inset 0 1px 0 0 rgba(255, 255, 255, 0.20)`. No outer colored rings.

### Cards & Panels
- Border-radius: 20px.
- Background: `rgba(255, 255, 255, 0.05)`, backdrop blur: 24px.
- Border: `1px solid rgba(255, 255, 255, 0.10)`.
- Specular Highlight: `inset 0 1px 0 0 rgba(255, 255, 255, 0.15)`.
- Padding: 24px (`space-lg`).

### Chips & Badges
- Border-radius: 9999px.
- Font: `JetBrains Mono`, 11px uppercase, tracking `0.05em`.
- Background: `rgba(255, 255, 255, 0.06)`, border: `1px solid rgba(255, 255, 255, 0.10)`.
- Status indicators pair an inline icon (e.g. solid `●` for active, hollow `○` for idle, slashed `⊘` for offline) with monochrome text at `rgba(255, 255, 255, 0.60)`.

### Lists & Tables
- Row separator: `1px solid rgba(255, 255, 255, 0.06)`.
- Hover state: Row background tints to `rgba(255, 255, 255, 0.03)`.
- Table headers: `JetBrains Mono`, 11px, `rgba(255, 255, 255, 0.40)`, uppercase.
- Table numerical data: `JetBrains Mono`, 13px, `rgba(255, 255, 255, 0.95)`, right-aligned.

### Checkboxes & Radios
- Checkbox: 18x18px box, border-radius: 4px, `1px solid rgba(255, 255, 255, 0.20)`, background `rgba(255, 255, 255, 0.04)`. Checked state: solid `#FFFFFF` fill with `#050505` micro checkmark icon.
- Radio: 18x18px circle, border `1px solid rgba(255, 255, 255, 0.20)`. Selected state: solid white 6px inner dot centered within the glass ring.