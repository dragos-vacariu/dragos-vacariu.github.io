var carTextures = [];
carTextures.push("url('cars_facing_down/car0.png')");
carTextures.push("url('cars_facing_down/car1.png')");
carTextures.push("url('cars_facing_down/car2.png')");
carTextures.push("url('cars_facing_down/car3.png')");
carTextures.push("url('cars_facing_down/car4.png')");
carTextures.push("url('cars_facing_down/car5.png')");
carTextures.push("url('cars_facing_down/car6.png')");
carTextures.push("url('cars_facing_down/car7.png')");
carTextures.push("url('cars_facing_down/car8.png')");
carTextures.push("url('cars_facing_down/car9.png')");

var carTexturesReversed = [];
carTexturesReversed.push("url('cars_facing_up/car10.png')");
carTexturesReversed.push("url('cars_facing_up/car11.png')");
carTexturesReversed.push("url('cars_facing_up/car12.png')");
carTexturesReversed.push("url('cars_facing_up/car13.png')");

var numberOfRows = 15;
var numberOfCols = 15;
var injuries = 0;
var max_number_of_injuries = 10;
var game_started = false;

class Car
{
	constructor(x)
	{
        this.InitForm();
		this.PosX = x;
        this.recurrenceCounter = 0;
	}
    InitForm()
    {
        var directionOfTravel = Math.floor(Math.random() * 2)
        if (directionOfTravel == 1)
        {
            this.PosY = 0;
            this.direction = "bottom";
            var texturePick = Math.floor(Math.random() * carTextures.length);
            this.texture = carTextures[texturePick]
            
        }
        else
        {
            this.PosY = numberOfRows;
            this.direction = "top";
            var texturePick = Math.floor(Math.random() * carTexturesReversed.length);
            this.texture = carTexturesReversed[texturePick]
        }
        this.Speed = (Math.floor(Math.random() * 7) + 2)
    }
	Draw()
	{
        if (this.checkCollision() == false)
        {
            document.getElementById("elem"+ numberToString(this.PosY)+ numberToString(this.PosX)).style.backgroundImage=this.texture;
        }
        else
        {
            person.Clear();
            window.person = new Person();
            window.injuries++;
            window.updateInjuries();
            if (window.injuries == window.max_number_of_injuries)
            {
                window.game_started = false;
                document.getElementById("gameStatus").innerHTML = "GAME OVER: YOU SUFFERED TOO MANY INJURIES!";
            }
        }
	}
    Clear()
    {
        document.getElementById("elem"+ numberToString(this.PosY)+ numberToString(this.PosX)).style.backgroundImage="";
    }
    Move()
    {
        this.recurrenceCounter++;
        if (this.recurrenceCounter >= this.Speed)
        {
            this.recurrenceCounter=0;
            this.Clear();
            if(this.direction =="top")
            {
                if (this.PosY <= 0 )
                {
                    this.InitForm();
                }
                else
                {
                    this.PosY--;
                }
            }
            else
            {
                if (this.PosY >= numberOfRows)
                {
                    this.InitForm();
                }
                else
                {
                    this.PosY++;
                }
            }
            this.Draw();
            }
    }
    checkCollision()
    {
        if(this.PosX == person.PosX && this.PosY == person.PosY)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
}

class Person
{
    constructor()
	{
		this.PosX = 0;
		this.PosY = parseInt(numberOfRows/2);
        this.texture = "url('person.png')";
	}
    Draw()
	{
        document.getElementById("elem"+ numberToString(this.PosY)+ numberToString(this.PosX)).style.backgroundImage=this.texture;
        if (this.PosX == numberOfCols)
        {
            document.getElementById("gameStatus").innerHTML = "The person crossed the street safely.";
            window.game_started=false;
        }
	}
    Clear()
	{
        document.getElementById("elem"+ numberToString(this.PosY)+ numberToString(this.PosX)).style.backgroundImage="";
	}
    MoveUp()
    {
        if (this.PosY > 0 )
        {
            this.Clear();
            this.PosY--;
        }
    }
    MoveDown()
    {
        if (this.PosY < numberOfRows)
        {
            this.Clear();
            this.PosY++;
        }
    }
    MoveLeft()
    {
        if (this.PosX > 0)
        {
            this.Clear();
            this.PosX--;
        }
    }
    MoveRight()
    {
        if (this.PosX < numberOfCols)
        {
            this.Clear();
            this.PosX++;
        }
    }
}

var cars = [];
function createCars()
{
    window.cars.push(new Car(1,0, carTextures[0]));
    window.cars.push(new Car(2,0, carTextures[1]));
    window.cars.push(new Car(3,0, carTextures[2]));
    window.cars.push(new Car(5,0, carTextures[3]));
    window.cars.push(new Car(7,0, carTextures[4]));
    window.cars.push(new Car(9,0, carTextures[5]));
    window.cars.push(new Car(10,10, carTextures[12]));
    window.cars.push(new Car(11,10, carTextures[10]));
    window.cars.push(new Car(12,0, carTextures[6]));
    window.cars.push(new Car(13,10, carTextures[10]));
    window.cars.push(new Car(14,0, carTextures[7]));
}

var person = new Person();

var recurrence = 100;

setInterval(function() {
	if(game_started)
	{
        cars.forEach(element => {element.Move()});
        person.Draw();
	}
}, recurrence);

function StartGame()
{
	game_started = true;
	updateInjuries();
    createCars();
	document.getElementById("startgame").disabled = true;
	document.getElementById("controlInfo").innerHTML = "Use the ArrowKeys to move the person across the street.";
	document.getElementById("restartgame").disabled = false;
}

document.onkeydown = function (e) //trigger event when key is pressed down
{
    if (e.key == "ArrowUp") //if the Arrow UP key is pressed
    {
        person.MoveUp()
    }
    else if(e.key == "ArrowDown")
    {
        person.MoveDown()
    }
    else if(e.key == "ArrowLeft")
    {
        person.MoveLeft()
    }
    else if(e.key == "ArrowRight")
    {
        person.MoveRight()
    }
}

function RestartGame()
{
	for(var i = 0; i<16; i++)
	{
		for(var j=0;j<16;j++)
		{
			document.getElementById("elem" + numberToString(i) + numberToString(j)).style.backgroundImage = "";
		}
	}
	window.blocksClimbed = 0;
	window.spareBlocks = 3;
	updateInjuries();
    createCars();
	person = new Person();
	document.getElementById("gameStatus").innerHTML = "";
	game_started = true;
	document.getElementById("startgame").disabled = true;
	document.getElementById("restartgame").disabled = false;
}
function numberToString(n){
    return n > 9 ? "" + n: "0" + n;
}

function updateInjuries()
{
	document.getElementById("injuries").innerHTML = "Injuries: " + window.injuries;
}