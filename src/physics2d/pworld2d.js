if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/mathf",
	"math/vec2",
	"physics2d/pcontactgenerator2d",
	"physics2d/body/pbody2d",
	"physics2d/collision/pbroadphase2d"
    ],
    function( Class, Mathf, Vec2, PContactGenerator2D, PBody2D, PBroadphase2D ){
	"use strict";
	
	var pow = Math.pow,
	    clamp = Mathf.clamp,
	    DYNAMIC = PBody2D.DYNAMIC,
	    STATIC = PBody2D.STATIC,
	    KINEMATIC = PBody2D.KINEMATIC;
	
	
	function PWorld2D( opts ){
	    opts || ( opts = {} );
	    
	    Class.call( this );
	    
	    this.time = 0;
	    this.allowSleep = true;
	    
	    this.bodies = [];
	    
	    this.pairsA = [];
	    this.pairsB = [];
	    
	    this.gravity = opts.gravity instanceof Vec2 ? opts.gravity : new Vec2( 0, -9.801 );
	    
	    this.broadphase = new PBroadphase2D( this, opts.aabbBroadphase );
	    this.contactGenerator = new PContactGenerator2D( this );
	    
	    this._removeList = [];
	}
	
	Class.extend( PWorld2D, Class );
	
	
	PWorld2D.prototype.add = function( body ){
	    var bodies = this.bodies,
		index = bodies.indexOf( body );
	    
	    if( index === -1 ){
		body.world = this;
		bodies.push( body );
		body.trigger("add");
	    }
	};
	
	
	PWorld2D.prototype.remove = function( body ){
	    
	    this._removeList.push( body );
	};
	
	
	PWorld2D.prototype._remove = function(){
	    var bodies = this.bodies,
		removeList = this._removeList,
		body, index, i, il;
	    
	    for( i = 0, il = removeList.length; i < il; i++ ){
		body = removeList[i];
		index = bodies.indexOf( body );
		
		if( index !== -1 ){
		    bodies.splice( index, 1 );
		    body.trigger("remove");
		}
	    }
	};
	
	
	PWorld2D.prototype.step = function(){
	    var accumulator = 0,
		max = 1 / 24,
		lastTime = 0,
		time = 1 / 60;
	    
	    return function( dt ){
		var bodies = this.bodies,
		    contacts = this.contactGenerator.contacts,
		    body, i, il;
		
		this.time = time += dt;
		
		accumulator += time - lastTime;
		accumulator = accumulator < max ? accumulator : max;
		
		lastTime = time;
		
		if( this._removeList.length ){
		    this._remove();
		}
		
		while( accumulator > dt ){
		    
		    this.broadphase.collisionPairs();
		    this.contactGenerator.getContacts();
		    
		    for( i = 0, il = contacts.length; i < il; i++ ){
			contacts[i].solve( dt );
		    }
		    
		    for( i = 0, il = bodies.length; i < il; i++ ){
			bodies[i].update( dt );
		    }
		    
		    accumulator -= dt;
		}
	    };
	}();
	
	
	return PWorld2D;
    }
);