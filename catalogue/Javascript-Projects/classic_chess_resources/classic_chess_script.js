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
const whitePlayerMessageColor = "rgba(255,255,255,1)";
const blackPlayerMessageColor = "rgba(100,100,100,1)";

//const regularWhiteColor = "#f0d9b5";
//const regularBlackColor = "#b58863";

const regularWhiteColor = "rgba(250,230,230,1)";
const regularBlackColor = "rgba(160,100,100,1)";

const selectionWhiteColor = "lightgreen";
const selectionBlackColor = "darkgreen";

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

/*This variable will store instances of the pieceTypes*/
const pieceTypes = {};

class PawnType
{
    constructor()
    {
        this.name = "pawn";
    }
    
    getLegalMoves(game, row, col, piece)
    {
        /*This function returns all possible moves for the piece WITHOUT regards for king's safety*/
        const moves = [];
        const direction = piece.color === "white" ? -1 : 1;

        const forwardRow = row + direction;

        //Forward 1 square
        const forwardSquare = game.board.getSquare(forwardRow, col);
        
        if (forwardSquare && !forwardSquare.piece)
        {
            moves.push(forwardSquare);

            //Forward 2 squares (only if its first move)
            if (!piece.hasMoved)
            {
                const doubleForwardRow = row + direction * 2;
                const doubleSquare = game.board.getSquare(doubleForwardRow, col);

                if (doubleSquare && !doubleSquare.piece)
                {
                    moves.push(doubleSquare);
                }
            }
        }

        //Diagonal captures
        const captureOffsets = [-1, 1];

        for (let offset of captureOffsets)
        {
            const captureCol = col + offset;
            const captureSquare = game.board.getSquare(forwardRow, captureCol);

            if ( captureSquare &&
                 captureSquare.piece &&
                 captureSquare.piece.color !== piece.color )
            {
                moves.push(captureSquare);
            }
        }

        return moves;
    }
}

class RookType
{
    constructor()
    {
        this.name = "rook";
    }
    
    getLegalMoves(game, row, col, piece)
    {
        /*This function returns all possible moves for the piece WITHOUT regards for king's safety*/
        const directions = [
            {row: 1,  col: 0},   // down
            {row: -1, col: 0},   // up
            {row: 0,  col: 1},   // right
            {row: 0,  col: -1}   // left
        ];
        
        const moves = piece.getMultipleSlidingMoves(game, row, col, directions);

        return moves;
    }
    
    getLegalMoves_OLD(game, row, col, piece)
    {
        /*This function returns all possible moves for the piece WITHOUT regards for king's safety*/
        const moves = [];
        
        //Forward movement
        let forwardRow = row + 1;
        
        while(forwardRow < 8)
        {
            let square = game.board.getSquare(forwardRow, col);
            
            if(square.piece != null && square.piece.color != piece.color)
            {
                moves.push(square);
                break;
            }
            else if(square.piece != null && square.piece.color == piece.color)
            {
                break;
            }
            else
            {
                moves.push(square);
            }
            
            forwardRow++;
        }
        
        //Backward movement
        let backwardRow = row - 1;
        while(backwardRow >= 0)
        {
            let square = game.board.getSquare(backwardRow, col);
            
            if(square.piece != null && square.piece.color != piece.color)
            {
                moves.push(square);
                break;
            }
            else if(square.piece != null && square.piece.color == piece.color)
            {
                break;
            }
            else
            {
                moves.push(square);
            }
            
            backwardRow--;
        }
        
        //Right movement
        let rightColumn = col + 1;
        while(rightColumn < 8)
        {
            let square = game.board.getSquare(row, rightColumn);
            
            if(square.piece != null && square.piece.color != piece.color)
            {
                moves.push(square);
                break;
            }
            else if(square.piece != null && square.piece.color == piece.color)
            {
                break;
            }
            else
            {
                moves.push(square);
            }
            
            rightColumn++;
        }
        
        //Left movement
        let leftColumn = col - 1;
        while(leftColumn >= 0)
        {
            let square = game.board.getSquare(row, leftColumn);
            
            if(square.piece != null && square.piece.color != piece.color)
            {
                moves.push(square);
                break;
            }
            else if(square.piece != null && square.piece.color == piece.color)
            {
                break;
            }
            else
            {
                moves.push(square);
            }
            
            leftColumn--;
        }

        return moves;
    }
}

