var snake = [];
var SnakeDirMoving = "";
var snakeNextDirection = "";
var Fruit = null;
var score = 0;
var fruitsEaten = 0;

const positiveMessageColor = "rgba(200,255,200,1)";
const negativeMessageColor = "rgba(255,200,200,1)";
const neutralMessageColor = "rgba(220,220,255,1)";

//this will be used to increase the score;
var scoreFactor = 1;
var gameOver = false;
var gameStarted = false;
var gamePaused = false;

const FruitTexture = "url('./textures/fruit/snake_game_fruit.png')";

const SnakeHeadAnimation = {
    direction: "down", /*the default snake head orientation*/
    frameIndex: 0,
    frameStep: 1,      // 1 forward, -1 backward
    frameDelay: 2000,   /*time between frames*/
};

function updateSnakeHeadAnimation(deltaTime)
{
    if (!snake.length)
    {
        return;
    }
    
    /*
        snakeTextureMap.head is an object. 
    
        snakeTextureMap.head[SnakeHeadAnimation.direction] will return one of: 
            snakeTextureMap.head.down
            snakeTextureMap.head.up
            snakeTextureMap.head.right
            snakeTextureMap.head.left
            ...
        
        or whatever value SnakeHeadAnimation.direction is that's a valid element within snakeTextureMap.head
    */
    
    const frames = snakeTextureMap.head[SnakeHeadAnimation.direction];
    
    if (!Array.isArray(frames))
    {
        return;
    }
    
    SnakeHeadAnimation.counter += deltaTime;
    
    /*if time between frames has no elapsed*/
    if (SnakeHeadAnimation.counter < SnakeHeadAnimation.frameDelay)
    {
        return;
    }
    
    /*time between frames has elapsed - its time to draw a new frame*/
    SnakeHeadAnimation.counter = 0;

    SnakeHeadAnimation.frameIndex += SnakeHeadAnimation.frameStep;

    //if reached the last frame
    if (SnakeHeadAnimation.frameIndex >= frames.length - 1)
    {
        SnakeHeadAnimation.frameIndex = frames.length - 1;
        
        /*change the direction - play the animation backwards*/
        SnakeHeadAnimation.frameStep = -1;
    }
    /*if reached the first frame*/
    else if (SnakeHeadAnimation.frameIndex <= 0)
    {
        SnakeHeadAnimation.frameIndex = 0;
        
        /*change the direction - play the animation forwards*/
        SnakeHeadAnimation.frameStep = 1;
    }
    
    /*Render the texture*/
    setTexture(snake[0], frames[SnakeHeadAnimation.frameIndex])
}

