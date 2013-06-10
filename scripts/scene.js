var SceneCopyright = Class.create( Scene, {
    initialize: function () {
        Scene.call( this );
        
        this.backgroundColor = 'black';
        
        this.procNo = 0;
        this.kelvin = 0.0;
        this.wait = 0;
        
        this.mtxtCopyright = new MutableText();
        this.mtxtCopyright.text = 'nukobito PRESENTS';
        this.mtxtCopyright.x = (core.width  - this.mtxtCopyright.width ) * (1/2);
        this.mtxtCopyright.y = (core.height - this.mtxtCopyright.height) * (1/2);
        this.mtxtCopyright.opacity = this.kelvin;
        
        this.addChild( this.mtxtCopyright );
        
        this.addEventListener( 'enterframe', this.enterframe );
        this.addEventListener( 'touchend', this.touchend );
    },
    enterframe: function ( e ) {
        switch ( this.procNo ) {
            case 0:
                this.kelvin += 0.03;
                if ( 1.0 <= this.kelvin )
                    this.procNo = 1;
                break;
            case 1:
                this.wait++;
                if ( 100 <= this.wait )
                    this.procNo = 2;
                break;
            case 2:
                this.kelvin -= 0.03;
                if ( this.kelvin <= 0.0 )
                    this.dispatchEvent( new Event( 'touchend' ) );
                break;
        }
        
        this.mtxtCopyright.opacity = this.kelvin;
    },
    touchend: function ( e ) {
        core.replaceScene( new SceneTitle() );
    }
} );

var SceneTitle = Class.create( Scene, {
    initialize: function () {
        Scene.call( this );
        
        var imgTitle = core.assets[ IMAGE_TITLE ];
        var imgTitleText = core.assets[ IMAGE_TITLE_TEXT ];
        
        var sprTitle = new Sprite( imgTitle.width, imgTitle.height );
        sprTitle.image = imgTitle;
        
        var sprTitleText = new Sprite( imgTitleText.width, imgTitleText.height );
        sprTitleText.image = imgTitleText;
        sprTitleText.x = (core.width - imgTitleText.width) * (1/2);
        sprTitleText.y = (core.height - imgTitleText.height) * (1/5);
        
        var mtxtGameStart = new MutableText();
        mtxtGameStart.text = 'GAME START';
        mtxtGameStart.x = (core.width - mtxtGameStart.width) * (1/2);
        mtxtGameStart.y = (core.height - mtxtGameStart.height) * (3/5);
        mtxtGameStart.menuIndex = 0;
        mtxtGameStart.addEventListener( 'touchend', this.touchend );
        
        var mtxtStageSelect = new MutableText();
        mtxtStageSelect.text = 'STAGE SELECT';
        mtxtStageSelect.x = (core.width - mtxtStageSelect.width) * (1/2);
        mtxtStageSelect.y = mtxtGameStart.y + (mtxtGameStart.height * 2);
        mtxtStageSelect.menuIndex = 1;
        mtxtStageSelect.addEventListener( 'touchend', this.touchend );
        
        this.addChild( sprTitle );
        this.addChild( sprTitleText );
        this.addChild( mtxtGameStart );
        this.addChild( mtxtStageSelect );
    },
    touchend: function ( e ) {
        switch ( e.target.menuIndex ) {
            case 0:
                new SceneMain( 1 );
                break;
            case 1:
                core.replaceScene( new SceneStageSelect() );
                break;
        }
    }
} );

var SceneMain = Class.create( Scene, {
    initialize: function ( stageNo ) {
        Scene.call( this );
        
        core.replaceScene( this );
        
        core.pushScene( new SceneStage( stageNo ) );
        core.pushScene( new SceneStageStart( stageNo ) );
    }
} );

