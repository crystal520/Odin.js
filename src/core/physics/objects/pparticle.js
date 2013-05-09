if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"base/time",
	"math/vec2",
	"core/physics/objects/pbody"
    ],
    function( Class, Time, Vec2, PBody ){
	"use strict";
	
	
        function PParticle( opts ){
            opts || ( opts = {} );
            
            PBody.call( this );
	    
	    this.position = opts.position instanceof Vec2 ? opts.position : new Vec2;
	    
	    this.velocity = opts.velocity instanceof Vec2 ? opts.velocity : new Vec2;
	    
	    this.linearDamping = opts.linearDamping instanceof Vec2 ? opts.angularDamping : new Vec2;
	    
	    this.mass = opts.mass !== undefined ? opts.mass : 1;
	    this.invMass = this.mass !== 0 ? 1 / this.mass : 0;
	    
	    this.force = new Vec2;
	    
	    this.type = opts.type !== undefined ? opts.type : this.mass <= 0 ? PBody.static : PBody.dynamic;
	    
	    this.allowSleep = !!opts.allowSleep ? opts.allowSleep : true;
	    this.sleepSpeedLimit = opts.sleepSpeedLimit !== undefined ? opts.sleepSpeedLimit : 0.1;
	    this.sleepTimeLimit = opts.sleepTimeLimit !== undefined ? opts.sleepTimeLimit : 1;
	    
	    this.sleepState = 0;
	    this.timeLastSleepy = 0;
        }
        
	Class.extend( PParticle, Class );
	
	
	PParticle.prototype.isAwake = function(){
	    
	    return this.sleepState === PParticle.AWAKE;
	};
	
	
	PParticle.prototype.isSleepy = function(){
	    
	    return this.sleepState === PParticle.SLEEPY;
	};
	
	
	PParticle.prototype.isSleeping = function(){
	    
	    return this.sleepState === PParticle.SLEEPING;
	};
	
	
	PParticle.prototype.wakeUp = function(){
	    
	    if( this.sleepState === PParticle.SLEEPING ){
		this.trigger("wakeup");
	    }
	    this.sleepState = PParticle.AWAKE;
	    
	    return this;
	};
	
	
	PParticle.prototype.sleep = function(){
	    
	    this.sleepState = PParticle.SLEEPING;
	    
	    return this;
	};
	
	
	PParticle.prototype.sleepTick = function( time ){
	    
	    if( this.allowSleep ){
		var sleepState = this.sleepState,
		    speedSq = this.velocity.lenSq(),
		    speedLimitSq = this.sleepSpeedLimit * this.sleepSpeedLimit;
		
		if( sleepState === PParticle.AWAKE && speedSq < speedLimitSq ){
		    
		    this.sleepState = PParticle.SLEEPY;
		    this.timeLastSleepy = time;
		    this.trigger("sleepy");
		}
		else if( sleepState === PParticle.SLEEPY && speedSq > speedLimitSq ){
		    
		    this.wakeUp();
		}
		else if( sleepState === PParticle.SLEEPY && ( time - this.timeLastSleepy ) > this.sleepTimeLimit ){
		    
		    this.sleepState = PParticle.SLEEPING;
		    this.trigger("sleep");
		}
	    }
	};
	
	
	PParticle.AWAKE = 0;
	PParticle.SLEEPY = 1;
	PParticle.SLEEPING = 2;
	
        
        return PParticle;
    }
);