if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/vec2"
    ],
    function( Class, Vec2 ){
	"use strict";
	
	var pow = Math.pow,
	    AWAKE, SLEEPY, SLEEPING;
	
	
	function PBody2D( opts ){
	    opts || ( opts = {} );
	    
	    Class.call( this );
	    
	    this.type = PBody2D.DYNAMIC;
	    
	    this.userData = undefined;
	    this.world = undefined;
	    
	    this.elasticity = opts.elasticity !== undefined ? opts.elasticity : 0.5;
	    this.friction = opts.friction !== undefined ? opts.friction : 0.25;
	    
	    this.filterGroup = opts.filterGroup !== undefined ? opts.filterGroup : 0;
	    
	    this.position = opts.position instanceof Vec2 ? opts.position : new Vec2;
	    this.velocity = opts.velocity instanceof Vec2 ? opts.velocity : new Vec2;
	    
	    this.linearDamping = opts.linearDamping instanceof Vec2 ? opts.linearDamping : new Vec2( 0.01, 0.01 );
	    
	    this.mass = opts.mass !== undefined ? opts.mass : 1;
	    this.invMass = this.mass <= 0 ? 0 : 1 / this.mass;
	    
	    this.type = opts.type ? opts.type : this.mass <= 0 ? PBody2D.STATIC : PBody2D.DYNAMIC;
	    
	    this.force = new Vec2;
	    this.vlambda = new Vec2;
	    
	    this.allowSleep = opts.allowSleep !== undefined ? opts.allowSleep : true;
	    this.sleepState = AWAKE;
	    
	    this._sleepVelocityLimit = 0.1;
	    this._sleepyTimeLimit = 1;
	    this._timeLastSleepy = 0;
	}
	
	Class.extend( PBody2D, Class );
	
	
	PBody2D.prototype.isAwake = function(){
	    
	    return this.sleepState === AWAKE;
	};
	
	
	PBody2D.prototype.isSleepy = function(){
	    
	    return this.sleepState === SLEEPY;
	};
	
	
	PBody2D.prototype.isSleeping = function(){
	    
	    return this.sleepState === SLEEPING;
	};
	
	
	PBody2D.prototype.wake = function(){
	    
	    if( this.sleepState === SLEEPING ){
		this.trigger("wake");
	    }
	    this.sleepState = AWAKE;
	};
	
	
	PBody2D.prototype.sleepy = function(){
	    
	    if( this.sleepState !== SLEEPY ){
		this.trigger("sleepy");
	    }
	    this.sleepState = SLEEPY;
	};
	
	
	PBody2D.prototype.sleep = function(){
	    
	    if( this.sleepState !== SLEEPING ){
		this.trigger("sleep");
	    }
	    this.sleepState = SLEEPING;
	};
	
	
	PBody2D.prototype.sleepTick = function( time ){
	    
	    if( this.allowSleep ){
		var sleepState = this.sleepState,
		    velSq = this.velocity.lenSq(),
		    sleepVelLimitSq = this._sleepVelocityLimit * this._sleepVelocityLimit;
		
		if( sleepState === AWAKE && velSq < sleepVelLimitSq ){
		    
		    this.sleepy();
		    this._timeLastSleepy = time;
		}
		else if( sleepState === SLEEPY && velSq > sleepVelLimitSq ){
		    
		    this.wake();
		}
		else if( sleepState === SLEEPY && ( time - this._timeLastSleepy ) > this._timeLastSleepy ){
		    
		    this.sleep();
		}
	    }
	};
	
	
	PBody2D.DYNAMIC = 0;
	PBody2D.STATIC = 1;
	PBody2D.KINEMATIC = 2;
	
	PBody2D.AWAKE = AWAKE = 3;
	PBody2D.SLEEPY = SLEEPY = 4;
	PBody2D.SLEEPING = SLEEPING = 5;
	
	
	return PBody2D;
    }
);