class BishopType
{
    constructor()
    {
        this.name = "bishop";
    }
    
    getLegalMoves(game, row, col, piece)
    {
        /*This function returns all possible moves for the piece WITHOUT regards for king's safety*/
        const directions = [
            {row: 1,  col: 1},   //diagonal bottom-right
            {row: 1,  col: -1},  //diagonal bottom-left
            {row: -1, col: 1},   //diagonal top-right
            {row: -1, col: -1},  //diagonal top-left
        ];
        
        const moves = piece.getMultipleSlidingMoves(game, row, col, directions);
        
        return moves;
    }
}

class KnightType
{
    constructor()
    {
        this.name = "knight";
    }
    
    getLegalMoves(game, row, col, piece)
    {
        /*This function returns all possible moves for the piece WITHOUT regards for king's safety*/
        
        const directions = [
          { row: 2,  col:  1},  //row + 2  and col + 1 can be a valid move
          { row: 2,  col: -1},  //row + 2  and col - 1 can be a valid move
          { row: 1,  col:  2},  //row + 1  and col + 2 can be a valid move
          { row: -1, col:  2},  //row - 1  and col + 2 can be a valid move
          { row:  1, col: -2},  //row + 1  and col - 2 can be a valid move   
          { row: -1, col: -2},  //row - 1  and col - 2 can be a valid move
          { row: -2, col:  1},  //row - 2  and col + 1 can be a valid move
          { row: -2, col: -1},  //row - 2  and col - 1 can be a valid move
        ];

        const moves = piece.getSingleSlidingMoves(game, row, col, directions);
        
        return moves;
    }
}

class QueenType
{
    constructor()
    {
        this.name = "queen";
    }
    
    getLegalMoves(game, row, col, piece)
    {
        /*This function returns all possible moves for the piece WITHOUT regards for king's safety*/
        const directions = [
            {row: 1,  col: 0},   // down
            {row: -1, col: 0},   // up
            {row: 0,  col: 1},   // right
            {row: 0,  col: -1},  // left
            {row: 1,  col: 1},   //diagonal bottom-right
            {row: 1,  col: -1},  //diagonal bottom-left
            {row: -1, col: 1},   //diagonal top-right
            {row: -1, col: -1},  //diagonal top-left
        ];
        
        const moves = piece.getMultipleSlidingMoves(game, row, col, directions);
        
        return moves;
    }
}

class KingType
{
    constructor()
    {
        this.name = "king";
    }
    
    getLegalMoves(game, row, col, piece)
    {
        /*This function returns all possible moves for the piece WITHOUT regards for king's safety*/
        const directions = [
            {row: 1,  col: 0},   // down
            {row: -1, col: 0},   // up
            {row: 0,  col: 1},   // right
            {row: 0,  col: -1},  // left
            {row: 1,  col: 1},   //diagonal bottom-right
            {row: 1,  col: -1},  //diagonal bottom-left
            {row: -1, col: 1},   //diagonal top-right
            {row: -1, col: -1},  //diagonal top-left
        ];
        
        const moves = piece.getSingleSlidingMoves(game, row, col, directions);
        
        return moves;
    }

