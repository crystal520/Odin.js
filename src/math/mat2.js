if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"math/mathf"
    ],
    function( Mathf ){
	"use strict";
	
	
	var abs = Math.abs,
	    sin = Math.sin,
	    cos = Math.cos,
	    atan2 = Math.atan2,
	    lerp = Mathf.lerp,
	    equals= Mathf.equals;
	
	
	function Mat2( m11, m12, m21, m22 ){
	    this.elements = new Float32Array(4);
	    var te = this.elements;
	    
            te[0] = m11 !== undefined ? m11 : 1; te[2] = m12 || 0;
            te[1] = m21 || 0; te[3] = m22 !== undefined ? m22 : 1;
	}
        
        
        Mat2.prototype.fromJSON = function( json ){
            
	    this.copy( json );
	};
        
        
        Mat2.prototype.clone = function(){
            var te = this.elements;
	    
            return new Mat2(
		te[0], te[2],
		te[1], te[3]
	    );
        };
        
        
        Mat2.prototype.copy = function( other ){
            var te = this.elements,
		me = other.elements;
	    
	    te[0] = me[0];
	    te[1] = me[1];
	    te[2] = me[2];
	    te[3] = me[3];
            
            return this;
        };
        
        
        Mat2.prototype.set = function( m11, m12, m21, m22 ){
            var te = this.elements;
	    
            te[0] = m11; te[2] = m12;
            te[1] = m21; te[3] = m22;
            
            return this;
        };
	
	
	Mat2.prototype.identity = function(){
            var te = this.elements;
	    
	    te[0] = 1;
	    te[1] = 0;
	    te[2] = 0;
	    te[3] = 1;
            
            return this;
        };
	
	
	Mat2.prototype.zero = function(){
            var te = this.elements;
	    
	    te[0] = 0;
	    te[1] = 0;
	    te[2] = 0;
	    te[3] = 0;
            
            return this;
        };
        
        
        Mat2.prototype.mmul = function( a, b ){
	    var te = this.elements,
		ae = a.elements,
		be = b.elements,
		
		a11 = ae[0], a12 = ae[2],
		a21 = ae[1], a22 = ae[3],
		
		b11 = be[0], b12 = be[2],
		b21 = be[1], b22 = be[3];
            
	    te[0] = a11 * b11 + a12 * b21;
	    te[2] = a11 * b12 + a12 * b22;
	    
	    te[1] = a21 * b11 + a22 * b21;
	    te[3] = a21 * b12 + a22 * b22;
            
            return this;
        };
        
        
        Mat2.prototype.mul = function( other ){
	    var ae = this.elements,
		be = other.elements,
		
		a11 = ae[0], a12 = ae[2],
		a21 = ae[1], a22 = ae[3],
		
		b11 = be[0], b12 = be[2],
		b21 = be[1], b22 = be[3];
            
	    ae[0] = a11 * b11 + a12 * b21;
	    ae[1] = a11 * b12 + a12 * b22;
	    
	    ae[2] = a21 * b11 + a22 * b21;
	    ae[3] = a21 * b12 + a22 * b22;
            
            return this;
        };
        
        
        Mat2.prototype.smul = function( s ){
            var te = this.elements;
	    
	    te[0] *= s;
	    te[1] *= s;
	    te[2] *= s;
	    te[3] *= s;
            
            return this;
        };
        
        
        Mat2.prototype.sdiv = function( s ){
	    var te = this.elements;
	    
	    s = s !== 0 ? 1 / s : 1;
	    
	    te[0] *= s;
	    te[1] *= s;
	    te[2] *= s;
	    te[3] *= s;
            
            return this;
        };
	
	
	Mat2.prototype.transpose = function(){
            var te = this.elements, tmp;
	    
	    tmp = te[1]; te[1] = te[2]; te[2] = tmp;
	    
	    return this;
        };
	
	
	Mat2.prototype.setTrace = function( v ){
            var te = this.elements;
	    
	    te[0] = v.x;
	    te[3] = v.y;
	    
	    return this;
        };
	
	
	Mat2.prototype.minv = function( other ){
	    var te = this.elements,
		me = other.elements,
		
		m11 = me[0], m12 = me[2],
		m21 = me[1], m22 = me[3],
		
		det = m11 * m22 - m12 * m21;
            
	    det = det !== 0 ? 1 / det : 0;
            
	    te[0] = m22 * det;
	    te[1] = -m12 * det;
	    te[2] = -m21 * det;
	    te[3] = m11 * det;
	    
            return this;
	};
	
	
	Mat2.prototype.inv = function(){
	    var te = this.elements,
		
		m11 = te[0], m12 = te[2],
		m21 = te[1], m22 = te[3],
		
		det = m11 * m22 - m12 * m21;
            
	    det = det !== 0 ? 1 / det : 0;
	    
	    te[0] = m22 * det;
	    te[1] = -m12 * det;
	    te[2] = -m21 * det;
	    te[3] = m11 * det;
	    
            return this;
	};
        
        
        Mat2.prototype.mlerp = function( a, b, t ){
	    var te = this.elements,
		ae = a.elements,
		be = b.elements;
	    
	    te[0] = lerp( ae[0], be[0], t );
	    te[1] = lerp( ae[1], be[1], t );
	    te[2] = lerp( ae[2], be[2], t );
	    te[3] = lerp( ae[3], be[3], t );
            
            return this;
        };
        
        
        Mat2.prototype.lerp = function( other, t ){
	    var ae = this.elements,
		be = other.elements;
            
	    ae[0] = lerp( ae[0], be[0], t );
	    ae[1] = lerp( ae[1], be[1], t );
	    ae[2] = lerp( ae[2], be[2], t );
	    ae[3] = lerp( ae[3], be[3], t );
	    
            return this;
        };
        
        
        Mat2.prototype.abs = function(){
	    var te = this.elements;
            
	    te[0] = abs( te[0] );
	    te[1] = abs( te[1] );
	    te[2] = abs( te[2] );
	    te[3] = abs( te[3] );
	    
            return this;
        };
        
        
        Mat2.prototype.setRotation = function( a ){
            var te = this.elements,
		c = cos( a ), s = sin( a );
		
	    te[0] = c;
	    te[1] = s;
	    te[2] = -s;
	    te[3] = c;
	    
            return this;
        };
	
	
	Mat2.prototype.getRotation = function(){
	    var te = this.elements;
	    
	    return atan2( te[1], te[0] );
        };
	
	
	Mat2.prototype.rotate = function( angle ){
	    var te = this.elements,
		
		m11 = te[0], m12 = te[2],
		m21 = te[1], m22 = te[3],
		
		s = sin( angle ), c = sin( angle );
	    
	    te[0] = m11 * c + m12 * s;
	    te[1] = m11 * -s + m12 * c;
	    te[2] = m21 * c + m22 * s;
	    te[3] = m21 * -s + m22 * c;
	    
	    return this;
        };
	
        
        Mat2.prototype.toString = function(){
            var te = this.elements;
	    
            return (
		"Mat2[ "+ te[0] +", "+ te[2] +"]\n"+
		"     [ "+ te[1] +", "+ te[3] +"]"
	    );
        };
	
        
        Mat2.prototype.equals = function( other ){
            var ae = this.elements,
		be = other.elements;
	    
            return !(
                !equals( ae[0], be[0] ) ||
                !equals( ae[1], be[1] ) ||
                !equals( ae[2], be[2] ) ||
                !equals( ae[3], be[3] )
            );
        };
        
        
        Mat2.equals = function( a, b ){
	    var ae = a.elements,
		be = b.elements;
	    
            return !(
                !equals( ae[0], be[0] ) ||
                !equals( ae[1], be[1] ) ||
                !equals( ae[2], be[2] ) ||
                !equals( ae[3], be[3] )
            );
        };
	
	
	return Mat2;
    }
);