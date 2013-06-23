if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/vec2",
	"physics2d/body/pbody2d",
    ],
    function( Class, Vec2, PBody2D ){
        "use strict";
	
	var DYNAMIC = PBody2D.DYNAMIC,
	    STATIC = PBody2D.STATIC,
	    KINEMATIC = PBody2D.KINEMATIC,
	    AWAKE, SLEEPY, SLEEPING;
	
        
	function PParticle2D( opts ){
	    opts || ( opts = {} );
	    
	    PBody2D.call( this, opts );
	    
	    this.position = opts.position instanceof Vec2 ? opts.position : new Vec2;
	    
	    this.velocity = opts.velocity instanceof Vec2 ? opts.velocity : new Vec2;
	    
	    this.linearDamping = opts.linearDamping instanceof Vec2 ? opts.linearDamping : new Vec2( 0.01, 0.01 );
	    
	    this.mass = opts.mass !== undefined ? opts.mass : 1;
	    this.invMass = this.mass > 0 ? 1 / this.mass : 0;
	    
	    this.type = opts.type !== undefined ? opts.type : this.mass > 0 ? DYNAMIC : STATIC;
	    
	    this.elasticity = opts.elasticity !== undefined ? opts.elasticity : 0.5;
	    this.friction = opts.friction !== undefined ? opts.friction : 0.25;
	    
	    this.force = new Vec2;
	    
	    this.vlambda = new Vec2;
	    
	    this.allowSleep = opts.allowSleep !== undefined ? opts.allowSleep : true;
	    
	    this.sleepState = AWAKE;
	    
	    this._sleepVelocity = 0.01;
	    this._sleepTimeLimit = 1;
	    this._sleepLastSleepy = 0;
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
	
	
	PParticle2D.prototype.wake = function(){
	    
	    if( this.sleepState === SLEEPING ){
		this.trigger("wake");
	    }
	    this.sleepState = AWAKE;
	};
	
	
	PParticle2D.prototype.sleep = function(){
	    
	    if( this.sleepState === AWAKE || this.sleepState === SLEEPY ){
		this.trigger("sleep");
	    }
	    this.sleepState = SLEEPING;
	};
	
	
	PParticle2D.prototype.sleepTick = function( time ){
	    
	    if( this.allowSleep ){
		var sleepState = this.sleepState,
		    velSq = this.velocity.lenSq(),
		    
		    sleepVel = this._sleepVelocity,
		    sleepVelSq = sleepVel * sleepVel;
		
		if( sleepState === AWAKE && velSq < sleepVelSq ){
		    this._sleepLastSleepy = time;
		    this.sleepState = SLEEPY;
		    this.trigger("sleepy");
		}
		else if( sleepState === SLEEPY && velSq > sleepVelSq ){
		    this.wake();
		}
		else if( sleepState === SLEEPY && ( time - this._sleepLastSleepy ) > this._sleepTimeLimit ){
		    this.sleep();
		}
	    }
	};
	
	
	PParticle2D.AWAKE = AWAKE = 1;
	PParticle2D.SLEEPY = SLEEPY = 2;
	PParticle2D.SLEEPING = SLEEPING = 3;
	
        
        return PParticle2D;
    }
);