    getCastlingMoves(game, row, col, piece)
    {
        /*Function to check for the castling move between king and rock*/
        const moves = [];

        if(piece.hasMoved)
        {
            return moves;
        }
        
        //both kings are initially on 4th column
        let kingSquare = game.board.getSquare(row, col); 
        let isKingInCheck = game.isKingInCheck(kingSquare.piece.color);
        
        //if the king is in check the castling cannot continue
        if(isKingInCheck)
        {
            return moves;
        }
        
        // kingside castling
        const rookSquare = game.board.getSquare(row, 7);
        
        //if rock square has a piece which was never moved - it means we have the rock at its initial position.
        if(rookSquare.piece && rookSquare.piece.hasMoved == false && rookSquare.piece.type.name == "rook" &&
                        rookSquare.piece.color === kingSquare.piece.color )
        {
            const emptySquares = [];
            
            //Grab the required squares between the king and the king-side rock
            emptySquares.push(game.board.getSquare(row,5)) //the square which is initially occupied by the bishop
            emptySquares.push(game.board.getSquare(row,6)) //the square which is initially occupied by the knight
            
            let castlingPossible = true;
            
            //Check if the squares between the king and the king-side rock are empty
            for(let square of emptySquares)
            {
                 //if square is not empty... or its in check
                if(square.piece != null || game.willMoveLeaveKingInCheck(kingSquare, square))
                {
                    castlingPossible = false;
                    break;
                }
            }
            
            //if all squares are empty and they are not in check
            if(castlingPossible)
            {
                moves.push(game.board.getSquare(row,6)); // king moves here
            }
        }

        // queenside castling
        const rookQSquare = game.board.getSquare(row,0);
        
        //if rock square has a piece which was never moved - it means we have the rock at its initial position.
        if(rookQSquare.piece && !rookQSquare.piece.hasMoved && rookQSquare.piece.type.name == "rook" && 
                        rookQSquare.piece.color === kingSquare.piece.color )
        {
            const emptySquares = [];
            
            
            //Grab the required squares between the king and the king-side rock
            emptySquares.push(game.board.getSquare(row,1)) //the square which is initially occupied by the knight
            emptySquares.push(game.board.getSquare(row,2)) //the square which is initially occupied by the bishop
            emptySquares.push(game.board.getSquare(row,3)) //the square which is initially occupied by the queen

            let castlingPossible = true;
            
            //Check if the squares between the king and the king-side rock are empty
            for(let square of emptySquares)
            {
                //if square is not empty... or its in check
                if(square.piece != null || game.willMoveLeaveKingInCheck(kingSquare, square))
                {
                    castlingPossible = false;
                    break;
                }
            }

            //if all squares are empty and they are not in check
            if(castlingPossible)
            {
                moves.push(game.board.getSquare(row, 2)); // king moves here
            }
        }

        return moves;
    }
}

class ChessPiece
{
    constructor(type, color, texture)
    {
        this.type = type;   // "pawn", "rook", etc.
        this.color = color;    // "white" or "black"
        this.texture = texture; // Image object or canvas offscreen extraction
        this.hasMoved = false; // useful for castling & pawn first move
    }
    
    getLegalMoves(game, square)
    {
        return this.type.getLegalMoves(game, square.row, square.col, this);
    }
    
    getCastlingMoves(game, square)
    {
        if(square.piece.type.getCastlingMoves != undefined)
        {
            return square.piece.type.getCastlingMoves(game, square.row, square.col, this);
        }
        return [];
    }
    
    // Helper for sliding pieces (rook, bishop, queen)
    getMultipleSlidingMoves(game, row, col, directions)
    {
        const moves = [];

        for(let direction of directions)
        {
            let directionRow = row + direction.row;
            let directionCol = col + direction.col;
            
            while(true)
            {
                let square = game.board.getSquare(directionRow, directionCol);
                
                if(square == null)
                {
                    break;
                }
                else if(square.piece == null)
                {
                    moves.push(square);
                }
                else
                {
                    //allow capturing the opponent's piece
                    if(square.piece.color != this.color)
                    {
                        moves.push(square)
                    }
                    
                    //break out - the remaining squares on this direction are out of reach
                    break;
                }
                
                //keep travelling the direction
                directionRow += direction.row;
                directionCol += direction.col;
            }
        }

        return moves;
    }
    
