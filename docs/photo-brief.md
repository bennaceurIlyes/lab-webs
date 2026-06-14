# LDREAS Photo Brief

This document lists all image slots on the LDREAS website and provides recommendations for real photos to replace the current placeholders. 
To maintain a professional, academic feel, prefer technical close-ups, lab equipment, and abstract Saharan/desert landscapes over generic stock photography of people.

## Home Page
- **Hero Banner (`src/components/sections/HeroBanner.jsx`)**
  - **Size**: ~1920x1080 (Landscape)
  - **Description**: A wide, high-quality shot of a Saharan solar installation, a desert landscape with renewable energy infrastructure, or a high-tech lab environment.
- **Teams Preview Cards (`src/components/sections/TeamsPreview.jsx`)**
  - **Size**: ~800x600 (Landscape)
  - **Description**: Close-ups of lab equipment, circuits, or abstract textures relevant to the specific team's research (e.g., solar cells for Photovoltaics).
- **News Grid Cards (`src/components/sections/NewsGrid.jsx`)**
  - **Size**: ~800x600 (Landscape)
  - **Description**: Photos from recent lab events, conferences, or relevant research outputs.

## Team Page (`src/pages/TeamsList.jsx` / `MemberProfile.jsx`)
- **Member Portraits**
  - **Size**: ~400x400 (Square)
  - **Description**: Professional headshots of team members, preferably with a consistent, neutral background (e.g., light gray or subtle lab setting out of focus).

## About Page (`src/pages/About.jsx`)
- **About Hero/Intro Image**
  - **Size**: ~1200x800 (Landscape)
  - **Description**: A photo of the LDREAS building exterior or a group shot of the core faculty/researchers.

*Note: A global CSS treatment (`.image-brand-filter`) is applied to images to slightly desaturate them and add a faint navy overlay for brand consistency.*
