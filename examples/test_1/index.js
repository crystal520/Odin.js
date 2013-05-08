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
		var pos = new Vec2( Mathf.randomRange(-2,2), Mathf.randomRange(-2,2) ),
		    ratio = Math.random(),
		    sprite = new GameObject({
			position: pos,
			z: ratio,
			components: [
			    new Sprite({
				image: player,
				x: 0,
				y: 0,
				w: 64,
				h: 64,
				width: ratio,
				height: ratio,
				animations: {
				    idle: {
					frames: [
					    [ 0, 0, 64, 64 ],
					    [ 64, 0, 64, 64 ],
					    [ 128, 0, 64, 64 ],
					    [ 192, 0, 64, 64 ],
					    [ 256, 0, 64, 64 ],
					    [ 320, 0, 64, 64 ],
					    [ 384, 0, 64, 64 ],
					    [ 448, 0, 64, 64 ],
					    [ 512, 0, 64, 64 ],
					    [ 576, 0, 64, 64 ],
					    [ 640, 0, 64, 64 ],
					    [ 704, 0, 64, 64 ],
					    [ 768, 0, 64, 64 ],
					    [ 832, 0, 64, 64 ],
					    [ 896, 0, 64, 64 ],
					    [ 960, 0, 64, 64 ]
					],
					rate: Math.random()
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
		camera.zoomBy( -this.wheel*Time.delta*4 );
	    });
	    Mouse.on("move", function(){
		
		if( this.left ){
		    camera.translate( vec2_1.set( this.delta.x, this.delta.y ).smul( -Time.delta*0.5 ) );
		}
	    });
	    
	    var z = 50;
	    Mouse.on("down", function(){
		var pos = camera.toWorld( Mouse.position );
		
		console.log(Mouse.position+"");
		console.log(pos+"");
		
		var sprite = new GameObject({
		    position: pos.clone(),
		    z: z++,
		    components: [
			new Sprite({
			    image: player,
			    x: 0,
			    y: 0,
			    w: 64,
			    h: 64,
			    width: 1,
			    height: 1
			})
		    ]
		});
		
		scene.add( sprite );
	    });
	    
	    
	    scene.add( camera );
	    
	    this.addScene( scene );
	    this.setScene( scene );
	    this.setCamera( camera );
	});
	
	game.init();
    }
);