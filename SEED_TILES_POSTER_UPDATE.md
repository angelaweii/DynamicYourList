# Seed Tiles Poster Art Update

## Overview
Updated all seed tiles (initial tiles in both rails) to include poster art URLs from the FF1000 embeddings catalog.

## Date
November 13, 2025

## Changes Made

### Frontend Updates

#### Updated File:
- `frontend/src/App.jsx`
  - Added `poster` field to all 10 tiles in `tilesRail1` (16:9 aspect ratio)
  - Added `poster` field to all 10 tiles in `tilesRail2` (2:3 aspect ratio)
  - All tiles now display poster art immediately on page load

## Poster URLs Added

All 10 seed titles now have poster art:

1. **Game of Thrones** (2011)
   - `https://images.cdn.prd.api.discomax.com/_tZfK/YmddU-Vwhc4FLvbNg.jpeg?w=200&f=png`

2. **Sex and the City** (1998)
   - `https://images.cdn.prd.api.discomax.com/wwG99/R_ooaZQ-mvR6Vq2JA.jpeg?w=200&f=png`

3. **A Minecraft Movie** (2025)
   - `https://images.cdn.prd.api.discomax.com/2aAZy/VyWuFLYOz2ntadhLg.jpeg?w=200&f=png`

4. **The Rehearsal** (2022)
   - `https://images.cdn.prd.api.discomax.com/FdA1W/er1XNZjfVkChU7ICw.jpeg?w=200&f=png`

5. **Spirited Away** (2001)
   - `https://images.cdn.prd.api.discomax.com/HIueU/w2IjBl4KO-qzyKdSg.jpeg?w=200&f=png`

6. **Euphoria** (2019)
   - `https://images.cdn.prd.api.discomax.com/tAti-/UBGd0lcnG_31c_-Tg.jpeg?w=200&f=png`

7. **IT: Welcome To Derry** (2025)
   - `https://images.cdn.prd.api.discomax.com/YVh7g/EhWIeZsx1iN7oCUqQ.jpeg?w=200&f=png`

8. **Peacemaker** (2022)
   - `https://images.cdn.prd.api.discomax.com/9_Jge/4QNKP7jtS0GEK3gYw.jpeg?w=200&f=png`

9. **Looney Tunes Cartoons** (2020)
   - `https://images.cdn.prd.api.discomax.com/uNQEg/tITc8il9w9ZOSNNFQ.jpeg?w=200&f=png`

10. **Succession** (2018)
    - `https://images.cdn.prd.api.discomax.com/5NN29/_RzEWKbKrv09PLvng.jpeg?w=200&f=png`

## Visual Result

### Before:
- Seed tiles displayed with gradient backgrounds
- No poster imagery

### After:
- Seed tiles display actual poster art from Warner Bros. Discovery catalog
- Consistent visual experience from initial load
- Poster art maintained when tiles are reordered via drag-and-drop
- Poster art preserved when performing "More Like This" or "Something Else" actions

## Complete Poster Art Flow

The system now displays poster art throughout the entire user experience:

1. **Initial Load** ✅
   - All 20 seed tiles (10 per rail) display poster art

2. **More Like This** ✅
   - New recommendation tiles include poster art
   - Seed tile retains its poster art

3. **Something Else** ✅
   - Replacement tiles include poster art

4. **Drag and Drop** ✅
   - Poster art moves with the tile

5. **Undo Actions** ✅
   - Restored tiles retain their poster art

## Technical Details

### Data Source
Poster URLs were extracted from:
- File: `backend/FF1000/machine_learning/prefetched/embeddings.csv.gz`
- Method: Direct lookup by `item_id`
- Coverage: 10/10 seed titles found (100%)

### Image Format
- CDN: `images.cdn.prd.api.discomax.com`
- Format: JPEG (delivered as PNG via CDN parameter)
- Width: 200px (via CDN parameter `w=200`)
- Responsive: CDN can serve different sizes on demand

## Testing

To verify poster art display:

1. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

2. Open http://localhost:5173

3. Verify:
   - ✅ All seed tiles show poster images
   - ✅ Images load from CDN
   - ✅ Tiles maintain proper aspect ratios (16:9 for Rail 1, 2:3 for Rail 2)
   - ✅ Poster art persists through all interactions

## Success Metrics

✅ All 10 seed tiles in Rail 1 have poster URLs  
✅ All 10 seed tiles in Rail 2 have poster URLs  
✅ 100% coverage of seed content  
✅ Consistent data format across all tiles  
✅ No breaking changes  
✅ Backward compatible (tiles can still work without posters)  

---

**Seed Tiles Update Complete!** 🎨

All tiles now display beautiful poster art from the Warner Bros. Discovery catalog, providing a complete visual experience from initial load through all user interactions.

