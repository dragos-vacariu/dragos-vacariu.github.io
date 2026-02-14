var snake = [];
var SnakeDirMoving = "";
var snakeNextDirection = "";
var Fruit = null;
var score = 0;

//this will be used to increase the score;
var scoreFactor = 1;
var gameOver = false;
var gameStarted = false;
var gamePaused = false;

const FruitTexture = "url('./textures/snake_game_fruit.png')";

var snakeHeadTexture_LEFT = "url(./textures/snake_head_left.png)";
var snakeHeadTexture_RIGHT = "url(./textures/snake_head_right.png)";
var snakeHeadTexture_UP = "url(./textures/snake_head_up.png)";
var snakeHeadTexture_DOWN = "url(./textures/snake_head_down.png)";
var snakeBodyTexture = "url(./textures/snake_body.png)";

//this will be the game rendering speed -> 200 ms = around 5FPS
const gameRenderingSpeed = 10; 
let gameTickRunning = false;
var previousSnakeCell = null;
const activeAnimations = new Set();

//Snake will be the initial speed of the Snake. Initially move 2 square in 800ms
var SnakeSpeed = 400;

//this will be the maximum speed of the snake. Meaning the snake will move maximum 4 square a second
var maxSnakeSpeed = 250;

//this will count the miliseconds passed since last time snake was rendered
var renderCounterInMs = 0; 

var SnakeAccelerationFactor = 10; //this will be used to increase the value of SnakeSpeed.

const tableNumberOfRows = 12;
const tableNumberOfCols = 12;
const maximumSnakeSegments = Math.floor((tableNumberOfRows * tableNumberOfCols) / 2);

