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
	    
	    scene = new Scene;
	    camera = new Camera2D;
	    camera.on("update", function(){
		this.follow( sprite, 16 );
	    });
	    
	    sprite = new GameObject2D({
		position: new Vec2( 0, 2 ),
		rotation: 0,
		components: [
		    new Sprite({
			image: player,
			x: 0,
			y: 0,
			w: 64,
			h: 64,
			width: 1,
			height: 1,
			animations: {
			    idle: {
				frames: [
				    [ 0, 0, 64, 64 ],
				    [ 64, 0, 64, 64 ]
				],
				rate: 0.5
			    }
			}
		    }),
		    new RigidBody({
			shape: RigidBody.RECT,
			mass: 1,
			velocity: new Vec2( 0, 1 ),
			angularVelocity: 0,
			linearDamping: new Vec2( 0, 0 ),
			angularDamping: 0,
			extents: new Vec2( 0.5, 0.5 )
		    })
		]
	    });
	    
	    sprite2 = new GameObject2D({
		position: new Vec2( 0, 0 ),
		components: [
		    new Sprite({
			image: player,
			x: 0,
			y: 0,
			w: 64,
			h: 64,
			width: 1,
			height: 1
		    }),
		    new RigidBody({
			shape: RigidBody.RECT,
			mass: 0,
			extents: new Vec2( 0.5, 0.5 )
		    })
		]
	    });
	    sprite2.on("update", function(){
		//this.rotation += Math.PI*Time.delta;
	    });
	    
	    scene.add( sprite2, sprite );
	    
	    Keyboard.on("keydown", function( key ){
		if( key.name === "up" ){
		    sprite.components.RigidBody.applyForce( vec2_1.set( 0, 100 ) );
		}
		if( key.name === "down" ){
		    sprite.components.RigidBody.applyForce( vec2_1.set( 0, -1 ) );
		}
		if( key.name === "right" ){
		    sprite.components.RigidBody.applyForce( vec2_1.set( 1, 0 ) );
		}
		if( key.name === "left" ){
		    sprite.components.RigidBody.applyForce( vec2_1.set( -1, 0 ) );
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