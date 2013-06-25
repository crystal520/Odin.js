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
	    
	    scene = new Scene2D;
	    camera = new Camera2D({
		position: new Vec2( 0, 0 ),
		zoom: 1
	    });
	    
	    ground = new GameObject2D({
		position: new Vec2( 0, -1 ),
		components: [
		    new RigidBody2D({
			mass: 0,
			extents: new Vec2( 4, 0.5 ),
			type: RigidBody2D.KINEMATIC
		    })
		]
	    });
	    ground.on("update", function(){
		
		if( Input.key("up") ){
		    this.position.y += 0.01;
		}
		if( Input.key("down") ){
		    this.position.y -= 0.01;
		}
		if( Input.key("right") ){
		    this.position.x += 0.01;
		}
		if( Input.key("left") ){
		    this.position.x -= 0.01;
		}
		
		if( Input.key("a") ){
		    this.rotation += 0.01;
		}
		if( Input.key("d") ){
		    this.rotation -= 0.01;
		}
	    });
	    
	    scene.add( ground );
	    
	    ball = new GameObject2D({
		position: new Vec2( 0, 2 ),
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
			mass: 1,
			radius: 0.5
		    })
		]
	    });
	    scene.add( ball );
	    
	    Mouse.on("wheel", function(){
		camera.zoomBy( -this.wheel*Time.delta*4 );
	    });
	    Mouse.on("move", function(){
		
		if( this.left ){
		    camera.translate( vec2_1.set( this.delta.x, this.delta.y ).smul( -0.05 ) );
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