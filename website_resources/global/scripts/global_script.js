var domain = "dragos-vacariu.github.io";

var rootDir = location.href.split(domain)[0] + domain;

const HTML_Object_PageFooter = document.getElementById("page_footer")

if (HTML_Object_PageFooter != null)
{
    const page_footer = `
    <div id = "footer_tabelation_div">
        <div class="footer_columns" ng-repeat="list_item in footer_table_contents">
            <p class="column_title">{{list_item.name}}:</p>
            <ul class="footer_list">
                <li ng-if = "list_item.content == 'text'" ng-repeat="item in list_item.list_values">{{item}}</li>
                <li ng-if = "list_item.content == 'objects_with_links' && isPortalPage == true" ng-repeat="item in list_item.list_values"><a href="{{item.value}}" ng-click="workaroundForFooterRoutedLinksForPortalPage(item.value)">{{item.name}}</a></li>
                <li ng-if = "list_item.content == 'objects_with_links' && isPortalPage == false" ng-repeat="item in list_item.list_values"><a href="{{item.value}}">{{item.name}}</a></li>
            </ul>
        </div>
    </div>
    <h5 id="footer_endline">{{pageObject.footer_paragraph}}</h5>
    <h4 id="copyright_message">{{pageObject.footer_copyright}}</h4>
`;

    HTML_Object_PageFooter.innerHTML = page_footer;
}

const HTML_Object_PageHeader = document.getElementById("page_header");

if (HTML_Object_PageHeader != null)
{
    const page_header = `
            
            <div id="header_title">
                <div id = "logo_div">
                    <img id="logo" src="/website_resources/global/images/logo.png" alt="logo image"></img>
                </div>
                <div id = "title_and_description_div">
                    <div id="page_title"></div>
                    <div id="page_description"></div>
                </div>
            </div>
            <nav>
                <div class = "menu_page_item" ng-repeat="page in pageObject.page_navigation">
                    <a ng-if="page.name!='Project Catalogue'" id={{page.name}} class = "outer_href" href={{page.value}}>{{page.name}}</a>
                    
                    <div ng-if="page.name=='Project Catalogue'" class="dropdown_menu" style="padding:0%;">
                        <a class="outer_href">{{pageObject.page_navigation[1].name}}▼</a>
                        <div class="dropdown_content">
                            <a ng-repeat="page in pageObject.page_navigation_dropdown" href={{page.value}}>{{page.name}}</a>
                        </div>
                    </div>    
                </div>
           </nav>
`

    HTML_Object_PageHeader.innerHTML = 
        page_header.replace('<img id="logo" src="/website_resources/global/images/logo.png" alt="logo image"></img>',
        '<img id="logo" src="' + rootDir + '/website_resources/global/images/logo.png" alt="logo image"></img>');
}

const app = angular.module('myApplication', []);
app.controller('Controller', Controller_Function);


var page_title = "GitHub Portfolio";
document.title = document.title + " - " + page_title;
document.getElementById("page_title").innerText = page_title;
document.getElementById("page_description").innerText = domain;
    

const homePage = window.location.protocol == "file:" ? rootDir + "/index.html" : rootDir + "/";
/*window.location.protocol will be file: on local machine and http or https on the web.*/