var SceneStage = Class.create( Scene, {
    initialize: function ( stageNo ) {
        Scene.call( this );
        
        this.stageNo = stageNo;
        
        var txtStage = core.assets[ TEXT_STAGE_PATH + stageNo + TEXT_STAGE_EXTENSION ];
        var lines = txtStage.split( '\n' );
        
        var layout = [];
        var collision = [];
        this.boxes = [];
        this.player = null;
        for ( var y = 0; y <lines.length; y++ ) {
            var lItems = [];
            var cItems = [];
            for ( var x = 0; x < lines[ y ].length; x++ ) {
                switch ( lines[ y ][ x ] ) {
                    case '#': lItems.push( TILE_TYPE_WALL  ); cItems.push( 0 ); break;
                    case ' ': lItems.push( TILE_TYPE_FLOOR ); cItems.push( 1 ); break;
                    case '.': lItems.push( TILE_TYPE_GOAL  ); cItems.push( 1 ); break;
                    case '$':
                        lItems.push( TILE_TYPE_FLOOR );
                        cItems.push( 1 );
                        this.boxes.push( new Box( x, y ) );
                        break;
                    case '@':
                        lItems.push( TILE_TYPE_FLOOR );
                        cItems.push( 1 );
                        this.player = new Player( x, y );
                        break;
                }
            }
            layout.push( lItems );
            collision.push( cItems );
        }
        
        this.map = new Map( TILE_SIZE, TILE_SIZE );
        this.map.image = core.assets[ IMAGE_TILES ];
        this.map.loadData( layout );
        this.map.collisionData = collision;
        
        this.addChild( this.map );
        for ( var key in this.boxes ) {
            this.addChild( this.boxes[ key ] );
        }
        this.addChild( this.player );
        
        var sprPad = new SpritePad();
        sprPad.y = (core.height - sprPad.height);
        this.addChild( sprPad );
        
        this.player.addEventListener( 'touchend', this.tochend_player );
        this.addEventListener( 'enterframe', this.enterframe );
    },
    tochend_player: function ( e ) {
        core.pushScene( new SceneGameMenu( e.target.scene.stageNo ) );
    },
    enterframe: function ( e ) {
        if      ( core.input.left  ) this.player.moveTo( this.map, this.boxes, DIRECTION_LEFT );
        else if ( core.input.right ) this.player.moveTo( this.map, this.boxes, DIRECTION_RIGHT );
        else if ( core.input.up    ) this.player.moveTo( this.map, this.boxes, DIRECTION_UP );
        else if ( core.input.down  ) this.player.moveTo( this.map, this.boxes, DIRECTION_DOWN );
        
        var box = null;
        var stageclear = true;
        for ( var key in this.boxes ) {
            box = this.boxes[ key ];
            if ( box.moving || this.map.checkTile( box.x, box.y ) !== TILE_TYPE_GOAL ) {
                stageclear = false;
                break;
            }
        }
        
        if ( stageclear )
            core.pushScene( new SceneStageClear( this.stageNo ) );
    }
} );

var SceneStageStart = Class.create( Scene, {
    initialize: function ( stageNo ) {
        Scene.call( this );

        var mtxtStageNo = new MutableText();
        mtxtStageNo.text = 'STAGE ' + stageNo;
        mtxtStageNo.x = (core.width - mtxtStageNo.width) * (1/2);
        mtxtStageNo.y = (core.height - mtxtStageNo.height) * (1/2);
        
        var frecBack = new FillRect( core.width, mtxtStageNo.height * 3, 'rgba( 0, 0, 0, 0.5 )' );
        frecBack.y = mtxtStageNo.y - mtxtStageNo.height;
        
        this.addChild( frecBack );
        this.addChild( mtxtStageNo );
        
        this.addEventListener( 'enterframe', this.enterframe );
        this.addEventListener( 'touchend', this.touchend );
    },
    enterframe: function () {
        if ( 70 <= this.age )
            this.dispatchEvent( new Event( 'touchend' ) );
    },
    touchend: function ( e ) {
        core.popScene();
    }
} );

var SceneStageClear = Class.create( Scene, {
    initialize: function ( stageNo ) {
        Scene.call( this );
        
        this.stageNo = stageNo;
        
        var mtxtClear = new MutableText();
        mtxtClear.text = 'CLEAR';
        mtxtClear.x = (core.width  - mtxtClear.width ) * (1/2);
        mtxtClear.y = (core.height - mtxtClear.height) * (1/2);
        
        var frecBack = new FillRect( core.width, mtxtClear.height * 3, 'rgba( 0, 0, 0, 0.5 )' );
        frecBack.y = mtxtClear.y - mtxtClear.height;
        
        this.addChild( frecBack );
        this.addChild( mtxtClear );
        
        this.addEventListener( 'enterframe', this.enterframe );
        this.addEventListener( 'touchend', this.touchend );
    },
    enterframe: function () {
        if ( 70 <= this.age )
            this.dispatchEvent( new Event( 'touchend' ) );
    },
    touchend: function ( e ) {
        core.popScene();
        core.popScene();
        
        if ( this.stageNo == parseInt( core.assets[ TEXT_STAGE_COUNT ], 10 ) )
            core.replaceScene( new SceneCongratulations() );
        else
            new SceneMain( this.stageNo + 1 );
    }
} );