const snakeTextureMap = {
    head: {
        left: [
            "url(./textures/head/head_left_anim/snake_head_left_0.png)",
            "url(./textures/head/head_left_anim/snake_head_left_1.png)",
            "url(./textures/head/head_left_anim/snake_head_left_2.png)",
            "url(./textures/head/head_left_anim/snake_head_left_3.png)",
            "url(./textures/head/head_left_anim/snake_head_left_4.png)",
            "url(./textures/head/head_left_anim/snake_head_left_5.png)",
            "url(./textures/head/head_left_anim/snake_head_left_6.png)",
        ],
        right: [
            "url(./textures/head/head_right_anim/snake_head_right_0.png)",
            "url(./textures/head/head_right_anim/snake_head_right_1.png)",
            "url(./textures/head/head_right_anim/snake_head_right_2.png)",
            "url(./textures/head/head_right_anim/snake_head_right_3.png)",
            "url(./textures/head/head_right_anim/snake_head_right_4.png)",
            "url(./textures/head/head_right_anim/snake_head_right_5.png)",
            "url(./textures/head/head_right_anim/snake_head_right_6.png)",
        ],
        up: [
            "url(./textures/head/head_up_anim/snake_head_up_0.png)",
            "url(./textures/head/head_up_anim/snake_head_up_1.png)",
            "url(./textures/head/head_up_anim/snake_head_up_2.png)",
            "url(./textures/head/head_up_anim/snake_head_up_3.png)",
            "url(./textures/head/head_up_anim/snake_head_up_4.png)",
            "url(./textures/head/head_up_anim/snake_head_up_5.png)",
            "url(./textures/head/head_up_anim/snake_head_up_6.png)",
        ],
        down: [
            "url(./textures/head/head_down_anim/snake_head_down_0.png)",
            "url(./textures/head/head_down_anim/snake_head_down_1.png)",
            "url(./textures/head/head_down_anim/snake_head_down_2.png)",
            "url(./textures/head/head_down_anim/snake_head_down_3.png)",
            "url(./textures/head/head_down_anim/snake_head_down_4.png)",
            "url(./textures/head/head_down_anim/snake_head_down_5.png)",
            "url(./textures/head/head_down_anim/snake_head_down_6.png)",
        ],
    },
    body: {
        vertical: "url(./textures/body/snake_body_vertical.png)",
        horizontal: "url(./textures/body/snake_body_horizontal.png)",
    },
    body_bend:
    {
        top_left: "url(./textures/body/snake_body_bend_top_left.png)",
        top_right: "url(./textures/body/snake_body_bend_top_right.png)",
        bottom_left: "url(./textures/body/snake_body_bend_bottom_left.png)",
        bottom_right: "url(./textures/body/snake_body_bend_bottom_right.png)",
    },
    tail:
    {
        left: "url(./textures/tail/snake_tail_left.png)",
        right: "url(./textures/tail/snake_tail_right.png)",
        up: "url(./textures/tail/snake_tail_up.png)",
        down: "url(./textures/tail/snake_tail_down.png)",
    },
    tail_bend:
    {
        going_from_up_to_right: "url(./textures/tail/snake_tail_going_up_right.png)",
        going_from_up_to_left:  "url(./textures/tail/snake_tail_going_up_left.png)",
        going_from_down_to_right:  "url(./textures/tail/snake_tail_going_bottom_right.png)",
        going_from_down_to_left:  "url(./textures/tail/snake_tail_going_bottom_left.png)",
        going_from_right_to_up:  "url(./textures/tail/snake_tail_going_right_up.png)",
        going_from_right_to_down:  "url(./textures/tail/snake_tail_going_right_bottom.png)",
        going_from_left_to_up:  "url(./textures/tail/snake_tail_going_left_up.png)",
        going_from_left_to_down:  "url(./textures/tail/snake_tail_going_left_bottom.png)",
    },
}

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
        
        let resultElem = document.getElementById("result");
        resultElem.style.maxHeight = "7.3rem"; 
        resultElem.style.minHeight = "7.3rem"; 
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
        
        let resultElem = document.getElementById("result");
        resultElem.style.maxHeight = "4.1rem"; 
        resultElem.style.minHeight = "4.1rem"; 
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
                
                window.CellBorder = window.getComputedStyle(cell);
                
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

function getValidNeighborCell(cell)
{
    const col = parseInt(cell.dataset.col);
    const row = parseInt(cell.dataset.row);

    const directions = [
        { dist_col: 0, dist_row: -1, direction: "up" }, // up
        { dist_col: 0, dist_row: 1, direction: "down"  },  // down
        { dist_col: -1, dist_row: 0, direction: "left"  }, // left
        { dist_col: 1, dist_row: 0, direction: "right"  }   // right
    ];

    for (let item of directions)
    {
        const newCol = col + item.dist_col;
        const newRow = row + item.dist_row;
        
        let elemName = getElementIdName(newRow, newCol)
        
        let neigh_cell = document.getElementById(elemName);

        if (neigh_cell)
        {
            return {cell: neigh_cell, direction: item.direction};
        }
    }

    return null; // should never happen unless board is 1x1
}

