---
name: Campus Relic & Beacon
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45464d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#855300'
  on-secondary: '#ffffff'
  secondary-container: '#fea619'
  on-secondary-container: '#684000'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#07006c'
  on-tertiary-container: '#7073ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#e1e0ff'
  tertiary-fixed-dim: '#c0c1ff'
  on-tertiary-fixed: '#07006c'
  on-tertiary-fixed-variant: '#2f2ebe'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 54px
    letterSpacing: -0.03em
  display-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 42px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: -0.011em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: -0.006em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 10px
    fontWeight: '700'
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
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system pairs the clarity of a high-end editorial product with the lively, community-driven spirit of a modern university campus. Built to counter the bureaucratic, clinical gloom of traditional institutional "Lost & Found" offices, it establishes an empathetic, rapid-response utility that feels as polished as a lifestyle app and as reliable as emergency infrastructure.

The visual direction lives at the intersection of **Editorial Tech** and **Vibrant Utility**:
- **Structured Precision**: Architectural layouts, purposeful grid alignment, crisp hairline boundaries, and restrained structural typography provide order amidst the anxiety of losing critical personal items.
- **Electric Tactility**: High-visibility saffron-amber and electric indigo signals punctuate the interface, evoking energetic campus bulletin boards, safety beacons, and collegiate sportswear accents.
- **Human-Centric Warmth**: Micro-copy treats misplaced gear with character (e.g., "Left behind near the espresso bar" vs. "Item ID #4812"), complemented by tangible tags, location stamps, and tactile physical feedback states.

## Colors

The palette employs deep slate ink on crisp alabaster paper, illuminated by intentional, saturated status accents.

### Palette Architecture
- **Primary Ink (`#0F172A`)**: Deep charcoal slate. Grounds the interface with severe contrast for typography, primary buttons, structural lines, and heavy-emphasis markers.
- **Secondary Saffron (`#F59E0B`)**: Electric amber/saffron. Used for alerts, active lost item notices, pending verification states, and search highlights.
- **Tertiary Indigo (`#6366F1`)**: Energetic violet-indigo. Reserved for resolved matches, claim handshakes, verified campus badges, and direct messaging triggers.
- **Surface & Canvas (`#F8FAFC`)**: Crisp off-white tinted canvas. Prevents eye fatigue while maintaining razor-sharp contrast against dark typography and photo cards.

### Functional Roles & Semantic Mapping
- **Canvas Base**: `#F8FAFC`
- **Surface Elevation 1 (Cards, Modules)**: `#FFFFFF`
- **Surface Elevation 2 (Sub-sections, Inset panels)**: `#F1F5F9`
- **Hairline Borders**: `#E2E8F0` (Default), `#0F172A` (Selected/Focused emphasis)
- **Status - Lost (Urgent Beacon)**: Background `#FEF3C7`, Text `#B45309`, Border `#FDE68A`
- **Status - Found (Awaiting Claim)**: Background `#EEF2FF`, Text `#4338CA`, Border `#C7D2FE`
- **Status - Claimed / Reunited**: Background `#ECFDF5`, Text `#047857`, Border `#A7F3D0`

## Typography

The typographic system creates contrast between structural clarity and readable narrative:

- **Headlines & Interface Labels (`Plus Jakarta Sans`)**: Delivers geometric energy, contemporary warmth, and architectural weight. The geometric apertures add confidence to campus-wide alerts, building locators, and item names.
- **Body & Metadata (`Inter`)**: Neutral, neutral-density engine built for scanability. Optimizes item descriptions, serial numbers, drop-off instructions, and timestamp strings.
- **Letter Spacing**: Displays and primary headlines utilize tightened tracking (`-0.03em` to `-0.015em`) for an editorial front-page stance. Micro-labels and tags use expanded tracking (`+0.02em` to `+0.05em`) in uppercase or small-caps contexts for rapid spatial identification.

## Layout & Spacing

The layout is constructed on a fluid-responsive 12-column grid system calibrated around generous breathing room and editorial modularity.

### Form Factor Behavior
- **Mobile (320px - 639px)**: 4 columns, `gutter-mobile` (1rem / 16px), `margin-mobile` (1rem / 16px). Single-column item feeds with floating micro-actions and sticky location filters.
- **Tablet (640px - 1023px)**: 8 columns, `gutter` (1.5rem / 24px), `margin` (1.5rem / 24px). 2-column feed card arrangements with dynamic drawer filters.
- **Desktop (1024px and up)**: 12 columns, `gutter` (1.5rem / 24px), `margin` (2rem / 32px), max-width bounded at 1280px for standard feed views and 1440px for campus zone maps. 3-to-4 column responsive grid for item discoveries.

### Spatial Cadence
All UI rhythm adheres strictly to the 4px baseline (`0.25rem` intervals). Section stacks leverage `space-xl` (40px) to maintain a refined gallery cadence, ensuring items never feel crammed or utilitarian.

