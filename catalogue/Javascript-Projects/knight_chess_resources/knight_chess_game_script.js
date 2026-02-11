const knightChess = "url('knight_chess.png')"
var pieceCell = null;
var validOptions = [];
var score = 0;
var gameOver = 2; // 0 for game lost, 1 for game won, 2 for init.

const black_cellColor = "black";
const white_cellColor = "white";
const black_visitedCellColor = "darkgreen";
const white_visitedCellColor = "lightgreen";
const visitedCellBorderColor = "black";
const regularCellBorderColor = "green";

function createTable()
{
    var game_div = document.getElementById("game_div");
    
    if(game_div)
    {
        var table = document.createElement("table");
        
        for(var row = 0; row < 8; row++)
        {
            var table_row = document.createElement("tr");
            for(var col = 0; col < 8; col++)
            {
                let cell = document.createElement("td");
                
                let cell_id = getElementIdName(row, col);
                
                cell.id = cell_id
                cell.dataset.visited = "false";
                cell.onclick = function () {
                    SquareClicked(cell)
                };
                
                if(row % 2 == 0)
                {
                    if(col % 2 == 0)
                    {
                        cell.style.backgroundColor = white_cellColor;
                    }
                    else
                    {
                        cell.style.backgroundColor = black_cellColor;
                    }
                }
                else if( row % 2 == 1)
                {
                    if(col % 2 == 0)
                    {
                        cell.style.backgroundColor = black_cellColor;
                    }
                    else
                    {
                        cell.style.backgroundColor = white_cellColor;
                    }
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

function FullscreenMode(e)
{
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

function getElementIdName(y, x)
{
    var xStr = x.toString();
    var yStr = y.toString();
    
    var elemName = "elem" + yStr + xStr;
    
    return elemName;
}

/*
function FullScreenZoom()
{
   if (document.fullscreenElement != null)
   {
        //document.getElementById("fullscreen_button").style.fontStyle = "italic";
   }
   else
   {
        //document.getElementById("fullscreen_button").style.fontStyle = "normal";
   }
}*/

function SquareClicked(cell)
{
    if(pieceCell == null)
    {
        let resultElement = document.getElementById("result");
        resultElement.innerHTML = "";
        resultElement.color = "white";
        
        cell.style.backgroundImage = knightChess;
        
        pieceCell = cell;
        
        //validOptions will get filled here
        SearchOptions(); //searching for valid move options
        
        //displaying the valid move options
        displayMoveOption();
    }
    else 
    {
        let scoreElement = document.getElementById("score");
        
        for(var i=0; i < validOptions.length; i++)
        {
            /*If the clicked cell is a valid move option*/
            if(cell == validOptions[i])
            {
                cell.style.backgroundImage = knightChess;
                score++;
                
                scoreElement.innerHTML = "Score: " + score + " out of 64.";
                
                /*clearing the visual effects*/
                if(cell.classList.contains("td_pulse_red")) 
                {
                    cell.style.backgroundColor = black_cellColor;
                    cell.classList.remove("td_pulse_red");
                }
                else if (cell.classList.contains("td_pulse_pink"))
                {
                    cell.style.backgroundColor = white_cellColor;
                    cell.classList.remove("td_pulse_pink");
                }
                
                /*if cell that was clicked is not the pieceCell*/
                if (cell != pieceCell)
                {
                    /*clear the pieceCell and mark it as visited*/
                    pieceCell.style.backgroundImage = "";
                    
                    if(pieceCell.style.backgroundColor == white_cellColor)
                    {
                        pieceCell.style.backgroundColor = white_visitedCellColor;
                        pieceCell.style.borderColor = visitedCellBorderColor;
                        pieceCell.dataset.visited = "true";
                        pieceCell.classList.remove("td_pulse_pink");
                    }
                    else if(pieceCell.style.backgroundColor == black_cellColor)
                    {
                        pieceCell.style.backgroundColor = black_visitedCellColor;
                        pieceCell.style.borderColor = visitedCellBorderColor;
                        pieceCell.dataset.visited = "true";
                        pieceCell.classList.remove("td_pulse_red");
                    }
                }
                pieceCell = cell;

            }
            else
            {
               
                if(validOptions[i].classList.contains("td_pulse_pink"))
                {
                    validOptions[i].style.backgroundColor = white_cellColor;
                    validOptions[i].classList.remove("td_pulse_pink");
                }
                else if(validOptions[i].classList.contains("td_pulse_red"))
                {
                    validOptions[i].style.backgroundColor = black_cellColor;
                    validOptions[i].classList.remove("td_pulse_red");
                }
            }
        }
        
        validOptions = [];
        SearchOptions(); //validOptions will get filled here
        displayMoveOption();
        
        if(validOptions.length == 0)
        {
            getGameOverStatus();
        }
        if(score >= 10 && score < 20)
        {
            scoreElement.style.color = "lightgray"; //bronze color
        }
        else if(score >= 20 && score < 30)
        {
            scoreElement.style.color = "yellow"; //yellow color;
        }
        else if(score >= 30 && score < 45)
        {
            scoreElement.style.color = "azure";
        }
        else if(score >= 45 && score < 60)
        {
            scoreElement.style.color = "lightblue";
        }
        else if(score >= 60)
        {
            scoreElement.style.color = "lightgreen";
        }
    }
}

function displayMoveOption()
{
    validOptions.forEach(cell => 
    {
        if(cell.style.backgroundColor == white_cellColor)
        {
            cell.classList.add("td_pulse_pink");
        }
        else if(cell.style.backgroundColor == black_cellColor)
        {        
            cell.classList.add("td_pulse_red");
        }
    });
}

function hideValidOptions()
{
    validOptions.forEach(cell => 
    {
        if(cell.classList.contains("td_pulse_pink"))
        {
            cell.classList.remove("td_pulse_pink");
        }
        else if(cell.classList.contains("td_pulse_red"))
        {        
            cell.classList.remove("td_pulse_red");
        }
    });
}

function SearchOptions()
{
    //extracting the coordinate from the pieceCell.id
    var knight_row = parseInt(pieceCell.id[4]); //elem00
    var knight_col = parseInt(pieceCell.id[5]); //elem00

    
    const knightOffsets = [
      [ 2,  1],  
      //knight_row + 2  and knight_col + 1 can be a valid move
      [ 2, -1],
      //knight_row + 2  and knight_col - 1 can be a valid move
      [ 1,  2], 
      //knight_row + 1  and knight_col + 2 can be a valid move
      [-1,  2],
      //knight_row - 1  and knight_col + 2 can be a valid move
      [ 1, -2],
      //knight_row + 1  and knight_col - 2 can be a valid move      
      [-1, -2],
      //knight_row - 1  and knight_col - 2 can be a valid move
      [-2,  1],
      //knight_row - 2  and knight_col + 1 can be a valid move
      [-2, -1]
      //knight_row - 2  and knight_col - 1 can be a valid move
    ];

    for(let item of knightOffsets)
    {
        let move_row = knight_row + item[0];
        let move_col = knight_col + item[1];
        
        let cell_id = getElementIdName(move_row, move_col);
        let cell = document.getElementById(cell_id);
        
        /*if the cell exists and was not visited*/
        if(cell && cell.dataset.visited === "false")
        {
            validOptions.push(cell);
        }
    }
}

function getGameOverStatus()
{
    let resultElement =  document.getElementById("result");
    
    /*Checking for game over or game's end.*/
    for(let i =0; i<8; i++)
    {
        for(let j=0; j<8; j++)
        {
            let elemName = getElementIdName(i, j);
            let cell = document.getElementById(elemName);
            
            /*if there are still cells that were not visited*/
            if(cell.dataset.visited === "false")
            {
                resultElement.innerHTML = "Game Over. You failed to conquer the checkerboard.";
                resultElement.style.color = "red";
                
                gameOver = 0;
                break;
            }
        }
    }
    if(gameOver != 0)
    {
        resultElement.innerHTML = "Congratulations. You have conquered the checkerboard.";
        resultElement.style.color = "green";
    }
}

function gameRestart()
{
    hideValidOptions();
    pieceCell = null
    validOptions = [];
    score = 0;
    gameOver = 2; // 0 for game lost, 1 for game won, 2 for init.
    
    
    let scoreElement =  document.getElementById("score");
    scoreElement.innerHTML = "Score: ";
    scoreElement.style.color = "white";
    
    let resultElement =  document.getElementById("result");
    resultElement.innerHTML = "Choose a square in order to begin.";
    resultElement.style.color = "lightgreen";
    
    /*Clearing the chessboard table*/
    for(var i =0; i<8; i++)
    {
        for(var j=0;j<8; j++)
        {
            let elemName = getElementIdName(i, j);
            
            let cell = document.getElementById(elemName);
            
            if(cell.style.backgroundColor == white_visitedCellColor)
            {
                cell.style.backgroundColor = white_cellColor;
            }
            else if(cell.style.backgroundColor == black_visitedCellColor)
            {
                cell.style.backgroundColor = black_cellColor;
            }
            cell.style.backgroundImage = "";
            cell.style.borderColor = regularCellBorderColor;
            cell.dataset.visited = "false";
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    createTable();
});

//When fullscreen changes call my function to handle the zooming
//document.addEventListener("fullscreenchange", FullScreenZoom, false);