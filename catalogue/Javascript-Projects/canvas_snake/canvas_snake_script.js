var gameCanvas = document.getElementById("game_canvas");
var gameContext = gameCanvas.getContext("2d");
gameContext.scale(1,1);
var labelCanvas = document.getElementById("label_canvas");
var labelContext = labelCanvas.getContext("2d");
labelContext.scale(1,1);
const renderSpeed = 20; // will render a frame every 20ms. Meaning about 50FPS

//Collecting the window size info and calculating the aspect ratio values for the canvas to be 1:1 with the window:

gameCanvas.width = window.innerWidth;
gameCanvas.height = 10* window.innerWidth/16; // aspect ratio 16:10

labelCanvas.width = window.innerWidth;
labelCanvas.height = 2* window.innerWidth/10; // aspect ratio 16:10

var defaultComponentSize = window.innerWidth/32;
//let the component be a ratio of the gameCanvas pixel size

/*
The setting of aspect ratio for the canvas above is very important in order to draw the image textures in good quality.
Without this everything will become pixelated and be rendered in very poor quality.
*/

var labelCanvasMargin = 150;
var snakeHeadTexture_LEFT = "./textures/red_snake_head_left.png";
var snakeHeadTexture_RIGHT = "./textures/red_snake_head_right.png";
var snakeHeadTexture_UP = "./textures/red_snake_head_up.png";
var snakeHeadTexture_DOWN = "./textures/red_snake_head_down.png";
var snakeBodyTexture = "./textures/red_snake_body.png";
var fruitTexture = "./textures/fruit.png"

class text_component
{
    constructor(x_pos, y_pos, labelName, size, color, canvas, context)
    {
        //just the constructor
        this.type = "text_component";
        this.PosX = x_pos;
        this.PosY = y_pos;
        this.fontFamily = "Arial";
        this.size = size;
        this.canvas = canvas;
        this.context = context;
        this.labelName = labelName;
        this.textMessage = this.labelName;
        this.color = color;
    }
    setText(value)
    {
        /*Function to set the text of this component*/
        this.textMessage = this.labelName + " " + value;
    }
    update()
    {
        /*Function to update the component on the screen canvas*/
        this.context.font = this.size + " "  + this.fontFamily + " " + "bold";
        //this.context.fontVariantCaps = "small-caps";
        this.context.fontWeight = "normal";
        this.context.letterSpacing = "3vw";
        this.context.fillStyle = this.color;
        this.context.fillText(this.textMessage, this.PosX , this.PosY);
    }
}

class shape_component
{
    
    constructor(x, y, texture)
    {
        //Just the constuctor
        this.type = "shape_component";
        this.PosX = x;
        this.PosY = y;
        this.texture = texture;        
    }
    update ()
    {
        /*Function to update the component on the screen canvas*/
        this.image = new Image();
        this.image.src = this.texture;   
        gameContext.drawImage(this.image, this.PosX, this.PosY, defaultComponentSize, defaultComponentSize);
    }
    collidesWith(other_component)
    {
        /*Function to check whether this component collides another component object of this class*/
        if ( other_component.type == "shape_component")
        {
            //Calculate the differences between this component and other_component's coordinates
            var diff_posX = this.PosX - other_component.PosX;
            var diff_posY = this.PosY - other_component.PosY
            if (diff_posX < 0)
            {
                //I'm only interested in the strictly positive values
                diff_posX = diff_posX * (-1);
            }
            if(diff_posY < 0)
            {
                //I'm only interested in the strictly positive values
                diff_posY = diff_posY * (-1);
            }
            //End calculation
            
            //check whether the coordinantes are different and if they are different also check
            //if the components don't collide / overlap their textures
            if(( diff_posX < defaultComponentSize) && (diff_posY < defaultComponentSize) )
            {
                return true;
            }
        }
        return false;
    }
}


class Snake
{
    
    constructor()
    {
        //Just the constructor.
        this.snakeSpeed = defaultComponentSize; // snake speed measures in pixels
        this.snakeDirection = "";
        this.snake = [];
        //the snake shall start from the middle of the screen.
        this.snake.push(new shape_component (gameCanvas.width/2, gameCanvas.height/2, snakeHeadTexture_LEFT));
    }
    
