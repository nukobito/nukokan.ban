var SpritePad = Class.create( Pad, {
    initialize: function () {
        Pad.call( this );
        
        this.addEventListener( 'enterframe', this.enterframe );
        
        this.addEventListener( 'touchstart', this.touchstart );
        this.addEventListener( 'touchend',   this.touchend );
    },
    enterframe: function ( e ) {
        if ( this.frame == 1 ) {
            if ( core.input.left  ) { this.rotation = 270; }
            if ( core.input.right ) { this.rotation =  90; }
            if ( core.input.up    ) { this.rotation =   0; }
            if ( core.input.down  ) { this.rotation = 180; }
        }
    },
    touchstart: function ( e ) {
        this.frame = 1;
    },
    touchend: function ( e ) {
        this.frame = 0;
    }
} );

var FillRect = Class.create( Sprite, {
    initialize: function ( width, height, style ) {
        Sprite.call( this, width, height );
        
        var surBack = new Surface( width, height );
        var context = surBack.context;
        context.beginPath();
        
        context.strokeStyle = style;
        context.rect( 0, 0, width, height );
        context.fillStyle = style;
        context.fill();
        
        context.closePath();
        context.stroke();
        
        this.image = surBack;
    }
} );