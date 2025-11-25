"""
Design Token Utilities for Python Backend
Loads and resolves tokens from Slate Design System
"""

import json
from pathlib import Path
from typing import Any, Dict, Optional

class DesignTokens:
    """
    Design token loader and resolver for Slate Design System
    """
    
    def __init__(self, brand: str = 'max'):
        """
        Initialize design tokens for a specific brand
        
        Args:
            brand: Brand identifier (max, dplus, stress, tntsports)
        """
        self.brand = brand
        self.token_path = Path(__file__).parent / 'design_tokens'
        self.tokens = self._load_all_tokens()
    
    def _load_json(self, filepath: Path) -> Dict:
        """Load a JSON file and return its contents"""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"Warning: Token file not found: {filepath}")
            return {}
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON from {filepath}: {e}")
            return {}
    
    def _load_all_tokens(self) -> Dict:
        """Load all design token files"""
        tokens = {}
        
        # Load color tokens
        color_file = self.token_path / 'color' / f'{self.brand}.tokens.json'
        color_data = self._load_json(color_file)
        if color_data:
            tokens.update(color_data)
        
        # Load text tokens
        text_file = self.token_path / 'text.tokens.json'
        text_data = self._load_json(text_file)
        if text_data:
            tokens.update(text_data)
        
        # Load spacing tokens
        space_file = self.token_path / 'space-size' / f'{self.brand}.tokens.json'
        space_data = self._load_json(space_file)
        if space_data:
            tokens.update(space_data)
        
        return tokens
    
    def resolve_token(self, token_value: Any, max_depth: int = 10) -> Any:
        """
        Resolve token references recursively
        
        Args:
            token_value: Token value to resolve (may contain references like {color.general.text.high})
            max_depth: Maximum recursion depth to prevent infinite loops
            
        Returns:
            Resolved token value
        """
        if max_depth <= 0:
            print(f"Warning: Max recursion depth reached resolving token: {token_value}")
            return token_value
        
        # Check if this is a token reference
        if isinstance(token_value, str) and token_value.startswith('{') and token_value.endswith('}'):
            # Extract the path
            path = token_value[1:-1].split('.')
            
            # Navigate through the token structure
            value = self.tokens
            for key in path:
                if isinstance(value, dict):
                    value = value.get(key)
                else:
                    print(f"Warning: Could not resolve token path: {token_value}")
                    return token_value
                
                if value is None:
                    print(f"Warning: Token path not found: {token_value}")
                    return token_value
            
            # If we found a token object with a 'value' key, resolve it
            if isinstance(value, dict) and 'value' in value:
                return self.resolve_token(value['value'], max_depth - 1)
            
            # Otherwise return the value as-is
            return self.resolve_token(value, max_depth - 1)
        
        return token_value
    
    def get_token(self, path: str) -> Optional[Any]:
        """
        Get a token by its path
        
        Args:
            path: Dot-separated path to the token (e.g., 'color.general.text.high')
            
        Returns:
            Resolved token value or None if not found
        """
        keys = path.split('.')
        value = self.tokens
        
        for key in keys:
            if isinstance(value, dict):
                value = value.get(key)
            else:
                return None
            
            if value is None:
                return None
        
        # If it's a token object, resolve and return its value
        if isinstance(value, dict) and 'value' in value:
            return self.resolve_token(value['value'])
        
        return self.resolve_token(value)
    
    def get_color_token(self, path: str) -> Optional[str]:
        """
        Get a color token value
        
        Args:
            path: Dot-separated path to the color token
            
        Returns:
            Color value (hex, rgb, etc.) or None
        """
        return self.get_token(path)
    
    def get_spacing_token(self, path: str) -> Optional[int]:
        """
        Get a spacing token value
        
        Args:
            path: Dot-separated path to the spacing token
            
        Returns:
            Spacing value in pixels or None
        """
        value = self.get_token(path)
        if isinstance(value, (int, float)):
            return int(value)
        return None
    
    def get_theme_config(self) -> Dict:
        """
        Get a comprehensive theme configuration
        
        Returns:
            Dictionary with theme configuration
        """
        return {
            'brand': self.brand,
            'tokens': {
                'colors': self._extract_category('color'),
                'text': self._extract_category('font'),
                'spacing': self._extract_category('space-size')
            }
        }
    
    def _extract_category(self, category: str) -> Dict:
        """
        Extract all tokens from a specific category
        
        Args:
            category: Category name (color, font, space-size, etc.)
            
        Returns:
            Dictionary of tokens in that category
        """
        if category in self.tokens:
            return self.tokens[category]
        return {}
    
    def export_css_variables(self) -> str:
        """
        Export design tokens as CSS variables
        
        Returns:
            String of CSS variable definitions
        """
        css_vars = []
        
        def traverse(obj: Any, path: list = []) -> None:
            """Recursively traverse token structure"""
            if isinstance(obj, dict):
                if 'type' in obj and 'value' in obj:
                    # This is a token
                    var_name = '--' + '-'.join(path)
                    value = self.resolve_token(obj['value'])
                    
                    # Format value based on type
                    if obj['type'] == 'number':
                        value = f"{value}px"
                    
                    css_vars.append(f"  {var_name}: {value};")
                else:
                    # Continue traversing
                    for key, val in obj.items():
                        traverse(val, path + [key])
        
        traverse(self.tokens)
        
        return ":root {\n" + "\n".join(css_vars) + "\n}"


# Example usage
if __name__ == "__main__":
    # Test token loading
    tokens = DesignTokens(brand='max')
    
    print("✅ Tokens loaded successfully")
    print(f"Brand: {tokens.brand}")
    print(f"\nSample color token:")
    print(f"  Primary action color: {tokens.get_color_token('color.action.primary.fill.mid')}")
    
    print(f"\nTheme config:")
    import json
    print(json.dumps(tokens.get_theme_config(), indent=2)[:500] + "...")

