var app = angular.module('myApplication', []);
app.controller('Controller', Controller_Function);

function Controller_Function($scope, $location)
{
	//Initializing the models;
	$scope.pageObject = {
		footer_table_headers : ["Template Info:", "Connections:", "Tools Used:"],				
		template_info : ["Author: Dragos Vacariu", "Design: 2017"],
		tools_used : ["HTML4", "HTML5", "CSS3", "CSS"],
		connections_list : ["tutorialpoint.com"],
		footer_copyright : "Dragos Vacariu © 2024",
		footer_paragraph : "Portofolio",
		page_title : "Portofolio",
		page_navigation : [
			{name: "Home", value : "./index.html"},
			{name: "Catalogue", value : "#"},
			{name: "Contact", value : "./contact.html"},
		],
		page_navigation_dropdown : [
			{name: "Java Apps", value : "./Java-Projects/index.html"},
			{name: "C#", value : "./C-Sharp-Projects/index.html"},
		],
		
	};
	$scope.java_catalogue = [
			{name: "Java Racing Environment", value : "./Projects GUI/project44 drag racing simulator/Java Racing Environment.html"},
			{name: "Java MP3 Player", value : "./Projects GUI/project34 java mp3 player application/Java MP3 Player.html"},
	];
}