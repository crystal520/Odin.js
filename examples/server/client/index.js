require(
    {
        baseUrl: "./"
    },
    [
        "odin",
    ],
    function( Odin ){
        
        Odin.globalize();
        
        game = new ClientGame({
            host: "192.168.1.181",
            port: 3000,
            forceCanvas: true,
            debug: true
        });
        
        game.on("init", function(){
            // Client Game goes here
        });
        
        game.init();
    }
);