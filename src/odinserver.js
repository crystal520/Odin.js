var requirejs = require("requirejs");

requirejs.config({
    baseUrl: __dirname,
    nodeRequire: require
});

if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define(
    function(){
	"use strict";
	
	
	var Odin = {};
	
	Odin.Class = requirejs("base/class");
	Odin.Time = requirejs("base/time");
	Odin.Utils = requirejs("base/utils");
	
	Odin.Affine = require("math/affine");
	Odin.Bounds = requirejs("math/bounds");
	Odin.Color = requirejs("math/color");
	Odin.Mathf = requirejs("math/mathf");
	Odin.Vec2 = requirejs("math/vec2");
	
	Odin.Component = requirejs("core/components/component");
	Odin.Sprite = requirejs("core/components/sprite");
	
	Odin.ServerGame = requirejs("core/game/servergame");
	
	Odin.Camera = requirejs("core/objects/camera");
	Odin.GameObject = requirejs("core/objects/gameobject");
	Odin.Transform2D = requirejs("core/objects/transform2d");
	
	Odin.Scene = requirejs("core/scene");
	Odin.World = requirejs("core/world");
	
	return Odin;
    }
);