function SquareClicked(cell)
{
    if(snake.length == 0)
    {
        let tail_cell_object = getValidNeighborCell(cell);

        if (tail_cell_object)
        {
            snake.push(cell);
            snake.push(tail_cell_object.cell);
            
            switch(tail_cell_object.direction)
            {
                /*the direction is from the perspective of the tail,
                so the head is always facing the opposite direction*/
                case "up":
                {
                    setDirDown();
                    setTexture(cell, snakeTextureMap.head.down);
                    setTexture(tail_cell_object.cell, snakeTextureMap.tail.up);
                    break;
                }
                case "left":
                {
                    setDirRight();
                    setTexture(cell, snakeTextureMap.head.right);
                    setTexture(tail_cell_object.cell, snakeTextureMap.tail.left);
                    break;
                }
                case "right":
                {
                    setDirLeft();
                    setTexture(cell, snakeTextureMap.head.left);
                    setTexture(tail_cell_object.cell, snakeTextureMap.tail.right);
                    break;
                }
                case "down":
                {
                    setDirUp();
                    setTexture(cell, snakeTextureMap.head.up);
                    setTexture(tail_cell_object.cell, snakeTextureMap.tail.down);
                    break;
                }
                default :
                {
                    //Should never come here
                    setTexture(cell, snakeTextureMap.head.down);
                    setTexture(tail_cell_object.cell, snakeTextureMap.tail.up);
                    break;
                }
            }
        }
        else
        {
            /*if no neighboring cell is available... draw only the head*/
            snake.push(cell);
            let texture = getHeadTexture();
            setTexture(cell, texture);
        }
        
        gameStart();
        pauseGame();
        document.getElementById("pausegame").value = "Start"; // Change the label from Resume to Start
    }
}

function gameStart()
{
    if(snake.length == 0)
    {
        writeResult("Please select a square before hitting START.", negativeMessageColor);
    }
    else
    {        
        writeResult("Game Started", positiveMessageColor);
        
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
        writeResult("Game resumed.", positiveMessageColor);
    }
    else
    {
        gamePaused = true;
        document.getElementById("pausegame").value = "Resume";
        writeResult("Game paused.", neutralMessageColor);
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
        case "Space":
        case " ":
        {
            pauseGame();
            break;
        }
        default:
        {
            break;
        }
    }
}

function clearInputActiveStyles()
{
    window.inputButtons.left.classList.remove("activeInput");
    window.inputButtons.right.classList.remove("activeInput");
    window.inputButtons.up.classList.remove("activeInput");
    window.inputButtons.down.classList.remove("activeInput");
}

function setDirLeft()
{
    //do this check to avoid turning 180 degrees around.
    if(SnakeDirMoving != "right" )
    {
        clearInputActiveStyles();
        
        window.inputButtons.left.classList.add("activeInput");
        
        /*queuing the next directional movement*/
        snakeNextDirection = "left";
    }
}

function setDirRight()
{
    //do this check to avoid turning 180 degrees around.
    if(SnakeDirMoving != "left" )
    {
        clearInputActiveStyles();
        
        window.inputButtons.right.classList.add("activeInput");
        
        /*queuing the next directional movement*/
        snakeNextDirection = "right";
    }
}

function setDirUp()
{
    //do this check to avoid turning 180 degrees around.
    if(SnakeDirMoving != "down" )
    {
        clearInputActiveStyles();
        
        window.inputButtons.up.classList.add("activeInput");
        
        /*queuing the next directional movement*/
        snakeNextDirection = "up";
    }
}