## Elevation & Depth

This design system deliberately moves away from heavy skeuomorphic shadows or cloudy, disorienting blurs, employing instead **Crisp Layering with Ambient Ink Wells**:

- **Ground Level (Canvas)**: Non-elevated, soft `#F8FAFC` base that absorbs ambient light.
- **Surface Level (Cards, Modals)**: `#FFFFFF` sheets bounded by a `1px` structural hairline border (`#E2E8F0`).
- **Ambient Floor Tint**: Elevation is manifested through ultra-subtle, directional ambient occlusion:
  - Default card rest: `0 1px 3px rgba(15, 23, 42, 0.04), 0 1px 2px rgba(15, 23, 42, 0.02)`.
  - Hover / Interactive lift: `0 10px 25px -5px rgba(15, 23, 42, 0.06), 0 8px 10px -6px rgba(15, 23, 42, 0.03)`. The card simultaneously translates `-2px` along the Y-axis.
  - Urgent Beacon (Active Lost Item): Subdued amber perimeter glow: `0 0 0 1px rgba(245, 158, 11, 0.25), 0 4px 12px rgba(245, 158, 11, 0.08)`.
- **Modals & Overlays**: Backdrop utilizes `#0F172A` keyed to 40% opacity with a subtle `4px` blur (`backdrop-filter: blur(4px)`), bringing crisp focus to claiming and identity verification dialogues.

## Shapes

The system uses balanced geometry (`roundedness: 2`, where base radius is 8px / 0.5rem) to reconcile institutional stability with modern digital product tactility.

- **Base Radius (0.5rem / 8px)**: Applied to text input fields, small buttons, sub-module containers, and image masks.
- **Large Radius (1rem / 16px)**: Applied to feed item cards, campus map popovers, modal dialogues, and sheet panels.
- **Pill Radius (9999px)**: Exclusively designated for status badges, building zone pills, category chips, and floating contextual triggers. This circular silhouette instantly distinguishes metadata chips from rectangular content blocks.

## Components

### Buttons
- **Primary Action**: Solid `#0F172A` slate ground, `#FFFFFF` text, `label-md` font weight. `0.5rem` radius, padding `0.625rem 1.25rem`. Transitions smoothly to `#1E293B` on hover; click trigger scales slightly to `0.98`.
- **Secondary / Accent Action**: `#6366F1` indigo base with `#FFFFFF` text for resolution triggers ("Claim This Item", "I Found It").
- **Ghost Action**: Transparent base, `1px` solid `#E2E8F0` border, text `#0F172A`. Active state switches to `#F1F5F9`.

### Chips & Campus Location Badges
- **Location Badge**: Compact pill shape (`rounded-full`), padding `0.25rem 0.75rem`. Subtle grey fill (`#F1F5F9`), text `#334155`, prefixed by a micro pin glyph (`12px`). Used to demarcate zones: *Library 3rd floor*, *Sports Complex*, *Tech Park Audi*, *Hostel Block C*.
- **Category Filter Pill**: Unselected: `#FFFFFF` with `#E2E8F0` border, text `#64748B`. Selected: `#0F172A` ground with `#FFFFFF` text, bolding the category label.
- **Status Pills**:
  - `Lost`: Yellow-amber pill (`#FEF3C7`), text `#B45309`, with a subtle pulsating dot indicator.
  - `Found`: Violet-indigo pill (`#EEF2FF`), text `#4338CA`.
  - `Returned`: Emerald-tinted pill (`#ECFDF5`), text `#047857`.

### Cards (Item Display)
- **Structure**: Surface `#FFFFFF`, border `1px solid #E2E8F0`, corner radius `1rem` (16px), inner padding `1.25rem`.
- **Composition**:
  1. Top Row: Location pill and timestamp string aligned to extremities.
  2. Image Mask: `16:10` aspect ratio container with soft `0.5rem` radius, subtle zoom on card hover (`scale(1.02)` inside overflow hidden).
  3. Body: `headline-sm` item title paired with a 2-line truncated description (`body-md`).
  4. Footer: Status pill, matched reward badge (if applicable), and an expedited "Claim" chevron interaction.

### Input Fields & Search Shell
- **Campus Search Command**: Pill or soft-corner input shell featuring an embedded icon, `#FFFFFF` surface, border `1.5px solid #E2E8F0`, placeholder `#94A3B8`. On focus, transitions cleanly to `border-color: #0F172A` with a soft slate focus ring (`box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.08)`).
- **Form Controls**: Checkboxes and radio buttons employ `#0F172A` check fills with smooth snap-in transitions. Radio buttons maintain crisp white inner-bullseyes.

### Lists & Activity Feeds
- **Feed Rows**: Separated by hairline borders (`1px solid #F1F5F9`). Contains compact 48x48 thumbnail, title, location stamp, and interactive claim chevron. Hover surfaces a translucent `#F8FAFC` row fill.