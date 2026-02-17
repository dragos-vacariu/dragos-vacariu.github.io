var blocksClimbed = 0;
var score = 0;
var game_started = false;
const towerblockTexture = "url('toweblock_texture2.jpg')";
const platformTexture = "url('platform.jpg')"
const TableRows = 15
const TableCols = 15
var spareBlocks = 3;
const initialCombo = 3;
var combo = initialCombo;
var comboMessage = "";

const clearColor = "transparent";
const drawColor = "black";

//Table height is reversed - 15 means the lowest row whereas 0 is the uppermost row.
var block_altitude = TableRows - 1; //initialized with last row from the bottom

var msCounter = 0;
var recurrence = 100;
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

class Block
{
	constructor(cell, texture, borders)
	{
        if(!cell)
        {
            alert("The expected cell element is invalid.");
        }
        if( texture == "")
        {
            alert("The expected texture is empty");
        }
        this.cell = cell;
        this.texture = texture;
        this.row = parseInt(this.cell.dataset.row);
        this.col = parseInt(this.cell.dataset.col);
        this.borders = borders;
	}
    
    draw()
    {
        if(this.cell)
        {
            //this.cell.style.backgroundImage = this.texture;

            if(this.borders.includes("left"))
            {
                this.cell.style.borderLeftColor = drawColor;
            }
            if(this.borders.includes("right"))
            {
                this.cell.style.borderRightColor  = drawColor;
            }
            if(this.borders.includes("bottom"))
            {
                this.cell.style.borderBottomColor  = drawColor;
            }
            if(this.borders.includes("top"))
            {
                this.cell.style.borderTopColor  = drawColor;
            }
            
            this.cell.dataset.busy = "true";
        }
    }
    
    clear()
    {
        if(this.cell)
        {
            this.cell.style.borderColor = clearColor;
            this.cell.dataset.busy = "false";
        }
    }
       
    removeBorder(border)
    {
        /*find the specified border in the list of borders*/
        const index = this.borders.indexOf(border);
        
        /*if border was found*/
        if(index >= 0) 
        {
            //remove the border
            this.borders.splice(index, 1);
        }
        
        if(this.cell)
        {
            switch(border)
            {
                case "left":
                {
                    this.cell.style.borderLeftColor = clearColor;
                    break;
                }
                case "right":
                {
                    this.cell.style.borderRightColor = clearColor;
                    break;
                }
                case "top":
                {
                    this.cell.style.borderTopColor = clearColor;
                    break;
                }
                case "bottom":
                {
                    this.cell.style.borderBottomColor = clearColor;
                    break;
                }
            }
        }
    }
    
    moveLeft()
    {
        this.col--;
        let elemName = getElementIdName(this.row, this.col);
        this.cell = document.getElementById(elemName);
    }
    
    moveRight()
    {
        this.col++;
        let elemName = getElementIdName(this.row, this.col);
        this.cell = document.getElementById(elemName);
    }
    
    moveDown()
    {
        this.row++;
        let elemName = getElementIdName(this.row, this.col);
        this.cell = document.getElementById(elemName);
    }
    
    getLeftNeighbourCell()
    {
        let elemName = getElementIdName(this.row, this.col - 1);
        let cell = document.getElementById(elemName);
        return cell;
    }
    
    getRightNeighbourCell()
    {
        let elemName = getElementIdName(this.row, this.col + 1);
        let cell = document.getElementById(elemName);
        return cell;
    }
    
    getBottomNeighbourCell()
    {
        let elemName = getElementIdName(this.row + 1, this.col);
        let cell = document.getElementById(elemName);
        return cell
    }
    
    getTopNeighbourCell()
    {
        let elemName = getElementIdName(this.row - 1, this.col);
        let cell = document.getElementById(elemName);
        return cell
    }

    updateBlockBorders()
    {
        this.borders = [];
        if(this.cell)
        {
            if(this.cell.style.borderLeftColor == drawColor)
            {
                this.borders.push("left");
            }
            if(this.cell.style.borderRightColor == drawColor)
            {
                this.borders.push("right");
            }
            if(this.cell.style.borderBottomColor == drawColor)
            {
                this.borders.push("bottom");
            }
            if(this.cell.style.borderTopColor == drawColor)
            {
                this.borders.push("top");
            }
        }
    }
}

class TowerBlock
{
    /*Towerblock is built on top of Block class*/
	constructor(platform)
	{
        this.platform = platform;
        this.reachedDown = false;
        
        //Pick a random bendDirection
        var rand = Math.floor(Math.random() * 40)
        
        if( rand % 2 == 0)
        {
            this.bendDirection = "left";
        }
        else
        {
            this.bendDirection = "right";
        }

        this.isFalling = false;
		this.FormBuilder();
	}
    