    //Making update function capable of calling other function within the class by using this keyword.
     update = () =>  // this synthax allow JS to call another function defined within this class
    {
        /*
        Function to update the snake on the screen canvas.
        */
        if (this.snake.length > 0)
        {
            this.move(); // this function can be called only because of update = () => declaration
            for(var i=0 ; i< this.snake.length; i++)
            {
                this.snake[i].update();
            }
        }
    }
    setSnakeMovementDirection_LEFT()
    {
        /*
        Function to set the snake on moving LEFT.
        */
        if ( this.snakeDirection != "right") //Do not allow 180 degrees turns
        {
            this.snakeDirection = "left";
            this.snake[0].texture = snakeHeadTexture_LEFT;  
            resetInputButtonColors();
            document.getElementById("Left").style.backgroundColor = "red";

        }
    }
    setSnakeMovementDirection_RIGHT()
    {
        /*
        Function to set the snake on moving RIGHT.
        */
        if ( this.snakeDirection != "left") //Do not allow 180 degrees turns
        {
            this.snakeDirection = "right";
            this.snake[0].texture = snakeHeadTexture_RIGHT; 
            resetInputButtonColors();
            document.getElementById("Right").style.backgroundColor = "red";                

        }
    }
    setSnakeMovementDirection_DOWN()
    {
        /*
        Function to set the snake on moving DOWN.
        */
        if ( this.snakeDirection != "up") //Do not allow 180 degrees turns
        {
            this.snakeDirection = "down";
            this.snake[0].texture = snakeHeadTexture_DOWN; 
            resetInputButtonColors();
            document.getElementById("Down").style.backgroundColor = "red";   
         
        }
    }
    setSnakeMovementDirection_UP()
    {
        /*
        Function to set the snake on moving UP.
        */
        if ( this.snakeDirection != "down") //Do not allow 180 degrees turns
        {
            this.snakeDirection = "up";
            this.snake[0].texture = snakeHeadTexture_UP; 
            resetInputButtonColors();
            document.getElementById("Up").style.backgroundColor = "red";

        }
    }
    move = () =>
    {
        /*
        Function to move the whole snake -> also calls the moveBody() function.
        */
        if (this.snakeDirection == "up")
        {
            var buffer_Y = this.snake[0].PosY;
            var buffer_X = this.snake[0].PosX;
            //move the head
            this.snake[0].PosY -= this.snakeSpeed;
            
            //move the body
            this.moveBody(buffer_X, buffer_Y);
            
        }
        else if(this.snakeDirection =="down")
        {
            var buffer_Y = this.snake[0].PosY;
            var buffer_X = this.snake[0].PosX;
            //move the head
            this.snake[0].PosY += this.snakeSpeed;
            //move the body
            this.moveBody(buffer_X, buffer_Y); 
            
        }
        else if (this.snakeDirection == "left")
        {
            var buffer_Y = this.snake[0].PosY;
            var buffer_X = this.snake[0].PosX;
            //move the head
            this.snake[0].PosX -= this.snakeSpeed;
            
            //move the body
            this.moveBody(buffer_X, buffer_Y); 
                        
        }
        else if(this.snakeDirection =="right")
        {
            var buffer_Y = this.snake[0].PosY;
            var buffer_X = this.snake[0].PosX;
            //move the head
             this.snake[0].PosX += this.snakeSpeed;
            
            //move the body
            this.moveBody(buffer_X, buffer_Y);
            
        }

    }
    moveBody(positionX, positionY)
    {
        /*
        Function to move the snake's body.
        */
        
        //move the body
        for(var i = 1; i< this.snake.length; i++)
        {
            var aux_Y = this.snake[i].PosY;
            var aux_X = this.snake[i].PosX;
            this.snake[i].PosY = positionY;
            this.snake[i].PosX = positionX;
            positionY = aux_Y;
            positionX = aux_X;
        }
    }
    checkSnakeHittingMargins()
    {
        /*
        Function to check whether the snake is hitting the margins of the canvas
        */
        if ( (this.snake[0].PosY < 0 )  || ( this.snake[0].PosY > ( gameCanvas.height - defaultComponentSize) ) )
        {
            //if the snake's head cannot be entirely drawn to the screen, it means that is passed outside the boundries
            if (this.snakeDirection == "up")
            {
                gameCanvas.style.borderTopColor = "red";
            }
            else if (this.snakeDirection == "down")
            {
                gameCanvas.style.borderBottomColor = "red";
            }
            return true;

        }
        if ( (this.snake[0].PosX < 0 ) || ( this.snake[0].PosX > ( gameCanvas.width - defaultComponentSize)))
        {
            
            //if the snake's head cannot be entirely drawn to the screen, it means that is passed outside the boundries
            if (this.snakeDirection == "left")
            {
                gameCanvas.style.borderLeftColor = "red";
            }
            else if (this.snakeDirection == "right")
            {
                gameCanvas.style.borderRightColor = "red";
            }
            return true;
        }
        return false;
    }
    eat = () =>
    {
        /*
        Function to grow the snake after eating a fruit.
        */
        if(this.snake.length > 0 && this.snake.length < 100)
        {
            /*
            This will increase the length of the body of the snake only until
            a maximum given value, this will ensure than we will always have free square 
            to play through.
            Given the current configuration we have 32*20=640 square, and the snake can
            only grow up to 100 squares, so we will have 540 square to travel through.
            */
            var temp_posX = this.snake[this.snake.length-1].PosX;
            var temp_posY = this.snake[this.snake.length-1].PosY;
            this.snake.push(new shape_component(temp_posX, temp_posY, snakeBodyTexture) );
        }
    }
    checkSnakeCollision()
    {
        /*
        Function to check whether the snake is colliding with itself.
        */
            for(var i = 1; i< this.snake.length; i++)
            {
                if (this.snake[0].collidesWith(this.snake[i]) == true)
                {
                    //if the snake head collides with the rest of the body
                    return true;
                }
            }
            return false;
    }
}


