var blocksClimbed = 0;
var score = 0;
var game_started = false;
const blockSquareTexture = "url('brick.jpg')";
const platformTexture = "url('platform.jpg')"
const TableRows = 15
const TableCols = 15
var spareBlocks = 3;
const initialCombo = 3;
var combo = initialCombo;
var comboMessage = "";
var blockDone = false;

var msCounter = 0;
var recurrence = 100;
var block;
var build_platform;

const scoreAnimation = [
  {color: "black"},
  {color: "green"},
];

const scoreAnimationTiming = {
  duration: 1000,
  iterations: 1,
};

const comboMessageAnimation = [
  {opacity: "0"},
  {opacity: "1"},
];

const comboMessageAnimationTiming = {
  duration: 1000,
  iterations: 1,
};

function FullscreenMode(e)
{
    var game_content = document.getElementById("game_content");
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

/*
class Form
{
	constructor(cells, texture)
	{
        if(cells.length && cells.length > 0)
        {
            let cellsValid = true;
            for(let index = 0; index < cells.length; index++)
            {
                if(cells[index] == null)
                {
                    alert("The expected cell element at index: " + index + " - is null.");
                    cellsValid = false;
                    break;
                }
            }
            if (cellsValid)
            {
                this.cells = cells;
            }
        }
        else
        {
            alert("The expected cell elements list is empty or invalid.");
        }
        
	}
    draw()
    {
        for(let elem in this.cells)
        {
            elem.style.backgroundImage = this.texture;
            elem.dataset.available = "false";
        }
    }
    
    clear()
    {
        for(let elem in this.cells)
        {
            elem.style.backgroundImage = "";
            elem.dataset.available = "true";
        }
    }
}
*/

class Platform
{
	constructor()
	{
		this.PosX = parseInt(TableCols / 2) - 1;
		this.FormBuilder();
        this.bendDirection = "right";
        this.bendValue = 0;
        this.currentBend = parseInt(TableCols / 2);
        
	}
	
    FormBuilder()
	{
		this.Coords=[[]]; //clear the form.
		this.Coords[0] = [TableRows-1, this.PosX];   
		this.Coords.push([TableRows-1, this.PosX+1]);
		this.Coords.push([TableRows-1, this.PosX+2]);
		this.Coords.push([TableRows-1, this.PosX+3]);
	}
	
    DrawPlatform()
	{
        let elemName = getElementIdName(this.Coords[0][0], this.Coords[0][1]);
        document.getElementById(elemName).style.backgroundImage = platformTexture;
        
        elemName = getElementIdName(this.Coords[1][0], this.Coords[1][1]);
        document.getElementById(elemName).style.backgroundImage = platformTexture;

        elemName = getElementIdName(this.Coords[2][0], this.Coords[2][1]);        
        document.getElementById(elemName).style.backgroundImage = platformTexture;
        
        elemName = getElementIdName(this.Coords[3][0], this.Coords[3][1]);   
        document.getElementById(elemName).style.backgroundImage = platformTexture;
	}
    
    bendBuildingLeft()
	{
		var offset = 1;
		for(var i = TableRows - 1; i >= 0; i--)
		{
			for(var j = 0; j < TableCols; j++)
			{
                if (this.checkIfCoordsTakenByBlock(i,j) == false && this.checkIfCoordsTakenByBlock(i,j+offset) == false && block.dropping == false)
                {
                    if (j + offset < TableCols)
                    {
                        let leftElementName = getElementIdName(i, j);
                        let rightElementName = getElementIdName(i, j + offset);
                        
                        let leftCell = document.getElementById(leftElementName);
                        let rightCell = document.getElementById(rightElementName);
                        console.log ("Rightcell " + rightElementName)
                        console.log ("Leftcell " + leftElementName)
                        leftCell.style.backgroundImage = rightCell.style.backgroundImage;
                    }
                    else
                    {
                        let elementName = getElementIdName(i, j);
                        document.getElementById(elementName).style.backgroundImage = "";
                    }
                }
			}
		}
	}
    
    bendBuildingRight()
	{
		var offset = 1;
		for(var i = TableRows - 1; i >= 0; i--)
		{
			for(var j = TableCols - 1; j >= 0; j--)
			{
                if (this.checkIfCoordsTakenByBlock(i,j) == false && this.checkIfCoordsTakenByBlock(i,j-offset) == false && block.dropping == false)
                {
                    if (j - offset >= 0)
                    {
                        let leftElementName = getElementIdName(i, j-offset);
                        let rightElementName = getElementIdName(i, j);
                        
                        let leftCell = document.getElementById(leftElementName);
                        let rightCell = document.getElementById(rightElementName);
                        
                        rightCell.style.backgroundImage = leftCell.style.backgroundImage;
                    }
                    else
                    {
                        let elementName = getElementIdName(i, j);
                        document.getElementById(elementName).style.backgroundImage = "";
                    }
                }
			}
		}
	}
    
    checkIfCoordsTakenByBlock(row, column){
        if ( (row == block.Coords[0][0] && column == block.Coords[0][1]) || (row == block.Coords[1][0] && column == block.Coords[1][1] ) ||
             (row == block.Coords[2][0] && column == block.Coords[2][1]) || (row == block.Coords[3][0] && column == block.Coords[3][1] ) )
         {
             return true;
         }
         else
         {
             return false;
         }
    }
    
    MoveBuildingLeftRight()
	{
        if (window.blocksClimbed >= 10 && window.blocksClimbed < 20)
        {
            this.bendValue = 1;
        }
        else if (window.blocksClimbed >= 20 && window.blocksClimbed < 30)
        {
            this.bendValue = 2;
        }
        else if (window.blocksClimbed >= 30 && window.blocksClimbed < 40)
        {
            this.bendValue = 3;
        }
        else if (window.blocksClimbed >= 40)
        {
            this.bendValue = 4;
        }
        if(this.bendValue > 0)
        {
            if(this.bendDirection=="right")
            {
                if (this.currentBend <= ((parseInt(TableCols/2)) + this.bendValue))
                {
                    this.bendBuildingRight();
                    this.currentBend++;
                }
                else
                {
                    this.bendDirection = "left"
                }
            }
            else
            {
                if (this.currentBend >= ((parseInt(TableCols/2)) - this.bendValue))
                {
                    this.bendBuildingLeft();
                    this.currentBend--;
                }
                else
                {
                    this.bendDirection = "right"
                }
            }
        }
	}
}

class TowerBlock
{
	constructor(name, x, y)
	{
		window.blockDone = false;
		this.blockHeight = 15; // Height is reversed - 15 means the lowest row whereas 0 is the uppermost row.
		this.reachedDown = false;
		this.bend = "left";
        this.dropping = false;
		this.FormBuilder();
	}
    
    MoveBlockLeftRight()
	{
        if (this.dropping == false)
        {
            if(this.bend == "left")
            {
                this.MoveBlockLeft();
            }
            else
            {
                this.MoveBlockRight();
            }
        }
        else
        {
            this.dropBlock();
        }
		this.DrawBlock();
	}
    
    dropBlock()
    {
        if(this.reachedDown == false)
        {
			this.dropping = true;
            this.ClearShape(); // always clear before changing values.
            this.Coords[0][0]++;
            this.Coords[1][0]++;
            this.Coords[2][0]++;
            this.Coords[3][0]++;
			if ( this.Coords[0][0] >= TableRows )
			{
				window.spareBlocks--;
                comboMessage = ""
                document.getElementById("ComboMessage").style.opacity = "0";
                combo = initialCombo;
				this.dropping = false;
				this.reachedDown = true;
				window.blockDone = true;
			}
            
        }
    }
    
    MoveBlockRight()
    {
        if(this.Coords[1][1] + 1 < TableCols)
        {
            this.ClearShape(); // always clear before changing values.
            this.Coords[0][1]++;
            this.Coords[1][1]++;
            this.Coords[2][1]++;
            this.Coords[3][1]++;
            
        }
        else
        {
            this.bend = "left";
        }
    }
    
    MoveBlockLeft()
    {
        if(this.Coords[2][1] - 1 >= 0) //check the left part to still be on the screen after moving.
        {
            this.ClearShape(); // always clear before changing values.
            this.Coords[0][1]--;
            this.Coords[1][1]--;
            this.Coords[2][1]--;
            this.Coords[3][1]--;
        }
        else
        {
            this.bend = "right";
        }
    }
	
    DrawBlock()
	{
        if (this.Coords[0][0] < TableRows && this.Coords[2][0] < TableRows)
		{
            let elemName = getElementIdName(this.Coords[0][0], this.Coords[0][1]);
            document.getElementById(elemName).style.backgroundImage = blockSquareTexture;
            
            elemName = getElementIdName(this.Coords[1][0], this.Coords[1][1]);
            document.getElementById(elemName).style.backgroundImage = blockSquareTexture;

            elemName = getElementIdName(this.Coords[2][0], this.Coords[2][1]);		
            document.getElementById(elemName).style.backgroundImage = blockSquareTexture;
            
            elemName = getElementIdName(this.Coords[3][0], this.Coords[3][1]);
            document.getElementById(elemName).style.backgroundImage = blockSquareTexture;
        }
		else if (this.Coords[0][0] < TableRows)
		{
            let elemName = getElementIdName(this.Coords[0][0], this.Coords[0][1]);
			document.getElementById(elemName).style.backgroundImage = blockSquareTexture;
            
            elemName = getElementIdName(this.Coords[1][0], this.Coords[1][1]);
			document.getElementById(elemName).style.backgroundImage = blockSquareTexture;	
		}
		this.CheckOverlap()
	}
	
    ClearShape()
	{
		if (window.blockDone == false)
		{
            if (this.Coords[0][0] < TableRows && this.Coords[2][0] < TableRows )
			{
                let elemName = getElementIdName(this.Coords[0][0], this.Coords[0][1]);
                document.getElementById(elemName).style.backgroundImage = "";
                
                elemName = getElementIdName(this.Coords[1][0], this.Coords[1][1]);
                document.getElementById(elemName).style.backgroundImage = "";

                elemName = getElementIdName(this.Coords[2][0], this.Coords[2][1]);		
                document.getElementById(elemName).style.backgroundImage = "";
                
                elemName = getElementIdName(this.Coords[3][0], this.Coords[3][1]);
                document.getElementById(elemName).style.backgroundImage = "";
            }
			else if (this.Coords[0][0] < TableRows)
			{
                let elemName = getElementIdName(this.Coords[0][0], this.Coords[0][1]);
                document.getElementById(elemName).style.backgroundImage = "";
                
                elemName = getElementIdName(this.Coords[1][0], this.Coords[1][1]);
                document.getElementById(elemName).style.backgroundImage = "";	
			}
		}
	}
	
    FormBuilder()
	{
		this.Coords=[[]]; //clear the form.
		this.Coords[0] = [0,7];   //Upper part
		this.Coords.push([0,8]); //Right part;
		this.Coords.push([1,7]); //left part;
		this.Coords.push([1,8]); //bottom part
	}
	
    CheckOverlap()
	{
		if(this.reachedDown == false)
		{
			if (this.Coords[2][0] < TableRows - 1)
			{
                console.log(getElementIdName(this.Coords[3][0] + 1,  this.Coords[3][1]) );
				if(  (document.getElementById( getElementIdName(this.Coords[3][0] + 1,  this.Coords[3][1]) ).style.backgroundImage != "") ||
					 (document.getElementById( getElementIdName(this.Coords[2][0] + 1,  this.Coords[2][1] ) ).style.backgroundImage != "")  )
				{
                    //Calculating the earned points based on the quality of the drop
                    if( (document.getElementById( getElementIdName(this.Coords[2][0], this.Coords[2][1] - 1) ) != null) && 
                        (document.getElementById( getElementIdName(this.Coords[2][0], this.Coords[2][1] - 1) ).style.backgroundImage != "") )
                    {
                        //Bonus for perfect alignment with the blocks from the left
                        window.score += combo;
                        combo = combo + initialCombo;
                        comboMessage = "Horizontal Alignment"
                        document.getElementById("ComboMessage").style.color = "red";
                    }
                    else if( (document.getElementById(getElementIdName(this.Coords[1][0], this.Coords[1][1] + 1)) != null) && 
                           ( document.getElementById(getElementIdName(this.Coords[1][0], this.Coords[1][1] + 1)).style.backgroundImage != "") )
                    {
                        //Bonus for perfect alignment with the blocks from the right
                        window.score+=combo;
                        combo = combo + initialCombo;
                        comboMessage = "Horizontal Alignment"
                        document.getElementById("ComboMessage").style.color = "red";
                    }
                    else if( (document.getElementById(getElementIdName(this.Coords[3][0] + 1, this.Coords[3][1])) != null) && 
                             (document.getElementById(getElementIdName(this.Coords[2][0] + 1, this.Coords[2][1])) != null) && 
                             (document.getElementById(getElementIdName(this.Coords[3][0] + 1, this.Coords[3][1])).style.backgroundImage != "") && 
                             (document.getElementById(getElementIdName(this.Coords[2][0] + 1, this.Coords[2][1])).style.backgroundImage != "")
                           )
                    {
                        //Bonus for perfect alignment with the blocks from below
                        window.score+=combo;
                        combo = combo + initialCombo;
                        comboMessage = "Vertical Alignment"
                        document.getElementById("ComboMessage").style.color = "blue";
                    }
                    else
                    {
                        //no allignment
                        comboMessage = ""
                        document.getElementById("ComboMessage").style.opacity = "0";
                        combo = initialCombo;
                        window.score++;
                    }
                    
                    //Getting the game ready for the next iteration
                    window.blocksClimbed++; // increase the global variable 
					this.reachedDown = true;
					this.dropping = false;
					window.blockDone = true;
					if (this.blockHeight > this.Coords[0][0])
					{
						this.blockHeight = this.Coords[0][0];
						
                        if (this.blockHeight < 8)
						{
							this.moveScreenUpper();
							this.moveScreenUpper();
						}
					}
				}
			}
		}
	}
	
    moveScreenUpper()
	{
		var offset = 1;
		this.blockHeight--;
		for(var i = TableRows - 1; i > this.blockHeight; i--)
		{
			for(var j = 0; j < TableCols; j++)
			{
                var bottomElementName = getElementIdName(i-offset, j);
                var upperElementName = getElementIdName(i, j);
				
                var upperCell = document.getElementById(upperElementName); 
                var lowerCell = document.getElementById(bottomElementName);

                upperCell.style.backgroundImage = lowerCell.style.backgroundImage;
			}
		}
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
        
        for(var row = 0; row < TableRows; row++)
        {
            var table_row = document.createElement("tr");
            for(var col = 0; col < TableCols; col++)
            {
                let cell = document.createElement("td");
                
                let cell_id = getElementIdName(row, col);
                
                cell.id = cell_id
                cell.dataset.row = row;
                cell.dataset.col = col;
                
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

function StartGame()
{
	window.block = new TowerBlock();
	window.build_platform = new Platform();
    window.score = 0;
    window.combo = initialCombo;
    window.comboMessage = "";
	window.msCounter = 0;
	window.blocksClimbed = 0;
	window.spareBlocks = 3;
	window.game_started = true;
	updateBlocksClimbed();
	updateSpareBlocks();
	build_platform.DrawPlatform();
	document.getElementById("startgame").disabled = true;
    document.getElementById("gameStatus").classList.remove("game_over");
	document.getElementById("gameStatus").innerHTML = "Press SPACE KEY or DROP BLOCK button to drop the block.";
	document.getElementById("restartgame").disabled = false;
	document.getElementById("drop_block").disabled = false;
}

document.onkeydown = function (e) //trigger event when key is pressed down
{
	if(game_started == true && block != null)
	{
		if (e.key == " " || e.code == "Space" || e.keyCode == 32 ) //if the key pressed is SPACE KEY
		{
			block.dropBlock()
		}
	}
}

function DropBlock()
{
	if(game_started == true && block != null)
	{
		block.dropBlock()
	}
}

function RestartGame()
{
    //Clear the table
	for(var i = 0; i < TableRows; i++)
	{
		for(var j = 0; j < TableCols; j++)
		{
            let elemName = getElementIdName(i, j);
			document.getElementById(elemName).style.backgroundImage = "";
		}
	}
	
    StartGame();
}

function numberToString(n)
{
    return n > 9 ? "" + n: "0" + n;
}

function updateBlocksClimbed()
{
	document.getElementById("blocksClimbed").innerHTML = "BLOCKS DROPPED: " + window.blocksClimbed;
    if(window.combo > initialCombo)
    {
        //window.combo-initialCombo will give the value of the last combo, not the value of next combo
        document.getElementById("ComboMessage").innerHTML = comboMessage;
        document.getElementById("ComboMessage").animate(comboMessageAnimation, comboMessageAnimationTiming);
        document.getElementById("score").innerHTML = "COMBO: X" + (window.combo-initialCombo) + "  SCORE: " + window.score;
        document.getElementById("score").animate(scoreAnimation, scoreAnimationTiming);
    }
    else
    {
        document.getElementById("score").innerHTML = "SCORE: " + window.score;
    }
}

function updateSpareBlocks()
{
	document.getElementById("spareBlocks").innerHTML = "SPARES: " + window.spareBlocks;
}

document.addEventListener('DOMContentLoaded', async () => {
    
    if( createTable() )
    {
        relocateControls();
        
        setInterval( function() 
        {
            if(game_started)
            {
                window.msCounter += window.recurrence;
                if (window.msCounter % 400 == 0) // enter here every 400 ms
                {
                     build_platform.MoveBuildingLeftRight();
                }
                block.MoveBlockLeftRight();

                if (blockDone == true)
                {
                    block = new TowerBlock();
                    if (spareBlocks == 0)
                    {
                            document.getElementById("gameStatus").classList.add("game_over");
                            document.getElementById("gameStatus").innerHTML = "GAME OVER. No blocks to spare. You cannot finish the tower.";
                            game_started = false;
                    }
                    updateBlocksClimbed();
                    updateSpareBlocks();
                }
            }
        }, recurrence);
    }
});

function relocateControls()
{
    const controls = document.getElementById("controls");
    const gameDiv = document.getElementById("game_div");
    const gameHud = document.getElementById("gameHud");
    const author = document.getElementById("author");
    const gameStatus = document.getElementById("gameStatus");
    const messageArea = document.getElementById("message_area");

    if(window.innerWidth < 768)
    {
        // move into gameDiv
        if(controls.parentElement !== gameDiv)
        {
            gameDiv.appendChild(gameStatus);
            gameDiv.appendChild(controls);
            messageArea.appendChild(author);
        }
    }
    else
    {
        // move back into HUD
        if(controls.parentElement !== gameHud)
        {
            messageArea.insertBefore(gameStatus, messageArea.firstChild);
            gameHud.appendChild(author);
            gameHud.insertBefore(controls, author);
        }
    }
}

window.addEventListener("resize", relocateControls);

//Prevent the default behaviour on this window.
window.addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);
