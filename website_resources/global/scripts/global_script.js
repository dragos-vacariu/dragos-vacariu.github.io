var app = angular.module('myApplication', []);
app.controller('Controller', Controller_Function);

function Controller_Function($scope, $location)
{
	//Initializing the models;
	$scope.pageObject = {
		footer_table_headers : ["Template Info:", "Connections:", "Tools Used:"],				
		template_info : ["Author: Dragos Vacariu", "Design: 2017 rev 2024", "Title: Portfolio", "Hosted by: GitHub"],
		tools_used : ["HTML4", "HTML5", "CSS3", "CSS", "JavaScript", "Angular"],
		connections_list : ["GitHub.com", "LinkedIn.com",  "w3schools.com"],
		footer_copyright : "Dragos Vacariu © 2024",
		footer_paragraph : "Porfolio implemented as means to present and/or demonstrate professional skills, work and efforts put into practice for building up a reliable knowledge foundation to facilitate the adaptability within a new environment, industry, toolchain workplace or with various technologies within the IT industry.",
		page_title : "Portfolio",
		page_navigation : [
			{name: "Home", value : "./index.html"},
			{name: "Catalogue", value : "#"},
			{name: "Contact", value : "./contact.html"},
		],
		page_navigation_dropdown : [
			{name: "Java Projects", value : "./Java-Projects/index.html"},
			{name: "Unity C# Projects", value : "./Unity-Csharp-Projects/index.html"},
			{name: "Python Projects", value : "./Python-Projects/index.html"},
			{name: "Html Projects", value : "./Html-Projects/index.html"},
			{name: "C# Projects", value : "./CSharp-Projects/index.html"},
			{name: "C++ Projects", value : "./Cpp-Projects/index.html"},
			{name: "C++ OpenGL Projects", value : "./Cpp-OpenGL-Projects/index.html"},
			{name: "AngularJS", value : "./AngularJS/index.html"},
			{name: "JavaScript Games", value : "./Javascript-Projects/index.html"},
			{name: "JavaScript WebApps", value : "./Javascript-Projects/webapps.html"},
		],
		
	};
	$scope.java_catalogue = [
			{name: "Java Racing Environment", value : "./Projects GUI/project44 drag racing simulator/Java Racing Environment.html"},
			{name: "Java MP3 Player", value : "./Projects GUI/project34 java mp3 player application/Java MP3 Player.html"},
	];
	$scope.unity_csharp_catalogue = [
			{name: "TowerBlocks Game", value : "./TowerBlocks/TowerBlocks.html"},
			{name: "Unity Racing Environment", value : "./Drag Racing/Drag Racing.html"},
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
			{value: "./Applications/project28 checkerboard.html" , name : "Checkerboard"},
			{value: "./Applications/project13 simple calculator.html" , name : "Simple Calculator"},
			{value: "./Applications/project14 item list.html" , name : "Item List"},
			{value: "./Applications/project15 add items to cart using angular.foreach.html" , name : "Add items to Cart"},
			{value: "./Applications/project16 display content according to href.html" , name : "Display HREF Content"},
			{value: "./Applications/project17 matrix determinant calculator ng-change.html" , name : "Matrix determinant calculator"},
			{value: "./Applications/project18 decimal to binary converter, loops in angularjs.html" , name : "Decimal to Binary Converter"},
			{value: "./Applications/project19 letter to symbol replacer.html" , name : "Letter to symbol replacer"},
			{value: "./Applications/project20 age computer.html" , name : "Age computer"},
			{value: "./Applications/project21 bitwise operations calculator.html" , name : "Bitwise operations"},
			{value: "./Applications/project22 color picker, decimal to hex.html" , name : "Color Picker"},
			{value: "./Applications/project23 border picker.html" , name : "Border Picker"},
			{value: "./Applications/project24 customized tables.html" , name : "Customized Tables"},
			{value: "./Applications/project25 shopping cart.html" , name : "Shopping Cart"},
			{value: "./Applications/project26 car shop catalogue/project26 car shop catalogue.html" , name : "Car Shop"},
			{value: "./Applications/project27 car shop catalogue new template/project27 car shop catalogue new template.html" , name : "Car Shop New"},
	];
	$scope.javascript_games_catalogue = [
			{name: "Knight Chess Game", value : "./knight_chess_resources/knight_chess_game.html"},
			{name: "Snake Game", value : "./snake_resources/snake_game.html"},
			{name: "Tetris Game", value : "./tetris_resources/tetris_game.html"},
			{name: "TowerBlocks Game", value : "./towerblocks_resources/tower_blocks_game.html"},
			{name: "Canvas Snake", value : "./canvas_snake/canvas_snake.html"},
			{name: "Video Presentation Page", value : "./presentation_video_page.html"},
	];
	$scope.javascript_games_videos_catalogue = [
			{name: "Knight Chess Game Video", value : "./knight_chess_resources/knight_chess_video_page.html"},
			{name: "Snake Game Video", value : "./snake_resources/snake_video_page.html"},
			{name: "Tetris Game Video", value : "./tetris_resources/tetris_video_page.html"},
			{name: "TowerBlocks Game Video", value : "./towerblocks_resources/towerblocks_video_page.html"},
			{name: "Canvas Snake Game Video", value : "./canvas_snake/canvas_snake_video_page.html"},
	];
	$scope.javascript_webapps_catalogue = [
			{name: "Message Encoder", value : "./encoder_decoder_resources/message_encoder.html"},
			{name: "Message Decoder", value : "./encoder_decoder_resources/message_decoder.html"},
			{name: "RandomORG", value : "./random_resources/random_org.html"},
			{name: "Roadcross Game", value : "./roadcross_resources/roadcross_game.html"},
	];
}