var SceneGameMenu = Class.create( Scene, {
    initialize: function ( stageNo ) {
        Scene.call( this );
        
        this.stageNo = stageNo;
        
        var items = [ 'RETURN', 'RETRY', 'TITLE', 'STAGE SELECT' ];
        
        var grpItems = new Group();
        var beforeY = 0;
        for ( var key in items ) {
            var mtxtItem = new MutableText();
            mtxtItem.text = items[ key ];
            mtxtItem.x = (core.width - mtxtItem.width) * (1/2);
            mtxtItem.y = beforeY;
            mtxtItem.menuIndex = parseInt( key, 10 );
            mtxtItem.addEventListener( 'touchend', this.touchend_item );
            
            grpItems.addChild( mtxtItem );
            
            beforeY += mtxtItem.height;
        }
        
        var oneItemHeight = beforeY / items.length;
        var frecBack = new FillRect( core.width, oneItemHeight * (items.length + 1) , 'rgba( 0, 0, 0, 0.5 )' );
        frecBack.y = (core.height - frecBack.height) * (1/2);
        
        grpItems.y = frecBack.y + (oneItemHeight / 2);
        
        this.addChild( frecBack );
        this.addChild( grpItems );
    },
    touchend_item: function ( e ) {
        switch ( e.target.menuIndex ) {
            case 0:
                core.popScene();
                break;
            case 1:
                core.popScene();
                core.popScene();
                
                new SceneMain( e.target.scene.stageNo );
                break;
            case 2:
                core.popScene();
                core.popScene();
                
                core.replaceScene( new SceneTitle() );
                break;
            case 3:
                core.popScene();
                core.popScene();
                
                core.replaceScene( new SceneStageSelect() );
                break;
            default:
                core.popScene();
                break;
        }
    }
} );

var SceneStageSelect = Class.create( Scene, {
    initialize: function () {
        Scene.call( this );
        
        this.backgroundColor = 'black';
        
        var grpItems = new Group();
        
        var totalWidth = 0;
        var fontSize = new MutableText().fontSize;
        var stageCount = parseInt( core.assets[ TEXT_STAGE_COUNT ], 10 );
        for ( var i = 1; i <= stageCount; i++ ) {
            var mtxtItem = new MutableText();
            mtxtItem.text = i.toString();
            mtxtItem.x = totalWidth;
            mtxtItem.y = 0;
            mtxtItem.itemIndex = i;
            mtxtItem.addEventListener( 'touchend', this.touchend_item );
            
            grpItems.addChild( mtxtItem );
            
            if ( i == stageCount )
                totalWidth += mtxtItem.width;
            else
                totalWidth += mtxtItem.width + (fontSize / 2);
        }
        
        grpItems.x = (core.width  - totalWidth ) * (1/2);
        grpItems.y = (core.height - fontSize   ) * (1/2);
        
        this.addChild( grpItems );
    },
    touchend_item: function ( e ) {
        new SceneMain( e.target.itemIndex );
    }
} );

var SceneCongratulations = Class.create( Scene, {
    initialize: function () {
        Scene.call( this );
        
        this.backgroundColor = 'black';
        
        var mtxtCongratulations = new MutableText();
        mtxtCongratulations.text = 'Congratulations';
        mtxtCongratulations.x = (core.width  - mtxtCongratulations.width ) * (1/2);
        mtxtCongratulations.y = (core.height - mtxtCongratulations.height) * (1/4);
        
        this.jumpers = [];
        
        this.addChild( mtxtCongratulations );
        
        this.addEventListener( 'enterframe', this.enterframe );
        this.addEventListener( 'touchend', this.touchend );
    },
    enterframe: function ( e ) {
        var tmp = [];
        for ( var key in this.jumpers ) {
            if ( this.jumpers[ key ].alive )
                tmp.push( this.jumpers[ key ] );
        }
        this.jumpers = tmp;
        
        if ( this.jumpers.length < 50 && Math.floor( Math.random() * 100 ) < 4 ) {
            var jumper = new Jumper();
            this.jumpers.push( jumper );
            this.addChild( jumper );
        }
    },
    touchend: function ( e ) {
        core.replaceScene( new SceneCopyright() );
    }
} );