    MoveBlockLeftRight()
	{
        if (this.isFalling == false)
        {
            if(this.bendDirection == "left")
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
            this.dropShape();
        }
		this.DrawShape();
	}
    
    dropShape()
    {
        if(this.reachedDown == false)
        {
			this.isFalling = true;
            this.ClearShape(); // always clear before changing values.
            
            this.bottomLeftBlock.moveDown();
            this.bottomRightBlock.moveDown();
            this.upperLeftBlock.moveDown();
            this.upperRightBlock.moveDown();

            
            //if the block is completely off the screen
            if ( this.upperLeftBlock.row >= TableRows || this.upperRightBlock.row >= TableRows)
			{
				window.spareBlocks--;
                comboMessage = ""
                document.getElementById("ComboMessage").style.opacity = "0";
                combo = initialCombo;
				this.isFalling = false;
				this.reachedDown = true;
			}
            
            this.Check_Overlapping();
        }
    }
    
    MoveBlockRight()
    {
        //check the left part to still be on the screen after moving.
        if( this.bottomRightBlock.col + 1 < TableCols)
        {
            this.ClearShape(); // always clear before changing values.
            
            this.upperLeftBlock.moveRight();
            this.upperRightBlock.moveRight();
            this.bottomLeftBlock.moveRight();
            this.bottomRightBlock.moveRight();
        }
        else
        {
            this.bendDirection = "left";
        }
    }
    
    MoveBlockLeft()
    {
        //check the left part to still be on the screen after moving.
        if( this.bottomLeftBlock.col - 1 >= 0)
        {
            this.ClearShape(); // always clear before changing values.
            
            this.upperLeftBlock.moveLeft();
            this.upperRightBlock.moveLeft();
            this.bottomLeftBlock.moveLeft();
            this.bottomRightBlock.moveLeft();
            
        }
        else
        {
            this.bendDirection = "right";
        }
    }
	
    DrawShape()
	{
        this.upperLeftBlock.draw();
        this.upperRightBlock.draw();
        this.bottomLeftBlock.draw();
        this.bottomRightBlock.draw();
	}
	
    ClearShape()
	{
		if (this.reachedDown == false)
		{
            this.upperLeftBlock.clear();
            this.upperRightBlock.clear();
            this.bottomLeftBlock.clear();
            this.bottomRightBlock.clear();
		}
	}
	
    FormBuilder()
	{
        let middleOfTable = parseInt(TableCols/2);
        
        let elemName = getElementIdName(0, middleOfTable);
        let cell = document.getElementById(elemName);
        this.upperLeftBlock = new Block(cell, towerblockTexture, ["left", "top"]);
        
        elemName = getElementIdName(0, middleOfTable + 1);
        cell = document.getElementById(elemName);
        this.upperRightBlock = new Block(cell, towerblockTexture, ["right", "top"]);
		        
        elemName = getElementIdName(1, middleOfTable);
        cell = document.getElementById(elemName);
        this.bottomLeftBlock = new Block(cell, towerblockTexture, ["left", "bottom"]);
        
        elemName = getElementIdName(1, middleOfTable + 1);
        cell = document.getElementById(elemName);
        this.bottomRightBlock = new Block(cell, towerblockTexture, ["right", "bottom"]);
	}
	
    check_collision(block, neighbour_cell)
    {
        /*Clearing borders from current element and the element underneath it*/
        if(neighbour_cell != null && neighbour_cell.dataset.busy == "true")
        {
            return true;
        }
        return false;
    }
    
    getBlockContainingCell(cell)
    {
        let neighbourBlock = this.platform.blocks.find(elem => elem.cell === cell);
        
        return neighbourBlock;
    }
    
    collapse_bottomBorders(collision, block, neighbour_cell)
    {
        /*Clearing borders from current element and the element underneath it*/
        if(collision)
        {
            let neighbour_block = this.getBlockContainingCell(neighbour_cell);
            if(neighbour_block)
            {
                neighbour_block.removeBorder("top");
                block.removeBorder("bottom");
            }
        }
    }
    
    collapse_topBorders(collision, block, neighbour_cell)
    {
        /*Clearing borders from current element and the element underneath it*/
        if(collision)
        {
            let neighbour_block = this.getBlockContainingCell(neighbour_cell);
            if(neighbour_block)
            {
                neighbour_block.removeBorder("bottom");
                block.removeBorder("top");
            }
        }
    }
    
    collapse_leftBorders(collision, block, neighbour_cell)
    {
        /*Clearing borders from current element and the element around it*/
        if(collision)
        {
            let neighbour_block = this.getBlockContainingCell(neighbour_cell);
            if(neighbour_block)
            {
                neighbour_block.removeBorder("right");
                block.removeBorder("left");
            }
        }
    }
    