function setDirDown()
{
    //do this check to avoid turning 180 degrees around.
    if(SnakeDirMoving != "up")
    {
        clearInputActiveStyles();
        
        window.inputButtons.down.classList.add("activeInput");
        
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
            }
            
            //clear the texture
            removeTexture(previousSnakeCell);
        
            //draw the texture
            let texture = getHeadTexture();
            setTexture(snake[i], texture);
            
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
            
            //if not the last snake segment
            if(i < snake.length - 1)
            {
                //texture the snake body
                let direction = getDirectionalMovement(snake[i-1], snake[i], previousSnakeCell);
                
                let texture = getBodyTextureBasedOnDirectionalMovement(direction);
                
                setTexture(snake[i], texture);
            }
            else
            {
                //texture the snake tail
                let direction = getDirectionalMovement(snake[i-1], snake[i], previousSnakeCell);
                let texture = getTailTextureBasedOnDirectionalMovement(direction);
                
                setTexture(snake[i], texture);
            }
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

function getHeadTexture(direction = SnakeDirMoving)
{
    switch (direction)
    {
        case "up":
        {
            SnakeHeadAnimation.direction = "up";
            return snakeTextureMap.head.up[SnakeHeadAnimation.frameIndex];
        }
        case "down":
        {
            SnakeHeadAnimation.direction = "down";
            return snakeTextureMap.head.down[SnakeHeadAnimation.frameIndex];
        }
        case "left":
        {
            SnakeHeadAnimation.direction = "left";
            return snakeTextureMap.head.left[SnakeHeadAnimation.frameIndex];
        }
        case "right":
        {
            SnakeHeadAnimation.direction = "right";
            return snakeTextureMap.head.right[SnakeHeadAnimation.frameIndex];
        }
        default:
        {
            /*should enter here only if the direction is not set*/
            SnakeHeadAnimation.direction = "down";
            return snakeTextureMap.head.down[SnakeHeadAnimation.frameIndex];
        }
    }
}

function checkDirectionVerticallyStraight(cell_ahead, current_cell, cell_behind)
{ 
    let ahead_col = parseInt(cell_ahead.dataset.col);
    let ahead_row = parseInt(cell_ahead.dataset.row);
    
    let current_col = parseInt(current_cell.dataset.col);
    let current_row = parseInt(current_cell.dataset.row);
    
    let behind_col = parseInt(cell_behind.dataset.col);
    let behind_row = parseInt(cell_behind.dataset.row);
    
    if(ahead_col === behind_col)
    {
        /*Snake is going vertically - straight*/
        if(ahead_row > current_row)
        {
            return "down-to-up";
        }
        
        else if(ahead_row < current_row)
        {
            return "up-to-down";
        }
        
        /*Edge cases - passing through wall - already handled above.*/
    }
    
    return null;
}

function checkDirectionHorizontallyStraight(cell_ahead, current_cell, cell_behind)
{
    let ahead_col = parseInt(cell_ahead.dataset.col);
    let ahead_row = parseInt(cell_ahead.dataset.row);
    
    let current_col = parseInt(current_cell.dataset.col);
    let current_row = parseInt(current_cell.dataset.row);
    
    let behind_col = parseInt(cell_behind.dataset.col);
    let behind_row = parseInt(cell_behind.dataset.row);
    
    if(ahead_row === behind_row)
    {
        /*Snake is going horizontally straight*/
        
        if(ahead_col > current_col)
        {
            return "left-to-right";
        }
        
        else if (ahead_col < current_col)
        {
            return "right-to-left";
        }
        /*Edge cases - passing through wall - already handled above.*/
    }
    
    return null;
}

function checkFromUpToHorizontalMovement(cell_ahead, current_cell, cell_behind)
{
    let ahead_col = parseInt(cell_ahead.dataset.col);
    let ahead_row = parseInt(cell_ahead.dataset.row);
    
    let current_col = parseInt(current_cell.dataset.col);
    let current_row = parseInt(current_cell.dataset.row);
    
    let behind_col = parseInt(cell_behind.dataset.col);
    let behind_row = parseInt(cell_behind.dataset.row);
    
    /*if the direction turns to horizontal movement*/
    if(ahead_row === current_row)
    {
        /*Row 0 is at the top of the table*/
        
        /*if direction was UP or PASSING through the TOP wall*/
        if(current_row - behind_row == -1 || current_row - behind_row > 1)
        {
            /*IF direction from UP turns RIGHT even if PASSING through right wall*/
            if(ahead_col - current_col == 1 || ahead_col - current_col < -1)
            {
                /*direction turns from UP to RIGHT*/
                return "up-to-right";
            }
            /*IF direction turns from UP to LEFT even if PASSING through left wall*/
            else if (ahead_col - current_col == -1 || ahead_col - current_col > 1)
            {
                /*direction turns from UP to LEFT*/
                return "up-to-left";
            }
        }
    }
    return null;
}

function checkFromDownToHorizontalMovement(cell_ahead, current_cell, cell_behind)
{
    let ahead_col = parseInt(cell_ahead.dataset.col);
    let ahead_row = parseInt(cell_ahead.dataset.row);
    
    let current_col = parseInt(current_cell.dataset.col);
    let current_row = parseInt(current_cell.dataset.row);
    
    let behind_col = parseInt(cell_behind.dataset.col);
    let behind_row = parseInt(cell_behind.dataset.row);
    
    if(ahead_row === current_row)
    {
        /*Row 0 is at the top of the table*/
        
        /*if direction was DOWN or PASSING through the BOTTOM wall*/
        if(current_row - behind_row == 1 || current_row - behind_row < -1)
        {
            /*direction is DOWN*/
            
            /*if direction turns from DOWN to RIGHT even if PASSING through right wall*/
            if(ahead_col - current_col == 1 || ahead_col - current_col < -1)
            {
                /*direction is bottom-right*/
                return "down-to-right";
            }
            
            /*if direction turns from DOWN to LEFT even if PASSING through left wall*/
            else if (ahead_col - current_col == -1 || ahead_col - current_col > 1)
            {
                /*direction is bottom-left*/
                return "down-to-left";
            }
        }
    }
    return null;
}

function checkFromHorizontalToUpMovement(cell_ahead, current_cell, cell_behind)
{
    let ahead_col = parseInt(cell_ahead.dataset.col);
    let ahead_row = parseInt(cell_ahead.dataset.row);
    
    let current_col = parseInt(current_cell.dataset.col);
    let current_row = parseInt(current_cell.dataset.row);
    
    let behind_col = parseInt(cell_behind.dataset.col);
    let behind_row = parseInt(cell_behind.dataset.row);
    
    /*else the direction turns to vertical movement*/
    if(ahead_row !== current_row)
    {
        /*if direction is UP or PASSING through TOP wall*/
        if(ahead_row - current_row == -1 || ahead_row - current_row > 1)
        {
            /*if direction turns from RIGHT to UP even if PASSING through RIGHT wall*/
            if(current_col - behind_col == 1 || current_col - behind_col < -1)
            {
                /*direction is right-up*/
                return "right-to-up";
            }
            /*if direction turns from LEFT to UP even if PASSING through LEFT wall*/
            else if(current_col - behind_col == -1 || current_col - behind_col > 1)
            {
                /*direction is left-up*/
                
                return "left-to-up";
            }

        }
    }
    return null;
}

function checkFromHorizontalToDownMovement(cell_ahead, current_cell, cell_behind)
{
    let ahead_col = parseInt(cell_ahead.dataset.col);
    let ahead_row = parseInt(cell_ahead.dataset.row);
    
    let current_col = parseInt(current_cell.dataset.col);
    let current_row = parseInt(current_cell.dataset.row);
    
    let behind_col = parseInt(cell_behind.dataset.col);
    let behind_row = parseInt(cell_behind.dataset.row);
    
    /*else the direction turns to vertical movement*/
    if(ahead_row !== current_row)
    {
        /*if direction is DOWN or PASSING through BOTTOM wall*/
        if(ahead_row - current_row == 1 || ahead_row - current_row < -1)
        {
            /*direction is DOWN*/
            
            /*IF direction turns from RIGHT to DOWN whether PASSING or NOT through RIGHT wall*/
            if(current_col - behind_col == 1 || current_col - behind_col < -1)
            {
                /*direction is right-bottom*/
                return "right-to-down";
            }
            /*IF direction turns from LEFT to DOWN whether PASSING or NOT through LEFT wall*/
            else if (current_col - behind_col == -1 || current_col - behind_col > 1)
            {
                /*direction is left-bottom*/
                return "left-to-down";
            }
        }
    }
    return null;
}

function getDirectionalMovement(cell_ahead, current_cell, cell_behind)
{   
    /*====================================================*/
    /*START: Checking for straight movement directions*/
    let direction = checkDirectionVerticallyStraight(cell_ahead, current_cell, cell_behind);
    
    if(direction != null)
    {
        return direction;
    }
    
    direction = checkDirectionHorizontallyStraight(cell_ahead, current_cell, cell_behind);
    
    if(direction != null)
    {
        return direction;
    }
    /*END: Checking for straight movement directions*/
    /*====================================================*/
    

    /*====================================================*/
    /*START: Checking for turning from VERTICAL to HORIZONTAL movement directions*/
    direction = checkFromUpToHorizontalMovement(cell_ahead, current_cell, cell_behind);
    
    if(direction != null)
    {
        return direction;
    }
    
    direction = checkFromDownToHorizontalMovement(cell_ahead, current_cell, cell_behind);
    
    if(direction != null)
    {
        return direction;
    }
    /*END: Checking for turning from VERTICAL to HORIZONTAL movement directions*/
    /*====================================================*/

    /*====================================================*/
    /*START: Checking for turning from HORIZONTAL to VERTICAL movement directions*/
    direction = checkFromHorizontalToUpMovement(cell_ahead, current_cell, cell_behind)
    
    if(direction != null)
    {
        return direction;
    }
    
    direction = checkFromHorizontalToDownMovement(cell_ahead, current_cell, cell_behind)
    
    if(direction != null)
    {
        return direction;
    }
    /*END: Checking for turning from HORIZONTAL to VERTICAL movement directions*/  
    /*====================================================*/
}

function getTailTextureBasedOnDirectionalMovement(direction)
{
    switch(direction)
    {
        case "down-to-up":
        {
            return snakeTextureMap.tail.up;
        }
        case "up-to-down":
        {
            return snakeTextureMap.tail.down;
        }
        case "left-to-right":
        {
            return snakeTextureMap.tail.left;
        }
        case "right-to-left":
        {
            return snakeTextureMap.tail.right;
        }
        case "up-to-right":
        {
            return snakeTextureMap.tail_bend.going_from_up_to_right;
        }
        case "up-to-left":
        {
            return snakeTextureMap.tail_bend.going_from_up_to_left;
        }
        case "down-to-right":
        {
            return snakeTextureMap.tail_bend.going_from_down_to_right;
        }
        case "down-to-left":
        {
            return snakeTextureMap.tail_bend.going_from_down_to_left;
        }
        case "right-to-up":
        {
            return snakeTextureMap.tail_bend.going_from_right_to_up;
        }
        case "right-to-down":
        {
            return snakeTextureMap.tail_bend.going_from_right_to_down;
        }
        case "left-to-up":
        {
            return snakeTextureMap.tail_bend.going_from_left_to_up;
        }
        case "left-to-down":
        {
            return snakeTextureMap.tail_bend.going_from_left_to_bottom;
        }
        default:
        {
            console.warn("Could not determine snake tail texture. Snake direction = " + direction);
            return null;
        }
    }
}

function getBodyTextureBasedOnDirectionalMovement(direction)
{
    switch(direction)
    {
        case "down-to-up":
        {
            return snakeTextureMap.body.vertical;
        }
        case "up-to-down":
        {
            return snakeTextureMap.body.vertical;
        }
        case "left-to-right":
        {
            return snakeTextureMap.body.horizontal;
        }
        case "right-to-left":
        {
            return snakeTextureMap.body.horizontal;
        }
        case "up-to-right":
        {
            return snakeTextureMap.body_bend.top_right;
        }
        case "left-to-down":
        {
            return snakeTextureMap.body_bend.top_right;
        }
        case "up-to-left":
        {
            return snakeTextureMap.body_bend.top_left;
        }
        case "right-to-down":
        {
            return snakeTextureMap.body_bend.top_left;
        }
        case "down-to-right":
        {
            return snakeTextureMap.body_bend.bottom_right;
        }
        case "left-to-up":
        {
            return snakeTextureMap.body_bend.bottom_right;
        }
        case "down-to-left":
        {
            return snakeTextureMap.body_bend.bottom_left;
        }
        case "right-to-up":
        {
            return snakeTextureMap.body_bend.bottom_left;
        }
        default:
        {
            console.warn("Could not determine snake body texture. Snake direction = " + direction);
            return null;
        }
    }
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
    cell.classList.remove("fruitEffect");
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
            console.warn("Could not find any available cell.");
        }
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
            
            fruitsEaten ++;
            let message = ""
            if(snake.length <= maximumSnakeSegments)
            {
                /*previousSnakeCell will have the last segment's previous position*/
                if(previousSnakeCell != null)
                {
                    let previous_index = snake.length - 1;
                    snake.push(previousSnakeCell);
                }
            }
            else
            {
                message += "max length";
            }
            checkGenerateFruit();
            
            message = "Fruits Eaten: " + fruitsEaten + " | Length: " + snake.length + " " + message +
                      "Next Fruit at: " + Fruit.dataset.row + "x" + Fruit.dataset.col;
            
            writeResult(message, neutralMessageColor);
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
                writeResult("Game Over! You collided with yourself.", negativeMessageColor);
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
    
    writeResult("");

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
            document.getElementById(elemName).classList.remove("fruitEffect");
        }
    }
}

