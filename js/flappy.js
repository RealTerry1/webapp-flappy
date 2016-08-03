// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };

// Global variables

var song;
var width = 790;
var height = 400;
var gameSpeed = 200;
var gameGravity = 200;
var jumpPower = 200;
var gapSize = 200;
var gapMargin = 50;
var blockHeight = 50;
var pipeEndHeight = 25;
var pipeEndExtraWidth = 10;
var bonusVelocity = 200;
var playerHeight = 60;
var playerWidth = 60;
// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(790, 400, Phaser.AUTO, 'game', stateActions);

// Score variables
var score = 0;
var labelScore;

// Player declaration
var player;

// Pipes declaration
var pipes  = [];
var pipeEnds = [];
var balloons = [];
var weights = [];

/*
 * Loads all resources for the game and gives them names.
 */
function preload() {
  game.load.image("playerImg", "../assets/AinsleyHead.png");
  game.load.audio("score", "../assets/point.ogg");
  game.load.image("pipeBlock","../assets/pipe.png");
  game.load.image("wall","../assets/AinsleyPour.jpg");
  game.load.audio("music","../assets/Second_Beat.mp3");
  game.load.audio("hitSound","../assets/Disappointed Crowd.mp3");
  game.load.image("pipeEnd","../assets/pipe-end.png");
  game.load.image("balloons","../assets/balloons.png");
  game.load.image("weights","../assets/weight.png");
  game.load.audio("jumpSound","../assets/yeahbwoii.wav");
}


/*
 */
function create() {
    // Before the player starts
    // * Initialises the game. This function is only called once.
    // Set score to 0
    score = 0;
    // Initialise game physics
    game.physics.startSystem(Phaser.Physics.ARCADE);
    // Set up the background
    game.stage.setBackgroundColor("#246BB2");
    game.input.onDown.add(clickHandler);
    var background  = game.add.image(0, 0, "wall");
    background.width = width;
    background.height = height;
    labelScore = game.add.text(20, 20, "0", {font: "30px Times", fill: "#FFFFFF"});
    welcomeText = game.add.text(300, 200, "Press ENTER to Start", {font: "30px Times", fill: "#FFFFFF"});
    game.input
    .keyboard.addKey(Phaser.Keyboard.ENTER)
    .onDown.add(start);

    // Set up the player's sprite
    player = game.add.sprite(150, 200, "playerImg");
    player.width = playerWidth;
    player.height = playerHeight;

    // Enable game physics for the player sprite
    game.physics.arcade.enable(player);
}


function start() {
  song = game.sound.play("music");
  // Disable the enter button
  game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.remove(start);
  welcomeText.destroy();
   // Relates player input to event
  game.input.keyboard
            .addKey(Phaser.Keyboard.SPACEBAR)
            .onDown
            .add(function() {
              player.body.velocity.y = - jumpPower;
              game.sound.play("jumpSound");
            });

  player.body.gravity.y = gameGravity;
  player.anchor.setTo(0.5, 0.5);
  // Pause game initially
  // Make pipes come
  var pipeInterval = 1.75 * Phaser.Timer.SECOND;
  game.time.events.loop(
      pipeInterval,
      generate
  );
}

/*
 * This function updates the scene. It is called for every new frame.
 */
function update() {
  player.rotation = Math.atan(player.body.velocity.y / gameSpeed);
  checkBonus(balloons, -50);
  checkBonus(weights, 50);
  game.physics.arcade.overlap(
    player,
    pipes,
    gameOver);
  game.physics.arcade.overlap(
    player,
    pipeEnds,
    gameOver);
  if (player.y > 700 || player.y < 0) {
    gameOver();
  }
}

function clickHandler(event) {
  alert("Game paused");
}

function changeScore() {
  score ++;
  labelScore.setText(score.toString());
}

function generatePipe() {
  // gapStart is the distance between the top of the
  // canvas and the top of the gap
  var gapStart = game.rnd.integerInRange(gapMargin, height - gapSize - gapMargin);
  // y is the coordinate of the bottom of the block,
  // the top is found by subtracting its height
  // Add the pipe end to the top of the blocks, adding 22 to make it on the end
  addPipeEnd(width - (pipeEndExtraWidth / 2), gapStart - pipeEndHeight + 22);
  for (var y = gapStart; y > 0; y -= blockHeight) {
    addPipeBlock(width, y - blockHeight);
    }
  addPipeEnd(width - (pipeEndExtraWidth / 2), gapStart + gapSize - 22);
  for (var z = gapStart + gapSize; z < height; z += blockHeight) {
    addPipeBlock(width, z);
    }
  changeScore();
}

function addPipeBlock (x, y) {
  // Create a new pipe block
  var block = game.add.sprite(x, y, "pipeBlock");
  // Enable game physics for block
  game.physics.arcade.enable(block);
  // Make it move left
  block.body.velocity.x = -gameSpeed;
  // Add it to the pipes array
  pipes.push(block);
}

function addPipeEnd (x, y) {
  var pipeEnd = game.add.sprite(x, y, "pipeEnd");
  game.physics.arcade.enable(pipeEnd);
  pipeEnd.body.velocity.x = -gameSpeed;
  pipeEnds.push(pipeEnd);
}

function changeGravity(g) {
  gameGravity += g;
  player.body.gravity.y = gameGravity;
}


function generateBonus(bonusArray, bonusHeight, bonusImage, bonusMotion) {
  var bonus = game.add.sprite(width, bonusHeight, bonusImage);
  bonusArray.push(bonus);
  game.physics.arcade.enable(bonus);
  bonus.body.velocity.x = - bonusVelocity;
  bonus.body.velocity.y = bonusMotion * game.rnd.integerInRange(60, 100);
}

function generate() {
  var randomGenerator = game.rnd.integerInRange(1, 10);
  if (randomGenerator === 1) {
    generateBonus(weights, 0, "weights", 1);
  }
  else if (randomGenerator === 2) {
    generateBonus(balloons, height, "balloons", -1);
  }
  else {
    generatePipe();
  }
}

function checkBonus(bonusArray, bonusEffect) {
  for (var i = bonusArray.length - 1; i >= 0; i--) {
    game.physics.arcade.overlap(
      player,
      bonusArray[i],
      function() {
        changeGravity(bonusEffect);
        bonusArray[i].destroy();
        bonusArray.splice(i, 1);
      });
  }
}

function gameOver() {
  song.pause();
  registerScore(score);
  gameGravity = 200;
  game.state.restart();
}
