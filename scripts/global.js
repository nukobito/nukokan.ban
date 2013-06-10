enchant();

var IMAGE_TITLE      = 'images/title.png';
var IMAGE_TITLE_TEXT = 'images/nukokanban.png';
var IMAGE_BOX        = 'images/nukobox_mini.png';

var IMAGE_TILES       = 'images/tiles.png';
var IMAGE_PLAYER      = 'images/nuko_player.png';
var IMAGE_PLAYER_JUMP = 'images/nukopyon.png';

var TEXT_STAGE_COUNT     = 'texts/stagecount';
var TEXT_STAGE_PATH      = 'texts/stage';
var TEXT_STAGE_EXTENSION = '.map';

var BASE_FPS = 30;
var CORE_WIDTH  = 320;
var CORE_HEIGHT = 256;
var TILE_SIZE = 32;

var TILE_TYPE_WALL  = 0;
var TILE_TYPE_FLOOR = 1;
var TILE_TYPE_GOAL  = 2;

var DIRECTION_LEFT  = 0;
var DIRECTION_RIGHT = 1;
var DIRECTION_UP    = 2;
var DIRECTION_DOWN  = 3;

var MOVE_SPEED = 4;

var core = null;