function writeResult(result_text, color = positiveMessageColor)
{
    const resultHUD_Element = document.getElementById("result");

    // Create message element
    const message = document.createElement("div");
    message.textContent = result_text;
    message.style.color = color;
    message.style.width = "100%";

    //Add slight spacing between messages
    message.style.margin = "1px";
    
    //Append message
    resultHUD_Element.appendChild(message);

    //Auto-scroll to latest message
    resultHUD_Element.scrollTop = resultHUD_Element.scrollHeight;

    //Animate newest message
    scheduleAnimation(message, "newOutputInfo");
    
    //Add separator
    if(resultHUD_Element.children.length > 1)
    {
        const lastChild = resultHUD_Element.lastElementChild;
        lastChild.style.borderTop = "solid 1px " + color;
    }
    
    // Limit total stored messages to 50)
    const maxMessages = 50;
    if (resultHUD_Element.children.length > maxMessages)
    {
        resultHUD_Element.removeChild(resultHUD_Element.firstChild);
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
        /*Adding input buttons to this element*/
        const inputButtons = {
            up: document.getElementById("turnUp"),
            left: document.getElementById("turnLeft"),
            right: document.getElementById("turnRight"),
            down: document.getElementById("turnDown"),
        }
        window.inputButtons = inputButtons;
        
        writeResult("Please select a square before hitting START.");
        relocateControls();
        
        //The main loop function:
        window.setInterval( async function()
        {
            //Creating a main loop;
            renderCounterInMs += gameRenderingSpeed;
            
            // if game is started, not paused, and not gameOver
            if ( gameStarted == true && gameOver == false && gamePaused == false)
            {
                /*Animate the snake if the time between frames has elapsed*/
                updateSnakeHeadAnimation(gameRenderingSpeed);
    
                //if time to move the snake.
                if( renderCounterInMs >= SnakeSpeed )
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