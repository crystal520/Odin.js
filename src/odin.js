if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define(
    function( require ){
	"use strict";
	
	
	var Odin = {};
	
	Odin.globalize = function(){
	    
	    for( var key in this ){
		window[ key ] = this[ key ];
	    }
	    window.Odin = this;
	};
	
	Odin.Class = require("base/class");
	Odin.Device = require("base/device");
	Odin.Dom = require("base/dom");
	Odin.Time = require("base/time");
	Odin.Utils = require("base/utils");
	
	Odin.Bounds = require("math/bounds");
	Odin.Color = require("math/color");
	Odin.Mat3 = require("math/mat3");
	Odin.Mathf = require("math/mathf");
	Odin.Vec2 = require("math/vec2");
	
	Odin.Component = require("core/components/component");
	Odin.Sprite = require("core/components/sprite");
	
	Odin.Game = require("core/game/game");
	Odin.ClientGame = require("core/game/clientgame");
	
	Odin.Accelerometer = require("core/input/accelerometer");
	Odin.Input = require("core/input/input");
	Odin.Key = require("core/input/key");
	Odin.Keyboard = require("core/input/keyboard");
	Odin.Mouse = require("core/input/mouse");
	Odin.Orientation = require("core/input/orientation");
	Odin.Touch = require("core/input/touch");
	Odin.Touches = require("core/input/touches");
	
	Odin.Camera = require("core/objects/camera");
	Odin.GameObject = require("core/objects/gameobject");
	Odin.Transform2D = require("core/objects/transform2d");
	
	Odin.PRigidBody = require("core/physics/prigidbody");
	Odin.PRect = require("core/physics/prect");
	Odin.PShape = require("core/physics/pshape");
	Odin.PSphere = require("core/physics/psphere");
	
	Odin.Canvas = require("core/canvas");
	Odin.CanvasRenderer = require("core/canvasrenderer");
	Odin.Scene = require("core/scene");
	Odin.WebGLRenderer = require("core/webglrenderer");
	Odin.World = require("core/world");
	
	
	return Odin;
    }
);