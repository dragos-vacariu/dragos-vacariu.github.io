const gameCanvas = document.getElementById("game_canvas");
const gameContext = gameCanvas.getContext("2d");
//gameContext.scale(1,1);

// Make it square and responsive
const size = 640; // canvas size will be 640x640 px
gameCanvas.width = size;
gameCanvas.height = size;

/*
gameCanvas.width and gameCanvas.height set the internal pixel resolution of the canvas.
This determines how many pixels the canvas actually “has” to draw on.
So here, your canvas has 640 × 640 actual pixels, independent of how big it appears on the page.

The width and height attributes on the <canvas> element control the drawing buffer size, not the CSS layout.
If you just do CSS width: 100% without setting the internal canvas.width, your canvas will stretch the drawing, 
making it blurry or misaligned.

So setting size = 640 ensures you have a fixed drawing grid of 640 × 640 pixels.

*/

//colors for the messages that will be displayed in the HTML result element
const positiveMessageColor = "rgba(200,255,200,1)";
const negativeMessageColor = "rgba(255,200,200,1)";
const neutralMessageColor = "rgba(220,220,255,1)";

//this list help tracking the active animations that are running
const activeAnimations = new Set();

//This is the width / height of each sprite within the provided chess spritesheet
const pieceWidth = 640;
const pieceHeight = 640;

//This is the spritesheet used to texture all chess pieces
const spriteSheet = new Image();
spriteSheet.src = "./textures/chess_sprite_sheet.png";

/*This variable will store all the pieceTextures*/
const pieceTextures = {}

async function extractPieceFromSpritesheet(col, row)
{
    /*if the spritesheet has not finished loading*/
    if (!spriteSheet.complete)
    {
        //wait to finish loading the spritesheet
        await new Promise(resolve => spriteSheet.onload = resolve);
    }
    
    //if spritesheet width is 0
    if (spriteSheet.width === 0)
    {
        throw new Error("Sprite sheet failed to load");
    }
    
    //source coordinates for the sprite within the spritesheet
    const sx = col * pieceWidth;
    const sy = row * pieceHeight;

    //if sprite coordinates are outside of the spritesheet:
    if( sx + pieceWidth > spriteSheet.width ||
        sy + pieceHeight > spriteSheet.height  )
    {
        throw new Error("Sprite crop out of bounds");
    }

    //return the texture as image element
    return await createImageBitmap(
        spriteSheet,
        sx,
        sy,
        pieceWidth,
        pieceHeight
    );
}

