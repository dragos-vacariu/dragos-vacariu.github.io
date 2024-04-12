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
			{name: "Java Apps", value : "./Java-Projects/index.html"},
			{name: "C#", value : "./C-Sharp-Projects/index.html"},
		],
		
	};
	$scope.java_catalogue = [
			{name: "Java Racing Environment", value : "./Projects GUI/project44 drag racing simulator/Java Racing Environment.html"},
			{name: "Java MP3 Player", value : "./Projects GUI/project34 java mp3 player application/Java MP3 Player.html"},
	];
}