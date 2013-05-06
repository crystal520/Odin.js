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
	    camera = new Camera;
	    
	    for( var i = 0; i < 100; i++ ){
		var pos = new Vec2( Mathf.randomRange(-1,1), Mathf.randomRange(-1,1) ),
		    sprite = new GameObject({
			position: pos,
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
					rate: 0.25
				    }
				}
			    })
			]
		    });
		sprite.on("update", function(){
		    this.rotate( Mathf.PI*0.5*Time.delta );
		});
		
		scene.add( sprite );
	    }
	    
	    Mouse.on("wheel", function(){
		camera.zoomBy( -this.wheel*Time.delta*2 );
	    });
	    Mouse.on("move", function(){
		
		if( this.left ){
		    camera.translate( vec2_1.set( -this.delta.x, this.delta.y ).smul( Time.delta*0.5 ) );
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