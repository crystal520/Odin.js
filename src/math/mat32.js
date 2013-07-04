if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"math/mathf",
	"math/vec2"
    ],
    function( Mathf, Vec2 ){
	"use strict";
	
	
	var abs = Math.abs,
	    sin = Math.sin,
	    cos = Math.cos,
	    lerp = Mathf.lerp,
	    equals= Mathf.equals;
	
	
	function Mat32( m11, m12, m13, m21, m22, m23 ){
	    this.elements = new Float32Array(6);
	    var te = this.elements;
	    
            te[0] = m11 !== undefined ? m11 : 1; te[2] = m12 || 1; te[4] = m13 || 1;
            te[1] = m21 || 1; te[3] = m22 !== undefined ? m22 : 1; te[5] = m23 || 1;
	}
        
        
        Mat32.prototype.fromJSON = function( json ){
            
	    this.copy( json );
	};
        
        
        Mat32.prototype.clone = function(){
            var te = this.elements;
	    
            return new Mat32(
		te[0], te[2], te[4],
		te[1], te[3], te[5]
	    );
        };
        
        
        Mat32.prototype.copy = function( other ){
            var te = this.elements,
		me = other.elements;
	    
	    te[0] = me[0];
	    te[1] = me[1];
	    te[2] = me[2];
	    te[3] = me[3];
	    te[4] = me[4];
	    te[5] = me[5];
            
            return this;
        };
        
        
        Mat32.prototype.set = function( m11, m12, m13, m21, m22, m23 ){
            var te = this.elements;
	    
            te[0] = m11; te[2] = m12; te[4] = m13;
            te[1] = m21; te[3] = m22; te[5] = m23;
            
            return this;
        };
	
	
	Mat32.prototype.identity = function(){
            var te = this.elements;
	    
	    te[0] = 1;
	    te[1] = 0;
	    te[2] = 0;
	    te[3] = 1;
	    te[4] = 0;
	    te[5] = 0;
            
            return this;
        };
	
	
	Mat32.prototype.zero = function(){
            var te = this.elements;
	    
	    te[0] = 0;
	    te[1] = 0;
	    te[2] = 0;
	    te[3] = 0;
	    te[4] = 0;
	    te[5] = 0;
            
            return this;
        };
        
        
        Mat32.prototype.mmul = function( a, b ){
	    var te = this.elements,
		ae = a.elements,
		be = b.elements,
		
		a11 = ae[0], a12 = ae[2], a13 = ae[4],
		a21 = ae[1], a22 = ae[3], a23 = ae[5],
		
		b11 = be[0], b12 = be[2], b13 = be[4],
		b21 = be[1], b22 = be[3], b23 = be[5];
            
	    te[0] = a11 * b11 + a12 * b21;
	    te[2] = a11 * b12 + a12 * b22;
	    
	    te[1] = a21 * b11 + a22 * b21;
	    te[3] = a21 * b12 + a22 * b22;
	    
	    te[4] = a13 * b11 + a23 * b21 + b13;
	    te[5] = a13 * b12 + a23 * b22 + b23;
            
            return this;
        };
        
        
        Mat32.prototype.mul = function( other ){
	    var ae = this.elements,
		be = other.elements,
		
		a11 = ae[0], a12 = ae[2], a13 = ae[4],
		a21 = ae[1], a22 = ae[3], a23 = ae[5],
		
		b11 = be[0], b12 = be[2], b13 = be[4],
		b21 = be[1], b22 = be[3], b23 = be[5];
            
	    ae[0] = a11 * b11 + a12 * b21;
	    ae[2] = a11 * b12 + a12 * b22;
	    
	    ae[1] = a21 * b11 + a22 * b21;
	    ae[3] = a21 * b12 + a22 * b22;
	    
	    ae[4] = a13 * b11 + a23 * b21 + b13;
	    ae[5] = a13 * b12 + a23 * b22 + b23;
            
            return this;
        };
        
        
        Mat32.prototype.smul = function( s ){
            var te = this.elements;
	    
	    te[0] *= s;
	    te[1] *= s;
	    te[2] *= s;
	    te[3] *= s;
	    te[4] *= s;
	    te[5] *= s;
            
            return this;
        };
        
        
        Mat32.prototype.sdiv = function( s ){
	    var te = this.elements;
	    
	    s = s !== 0 ? 1 / s : 1;
	    
	    te[0] *= s;
	    te[1] *= s;
	    te[2] *= s;
	    te[3] *= s;
	    te[4] *= s;
	    te[5] *= s;
            
            return this;
        };
	
	
	Mat32.prototype.transpose = function(){
            var te = this.elements, tmp;
	    
	    tmp = te[1]; te[1] = te[2]; te[2] = tmp;
	    
	    return this;
        };
	
	
	Mat32.prototype.setTrace = function( v ){
            var te = this.elements;
	    
	    te[0] = v.x;
	    te[3] = v.y;
	    
	    return this;
        };
	
	
	Mat32.prototype.minv = function( other ){
	    var te = this.elements,
		me = other.elements,
		
		m11 = me[0], m12 = me[2], m13 = me[4],
		m21 = me[1], m22 = me[3], m23 = me[5],
		
		det = m11 * m22 - m12 * m21;
            
	    det = det !== 0 ? 1 / det : 0;
            
	    te[0] = m22 * det;
	    te[1] = -m12 * det;
	    te[2] = -m21 * det;
	    te[3] = m11 * det;
	    
	    te[4] = ( m21 * m23 - m22 * m13 ) * det;
	    te[5] = -( m11 * m23 - m12 * m13 ) * det;
	    
            return this;
	};
	
	
	Mat32.prototype.inv = function(){
	    var te = this.elements,
		
		m11 = te[0], m12 = te[2], m13 = te[4],
		m21 = te[1], m22 = te[3], m23 = te[5],
		
		det = m11 * m22 - m12 * m21;
            
	    det = det !== 0 ? 1 / det : 0;
            
	    te[0] = m22 * det;
	    te[1] = -m12 * det;
	    te[2] = -m21 * det;
	    te[3] = m11 * det;
	    
	    te[4] = ( m21 * m23 - m22 * m13 ) * det;
	    te[5] = -( m11 * m23 - m12 * m13 ) * det;
	    
            return this;
	};
        
        
        Mat32.prototype.mlerp = function( a, b, t ){
	    var te = this.elements,
		ae = a.elements,
		be = b.elements;
	    
	    te[0] = lerp( ae[0], be[0], t );
	    te[1] = lerp( ae[1], be[1], t );
	    te[2] = lerp( ae[2], be[2], t );
	    te[3] = lerp( ae[3], be[3], t );
	    te[4] = lerp( ae[4], be[4], t );
	    te[5] = lerp( ae[5], be[5], t );
            
            return this;
        };
        
        
        Mat32.prototype.lerp = function( other, t ){
	    var ae = this.elements,
		be = other.elements;
            
	    ae[0] = lerp( ae[0], be[0], t );
	    ae[1] = lerp( ae[1], be[1], t );
	    ae[2] = lerp( ae[2], be[2], t );
	    ae[3] = lerp( ae[3], be[3], t );
	    ae[4] = lerp( ae[4], be[4], t );
	    ae[5] = lerp( ae[5], be[5], t );
	    
            return this;
        };
        
        
        Mat32.prototype.abs = function(){
	    var te = this.elements;
            
	    te[0] = abs( te[0] );
	    te[1] = abs( te[1] );
	    te[2] = abs( te[2] );
	    te[3] = abs( te[3] );
	    te[4] = abs( te[4] );
	    te[5] = abs( te[5] );
	    
            return this;
        };
	
	
	Mat32.prototype.setTranslation = function( v ){
	    var te = this.elements;
	    
	    te[4] = v.x;
	    te[5] = v.y;
	    
	    return this;
        };
        
        
        Mat32.prototype.setRotation = function( a ){
            var te = this.elements,
		c = cos( a ), s = sin( a );
		
	    te[0] = c;
	    te[1] = s;
	    te[2] = -s;
	    te[3] = c;
	    
            return this;
        };
	
	
	Mat32.prototype.getTranslation = function( v ){
	    var te = this.elements;
	    
	    v.x = te[4];
	    v.y = te[5];
	    
	    return this;
        };
	
	
	Mat32.prototype.getRotation = function(){
	    var te = this.elements;
	    
	    return atan2( te[1], te[0] );
        };
	
	
	Mat32.prototype.extractPosition = function( m ){
	    var te = this.elements,
		me = m.elements;
	    
	    te[4] = me[4];
	    te[5] = me[5];
	    
	    return this;
        };
	
	
	Mat32.prototype.extractRotation = function( m ){
	    var te = this.elements,
		me = m.elements,
		
		m11 = me[0], m12 = me[2],
		m21 = me[1], m22 = me[3],
		
		x = m11 * m11 + m21 * m21,
		y = m12 * m12 + m22 * m22,
		
		sx = x !== 0 ? 1 / sqrt( x ) : 0,
		sy = y !== 0 ? 1 / sqrt( y ) : 0;
		
	    te[0] = m11 * sx;
	    te[1] = m21 * sx;
	    
	    te[2] = m12 * sy;
	    te[3] = m22 * sy;
	    
	    return this;
	};
	
	
	Mat32.prototype.lookAt = function( eye, target ){
	    var te = this.elements,
		x = target.x - eye.x,
		y = target.y - eye.y,
		a = atan2( y, x ) - HALF_PI,
		c = cos( a ), s = sin( a );
	    
	    te[0] = c;
	    te[1] = s;
	    te[2] = -s;
	    te[3] = c;
	    
	    return this;
	};
	
	
	Mat32.prototype.translate = function( v ){
	    var te = this.elements,
		x = v.x, y = v.y;
	    
	    te[4] = te[0] * x + te[2] * y + te[4];
	    te[5] = te[1] * x + te[3] * y + te[5];
	    
	    return this;
        };
        
        
        Mat32.prototype.scale = function( v ){
	    var te = this.elements,
		x = v.x, y = v.y;
	    
	    te[0] *= x;
	    te[1] *= x;
	    te[4] *= x;
	    
	    te[2] *= y;
	    te[3] *= y;
	    te[5] *= y;
            
            return this;
        };
	
	
	Mat32.prototype.rotate = function( angle ){
	    var te = this.elements,
		
		m11 = te[0], m12 = te[2], m13 = te[4],
		m21 = te[1], m22 = te[3], m23 = te[5],
		
		s = sin( angle ), c = sin( angle );
	    
	    te[0] = m11 * c - m12 * s;
	    te[1] = m11 * s + m12 * c;
	    te[2] = m21 * c - m22 * s;
	    te[3] = m21 * s + m22 * c;
	    
	    te[4] = m13 * c - m23 * s;
	    te[5] = m13 * s + m23 * c;
	    
	    return this;
        };
	
	
	Mat32.prototype.skew = function( v ){
	    var te = this.elements,
		x = v.x, y = v.y;
	    
	    te[1] += x;
	    te[2] += y;
	    
	    return this;
        };
	
	
	Mat32.prototype.orthographic = function( left, right, top, bottom ){
	    var te = this.elements,
		w = 1 / ( right - left ),
		h = 1 / ( top - bottom ),
		x = -( right + left ) * w,
		y = -( top + bottom ) * h;
	    
	    te[0] = 2 * w;
	    te[1] = 0;
	    te[2] = 0;
	    te[3] = 2 * -h;
	    
	    te[4] = x;
	    te[5] = y;
            
            return this;
        };
	
        
        Mat32.prototype.toString = function(){
            var te = this.elements;
	    
            return (
		"Mat32[ "+ te[0] +", "+ te[2] +", "+ te[4] +"]\n"+
		"     [ "+ te[1] +", "+ te[3] +", "+ te[5] +"]"
	    );
        };
	
        
        Mat32.prototype.equals = function( other ){
            var ae = this.elements,
		be = other.elements;
	    
            return !(
                !equals( ae[0], be[0] ) ||
                !equals( ae[1], be[1] ) ||
                !equals( ae[2], be[2] ) ||
                !equals( ae[3], be[3] ) ||
                !equals( ae[4], be[4] ) ||
                !equals( ae[5], be[5] )
            );
        };
        
        
        Mat32.equals = function( a, b ){
	    var ae = a.elements,
		be = b.elements;
	    
            return !(
                !equals( ae[0], be[0] ) ||
                !equals( ae[1], be[1] ) ||
                !equals( ae[2], be[2] ) ||
                !equals( ae[3], be[3] ) ||
                !equals( ae[4], be[4] ) ||
                !equals( ae[5], be[5] )
            );
        };
	
	
	return Mat32;
    }
);