
const page_footer = `
    <div id = "footer_tabelation_div">
        <div class="footer_columns" ng-repeat="list_item in footer_table_contents">
            <p class="column_title">{{list_item.name}}:</p>
            <ul class="footer_list">
                <li ng-if = "list_item.content == 'text'" ng-repeat="item in list_item.list_values">{{item}}</li>
                <li ng-if = "list_item.content == 'objects_with_links'" ng-repeat="item in list_item.list_values"><a href="{{item.value}}">{{item.name}}</a></li>
            </ul>
        </div>
    </div>
    <h5 id="footer_endline">{{pageObject.footer_paragraph}}</h5>
    <h4 id="copyright_message">{{pageObject.footer_copyright}}</h4>
`;
document.getElementById("page_footer").innerHTML = page_footer;

const page_header = `
            <div id="header_title">
                <h2 id="page_title"></h2>
                <p id="page_description"></p>
            </div>
            <nav>
                <div class = "menu_page_item" ng-repeat="page in pageObject.page_navigation">
                    <a ng-if="page.name!='Catalogue'" class = "outer_href" href={{page.value}}>{{page.name}}</a>
                    
                    <div ng-if="page.name=='Catalogue'" class="dropdown_menu" style="padding:0%;">
                        <a class="outer_href">{{pageObject.page_navigation[1].name}}▼</a>
                        <div class="dropdown_content">
                            <a ng-repeat="page in pageObject.page_navigation_dropdown" href={{page.value}}>{{page.name}}</a>
                        </div>
                    </div>    
                </div>
           </nav>
`
document.getElementById("page_header").innerHTML = page_header;

var app = angular.module('myApplication', []);
app.controller('Controller', Controller_Function);

var domain = "dragos-vacariu.github.io";
var page_title = "GitHub Portfolio";
document.title = document.title + " - " + page_title;
document.getElementById("page_title").innerText = page_title;
document.getElementById("page_description").innerText = domain;
    
var rootDir = location.href.split(domain)[0] + domain;
var homePage = window.location.protocol == "file:" ? rootDir + "/index.html" : rootDir + "/";
/*window.location.protocol will be file: on local machine and http or https on the web.*/