class Game
{
    constructor()     
    {
        //just the constructor function
        this.fruit = "";
        this.gameOver = false;
        this.snakeSpeed =  200;
        this.snakeAccelerationFactor =  5;
        this.snakeMaxSpeed = 100;
        this.msCounter = 0;
        this.scoreTextComponent = new text_component(gameCanvas.width - (90/120 * gameCanvas.width), (gameCanvas.height- (90/115 * gameCanvas.height)), "Score:", "14vw", "black", labelCanvas,labelContext);
        this.gameOverTextComponent = new text_component( gameCanvas.width/2-250, gameCanvas.height/2, "", "7vw", "red", gameCanvas, gameContext);
        this.gameResultTextComponent = new text_component( gameCanvas.width/2-350, gameCanvas.height/2+100, "", "5vw", "red", gameCanvas, gameContext);
        this.scoreValue = 0;
        this.scoreFactor = 1;
        this.player = new Snake();
        this.generateFruit();
        this.scoreTextComponent.setText(this.scoreValue);
    }
    restart()
    {
        this.clear();
        this.fruit = "";
        this.gameOver = false;
        this.snakeSpeed =  200;
        this.msCounter = 0;
        this.scoreFactor = 1;
        this.scoreValue = 0;
        this.player = new Snake();
        this.generateFruit();
        this.scoreTextComponent.setText(this.scoreValue);
    }
    clear()
    {
        /*Function to clear the canvas*/
        gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        labelContext.clearRect(0, 0, labelCanvas.width, labelCanvas.height);
    }
    move(e)
    {
        /*Function to move the player*/
        switch (e.key) //if the key pressed is SPACE KEY
        {
            case "ArrowLeft":
            case "A":
            case "a":
            {
                this.player.setSnakeMovementDirection_LEFT();
                break;
            }
            case "ArrowRight":
            case "D":
            case "d":
            {
                this.player.setSnakeMovementDirection_RIGHT();
                break;
            }
            case "ArrowUp":
            case "W":
            case "w":
            {
                this.player.setSnakeMovementDirection_UP();
                break;
            }
            case "ArrowDown":
            case "S":
            case "s":
            {
                this.player.setSnakeMovementDirection_DOWN();
                break;
            }
            default:
            {
                break;
            }
        }
    }

    //Making updateGameArea class function capable of calling other this.functions within the class.
     updateGameArea = () =>  
    {
        /*
        Function to update the whole game screen. It also calls on the other components.update functions.
        */
        this.msCounter += renderSpeed;
        if(this.gameOver == false && this.msCounter >= this.snakeSpeed)
        {
            this.msCounter = 0;
            if (this.fruit != "")
            {
                if(this.player.checkSnakeCollision() == true)
                {
                    this.gameOver = true;
                    this.gameOverTextComponent.setText("Game Over!");
                    this.gameResultTextComponent.setText("You collided with yourself!");
                    this.gameOverTextComponent.update();
                    this.gameResultTextComponent.update();
                    return;
                }
                else if (this.player.checkSnakeHittingMargins() == true)
                {
                    this.gameOver = true;
                    this.gameOverTextComponent.setText("Game Over!");
                    this.gameResultTextComponent.setText("You collided with the wall!");
                    this.gameOverTextComponent.update();
                    this.gameResultTextComponent.update();
                    return;
                }
                else if ( this.player.snake[0].collidesWith(this.fruit) == true)
                {
                    this.scoreValue+=this.scoreFactor;
                    this.scoreTextComponent.setText(this.scoreValue);
                    this.player.eat();
                    this.fruit = ""; // we don't have a fruit now
                    this.generateFruit();
                    //Once every 5 eaten fruits if the SnakeSpeed allows is accelerate and offer better awards
                    if(this.snakeSpeed > this.snakeMaxSpeed && this.player.snake.length % 5 == 0)
                    {
                        this.snakeSpeed -= this.snakeAccelerationFactor;
                        this.scoreFactor++;
                    }
                    //To call this.function within a class method: 
                    //You have to make the caller function able of invoking: EX: updateGameArea = () =>
                }      
                this.clear();
                this.player.update();
                this.scoreTextComponent.update();
                this.fruit.update();
            }
            else
            {   // the fruit is generated all the time, so you shouldn't really get here.
               //Generate a new fruit
              this.generateFruit(); // this synthax allow JS to call another function defined within this class 
            }
        }
    }
    
