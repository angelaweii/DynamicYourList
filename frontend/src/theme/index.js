import maxColors from '../assets/color/max.tokens.json';
import dplusColors from '../assets/color/dplus.tokens.json';
import colorContextLevel0 from '../assets/color-context/level-0.tokens.json';
import maxBorders from '../assets/border/max.tokens.json';
import maxMotion from '../assets/motion/max.tokens.json';
import textTokens from '../assets/text.tokens.json';
import maxSpaceTokens from '../assets/space-size/max.tokens.json';
import elevationTokens from '../assets/elevation.tokens.json';
import gradientTokens from '../assets/gradient.tokens.json';
import maxComponentTokens from '../assets/component/max.tokens.json';

/**
 * Token resolution utility
 * Resolves token references like {color.general.text.high}
 */
export function resolveToken(tokenValue, allTokens) {
  if (typeof tokenValue === 'string' && 
      tokenValue.startsWith('{') && 
      tokenValue.endsWith('}')) {
    const path = tokenValue.slice(1, -1).split('.');
    let value = allTokens;
    for (const key of path) {
      value = value?.[key];
      if (!value) {
        console.warn(`Token path not found: ${tokenValue}`);
        return tokenValue; // Return original if path not found
      }
    }
    const resolvedValue = value?.value ?? value;
    return resolveToken(resolvedValue, allTokens);
  }
  return tokenValue;
}

/**
 * Get all tokens for a specific brand
 */
export function getBrandTokens(brand = 'max') {
  const colorTokens = brand === 'max' ? maxColors : dplusColors;
  const borderTokens = maxBorders; // Use max borders for now
  const spaceTokens = maxSpaceTokens;
  const componentTokens = maxComponentTokens; // Use max component tokens for now
  
  return {
    'color-context': colorContextLevel0['color-context'], // Add color context for token resolution
    color: colorTokens.color,
    border: borderTokens.border,
    motion: maxMotion.motion,
    font: textTokens.font,
    'space-size': spaceTokens['space-size'],
    elevation: elevationTokens.elevation,
    gradient: gradientTokens.gradient,
    component: componentTokens.component
  };
}

/**
 * Format token value based on type
 */
function formatValue(value, type, path = []) {
  if (value === null || value === undefined) return '';
  
  // Check if this is a motion duration token (should be in ms, not px)
  const isMotionDuration = path.includes('motion') && path.includes('duration');
  // Check if this is a motion scale token (should be unitless)
  const isMotionScale = path.includes('motion') && path.includes('scale');
  
  switch (type) {
    case 'color':
      return value;
    case 'number':
      // Motion duration should be in ms
      if (isMotionDuration) return `${value}ms`;
      // Motion scale should be unitless
      if (isMotionScale) return value.toString();
      // Everything else in px
      return `${value}px`;
    case 'corner':
      if (typeof value === 'object') {
        return `${value.topLeft}px ${value.topRight}px ${value.bottomRight}px ${value.bottomLeft}px`;
      }
      return `${value}px`;
    case 'cubicBezier':
      if (typeof value === 'object') {
        return `cubic-bezier(${value.x1}, ${value.y1}, ${value.x2}, ${value.y2})`;
      }
      return value;
    case 'shadow':
      if (typeof value === 'object') {
        // Handle shadow objects
        const shadows = Array.isArray(value) ? value : [value];
        return shadows.map(s => 
          `${s.offsetX}px ${s.offsetY}px ${s.radius}px ${s.spread}px ${s.color}`
        ).join(', ');
      }
      return value;
    case 'typography':
      // Typography is handled separately
      return null;
    default:
      return typeof value === 'number' ? `${value}px` : value;
  }
}

/**
 * Generate CSS variables from design tokens
 */
export function generateCSSVariables(brand = 'max') {
  const allTokens = getBrandTokens(brand);
  let cssVars = {};
  
  function traverse(obj, path = []) {
    for (const [key, value] of Object.entries(obj)) {
      const newPath = [...path, key];
      
      if (value?.type && value?.value !== undefined) {
        // This is a token
        const varName = newPath.join('-');
        const resolvedValue = resolveToken(value.value, allTokens);
        const formattedValue = formatValue(resolvedValue, value.type, newPath);
        
        if (formattedValue !== null) {
          cssVars[`--${varName}`] = formattedValue;
        }
        
        // Handle typography tokens specially
        if (value.type === 'typography' && typeof resolvedValue === 'object') {
          cssVars[`--${varName}-font-family`] = resolveToken(resolvedValue.fontFamily, allTokens);
          cssVars[`--${varName}-font-size`] = `${resolveToken(resolvedValue.fontSize, allTokens)}px`;
          cssVars[`--${varName}-line-height`] = `${resolveToken(resolvedValue.lineHeight, allTokens)}px`;
          cssVars[`--${varName}-font-weight`] = resolvedValue.fontWeight;
          cssVars[`--${varName}-letter-spacing`] = `${resolveToken(resolvedValue.letterSpacing, allTokens)}px`;
        }
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        traverse(value, newPath);
      }
    }
  }
  
  traverse(allTokens);
  return cssVars;
}

/**
 * Get a specific token value
 */
export function getToken(path, brand = 'max') {
  const allTokens = getBrandTokens(brand);
  const pathArray = path.split('.');
  
  let value = allTokens;
  for (const key of pathArray) {
    value = value?.[key];
    if (!value) {
      console.warn(`Token not found: ${path}`);
      return null;
    }
  }
  
  return resolveToken(value?.value ?? value, allTokens);
}

/**
 * Export pre-configured token sets for easy use
 */
export const tokens = {
  max: getBrandTokens('max'),
  dplus: getBrandTokens('dplus')
};

export default {
  resolveToken,
  getBrandTokens,
  generateCSSVariables,
  getToken,
  tokens
};

