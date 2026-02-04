var snakeSeettled=false;
var snakeHeadPos = [];
var SnakeDirMoving="";
var Fruit = "";
var score = 0;
var scoreFactor = 1; // this will be used to increase the score;
var gameOver=false;
var gameStarted = false;
const FruitTexture = "url('snake_game_fruit.png')";
const snakeHeadTexture = "url('snake_head.png')";
const snakeBodyTexture = "url('snake_body.png')";
const gameRenderingSpeed = 10; // this will be the game rendering speed -> 200 ms = around 5FPS
var SnakeSpeed = 400; //Snake will be the initial speed of the Snake. Initially move 2 square in 800ms
var maxSnakeSpeed = 250; //this will be the maximum speed of the snake. Meaning the snake will move maximum 4 square a second
var renderCounterInMs = 0; // this will count the miliseconds passed since last time snake was rendered
var SnakeAccelerationFactor = 10; //this will be used to increase the value of SnakeSpeed.

function FullscreenMode(e) {
    var game_content = document.getElementById("game_content");
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
        document.getElementById("fullscreen_button").style.backgroundColor = "pink";
        //document.getElementById("game_div").style.width = "55vw";
   }
   else
   {
        document.getElementById("fullscreen_button").style.backgroundColor = "#eeeeee";
        //document.getElementById("game_div").style.width = "45vw";
   }
}

function SquareClicked(x)
{
    if(snakeSeettled==false)
    {
        document.getElementById(x).style.borderColor="red";
        snakeHeadPos.push(x);
        snakeSeettled = true;
    }
}

function gameStart()
{
    if(snakeSeettled==false)
    {
        document.getElementById("result").style.backgroundColor =  "rgba(255,0,0,0.4)";
    }
    else
    {
        document.getElementById("result").style.backgroundColor =  "rgba(0,0,255,0.2)";
        document.getElementById("result").text = "";
        for(var i = 0 ; i<snakeHeadPos.length; i++) //Only the snake head is available in snakeHeadPos currently
        {
            document.getElementById(snakeHeadPos[i]).style.backgroundImage = snakeHeadTexture;
            document.getElementById(snakeHeadPos[i]).style.borderColor="black";
        }
        document.getElementById("result").innerHTML = "";
        document.getElementById("startgame").disabled = true;
        document.getElementById("restartgame").disabled = false;
        document.getElementById("turnLeft").disabled = false;
        document.getElementById("turnRight").disabled = false;
        document.getElementById("turnUp").disabled = false;
        document.getElementById("turnDown").disabled = false;
        var fruitX = Math.floor(Math.random() * 8);
        var fruitY = Math.floor(Math.random() * 8);
        Fruit = "elem" + fruitX + fruitY;
        document.getElementById(Fruit).style.backgroundImage = FruitTexture;
        document.getElementById("score").innerHTML = "Score: " + score;
        gameStarted = true;
    }
}

document.onkeydown = function (e) //trigger event when key is pressed down
{
    switch (e.key) //if the key pressed is SPACE KEY
    {
        case "ArrowLeft":
        case "A":
        case "a":
        {
            setDirLeft();
            break;
        }
        case "ArrowRight":
        case "D": 
        case "d":
        {
            setDirRight();
            break;
        }
        case "ArrowUp": 
        case "W": 
        case "w":
        {
            setDirUp();
            break;
        }
        case "ArrowDown": 
        case "S": 
        case "s":
        {
            setDirDown();
            break;
        }
        default:
        {
            break;
        }
    }
}

function setDirLeft()
{
    //do this check to avoid turning 180 degrees around.
    if(SnakeDirMoving!="right" )
    {
        document.getElementById("turnUp").style.backgroundColor = "white";
        document.getElementById("turnLeft").style.backgroundColor = "rgba(200,200,200,1.0)";
        document.getElementById("turnRight").style.backgroundColor = "white";
        document.getElementById("turnDown").style.backgroundColor = "white";
        SnakeDirMoving="left";
    }
}

