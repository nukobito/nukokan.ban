onload = function () {
    core = new Core( CORE_WIDTH, CORE_HEIGHT );
    core.fps = BASE_FPS;
    
    core.load( TEXT_STAGE_COUNT, function ( e ) {
        var stageCount = parseInt( core.assets[ TEXT_STAGE_COUNT ], 10 );
        
        var paths = [];
        paths.push( IMAGE_TITLE );
        paths.push( IMAGE_TITLE_TEXT );
        paths.push( IMAGE_BOX );
        
        paths.push( IMAGE_TILES );
        paths.push( IMAGE_PLAYER );
        paths.push( IMAGE_PLAYER_JUMP );
        
        for ( var i = 1; i <= stageCount; i++ ) {
            paths.push( TEXT_STAGE_PATH + i + TEXT_STAGE_EXTENSION );
        }
        
        core.preload( paths );
        core.onload = function () {
            core.pushScene( new SceneCopyright() );
        };
        core.start();
    } );
    
};
