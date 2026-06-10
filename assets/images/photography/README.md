# Photography Gallery Images

This directory contains all photography gallery images organized by type and album.

## Folder Structure

```
photography/
├── film/
│   ├── atl/
│   ├── banff-film/
│   ├── berlin/
│   └── ... (one folder per film album)
└── digital/
    ├── banff/
    ├── china/
    └── ... (one folder per digital album)
```

## Adding Images

### Auto-Discovery Method (Recommended)

Simply drop your images into the appropriate folder:

1. Navigate to the album folder (e.g., `film/atl/` or `digital/banff/`)
2. Add your images with any filename
3. Images will be automatically discovered and displayed in alphabetical order

**Supported formats:** `.jpg`, `.jpeg`, `.png`, `.webp`

**Naming tip:** Use numbers to control order:
- `001.jpg`, `002.jpg`, `003.jpg`
- Or: `atl-001.jpg`, `atl-002.jpg`, etc.

### Manual Method (Optional)

If you need specific control over image order or captions, define them in `_data/photography.yml`:

```yaml
- slug: atl
  title: "ATL"
  gallery:
    - src: "/assets/images/photography/film/atl/image1.jpg"
      caption: "Optional caption"
    - src: "/assets/images/photography/film/atl/image2.jpg"
      caption: "Another caption"
```

## Current Galleries

**Film:** fall-2019, rodchenko-inspiration, atl, maui, berlin, france, poland, ukraine, pnw, mount-rainier-film, banff-film, glacier-film

**Digital:** us-abandoned, haleakala, mount-rainier, crater-lake, olympic, banff, glacier-np, sequoia, redwood, rocky-mountain, china, japan, morocco, portugal, costa-rica-panama, belize-guatemala, western-europe, central-eastern-europe