function Controller_Function($scope)
{
    //Initializing the models;
    var baseUrl = window.location.href.split("#")[0]
    $scope.isPortalPage = baseUrl.endsWith(rootDir + "/portal.html") || 
                          baseUrl.endsWith(rootDir + "/portal_classic.html");
    $scope.dotSlash = "./";
    $scope.exitDir = "../";
    $scope.root = rootDir;
    
    $scope.fullstack_apps_page = {name: "FullStack WebApps", value: rootDir + "/catalogue/FullStack-WebApps.html"};
    $scope.java_page = {name: "Java Projects", value: rootDir + "/catalogue/Java-Projects.html"};
    $scope.unity_page = {name: "Unity C# Projects", value: rootDir + "/catalogue/Unity-Csharp-Projects.html"};
    $scope.embedded_c_page = {name: "Embedded C Projects", value: rootDir + "/catalogue/Embedded-C-Projects.html"};
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
    $scope.github_project_external_links_page = {name: "GitHub Projects Links", value : rootDir + "/catalogue/Github-Projects-Links.html"};
    $scope.github_repository_page = {name: "GitHub Repositories", value : "https://github.com/dragos-vacariu?tab=repositories"};
    
    $scope.pageObject = {
        page_navigation : [
            {name: "Home", value : homePage},
            {name: "Project Catalogue", value : rootDir + "#"},
            {name: "Contact Info", value : rootDir + "/contact.html"},
            {name: "About Me", value : rootDir + "/about.html"},
            {name: "Learning Portal", value : rootDir + "/portal.html"},
        ],
        page_navigation_dropdown : [
            $scope.fullstack_apps_page,
            $scope.unity_page,
            $scope.javascript_games_page,
            $scope.javascript_webapps_page,
            $scope.python_page,
            $scope.c_sharp_page,
            $scope.cpp_opengl_page,
            $scope.html_page,
            $scope.angularjs_page,
            $scope.cpp_page,
            $scope.java_page,
            $scope.embedded_c_page,
            /*$scope.portable_downloads_page,*/
            $scope.github_project_external_links_page,
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
                                    {name: "Project Catalogue",  list_values: $scope.pageObject.page_navigation_dropdown, content: "objects_with_links"},
                                    {name: "Social Networking",  list_values: $scope.social_networks, content: "objects_with_links"},
                                    {name: "Learning Manifests",  list_values: $scope.training_materials, content: "objects_with_links"},
                                    //{name: "Page Stats",  list_values: $scope.page_statistics, content: "text"},
                                    //{name: "Template Info",  list_values: $scope.pageObject.template_info, content: "text"}, 
                                    ];
    $scope.fullstack_catalogue = [
            {name: "Note Taking App", value : "../../Note_taking_app_demo/index.html"},
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
            {name: "Old Portfolio", value : "../../Html-Projects/Web Templates/portfolio_old/index.html"},
    ];
    $scope.c_sharp_projects_catalogue = [
            {name: "WWBM Quizz Game", value : "CSharp-Projects/WWBM Quizz Game.html"},
            {name: "Basic MP3 Player", value : "CSharp-Projects/MP3Player.html"},
    ];
    $scope.cpp_projects_catalogue = [
            {name: "Pocket Calculator", value : "Cpp-Projects/Pocket Calculator.html"},
    ];
    $scope.cpp_opengl_projects_catalogue = [
            {name: "Car Game Project 2D", value : "Cpp-OpenGL-Projects/Car Game Project 2D.html"},
            {name: "Traffic Simulator 2D", value : "Cpp-OpenGL-Projects/Traffic Simulator 2D.html"},
    ];
    $scope.embedded_c_catalogue = [
            {name: "Embedded Countdown Timer", value : "Embedded-C-Projects/Embedded Countdown Timer.html"},
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
            //{name: "Message Encoder", value : "../../Javascript-Projects/webapps_resources/message_encoder.html"},
            //{name: "Message Decoder", value : "../../Javascript-Projects/webapps_resources/message_decoder.html"},
            //{name: "RandomORG", value : "../../Javascript-Projects/webapps_resources/random_org.html"},
            //{name: "Roadcross Game", value : "../../Javascript-Projects/webapps_resources/roadcross_game.html"},
            //{name: "AI Pal Chatboot", value : "https://ai-pal-chatbot.onrender.com"},
            {name: "AI Pal Chatboot", value : "../../Javascript-Projects/webapps_resources/ai_pal_chatbot.html"},
    ];
    $scope.portable_downloads = [
            //{name: "Python MP3 Player V3 - Runnable Script", value : "../../Portable-Downloads/PyPlay MP3 Player/Python MP3 Player V3 - Runnable Script.7z"},
            {name: "Python MP3 Player V3 - Windows Executable", value : "../../Portable-Downloads/PyPlay MP3 Player/Windows/Python MP3 Player V3 - Windows Executable.7z"},
            //{name: "Python MP3 Player V4 - Runnable Script", value : "../../Portable-Downloads/PyPlay MP3 Player/Python MP3 Player V4 - Runnable Script.7z"},
            {name: "Python MP3 Player V4 - Windows Executable", value : "../../Portable-Downloads/PyPlay MP3 Player/Windows/Python MP3 Player V4 - Windows Executable.7z"},
            {name: "Unity TowerBlocks", value : "../../Portable-Downloads/TowerBlocks Game/TowerBlocks Game.7z"},
            {name: "Unity 3D Racing Environment", value : "../../Portable-Downloads/Unity 3D Drag Racing Environment/Unity 3D Drag Racing Environment.7z"},
            {name: "WWBM Quizz Game", value : "../../Portable-Downloads/WWBM Quizz Game/WWBM Quizz Game.7z"},
            {name: "Traffic Simulator 2D", value : "../../Portable-Downloads/Traffic Simulator 2D/Traffic Simulator 2D.7z"},
            {name: "Java 2D Racing Environment", value : "../../Portable-Downloads/Java 2D Drag Racing Environment/Java 2D Drag Racing Environment.7z"},
    ];
    $scope.github_projects_links = [
            {name: "Python MP3 Player", value : "https://github.com/dragos-vacariu/Python-Projects/tree/master/pyplay%20mp3%20player"},
            {name: "Unity TowerBlocks", value : "https://github.com/dragos-vacariu/Unity-Csharp-Projects/tree/master/TowerBlocks"},
            {name: "Unity 3D Racing Environment", value : "https://github.com/dragos-vacariu/Unity-Csharp-Projects/tree/master/Drag%20Racing"},
            {name: "C# WWBM Quizz Game", value : "https://github.com/dragos-vacariu/CSharp-Projects/tree/master/VS%20Projects%20GUI/WWBM%20Quizz%20Game"},
            {name: "OpenGL Car Game Project 2D", value : "https://github.com/dragos-vacariu/Cpp-OpenGL-Projects/tree/master/Projects/car%20game%20project"},
            {name: "OpenGL Traffic Simulator 2D", value : "https://github.com/dragos-vacariu/Cpp-OpenGL-Projects/tree/master/Projects/traffic%20simulator%202d"},
            {name: "Java 2D Racing Environment", value : "https://github.com/dragos-vacariu/Java-Projects/tree/master/Projects%20GUI/project44%20drag%20racing%20simulator"},
            //{name: "Java MP3 Player", value : "https://github.com/dragos-vacariu/Java-Projects/tree/master/Projects%20GUI/project34%20java%20mp3%20player%20application"},
    ];
    $scope.workaroundForFooterRoutedLinksForPortalPage = function(value)
    {
        /*This function will be called if I'm on the Portal Page and click on a footer link pointing to a 
        route of the Portal Page*/
        window.location.href = value
        
        /*Go to the beggining*/
        window.scrollTo(0,0);
        /*Force a reload, that will ensure the route is loaded*/
        window.location.reload()
    }
}

/*Adding fading-out transition to the homepage first paragraph*/
window.addEventListener("scroll", function () 
{
    const fading_elements = document.getElementsByClassName("fading_paragraph");
    const page_header = document.getElementById("page_header");
    
    for(var index=0; index < fading_elements.length; index++)
    {
        const rect = fading_elements[index].getBoundingClientRect();
        const elementHeight = rect.height;

        // Adjust visible area to account for sticky nav
        const viewportTop = page_header.getBoundingClientRect().height;
        const viewportBottom = window.innerHeight;

        const visibleTop = Math.max(rect.top, viewportTop);
        const visibleBottom = Math.min(rect.bottom, viewportBottom);

        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        const ratio = visibleHeight / elementHeight;

        // Fade out when visible part is less than..
        if (ratio < 0.8) 
        {
          //fading_elements[index].style.opacity = ratio * 2; // Smooth transition
          fading_elements[index].classList.add("fade-out");
        } 
        else 
        {
          //fading_elements[index].style.opacity = 1;
          fading_elements[index].classList.remove("fade-out");
        }
    }
});


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