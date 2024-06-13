var app = angular.module('myApplication', []);
app.controller('Controller', Controller_Function);

function Controller_Function($scope)
{
	//Initializing the models;
	$scope.dotSlash = "./";
	$scope.exitDir = "../"
	
	$scope.java_page = {name: "Java Projects", value: "catalogue/Java-Projects.html"}; /*currently not indexed*/
	$scope.unity_page = {name: "Unity C# Projects", value: "catalogue/Unity-Csharp-Projects.html"};
	$scope.python_page = {name: "Python tKinter Projects", value: "catalogue/Python-Projects.html"};
	$scope.html_page = {name: "HTML & CSS Templates", value : "catalogue/Html-Projects.html"};
	$scope.c_sharp_page = {name: "C# .NET Projects", value : "catalogue/CSharp-Projects.html"};
	$scope.cpp_page = {name: "C++ .NET Projects", value : "catalogue/Cpp-Projects.html"};
	$scope.cpp_opengl_page = {name: "C++ OpenGL Projects", value : "catalogue/Cpp-OpenGL-Projects.html"};
	$scope.angularjs_page = {name: "AngularJS Practicals", value : "catalogue/AngularJS.html"};
	$scope.javascript_games_page = {name: "JavaScript Games", value : "catalogue/Javascript-Games.html"};
	$scope.javascript_games_presentation_video = {name: "Video Presentation Page", value : "Javascript-Games-Presentation-Video.html"};
	$scope.javascript_webapps_page = {name: "JavaScript WebApps", value : "catalogue/Javascript-WebApps.html"}; /*currently not indexed*/
	$scope.portable_downloads_page = {name: "Portable Downloads", value : "catalogue/Portable-Downloads.html"};
	$scope.github_repository_page = {name: "GitHub Repositories", value : "https://github.com/dragos-vacariu?tab=repositories"};

	$scope.pageObject = {
        page_title : "Portfolio",
		page_navigation : [
			{name: "Home", value : "./"},
			{name: "Catalogue", value : "#"},
			{name: "Contact", value : "./contact.html"},
			{name: "About", value : "./about.html"},
			{name: "Portal", value : "./portal.html"},
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
			//$scope.github_repository_page,
		],
		template_info : ["Author: Dragos Vacariu", "Date: 2017", "Title: Full Web Page Template", "Revised in: 2024", "Hosted by: GitHub"],
		tools_used : ["HTML4", "HTML5", "CSS3", "CSS", "JavaScript", "Angular"],
		connections_list : ["GitHub.com", "LinkedIn.com",  "w3schools.com", "geeksforgeeks.org", "tutorialpoint.com"],
        footer_copyright : "Dragos Vacariu © 2024",
        footer_paragraph : "Portfolio implemented as means to present and/or demonstrate professional skills, work and efforts put into practice for building up a reliable knowledge foundation to facilitate the adaptability within a new environment, industry, toolchain workplace or with various technologies within the IT industry.",
	};
    
    $scope.page_statistics = ["Images: " + document.images.length, 
                              "Scripts: " + document.scripts.length, 
                              "Videos: " + document.getElementsByTagName("video").length, 
                             ];
                             
    $scope.footer_table_contents = [{name: "Template Info",  list_values: $scope.pageObject.template_info}, 
                                    {name: "References",  list_values: $scope.pageObject.connections_list}, 
                                    {name: "Tools Used",  list_values: $scope.pageObject.tools_used}, 
                                    {name: "Catalogue",  list_values: $scope.pageObject.page_navigation_dropdown},
                                    {name: "Statistics",  list_values: $scope.page_statistics}];
	
    $scope.java_catalogue = [
			{name: "Java Racing Environment", value : "Java-Projects/Java Racing Environment.html"},
			{name: "Java MP3 Player", value : "Java-Projects/Java MP3 Player.html"},
	];
	$scope.unity_csharp_catalogue = [
			{name: "TowerBlocks Game", value : "Unity-Csharp-Projects/TowerBlocks.html"},
			{name: "Unity Racing Environment", value : "Unity-Csharp-Projects/Drag Racing.html"},
	];
	$scope.python_projects_catalogue = [
			{name: "Python MP3 Player", value : "Python-Projects/PyPlay Mp3 Player.html"},
	];
	$scope.html_projects_catalogue = [
			{name: "Full Web Page Template", value : "../../Html-Projects/Web Templates/project38 full web page template/index.html"},
			{name: "Musician Web Page Template", value : "../../Html-Projects/Web Templates/project39 musician web page template/index.html"},
			{name: "Python MP3 Player Webpage", value : "../../Html-Projects/Web Templates/project40 python mp3 player webpage/index.html"},
			{name: "Free Sound Effects Web Template", value : "../../Html-Projects/Web Templates/free sound effects web template/index.html"},
	];
	$scope.c_sharp_projects_catalogue = [
			{name: "WWBM Quizz Game", value : "CSharp-Projects/WWBM Quizz Game.html"},
			{name: "Basic MP3 Player", value : "CSharp-Projects/MP3Player.html"},
	];
	$scope.cpp_projects_catalogue = [
			{name: "Pocket Calculator", value : "Cpp-Projects/Pocket Calculator.html"},
	];
	$scope.cpp_opengl_projects_catalogue = [
			{name: "Traffic Simulator 2D", value : "Cpp-OpenGL-Projects/Traffic Simulator 2D.html"},
	];
	$scope.angularjs_projects_catalogue = [
			{value: "../../AngularJS/Applications/project26-27 car shop catalogue/project26 car shop catalogue.html" , name : "Car Shop"},
			{value: "../../AngularJS/Applications/project26-27 car shop catalogue/project27 car shop catalogue new template.html" , name : "Car Shop New"},
			{value: "../../AngularJS/Applications/project24 customized tables.html" , name : "Customized Tables"},
			{value: "../../AngularJS/Applications/project25 shopping cart.html" , name : "Shopping Cart"},
			{value: "../../AngularJS/Applications/project22 color picker, decimal to hex.html" , name : "Color Picker"},
			{value: "../../AngularJS/Applications/project23 border picker.html" , name : "Border Picker"},
			{value: "../../AngularJS/Applications/project17 matrix determinant calculator ng-change.html" , name : "Matrix Determinant Calculator"},
			{value: "../../AngularJS/Applications/project18 decimal to binary converter, loops in angularjs.html" , name : "Decimal to Binary Converter"},
			{value: "../../AngularJS/Applications/project21 bitwise operations calculator.html" , name : "Bitwise operations"},
			{value: "../../AngularJS/Applications/project20 age calculator.html" , name : "Age Calculator"},
			{value: "../../AngularJS/Applications/project13 simple calculator.html" , name : "Simple Calculator"},
			{value: "../../AngularJS/Applications/project14 item list.html" , name : "Item List"},
			{value: "../../AngularJS/Applications/project15 add items to cart using angular.foreach.html" , name : "Add items to Cart"},
			{value: "../../AngularJS/Applications/project16 display content according to href.html" , name : "Display HREF Content"},
			{value: "../../AngularJS/Applications/project19 letter to symbol replacer.html" , name : "Letter to symbol replacer"},
			{value: "../../AngularJS/Applications/project28 checkerboard.html" , name : "Checkerboard"},
	];
	$scope.javascript_games_catalogue = [
			{name: "Knight Chess Game", value : "../../Javascript-Projects/knight_chess_resources/knight_chess_game.html"},
			{name: "Snake Game", value : "../../Javascript-Projects/snake_resources/snake_game.html"},
			{name: "Tetris Game", value : "../../Javascript-Projects/tetris_resources/tetris_game.html"},
			{name: "TowerBlocks Game", value : "../../Javascript-Projects/towerblocks_resources/tower_blocks_game.html"},
			{name: "Canvas Snake", value : "../../Javascript-Projects/canvas_snake/canvas_snake.html"},
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
			{name: "Message Encoder", value : "../../Javascript-Projects/webapps_resources/message_encoder.html"},
			{name: "Message Decoder", value : "../../Javascript-Projects/webapps_resources/message_decoder.html"},
			{name: "RandomORG", value : "../../Javascript-Projects/webapps_resources/random_org.html"},
			{name: "Roadcross Game", value : "../../Javascript-Projects/roadcross_resources/roadcross_game.html"},
	];
	$scope.portable_downloads = [
			{name: "Python MP3 Player - Runnable Script", value : "../../Portable-Downloads/PyPlay MP3 Player/Python MP3 Player - Runnable Script.rar"},
			{name: "Python MP3 Player - Windows Executable", value : "../../Portable-Downloads/PyPlay MP3 Player/Python MP3 Player - Windows Executable.7z"},
			{name: "Unity TowerBlocks", value : "../../Portable-Downloads/TowerBlocks Game/TowerBlocks Game.7z"},
			{name: "Unity 3D Racing Environment", value : "../../Portable-Downloads/Unity 3D Drag Racing Environment/Unity 3D Drag Racing Environment.7z"},
			{name: "WWBM Quizz Game", value : "../../Portable-Downloads/WWBM Quizz Game/WWBM Quizz Game.rar"},
			{name: "Traffic Simulator 2D", value : "../../Portable-Downloads/Traffic Simulator 2D/Traffic Simulator 2D.rar"},
			{name: "Java 2D Racing Environment", value : "../../Portable-Downloads/Java 2D Drag Racing Environment/Java 2D Drag Racing Environment.rar"},
			{name: "JavaScript Games Portable", value : "../../Portable-Downloads/JavaScript In-Browser Games/Javascript Portable In-Browser Games.rar"},
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