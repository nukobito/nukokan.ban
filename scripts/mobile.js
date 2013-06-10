var Player = Class.create( Sprite, {
    initialize: function ( x, y ) {
        Sprite.call( this, TILE_SIZE, TILE_SIZE );
        
        this.direction = DIRECTION_DOWN;
        this.animCount = 0;
        
        this.image = core.assets[ IMAGE_PLAYER ];
        this.x = x * TILE_SIZE;
        this.y = y * TILE_SIZE;
        this.frame = this.direction * 4;
        
        this.moving = false;
        this.mx = 0;
        this.my = 0;
        this.sx = 0;
        this.sy = 0;
        
        this.addEventListener( 'enterframe', this.enterframe );
    },
    enterframe: function ( e ) {
        if ( this.age % 4 == 0 ) {
            this.animCount = (this.animCount + 1) % 4;
            this.frame = this.direction * 4 + this.animCount;
        }
        
        this.move();
    },
    moveTo: function ( map, boxes, direction ) {
        if ( this.moving ) return;
        
        this.direction = direction;
        
        switch ( this.direction ) {
            case DIRECTION_LEFT:  this.sx = -1; break;
            case DIRECTION_RIGHT: this.sx =  1; break;
            case DIRECTION_UP:    this.sy = -1; break;
            case DIRECTION_DOWN:  this.sy =  1; break;
        }
        
        var destX = this.x + (this.sx * TILE_SIZE);
        var destY = this.y + (this.sy * TILE_SIZE);
        
        var box = null;
        for ( var key in boxes ) {
            if ( boxes[ key ].x == destX && boxes[ key ].y == destY ) {
                box = boxes[ key ];
                break;
            }
        }
        
        if ( box !== null && !box.moveTo( map, boxes, this.direction ) || !map.hitTest( destX, destY ) ) {
            this.sx = 0;
            this.sy = 0;
        }
        
        if ( this.sx !== 0 || this.sy !== 0 ) {
            this.moving = true;
            this.mx = 0;
            this.my = 0;
        }
    },
    move: function () {
        if ( !this.moving ) return;
        
        if ( this.sx !== 0 ) {
            this.x += (MOVE_SPEED * this.sx);
            
            this.mx += MOVE_SPEED;
            if ( TILE_SIZE <= this.mx ) {
                this.moving = false;
                this.sx = 0;
            }
        }
        
        if ( this.sy !== 0 ) {
            this.y += (MOVE_SPEED * this.sy);
            
            this.my += MOVE_SPEED;
            if ( TILE_SIZE <= this.my ) {
                this.moving = false;
                this.sy = 0;
            }
        }
    }
} );

var Box = Class.create( Sprite, {
    initialize: function ( x, y ) {
        Sprite.call( this, TILE_SIZE, TILE_SIZE );
        
        this.image = core.assets[ IMAGE_BOX ];
        this.x = x * TILE_SIZE;
        this.y = y * TILE_SIZE;
        
        this.moving = false;
        this.mx = 0;
        this.my = 0;
        this.sx = 0;
        this.sy = 0;
        
        this.addEventListener( 'enterframe', this.enterframe );
    },
    enterframe: function ( e ) {
        this.move();
    },
    moveTo: function ( map, boxes, direction ) {
        if ( this.moving ) return false;
        
        switch ( direction ) {
            case DIRECTION_LEFT:  this.sx = -1; break;
            case DIRECTION_RIGHT: this.sx =  1; break;
            case DIRECTION_UP:    this.sy = -1; break;
            case DIRECTION_DOWN:  this.sy =  1; break;
        }
        
        var destX = this.x + (this.sx * TILE_SIZE);
        var destY = this.y + (this.sy * TILE_SIZE);
        
        var box = null;
        for ( var key in boxes ) {
            if ( boxes[ key ].x == destX && boxes[ key ].y == destY ) {
                box = boxes[ key ];
                break;
            }
        }
        
        if ( box !== null || !map.hitTest( destX, destY ) ) {
            this.sx = 0;
            this.sy = 0;
            
            return false;
        }
        else {
            this.moving = true;
            this.mx = 0;
            this.my = 0;
            
            return true;
        }
    },
    move: function () {
        if ( !this.moving ) return;
        
        if ( this.sx !== 0 ) {
            this.x += (MOVE_SPEED * this.sx);
            
            this.mx += MOVE_SPEED;
            if ( TILE_SIZE <= this.mx ) {
                this.moving = false;
                this.sx = 0;
            }
        }
        
        if ( this.sy !== 0 ) {
            this.y += (MOVE_SPEED * this.sy);
            
            this.my += MOVE_SPEED;
            if ( TILE_SIZE <= this.my ) {
                this.moving = false;
                this.sy = 0;
            }
        }
    }
} );

var Jumper = Class.create( Sprite, {
    initialize: function () {
        var image = core.assets[ IMAGE_PLAYER_JUMP ];
        Sprite.call( this, image.width, image.height );
        
        this.GRAVITY = 1;
        
        this.image = image;
        this.x = -this.width;
        this.y = Math.floor( Math.random() * core.height * (3/4) ) + (core.height * (1/4));
        this.speedX = Math.floor( Math.random() * 5 );
        this.speedY = 0;
        this.alive = true;
        
        this.addEventListener( 'enterframe', this.enterframe );
    },
    enterframe: function ( e ) {
        this.x += this.speedX;
        if ( core.width < this.x ) {
            this.speedX = 0;
            this.alive = false;
        }
        
        this.y += this.speedY;
        if ( core.height - this.height < this.y ) {
            this.y = core.height - this.height;
            this.speedY = -this.speedY;
        }
        
        this.speedY += this.GRAVITY;
    }
} );