    // Helper for sliding pieces (king, knight)
    getSingleSlidingMoves(game, row, col, directions)
    {
        const moves = [];
        
        for(let direction of directions)
        {
            let directionRow = row + direction.row;
            let directionCol = col + direction.col;
            
            let square = game.board.getSquare(directionRow, directionCol);
            
            if(square != null)
            {
                if(square.piece == null)
                {
                    moves.push(square);
                }
                else if(square.piece.color != this.color)
                {
                    moves.push(square);
                }
            }
        }
        
        return moves;
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

class Player
{
    constructor(color)
    {
        this.color = color;
        this.capturedPieces = [];
    }
    
    requestMove(game)
    {
        throw new Error("requestMove must be implemented");
    }
}

class AIPlayer extends Player
{
    constructor(color)
    {
        //calling the parent class constructor
        super(color);
    }
    
    requestMove(game)
    {
        const move = this.calculateMove(game);
        //game.executeMove(move);
    }
    
    calculateMove(game)
    {
        const allMoves = [];
        for (let row of game.board.squares)
        {
            for (let square of row)
            {
                if (square.piece && square.piece.color === this.color)
                {
                    const moves = game.getFilteredLegalMoves(square);
                    moves.forEach(toSquare => allMoves.push({from: square, to: toSquare}));
                }
            }
        }

        if(allMoves.length === 0)
        {
            return; // no moves possible (checkmate/stalemate)
        }
        
        //pick a random move
        const choice = allMoves[Math.floor(Math.random() * allMoves.length)];
        game.move(choice.from, choice.to);
    }
}

class HumanPlayer extends Player
{
    constructor(color)
    {
        super(color);
    }
    
    requestMove(game)
    {
        // Do nothing
        // Wait for UI input (click events)
    }
}

class Board
{
    constructor()
    {
        this.size = 8;
        this.squares = [];
        this.selection = null
        this.whiteKingSquare = null;
        this.blackKingSquare = null;
        
        //initialize the Board instance with squares
        for (let row = 0; row < 8; row++)
        {
            const currentRow = [];

            for (let col = 0; col < 8; col++)
            {
                let square = new Square(row, col);
                
                // Row 0 → black main pieces
                if (row === 0)
                {
                    square.piece = getInitialPiece("black", col, pieceTextures);
                }
                // Row 1 → black pawns
                else if (row === 1)
                {
                    square.piece = new ChessPiece(pieceTypes["pawn"], "black", pieceTextures.black.pawn);
                }
                // Row 6 → white pawns
                else if (row === 6)
                {
                    square.piece = new ChessPiece(pieceTypes["pawn"], "white", pieceTextures.white.pawn);
                }
                // Row 7 → white main pieces
                else if (row === 7)
                {
                    square.piece = getInitialPiece("white", col, pieceTextures);
                }   
                
                //initialize the king elements to help tracking the gameStates
                this.checkUpdateBoardKingsPositions(square)
                
                currentRow.push(square);
            }
            this.squares.push(currentRow);
        }
    }
    
    checkPawnPromotion(toSquare)
    {
        //if the piece that was moved is a pawn
        if(toSquare != null && toSquare.piece != null && toSquare.piece.type.name == "pawn")
        {
            //if pawn is white
            if(toSquare.piece.color === "white")
            {
                //if pawn travelled to the top row - is eligible for promotion
                if(toSquare.row == 0)
                {
                    toSquare.piece = new ChessPiece(pieceTypes["queen"], "white", pieceTextures.white.queen);
                    writeResult("White Pawn promoted to Queen.", positiveMessageColor);
                }
            }
            else if(toSquare.piece.color === "black")
            {
                //if pawn travelled to the bottom row - is eligible for promotion
                if(toSquare.row == 7)
                {
                    toSquare.piece = toSquare.piece = new ChessPiece(pieceTypes["queen"], "black", pieceTextures.black.queen);
                    writeResult("Black Pawn promoted to Queen.", positiveMessageColor);
                }
            }
        }
    }
    
    checkCastlingMove(fromSquare, toSquare)
    {
        /*This function checks for castling moves on the king and commits the rook to it
        - THIS SHOULD BE CALLED AFTER THE KING WAS ALREADY MOVED*/
        
        /*piece was in fromSquare and now is in toSquare*/
        if (toSquare.piece)
        {
            if (toSquare.piece.type.name === "king")
            {
                let column_difference = fromSquare.col - toSquare.col;
                
                //if king moves more than 1 squares - its castling movement - 
                //already validated from the game class and knightType class
                if(column_difference < -1)
                {   
                    //king side castling
                    let rookSquare = this.squares[toSquare.row][toSquare.col + 1];
                    
                    //designated position is next square at the left-side of the king
                    let designatedPositionSquare = this.squares[toSquare.row][toSquare.col - 1];
                    
                    /*these were already validated by the knightType class when commiting the move
                    - but to make sure we picked the correct squares above - we gonna recheck.
                    */
                    if(rookSquare != null && rookSquare.piece != null && rookSquare.piece.type.name == "rook")
                    {
                        if(designatedPositionSquare != null && designatedPositionSquare.piece == null)
                        {
                            //if piece was not moved before - now it is moved
                            rookSquare.piece.hasMoved = true;
                            designatedPositionSquare.piece = rookSquare.piece;
                            rookSquare.piece = null;
                            writeResult("King-side castling move complete.", positiveMessageColor);
                        }
                    }
                }
                else if(column_difference > 1)
                {
                    //queen side castling
                    let rookSquare = this.squares[toSquare.row][toSquare.col - 2];
                    
                    //designated position is next square at the right-side of the king
                    let designatedPositionSquare = this.squares[toSquare.row][toSquare.col + 1];
                    
                    /*these were already validated by the knightType class when commiting the move
                    - but to make sure we picked the correct squares above - we gonna recheck.
                    */
                    if(rookSquare != null && rookSquare.piece != null && rookSquare.piece.type.name == "rook")
                    {
                        if(designatedPositionSquare != null && designatedPositionSquare.piece == null)
                        {
                            //if piece was not moved before - now it is moved
                            rookSquare.piece.hasMoved = true;
                            designatedPositionSquare.piece = rookSquare.piece;
                            rookSquare.piece = null;
                            writeResult("Queen-side castling move complete.", positiveMessageColor);
                        }
                    }
                }
            }
        }
    }
    
    checkUpdateBoardKingsPositions(square)
    {
        if (square.piece)
        {
            if (square.piece.type.name === "king")
            {
                if (square.piece.color === "white")
                {
                    this.whiteKingSquare = square;
                }
                else
                {
                    this.blackKingSquare = square;
                }
            }
        }
    }

    getSquare(row, col)
    {
        if(row >= 0 && row < this.squares.length && col >=0 && col < this.squares[row].length)
        {
            return this.squares[row][col];
        }
        else
        {
            return null;
        }
    }
    
    getPiece(row, col)
    {
        let square = this.getSquare(row, col);
        
        return this.square.piece;
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
   
    movePiece(fromSquare, toSquare)
    {   
        this.clearSquareSelection();
        
        //if piece was not moved before - now it is moved
        fromSquare.piece.hasMoved = true;
        
        toSquare.piece = fromSquare.piece;
        fromSquare.piece = null;
        
        // Update king reference when moving
        this.checkUpdateBoardKingsPositions(toSquare);
        
        //Check for castling move and commit the rook to it.
        this.checkCastlingMove(fromSquare, toSquare);
        
        //Check for pawn promotion move.
        this.checkPawnPromotion(toSquare);
    }
}

class Game
{
    constructor()
    {
        this.board = new Board();

        this.players = {
            white: new HumanPlayer("white"),
            black: new AIPlayer("black"),
        };
        this.currentPlayer = this.players.white;
        this.currentTurn = this.currentPlayer.color;
        
        this.state = "playing"; // playing | check | checkmate | stalemate
        this.moveCounter = 0;
        
        writeResult("Game Started.");
        writeResult("Current Turn: " + this.currentTurn, neutralMessageColor);
    }

    move(fromSquare, toSquare)
    {
        // block moves if game is over
        if (this.state === "checkmate" || this.state === "stalemate")
        {
            return false;
        }
        
        if(this.state === "check")
        {
            //if the move does not release the check... then the move is not valid
            if(this.willMoveLeaveKingInCheck(fromSquare, toSquare) == true)
            {
                return false;
            }
        }
        
        const piece = fromSquare.piece;
        
        //if fromSquare has no piece in it... or the piece is of opponent's color
        if (!piece || piece.color !== this.currentTurn)
        {
            return false;
        }

        //Filter out all moves that would put the king at risk
        const legalMoves = this.getFilteredLegalMoves(fromSquare);
        
        //if the toSquare is not a legal move
        if(legalMoves.includes(toSquare) == false)
        {
            return false;
        }
        
        if(toSquare.piece != null)
        {
            this.players[this.currentTurn].capturedPieces.push(toSquare.piece);
        }
        
        this.board.movePiece(fromSquare, toSquare);
        
        this.moveCounter++;
        
        let message = capitalize(this.currentTurn) + "s:\n" + toSquare.piece.type.name + " - from " +
                      fromSquare.row + "x" + fromSquare.col + " to " + toSquare.row + "x" + toSquare.col;
        
        writeResult(this.moveCounter + ". " + message, this.getMessageColorForCurrentPlayer());
        
        this.updateGameState();
        this.switchTurn();

        return true;
    }

    switchTurn()
    {           
        if(this.currentPlayer === this.players.white)
        {
            this.currentPlayer = this.players.black;
        }
        else
        {
            this.currentPlayer = this.players.white;
        }
        
        this.currentTurn = this.currentPlayer.color;
        this.currentPlayer.requestMove(this);
        
        writeResult("Current Turn: " + this.currentTurn, neutralMessageColor);
    }
      
    isKingInCheck(color)
    {
        const kingSquare = 
            color === "white" 
            ? this.board.whiteKingSquare 
            : this.board.blackKingSquare;

        const opponentColor = color === "white" ? "black" : "white";
        
        // Loop over all squares in the 2D board
        for (let row of this.board.squares)
        {
            for (let square of row)
            {
                if (square.piece && square.piece.color === opponentColor)
                {
                    const moves = square.piece.getLegalMoves(this, square);
                    if (moves.includes(kingSquare))
                    {
                        return true;
                    }
                }
            }
        }

        return false;
    }
    
    willMoveLeaveKingInCheck(fromSquare, toSquare)
    {
        //A utility function that simulates a single move to check if it would put your own king in check.
        
        const piece = fromSquare.piece;
        const isKing = piece.type.name === "king";

        const capturedPiece = toSquare.piece;

        // simulate the move
        toSquare.piece = piece;
        fromSquare.piece = null;

        let originalKingSquare;

        //if this is the king, temporarily update the king reference
        if (isKing)
        {
            if (piece.color === "white")
            {
                //update the white king reference
                originalKingSquare = this.board.whiteKingSquare;
                this.board.whiteKingSquare = toSquare;
            }
            else
            {
                //update the black king reference
                originalKingSquare = this.board.blackKingSquare;
                this.board.blackKingSquare = toSquare;
            }
        }

        //check if the king is in check
        const isInCheck = this.isKingInCheck(piece.color);

        //undo simulation
        fromSquare.piece = toSquare.piece;
        toSquare.piece = capturedPiece;

        //restore king reference - back to normal
        if (isKing)
        {
            if (piece.color === "white")
            {
                this.board.whiteKingSquare = originalKingSquare;
            }
            else
            {
                this.board.blackKingSquare = originalKingSquare;
            }
        }

        return isInCheck;
    }
    
    getFilteredLegalMoves(fromSquare)
    {
        //This function filters out the moves that puts the king in danger.
        //All moves that result in check to the king... will be removed.
        
        const piece = fromSquare.piece;
        
        //get possible valid moves for the piece within the provided Square
        const candidateMoves = piece.getLegalMoves(this, fromSquare);

        const legalMoves = [];
        
        //for each possible move
        for (let toSquare of candidateMoves)
        {
            //if move will not leave king in check
            if (this.willMoveLeaveKingInCheck(fromSquare, toSquare) == false)
            {
                legalMoves.push(toSquare);
            }
        }
        
        //Add castling moves - if available they are already filtered.
        const castlingMoves = piece.getCastlingMoves(this, fromSquare);
        
        legalMoves.push(...castlingMoves); //append one list to another list
        
        return legalMoves;
    }
    
    hasAnyLegalMove(color)
    {
        //Function to check if for any piece of the given color there are any legal moves left.
        
        //for each square on the checkboard
        for (let row of this.board.squares)
        {
            for (let square of row)
            {
                //if the square has a piece of the provided color
                if (square.piece && square.piece.color === color)
                {
                    //filter the moves of the piece
                    const moves = this.getFilteredLegalMoves(square);
                    
                    //if there are any moves like
                    if (moves.length > 0)
                    {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    
    getOpponentPlayerName()
    {
        let player = this.currentTurn === "white"
                    ? "black"
                    : "white";

        return player;
    }
    
    getMessageColorForCurrentPlayer()
    {
        let color = this.currentTurn === "white"
                        ? whitePlayerMessageColor
                        : blackPlayerMessageColor;
        
        return color;
    }
    
    updateGameState()
    {
        //This function will detect check, checkmate, stalemate
        
        const color = this.currentTurn;
        
        //Check if the king is in check
        let prev_game_state = this.state;
        const inCheck = this.isKingInCheck(color);
        
        console.log("Check: " + inCheck + " - " + color);
        //Check if the player has any legal moves left
        const hasMove = this.hasAnyLegalMove(color);
        
        //if king is in danger and doesn't have any valid moves
        if (inCheck && !hasMove)
        {
            this.state = "checkmate";
            
            //Output the result
            let message_color = this.getMessageColorForCurrentPlayer();
            
            writeResult("Checkmate! " + capitalize(this.currentTurn) + " player is the winner.", message_color);
        }
        //if the king is not in check and doesn't have any valid moves
        else if (!inCheck && !hasMove)
        {
            this.state = "stalemate";
            
            //Output the result
            writeResult("The game ended in stalemate! No winner. ");
        }
        //if the king is in check
        else if (inCheck)
        {
            this.state = "check";
            
            let oppositePlayer = this.getOpponentPlayerName();
            
            //Output the result
            writeResult(capitalize(oppositePlayer) + "s - are in check!", negativeMessageColor);
        }
        else
        {
            this.state = "playing";
            
            if(prev_game_state == "check")
            {
                //Output the result
                writeResult(capitalize(this.currentTurn) + "s - are released from check!", positiveMessageColor);
            }
        }
    }
    
    drawBoard()
    {
        const boardSize = gameCanvas.width;
        const squareSize = boardSize / 8;
        
        let board_selection_moves = [];
        
        if(this.board.selection)
        {
            board_selection_moves = this.getFilteredLegalMoves(this.board.selection);
        }
        
        //Draw all squares first
        for (let row = 0; row < 8; row++)
        {
            for (let col = 0; col < 8; col++)
            {
                const square = this.board.getSquare(row, col);
                
                const isLight = (row + col) % 2 === 0;
                
                if( this.board.selection && board_selection_moves.includes(square) )
                {
                    gameContext.fillStyle = isLight ? selectionWhiteColor : selectionBlackColor;
                }
                else
                {
                    gameContext.fillStyle = isLight ? regularWhiteColor : regularBlackColor;
                }
                
                const x_position = col * squareSize;
                const y_position = row * squareSize;
                
                gameContext.fillRect(
                    x_position,
                    y_position,
                    squareSize,
                    squareSize
                );
                
                if (square.piece)
                {
                    //console.log(square.piece.texture);
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
        if (this.board.selection)
        {
            const square = this.board.selection;

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
    
    handleSquareClick(row, col)
    {
        if (!(this.currentPlayer instanceof HumanPlayer))
        {
            return; // ignore input if AI turn
        }
    }
    
    squareClicked(event)
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

        let clickedSquare = this.board.getSquare(row, col);
        
        if(clickedSquare == this.board.selection)
        {
            this.board.clearSquareSelection();
        }
        else if(clickedSquare.piece && clickedSquare.piece.color == this.currentTurn && 
                this.board.selection == null)
        {
            this.board.selectSquare(row, col);
            this.board.selection = clickedSquare;
        }
        else if(this.board.selection)
        {
            this.move(this.board.selection, clickedSquare);
        }
        
        //console.log("Clicked:", row, col);
        
        this.drawBoard();
    }
}

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
        pieceTypes[name],                 // behavior object
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

function capitalize(str)
{
    // handle empty or undefined strings
    if (!str)
    {
        return ''; 
    }
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function writeResult(result_text, color = neutralMessageColor)
{
    const resultHUD_Element = document.getElementById("result");

    // Create message element
    const message = document.createElement("div");
    message.innerHTML = result_text.replace(/\n/g, '<br>');
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

function restartGame()
{
    document.getElementById("result").innerHTML = "";
    
    //Creating a checkerboard object
    game = new Game();
    
    //Drawing a checkerboard on the canvas
    game.drawBoard();
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
    
    //Initializing the pieceTypes with instances
    pieceTypes.pawn = new PawnType();
    pieceTypes.rook = new RookType();
    pieceTypes.bishop = new BishopType();
    pieceTypes.knight = new KnightType();
    pieceTypes.queen = new QueenType();
    pieceTypes.king = new KingType();

    //Creating a checkerboard object
    game = new Game();
    
    //Drawing a checkerboard on the canvas
    game.drawBoard();
    
    //Adding listener for checkerboard / canvas
    gameCanvas.addEventListener("click", (event) => game.squareClicked(event));
});