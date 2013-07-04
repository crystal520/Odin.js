var requirejs = require("requirejs");

requirejs.config({
    baseUrl: __dirname +"/"
});

if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define(
    function(){
	"use strict";
	
	
	var Odin = {};
	
	Odin.globalize = function(){
	    
	    for( var key in this ){
		global[ key ] = this[ key ];
	    }
	    global.Odin = this;
	};
	
	Odin.test = function(){
	    var now = Date.now,
		start, i;
	    
	    return function( name, times, fn ){
		start = now();
		
		for( i = 0; i < times; i++ ){
		    fn();
		}
		
		console.log( name +": "+ ( now() - start ) +"ms");
	    };
	}();
	
	Odin.Class = requirejs("base/class");
	Odin.Time = requirejs("base/time");
	Odin.Utils = requirejs("base/utils");
	
	Odin.AABB2 = requirejs("math/aabb2");
	Odin.AABB3 = requirejs("math/aabb3");
	Odin.Color = requirejs("math/color");
	Odin.Line2 = requirejs("math/line2");
	Odin.Mat2 = requirejs("math/mat2");
	Odin.Mat3 = requirejs("math/mat3");
	Odin.Mat32 = requirejs("math/mat32");
	Odin.Mat4 = requirejs("math/mat4");
	Odin.Mathf = requirejs("math/mathf");
	Odin.Quat = requirejs("math/quat");
	Odin.Vec2 = requirejs("math/vec2");
	Odin.Vec3 = requirejs("math/vec3");
	Odin.Vec4 = requirejs("math/vec4");
	
	Odin.PBody2D = requirejs("physics2d/body/pbody2d");
	Odin.PParticle2D = requirejs("physics2d/body/pparticle2d");
	Odin.PRigidBody2D = requirejs("physics2d/body/prigidbody2d");
	
	Odin.PBroadphase2D = requirejs("physics2d/collision/pbroadphase2d");
	Odin.PNearphase2D = requirejs("physics2d/collision/pnearphase2d");
	
	Odin.PConstraint2D = requirejs("physics2d/constraints/pconstraint2d");
	Odin.PContact2D = requirejs("physics2d/constraints/pcontact2d");
	Odin.PDistanceConstraint2D = requirejs("physics2d/constraints/pdistanceconstraint2d");
	Odin.PEquation2D = requirejs("physics2d/constraints/pequation2d");
	Odin.PFriction2D = requirejs("physics2d/constraints/pfriction2d");
	
	Odin.PBox2D = requirejs("physics2d/shape/pbox2d");
	Odin.PCircle2D = requirejs("physics2d/shape/pcircle2d");
	Odin.PConvex2D = requirejs("physics2d/shape/pconvex2d");
	Odin.PShape2D = requirejs("physics2d/shape/pshape2d");
	
	Odin.PSolver2D = requirejs("physics2d/psolver2d");
	Odin.PWorld2D = requirejs("physics2d/pworld2d");
	
	Odin.Box2D = requirejs("core/components/box2d");
	Odin.Circle2D = requirejs("core/components/circle2d");
	Odin.Component = requirejs("core/components/component");
	Odin.Poly2D = requirejs("core/components/poly2d");
	Odin.Renderable2D = requirejs("core/components/renderable2d");
	Odin.RigidBody2D = requirejs("core/components/rigidbody2d");
	Odin.Sprite2D = requirejs("core/components/sprite2d");
	
	Odin.Client = requirejs("core/game/client");
	Odin.ServerGame = requirejs("core/game/servergame");
	
	Odin.Camera2D = requirejs("core/objects/camera2d");
	Odin.GameObject2D = requirejs("core/objects/gameobject2d");
	Odin.Transform2D = requirejs("core/objects/transform2d");
	
	Odin.Scene2D = requirejs("core/scene/scene2d");
	Odin.World2D = requirejs("core/scene/world2d");
	
	return Odin;
    }
);