function setDirRight()
{
    //do this check to avoid turning 180 degrees around.
    if(SnakeDirMoving!="left" )
    {
        document.getElementById("turnUp").style.backgroundColor = "white";
        document.getElementById("turnLeft").style.backgroundColor = "white";
        document.getElementById("turnRight").style.backgroundColor = "rgba(200,200,200,1.0)";
        document.getElementById("turnDown").style.backgroundColor = "white";
        SnakeDirMoving="right";
    }
}

function setDirUp()
{
    //do this check to avoid turning 180 degrees around.
    if(SnakeDirMoving!="down" )
    {
        document.getElementById("turnUp").style.backgroundColor = "rgba(200,200,200,1.0)";
        document.getElementById("turnLeft").style.backgroundColor = "white";
        document.getElementById("turnRight").style.backgroundColor = "white";
        document.getElementById("turnDown").style.backgroundColor = "white";
        SnakeDirMoving="up";
    }
}

function setDirDown()
{
    //do this check to avoid turning 180 degrees around.
    if(SnakeDirMoving!="up")
    {
        document.getElementById("turnUp").style.backgroundColor = "white";
        document.getElementById("turnLeft").style.backgroundColor = "white";
        document.getElementById("turnRight").style.backgroundColor = "white";
        document.getElementById("turnDown").style.backgroundColor = "rgba(200,200,200,1.0)";
        SnakeDirMoving="down";
    }
}

