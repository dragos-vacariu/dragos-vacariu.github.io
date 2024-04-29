var app = angular.module('myApplication', []);
app.controller('Controller', Controller_Function);

function Controller_Function($scope)
{
	//Initializing the models;
	$scope.dotSlash = "./";
	$scope.exitDir = "../"
	$scope.portfolio = "dragos-vacariu.github.io/";
	
	$scope.java_page = {name: "Java Projects", value: "catalogue/Java-Projects.html"}; /*currently not indexed*/
	$scope.unity_page = {name: "Unity C# Projects", value: "catalogue/Unity-Csharp-Projects.html"};
	$scope.python_page = {name: "Python Projects", value: "catalogue/Python-Projects.html"};
	$scope.html_page = {name: "Html Projects", value : "catalogue/Html-Projects.html"};
	$scope.c_sharp_page = {name: "C# Projects", value : "catalogue/CSharp-Projects.html"};
	$scope.cpp_page = {name: "C++ Projects", value : "catalogue/Cpp-Projects.html"};
	$scope.cpp_opengl_page = {name: "C++ OpenGL Projects", value : "catalogue/Cpp-OpenGL-Projects.html"};
	$scope.angularjs_page = {name: "AngularJS Exercises", value : "catalogue/AngularJS.html"};
	$scope.javascript_games_page = {name: "JavaScript Games", value : "catalogue/Javascript-Games.html"};
	$scope.javascript_games_presentation_video = {name: "Video Presentation Page", value : "Javascript-Games-Presentation-Video.html"};
	$scope.javascript_webapps_page = {name: "JavaScript WebApps", value : "catalogue/Javascript-WebApps.html"}; /*currently not indexed*/
	$scope.portable_downloads_page = {name: "Portable Downloads", value : "catalogue/Portable-Downloads.html"};
	$scope.github_repository_page = {name: "GitHub Repositories", value : "https://github.com/dragos-vacariu?tab=repositories"};

	$scope.pageObject = {
		footer_table_headers : ["Template Info:", "Connections:", "Tools Used:"],				
		template_info : ["Author: Dragos Vacariu", "Design: 2017 rev 2024", "Title: Portfolio", "Hosted by: GitHub"],
		tools_used : ["HTML4", "HTML5", "CSS3", "CSS", "JavaScript", "Angular"],
		connections_list : ["GitHub.com", "LinkedIn.com",  "w3schools.com"],
		footer_copyright : "Dragos Vacariu © 2024",
		footer_paragraph : "Porfolio implemented as means to present and/or demonstrate professional skills, work and efforts put into practice for building up a reliable knowledge foundation to facilitate the adaptability within a new environment, industry, toolchain workplace or with various technologies within the IT industry.",
		page_title : "Portfolio",
		page_navigation : [
			{name: "Home", value : "./"},
			{name: "Catalogue", value : "#"},
			{name: "Contact", value : "./contact.html"},
			{name: "About", value : "./about.html"},
			{name: "Learning Portal", value : "./portal.html"},
		],
		page_navigation_dropdown : [
			/*$scope.java,*/
			$scope.unity_page,
			$scope.javascript_games_page,
			$scope.python_page,
			$scope.c_sharp_page,
			$scope.cpp_opengl_page,
			$scope.html_page,
			$scope.angularjs_page,
			$scope.cpp_page,
			/*$scope.javascript_webapps_page,*/
			$scope.portable_downloads_page,
			$scope.github_repository_page,
		],
		
	};
	$scope.java_catalogue = [
			{name: "Java Racing Environment", value : "./Projects GUI/project44 drag racing simulator/Java Racing Environment.html"},
			{name: "Java MP3 Player", value : "./Projects GUI/project34 java mp3 player application/Java MP3 Player.html"},
	];
	$scope.unity_csharp_catalogue = [
			{name: "TowerBlocks Game", value : "Unity-Csharp-Projects/TowerBlocks.html"},
			{name: "Unity Racing Environment", value : "Unity-Csharp-Projects/Drag Racing.html"},
	];
	$scope.python_projects_catalogue = [
			{name: "Python MP3 Player", value : "./pyplay mp3 player/PyPlay Mp3 Player.html"},
	];
	$scope.html_projects_catalogue = [
			{name: "Full Web Page Template", value : "./Web Templates/project38 full web page template/index.html"},
			{name: "Musician Web Page Template", value : "./Web Templates/project39 musician web page template/index.html"},
			{name: "Python MP3 Player Webpage", value : "./Web Templates/project40 python mp3 player webpage/index.html"},
			{name: "Free Sound Effects Web Template", value : "./Web Templates/free sound effects web template/index.html"},
	];
	$scope.c_sharp_projects_catalogue = [
			{name: "WWBM Quizz Game", value : "./VS Projects GUI/WWBM Quizz Game/WWBM Quizz Game.html"},
			{name: "Basic MP3 Player", value : "./VS Projects GUI/Basic MP3Player/MP3Player.html"},
	];
	$scope.cpp_projects_catalogue = [
			{name: "Pocket Calculator", value : "./Projects GUI/Pocket Calculator Project/Pocket Calculator.html"},
	];
	$scope.cpp_opengl_projects_catalogue = [
			{name: "Traffic Simulator 2D", value : "./Traffic Simulator 2D/Traffic Simulator 2D.html"},
	];
	$scope.angularjs_projects_catalogue = [
			{value: "./Applications/project26-27 car shop catalogue/project26 car shop catalogue.html" , name : "Car Shop"},
			{value: "./Applications/project26-27 car shop catalogue/project27 car shop catalogue new template.html" , name : "Car Shop New"},
			{value: "./Applications/project24 customized tables.html" , name : "Customized Tables"},
			{value: "./Applications/project25 shopping cart.html" , name : "Shopping Cart"},
			{value: "./Applications/project22 color picker, decimal to hex.html" , name : "Color Picker"},
			{value: "./Applications/project23 border picker.html" , name : "Border Picker"},
			{value: "./Applications/project17 matrix determinant calculator ng-change.html" , name : "Matrix Determinant Calculator"},
			{value: "./Applications/project18 decimal to binary converter, loops in angularjs.html" , name : "Decimal to Binary Converter"},
			{value: "./Applications/project21 bitwise operations calculator.html" , name : "Bitwise operations"},
			{value: "./Applications/project20 age calculator.html" , name : "Age Calculator"},
			{value: "./Applications/project13 simple calculator.html" , name : "Simple Calculator"},
			{value: "./Applications/project14 item list.html" , name : "Item List"},
			{value: "./Applications/project15 add items to cart using angular.foreach.html" , name : "Add items to Cart"},
			{value: "./Applications/project16 display content according to href.html" , name : "Display HREF Content"},
			{value: "./Applications/project19 letter to symbol replacer.html" , name : "Letter to symbol replacer"},
			{value: "./Applications/project28 checkerboard.html" , name : "Checkerboard"},
	];
	$scope.javascript_games_catalogue = [
			{name: "Knight Chess Game", value : "./knight_chess_resources/knight_chess_game.html"},
			{name: "Snake Game", value : "./snake_resources/snake_game.html"},
			{name: "Tetris Game", value : "./tetris_resources/tetris_game.html"},
			{name: "TowerBlocks Game", value : "./towerblocks_resources/tower_blocks_game.html"},
			{name: "Canvas Snake", value : "./canvas_snake/canvas_snake.html"},
			$scope.javascript_games_presentation_video,
	];
	$scope.javascript_games_videos_catalogue = [
			{name: "Knight Chess Game Video", value : "./Javascript-Games-Presentation-Video/knight_chess_video_page.html"},
			{name: "Snake Game Video", value : "./Javascript-Games-Presentation-Video/snake_video_page.html"},
			{name: "Tetris Game Video", value : "./Javascript-Games-Presentation-Video/tetris_video_page.html"},
			{name: "TowerBlocks Game Video", value : "./Javascript-Games-Presentation-Video/towerblocks_video_page.html"},
			{name: "Canvas Snake Game Video", value : "./Javascript-Games-Presentation-Video/canvas_snake_video_page.html"},
	];
	$scope.javascript_webapps_catalogue = [
			{name: "Message Encoder", value : "./webapps_resources/message_encoder.html"},
			{name: "Message Decoder", value : "./webapps_resources/message_decoder.html"},
			{name: "RandomORG", value : "./webapps_resources/random_org.html"},
			{name: "Roadcross Game", value : "./roadcross_resources/roadcross_game.html"},
	];
	$scope.portable_downloads = [
			{name: "Python MP3 Player - Runnable Script", value : "./PyPlay MP3 Player/Python MP3 Player - Runnable Script.rar"},
			{name: "Python MP3 Player - Windows Executable", value : "./PyPlay MP3 Player/Python MP3 Player - Windows Executable.7z"},
			{name: "Unity TowerBlocks", value : "./TowerBlocks Game/TowerBlocks Game.7z"},
			{name: "Unity 3D Racing Environment", value : "./Unity 3D Drag Racing Environment/Unity 3D Drag Racing Environment.7z"},
			{name: "WWBM Quizz Game", value : "./WWBM Quizz Game/WWBM Quizz Game.rar"},
			{name: "Traffic Simulator 2D", value : "./Traffic Simulator 2D/Traffic Simulator 2D.rar"},
			{name: "Java 2D Racing Environment", value : "./Java 2D Drag Racing Environment/Java 2D Drag Racing Environment.rar"},
			{name: "JavaScript Games Portable", value : "./JavaScript In-Browser Games/Javascript Portable In-Browser Games.rar"},
	];
	
	document.title = $scope.pageObject.page_title + " " + document.title;
	
	$scope.selectedWebPageStyle = function (pageElement, activePageTitle)
	{
		var style = "";
		if(pageElement.name == activePageTitle)
		{
			style = {
				"background-color": "#aa4400", 
				"border-style": "solid", 
				"border-color": "#442200", 
				"border-width": "2px", 
			};
		}
		else
		{
			style = {
				"background-color": "rgba(0,0,0,0.0)", /*tranparent*/
				"border-style": "none", 
			};
		}
		return style;
	}
}