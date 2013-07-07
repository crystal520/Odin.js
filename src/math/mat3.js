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
	    lerp = Mathf.lerp,
	    equals= Mathf.equals;
	
	
	function Mat3( m11, m12, m13, m21, m22, m23, m31, m32, m33 ){
	    this.elements = new Float32Array(8);
	    var te = this.elements;
	    
            te[0] = m11 !== undefined ? m11 : 1; te[3] = m12 || 0; te[6] = m13 || 0;
            te[1] = m21 || 0; te[4] = m22 !== undefined ? m22 : 1; te[7] = m23 || 0;
            te[2] = m31 || 0; te[5] = m32 || 0; te[8] = m33 !== undefined ? m33 : 1;
	}
        
        
        Mat3.prototype.fromJSON = function( json ){
            
	    this.copy( json );
	};
        
        
        Mat3.prototype.clone = function(){
            var te = this.elements;
	    
            return new Mat3(
		te[0], te[3], te[6],
		te[1], te[4], te[7],
		te[2], te[5], te[8]
	    );
        };
        
        
        Mat3.prototype.copy = function( other ){
            var te = this.elements,
		me = other.elements;
	    
	    te[0] = me[0];
	    te[1] = me[1];
	    te[2] = me[2];
	    te[3] = me[3];
	    te[4] = me[4];
	    te[5] = me[5];
	    te[6] = me[6];
	    te[7] = me[7];
	    te[8] = me[8];
            
            return this;
        };
        
        
        Mat3.prototype.set = function( m11, m12, m13, m21, m22, m23, m31, m32, m33 ){
            var te = this.elements;
	    
            te[0] = m11; te[3] = m12; te[6] = m13;
            te[1] = m21; te[4] = m22; te[7] = m23;
            te[2] = m31; te[5] = m32; te[8] = m33;
            
            return this;
        };
	
	
	Mat3.prototype.identity = function(){
            var te = this.elements;
	    
	    te[0] = 1;
	    te[1] = 0;
	    te[2] = 0;
	    te[3] = 0;
	    te[4] = 1;
	    te[5] = 0;
	    te[6] = 0;
	    te[7] = 0;
	    te[8] = 1;
            
            return this;
        };
	
	
	Mat3.prototype.zero = function(){
            var te = this.elements;
	    
	    te[0] = 0;
	    te[1] = 0;
	    te[2] = 0;
	    te[3] = 0;
	    te[4] = 0;
	    te[5] = 0;
	    te[6] = 0;
	    te[7] = 0;
	    te[8] = 0;
            
            return this;
        };
        
        
        Mat3.prototype.mmul = function( a, b ){
	    var te = this.elements,
		ae = a.elements,
		be = b.elements,
                
		a11 = ae[0], a12 = ae[3], a13 = ae[6],
		a21 = ae[1], a22 = ae[4], a23 = ae[7],
		a31 = ae[2], a32 = ae[5], a33 = ae[8],
		
		b11 = be[0], b12 = be[3], b13 = be[6],
		b21 = be[1], b22 = be[4], b23 = be[7],
		b31 = be[2], b32 = be[5], b33 = be[8];
            
	    te[0] = a11 * b11 + a12 * b21 + a13 * b31;
            te[3] = a11 * b12 + a12 * b22 + a13 * b32;
            te[6] = a11 * b13 + a12 * b23 + a13 * b33;
            
            te[1] = a21 * b11 + a22 * b21 + a23 * b31;
            te[4] = a21 * b12 + a22 * b22 + a23 * b32;
            te[7] = a21 * b13 + a22 * b23 + a23 * b33;
            
            te[2] = a31 * b11 + a32 * b21 + a33 * b31;
            te[5] = a31 * b12 + a32 * b22 + a33 * b32;
            te[8] = a31 * b13 + a32 * b23 + a33 * b33;
            
            return this;
        };
        
        
        Mat3.prototype.mul = function( other ){
	    var ae = this.elements,
		be = other.elements,
                
		a11 = ae[0], a12 = ae[3], a13 = ae[6],
		a21 = ae[1], a22 = ae[4], a23 = ae[7],
		a31 = ae[2], a32 = ae[5], a33 = ae[8],
		
		b11 = be[0], b12 = be[3], b13 = be[6],
		b21 = be[1], b22 = be[4], b23 = be[7],
		b31 = be[2], b32 = be[5], b33 = be[8];
            
	    ae[0] = a11 * b11 + a12 * b21 + a13 * b31;
            ae[3] = a11 * b12 + a12 * b22 + a13 * b32;
            ae[6] = a11 * b13 + a12 * b23 + a13 * b33;
            
            ae[1] = a21 * b11 + a22 * b21 + a23 * b31;
            ae[4] = a21 * b12 + a22 * b22 + a23 * b32;
            ae[7] = a21 * b13 + a22 * b23 + a23 * b33;
            
            ae[2] = a31 * b11 + a32 * b21 + a33 * b31;
            ae[5] = a31 * b12 + a32 * b22 + a33 * b32;
            ae[8] = a31 * b13 + a32 * b23 + a33 * b33;
            
            return this;
        };
        
        
        Mat3.prototype.smul = function( s ){
            var te = this.elements;
	    
	    te[0] *= s;
            te[1] *= s;
	    te[2] *= s;
            te[3] *= s;
	    te[4] *= s;
            te[5] *= s;
	    te[6] *= s;
            te[7] *= s;
	    te[8] *= s;
            
            return this;
        };
        
        
        Mat3.prototype.sdiv = function( s ){
	    var te = this.elements;
	    
	    s = s !== 0 ? 1 / s : 1;
	    
	    te[0] *= s;
            te[1] *= s;
	    te[2] *= s;
            te[3] *= s;
	    te[4] *= s;
            te[5] *= s;
	    te[6] *= s;
            te[7] *= s;
	    te[8] *= s;
            
            return this;
        };
	
	
	Mat3.prototype.transpose = function(){
            var te = this.elements, tmp;
	    
	    tmp = te[1]; te[1] = te[3]; te[3] = tmp;
	    tmp = te[2]; te[2] = te[6]; te[6] = tmp;
	    tmp = te[5]; te[5] = te[7]; te[7] = tmp;
	    
	    return this;
        };
	
	
	Mat3.prototype.setTrace = function( v ){
            var te = this.elements;
	    
	    te[0] = v.x;
	    te[4] = v.y;
	    te[8] = v.z || 1;
	    
	    return this;
        };
	
	
	Mat3.prototype.minv = function( m ){
	    var te = this.elements,
		me = m.elements, det,
		m11 = me[0], m12 = me[3], m13 = me[6],
		m21 = me[1], m22 = me[4], m23 = me[7],
		m31 = me[2], m32 = me[5], m33 = me[8];
	    
	    te[0] = m22 * m33 - m23 * m32;
	    te[1] = m23 * m31 - m21 * m33;
	    te[2] = m21 * m32 - m22 * m31;
	    
	    te[3] = m13 * m32 - m12 * m33;
	    te[4] = m11 * m33 - m13 * m31;
	    te[5] = m12 * m31 - m11 * m32;
	    
	    te[6] = m12 * m23 - m13 * m22;
	    te[7] = m13 * m21 - m11 * m23;
	    te[8] = m11 * m22 - m12 * m21;
	    
	    this.sdiv( m11 * te[0] + m21 * te[3] + m31 * te[6] );
	    
            return this;
	};
	
	
	Mat3.prototype.invMat4 = function( m ){
	    var te = this.elements,
		me = m.elements,
		m11 = me[0], m12 = me[4], m13 = me[8], m14 = me[12],
		m21 = me[1], m22 = me[5], m23 = me[9], m24 = me[13],
		m31 = me[2], m32 = me[6], m33 = me[10], m34 = me[14],
		m41 = me[3], m42 = me[7], m43 = me[11], m44 = me[15];
	    
	    te[0] = m33 * m22 - m32 * m23;
	    te[1] = -m33 * m21 + m31 * m23;
	    te[2] = m32 * m21 - m31 * m22;
	    te[3] = -m33 * m12 + m32 * m13;
	    te[4] = m33 * m11 - m31 * m13;
	    te[5] = -m32 * m11 + m31 * m12;
	    te[6] = m23 * m12 - m22 * m13;
	    te[7] = -m23 * m11 + m21 * m13;
	    te[8] = m22 * m11 - m21 * m12;
	    
	    this.sdiv( m11 * te[0] + m21 * te[3] + m31 * te[6] );
	    
            return this;
	};
	
	
	Mat3.prototype.inv = function(){
	    var te = this.elements, det,
		m11 = te[0], m12 = te[3], m13 = te[6],
		m21 = te[1], m22 = te[4], m23 = te[7],
		m31 = te[2], m32 = te[5], m33 = te[8];
	    
	    te[0] = m22 * m33 - m23 * m32;
	    te[1] = m23 * m31 - m21 * m33;
	    te[2] = m21 * m32 - m22 * m31;
	    
	    te[3] = m13 * m32 - m12 * m33;
	    te[4] = m11 * m33 - m13 * m31;
	    te[5] = m12 * m31 - m11 * m32;
	    
	    te[6] = m12 * m23 - m13 * m22;
	    te[7] = m13 * m21 - m11 * m23;
	    te[8] = m11 * m22 - m12 * m21;
	    
	    this.sdiv( m11 * te[0] + m21 * te[3] + m31 * te[6] );
	    
            return this;
	};
        
        
        Mat3.prototype.mlerp = function( a, b, t ){
	    var te = this.elements,
		ae = a.elements,
		be = b.elements;
	    
	    te[0] = lerp( ae[0], be[0], t );
	    te[1] = lerp( ae[1], be[1], t );
	    te[2] = lerp( ae[2], be[2], t );
	    te[3] = lerp( ae[3], be[3], t );
	    te[4] = lerp( ae[4], be[4], t );
	    te[5] = lerp( ae[5], be[5], t );
	    te[6] = lerp( ae[6], be[6], t );
	    te[7] = lerp( ae[7], be[7], t );
	    te[8] = lerp( ae[8], be[8], t );
            
            return this;
        };
        
        
        Mat3.prototype.lerp = function( other, t ){
	    var ae = this.elements,
		be = other.elements;
	    
	    ae[0] = lerp( ae[0], be[0], t );
	    ae[1] = lerp( ae[1], be[1], t );
	    ae[2] = lerp( ae[2], be[2], t );
	    ae[3] = lerp( ae[3], be[3], t );
	    ae[4] = lerp( ae[4], be[4], t );
	    ae[5] = lerp( ae[5], be[5], t );
	    ae[6] = lerp( ae[6], be[6], t );
	    ae[7] = lerp( ae[7], be[7], t );
	    ae[8] = lerp( ae[8], be[8], t );
	    
            return this;
        };
        
        
        Mat3.prototype.abs = function(){
	    var te = this.elements;
            
	    te[0] = abs( te[0] );
            te[1] = abs( te[1] );
	    te[2] = abs( te[2] );
            te[3] = abs( te[3] );
	    te[4] = abs( te[4] );
            te[5] = abs( te[5] );
	    te[6] = abs( te[6] );
            te[7] = abs( te[7] );
	    te[8] = abs( te[8] );
	    
            return this;
        };
	
	
	Mat3.prototype.setRotationQuat = function( q ){
	    var te = this.elements,
		x = q.x, y = q.y, z = q.z, w = q.w,
		x2 = x + x, y2 = y + y, z2 = z + z,
		xx = x * x2, xy = x * y2, xz = x * z2,
		yy = y * y2, yz = y * z2, zz = z * z2,
		wx = w * x2, wy = w * y2, wz = w * z2;
		
	    te[0] = 1 - ( yy + zz );
	    te[3] = xy - wz;
	    te[6] = xz + wy;
	    
	    te[1] = xy + wz;
	    te[4] = 1 - ( xx + zz );
	    te[7] = yz - wx;
	    
	    te[2] = xz - wy;
	    te[5] = yz + wx;
	    te[8] = 1 - ( xx + yy );
	    
	    return this;
	};
	
	
	Mat3.prototype.rotateAxis = function( v ){
	    var te = this.elements,
		vx = v.x, vy = v.y, vz = v.z;
		
	    v.x = vx * te[0] + vy * te[3] + vz * te[6];
	    v.y = vx * te[1] + vy * te[4] + vz * te[7];
	    v.z = vx * te[2] + vy * te[5] + vz * te[8];
	    
	    v.norm();
	    
	    return v;
	};
	
	
	Mat3.prototype.scale = function( v ){
	    var te = this.elements,
		x = v.x, y = v.y, z = v.z;
	    
	    te[0] *= x; te[3] *= y; te[6] *= z;
	    te[1] *= x; te[4] *= y; te[7] *= z;
	    te[2] *= x; te[5] *= y; te[8] *= z;
	    
	    return this;
        };
	
        
        Mat3.prototype.toString = function(){
            var te = this.elements;
	    
            return (
		"Mat3["+ te[0] +", "+ te[3] +", "+ te[6] +"]\n" +
		"     ["+ te[1] +", "+ te[4] +", "+ te[7] +"]\n" +
		"     ["+ te[2] +", "+ te[5] +", "+ te[8] +"]"
	    );
        };
	
        
        Mat3.prototype.equals = function( other ){
            var ae = this.elements,
		be = other.elements;
	    
            return !(
                !equals( ae[0], be[0] ) ||
                !equals( ae[1], be[1] ) ||
                !equals( ae[2], be[2] ) ||
                !equals( ae[3], be[3] ) ||
                !equals( ae[4], be[4] ) ||
                !equals( ae[5], be[5] ) ||
                !equals( ae[6], be[6] ) ||
                !equals( ae[7], be[7] ) ||
                !equals( ae[8], be[8] )
            );
        };
        
        
        Mat3.equals = function( a, b ){
	    var ae = a.elements,
		be = b.elements;
	    
            return !(
                !equals( ae[0], be[0] ) ||
                !equals( ae[1], be[1] ) ||
                !equals( ae[2], be[2] ) ||
                !equals( ae[3], be[3] ) ||
                !equals( ae[4], be[4] ) ||
                !equals( ae[5], be[5] ) ||
                !equals( ae[6], be[6] ) ||
                !equals( ae[7], be[7] ) ||
                !equals( ae[8], be[8] )
            );
        };
	
	
	return Mat3;
    }
);