//The main loop function:
window.setInterval(function(){
    //Creating a main loop;
    renderCounterInMs += gameRenderingSpeed;
    //if game is started and its time to render the snake.
    if(gameStarted == true && gameOver == false && (renderCounterInMs >= SnakeSpeed) )
    {
        renderCounterInMs=0;
        if(SnakeDirMoving=="left")
        {
            for(var i = 0 ; i<snakeHeadPos.length; i++)
            {
                document.getElementById(snakeHeadPos[i]).style.backgroundImage="";
                var buffer; //this variable will store the previous position of the head in order to pass it to the body.
                if(i==0)
                {
                    buffer = snakeHeadPos[i];
                    if(parseInt(snakeHeadPos[i][5])-1 < 0)
                    {
                        snakeHeadPos[i] = "elem" + snakeHeadPos[i][4] + "7";
                    }
                    else
                    {
                        snakeHeadPos[i]    = "elem" + snakeHeadPos[i][4] + (parseInt(snakeHeadPos[i][5])-1);
                    }
                    document.getElementById(snakeHeadPos[i]).style.backgroundImage=snakeHeadTexture; //let this be drawed before checking gameover
                    checkSnakeCollision();
                }
                else
                {
                    var aux = snakeHeadPos[i];
                    snakeHeadPos[i] = buffer;
                    buffer = aux;
                    document.getElementById(snakeHeadPos[i]).style.backgroundImage=snakeBodyTexture;
                }
                
            }
        }
        else if(SnakeDirMoving=="right")
        {
            for(var i = 0 ; i<snakeHeadPos.length; i++)
            {
                document.getElementById(snakeHeadPos[i]).style.backgroundImage=""; //remove the texture
                var buffer; //this variable will store the previous position of the head in order to pass it to the body.
                if(i==0)
                {
                    buffer = snakeHeadPos[i];
                    if(parseInt(snakeHeadPos[i][5])+1 > 7)
                    {
                        snakeHeadPos[i] = "elem" + snakeHeadPos[i][4] + "0";
                    }
                    else
                    {
                        snakeHeadPos[i] = "elem" + snakeHeadPos[i][4] + (parseInt(snakeHeadPos[i][5])+1);
                    }
                    document.getElementById(snakeHeadPos[i]).style.backgroundImage=snakeHeadTexture; //let this be drawed before checking gameover
                    checkSnakeCollision();
                }
                else
                {
                    var aux = snakeHeadPos[i];
                    snakeHeadPos[i] = buffer;
                    buffer = aux;
                    document.getElementById(snakeHeadPos[i]).style.backgroundImage=snakeBodyTexture;
                }
            }
        }
        else if(SnakeDirMoving=="up")
        {
            for(var i = 0 ; i<snakeHeadPos.length; i++)
            {
                document.getElementById(snakeHeadPos[i]).style.backgroundImage="";
                var buffer; //this variable will store the previous position of the head in order to pass it to the body.
                if(i==0)
                {
                    buffer = snakeHeadPos[i];
                    if(parseInt(snakeHeadPos[i][4])-1 < 0)
                    {
                        snakeHeadPos[i] = "elem" + "7" + snakeHeadPos[i][5];
                    }
                    else
                    {
                        snakeHeadPos[i] = "elem" + (parseInt(snakeHeadPos[i][4])-1) + snakeHeadPos[i][5];
                    }
                    document.getElementById(snakeHeadPos[i]).style.backgroundImage=snakeHeadTexture; //let this be drawed before checking gameover
                    checkSnakeCollision();
                }
                else
                {
                    var aux = snakeHeadPos[i];
                    snakeHeadPos[i] = buffer;
                    buffer = aux;
                    document.getElementById(snakeHeadPos[i]).style.backgroundImage=snakeBodyTexture;
                }
            }
        }
        else if(SnakeDirMoving=="down")
        {
            for(var i = 0 ; i<snakeHeadPos.length; i++)
            {
                document.getElementById(snakeHeadPos[i]).style.backgroundImage="";
                var buffer; //this variable will store the previous position of the head in order to pass it to the body.
                if(i==0)
                {
                    buffer = snakeHeadPos[i];
                    if(parseInt(snakeHeadPos[i][4])+1 > 7)
                    {
                        snakeHeadPos[i] = "elem" + "0" + snakeHeadPos[i][5];
                    }
                    else
                    {
                        snakeHeadPos[i] = "elem" + (parseInt(snakeHeadPos[i][4])+1) + snakeHeadPos[i][5];
                    }
                    document.getElementById(snakeHeadPos[i]).style.backgroundImage=snakeHeadTexture; //let this be drawed before checking gameover
                    checkSnakeCollision();
                }
                else
                {
                    var aux = snakeHeadPos[i];
                    snakeHeadPos[i] = buffer;
                    buffer = aux;
                    document.getElementById(snakeHeadPos[i]).style.backgroundImage=snakeBodyTexture;
                }
            }
        }
        if(snakeHeadPos.length>0)
        {
            for(var i=0; i<snakeHeadPos.length; i++)
            {
                if(snakeHeadPos[i][4] == Fruit[4] && snakeHeadPos[i][5] == Fruit[5]) //the head of the snake is at index [0]
                {
                    //document.getElementById(Fruit).style.backgroundImage = ""; //remove fruit texture from the table is not necessary as the loop drawing the snake will handle this.
                    score+=scoreFactor;
                    document.getElementById("score").innerHTML = "Score: " + score;
                    Fruit=""; // the fruit just been eaten.
                    
                    //increase the snake speed with every fruit eaten
                    if (SnakeSpeed > maxSnakeSpeed)
                    {
                        SnakeSpeed-=SnakeAccelerationFactor;
                        //Increase the score factor each time the Snake speed gets increased by 50 ms
                        if((SnakeSpeed - maxSnakeSpeed) / SnakeAccelerationFactor % 5 == 0)
                        {
                            scoreFactor++;
                        }
                    }
                    /*
                      Grow the snake tail by one element if the size of the snake is less than 25
                      Else we will keep the snake at 25 this means we will always have at least 64-25 
                      free square to move through
                    */
                    if(snakeHeadPos.length <= 25)
                    {
                        var lastTailY = parseInt(snakeHeadPos[snakeHeadPos.length-1][4]);
                        var lastTailX = parseInt(snakeHeadPos[snakeHeadPos.length-1][5]);
                        if(SnakeDirMoving == "down")
                        {
                            if(lastTailY-1 >=0)
                            {
                                lastTailY-=1;
                                snakeHeadPos.push("elem" + lastTailY + lastTailX);
                            }
                            else
                            {
                                snakeHeadPos.push("elem" + "7" + lastTailX);
                            }
                        }
                        else if (SnakeDirMoving == "up")
                        {
                            if(lastTailY+1 < 8)
                            {
                                lastTailY+=1;
                                snakeHeadPos.push("elem" + lastTailY + lastTailX);
                            }
                            else
                            {
                                snakeHeadPos.push("elem" + "0" + lastTailX);
                            }
                        }
                        else if (SnakeDirMoving == "left")
                        {
                            if(lastTailX+1 < 8)
                            {
                                lastTailX+=1;
                                snakeHeadPos.push("elem" + lastTailY + lastTailX);
                            }
                            else
                            {
                                snakeHeadPos.push("elem" + lastTailY +  "7" );
                            }
                        }
                        else if (SnakeDirMoving == "right")
                        {
                            if(lastTailX-1 >= 0)
                            {
                                lastTailX-=1;
                                snakeHeadPos.push("elem" + lastTailY + lastTailX);
                            }
                            else
                            {
                                snakeHeadPos.push("elem" + lastTailY + "0");
                            }
                        }
                    }
                }
            }
            if (Fruit =="")
            {
                fruitX = Math.floor(Math.random() * 8);
                fruitY = Math.floor(Math.random() * 8);
                //Make sure the fruit gets respawned on a free square.
                var counter = 0;
                Fruit = "elem" + fruitY + fruitX;
                while(true)
                {
                    var freeRandomSquareGenerated = true;
                    var index = 0;
                    
                    for(index = 0; index < snakeHeadPos.length; index++) 
                    {
                        if(String(Fruit).toLowerCase() == String(snakeHeadPos[index]).toLowerCase())
                        {
                            freeRandomSquareGenerated = false;
                            //break the loop - we need to peform the check from the beggining;
                            break;
                        }
                    }
                    //if the loop ended because of the value stored in index and not because of the break.
                    if(freeRandomSquareGenerated==false)
                    {
                            fruitX = Math.floor(Math.random() * 8);
                            fruitY = Math.floor(Math.random() * 8);
                            Fruit = "elem" + fruitY + fruitX;
                    }
                    else
                    {
                        //the generated square is free
                        break;
                    }
                    counter++;
                }
				document.getElementById(Fruit).style.backgroundImage = FruitTexture; //add fruit texture to the new respawned fruit
			}
		}
	}
}, gameRenderingSpeed); //this functions is executed every SnakeSpeed mili-seconds.

