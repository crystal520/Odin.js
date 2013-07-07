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
			image: "../content/images/player.png",
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
			linearDamping: new Vec2( 0.9, 0.9 ),
			angularDamping: 0.9,
			extents: new Vec2( 0.5, 0.5 )
		    })
		]
	    });
	    
	    sprite2 = new GameObject2D({
		position: new Vec2( 0, -0.5 ),
		components: [
		    new Sprite2D({
			image: "../content/images/player.png",
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
			image: "../content/images/player.png",
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
	    
	    
	    sprite.on("update", function(){
		var body = this.components.RigidBody2D.body,
		    velocity = body.velocity,
		    speed = 0.1, angularSpeed = Math.PI*0.03125;
		
		if( Input.key("up") ){
		    velocity.y += speed;
		}
		if( Input.key("down") ){
		    velocity.y -= speed;
		}
		if( Input.key("right") ){
		    velocity.x += speed;
		}
		if( Input.key("left") ){
		    velocity.x -= speed;
		}
		
		if( Input.key("a") ){
		    body.angularVelocity += angularSpeed;
		}
		if( Input.key("d") ){
		    body.angularVelocity -= angularSpeed;
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