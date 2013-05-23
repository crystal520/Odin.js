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
	    
	    this.contacts = [];
	    
	    this.pairsi = [];
	    this.pairsj = [];
	    
	    this.gravity = opts.gravity instanceof Vec2 ? opts.gravity : new Vec2( 0, -9.801 );
	    
	    this.broadphase = new PBroadphase2D( opts.aabbBroadphase );
	    this.contactGenerator = new PContactGenerator2D();
	    this.solver = new PSolver2D();
	    
	    this.removeList = [];
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
		removeList = this.removeList,
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
		max = 0.25,
		lastTime = 0,
		ddt = 1 / 60,
		time = 0;
	    
	    return function( dt ){
		var bodies = this.bodies,
		    solver = this.solver,
		    contacts = this.contactGenerator.contacts,
		    pairsi = this.pairsi, pairsj = this.pairsj,
		    contacts = this.contacts,
		    c, i, il, j, jl;
		
		this.time = time += dt;
		
		accumulator += time - lastTime;
		accumulator = accumulator > max ? max : accumulator;
		dt = dt !== 0 ? dt : ddt;
		
		if( this.removeList.length ){
		    this._remove();
		}
		
		while( accumulator >= dt ){
		    
		    this.broadphase.collisionPairs( this, pairsi, pairsj );
		    this.contactGenerator.getContacts( this, pairsi, pairsj, contacts );
		    
		    for( i = 0, il = contacts.length; i < il; i++ ){
			c = contacts[i];
			solver.add( c );
		    }
		    
		    solver.solve( dt, this );
		    solver.clear();
		    
		    for( i = 0, il = bodies.length; i < il; i++ ){
			bodies[i].update( dt );
		    }
		    
		    accumulator -= dt;
		}
		
		lastTime = time;
	    };
	}();
	
	
	return PWorld2D;
    }
);