if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"math/mathf",
	"math/vec2"
    ],
    function( Mathf, Vec2 ){
        "use strict";
	
	var cos = Math.cos,
	    sin = Math.sin,
	    abs = Math.abs,
	    atan2 = Math.atan2,
	    equals = Mathf.equals;
        
        
        function Mat3( m11, m12, m13, m21, m22, m23, m31, m32, m33 ){
	    
            this.elements = new Float32Array(9);
            
            this.set(
                m11 !== undefined ? m11 : 1, m12 || 0, m13 || 0,
                m21 || 0, m22 !== undefined ? m22 : 1, m23 || 0,
                m31 || 0, m32 || 0, m33 !== undefined ? m33 : 1
            );
	}
	
	
	Mat3.prototype.clone = function(){
	    var te = this.elements;
            
            return new Mat3(
                te[0], te[3], te[6],
                te[1], te[4], te[7],
                te[2], te[5], te[8]
            );
        };
	
	
	Mat3.prototype.copy = function( m ){
            var me = m.elements;
	    
	    return this.set(
		me[0], me[3], me[6],
		me[1], me[4], me[7],
		me[2], me[5], me[8]
	    );
        };
	
	
	Mat3.prototype.toMat4 = function(){
            var te = this.elements,
		me = Mat3._mat4;
	    
	    me[0] = te[0]; me[4] = te[3]; me[12] = te[6];
	    me[1] = te[1]; me[5] = te[4]; me[13] = te[7];
	    
            return me;
        };
	
        
        Mat3.prototype.set = function( m11, m12, m13, m21, m22, m23, m31, m32, m33 ){
            var te = this.elements;
            
            te[0] = m11; te[3] = m12; te[6] = m13;
            te[1] = m21; te[4] = m22; te[7] = m23;
            te[2] = m31; te[5] = m32; te[8] = m33;
            
            return this;
        };
	
	
	Mat3.prototype.identity = function(){
            
            this.set(
                1, 0, 0,
                0, 1, 0,
		0, 0, 1
            );
            
            return this;
        };
	
	
	Mat3.prototype.determinant = function(){
	    var te = this.elements,
		a = te[0], b = te[1], c = te[2],
		d = te[3], e = te[4], f = te[5],
		g = te[6], h = te[7], i = te[8];
		
	    return a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g;
        };
	
	
	Mat3.prototype.transpose = function(){
            var te = this.elements, tmp;
	    
	    tmp = te[1]; te[1] = te[3]; te[3] = tmp;
	    tmp = te[2]; te[2] = te[6]; te[6] = tmp;
	    tmp = te[5]; te[5] = te[7]; te[7] = tmp;
	    
	    return this;
        };
	
	
	Mat3.prototype.getInverse = function( m ){
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
	    
	    det = m11 * te[0] + m21 * te[3] + m31 * te[6];
	    
	    if( det === 0 ){
		this.identity();
	    }
	    else{
		this.smul( 1 / det );
	    }
	    
	    return this;
        };
	
	
	Mat3.prototype.getInverseMat4 = function( m ){
            var te = this.elements,
		me = m.elements, det,
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
	    
	    det = m11 * te[0] + m21 * te[3] + m31 * te[6];
	    
	    if( det === 0 ){
		this.identity();
	    }
	    else{
		this.smul( 1 / det );
	    }
	    
	    return this;
        };
	
	
	Mat3.prototype.inverse = function(){
	    
            return this.getInverse( this );
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
	
	
	Mat3.prototype.mul = function( m ){
            
            return this.mmul( this, m );
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
	
	
	Mat3.prototype.setRotationAngle = function( angle ){
            var te = this.elements,
                c = cos( angle ),
                s = sin( angle );
            
            te[0] = c;
            te[1] = -s;
            te[3] = s;
            te[4] = c;
            
            return this;
	};
	
	
	Mat3.prototype.setPositionVec2 = Mat3.prototype.setPositionVec3 = function( v ){
	    var te = this.elements;
	    
            te[6] = v.x;
            te[7] = v.y;
            
            return this;
	};
	
	
	Mat3.prototype.getRotation = function(){
	    var te = this.elements;
	    
	    return atan2( te[1], te[0] );
	};
        
	
        Mat3.prototype.lookAt = function(){
	    var vec = new Vec2(),
		scale = new Vec2();
	    
	    return function( eye, target ){
		vec.vsub( target, eye );
		scale.getScaleMat3( this );
		
		var te = this.elements,
		    angle = atan2( vec.y, vec.x ),
		    c = cos( angle ),
		    s = sin( angle );
		
		te[0] = c * scale.x;
		te[1] = -s * scale.x;
		te[3] = s * scale.y;
		te[4] = c * scale.y;
		
		return this;
	    };
	}();
	
	
	Mat3.prototype.extractPosition = function( m ){
	    var te = this.elements,
		me = m.elements;
		
	    te[6] = me[6];
	    te[7] = me[7];
	    
	    return this;
	};
	
	
	Mat3.prototype.extractRotation = function(){
	    var vec = new Vec2();
	    
	    return function( m ){
		var te = this.elements,
		    me = m.elements,
		    scaleX = 1 / vec.set( me[0], me[1] ).len(),
		    scaleY = 1 / vec.set( me[3], me[4] ).len();
		    
		te[0] = me[0] * scaleX;
		te[1] = me[1] * scaleX;
		
		te[3] = me[3] * scaleY;
		te[4] = me[4] * scaleY;
		
		return this;
	    };
	}();
	
	
	Mat3.prototype.translate = function( v ){
	    var te = this.elements,
		x = v.x, y = v.y;
	    
	    te[6] = te[0] * x + te[3] * y + te[6];
	    te[7] = te[1] * x + te[4] * y + te[7];
	    te[8] = te[2] * x + te[5] * y + te[8];
	    
	    return this;
	};
	
	
	Mat3.prototype.rotate = function( angle ){
	    var te = this.elements,
		
		m11 = te[0], m12 = te[3], m13 = te[6],
		m21 = te[1], m22 = te[4], m23 = te[7],
		
		c = cos( angle ),
		s = sin( angle );
	    
	    te[0] = m11 * c - m21 * s;
	    te[3] = m12 * c - m22 * s;
	    te[6] = m13 * c - m23 * s;
	    
	    te[1] = m11 * s + m21 * c;
	    te[4] = m12 * s + m22 * c;
	    te[7] = m13 * s + m23 * c;
	    
	    return this;
	};
	
	
	Mat3.prototype.scale = function( v ){
	    var te = this.elements,
		x = v.x, y = v.x;
	    
	    te[0] *= x; te[3] *= y;
	    te[1] *= x; te[4] *= y;
	    te[2] *= x; te[5] *= y;
	    
	    return this;
        };
	
	
	Mat3.prototype.makeTranslation = function( x, y ){
	    
	    this.set(
		1, 0, x,
		0, 1, y,
		0, 0, 1
	    );
	    
	    return this;
	};
	
	
	Mat3.prototype.makeRotation = function( angle ){
	    var c = cos( angle ),
		s = sin( angle );
	    
	    this.set(
		c, s, 0,
		-s, c, 0,
		0, 0, 1
	    );
	    
	    return this;
	};
	
	
	Mat3.prototype.makeScale = function( x, y ){
	    
	    this.set(
		x, 0, 0,
		0, y, 0,
		0, 0, 1
	    );
	    
	    return this;
	};
	
	
	Mat3.prototype.makeOrthographic = function( left, right, top, bottom ){
	    var w = 1 / ( right - left ),
		h = 1 / ( top - bottom ),
		x = ( right + left ) * w,
		y = ( top + bottom ) * h;
	    
	    this.set(
		2 * w, 0, -x,
		0, 2 * h, -y,
		0, 0, 1
	    );
            
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
            
            return Mat3.equals( this, other );
        };
	
        
	Mat3.equals = function( a, b ){
	    var ae = a.elements,
		be = b.elements;
	    
            return (
		equals( ae[0], be[0] ) &&
		equals( ae[1], be[1] ) &&
		equals( ae[2], be[2] ) &&
		equals( ae[3], be[3] ) &&
		equals( ae[4], be[4] ) &&
		equals( ae[5], be[5] ) &&
		equals( ae[6], be[6] ) &&
		equals( ae[7], be[7] ) &&
		equals( ae[8], be[8] )
	    );
        };
	
	
	Mat3._mat4 = new Float32Array([
	    1, 0, 0, 0,
	    0, 1, 0, 0,
	    0, 0, 1, 0,
	    0, 0, 0, 1
	]);
	
        
        return Mat3;
    }
);