    collapse_rightBorders(collision, block, neighbour_cell)
    {
        /*Clearing borders from current element and the element around it*/
        if(collision)
        {
            let neighbour_block = this.getBlockContainingCell(neighbour_cell);
            if(neighbour_block)
            {
                neighbour_block.removeBorder("left");
                block.removeBorder("right");
            }
        }
    }
    
    Check_Overlapping()
	{
		if(this.reachedDown == false)
		{
            let lastRow = TableRows - 1;
            
            //if the block is completely on the screen
			if (this.bottomLeftBlock.row < lastRow || this.bottomRightBlock.row < lastRow)
			{   
                let bottom_left_neighbor_cell = this.bottomLeftBlock.getBottomNeighbourCell();
                let bottom_right_neighbor_cell = this.bottomRightBlock.getBottomNeighbourCell();
                
                let isBottomLeftCollision = this.check_collision(this.bottomLeftBlock, bottom_left_neighbor_cell);
                let isBottomRightCollision = this.check_collision(this.bottomRightBlock, bottom_right_neighbor_cell);
                
				if(isBottomLeftCollision || isBottomRightCollision)
				{
                    let lower_left_neighbor_cell = this.bottomLeftBlock.getLeftNeighbourCell();
                    let lower_right_neighbor_cell = this.bottomRightBlock.getRightNeighbourCell();
                    
                    let upper_left_neighbor_cell = this.upperLeftBlock.getLeftNeighbourCell();
                    let upper_right_neighbor_cell = this.upperRightBlock.getRightNeighbourCell();
                    
                    let top_left_neighbor_cell = this.upperLeftBlock.getTopNeighbourCell();
                    let top_right_neighbor_cell = this.upperRightBlock.getTopNeighbourCell();
                    
                    
                    let isLeftUpperCollision = this.check_collision(this.upperLeftBlock, upper_left_neighbor_cell);
                    let isLeftBottomCollision = this.check_collision(this.bottomLeftBlock, lower_left_neighbor_cell);
                    
                    let isRightUpperCollision = this.check_collision(this.upperRightBlock, upper_right_neighbor_cell);
                    let isRightBottomCollision = this.check_collision(this.bottomRightBlock, lower_right_neighbor_cell);
                    
                    let isRightTopCollision = this.check_collision(this.upperRightBlock, top_right_neighbor_cell);
                    let isLeftTopCollision = this.check_collision(this.upperLeftBlock, top_left_neighbor_cell);
                    
                    
                    let placement_bonus = 0;
                    
                    //===================================================================
                    //Calculating the earned points based on the quality of the drop
                    
                    //if horizontal allignment
                    if( isLeftUpperCollision || isLeftBottomCollision  ||  isRightUpperCollision || isRightBottomCollision )
                    {
                        //Bonus for perfect alignment with the blocks from the left
                        window.score += combo;
                        combo = combo + initialCombo;
                        comboMessage = "Horizontal Alignment"
                        document.getElementById("ComboMessage").style.color = "red";
                        placement_bonus = 1;
                    }
                    
                    //if vertical allignment
                    if( (isBottomLeftCollision && isBottomRightCollision) || (isRightTopCollision && isLeftTopCollision) )
                    {
                        //Bonus for perfect alignment with the blocks from below
                        window.score += combo;
                        combo = combo + initialCombo;
                        comboMessage = "Vertical Alignment"
                        document.getElementById("ComboMessage").style.color = "blue";
                        placement_bonus = 1;
                    }
                    
                    //if no allignment
                    if(placement_bonus <= 0)
                    {
                        //no allignment
                        comboMessage = ""
                        document.getElementById("ComboMessage").style.opacity = "0";
                        combo = initialCombo;
                        window.score++;
                    }
                    
                    //===================================================================
                    
                    //Getting the game ready for the next iteration
                    window.blocksClimbed++; // increase the global variable 
					this.reachedDown = true;
					this.isFalling = false;
                    
                    window.block_altitude = this.upperLeftBlock.row;
                    
                    /*updating borders based on the collisions*/
                    this.collapse_bottomBorders(isBottomLeftCollision, this.bottomLeftBlock, bottom_left_neighbor_cell);
                    this.collapse_bottomBorders(isBottomRightCollision, this.bottomRightBlock, bottom_right_neighbor_cell);
                    
                    this.collapse_leftBorders(isLeftUpperCollision, this.upperLeftBlock, upper_left_neighbor_cell);
                    this.collapse_leftBorders(isLeftBottomCollision, this.bottomLeftBlock, lower_left_neighbor_cell);
                    
                    this.collapse_rightBorders(isRightUpperCollision, this.upperRightBlock, upper_right_neighbor_cell);
                    this.collapse_rightBorders(isRightBottomCollision, this.bottomRightBlock, lower_right_neighbor_cell);
				
                    this.collapse_topBorders(isLeftTopCollision, this.upperLeftBlock, top_left_neighbor_cell);
                    this.collapse_topBorders(isRightTopCollision, this.upperRightBlock, top_right_neighbor_cell);
                    
                }
			}
		}
	}
}

