var player = new Image;
player.src = "../content/images/player.png";

require(
    {
	baseUrl: "../../src/"
    },
    [
	"odin"
    ],
    function( Odin ){
	
	Odin.globalize();
	
	game = new Game({
	    debug: true,
	    forceCanvas: true
	});
	
	game.on("init", function(){
	    vec2_1 = new Vec2;
	    
	    scene = new Scene2D({
		gravity: new Vec2( 0, 0 ),
		allowSleep: false
	    });
	    camera = new Camera2D;
	    
	    sprite = new GameObject2D({
		position: new Vec2( 0, 2 ),
		components: [
		    new Sprite2D({
			image: player,
			x: 0,
			y: 0,
			w: 64,
			h: 64,
			width: 1,
			height: 1,
			animations: {
			    idle: [
				[ 0, 0, 64, 64, 0.25 ],
				[ 64, 0, 64, 64, 0.5 ],
				[ 128, 0, 64, 64, 1 ],
				[ 192, 0, 64, 64, 0.1 ]
			    ]
			}
		    }),
		    new RigidBody2D({
			mass: 1,
			extents: new Vec2( 0.5, 0.5 )
		    })
		]
	    });
	    
	    sprite2 = new GameObject2D({
		position: new Vec2( 0, -0.5 ),
		components: [
		    new Sprite2D({
			image: player,
			x: 0,
			y: 0,
			w: 64,
			h: 64,
			width: 1,
			height: 1
		    }),
		    new RigidBody2D({
			mass: 0,
			extents: new Vec2( 0.5, 0.5 )
		    })
		]
	    });
	    
	    ball = new GameObject2D({
		position: new Vec2( 0, -4 ),
		components: [
		    new Sprite2D({
			image: player,
			x: 0,
			y: 0,
			w: 64,
			h: 64,
			width: 1,
			height: 1
		    }),
		    new RigidBody2D({
			mass: 0,
			radius: 0.5
		    })
		]
	    });
	    
	    scene.add( sprite, sprite2, ball );
	    
	    Keyboard.on("keydown", function( key ){
		if( key.name === "up" ){
		    sprite.components.RigidBody2D.body.velocity.y += 0.1;
		}
		if( key.name === "down" ){
		    sprite.components.RigidBody2D.body.velocity.y -= 0.1;
		}
		if( key.name === "right" ){
		    sprite.components.RigidBody2D.body.velocity.x += 0.1;
		}
		if( key.name === "left" ){
		    sprite.components.RigidBody2D.body.velocity.x -= 0.1;
		}
		if( key.name === "a" ){
		    sprite.components.RigidBody2D.body.angularVelocity += Math.PI*0.03125;
		}
		if( key.name === "d" ){
		    sprite.components.RigidBody2D.body.angularVelocity -= Math.PI*0.03125;
		}
	    });
	    
	    Mouse.on("wheel", function(){
		camera.zoomBy( -this.wheel*Time.delta*4 );
	    });
	    Mouse.on("move", function(){
		
		if( this.left ){
		    camera.translate( vec2_1.set( this.delta.x, this.delta.y ).smul( -Time.delta*0.5 ) );
		}
	    });
	    
	    
	    scene.add( camera );
	    
	    this.addScene( scene );
	    this.setScene( scene );
	    this.setCamera( camera );
	});
	
	game.init();
    }
);