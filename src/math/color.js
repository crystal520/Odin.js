if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"math/mathf"
    ],
    function( Mathf ){
        "use strict";
        
	var abs = Math.abs,
	    floor = Math.floor,
	    sqrt = Math.sqrt,
	    lerp = Mathf.lerp,
	    equals = Mathf.equals;
	
        
        function Color( r, g, b, a ){
            this.r = 0;
            this.g = 0;
            this.b = 0;
            this.a = 1;
            
            this._cache = {
                rgb: "rgb( 0, 0, 0 )",
                rgba: "rgba( 0, 0, 0, 1 )",
                hex: "#000000"
            };
            
            this.set(
                r || 0,
                g || 0,
                b || 0,
                a !== undefined ? a : 1
            );
        }
        
        
        Color.prototype.fromJSON = function( json ){
            
	    this.copy( json );
	};
        
        
        Color.prototype.clone = function(){
            
            return new Color( this.r, this.g, this.b, this.a );
        };
        
        
        Color.prototype.copy = function( other ){
	    var cacheA = this._cache,
		cacheB = other._cache;
	    
	    this.r = other.r;
	    this.g = other.g;
	    this.b = other.b;
	    this.a = other.a;
	    
	    cacheA.hex = cacheB.hex;
	    cacheA.rgb = cacheB.rgb;
	    cacheA.rgba = cacheB.rgba;
            
            return this;
        };
        
        
        Color.prototype.set = function( r, g, b, a ){
            
            if( typeof r === "number" ){
                
                this.setArgs( r, g, b, a );
            }
            else if( typeof r === "string" ){
                
                this.setString( r );
            }
            else{
                this.set( 0, 0, 0, 1 );
                console.warn("Color.set: Invalid input");
            }
            
            return this;
        };
        
        
        Color.prototype.setString = function(){
            
            var reg1 = /^rgb(a)?\(\s*(-?[\d]+)(%)?\s*,\s*(-?[\d]+)(%)?\s*,\s*(-?[\d]+)(%)?\s*,?\s*(-?[\d\.]+)?\s*\)$/,
                reg2 = /#(.)(.)(.)/,
                str = "#$1$1$2$2$3$3",
                hexName;
            
            function isValidRgb( rgb ){
                
                return rgb.match( reg1 );
            };
            
            function isValidHex( hex ){
                
                return reg2.test( hex );
            };
            
            return function( str ){
                hexName = colorNames[ str.toLowerCase() ];
                
                if( isValidHex( str ) ){
                    
                    this.setHex( str );
                }
                else if( isValidRgb( str ) ){
                    
                    this.setRgb( str );
                }
                else if( hexName ){
                    
                    this.setHex( hexName );
                }
                else{
                    this.set( 0, 0, 0, 1 );
                    console.warn("Color.setString: Invalid String");
                }
                
                return this;
            };
        }();
        
        
        Color.prototype.setArgs = function( r, g, b, a ){
            
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
            
            this._updateCache();
            
            return this;
        };
        
        
        Color.prototype.setRgb = function(){
            
            var reg = /^rgb(a)?\(\s*(-?[\d]+)(%)?\s*,\s*(-?[\d]+)(%)?\s*,\s*(-?[\d]+)(%)?\s*,?\s*(-?[\d\.]+)?\s*\)$/;
            
            function isValid( rgb ){
                
                return rgb.match( reg );
            };
            
            return function( rgb ){
                
                rgb = isValid( rgb );
                
                if( !!rgb ){
                    
                    this.r = Number( rgb[2] ) / 255;
                    this.g = Number( rgb[4] ) / 255;
                    this.b = Number( rgb[6] ) / 255;
                    this.a = Number( rgb[8] ) || 1;
                }
                else{
                    this.set( 0, 0, 0, 1 )
                    console.warn("Color.setRgb: Invalid rgb");
                }
                
                this._updateCache();
                
                return this;
            };
        }();
        
        
        Color.prototype.setHex = function(){
            
            var reg1 = /#(.)(.)(.)/,
                reg2 = /^#(?:[0-9a-f]{3}){1,2}$/i,
                str = "#$1$1$2$2$3$3";
            
            function normalizeHex( hex ){
                
                if( hex.length === 4 ){
                    hex = hex.replace( reg1, str );
                }
                hex.toLowerCase();
                
                return hex;
            };
            
            function isValid( hex ){
                
                return reg2.test( hex );
            };
            
            return function( hex ){
		
                if( isValid( hex ) ){
                    normalizeHex( hex );
                    
                    this.r = parseInt( hex.substr( 1, 2 ), 16 ) / 255;
                    this.g = parseInt( hex.substr( 3, 2 ), 16 ) / 255;
                    this.b = parseInt( hex.substr( 5, 2 ), 16 ) / 255;
                    this.a = 1;
                }
                else{
                    this.set( 0, 0, 0, 1 );
                    console.warn("Color.setHex: Invalid hex");
                }
                
                this._updateCache();
                
                return this;
            };
        }();
        
        
        Color.prototype._updateCache = function(){
            var cache, num, n;
            
            function singleToHex( value ){
                num = floor( value * 255 )
                n = parseInt( num ).toString(16);
                
                if( num === 0 ){
                    n = "00";
                }
                else if( num > 0 && num < 15 ){
                    n = "0"+ n;
                }
                
                return n;
            }
            
            return function(){
                cache = this._cache;
                
                var hexR = singleToHex( this.r ),
                    hexG = singleToHex( this.g ),
                    hexB = singleToHex( this.b ),
                    
                    rgbR = floor( this.r * 256 ),
                    rgbG = floor( this.g * 256 ),
                    rgbB = floor( this.b * 256 ),
                    rgbA = floor( this.a );
                    
                cache.rgb = "rgb( "+ rgbR +", "+ rgbG +", "+ rgbB +" )";
                cache.rgba = "rgba( "+ rgbR +", "+ rgbG +", "+ rgbB +", "+ rgbA +" )";
                
                cache.hex = "#"+ hexR + hexG + hexB;
                
                return this;
            };
        }();
        
        
        Color.prototype.hex = function(){
            
            return this._cache.hex;
        };
        
        
        Color.prototype.rgb = function(){
            
            return this.a === 1 ? this._cache.rgb : this._cache.rgba;
        };
        
        
        Color.prototype.rgba = function(){
            
            return this._cache.rgba;
        };
        
        
        Color.prototype.smul = function( s ){
            
            this.r *= s;
            this.g *= s;
            this.b *= s;
            this.a *= s;
            
            return this;
        };
        
        
        Color.prototype.sdiv = function( s ){
            s = s !== 0 ? 1 / s : 0;
	    
            this.r *= s;
            this.g *= s;
            this.b *= s;
            this.a *= s;
            
            return this;
        };
        
        
        Color.prototype.clerp = function( a, b, t ){
            
            this.r = lerp( a.r, b.r, t );
            this.g = lerp( a.g, b.g, t );
            this.b = lerp( a.b, b.b, t );
            this.a = lerp( a.a, b.a, t );
            
            return this;
        };
        
        
        Color.prototype.lerp = function( other, t ){
            
            this.r = lerp( this.r, other.r, t );
            this.g = lerp( this.g, other.g, t );
            this.b = lerp( this.b, other.b, t );
            this.a = lerp( this.a, other.a, t );
            
            return this;
        };
        
        
        Color.prototype.abs = function(){
	    
	    this.r = abs( this.r );
	    this.g = abs( this.g );
	    this.b = abs( this.b );
	    this.a = abs( this.a );
            
            return this;
        };
        
        
        Color.prototype.min = function( other ){
            var r = other.r, g = other.g, b = other.b, a = other.a;
            
	    this.r = r < this.r ? r : this.r;
	    this.g = g < this.g ? g : this.g;
	    this.b = b < this.b ? b : this.b;
	    this.a = a < this.a ? a : this.a;
            
            return this;
        };
        
        
        Color.prototype.max = function( other ){
            var r = other.r, g = other.g, b = other.b, a = other.a;
            
	    this.r = r > this.r ? r : this.r;
	    this.g = g > this.g ? g : this.g;
	    this.b = b > this.b ? b : this.b;
	    this.a = a > this.a ? a : this.a;
            
            return this;
        };
        
        
        Color.prototype.clamp = function( min, max ){
	    
            this.r = clamp( this.r, min.r, max.r );
            this.g = clamp( this.g, min.g, max.g );
            this.b = clamp( this.b, min.b, max.b );
            this.a = clamp( this.a, min.a, max.a );
            
            return this;
        };
        
        
        Color.prototype.toString = function(){
            
            return "Color( "+ this.r +", "+ this.g +", "+ this.b +", "+ this.a +" )";
        };
        
        
        Color.prototype.equals = function( other ){
            
            return !(
                !equals( this.r, other.r ) ||
                !equals( this.g, other.g ) ||
                !equals( this.b, other.b ) ||
                !equals( this.a, other.a )
            );
        };
        
        
        Color.equals = function( a, b ){
            
            return !(
                !equals( a.r, b.r ) ||
                !equals( a.g, b.g ) ||
                !equals( a.b, b.b ) ||
                !equals( a.a, b.a )
            );
        };
        
        
        var colorNames = {
            aliceblue:            "#f0f8ff",
            antiquewhite:         "#faebd7",
            aqua:                 "#00ffff",
            aquamarine:           "#7fffd4",
            azure:                "#f0ffff",
            beige:                "#f5f5dc",
            bisque:               "#ffe4c4",
            black:                "#000000",
            blanchedalmond:       "#ffebcd",
            blue:                 "#0000ff",
            blueviolet:           "#8a2be2",
            brown:                "#a52a2a",
            burlywood:            "#deb887",
            cadetblue:            "#5f9ea0",
            chartreuse:           "#7fff00",
            chocolate:            "#d2691e",
            coral:                "#ff7f50",
            cornflowerblue:       "#6495ed",
            cornsilk:             "#fff8dc",
            crimson:              "#dc143c",
            cyan:                 "#00ffff",
            darkblue:             "#00008b",
            darkcyan:             "#008b8b",
            darkgoldenrod:        "#b8860b",
            darkgray:             "#a9a9a9",
            darkgreen:            "#006400",
            darkkhaki:            "#bdb76b",
            darkmagenta:          "#8b008b",
            darkolivegreen:       "#556b2f",
            darkorange:           "#ff8c00",
            darkorchid:           "#9932cc",
            darkred:              "#8b0000",
            darksalmon:           "#e9967a",
            darkseagreen:         "#8fbc8f",
            darkslateblue:        "#483d8b",
            darkslategray:        "#2f4f4f",
            darkturquoise:        "#00ced1",
            darkviolet:           "#9400d3",
            deeppink:             "#ff1493",
            deepskyblue:          "#00bfff",
            dimgray:              "#696969",
            dodgerblue:           "#1e90ff",
            firebrick:            "#b22222",
            floralwhite:          "#fffaf0",
            forestgreen:          "#228b22",
            fuchsia:              "#ff00ff",
            gainsboro:            "#dcdcdc",
            ghostwhite:           "#f8f8ff",
            gold:                 "#ffd700",
            goldenrod:            "#daa520",
            gray:                 "#808080",
            green:                "#008000",
            greenyellow:          "#adff2f",
            grey:                 "#808080",
            honeydew:             "#f0fff0",
            hotpink:              "#ff69b4",
            indianred:            "#cd5c5c",
            indigo:               "#4b0082",
            ivory:                "#fffff0",
            khaki:                "#f0e68c",
            lavender:             "#e6e6fa",
            lavenderblush:        "#fff0f5",
            lawngreen:            "#7cfc00",
            lemonchiffon:         "#fffacd",
            lightblue:            "#add8e6",
            lightcoral:           "#f08080",
            lightcyan:            "#e0ffff",
            lightgoldenrodyellow: "#fafad2",
            lightgrey:            "#d3d3d3",
            lightgreen:           "#90ee90",
            lightpink:            "#ffb6c1",
            lightsalmon:          "#ffa07a",
            lightseagreen:        "#20b2aa",
            lightskyblue:         "#87cefa",
            lightslategray:       "#778899",
            lightsteelblue:       "#b0c4de",
            lightyellow:          "#ffffe0",
            lime:                 "#00ff00",
            limegreen:            "#32cd32",
            linen:                "#faf0e6",
            magenta:              "#ff00ff",
            maroon:               "#800000",
            mediumaquamarine:     "#66cdaa",
            mediumblue:           "#0000cd",
            mediumorchid:         "#ba55d3",
            mediumpurple:         "#9370d8",
            mediumseagreen:       "#3cb371",
            mediumslateblue:      "#7b68ee",
            mediumspringgreen:    "#00fa9a",
            mediumturquoise:      "#48d1cc",
            mediumvioletred:      "#c71585",
            midnightblue:         "#191970",
            mintcream:            "#f5fffa",
            mistyrose:            "#ffe4e1",
            moccasin:             "#ffe4b5",
            navajowhite:          "#ffdead",
            navy:                 "#000080",
            oldlace:              "#fdf5e6",
            olive:                "#808000",
            olivedrab:            "#6b8e23",
            orange:               "#ffa500",
            orangered:            "#ff4500",
            orchid:               "#da70d6",
            palegoldenrod:        "#eee8aa",
            palegreen:            "#98fb98",
            paleturquoise:        "#afeeee",
            palevioletred:        "#d87093",
            papayawhip:           "#ffefd5",
            peachpuff:            "#ffdab9",
            peru:                 "#cd853f",
            pink:                 "#ffc0cb",
            plum:                 "#dda0dd",
            powderblue:           "#b0e0e6",
            purple:               "#800080",
            red:                  "#ff0000",
            rosybrown:            "#bc8f8f",
            royalblue:            "#4169e1",
            saddlebrown:          "#8b4513",
            salmon:               "#fa8072",
            sandybrown:           "#f4a460",
            seagreen:             "#2e8b57",
            seashell:             "#fff5ee",
            sienna:               "#a0522d",
            silver:               "#c0c0c0",
            skyblue:              "#87ceeb",
            slateblue:            "#6a5acd",
            slategray:            "#708090",
            snow:                 "#fffafa",
            springgreen:          "#00ff7f",
            steelblue:            "#4682b4",
            tan:                  "#d2b48c",
            teal:                 "#008080",
            thistle:              "#d8bfd8",
            tomato:               "#ff6347",
            turquoise:            "#40e0d0",
            violet:               "#ee82ee",
            wheat:                "#f5deb3",
            white:                "#ffffff",
            whitesmoke:           "#f5f5f5",
            yellow:               "#ffff00",
            yellowgreen:          "#9acd32"
        };
        
        
        return Color;
    }
);