class Platform
{
    /*Platform is built on top of Block class and Towerblock class*/
	constructor()
	{
		this.PosX = parseInt(TableCols / 2) - 1;
		this.FormBuilder();
        this.bendDirection = "right";
        this.bendValue = 0;
        this.currentBend = parseInt(TableCols / 2);
        
        this.towerblock = new TowerBlock(this);
	}
	
    FormBuilder()
	{
		this.blocks = [];
        
        let elemName = getElementIdName(TableRows-1, this.PosX);
		this.blocks.push(new Block(document.getElementById(elemName), platformTexture, ["left", "top"]));
        
        elemName = getElementIdName(TableRows-1, this.PosX + 1);
		this.blocks.push(new Block(document.getElementById(elemName), platformTexture, ["top"]));
        
        elemName = getElementIdName(TableRows-1, this.PosX + 2);
        this.blocks.push(new Block(document.getElementById(elemName), platformTexture, ["top"]));
        
        elemName = getElementIdName(TableRows-1, this.PosX + 3);
		this.blocks.push(new Block(document.getElementById(elemName), platformTexture, ["right", "top"]));
	}
	
    DrawPlatform()
	{
        for(let index = 0; index < this.blocks.length; index++)
        {
            this.blocks[index].draw();
        }
	}
    
    bendBuildingLeft()
	{
        for(let elem of this.blocks)
        {
            elem.clear();
            elem.moveLeft();
        }
        
        //drawing the platform - only the blocks still on screen will be rendered
        this.DrawPlatform();
	}
    
    bendBuildingRight()
	{
		for(let elem of this.blocks)
        {
            elem.clear();
            elem.moveRight();
        }
        
        //drawing the platform - only the blocks still on screen will be rendered
        this.DrawPlatform();
	}
    
    checkIfTowerBlockElement(cell)
    {
        if(cell)
        {
            if (cell == this.towerblock.upperLeftBlock.cell)
            {
                return true;
            }
            else if (cell == this.towerblock.upperRightBlock.cell)
            {
                return true;
            }
            else if (cell == this.towerblock.bottomLeftBlock.cell)
            {
                return true;
            }
            else if (cell == this.towerblock.bottomRightBlock.cell)
            {
                return true;
            }
            else
            {
                return false;
            }
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
            if(this.bendDirection == "right")
            {
                if (this.currentBend <= ((parseInt(TableCols / 2)) + this.bendValue))
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
                if (this.currentBend >= ((parseInt(TableCols / 2)) - this.bendValue))
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
    
    runGame()
    {
        this.towerblock.MoveBlockLeftRight();
        
        if (this.towerblock.reachedDown == true)
        {
            /*add the towerblock to the building*/
            this.blocks.push(this.towerblock.bottomLeftBlock);
            this.blocks.push(this.towerblock.bottomRightBlock);
            this.blocks.push(this.towerblock.upperRightBlock);
            this.blocks.push(this.towerblock.upperLeftBlock);
            
            //if the building reaches near the middle of the table
            if(window.block_altitude < parseInt(TableRows / 2) + 1)
            {
                //Move the screen up with 2 rows
                this.moveScreenUp();
                this.moveScreenUp();
            }
            
            //get a new toweblock
            this.towerblock = new TowerBlock(this);
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
    
    moveScreenUp()
    {
        /*lower block_altitude means upper on the screen*/
        window.block_altitude++;
        
        let index = 0; 
        while(index < this.blocks.length)
        {
            /*Styles are stored - clearing can be triggered*/
            this.blocks[index].clear();
            this.blocks[index].moveDown();
            
            /*if the element is out of the screen*/
            if(this.blocks[index].row >= TableRows)
            {
                //remove the element using splice
                this.blocks.splice(index, 1);
                
                //next iteration shall continue with the same index
            }
            else
            {
                /*the index should be increased only when the current element is NOT REMOVED*/
                index++;
            }
        }
        
        for(let elem of this.blocks)
        {
            elem.draw();
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
                cell.style.border = "solid 2px " + clearColor;
                
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
	if(game_started == true && window.build_platform.towerblock != null)
	{
		if (e.key == " " || e.code == "Space" || e.keyCode == 32 ) //if the key pressed is SPACE KEY
		{
			window.build_platform.towerblock.dropShape()
		}
	}
}

function DropShape()
{
	if(game_started == true && window.build_platform.towerblock != null)
	{
		window.build_platform.towerblock.dropShape()
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
			document.getElementById(elemName).style.border = "solid 2px " + clearColor;
            document.getElementById(elemName).dataset.busy = "false";
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
                build_platform.runGame();
            }
            
            //Unlocking the window.setInterval
            gameTickRunning = false;
            
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