    generateFruit = () => // class invokable function.
    {    
        /* Function to generate a new fruit after the current one has been eaten.*/
        
        while(this.fruit=="") //don't leave this loop until you find a free spot to generate a fruit.
        {
            var screenOffset = 2;  //to ignore the first and last column/row from near the border/edge of the canvas
            
            //calculate how many elements would fit on a row excluse 2 rows (first and last)
            var max_Rand_Y = Math.floor((gameCanvas.height / defaultComponentSize) - screenOffset); 

            //generate a random rows number from 0 to LastRow-2
            var posY = Math.floor(Math.random()* max_Rand_Y  ) ; 

            // from 0 to LastRow-2 make it from 1 to LastRow-1
            posY += screenOffset/2; 
            
            // multiply with the actual size of the lement to get the position / coordinate
            posY = posY * defaultComponentSize;
            
            //Same as before but for X Axis - taking under consideration the number of columns
            var max_Rand_X = Math.floor((gameCanvas.width / defaultComponentSize) - screenOffset);

            var posX = Math.floor(Math.random()* max_Rand_X);

            posX += screenOffset/2; 
            posX = posX * defaultComponentSize;

            var positionIsClean = true;
            
            var temp_component = new shape_component(posX, posY, "",)
            for(var i = 0; i < this.player.snake.length; i++)
            {
                if ( this.player.snake[i].collidesWith(temp_component) == true)
                {
                    positionIsClean = false;
                    
                }
            }
            if (positionIsClean)
            {
                this.fruit = new shape_component(temp_component.PosX, temp_component.PosY, fruitTexture);
            }
        }
    }
}

function resetInputButtonColors()
{
    document.getElementById("Left").style.backgroundColor = "green";
    document.getElementById("Right").style.backgroundColor = "green";
    document.getElementById("Up").style.backgroundColor = "green";
    document.getElementById("Down").style.backgroundColor = "green";
}

function FullscreenMode(e) 
{
    var game_content = document.getElementById("game_content");
    var fullscreen_button = document.getElementById("fullscreen");
    if (document.fullscreenElement == null)
    {
        if (game_content.requestFullscreen) 
        {
            game_content.requestFullscreen();
        } 
        else if (game_content.webkitRequestFullscreen) 
        { /* Safari */
            game_content.webkitRequestFullscreen();
        } 
        else if (game_content.msRequestFullscreen) 
        { /* IE11 */
            game_content.msRequestFullscreen();
        }
    }
    else
    {

        if (document.exitFullscreen) 
        {
            document.exitFullscreen();
        } 
        else if (document.webkitExitFullscreen) 
        { /* Safari */
            document.webkitExitFullscreen();
        } 
        else if (document.msExitFullscreen) 
        { /* IE11 */
            document.msExitFullscreen();
        }
    }
}

function Enter_FullScreen(e)
{
    if (e.key == "f")
    {
        FullscreenMode(); 
    }
}

function FullScreenZoom()
{
   if (document.fullscreenElement != null)
   {
        document.getElementById("fullscreen").style.backgroundColor = "pink";
        //document.getElementById("left_block").style.width = "70vw";
        
   }
   else
   {
        document.getElementById("fullscreen").style.backgroundColor = "lightgray";
        //document.getElementById("left_block").style.width = "50vw";
   }
}

function restartGame() 
{
    gameObj.restart();
    gameObj.updateGameArea();
}

//When fullscreen changes call my function to handle the zooming
document.addEventListener("fullscreenchange", FullScreenZoom, false);

//The magic happens here:

//Create the game.
var gameObj = new Game();

this.gameObj.updateGameArea();
//update the game window every <time_interval> miliseconds
setInterval(gameObj.updateGameArea, renderSpeed);

//if button is pressed check if you need to move the component inside the gameObject
document.onkeydown = function(e) { gameObj.move(e); } //trigger event when key is pressed down
//triggering events when button element is clicked
document.getElementById("Left").addEventListener("click", function (e) {gameObj.player.setSnakeMovementDirection_LEFT();});
document.getElementById("Right").addEventListener("click", function (e) {gameObj.player.setSnakeMovementDirection_RIGHT();});
document.getElementById("Up").addEventListener("click", function (e) {gameObj.player.setSnakeMovementDirection_UP();});
document.getElementById("Down").addEventListener("click", function (e) {gameObj.player.setSnakeMovementDirection_DOWN();});
document.getElementById("fullscreen").addEventListener("click", function (e) {FullscreenMode();});
document.getElementById("restart").addEventListener("click", function (e) {restartGame() });

//Prevent the default behaviour on this window.
window.addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);