function FullscreenMode(e)
{
    const game_content = document.getElementById("game_content");
    const gameDiv = document.getElementById("game_div");
    
    if (document.fullscreenElement == null)
    {
        if (game_content.requestFullscreen) 
        {
            game_content.requestFullscreen();
            game_div.classList.add("game_div_fullscreen");
        } 
        else if (game_content.webkitRequestFullscreen) 
        { /* Safari */
            game_content.webkitRequestFullscreen();
            game_div.classList.add("game_div_fullscreen");
        } 
        else if (game_content.msRequestFullscreen) 
        { /* IE11 */
            game_content.msRequestFullscreen();
            game_div.classList.add("game_div_fullscreen");
        }
    }
    else
    {

        if (document.exitFullscreen) 
        {
            document.exitFullscreen();
            game_div.classList.remove("game_div_fullscreen");
        } 
        else if (document.webkitExitFullscreen) 
        { /* Safari */
            document.webkitExitFullscreen();
            game_div.classList.remove("game_div_fullscreen");
        } 
        else if (document.msExitFullscreen) 
        { /* IE11 */
            document.msExitFullscreen();
            game_div.classList.remove("game_div_fullscreen");
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

function getElementIdName(y, x)
{
    var xStr = "";
    var yStr = "";
    
    if (x >= 10)
    {
        xStr = x.toString();
    }
    else
    {
        xStr = "0" + x.toString();
    }
    
    if (y >= 10)
    {
        yStr = y.toString();
    }
    else
    {
        yStr = "0" + y.toString();
    }
    
    var elemName = "elem" + yStr + xStr;
    
    return elemName;
}

function createTable()
{
    var game_div = document.getElementById("game_div");
    if(game_div)
    {
        var table = document.createElement("table");
        table.id = "game_table";
        
        for(var row = 0; row < tableNumberOfRows; row++)
        {
            var table_row = document.createElement("tr");
            for(var col = 0; col < tableNumberOfCols; col++)
            {
                let cell = document.createElement("td");
                
                let cell_id = getElementIdName(row, col);
                
                cell.id = cell_id
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.dataset.available = "true";
                
                cell.onclick = function (){
                    SquareClicked(this);
                }
                
                table_row.appendChild(cell);
            }
            table.appendChild(table_row);
        }
        game_div.appendChild(table);
        
        return true;
    }
    else
    {
        alert("game_div is not part of DOM.");
        
        return false;
    }
}

function getAvailableTableCells()
{
    var game_div = document.getElementById("game_div");
    var table = game_div.querySelector("#game_table");
    var freeCells = [];
    if(table)
    {
        for(var row_index = 0; row_index < table.children.length; row_index++)
        {
            var table_row = table.children[row_index];
            
            for(var col_index = 0; col_index < table_row.children.length; col_index++)
            {
                let cell = table_row.children[col_index];
                
                if(cell.dataset.available == "true")
                {
                    freeCells.push(cell);
                }

            }
        }
    }
    else
    {
        alert("game_table is not part of DOM.");
    }
    
    return freeCells;
}

function SquareClicked(cell)
{
    if(snake.length == 0)
    {
        snake.push(cell);
        setTexture(cell, snakeHeadTexture_UP);
    }
}

function gameStart()
{
    if(snake.length == 0)
    {
        document.getElementById("result").innerHTML = "Please select a square before hitting START.";
        document.getElementById("result").style.backgroundColor =  "rgba(255,0,0,0.4)";
    }
    else
    {
        document.getElementById("result").style.backgroundColor =  "transparent";
        document.getElementById("result").text = "";
        
        document.getElementById("result").innerHTML = "";
        
        document.getElementById("startgame").id = "pausegame";
        document.getElementById("pausegame").value = "Pause";
        document.getElementById("pausegame").onclick = pauseGame;
        
        document.getElementById("restartgame").disabled = false;
        document.getElementById("turnLeft").disabled = false;
        document.getElementById("turnRight").disabled = false;
        document.getElementById("turnUp").disabled = false;
        document.getElementById("turnDown").disabled = false;
        
        checkGenerateFruit();
        
        if(Fruit)
        {
            setTexture(Fruit, FruitTexture);
            
            document.getElementById("score").innerHTML = "Score: " + score;
            gameStarted = true;
        }
        else
        {
            alert("Game could not be started. Fruit element doesn't exist.");
        }
    }
}

function pauseGame()
{
    if(gamePaused)
    {
        gamePaused = false;
        document.getElementById("pausegame").value = "Pause";
    }
    else
    {
        gamePaused = true;
        document.getElementById("pausegame").value = "Resume";
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
    if(SnakeDirMoving != "right" )
    {
        document.getElementById("turnUp").style.opacity = "0.7";
        document.getElementById("turnLeft").style.opacity = "1";
        document.getElementById("turnRight").style.opacity = "0.7";
        document.getElementById("turnDown").style.opacity = "0.7";
        
        /*queuing the next directional movement*/
        snakeNextDirection = "left";
    }
}

function setDirRight()
{
    //do this check to avoid turning 180 degrees around.
    if(SnakeDirMoving != "left" )
    {
        document.getElementById("turnUp").style.opacity = "0.7";
        document.getElementById("turnLeft").style.opacity = "0.7";
        document.getElementById("turnRight").style.opacity = "1";
        document.getElementById("turnDown").style.opacity = "0.7";
        
        /*queuing the next directional movement*/
        snakeNextDirection = "right";
    }
}

function setDirUp()
{
    //do this check to avoid turning 180 degrees around.
    if(SnakeDirMoving != "down" )
    {
        document.getElementById("turnUp").style.opacity = "1";
        document.getElementById("turnLeft").style.opacity = "0.7";
        document.getElementById("turnRight").style.opacity = "0.7";
        document.getElementById("turnDown").style.opacity = "0.7";
        
        /*queuing the next directional movement*/
        snakeNextDirection = "up";
    }
}

function setDirDown()
{
    //do this check to avoid turning 180 degrees around.
    if(SnakeDirMoving != "up")
    {
        document.getElementById("turnUp").style.opacity = "0.7";
        document.getElementById("turnLeft").style.opacity = "0.7";
        document.getElementById("turnRight").style.opacity = "0.7";
        document.getElementById("turnDown").style.opacity = "1";
        
        /*queuing the next directional movement*/
        snakeNextDirection = "down";
    }
}

async function moveSnake()
{
    //check and if needed await for this animation
    await waitForAnimation("snakeGrowingEffect");
    
    previousSnakeCell = snake[0];
    
    for(var i = 0; i < snake.length; i++)
    {       
        //if the snake head
        if( i == 0)
        {
            //clear the texture
            removeTexture(snake[i]);
            
            //get the head coordinates
            let snake_col = parseInt(snake[i].dataset.col);
            let snake_row = parseInt(snake[i].dataset.row);
                
            //move the snake
            if(SnakeDirMoving == "left")
            {
                /*if snake_head gets out of the screen*/
                if(snake_col - 1 < 0)
                {
                    /*snake_head enters back to the screen from the opposite side*/
                    let elemName = getElementIdName(snake_row, tableNumberOfCols - 1);
                    let cell = document.getElementById(elemName);
                    snake[i] = cell;
                }
                else
                {
                    let elemName = getElementIdName(snake_row, snake_col-1);
                    let cell = document.getElementById(elemName);
                    snake[i] = cell;
                }
                //draw the texture
                setTexture(snake[i], snakeHeadTexture_LEFT);
            }
            else if(SnakeDirMoving == "right")
            {
                /*if snake_head gets out of the screen*/
                if(snake_col+1 >= tableNumberOfCols)
                {
                    /*snake_head enters back to the screen from the opposite side*/
                    let elemName = getElementIdName(snake_row, 0);
                    let cell = document.getElementById(elemName);
                    snake[i] = cell;
                }
                else
                {
                    let elemName = getElementIdName(snake_row, snake_col + 1);
                    let cell = document.getElementById(elemName);
                    snake[i] = cell;
                }
                //draw the texture
                setTexture(snake[i], snakeHeadTexture_RIGHT);
            }
            else if(SnakeDirMoving == "up")
            {
                /*if snake_head gets out of the screen*/
                if(snake_row - 1 < 0)
                {
                    /*snake_head enters back to the screen from the opposite side*/
                    let elemName = getElementIdName(tableNumberOfRows-1, snake_col);
                    let cell = document.getElementById(elemName);
                    snake[i] = cell;
                }
                else
                {
                    let elemName = getElementIdName(snake_row-1, snake_col);
                    let cell = document.getElementById(elemName);
                    snake[i] = cell;
                }
                //draw the texture
                setTexture(snake[i], snakeHeadTexture_UP);
            }
            else if(SnakeDirMoving == "down")
            {
                /*if snake_head gets out of the screen*/
                if(snake_row + 1 > tableNumberOfRows-1)
                {
                    /*snake_head enters back to the screen from the opposite side*/
                    let elemName = getElementIdName(0, snake_col);
                    let cell = document.getElementById(elemName);
                    snake[i] = cell;
                }
                else
                {
                    let elemName = getElementIdName(snake_row + 1, snake_col);
                    let cell = document.getElementById(elemName);
                    snake[i] = cell;
                }
                //draw the texture
                setTexture(snake[i], snakeHeadTexture_DOWN);
            }
            
            //check for gameover
            checkSnakeCollision();
        }
        
        //do this to the snake_body
        else
        {
            //clear the texture
            removeTexture(snake[i]);
            
            //move the body
            var aux = snake[i];
            snake[i] = previousSnakeCell;
            previousSnakeCell = aux;
            
            //draw the texture
            setTexture(snake[i], snakeBodyTexture);
        }
        /*Checking if anything went wrong while moving the snake / respawning the fruit*/
        if(!snake[i])
        {
            alert("Snake cell id: " + snake[i].id + " is unavailable.");
        }
        
    }
    
    //check if fruit was eaten
    checkFruitEaten();
}

function setTexture(cell, texture)
{
    cell.style.backgroundImage = texture;
    cell.dataset.available = "false";
}

function removeTexture(cell)
{
    cell.style.backgroundImage = "";
    cell.dataset.available = "true";
}

function checkGenerateFruit()
{
    if(Fruit == null)
    {
        var availableCells = getAvailableTableCells();
        if(availableCells.length > 0)
        {
            let index = Math.floor(Math.random() * availableCells.length);
        
            Fruit = availableCells[index];
            
            //add fruit texture to the new respawned fruit
            setTexture(Fruit, FruitTexture);
            
            //add fruit animation
            Fruit.classList.add("fruitEffect");
        }
        else
        {
            console.log("Could not find any available cell.");
        }
        console.log(Fruit.id);
    }
}

function checkFruitEaten()
{
    //Checking if fruit was eaten by snake_head
    if(Fruit != null)
    {
        let fruit_row = parseInt(Fruit.dataset.row);
        let fruit_col = parseInt(Fruit.dataset.col);
        let snake_row = parseInt(snake[0].dataset.row)
        let snake_col = parseInt(snake[0].dataset.col)
        
        if(snake_row == fruit_row && snake_col == fruit_col)
        {
            score += scoreFactor;
            let scoreElement = document.getElementById("score");
            scoreElement.innerHTML = "Score: " + score;
            scheduleAnimation(scoreElement, "scoreBoard");
            
            // the fruit just been eaten.
            Fruit.classList.remove("fruitEffect");
            Fruit = null; 
            
            //increase the snake speed with every fruit eaten
            if (SnakeSpeed > maxSnakeSpeed)
            {
                SnakeSpeed -= SnakeAccelerationFactor;
                
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
            if(snake.length <= maximumSnakeSegments)
            {
                /*previousSnakeCell will have the last segment's previous position*/
                if(previousSnakeCell != null)
                {
                    snake.push(previousSnakeCell);
                    setTexture(previousSnakeCell, snakeBodyTexture);
                    
                    scheduleAnimation(previousSnakeCell, "snakeGrowingEffect");
                }
            }
            checkGenerateFruit();
        }
    }
}

function checkSnakeCollision()
{
    for(var j=0; j < snake.length; j++) //Check for Snake Collision.
    {
        /*if not the snake_head*/
        if(j != 0)
        {
            /*if snake_head collides with the snake_body*/
            if(snake[0].dataset.row == snake[j].dataset.row && snake[0].dataset.col == snake[j].dataset.col)
            {
                document.getElementById("result").innerHTML = "Game Over!";
                document.getElementById("result").style.backgroundColor = "rgba(255,0,0,0.4)";
                gameOver = true;
                gameStarted = false;
            }
        }
    }
}

function gameRestart()
{
    snake = [];
    freeCells = [];
    SnakeDirMoving = "";
    snakeNextDirection = "";
    Fruit = null;
    score = 0;
    gameOver = false;
    gameStarted = false;
    gamePaused = false;
    SnakeSpeed = 400;
    
    document.getElementById("result").innerHTML = "";
    document.getElementById("result").style.backgroundColor = "transparent";

    document.getElementById("restartgame").disabled = true;
    
    document.getElementById("pausegame").id = "startgame";
    document.getElementById("startgame").value = "Start";
    document.getElementById("startgame").onclick = gameStart;
    
    //Clear the table:
    for(var i=0; i < tableNumberOfRows; i++)
    {
        for (var j=0; j < tableNumberOfCols; j++)
        {
            let elemName = getElementIdName(i, j)
            document.getElementById(elemName).style.backgroundImage = "";
            document.getElementById(elemName).dataset.available = "true";
        }
    }
}

function scheduleAnimation(element, className)
{
    element.classList.add(className);

    let resolveFn;

    const promise = new Promise(resolve => {
        resolveFn = resolve;
    });

    const animObj = {
        promise,
        animation: className
    };

    activeAnimations.add(animObj);

    function handler()
    {
        element.classList.remove(className);
        element.removeEventListener("animationend", handler);

        // delete ONLY this animation instance
        activeAnimations.delete(animObj);

        resolveFn();
    }

    element.addEventListener("animationend", handler);

    return promise;
}

async function waitForAnimation(active_animation_name)
{
    var anim = null;
    
    activeAnimations.forEach(elem => {
        
        if (elem.animation === active_animation_name)
        {
            anim = elem;
        }
    });
    
    if (anim)
    {
        console.log("Here");
        await anim.promise;
    }
}

function relocateControls()
{
    const controls = document.getElementById("controls");
    const gameDiv = document.getElementById("game_div");
    const gameHud = document.getElementById("gameHud");
    const author = document.getElementById("author");

    if(window.innerWidth < 768)
    {
        // move into gameDiv
        if(controls.parentElement !== gameDiv)
        {
            gameDiv.appendChild(controls);
        }
    }
    else
    {
        // move back into HUD
        if(controls.parentElement !== gameHud)
        {
            gameHud.appendChild(controls);
            gameHud.insertBefore(controls, author);
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    
    if( createTable() )
    {
        relocateControls();
        
        //The main loop function:
        window.setInterval( async function()
        {
            //Creating a main loop;
            renderCounterInMs += gameRenderingSpeed;
            
            //if game is started and its time to render the snake.
            if( gameStarted == true && gameOver == false && (renderCounterInMs >= SnakeSpeed) && gamePaused == false)
            {
                /*Block the execution of the function if another function instance is in await*/
                if (gameTickRunning)
                {
                    return;   // prevents setInterval function execution stacking
                }
                
                //Locking the window.setInterval from proceeding with the execution of this function
                //during the awaits
                gameTickRunning = true;
                
                renderCounterInMs = 0;
                
                // apply queued direction ONCE per move
                if ( SnakeDirMoving != snakeNextDirection)
                {
                    SnakeDirMoving = snakeNextDirection;
                }
                
                /* if the snake is moving*/
                if ( (SnakeDirMoving === "left")  ||
                     (SnakeDirMoving === "right") ||
                     (SnakeDirMoving === "up")    ||
                     (SnakeDirMoving === "down" ) )
                {
                    await moveSnake();
                }
                
                //Unlocking the window.setInterval
                gameTickRunning = false;
            }
        }, 
        gameRenderingSpeed); //this functions is executed every SnakeSpeed mili-seconds.
    }
});

window.addEventListener("resize", relocateControls);

//When fullscreen changes call my function to handle the zooming
//document.addEventListener("fullscreenchange", FullScreenZoom, false);

//Prevent the default behaviour on this window.
window.addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);