function checkSnakeCollision()
{
	for(var j=0;j<snakeHeadPos.length; j++) //Check for Snake Collision.
	{
		if(j!=0)
		{
			if(snakeHeadPos[0][5] == snakeHeadPos[j][5] && snakeHeadPos[0][4] == snakeHeadPos[j][4])
			{
				document.getElementById("result").innerHTML = "Game Over!";
				document.getElementById("result").style.backgroundColor = "rgba(255,0,0,0.4)";
				gameOver=true;
                gameStarted = false;
			}
		}
	}
}

function gameRestart()
{
	snakeSeettled=false;
	snakeHeadPos = [];
	SnakeDirMoving="";
	Fruit = "";
	score = 0;
	gameOver=false;
    gameStarted = false;
	document.getElementById("result").innerHTML = "";
    document.getElementById("result").style.backgroundColor = "rgba(0,0,255,0.2)";
	document.getElementById("startgame").disabled = false;
	document.getElementById("restartgame").disabled = true;
	//Clear the table:
	for(var i=0;i<8; i++)
	{
		for (var j=0;j<8;j++)
		{
			document.getElementById("elem" + i + j).style.backgroundImage="";
		}
	}
}

//When fullscreen changes call my function to handle the zooming
document.addEventListener("fullscreenchange", FullScreenZoom, false);

//Prevent the default behaviour on this window.
window.addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);