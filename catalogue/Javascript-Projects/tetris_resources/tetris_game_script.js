var score=0;
var game_started=false;
var game_paused=false;
const gameOverRowReferece = 6;
const tableNumberOfCols = 11
const tableNumberOfRows = 16
const gameOverRow = 1;

const reccurence = 100;
var msCounter = 0;
const normalGameSpeed = 500; // every 500ms
var AccelerateGame = false;

let gameTickRunning = false;

var sq = null; // let this be default;


function Enter_FullScreen(e)
{
    if (e.key == "f")
    {
        FullscreenMode(); 
    }
}

function FullscreenMode(e)
{
    var game_content = document.getElementById("game_content");
    var game_div = document.getElementById("game_div");
    var fullscreen_button = document.getElementById("fullscreen");
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

class ShapeSegment
{
    constructor(y, x)
    {
        this.y = y
        this.x = x;
        this.reachedBottom = false;
    }
    
    notExistsSegmentAt(y, x)
    {
        var elemName = getElementIdName(y, x);
        let cell = document.getElementById(elemName);

        if(cell && (cell.style.backgroundColor == "transparent"))
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    
    clear()
    {
        this.drawSegment("transparent");
    }
    
    draw()
    {
        this.drawSegment("blue");
    }

    moveDown()
    {
        if(this.notExistsSegmentAt(this.y+1, this.x))
        {
            this.y += 1;
            this.reachedBottom = false;
        }
        else
        {
            this.reachedBottom = true;
        }
        return this.reachedBottom;
    }
    
    moveLeft()
    {
        this.x -= 1;
    }
    
    moveRight()
    {
        this.x += 1;
    }
    
    drawSegment(color)
    {
        
        var elemName = getElementIdName(this.y, this.x);
        //console.log("ElemName " + elemName);
        
        var DOM_Element = document.getElementById(elemName);
        if(DOM_Element)
        {
            DOM_Element.style.backgroundColor = color;
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

class TetrisShape
{
    constructor(name, y, x)
    {
        this.FormBuilder(name.toLowerCase(), y, x);
    }
    
    recycleForm(x, y)
    {
        if(this.reachedDown==true)
        {
            var rand = Math.floor(Math.random() * 40)
            var x = 4;
            var y = -1;
            
            /*
            LEGEND:
            8 of 33 chances to generate a square form
            8 of 33 changes to generate F form.
            8 of 33 changes to generate I form.
            8 of 33 changes to generate S form.
            8 of 33 chances to generate L form
            */
            
            switch(rand)
            {   
                /*Generate a square form*/
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                {
                    this.FormBuilder("square", y, x);
                    break;
                }
                /*Generate I shape*/
                case 8:
                case 9:
                case 10:
                case 11:
                {
                    this.FormBuilder("i_vertical", y, x);
                    break;
                }
                case 12:
                case 13:
                case 14:
                case 15:
                {
                    this.FormBuilder("i_horizontal", y, x);
                    break;
                }
                /*Generate S shape*/
                case 16:
                case 17:
                {
                    this.FormBuilder("s_vertical", y, x);
                    break;
                }
                case 18:
                case 19:
                {
                    this.FormBuilder("s_vertical_flipped", y, x);
                    break;
                }
                case 20:
                case 21:
                {
                    this.FormBuilder("s_horizontal", y, x);
                    break;
                }
                case 22:
                case 23:
                {
                    this.FormBuilder("s_horizontal_flipped", y, x);
                    break;
                }
                /*Generate L shape*/
                case 24:
                {
                    this.FormBuilder("l_vertical_normal", y, x);
                    break;
                }
                case 25:
                {
                    this.FormBuilder("l_horizontal_normal", y, x);
                    break;
                }
                case 26:
                {
                    this.FormBuilder("l_vertical_normal_reversed", y, x);
                    break;
                }
                case 27:
                {
                    this.FormBuilder("l_horizontal_normal_reversed", y, x);
                    break;
                }
                case 28:
                {
                    this.FormBuilder("l_vertical_flipped", y, x);
                    break;
                }
                case 29:
                {
                    this.FormBuilder("l_horizontal_flipped", y, x);
                    break;
                }
                case 30:
                {
                    this.FormBuilder("l_vertical_flipped_reversed", y, x);
                    break;
                }
                case 31:
                {
                    this.FormBuilder("l_horizontal_flipped_reversed", y, x);
                    break;
                }
                /*Generate F shape*/
                case 32:
                case 33:
                {
                    this.FormBuilder("f_horizontal", y, x);
                    break;
                }
                case 34:
                case 35:
                {
                    this.FormBuilder("f_vertical", y, x);
                    break;
                }
                case 36:
                case 37:
                {
                    this.FormBuilder("f_vertical_reversed", y, x);
                    break;
                }
                case 38:
                case 39:
                {
                    this.FormBuilder("f_horizontal_reversed", y, x);
                    break;
                }
                default : {break; /*Never come here*/}
            }
        }
    }
    
    FormBuilder(name, y, x)
    {
        switch(name)
        {
            case "square": {
                /*
                    ##
                    ##
                */
                
                let temp = [];
                
                /*Checking if x positions needs to be adjusted to fit within the table*/
                x = this.adjustXPos(x, 0, 1);
                
                /*the first segment always starts with x and y*/
                temp.push(new ShapeSegment(y,  x));
                temp.push(new ShapeSegment(y,  x+1));
                temp.push(new ShapeSegment(y+1,x+1));
                temp.push(new ShapeSegment(y+1,x));
                /*the last element should be the lowest one  from the buttom*/
                
                this.checkAssignSegments(temp, name);
                
                break;  
            }
            case "i_vertical": {
                /*
                    #
                    #
                    #
                    #
                */
                let temp = [];
                
                /*the first segment always starts with x and y*/
                temp.push(new ShapeSegment(y,  x));
                temp.push(new ShapeSegment(y+1,  x));
                temp.push(new ShapeSegment(y+2,x));
                temp.push(new ShapeSegment(y+3,x));
                /*the last element should be the lowest one  from the buttom*/
                
                this.checkAssignSegments(temp, name);
                
                break;  
            }
            case "i_horizontal": {
                /*
                    ####
                */
                let temp = [];
                
                /*Checking if x positions needs to be adjusted to fit within the table*/
                x = this.adjustXPos(x, 0, 3);
                
                /*the first segment always starts with x and y*/
                temp.push(new ShapeSegment(y, x));
                temp.push(new ShapeSegment(y, x+1));
                temp.push(new ShapeSegment(y, x+2));
                temp.push(new ShapeSegment(y, x+3));
                /*the last element should be the lowest one  from the buttom*/
                
                this.checkAssignSegments(temp, name);
                
                break;  
            }
            case "s_vertical": {
                /*
                    #
                   ##
                   #
                */
                let temp = [];
                
                /*Checking if x positions needs to be adjusted to fit within the table*/
                x = this.adjustXPos(x, 1, 0);
                
                /*the first segment always starts with x and y*/
                temp.push(new ShapeSegment(y,   x));
                temp.push(new ShapeSegment(y+1, x));
                temp.push(new ShapeSegment(y+1, x-1));
                temp.push(new ShapeSegment(y+2, x-1));
                /*the last element should be the lowest one  from the buttom*/
                
                this.checkAssignSegments(temp, name);
                
                break;  
            }
            case "s_vertical_flipped": {
                /*
                   # 
                   ##
                    #
                */
                let temp = [];
                
                /*Checking if x positions needs to be adjusted to fit within the table*/
                x = this.adjustXPos(x, 0, 1);
                
                /*the first segment always starts with x and y*/
                temp.push(new ShapeSegment(y,   x));
                temp.push(new ShapeSegment(y+1, x));
                temp.push(new ShapeSegment(y+1, x+1));
                temp.push(new ShapeSegment(y+2, x+1));
                /*the last element should be the lowest one  from the buttom*/
                
                this.checkAssignSegments(temp, name);
                
                break;  
            }
            case "s_horizontal": {
                /*
                     ##
                    ##
                */
                let temp = [];
                
                /*Checking if x positions needs to be adjusted to fit within the table*/
                x = this.adjustXPos(x, 1, 1);
                
                /*the first segment always starts with x and y*/
                temp.push(new ShapeSegment(y,   x));
                temp.push(new ShapeSegment(y, x+1));
                temp.push(new ShapeSegment(y+1, x));
                temp.push(new ShapeSegment(y+1, x-1));
                /*the last element should be the lowest one  from the buttom*/
                
                this.checkAssignSegments(temp, name);
                
                break;
            }
            case "s_horizontal_flipped": {
                /*
                    ##
                     ##
                */
                let temp = [];
                
                /*Checking if x positions needs to be adjusted to fit within the table*/
                x = this.adjustXPos(x, 1, 1);
                
                /*the first segment always starts with x and y*/
                temp.push(new ShapeSegment(y,   x));
                temp.push(new ShapeSegment(y, x-1));
                temp.push(new ShapeSegment(y+1, x));
                temp.push(new ShapeSegment(y+1, x+1));
                /*the last element should be the lowest one  from the buttom*/
                
                this.checkAssignSegments(temp, name);
                
                break;  
            }
            case "l_vertical_normal": {
                /*
                     #
                     #
                     ##
                */
                let temp = [];
                
                /*Checking if x positions needs to be adjusted to fit within the table*/
                x = this.adjustXPos(x, 0, 1);
                
                /*the first segment always starts with x and y*/
                temp.push(new ShapeSegment(y,   x));
                temp.push(new ShapeSegment(y+1, x));
                temp.push(new ShapeSegment(y+2, x));
                temp.push(new ShapeSegment(y+2, x+1));
                /*the last element should be the lowest one  from the buttom*/
                
                this.checkAssignSegments(temp, name);
                
                break;  
            }
            case "l_horizontal_normal": {
                /*
                       #
                    ####
                */
                let temp = [];
                
                /*Checking if x positions needs to be adjusted to fit within the table*/
                x = this.adjustXPos(x, 2, 0);
                
                /*the first segment always starts with x and y*/
                temp.push(new ShapeSegment(y,   x));
                temp.push(new ShapeSegment(y+1, x));
                temp.push(new ShapeSegment(y+1, x-1));
                temp.push(new ShapeSegment(y+1, x-2));
                /*the last element should be the lowest one  from the buttom*/
                
                this.checkAssignSegments(temp, name);
                
                break;  
            }
            case "l_vertical_normal_reversed": {
                /*
                      ##
                       #
                       #
                */
                let temp = [];
                
                /*Checking if x positions needs to be adjusted to fit within the table*/
                x = this.adjustXPos(x, 1, 0);
                
                /*the first segment always starts with x and y*/
                temp.push(new ShapeSegment(y,   x));
                temp.push(new ShapeSegment(y,  x-1));
                temp.push(new ShapeSegment(y+1, x));
                temp.push(new ShapeSegment(y+2, x));
                /*the last element should be the lowest one  from the buttom*/
                
                this.checkAssignSegments(temp, name);
                
                break;
            }
            case "l_horizontal_normal_reversed": {
                /*
                      ####
                      #
                */
                let temp = [];
                
                /*Checking if x positions needs to be adjusted to fit within the table*/
                x = this.adjustXPos(x, 0, 2);
                
                /*the first segment always starts with x and y*/
                temp.push(new ShapeSegment(y,   x));
                temp.push(new ShapeSegment(y, x+1));
                temp.push(new ShapeSegment(y,  x+2));
                temp.push(new ShapeSegment(y+1, x));
                /*the last element should be the lowest one  from the buttom*/
                
                this.checkAssignSegments(temp, name);
                
                break;  
            }
            case "l_vertical_flipped": {
                /*
                       #
                       #
                      ##
                */
                let temp = [];
                
                /*Checking if x positions needs to be adjusted to fit within the table*/
                x = this.adjustXPos(x, 1, 0);
                
                /*the first segment always starts with x and y*/
                temp.push(new ShapeSegment(y,   x));
                temp.push(new ShapeSegment(y+1, x));
                temp.push(new ShapeSegment(y+2, x));
                temp.push(new ShapeSegment(y+2, x-1));
                /*the last element should be the lowest one  from the buttom*/
                
                this.checkAssignSegments(temp, name);
                
                break;  
            }
            case "l_horizontal_flipped": {
                /*
                     ####
                        #
                */
                let temp = [];
                
                /*Checking if x positions needs to be adjusted to fit within the table*/
                x = this.adjustXPos(x, 0, 2);
                
                /*the first segment always starts with x and y*/
                temp.push(new ShapeSegment(y,   x));
                temp.push(new ShapeSegment(y, x+1));
                temp.push(new ShapeSegment(y, x+2));
                temp.push(new ShapeSegment(y+1, x+2));
                /*the last element should be the lowest one  from the buttom*/
                
                this.checkAssignSegments(temp, name);
                
                break;  
            }
            case "l_vertical_flipped_reversed": {
                /*
                      ##
                      #
                      #
                */
                let temp = [];
                
                /*Checking if x positions needs to be adjusted to fit within the table*/
                x = this.adjustXPos(x, 0, 1);
                
                /*the first segment always starts with x and y*/
                temp.push(new ShapeSegment(y,   x));
                temp.push(new ShapeSegment(y,   x+1));
                temp.push(new ShapeSegment(y+1,  x));
                temp.push(new ShapeSegment(y+2, x));
                /*the last element should be the lowest one  from the buttom*/
                
                this.checkAssignSegments(temp, name);
                
                break;  
                
            }
            case "l_horizontal_flipped_reversed": {
                /*
                      #
                      ####
                */
                let temp = [];
                
                /*Checking if x positions needs to be adjusted to fit within the table*/
                x = this.adjustXPos(x, 0, 2);
                
                /*the first segment always starts with x and y*/
                temp.push(new ShapeSegment(y,   x));
                temp.push(new ShapeSegment(y+1, x));
                temp.push(new ShapeSegment(y+1, x+1));
                temp.push(new ShapeSegment(y+1, x+2));
                /*the last element should be the lowest one  from the buttom*/
                
                this.checkAssignSegments(temp, name);
                break;
            }
            case "f_horizontal": {
                /*
                      #
                     ###
                */
                let temp = [];
                
                /*Checking if x positions needs to be adjusted to fit within the table*/
                x = this.adjustXPos(x, 1, 1);
                
                /*the first segment always starts with x and y*/
                temp.push(new ShapeSegment(y,   x));
                temp.push(new ShapeSegment(y+1,   x));
                temp.push(new ShapeSegment(y+1,   x-1));
                temp.push(new ShapeSegment(y+1,  x+1));
                /*the last element should be the lowest one  from the buttom*/
                
                this.checkAssignSegments(temp, name);
                
                break;  
            }
            case "f_vertical": {
                /*
                      #
                     ##
                      #
                */
                let temp = [];
                
                /*Checking if x positions needs to be adjusted to fit within the table*/
                x = this.adjustXPos(x, 1, 0);
                
                /*the first segment always starts with x and y*/
                temp.push(new ShapeSegment(y,   x));
                temp.push(new ShapeSegment(y+1, x));
                temp.push(new ShapeSegment(y+1, x-1));
                temp.push(new ShapeSegment(y+2, x));
                /*the last element should be the lowest one  from the buttom*/
                
                this.checkAssignSegments(temp, name);
                
                break;  
            }
            case "f_horizontal_reversed": {
                /*
                     ###
                      #
                */
                let temp = [];
                
                /*Checking if x positions needs to be adjusted to fit within the table*/
                x = this.adjustXPos(x, 1, 1);
                
                /*the first segment always starts with x and y*/
                temp.push(new ShapeSegment(y,   x));
                temp.push(new ShapeSegment(y, x-1));
                temp.push(new ShapeSegment(y, x+1));
                temp.push(new ShapeSegment(y+1, x));
                /*the last element should be the lowest one  from the buttom*/
                
                this.checkAssignSegments(temp, name);
                
                break;  
            }
            case "f_vertical_reversed": {
                /*
                      #
                      ##
                      #
                */
                let temp = [];
                
                /*Checking if x positions needs to be adjusted to fit within the table*/
                x = this.adjustXPos(x, 0, 1);
                
                /*the first segment always starts with x and y*/
                temp.push(new ShapeSegment(y,   x));
                temp.push(new ShapeSegment(y+1, x));
                temp.push(new ShapeSegment(y+1, x+1));
                temp.push(new ShapeSegment(y+2, x));
                /*the last element should be the lowest one  from the buttom*/
                
                this.checkAssignSegments(temp, name);
                
                break;  
            }
            default:
            {
                /*if no valid form name is provided - generate a random form*/
                console.log("No valid form name is provided. Generating a random form.");
                this.reachedDown = true;
                this.recycleForm(x, y);
                break;
            }
        }
    }
    
    adjustXPos(x, leftOffset = 0, rightOffset = 0)
    {
        /*while x + offset needed to display the full shape is outside the rendering table*/
        while(x + rightOffset >= tableNumberOfCols)
        {
            /*decrement x as much as needed in order to be able to display the element within the table*/
            x--;
        }
        
        /*while x - offset needed to display the full shape is outside the rendering table*/
        while(x - leftOffset < 0)
        {
            /*increment x as much as needed in order to be able to display the element within the table*/
            x++;
        }
        
        return x;
    }
    
    checkAssignSegments(segments, name)
    {
        /*Segment cell exist in the DOM table OR if the segments cell has just respawned*/
        if (this.validateSegments(segments) == true || segments[0].y < 0)
        {
            this.name = name;
            this.segments = segments;
            this.reachedDown = false;
            this.leftestSegment = this.getLeftestElement();
            this.rightestSegment = this.getRightestElement();
            this.lowestSegment = this.getLowestElement();
            this.highestSegment = this.getHighestElement();
        }
    }
    
    validateSegments(segments_list)
    {
        //Clearing the form drawing to help processing of notExistsSegmentAt()
        if(this.reachedDown == false)
        {
            this.clearFormDrawing();
        }
        for(var index = 0; index < segments_list.length; index++)
        {
            var result = segments_list[index].notExistsSegmentAt( segments_list[index].y, segments_list[index].x )
            
            if(result == false)
            {
                //console.log("Segment: invalid");
                if(this.reachedDown == false)
                {
                    this.drawForm();
                }
                return false;
            }
        }
        return true;
    }
    
    checkBottomReached()
    {
        if(this.reachedDown == false)
        {
            /*Perform the check only if all segments are on the screen*/
            if(this.highestSegment.y < tableNumberOfRows)
            {
                let index = this.segments.length -1;
                
                //Clearing the form before the check
                this.clearFormDrawing();
                
                while(index >= 0)
                {
                    let result = this.segments[index].notExistsSegmentAt(this.segments[index].y+1, this.segments[index].x);
                    
                    index--;
                    
                    if(result == false)
                    {
                        this.reachedDown = true;
                        break;
                    }
                }
                
                //Redraw the form after the check
                this.drawForm();
            }
        }
    }
    
    MoveDown()
    {
        //Check if any of the segments has reached the bottom
        this.checkBottomReached();
        
        if(this.reachedDown == false)
        {
            let index = this.segments.length -1;
            
            while(index >= 0)
            {
                this.segments[index].clear();
                this.reachedDown = this.segments[index].moveDown();
                index--;
                
                if(this.reachedDown)
                {
                    break;
                }
            }
            
            //Redrawing segments
            //Redrawing after all segments are moved will help avoid drawing artifacts
            index = this.segments.length -1;
            while(index >= 0)
            {

                this.segments[index].draw();
                index--;
            }
        }
    }
    
    MoveLeft()
    {
        if(this.reachedDown == false)
        {
            
            let index = this.segments.length -1;
            
            while(index >= 0)
            {
                 if ( this.leftestSegment.notExistsSegmentAt(this.leftestSegment.y, this.leftestSegment.x-1) )
                 {
                     index--;
                 }
                 else
                 {
                     /*At least one segment cannot be moved anymore*/
                     return;
                 }
            }
            
            //Clearing screen a moving segments
            index = this.segments.length -1;
            while(index >= 0)
            {
                this.segments[index].clear();
                this.segments[index].moveLeft();
                index--;
            }
            
            //Redrawing segments
            //Redrawing after all segments are moved will help avoid drawing artifacts
            index = this.segments.length -1;
            while(index >= 0)
            {

                this.segments[index].draw();
                index--;
            }
        }
    }
    
    MoveRight()
    {
        if(this.reachedDown == false)
        {
            let index = this.segments.length -1;
            while(index >= 0)
            {
                 if (this.rightestSegment.notExistsSegmentAt(this.rightestSegment.y, this.rightestSegment.x+1))
                 {
                     index--;
                 }
                 else
                 {
                     /*At least one segment cannot be moved anymore*/
                     return;
                 }
            }
            
            //Moving all segment to the right
            index = this.segments.length -1;
            while(index >= 0)
            {
                this.segments[index].clear();
                this.segments[index].moveRight();
                index--;
            }
                
            //Redrawing segments
            //Redrawing after all segments are moved will help avoid drawing artifacts
            index = this.segments.length -1;
            while(index >= 0)
            {

                this.segments[index].draw();
                index--;
            }
        }
    }
    
    getLowestElement()
    {
        var lowestIndex = 0;
        for(var index = 0; index < this.segments.length; index++)
        {
            if (this.segments[lowestIndex].y > this.segments[index].y)
            {
                lowestIndex = index;
            }
        }
        return this.segments[lowestIndex];
    }
    
    getHighestElement()
    {
        var highestIndex = 0;
        for(var index = 0; index < this.segments.length; index++)
        {
            if (this.segments[highestIndex].y < this.segments[index].y)
            {
                highestIndex = index;
            }
        }
        return this.segments[highestIndex];
    }
    
    getLeftestElement()
    {
        var leftestIndex = 0;
        for(var index = 0; index < this.segments.length; index++)
        {
            if (this.segments[leftestIndex].x > this.segments[index].x)
            {
                leftestIndex = index;
            }
        }
        return this.segments[leftestIndex];
    }
    
    getRightestElement()
    {
        var rightestIndex = 0;
        for(var index = 0; index < this.segments.length; index++)
        {
            if (this.segments[rightestIndex].x < this.segments[index].x)
            {
                rightestIndex = index;
            }
        }
        return this.segments[rightestIndex];
    }
    
    RotateShape()
    {
        let x = this.segments[0].x
        let y = this.segments[0].y
        
        if(this.reachedDown == false)
        {
            switch(this.name)
            {
                case "square": {
                    /*Nothing to do*/
                    break;
                }
                case "i_vertical":{
                    /*
                        #
                        #
                        #
                        #
                    */
                    this.FormBuilder("i_horizontal", y, x);
                    break;
                }
                case "i_horizontal":{
                    /*
                        ####
                    */
                    
                    this.FormBuilder("i_vertical", y, x);
                    break;
                }
                case "s_vertical": {
                    /*
                        #
                       ##
                       # 
                    */
                    this.FormBuilder("s_horizontal_flipped", y, x);
                    break;
                }
                case "s_horizontal_flipped": {
                    /*
                        ##
                         ##
                    */
                    this.FormBuilder("s_vertical", y, x);
                    break;
                }
                case "s_vertical_flipped": {
                    /*
                       # 
                       ##
                        #
                    */
                    
                    this.FormBuilder("s_horizontal", y, x);
                    break;
                }
                case "s_horizontal": {
                    /*
                         ##
                        ##
                    */
                    this.FormBuilder("s_vertical_flipped", y, x);
                    break;

                }
                case "l_vertical_normal": {
                    /*
                         #
                         #
                         ##
                    */
                    this.FormBuilder("l_horizontal_normal", y, x);
                    break;
                }
                case "l_horizontal_normal": {
                    /*
                           #
                         ###
                    */
                    this.FormBuilder("l_vertical_flipped_reversed", y, x);
                    break;
                }
                case "l_vertical_flipped_reversed": {
                    /*
                          ##
                           #
                           #
                    */
                    this.FormBuilder("l_horizontal_flipped_reversed", y, x);
                    break;
                }
                case "l_horizontal_flipped_reversed": {
                    /*
                          ###
                          #
                    */
                    this.FormBuilder("l_vertical_normal", y, x);
                    break;
                }
                case "l_vertical_normal_reversed": {
                    /*
                          ##
                          #
                          #
                    */
                    this.FormBuilder("l_horizontal_normal_reversed", y, x);
                    break;
                }
                case "l_horizontal_normal_reversed": {
                    /*
                          ####
                          #
                    */
                    
                    this.FormBuilder("l_vertical_flipped", y, x);
                    break;
                }
                case "l_vertical_flipped": {
                    /*
                           #
                           #
                          ##
                    */
                    this.FormBuilder("l_horizontal_flipped", y, x);
                    break;
                }
                case "l_horizontal_flipped": {
                    /*
                          ###
                            #
                    */
                    this.FormBuilder("l_vertical_flipped_reversed", y, x);
                    break; 
                }
                case "f_horizontal": {
                    /*
                          #
                         ###
                    */
                    
                    this.FormBuilder("f_vertical", y, x);
                    break;
                }
                case "f_vertical": {
                    /*
                          #
                         ##
                          #
                    */
                    
                    this.FormBuilder("f_horizontal_reversed", y, x);
                    break;
                }
                case "f_horizontal_reversed": {
                    /*
                         ###
                          #
                    */
                    this.FormBuilder("f_vertical_reversed", y, x);
                    break;
                }
                case "f_vertical_reversed": {
                    /*
                          #
                          ##
                          #
                    */
                    this.FormBuilder("f_horizontal", y, x);
                    break;
                }
            }
        }
    }
    
    FlipShapeHorizontally()
    {
        let x = this.segments[0].x
        let y = this.segments[0].y
        
        if(this.reachedDown == false)
        {
            switch(this.name)
            {
                case "square": {
                    /*
                        ##
                        ##
                    */
                    /*Nothing to do - No flip available for this form*/
                    break;
                }
                case "i_vertical":{
                    /*
                        #
                        #
                        #
                        #
                    */
                    
                    /*Nothing to do - No flip available for this form*/
                    break;
                }
                case "i_horizontal":{
                    /*
                        ####
                    */
                    
                    /*Nothing to do - No flip available for this form*/
                    break;
                }
                
                case "s_vertical": {
                    /*
                        #
                       ##
                       # 
                    */
                    this.FormBuilder("s_vertical_flipped", y, x);
                    break;
                }
                case "s_vertical_flipped": {
                    /*
                       # 
                       ##
                        #
                    */
                    
                    this.FormBuilder("s_vertical", y, x);
                    break;
                }
                case "s_horizontal": {
                    /*
                         ##
                        ##
                    */
                    this.FormBuilder("s_horizontal_flipped", y, x);
                    break;
                }
                case "s_horizontal_flipped": {
                    /*
                        ##
                         ##
                    */
                    this.FormBuilder("s_horizontal", y, x);
                    break;
                }
                
                case "l_vertical_normal_reversed": {
                    /*
                          ##
                          #
                          #
                    */
                    this.FormBuilder("l_vertical_flipped_reversed", y, x);
                    break;
                }
                case "l_vertical_flipped_reversed": {
                    /*
                          ##
                           #
                           #
                    */
                    this.FormBuilder("l_vertical_normal_reversed", y, x);
                    break;
                }
                
                case "l_horizontal_flipped_reversed": {
                    /*
                          #
                          ####
                    */
                    
                    this.FormBuilder("l_horizontal_normal", y, x);
                    break;
                }
                case "l_horizontal_normal": {
                    /*
                           #
                        ####
                    */
                    this.FormBuilder("l_horizontal_flipped_reversed", y, x);
                    break;
                }
                
                case "l_horizontal_normal_reversed": {
                    /*
                          ####
                          #
                    */
                    
                    this.FormBuilder("l_horizontal_flipped", y, x);
                    break;
                }
                case "l_horizontal_flipped": {
                    /*
                          ####
                             #
                    */
                    this.FormBuilder("l_horizontal_normal_reversed", y, x);
                    break;
                }
                
                case "l_vertical_flipped": {
                    /*
                           #
                           #
                          ##
                    */
                    this.FormBuilder("l_vertical_normal", y, x);
                    break;
                }
                case "l_vertical_normal": {
                    /*
                         #
                         #
                         ##
                    */
                    this.FormBuilder("l_vertical_flipped", y, x);
                    break;
                }
                
                case "f_vertical": {
                    /*
                          #
                         ##
                          #
                    */
                    this.FormBuilder("f_vertical_reversed", y, x);
                    break;
                }
                case "f_vertical_reversed": {
                    /*
                          #
                          ##
                          #
                    */
                    this.FormBuilder("f_vertical", y, x);
                    break;
                }
            }
        }
    }
    
    FlipShapeVertically()
    {
        let x = this.segments[0].x
        let y = this.segments[0].y
        
        if(this.reachedDown == false)
        {
            switch(this.name)
            {
                case "square": {
                    /*
                        ##
                        ##
                    */
                    /*Nothing to do - No flip available for this form*/
                    break;
                }
                case "i_vertical":{
                    /*
                        #
                        #
                        #
                        #
                    */
                    
                    /*Nothing to do - No flip available for this form*/
                    break;
                }
                case "i_horizontal":{
                    /*
                        ####
                    */
                    
                    /*Nothing to do - No flip available for this form*/
                    break;
                }
                case "s_vertical": {
                    /*
                        #
                       ##
                       # 
                    */
                    this.FormBuilder("s_vertical_flipped", y, x);
                    break;
                }
                case "s_vertical_flipped": {
                    /*
                       # 
                       ##
                        #
                    */
                    
                    this.FormBuilder("s_vertical", y, x);
                    break;
                }
                case "s_horizontal": {
                    /*
                         ##
                        ##
                    */
                    this.FormBuilder("s_horizontal_flipped", y, x);
                    break;
                }
                case "s_horizontal_flipped": {
                    /*
                        ##
                         ##
                    */
                    this.FormBuilder("s_horizontal", y, x);
                    break;
                }
                case "l_vertical_normal_reversed": {
                    /*
                          ##
                          #
                          #
                    */
                    this.FormBuilder("l_vertical_normal", y, x);
                    break;
                }
                case "l_vertical_normal": {
                    /*
                         #
                         #
                         ##
                    */
                    this.FormBuilder("l_vertical_normal_reversed", y, x);
                    
                    break;  
                }
                
                
                case "l_vertical_flipped_reversed": {
                    /*
                          ##
                           #
                           #
                    */
                    this.FormBuilder("l_vertical_flipped", y, x);
                    break;
                }
                case "l_vertical_flipped": {
                    /*
                           #
                           #
                          ##
                    */
                    this.FormBuilder("l_vertical_flipped_reversed", y, x);
                    break;
                }
                case "l_horizontal_flipped_reversed": {
                    /*
                          #
                          ####
                    */
                    this.FormBuilder("l_horizontal_normal_reversed", y, x);
                    break;
                }
                case "l_horizontal_normal_reversed": {
                    /*
                          ####
                          #
                    */
                    
                    this.FormBuilder("l_horizontal_flipped_reversed", y, x);
                    break;
                }
                case "l_horizontal_normal": {
                    /*
                           #
                         ###
                    */
                    this.FormBuilder("l_horizontal_flipped", y, x);
                    
                    break;  
                }
                case "l_horizontal_flipped": {
                    /*
                          ###
                            #
                    */
                    this.FormBuilder("l_horizontal_normal", y, x);
                    break;
                }
                case "f_horizontal": {
                    /*
                          #
                         ###
                    */
                    
                    this.FormBuilder("f_horizontal_reversed", y, x);
                    break;
                }
                case "f_horizontal_reversed": {
                    /*
                         ###
                          #
                    */
                    
                    this.FormBuilder("f_horizontal", y, x);
                    break;
                }
            }
        }
    }
    
    clearFormDrawing()
    {
        if(this.segments && this.segments.length > 0)
        {
            let index = this.segments.length-1;
            
            while(index >= 0)
            {
                //remove one element at index 0
                this.segments[index].clear();
                index--;
            }
        }
    }
    
    drawForm()
    {
        if(this.segments && this.segments.length > 0)
        {
            let index = this.segments.length -1;
            
            while(index >= 0)
            {
                //remove one element at index 0
                this.segments[index].draw();
                index--;
            }
        }
    }
    
    eraseForm()
    {
        if(this.segments && this.segments.length > 0)
        {
            let index = this.segments.length -1;
            
            while(this.segments.length > 0 )
            {
                //remove one element at index 0
                this.segments[0].clear();
                
                //splice() modifies the array in place and returns the removed elements as a new array.
                this.segments.splice(0, 1);
            }
        }
    }
    
    async checkScore()
    {
        if (!this.reachedDown)
        {
            return false;
        }
        
        let rowsToClear = [];

        // find all full rows first
        for (let i = tableNumberOfRows - 1; i >= 0; i--)
        {
            let hit = 0;

            for (let j = 0; j < tableNumberOfCols; j++)
            {
                let elem = document.getElementById(getElementIdName(i, j));
                
                if (elem.style.backgroundColor === "blue")
                {
                    hit++;
                }
            }

            if (hit === tableNumberOfCols)
            {
                rowsToClear.push(i);
            }
        }

        if (rowsToClear.length === 0) return false;

        // animate all rows
        let animations = [];

        for (let row of rowsToClear)
        {
            for (let j = 0; j < tableNumberOfCols; j++)
            {
                let elem = document.getElementById(getElementIdName(row, j));
                
                //add animation
                elem.classList.add("fadingout");
                
                //clear background-color
                elem.style.backgroundColor = "transparent";
                
                //add animation to animationlist to keep track of how many waits to perform
                animations.push(waitForAnimation(elem, (elem) => {
                    // remove animation class
                    elem.classList.remove("fadingout");

                    // reset inline styles if your animation changed them
                    elem.style.opacity = "1";
                    elem.style.transform = "";
                }));
            }
        }
        
        //wait for all animations to finish
        await Promise.all(animations);
        
        /*rowsToClear is in descending order because the loop above was run from tableNumberOfRows - 1 to 0
        
        By sorting the rowsToClear to ascending order, we can run the loop in normal order from 0 to rowsToClear.length
        */
        
        rowsToClear.sort( (a,b) => a-b); //sorting to ascending order
        
        // collapse rows after animation
        for (let index = 0; index < rowsToClear.length; index++)
        {
            //if multiple rows... the row number changes each time a row is copied
            //so adjustments are needed
            
            let adjustedRow = rowsToClear[index] - index; // accounts for previous calls of copyRowsAbove()
            
            this.copyRowsAbove(adjustedRow, index);
            score += 1 + index;
        }

        return true;
    }
    
    copyRowsAbove(row, offset=0)
    {
        for (var i = row; i > 0; i--)
        {
            for (var j = 0; j < tableNumberOfCols; j++)
            {
                let bottomElemName = getElementIdName(i + offset, j);
                let topElemName = getElementIdName(i - 1 + offset, j);

                if (document.getElementById(topElemName).style.backgroundColor == "blue")
                    document.getElementById(bottomElemName).style.backgroundColor = "blue";
                else
                    document.getElementById(bottomElemName).style.backgroundColor = "transparent";
            }
        }

        // clear top row
        for (var j = 0; j < tableNumberOfCols; j++)
        {
            let elemName = getElementIdName(0 + offset, j);
            document.getElementById(elemName).style.backgroundColor = "transparent";
        }
    }
    
    isGameOver()
    {
        if(this.reachedDown == true)
        {   
            for(let index=0; index < this.segments.length; index++)
            {
                if(this.segments[index].y <= gameOverRow)
                {
                    game_started = false;
                    document.getElementById("gameStatus").innerHTML = "Game Over";
                    document.getElementById("gameStatus").style.backgroundColor = "rgba(255,0,0,0.2)";
                    document.getElementById("pausegame").disabled = true;
                    addGameOverEffect();
                    return true;
                }
            }
        }
        return false;
    }
}

function StartGame()
{
    //sq.FormRecycle(); // let it be randomized.
    game_started = true;
    updateScore();
    document.getElementById("startgame").disabled = true;
    document.getElementById("pausegame").disabled = false;
    document.getElementById("restartgame").disabled = false;
    document.getElementById("gameStatus").innerHTML = "Game Started";
    
}

function PauseGame()
{
    if(game_paused == false)
    {
        game_paused = true;
        document.getElementById("gameStatus").innerHTML = "Game Paused";
        document.getElementById("gameStatus").style.backgroundColor = "rgba(0,255,0,0.2)";
    }
    else
    {
        game_paused = false;
        document.getElementById("gameStatus").innerHTML = "Game Started";
        document.getElementById("gameStatus").style.backgroundColor = "rgba(0,0,255,0.2)";
    }
}

function RestartGame()
{
    
    /*Clearing the table*/
    for(var i = 0; i < tableNumberOfRows; i++)
    {
        for(var j=0; j < tableNumberOfCols; j++)
        {
            var elem = document.getElementById(getElementIdName(i, j));
            elem.style.backgroundColor = "transparent";
            elem.classList.remove("gameOverEffect");
        }
    }
    
    /*Resetting the game*/
    score = 0;
    updateScore();
    sq.reachedDown = true;
    sq.recycleForm();
    game_started = true;
    gameTickRunning = false;
    document.getElementById("startgame").disabled = true;
    document.getElementById("restartgame").disabled = false;
    document.getElementById("pausegame").disabled = false;
    document.getElementById("gameStatus").style.backgroundColor = "rgba(0,0,255,0.2)";
}

function waitForAnimation(element, recoverFunction)
{
    return new Promise(resolve => {

        function onEnd()
        {
            if(recoverFunction)
            {
                recoverFunction(element);
            }
            resolve();
        }

        element.addEventListener("animationend", onEnd, { once: true });
    });
}

function addGameOverEffect()
{
    for(var i = 0; i < tableNumberOfRows; i++)
    {
        for(var j=0;j < tableNumberOfCols;j++)
        {
            var elem = document.getElementById(getElementIdName(i, j));
            
            if(elem && elem.style.backgroundColor == "blue")
            {
                elem.classList.add("gameOverEffect");
            }
        }
    }
}

document.onkeydown = function (e) //trigger event when key is pressed down
{
    switch (e.key) //if the key pressed is SPACE KEY
    {
        case "a":
        case "A":
        case "ArrowLeft":
        {
            TurnLeft();
            break;
        }
        case "d":
        case "D":
        case "ArrowRight":
        {
            TurnRight();
            break;
        }
        case "s":
        case "S":
        case "ArrowDown":
        {
            Accelerate();
            break;
        }
        case "Space":
        case " ":
        {
            Rotate();
            break;
        }
        case "Shift":
        {
            FlipHorizontally();
            break;
        }
        case "Control":
        {
            FlipVertically();
            break;
        }
        default:
        {
            break;
        }
    }
}

document.onkeyup = function (e) //trigger event when key is pressed down
{
    if(e.key == "ArrowDown")
    {
        Decelerate();
    }
}

function Accelerate()
{
    window.AccelerateGame = true;
}

function Decelerate()
{
    window.AccelerateGame = false;
}

function Rotate()
{
    sq.RotateShape();
}

function FlipHorizontally()
{
    sq.FlipShapeHorizontally();
}

function FlipVertically()
{
    sq.FlipShapeVertically();
}

function TurnLeft()
{
    sq.MoveLeft();
}

function TurnRight()
{
    sq.MoveRight();
}

async function updateScore()
{
    var scoreBoard = document.getElementById("score");
    
    if( ("Score: " + score ) != scoreBoard.innerHTML )
    {

        scoreBoard.innerHTML = "Score: " + score;
        
        scoreBoard.classList.add("scoreBoard")
        
        var animations = [];
        
        animations.push( waitForAnimation(scoreBoard, (scoreBoard) => {
            scoreBoard.classList.remove("scoreBoard");
        }));

        //wait for all animations to finish
        await Promise.all(animations);
    }
}

function createTable()
{
    var game_div = document.getElementById("game_div");
    if(game_div)
    {
        var table = document.createElement("table");
        
        for(var row = 0; row < tableNumberOfRows; row++)
        {
            var table_row = document.createElement("tr");
            for(var col = 0; col < tableNumberOfCols; col++)
            {
                var cell = document.createElement("td");
                
                let cell_id = getElementIdName(row, col);
                
                cell.id = cell_id
                cell.style.backgroundColor = "transparent";
                
                /*Adding delimiter*/
                if(row == gameOverRow)
                {
                    cell.style.borderBottom = "solid 2px darkred";
                }
                else if(row == (gameOverRow+1) )
                {
                    cell.style.borderTop = "solid 2px darkred";
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

//Prevent the default behaviour on this window.
window.addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);

document.addEventListener('DOMContentLoaded', async () => {

    if( createTable() )
    {
        //sq = new TetrisShape("l_horizontal_flipped_reversed", -1, 3); // let this be default;
        sq = new TetrisShape("", -1, 3); // generate a random shape
        
        /*setInterval does not await for async functions to execute.
        After async finished setInterval will compensate for the lost time... and may end up colling multiple times
        the function - which will damage the gameloop by throwing multiple bricks onto the game.
        
        User can only control one brick and the game can only handle one brick at a time.
        
        Stacking mechanism using gameTickRunning was added into place to block multiple executions of setInterval
        */
        
        setInterval(async function()
        {
            if(game_started && game_paused == false)
            {
                /*Block the execution of the function if another function instance is in await*/
                if (gameTickRunning)
                {
                    return;   // ← prevents stacking
                }
                
                //Enable
                gameTickRunning = true;
                
                msCounter += reccurence;
                if (msCounter % normalGameSpeed == 0 || AccelerateGame)
                {
                    if(sq.reachedDown)
                    {
                        if(sq.isGameOver() == false)
                        {
                            await sq.checkScore();
                            /*in case 2 line are completely checkScore() will make both dissappear at once*/
                            
                            sq.recycleForm();
                            await updateScore();
                            Decelerate();
                        }
                        else
                        {
                            /*Do nothing - the game will stop after this iteration*/
                        }
                    }
                    else
                    {
                        sq.MoveDown();
                    }
                }
                
                //Disable
                gameTickRunning = false;
            }
        }, reccurence);
    }
});