function Controller_Function($scope)
{
    //Initializing the models;
    $scope.dotSlash = "./";
    $scope.exitDir = "../"
    
    $scope.java_page = {name: "Java Projects", value: rootDir + "/catalogue/Java-Projects.html"}; /*currently not indexed*/
    $scope.unity_page = {name: "Unity C# Projects", value: rootDir + "/catalogue/Unity-Csharp-Projects.html"};
    $scope.python_page = {name: "Python tKinter Projects", value: rootDir + "/catalogue/Python-Projects.html"};
    $scope.html_page = {name: "HTML & CSS Templates", value : rootDir + "/catalogue/Html-Projects.html"};
    $scope.c_sharp_page = {name: "C# .NET Projects", value : rootDir + "/catalogue/CSharp-Projects.html"};
    $scope.cpp_page = {name: "C++ .NET Projects", value : rootDir + "/catalogue/Cpp-Projects.html"};
    $scope.cpp_opengl_page = {name: "C++ OpenGL Projects", value : rootDir + "/catalogue/Cpp-OpenGL-Projects.html"};
    $scope.angularjs_page = {name: "AngularJS Practicals", value : rootDir + "/catalogue/AngularJS.html"};
    $scope.javascript_games_page = {name: "JavaScript Games", value : rootDir + "/catalogue/Javascript-Games.html"};
    $scope.javascript_games_presentation_video = {name: "Video Presentation Page", value : "/catalogue/Javascript-Games-Presentation-Video.html"};
    $scope.javascript_webapps_page = {name: "JavaScript WebApps", value : rootDir + "/catalogue/Javascript-WebApps.html"}; /*currently not indexed*/
    $scope.portable_downloads_page = {name: "Portable Downloads", value : rootDir + "/catalogue/Portable-Downloads.html"};
    $scope.github_repository_page = {name: "GitHub Repositories", value : "https://github.com/dragos-vacariu?tab=repositories"};
    
    $scope.pageObject = {
        page_navigation : [
            {name: "Home", value : homePage},
            {name: "Catalogue", value : rootDir + "#"},
            {name: "Contact", value : rootDir + "/contact.html"},
            {name: "About", value : rootDir + "/about.html"},
            {name: "Portal", value : rootDir + "/portal.html"},
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
        template_info : ["Author: Dragos Vacariu", "Date: 2017", "Title: Full Web Page Template", 
                        "Revised in: 2024", "Hosted by: GitHub", " ", "Tools: HTML4, HTML5, CSS, CSS3, JavaScript, Angular"],
        tools_used : ["HTML4", "HTML5", "CSS3", "CSS", "JavaScript", "Angular"],
        connections_list : [ {name: "W3Schools", value: "https://www.w3schools.com"}, 
                             {name: "GeeksForGeeks", value: "https://www.geeksforgeeks.org"}, 
                             {name: "TutorialPoint", value: "https://www.tutorialpoint.com"}, 
                             {name: "JavaTPoint", value: "https://www.javatpoint.com"}, 
                             {name: "Wikipedia", value: "https://www.wikipedia.org"}, 
                             {name: "YouTube", value: "https://www.youtube.com"}, 
                             {name: "Programiz", value: "https://www.programiz.com"},
                             {name: "SimpliLearn", value: "https://www.simplilearn.com"},
                           ],
        footer_copyright : "Dragos Vacariu © 2024",
        footer_paragraph : "Portfolio implemented as means to present and/or demonstrate professional skills, work and efforts put into practice for building up a reliable knowledge foundation to facilitate the adaptability within a new environment, industry, toolchain workplace or with various technologies within the IT industry.",
    };
    
    $scope.page_statistics = ["Image: " + document.images.length, 
                              "Scripts: " + document.scripts.length, 
                              "Videos: " + document.getElementsByTagName("video").length, 
                              " ", 
                              "Last Modified: ", 
                              window.document.lastModified.split(" ")[0],
                              window.document.lastModified.split(" ")[1]
                             ];
                             
    $scope.social_networks = [{name: "GitHub", value: "https://www.GitHub.com/dragos-vacariu"}, {name: "LinkedIn", value: "https://www.LinkedIn.com/in/dragos-vacariu-em"},];
    $scope.training_materials = [
                                    {name: "C Language", value: rootDir + "/portal.html#multiple@C&description_generic-programming_variable-arguments-lists_simple-data-types_complex-data-types_preprocessor-directives_loops_collections_collection-methods_dynamic-memory-allocation_read-from-file_write-to-file_serialization_deserialization_enums_concurrent-programming_exception-handling_bitwise-operators_default-parameters_interfaces_macros_defines_random-generators_command-line-arguments_ternary-operator_modular-programming_string-methods_datatype-conversions_optional-parameters_operators_pre-post-incrementation_recursion_polymorphism_oop_encapsulation_inheritance_abstraction_constructors_instantiation_destructors_function-overloading_operator-overloading_namespaces_abstract-classes_decorators_reflection_partial-classes_minification_regular-expressions_lambda-anonymous-functions%regular"},
                                    {name: "C++ Language", value: rootDir + "/portal.html#multiple@C++&description_generic-programming_variable-arguments-lists_simple-data-types_complex-data-types_preprocessor-directives_loops_collections_collection-methods_dynamic-memory-allocation_read-from-file_write-to-file_serialization_deserialization_enums_concurrent-programming_exception-handling_bitwise-operators_default-parameters_interfaces_macros_defines_random-generators_command-line-arguments_ternary-operator_modular-programming_string-methods_datatype-conversions_optional-parameters_operators_pre-post-incrementation_recursion_polymorphism_oop_encapsulation_inheritance_abstraction_constructors_instantiation_destructors_function-overloading_operator-overloading_namespaces_abstract-classes_decorators_reflection_partial-classes_minification_regular-expressions_lambda-anonymous-functions%regular"},
                                    {name: "C# Language", value: rootDir + "/portal.html#multiple@CSharp&description_generic-programming_variable-arguments-lists_simple-data-types_complex-data-types_preprocessor-directives_loops_collections_collection-methods_dynamic-memory-allocation_read-from-file_write-to-file_serialization_deserialization_enums_concurrent-programming_exception-handling_bitwise-operators_default-parameters_interfaces_macros_defines_random-generators_command-line-arguments_ternary-operator_modular-programming_string-methods_datatype-conversions_optional-parameters_operators_pre-post-incrementation_recursion_polymorphism_oop_encapsulation_inheritance_abstraction_constructors_instantiation_destructors_function-overloading_operator-overloading_namespaces_abstract-classes_decorators_reflection_partial-classes_minification_regular-expressions_lambda-anonymous-functions%regular"},
                                    {name: "Java Language", value: rootDir + "/portal.html#multiple@Java&description_generic-programming_variable-arguments-lists_simple-data-types_complex-data-types_preprocessor-directives_loops_collections_collection-methods_dynamic-memory-allocation_read-from-file_write-to-file_serialization_deserialization_enums_concurrent-programming_exception-handling_bitwise-operators_default-parameters_interfaces_macros_defines_random-generators_command-line-arguments_ternary-operator_modular-programming_string-methods_datatype-conversions_optional-parameters_operators_pre-post-incrementation_recursion_polymorphism_oop_encapsulation_inheritance_abstraction_constructors_instantiation_destructors_function-overloading_operator-overloading_namespaces_abstract-classes_decorators_reflection_partial-classes_minification_regular-expressions_lambda-anonymous-functions%regular"},
                                    {name: "JavaScript Language", value: rootDir + "/portal.html#multiple@JavaScript&description_generic-programming_variable-arguments-lists_simple-data-types_complex-data-types_preprocessor-directives_loops_collections_collection-methods_dynamic-memory-allocation_read-from-file_write-to-file_serialization_deserialization_enums_concurrent-programming_exception-handling_bitwise-operators_default-parameters_interfaces_macros_defines_random-generators_command-line-arguments_ternary-operator_modular-programming_string-methods_datatype-conversions_optional-parameters_operators_pre-post-incrementation_recursion_polymorphism_oop_encapsulation_inheritance_abstraction_constructors_instantiation_destructors_function-overloading_operator-overloading_namespaces_abstract-classes_decorators_reflection_partial-classes_minification_regular-expressions_lambda-anonymous-functions%regular"},
                                    {name: "Python Language", value: rootDir + "/portal.html#multiple@Python&description_generic-programming_variable-arguments-lists_simple-data-types_complex-data-types_preprocessor-directives_loops_collections_collection-methods_dynamic-memory-allocation_read-from-file_write-to-file_serialization_deserialization_enums_concurrent-programming_exception-handling_bitwise-operators_default-parameters_interfaces_macros_defines_random-generators_command-line-arguments_ternary-operator_modular-programming_string-methods_datatype-conversions_optional-parameters_operators_pre-post-incrementation_recursion_polymorphism_oop_encapsulation_inheritance_abstraction_constructors_instantiation_destructors_function-overloading_operator-overloading_namespaces_abstract-classes_decorators_reflection_partial-classes_minification_regular-expressions_lambda-anonymous-functions%regular"},
                                    {name: "AutoSAR", value: rootDir + "/portal.html#multiple@AutoSAR&description_ecu-communication_ecu-networks_can-protocol_can-transceiver_can-controller-driver_can-interface%regular"},
                                ];
                             
    $scope.footer_table_contents = [
                                    {name: "Technical References",  list_values: $scope.pageObject.connections_list, content: "objects_with_links"}, 
                                    {name: "Application Catalogue",  list_values: $scope.pageObject.page_navigation_dropdown, content: "objects_with_links"},
                                    {name: "Social Networking",  list_values: $scope.social_networks, content: "objects_with_links"},
                                    {name: "Training Materials",  list_values: $scope.training_materials, content: "objects_with_links"},
                                    //{name: "Page Stats",  list_values: $scope.page_statistics, content: "text"},
                                    //{name: "Template Info",  list_values: $scope.pageObject.template_info, content: "text"}, 
                                    ];
    
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
            {name: "Python MP3 Player V3 - Runnable Script", value : "../../Portable-Downloads/PyPlay MP3 Player/Python MP3 Player V3 - Runnable Script.rar"},
            {name: "Python MP3 Player V3 - Windows Executable", value : "../../Portable-Downloads/PyPlay MP3 Player/Python MP3 Player V3 - Windows Executable.7z"},
            {name: "Python MP3 Player V4 - Runnable Script", value : "../../Portable-Downloads/PyPlay MP3 Player/Python MP3 Player V4 - Runnable Script.7z"},
            {name: "Python MP3 Player V4 - Windows Executable", value : "../../Portable-Downloads/PyPlay MP3 Player/Python MP3 Player V4 - Windows Executable.7z"},
            {name: "Unity TowerBlocks", value : "../../Portable-Downloads/TowerBlocks Game/TowerBlocks Game.7z"},
            {name: "Unity 3D Racing Environment", value : "../../Portable-Downloads/Unity 3D Drag Racing Environment/Unity 3D Drag Racing Environment.7z"},
            {name: "WWBM Quizz Game", value : "../../Portable-Downloads/WWBM Quizz Game/WWBM Quizz Game.rar"},
            {name: "Traffic Simulator 2D", value : "../../Portable-Downloads/Traffic Simulator 2D/Traffic Simulator 2D.rar"},
            {name: "Java 2D Racing Environment", value : "../../Portable-Downloads/Java 2D Drag Racing Environment/Java 2D Drag Racing Environment.rar"},
            {name: "JavaScript Games Portable", value : "../../Portable-Downloads/JavaScript In-Browser Games/Javascript Portable In-Browser Games.rar"},
    ];
}

/*
//This works on client side and is not suitable for visit counter
//localStorage could be used to store various settings on client side similar to document.cookie

var page_counter_name = String(document.title.replace(" ", "_")) + "_visitCounter"

var visitCounter = localStorage.getItem(page_counter_name);

function pageVisitCounter()
{
    if(visitCounter)
    {
        visitCounter++;
        localStorage.setItem(page_counter_name, visitCounter); //this value will be stored locally.
    }
    else
    {
        localStorage.setItem(page_counter_name, 1); //this value will be stored locally.
        visitCounter = localStorage.getItem(page_counter_name);
    }
}

pageVisitCounter();

*/