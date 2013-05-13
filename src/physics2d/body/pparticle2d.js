if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"base/time",
	"math/vec2",
	"physics2d/body/pbody2d"
    ],
    function( Class, Time, Vec2, PBody2D ){
	"use strict";
	
	var AWAKE, SLEEPY, SLEEPING;
	
	
	function PParticle2D( opts ){
	    opts || ( opts = {} );
	    
	    PBody2D.call( this, opts );
	    
	    this.position = opts.position instanceof Vec2 ? opts.position : new Vec2;
	    this.velocity = opts.velocity instanceof Vec2 ? opts.velocity : new Vec2;
	    
	    this.linearDamping = opts.linearDamping instanceof Vec2 ? opts.linearDamping : new Vec2;
	    
	    this.mass = opts.mass !== undefined ? opts.mass : 1;
	    this.invMass = this.mass <= 0 ? 0 : 1 / this.mass;
	    
	    this.type = this.mass < 0 ? PBody2D.STATIC : PBody2D.DYNAMIC;
	    
	    this.force = new Vec2;
	    
	    this.allowSleep = true;
	    this.sleepState = AWAKE;
	    this.sleepSpeedLimit = 0.1;
	    this.sleepTimeLimit = 1;
	    this.timeLastSleepy = 0;
	}
	
	Class.extend( PParticle2D, PBody2D );
	
	
	PParticle2D.prototype.isAwake = function(){
	    
	    return this.sleepState === AWAKE;
	};
	
	
	PParticle2D.prototype.isSleepy = function(){
	    
	    return this.sleepState === SLEEPY;
	};
	
	
	PParticle2D.prototype.isSleeping = function(){
	    
	    return this.sleepState === SLEEPING;
	};
	
	
	PParticle2D.prototype.wakeUp = function(){
	    
	    if( this.sleepState === SLEEPING ){
		this.trigger("wakeup");
	    }
	    this.sleepState = AWAKE;
	};
	
	
	PParticle2D.prototype.sleep = function(){
	    
	    this.sleepState = SLEEPING;
	};
	
	
	PParticle2D.prototype.sleepTick = function(){
	    
	    if( this.allowSleep ){
		var sleepState = this.sleepState,
		    speedSq = this.velocity.lenSq(),
		    sleepSpeedLimit = this.sleepSpeedLimit,
		    speedLimitSq = sleepSpeedLimit * sleepSpeedLimit;
		    
		if( sleepState === AWAKE && speedSq < speedLimitSq ){
		    
		    this.sleepState = SLEEPY;
		    this.timeLastSleepy = Time.time;
		    this.trigger("sleepy");
		}
		else if( sleepState === SLEEPY && speedSq > speedLimitSq ){
		    
		    this.wakeUp();
		}
		else if( sleepState === 1 && ( Time.time - this.timeLastSleepy ) > this.timeLastSleepy ){
		    
		    this.sleepState = SLEEPING;
		    this.trigger("sleep");
		}
	    }
	};
	
	
	PParticle2D.AWAKE = AWAKE = 0;
	PParticle2D.SLEEPY = SLEEPY = 1;
	PParticle2D.SLEEPING = SLEEPING = 2;
	
	
	return PParticle2D;
    }
);