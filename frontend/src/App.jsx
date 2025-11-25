import React, { useState } from 'react';
import { ThemeProvider } from './theme/ThemeProvider';
import { TileWithMetadata, Tile23WithMetadata, Rail, RemovalBanner } from './components';
import api from './services/api';
import './theme/fonts.css';

function App() {
  // Real titles from FF1000 dataset - first rail (16:9 tiles)
  const [tilesRail1, setTilesRail1] = useState([
    { id: 1, item_id: '4f6b4985-2dc9-4ab6-ac79-d60f0860b0ac', title: 'Game of Thrones', year: '2011', poster: 'https://images.cdn.prd.api.discomax.com/_tZfK/YmddU-Vwhc4FLvbNg.jpeg?w=200&f=png' },
    { id: 2, item_id: '4f662560-7f52-4ad5-ae9b-f4b6517e4f39', title: 'Sex and the City', year: '2008', poster: 'https://images.cdn.prd.api.discomax.com/wwG99/R_ooaZQ-mvR6Vq2JA.jpeg?w=200&f=png' },
    { id: 3, item_id: '05eee581-3112-4515-b17f-219ff6265ef8', title: 'A Minecraft Movie', year: '2025', poster: 'https://images.cdn.prd.api.discomax.com/2aAZy/VyWuFLYOz2ntadhLg.jpeg?w=200&f=png' },
    { id: 4, item_id: '609d8b4c-f0a6-4a5d-b9d3-bb0f2e207efb', title: 'The Rehearsal', year: '2022', poster: 'https://images.cdn.prd.api.discomax.com/FdA1W/er1XNZjfVkChU7ICw.jpeg?w=200&f=png' },
    { id: 5, item_id: '3deab668-d0a4-4a8d-9bc8-0952a0ad836e', title: 'Spirited Away', year: '2001', poster: 'https://images.cdn.prd.api.discomax.com/HIueU/w2IjBl4KO-qzyKdSg.jpeg?w=200&f=png' },
    { id: 6, item_id: '4ffd33c9-e0d6-4cd6-bd13-34c266c79be0', title: 'Euphoria', year: '2019', poster: 'https://images.cdn.prd.api.discomax.com/tAti-/UBGd0lcnG_31c_-Tg.jpeg?w=200&f=png' },
    { id: 7, item_id: '6c39354a-c52d-46d7-982c-b5d196988189', title: 'IT: Welcome To Derry', year: '2025', poster: 'https://images.cdn.prd.api.discomax.com/YVh7g/EhWIeZsx1iN7oCUqQ.jpeg?w=200&f=png' },
    { id: 8, item_id: 'a939d96b-7ffb-4481-96f6-472838d104ca', title: 'Peacemaker', year: '2022', poster: 'https://images.cdn.prd.api.discomax.com/9_Jge/4QNKP7jtS0GEK3gYw.jpeg?w=200&f=png' },
    { id: 9, item_id: 'e90f1b95-4825-4f3d-bbe2-4cbc82dc7229', title: 'Looney Tunes Cartoons', year: '2020', poster: 'https://images.cdn.prd.api.discomax.com/uNQEg/tITc8il9w9ZOSNNFQ.jpeg?w=200&f=png' },
    { id: 10, item_id: 'a8484031-f244-4661-9fb7-0932bd1ba872', title: 'Succession', year: '2018', poster: 'https://images.cdn.prd.api.discomax.com/5NN29/_RzEWKbKrv09PLvng.jpeg?w=200&f=png' },
  ]);

  // Real titles from FF1000 dataset - second rail (2:3 tiles)
  const [tilesRail2, setTilesRail2] = useState([
    { id: 101, item_id: '4f6b4985-2dc9-4ab6-ac79-d60f0860b0ac', title: 'Game of Thrones', year: '2011', poster: 'https://images.cdn.prd.api.discomax.com/_tZfK/YmddU-Vwhc4FLvbNg.jpeg?w=200&f=png' },
    { id: 102, item_id: '4f662560-7f52-4ad5-ae9b-f4b6517e4f39', title: 'Sex and the City', year: '2008', poster: 'https://images.cdn.prd.api.discomax.com/wwG99/R_ooaZQ-mvR6Vq2JA.jpeg?w=200&f=png' },
    { id: 103, item_id: '05eee581-3112-4515-b17f-219ff6265ef8', title: 'A Minecraft Movie', year: '2025', poster: 'https://images.cdn.prd.api.discomax.com/2aAZy/VyWuFLYOz2ntadhLg.jpeg?w=200&f=png' },
    { id: 104, item_id: '609d8b4c-f0a6-4a5d-b9d3-bb0f2e207efb', title: 'The Rehearsal', year: '2022', poster: 'https://images.cdn.prd.api.discomax.com/FdA1W/er1XNZjfVkChU7ICw.jpeg?w=200&f=png' },
    { id: 105, item_id: '3deab668-d0a4-4a8d-9bc8-0952a0ad836e', title: 'Spirited Away', year: '2001', poster: 'https://images.cdn.prd.api.discomax.com/HIueU/w2IjBl4KO-qzyKdSg.jpeg?w=200&f=png' },
    { id: 106, item_id: '4ffd33c9-e0d6-4cd6-bd13-34c266c79be0', title: 'Euphoria', year: '2019', poster: 'https://images.cdn.prd.api.discomax.com/tAti-/UBGd0lcnG_31c_-Tg.jpeg?w=200&f=png' },
    { id: 107, item_id: '6c39354a-c52d-46d7-982c-b5d196988189', title: 'IT: Welcome To Derry', year: '2025', poster: 'https://images.cdn.prd.api.discomax.com/YVh7g/EhWIeZsx1iN7oCUqQ.jpeg?w=200&f=png' },
    { id: 108, item_id: 'a939d96b-7ffb-4481-96f6-472838d104ca', title: 'Peacemaker', year: '2022', poster: 'https://images.cdn.prd.api.discomax.com/9_Jge/4QNKP7jtS0GEK3gYw.jpeg?w=200&f=png' },
    { id: 109, item_id: 'e90f1b95-4825-4f3d-bbe2-4cbc82dc7229', title: 'Looney Tunes Cartoons', year: '2020', poster: 'https://images.cdn.prd.api.discomax.com/uNQEg/tITc8il9w9ZOSNNFQ.jpeg?w=200&f=png' },
    { id: 110, item_id: 'a8484031-f244-4661-9fb7-0932bd1ba872', title: 'Succession', year: '2018', poster: 'https://images.cdn.prd.api.discomax.com/5NN29/_RzEWKbKrv09PLvng.jpeg?w=200&f=png' },
  ]);

  // Drag and drop state for Rail 1
  const [draggedIndexRail1, setDraggedIndexRail1] = useState(null);

  // Drag and drop state for Rail 2
  const [draggedIndexRail2, setDraggedIndexRail2] = useState(null);

  // Removed/replaced tiles state for showing banners
  // Each entry: { railId, id, title, index, tile, action: 'removed'|'replaced' }
  const [removedTilesRail1, setRemovedTilesRail1] = useState([]);
  const [removedTilesRail2, setRemovedTilesRail2] = useState([]);

  // Track dismissed/replaced item IDs to prevent them from surfacing again
  const [dismissedItemIdsRail1, setDismissedItemIdsRail1] = useState(new Set());
  const [dismissedItemIdsRail2, setDismissedItemIdsRail2] = useState(new Set());

  // Drag and drop handlers for Rail 1
  const handleDragStartRail1 = (index) => (e) => {
    setDraggedIndexRail1(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEndRail1 = () => {
    setDraggedIndexRail1(null);
  };

  const handleDragOverRail1 = (index) => (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (draggedIndexRail1 === null || draggedIndexRail1 === index) return;
    
    // Reorder tiles
    setTilesRail1(prevTiles => {
      const newTiles = [...prevTiles];
      const draggedTile = newTiles[draggedIndexRail1];
      newTiles.splice(draggedIndexRail1, 1);
      newTiles.splice(index, 0, draggedTile);
      return newTiles;
    });
    
    setDraggedIndexRail1(index);
  };

  const handleDropRail1 = (index) => (e) => {
    e.preventDefault();
  };

  // Drag and drop handlers for Rail 2
  const handleDragStartRail2 = (index) => (e) => {
    setDraggedIndexRail2(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEndRail2 = () => {
    setDraggedIndexRail2(null);
  };

  const handleDragOverRail2 = (index) => (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (draggedIndexRail2 === null || draggedIndexRail2 === index) return;
    
    // Reorder tiles
    setTilesRail2(prevTiles => {
      const newTiles = [...prevTiles];
      const draggedTile = newTiles[draggedIndexRail2];
      newTiles.splice(draggedIndexRail2, 1);
      newTiles.splice(index, 0, draggedTile);
      return newTiles;
    });
    
    setDraggedIndexRail2(index);
  };

  const handleDropRail2 = (index) => (e) => {
    e.preventDefault();
  };

  const handleMoreLikeThis = async (railId, id) => {
    console.log(`More Like This clicked on tile ${id} in rail ${railId}`);
    
    const setTiles = railId === 1 ? setTilesRail1 : setTilesRail2;
    const tiles = railId === 1 ? tilesRail1 : tilesRail2;
    const dismissedItemIds = railId === 1 ? dismissedItemIdsRail1 : dismissedItemIdsRail2;
    
    // Find the seed tile
    const seedTile = tiles.find(tile => tile.id === id);
    if (!seedTile) return;
    
    // Find the index of the seed tile
    const seedIndex = tiles.findIndex(tile => tile.id === id);
    
    // Get existing titles in this rail for duplicate checking
    const existingTitles = new Set(tiles.map(t => t.title.toLowerCase()));
    const existingItemIds = new Set(tiles.map(t => t.item_id).filter(Boolean));
    
    try {
      // Call ML API to get similar recommendations (request more to account for filtering)
      const allRecommendations = await api.getMoreLikeThis(
        seedTile.title,
        seedTile.item_id || null,
        10 // Request more to ensure we get 2 unique after filtering
      );
      
      // Filter out duplicates, ASL versions, language/audio versions, non-title content, and previously dismissed items
      const filteredRecommendations = allRecommendations.filter(rec => {
        // Filter out ASL versions and different language/audio versions
        const isASL = /\(with ASL\)|with ASL|\(ASL\)|ASL Edition/i.test(rec.title);
        const isLanguageVersion = /\((Spanish|French|German|Italian|Portuguese|Japanese|Korean|Chinese|Hindi|Arabic|Russian|Latin Spanish|European Spanish|Brazilian Portuguese|Cantonese|Mandarin)(\s+(Audio|Subtitles|Dub|Version|Language))?\)|with (Spanish|French|German|Italian|Portuguese|Japanese|Korean|Chinese|Hindi|Arabic|Russian) (Audio|Subtitles|Dub)|Dubbed|\(Audio Description\)|- (Spanish|French|German|Italian|Portuguese) Version/i.test(rec.title);
        if (isASL || isLanguageVersion) return false;
        
        // Filter out trailers
        const isTrailer = /trailer|teaser|preview|sneak peek/i.test(rec.title);
        if (isTrailer) return false;
        
        // Filter out collections/rails
        const isCollection = /what's on|coming soon|streaming this|years of|reframed:|craziest|the \d{4}s|new this|this month|this week/i.test(rec.title);
        if (isCollection) return false;
        
        // Filter out behind-the-scenes and making-of content
        const isBTS = /behind the scenes|making of|featurette|bonus feature|deleted scene/i.test(rec.title);
        if (isBTS) return false;
        
        // Filter out duplicates by title or item_id
        const isDuplicateTitle = existingTitles.has(rec.title.toLowerCase());
        const isDuplicateItemId = rec.item_id && existingItemIds.has(rec.item_id);
        
        // Filter out previously dismissed/replaced items
        const isDismissed = rec.item_id && dismissedItemIds.has(rec.item_id);
        
        return !isDuplicateTitle && !isDuplicateItemId && !isDismissed;
      });
      
      // Take the first 2 unique recommendations
      const uniqueRecs = filteredRecommendations.slice(0, 2);
      
      if (uniqueRecs.length === 0) {
        console.log('No unique recommendations found after filtering');
        return;
      }
      
      // Create tiles from filtered recommendations
      const timestamp = Date.now();
      const newTiles = uniqueRecs.map((rec, index) => ({
        id: timestamp + index,
        item_id: rec.item_id,
        title: rec.title,
        year: rec.year?.toString() || seedTile.year,
        poster: rec.poster || null,
        isNew: true,
        animationDelay: index === 0 ? '0ms' : '50ms'
      }));
      
      // Insert the new tiles right after the seed tile
      setTiles(prevTiles => {
        const updatedTiles = [...prevTiles];
        updatedTiles.splice(seedIndex + 1, 0, ...newTiles);
        return updatedTiles;
      });
      
      // Remove isNew flag after animation completes
      setTimeout(() => {
        setTiles(prevTiles => 
          prevTiles.map(tile => ({...tile, isNew: false, animationDelay: '0ms'}))
        );
      }, 550);
    } catch (error) {
      console.error('Error getting recommendations:', error);
    }
  };

  const handleSomethingElse = async (railId, id) => {
    console.log(`Something Else clicked on tile ${id} in rail ${railId}`);
    
    const tiles = railId === 1 ? tilesRail1 : tilesRail2;
    const setTiles = railId === 1 ? setTilesRail1 : setTilesRail2;
    const setRemovedTiles = railId === 1 ? setRemovedTilesRail1 : setRemovedTilesRail2;
    const dismissedItemIds = railId === 1 ? dismissedItemIdsRail1 : dismissedItemIdsRail2;
    const setDismissedItemIds = railId === 1 ? setDismissedItemIdsRail1 : setDismissedItemIdsRail2;
    
    // Find the tile index
    const tileIndex = tiles.findIndex(tile => tile.id === id);
    if (tileIndex === -1) return;
    
    const originalTile = tiles[tileIndex];
    
    // Get existing titles in this rail for duplicate checking (excluding the tile being replaced)
    const existingTitles = new Set(
      tiles.filter(t => t.id !== id).map(t => t.title.toLowerCase())
    );
    const existingItemIds = new Set(
      tiles.filter(t => t.id !== id).map(t => t.item_id).filter(Boolean)
    );
    
    try {
      // Each "Something Else" click treats the current tile as a new seed
      // Always start at diversity level 3 for good initial diversity
      const diversityLevel = 3;
      
      console.log(`Something Else for "${originalTile.title}" at diversity level: ${diversityLevel}`);
      
      // Diversity level 3 filters out top 15 similar items for good variety
      
      // Try to get a unique recommendation, with excluded items to avoid duplicates
      let recommendation = null;
      let attempts = 0;
      const maxAttempts = 5;
      
      // Build exclusion lists
      const excludeItemIds = Array.from(existingItemIds).concat(Array.from(dismissedItemIds));
      const excludeTitles = Array.from(existingTitles);
      
      while (!recommendation && attempts < maxAttempts) {
        attempts++;
        const candidate = await api.getSomethingElse(
          originalTile.title,
          originalTile.item_id || null,
          diversityLevel,
          excludeItemIds,
          excludeTitles
        );
        
        // Check if it's an ASL version or different language/audio version
        const isASL = /\(with ASL\)|with ASL|\(ASL\)|ASL Edition/i.test(candidate.title);
        const isLanguageVersion = /\((Spanish|French|German|Italian|Portuguese|Japanese|Korean|Chinese|Hindi|Arabic|Russian|Latin Spanish|European Spanish|Brazilian Portuguese|Cantonese|Mandarin)(\s+(Audio|Subtitles|Dub|Version|Language))?\)|with (Spanish|French|German|Italian|Portuguese|Japanese|Korean|Chinese|Hindi|Arabic|Russian) (Audio|Subtitles|Dub)|Dubbed|\(Audio Description\)|- (Spanish|French|German|Italian|Portuguese) Version/i.test(candidate.title);
        
        // Check if it's a trailer
        const isTrailer = /trailer|teaser|preview|sneak peek/i.test(candidate.title);
        
        // Check if it's a collection/rail
        const isCollection = /what's on|coming soon|streaming this|years of|reframed:|craziest|the \d{4}s|new this|this month|this week/i.test(candidate.title);
        
        // Check if it's behind-the-scenes content
        const isBTS = /behind the scenes|making of|featurette|bonus feature|deleted scene/i.test(candidate.title);
        
        // Check if it's a duplicate
        const isDuplicateTitle = existingTitles.has(candidate.title.toLowerCase());
        const isDuplicateItemId = candidate.item_id && existingItemIds.has(candidate.item_id);
        
        // Check if it was previously dismissed or replaced
        const isDismissed = candidate.item_id && dismissedItemIds.has(candidate.item_id);
        
        // Accept if it's a valid title (not ASL, language version, trailer, collection, BTS, duplicate, or dismissed)
        if (!isASL && !isLanguageVersion && !isTrailer && !isCollection && !isBTS && !isDuplicateTitle && !isDuplicateItemId && !isDismissed) {
          recommendation = candidate;
        }
      }
      
      // If no recommendation found after attempts, fall back to requesting random titles
      if (!recommendation) {
        console.log('No unique recommendation found, falling back to random selection...');
        
        // Try getting random recommendations with extremely high diversity level
        let fallbackAttempts = 0;
        const maxFallbackAttempts = 10;
        
        while (!recommendation && fallbackAttempts < maxFallbackAttempts) {
          fallbackAttempts++;
          
          try {
            // Request with very high diversity level for maximum randomness
            const candidate = await api.getSomethingElse(
              originalTile.title,
              originalTile.item_id || null,
              100 + fallbackAttempts, // Very high diversity level
              excludeItemIds,
              excludeTitles
            );
            
            // Apply same filtering
            const isASL = /\(with ASL\)|with ASL|\(ASL\)|ASL Edition/i.test(candidate.title);
            const isLanguageVersion = /\((Spanish|French|German|Italian|Portuguese|Japanese|Korean|Chinese|Hindi|Arabic|Russian|Latin Spanish|European Spanish|Brazilian Portuguese|Cantonese|Mandarin)(\s+(Audio|Subtitles|Dub|Version|Language))?\)|with (Spanish|French|German|Italian|Portuguese|Japanese|Korean|Chinese|Hindi|Arabic|Russian) (Audio|Subtitles|Dub)|Dubbed|\(Audio Description\)|- (Spanish|French|German|Italian|Portuguese) Version/i.test(candidate.title);
            const isTrailer = /trailer|teaser|preview|sneak peek/i.test(candidate.title);
            const isCollection = /what's on|coming soon|streaming this|years of|reframed:|craziest|the \d{4}s|new this|this month|this week/i.test(candidate.title);
            const isBTS = /behind the scenes|making of|featurette|bonus feature|deleted scene/i.test(candidate.title);
            const isDuplicateTitle = existingTitles.has(candidate.title.toLowerCase());
            const isDuplicateItemId = candidate.item_id && existingItemIds.has(candidate.item_id);
            const isDismissed = candidate.item_id && dismissedItemIds.has(candidate.item_id);
            
            if (!isASL && !isLanguageVersion && !isTrailer && !isCollection && !isBTS && !isDuplicateTitle && !isDuplicateItemId && !isDismissed) {
              recommendation = candidate;
              console.log(`Found random fallback: ${recommendation.title}`);
            }
          } catch (error) {
            console.error(`Fallback attempt ${fallbackAttempts} failed:`, error);
          }
        }
        
        // If still no recommendation, use client-side random fallback
        // These are real titles from the catalog with valid poster URLs
        if (!recommendation) {
          console.log('Using client-side random fallback');
          const randomTitles = [
            { title: 'The Matrix: Resurrections (2021)', item_id: '59f8d3bb-5c45-431d-80cd-331eafac0b81', year: '2021', poster: 'https://images.cdn.prd.api.discomax.com/YHtrL/zncQDHJZnqqPiYNtQ.jpeg?w=200&f=png' },
            { title: 'Inception', item_id: '14552c93-d318-4563-a00b-343df7e35d0b', year: '2010', poster: 'https://images.cdn.prd.api.discomax.com/S4y42/Tz4oPvgTkMDKbuAzQ.jpeg?w=200&f=png' },
            { title: 'The Dark Knight Rises', item_id: '6ce5965d-cdb2-4f9c-b22b-ae7a091d95a8', year: '2012', poster: 'https://images.cdn.prd.api.discomax.com/Byqkv/3iUQpEmmnQuy90DKQ.jpeg?w=200&f=png' },
            { title: 'Pulp Fiction', item_id: '04d2059a-0056-4693-93cd-5fd1b7b02d4e', year: '1994', poster: 'https://images.cdn.prd.api.discomax.com/4qlEc/-xJlsLX5oxCkq2QIA.jpeg?w=200&f=png' },
            { title: 'Goodfellas', item_id: '27d940f6-a526-4f2b-b2ed-277defe8c818', year: '1990', poster: 'https://images.cdn.prd.api.discomax.com/ISv1U/tiehz79is1X-zcBfw.jpeg?w=200&f=png' },
            { title: 'Parasite', item_id: 'd5e3be11-eb8b-449f-89cf-db887ddee777', year: '2019', poster: 'https://images.cdn.prd.api.discomax.com/boiE6/A3CdxWcN9DwllCmPw.jpeg?w=200&f=png' },
            { title: 'Get Out', item_id: 'b1772951-17b7-4037-826c-4afc1a30b275', year: '2017', poster: 'https://images.cdn.prd.api.discomax.com/vQjxU/fzq5CI5UTx9Uj4wKQ.jpeg?w=200&f=png' },
            { title: 'Dune: Part Two', item_id: 'f0a4f239-0b57-47e2-a39a-54fb96925e61', year: '2024', poster: 'https://images.cdn.prd.api.discomax.com/5jgcG/XF1mdKte7knVtdqsw.jpeg?w=200&f=png' },
            { title: 'The Grand Budapest Hotel', item_id: '01a866a0-1cd6-46a3-a211-3a0b06cb5ad9', year: '2014', poster: 'https://images.cdn.prd.api.discomax.com/t_ZDD/r7jJto-N6XmQ0k_Ow.jpeg?w=200&f=png' },
            { title: 'Blade Runner: The Final Cut', item_id: '621bb1a7-4684-4e42-bdc2-7c939e8798b4', year: '1982', poster: 'https://images.cdn.prd.api.discomax.com/7gehV/Sw26yC2JroCo9435w.jpeg?w=200&f=png' },
            { title: 'Fight Club', item_id: '0c961ffa-2a85-4b15-8e3f-5e63803503b5', year: '1999', poster: 'https://images.cdn.prd.api.discomax.com/bw7JR/x4cqpFH6y0tKHUzxQ.jpeg?w=200&f=png' },
            { title: 'Moonlight Sonata: Deafness In Three Movements', item_id: '34260141-7044-4f37-90a4-036bc85337a3', year: '2019', poster: 'https://images.cdn.prd.api.discomax.com/HEGGI/aKYmedomcWiS0wjyw.jpeg?w=200&f=png' },
          ];
          
          // Filter out titles already in the rail and dismissed
          const availableTitles = randomTitles.filter(title => 
            !existingTitles.has(title.title.toLowerCase()) &&
            !existingItemIds.has(title.item_id) &&
            !dismissedItemIds.has(title.item_id)
          );
          
          if (availableTitles.length > 0) {
            // Pick a random title
            const randomIndex = Math.floor(Math.random() * availableTitles.length);
            recommendation = availableTitles[randomIndex];
            console.log(`Using random fallback title: ${recommendation.title}`);
          } else {
            // Absolute last resort: show a message (this should be extremely rare)
            console.error('Exhausted all fallback options');
            alert('Unable to find a different recommendation. Please try refreshing the page.');
            return;
          }
        }
      }
      
      console.log(`Selected: ${recommendation.title} (diversity level ${diversityLevel})`);
      
      // Create new tile with replacement animation
      const timestamp = Date.now();
      const newTile = {
        id: timestamp,
        item_id: recommendation.item_id,
        title: recommendation.title,
        year: recommendation.year?.toString() || '2023',
        poster: recommendation.poster || null,
        isReplacement: true,
        animationDelay: '0ms'
      };
      
      // Add original tile to dismissed list to prevent it from surfacing again
      if (originalTile.item_id) {
        setDismissedItemIds(prev => new Set([...prev, originalTile.item_id]));
      }
      
      // Store the replaced tile info for showing banner
      // Remove any existing banner at this index to ensure only the most recent action shows
      setRemovedTiles(prev => {
        // Filter out any previous banners at this tile index
        const filteredBanners = prev.filter(banner => banner.index !== tileIndex);
        
        // Add the new banner for the most recent action
        return [...filteredBanners, {
          id: newTile.id, // Use new tile's ID so banner shows at its position
          title: originalTile.title, // Show original tile's title in banner
          index: tileIndex,
          tile: originalTile, // Store original tile data for undo
          action: 'replaced'
        }];
      });
      
      // Replace the tile at the same position
      setTiles(prevTiles => {
        const newTiles = [...prevTiles];
        newTiles.splice(tileIndex, 1, newTile);
        return newTiles;
      });
      
      // Keep isReplacement flag to maintain the teal-green gradient permanently
    } catch (error) {
      console.error('Error getting "Something Else" recommendation:', error);
    }
  };

  const handleDismiss = (railId, id) => {
    console.log(`Dismiss clicked on tile ${id} in rail ${railId}`);
    
    const tiles = railId === 1 ? tilesRail1 : tilesRail2;
    const setTiles = railId === 1 ? setTilesRail1 : setTilesRail2;
    const setRemovedTiles = railId === 1 ? setRemovedTilesRail1 : setRemovedTilesRail2;
    const setDismissedItemIds = railId === 1 ? setDismissedItemIdsRail1 : setDismissedItemIdsRail2;
    
    // Find the tile to remove
    const tileIndex = tiles.findIndex(tile => tile.id === id);
    const tileToRemove = tiles[tileIndex];
    
    if (!tileToRemove) return;
    
    // Add dismissed tile to dismissed list to prevent it from surfacing again
    if (tileToRemove.item_id) {
      setDismissedItemIds(prev => new Set([...prev, tileToRemove.item_id]));
    }
    
    // Store the removed tile info for showing banner
    // Remove any existing banner at this index to ensure only the most recent action shows
    setRemovedTiles(prev => {
      // Filter out any previous banners at this tile index
      const filteredBanners = prev.filter(banner => banner.index !== tileIndex);
      
      // Add the new banner for the most recent action
      return [...filteredBanners, {
        id: tileToRemove.id,
        title: tileToRemove.title,
        index: tileIndex,
        tile: tileToRemove, // Store full tile data for undo
        action: 'removed'
      }];
    });
    
    // Remove the tile from the array
    setTiles(prevTiles => prevTiles.filter(tile => tile.id !== id));
  };

  const handleUndo = (railId, removedTileData) => {
    console.log(`Undo clicked for tile ${removedTileData.id} in rail ${railId}`);
    
    const setTiles = railId === 1 ? setTilesRail1 : setTilesRail2;
    const setRemovedTiles = railId === 1 ? setRemovedTilesRail1 : setRemovedTilesRail2;
    const setDismissedItemIds = railId === 1 ? setDismissedItemIdsRail1 : setDismissedItemIdsRail2;
    
    // Remove the restored tile's item_id from dismissed list
    if (removedTileData.tile?.item_id) {
      setDismissedItemIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(removedTileData.tile.item_id);
        return newSet;
      });
    }
    
    if (removedTileData.action === 'removed') {
      // Restore the tile at its original position (insert back)
      setTiles(prevTiles => {
        const newTiles = [...prevTiles];
        newTiles.splice(removedTileData.index, 0, removedTileData.tile);
        return newTiles;
      });
    } else if (removedTileData.action === 'replaced') {
      // Replace the new tile back with the original tile (with subtle restore animation)
      const restoredTile = {
        ...removedTileData.tile,
        isRestored: true
      };
      
      setTiles(prevTiles => {
        const newTiles = [...prevTiles];
        newTiles.splice(removedTileData.index, 1, restoredTile);
        return newTiles;
      });
      
      // Remove the isRestored flag after animation completes
      setTimeout(() => {
        setTiles(prevTiles => 
          prevTiles.map(tile => 
            tile.id === restoredTile.id ? { ...tile, isRestored: false } : tile
          )
        );
      }, 400);
    }
    
    // Remove from removed tiles list
    setRemovedTiles(prev => prev.filter(t => t.id !== removedTileData.id));
  };

  const handleBannerDismiss = (railId, id) => {
    const setRemovedTiles = railId === 1 ? setRemovedTilesRail1 : setRemovedTilesRail2;
    
    // Remove from removed tiles list when banner auto-dismisses
    setRemovedTiles(prev => prev.filter(t => t.id !== id));
  };

  // Helper to render a tile with potential banner overlay
  const renderTileWithBanner = (tile, index, railId, TileComponent, handlers) => {
    const removedTiles = railId === 1 ? removedTilesRail1 : removedTilesRail2;
    // Find banner by matching tile ID (for replaced tiles) or by index (for removed tiles)
    const banner = removedTiles.find(rt => rt.id === tile.id || rt.index === index);
    
    return (
      <div key={tile.id} style={{ position: 'relative' }}>
        <TileComponent
          image={tile.poster}
          title={tile.title}
          subtitle={tile.year}
          isNew={tile.isNew}
          isReplacement={tile.isReplacement}
          isRestored={tile.isRestored}
          animationDelay={tile.animationDelay}
          draggable={true}
          isDragging={handlers.isDragging}
          onDragStart={handlers.onDragStart}
          onDragEnd={handlers.onDragEnd}
          onDragOver={handlers.onDragOver}
          onDrop={handlers.onDrop}
          onMoreLikeThis={() => handleMoreLikeThis(railId, tile.id)}
          onSomethingElse={() => handleSomethingElse(railId, tile.id)}
          onDismiss={() => handleDismiss(railId, tile.id)}
        />
        {banner && (
          <div style={{
            position: 'absolute',
            top: 'var(--space-vertical-near-sm, 4px)',
            left: 'var(--space-horizontal-near-sm, 4px)',
            right: 'var(--space-horizontal-near-sm, 4px)',
            zIndex: 10,
            pointerEvents: 'auto'
          }}>
            <RemovalBanner
              title={banner.title}
              action={banner.action}
              onUndo={() => handleUndo(railId, banner)}
              onDismiss={() => handleBannerDismiss(railId, banner.id)}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <ThemeProvider brand="max">
      <div style={{ 
        minHeight: '100vh',
        background: '#040A0A',
        overflow: 'visible'
      }}>
        <Rail title="Your List">
          {tilesRail1.map((tile, index) => 
            renderTileWithBanner(tile, index, 1, TileWithMetadata, {
              isDragging: draggedIndexRail1 === index,
              onDragStart: handleDragStartRail1(index),
              onDragEnd: handleDragEndRail1,
              onDragOver: handleDragOverRail1(index),
              onDrop: handleDropRail1(index)
            })
          )}
        </Rail>
        
        <Rail title="Your List">
          {tilesRail2.map((tile, index) => 
            renderTileWithBanner(tile, index, 2, Tile23WithMetadata, {
              isDragging: draggedIndexRail2 === index,
              onDragStart: handleDragStartRail2(index),
              onDragEnd: handleDragEndRail2,
              onDragOver: handleDragOverRail2(index),
              onDrop: handleDropRail2(index)
            })
          )}
        </Rail>
      </div>
    </ThemeProvider>
  );
}

export default App;