function getInitialPiece(color, col, pieceTextures)
{
    //the order of the main chess pieces on the chessboard
    const order = [
        "rook",
        "knight",
        "bishop",
        "queen",
        "king",
        "bishop",
        "knight",
        "rook"
    ];
    
    const name = order[col];
    
    //chess piece for the given column coordinate
    return new ChessPiece(
        name,
        color,
        pieceTextures[color][name]
    );
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

class ChessPiece
{
    constructor(name, color, texture)
    {
        this.name = name;      // "pawn", "rook", "bishop", etc.
        this.color = color;    // "white" or "black"
        this.texture = texture; // Image object or canvas offscreen extraction
    }
}

class Square
{
    constructor(row, col)
    {
        this.row = row;
        this.col = col;
        this.piece = null;

        this.isSelected = false;
        this.isValidMove = false;
        this.isLastMove = false;
    }
}

class Board
{
    constructor()
    {
        this.size = 8;
        this.squares = [];
        this.selection = null
        
        //initialize the Board instance with squares
        for (let row = 0; row < 8; row++)
        {
            const currentRow = [];

            for (let col = 0; col < 8; col++)
            {
                let square = new Square(row, col);
                
                // Row 0 → white main pieces
                if (row === 0)
                {
                    square.piece = getInitialPiece("white", col, pieceTextures);
                }
                // Row 1 → white pawns
                else if (row === 1)
                {
                    square.piece = new ChessPiece("pawn", "white", pieceTextures.white.pawn);
                }
                // Row 6 → black pawns
                else if (row === 6)
                {
                    square.piece = new ChessPiece("pawn", "black", pieceTextures.black.pawn);
                }
                // Row 7 → black main pieces
                else if (row === 7)
                {
                    square.piece = getInitialPiece("black", col, pieceTextures);
                }   
                
                currentRow.push(square);
            }

            this.squares.push(currentRow);
        }
    }

    getSquare(row, col)
    {
        return this.squares[row][col];
    }
    
    clearSquareSelection()
    {
        if(this.selection)
        {
            this.selection.isSelected = false;
            this.selection = null;
        }
    }
    
    selectSquare(row, col)
    {
        this.clearSquareSelection();
        
        this.selection = this.squares[row][col];
        this.selection.isSelected = true;
    }
}

function squareClicked(event, board)
{
    /*
    getBoundingClientRect() returns the current displayed size of the canvas in pixels (CSS pixels) on the page.
    rect.width might not equal canvas.width, because of CSS styling.
    
    scaleX / scaleY calculate how much the internal canvas coordinates are scaled relative to the displayed size.
    
    ====================================================
    Example:
    canvas.width = 640

    CSS makes it 320px on screen → rect.width = 320

    Then scaleX = 640 / 320 = 2
    ====================================================
    Conclusion: each pixel on the canvas can be scaled positively or negatively to match the css.
    Canvas has its internal set of coordinates... which needs to be alligned with the css to process
    the coordinates correctly.
    */
    
    const rect = gameCanvas.getBoundingClientRect();
    const scaleX = gameCanvas.width / rect.width;
    const scaleY = gameCanvas.height / rect.height;

    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    const squareSize = gameCanvas.width / 8;

    const col = Math.floor(x / squareSize);
    const row = Math.floor(y / squareSize);

    const clickedSquare = board.getSquare(row, col);
    board.selectSquare(row, col)
    
    console.log("Clicked:", row, col);
    
    drawBoard(board);
}

function drawBoard(board)
{
    const boardSize = gameCanvas.width;
    const squareSize = boardSize / 8;

    //Draw all squares first
    for (let row = 0; row < 8; row++)
    {
        for (let col = 0; col < 8; col++)
        {
            const isLight = (row + col) % 2 === 0;

            gameContext.fillStyle = isLight ? "#f0d9b5" : "#b58863";
            
            const x_position = col * squareSize;
            const y_position = row * squareSize;
            
            gameContext.fillRect(
                x_position,
                y_position,
                squareSize,
                squareSize
            );
            
            let square = board.getSquare(row, col);
            
            if (square.piece)
            {
                console.log(square.piece.texture);
                const img = square.piece.texture;
                gameContext.drawImage(
                    img,
                    x_position,
                    y_position,
                    squareSize,
                    squareSize
                );
            }
        }
    }

    //Draw selection on top (if any)
    if (board.selection)
    {
        const square = board.selection;

        const x = square.col * squareSize;
        const y = square.row * squareSize;

        gameContext.strokeStyle = "red";
        gameContext.lineWidth = 4;

        gameContext.strokeRect(
            //border is 2px on each size
            x + 2,
            y + 2,
            //square size shrinks to contain the border within
            squareSize - 4,
            squareSize - 4,
        );
    }

    //Draw outer border last
    gameContext.strokeStyle = "black";
    gameContext.lineWidth = 3;
    gameContext.strokeRect(0.5, 0.5, boardSize - 1, boardSize - 1);
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

//Prevent the default behaviour on this window.
window.addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);

document.addEventListener('DOMContentLoaded', async () => {
    
    /*Initializing the pieceTextures object with the proper texture images*/
    pieceTextures.white = {
        king:   await extractPieceFromSpritesheet(0, 0),
        queen:  await extractPieceFromSpritesheet(1, 0),
        bishop: await extractPieceFromSpritesheet(2, 0),
        knight: await extractPieceFromSpritesheet(3, 0),
        rook:   await extractPieceFromSpritesheet(4, 0),
        pawn:   await extractPieceFromSpritesheet(5, 0),
    };
    
    pieceTextures.black = {
        king:   await extractPieceFromSpritesheet(0, 1),
        queen:  await extractPieceFromSpritesheet(1, 1),
        bishop: await extractPieceFromSpritesheet(2, 1),
        knight: await extractPieceFromSpritesheet(3, 1),
        rook:   await extractPieceFromSpritesheet(4, 1),
        pawn:   await extractPieceFromSpritesheet(5, 1),
    };
    
    writeResult("First message");

    //Creating a checkerboard object
    checkerBoard = new Board();
    
    //Drawing a checkerboard on the canvas
    drawBoard(checkerBoard);
    
    //Adding listener for checkerboard / canvas
    gameCanvas.addEventListener("click", (event) => squareClicked(event, checkerBoard));
});