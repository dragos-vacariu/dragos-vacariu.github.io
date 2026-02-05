var domain = "dragos-vacariu.github.io";

var rootDir = window.location.protocol == "file:" ? location.href.split(domain)[0] + domain : "";

var page_title = "GitHub Portfolio";
document.title = document.title + " - " + page_title;

const homePage = rootDir + "/index.html";
/*window.location.protocol will be file: on local machine and http or https on the web.*/


const fullstack_catalogue = [
        {
            name: "Note Taking App", 
            value : "FullStack-WebApps/Note_taking_app_demo/frontend/login.html",
            description : "A full-stack web application for creating and managing notes with end-to-end \
            encryption (E2EE).",
            thumbnail : "FullStack-WebApps/Note_taking_app_demo/index.png",
        },
        {
            name: "AI Pal Chatbot", 
            description : "A full-stack web application connecting the user to a general-purpose AI Model.",
            value : "FullStack-WebApps/AI_Pal_Chatbot_Demo/app_demo.html",
            thumbnail : "FullStack-WebApps/AI_Pal_Chatbot_Demo/app_demo.png",
        },
];

const unity_csharp_catalogue = [
        {
            name: "TowerBlocks Game", 
            value : "Unity-Csharp-Projects/TowerBlocks Game/TowerBlocks Game.html",
            video : "Unity-Csharp-Projects/TowerBlocks Game/TowerBlocks Game.mp4",
            thumbnail : "Unity-Csharp-Projects/TowerBlocks Game/TowerBlocks Game.png",
            description: "TowerBlocks is an engaging game that challenges players to carefully drop blocks to \
            build the tallest skyscraper possible.",
        },
        {
            name: "Unity Racing Environment", 
            value : "Unity-Csharp-Projects/Unity Racing Environment/Unity Racing Environment.html",
            video : "Unity-Csharp-Projects/Unity Racing Environment/Unity Racing Environment.mp4",
            thumbnail : "Unity-Csharp-Projects/Unity Racing Environment/Unity Racing Environment.png",
            description: "Unity Racing Environment is a drag racing-inspired prototype where players aim to time \
            their gear shifts perfectly by syncing with the ideal RPM."
        },
];

const python_projects_catalogue = [
        {
            name: "Python MP3 Player", 
            value : "Python-Projects/PyPlay Mp3 Player/PyPlay Mp3 Player.html",
            video : "Python-Projects/PyPlay Mp3 Player/PyPlay Mp3 Player.mp4",
            thumbnail : "Python-Projects/PyPlay Mp3 Player/PyPlay Mp3 Player.png",
            description: "PyPlay MP3 Player is a user-friendly desktop application built with Python.",
        },
];

const c_sharp_projects_catalogue = [
        {
            name: "WWBM Quizz Game", 
            value : "CSharp-Projects/WWBM Quizz Game/WWBM Quizz Game.html", 
            video: "CSharp-Projects/WWBM Quizz Game/WWBM Quizz Game.mp4",
            thumbnail: "CSharp-Projects/WWBM Quizz Game/WWBM Quizz Game.png",
            description: "WWBM Quizz Game is an early-developed desktop GUI application \
            inspired by the TV Show 'Who Wants to Be a Millionaire?'",
        },
        {
            name: "Basic MP3 Player", 
            value : "CSharp-Projects/MP3Player/MP3Player.html", 
            video: "CSharp-Projects/MP3Player/MP3Player.mp4",
            thumbnail: "CSharp-Projects/MP3Player/MP3Player.png",
            description: "This is an early-developed  Basic MP3 Player designed for .mp3 media playback."
        },
];

const cpp_opengl_projects_catalogue = [
        {
            name: "Car Game Project 2D", 
            value : "Cpp-OpenGL-Projects/Car Game Project 2D/Car Game Project 2D.html", 
            video: "Cpp-OpenGL-Projects/Car Game Project 2D/Car Game Project 2D.mp4", 
            thumbnail: "Cpp-OpenGL-Projects/Car Game Project 2D/Car Game Project 2D.png",
            description: "Car Game 2D is a mini-game focusing on driving through traffic while \
            avoiding collisions."
        },
        {
            name: "Traffic Simulator 2D", 
            value : "Cpp-OpenGL-Projects/Traffic Simulator 2D/Traffic Simulator 2D.html", 
            video: "Cpp-OpenGL-Projects/Traffic Simulator 2D/Traffic Simulator 2D.mp4",
            thumbnail: "Cpp-OpenGL-Projects/Traffic Simulator 2D/Traffic Simulator 2D.png",
            description: "2D Traffic Simulator is an early ambitious project aimed at creating \
            a dynamic traffic environment with AI-controlled vehicles."
        },
];

const embedded_c_catalogue = [
        {
            name: "Embedded Countdown Timer", 
            value : "Embedded-C-Projects/Embedded Countdown Timer/Embedded Countdown Timer.html", 
            video: "Embedded-C-Projects/Embedded Countdown Timer/Embedded Countdown Timer.mp4",
            thumbnail: "Embedded-C-Projects/Embedded Countdown Timer/Embedded Countdown Timer.png",
            description: "Simulated Embedded Countdown Timer with a 7-segment LED controller and microcontroller.",
        },
];


const javascript_games_catalogue = [
        {
            name: "Knight Chess Game", 
            value : "Javascript-Projects/knight_chess_resources/knight_chess_game.html",
            thumbnail : "Javascript-Projects/knight_chess_resources/knight_chess_game.png",
            description: "Knight Chess is a puzzle game where players move the Knight piece across every square \
            on the chessboard, following its unique movement pattern. "
        },
        {
            name: "Snake Game", 
            value : "Javascript-Projects/snake_resources/snake_game.html",
            thumbnail : "Javascript-Projects/snake_resources/snake_game.png",
            description: "Classic Snake Game prototype - focuses on controlling the snake within a grid-based \
            play area."
        },
        {
            name: "Tetris Game", 
            value : "Javascript-Projects/tetris_resources/tetris_game.html",
            thumbnail : "Javascript-Projects/tetris_resources/tetris_game.png",
            description: "Tetris is a classic game in the player must move and rotate falling bricks of various \
            shapes to complete horizontal rows."
        },
        {
            name: "TowerBlocks Game", 
            value : "Javascript-Projects/towerblocks_resources/tower_blocks_game.html",
            thumbnail : "Javascript-Projects/towerblocks_resources/tower_blocks_game.png",
            description: "TowerBlocks is a timing-based stacking game where the player must drop blocks one on top \
            of the other to build the tallest skyscraper possible."
        },
        {
            name: "Canvas Snake", 
            value : "Javascript-Projects/canvas_snake/canvas_snake.html",
            thumbnail : "Javascript-Projects/canvas_snake/canvas_snake.png",
            description: "Snake is a game in which the player has to guide the snake across the playfield to \
            collect fruit."
        },
];

/*

const cpp_projects_catalogue = [
        {
            name: "Pocket Calculator", 
            value : "Cpp-Projects/Pocket Calculator.html", 
            video: "Cpp-Projects/Pocket Calculator.mp4",
            thumbnail: "Cpp-Projects/Pocket Calculator.png",
        },
];

const java_catalogue = [
        {
            name: "Java Racing Environment", 
            value : "Java-Projects/Java Racing Environment/Java Racing Environment.html",
            video : "Java-Projects/Java Racing Environment/Java Racing Environment.mp4",
            thumbnail : "Java-Projects/Java Racing Environment/Java Racing Environment.png",
        },
        {
            name: "Java MP3 Player", 
            value : "Java-Projects/Java MP3 Player.html",
            video : "Java-Projects/Java MP3 Player.mp4",
            thumbnail : "Java-Projects/Java MP3 Player.png",
        },
];

const html_projects_catalogue = [
        {
            name: "Full Web Page Template", 
            value : "../../Html-Projects/Web Templates/project38 full web page template/index.html",
            thumbnail : "../../Html-Projects/Web Templates/project38 full web page template/index.png",
        },
        {
            name: "Musician Web Page Template", 
            value : "../../Html-Projects/Web Templates/project39 musician web page template/index.html",
            thumbnail : "../../Html-Projects/Web Templates/project39 musician web page template/index.png",
        },
        {
            name: "Python MP3 Player Webpage", 
            value : "../../Html-Projects/Web Templates/project40 python mp3 player webpage/index.html",
            thumbnail : "../../Html-Projects/Web Templates/project40 python mp3 player webpage/index.png",
        },
        {
            name: "Free Sound Effects Web Template", 
            value : "../../Html-Projects/Web Templates/free sound effects web template/index.html",
            thumbnail : "../../Html-Projects/Web Templates/free sound effects web template/index.png",
        },
        {
            name: "Old Portfolio", 
            value : "../../Html-Projects/Web Templates/portfolio_old/index.html",
            thumbnail : "../../Html-Projects/Web Templates/portfolio_old/index.png",
        },
];

const angularjs_projects_catalogue = [
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


const javascript_games_videos_catalogue = [
        {name: "Knight Chess Game Video", value : "./Javascript-Games-Presentation-Video/knight_chess_video_page.html"},
        {name: "Snake Game Video", value : "./Javascript-Games-Presentation-Video/snake_video_page.html"},
        {name: "Tetris Game Video", value : "./Javascript-Games-Presentation-Video/tetris_video_page.html"},
        {name: "TowerBlocks Game Video", value : "./Javascript-Games-Presentation-Video/towerblocks_video_page.html"},
        {name: "Canvas Snake Game Video", value : "./Javascript-Games-Presentation-Video/canvas_snake_video_page.html"},
];


const javascript_webapps_catalogue = [
        {name: "Message Encoder", value : "../../Javascript-Projects/webapps_resources/message_encoder.html"},
        {name: "Message Decoder", value : "../../Javascript-Projects/webapps_resources/message_decoder.html"},
        {name: "RandomORG", value : "../../Javascript-Projects/webapps_resources/random_org.html"},
        {name: "Roadcross Game", value : "../../Javascript-Projects/webapps_resources/roadcross_game.html"},
        {name: "AI Pal Chatboot", value : "https://ai-pal-chatbot.onrender.com"},
        
];

const portable_downloads = [
        {name: "Python MP3 Player V3 - Runnable Script", value : "../../Portable-Downloads/PyPlay MP3 Player/Python MP3 Player V3 - Runnable Script.7z"},
        {name: "Python MP3 Player V3 - Windows Executable", value : "../../Portable-Downloads/PyPlay MP3 Player/Windows/Python MP3 Player V3 - Windows Executable.7z"},
        {name: "Python MP3 Player V4 - Runnable Script", value : "../../Portable-Downloads/PyPlay MP3 Player/Python MP3 Player V4 - Runnable Script.7z"},
        {name: "Python MP3 Player V4 - Windows Executable", value : "../../Portable-Downloads/PyPlay MP3 Player/Windows/Python MP3 Player V4 - Windows Executable.7z"},
        {name: "Unity TowerBlocks", value : "../../Portable-Downloads/TowerBlocks Game/TowerBlocks Game.7z"},
        {name: "Unity 3D Racing Environment", value : "../../Portable-Downloads/Unity 3D Drag Racing Environment/Unity 3D Drag Racing Environment.7z"},
        {name: "WWBM Quizz Game", value : "../../Portable-Downloads/WWBM Quizz Game/WWBM Quizz Game.7z"},
        {name: "Traffic Simulator 2D", value : "../../Portable-Downloads/Traffic Simulator 2D/Traffic Simulator 2D.7z"},
        {name: "Java 2D Racing Environment", value : "../../Portable-Downloads/Java 2D Drag Racing Environment/Java 2D Drag Racing Environment.7z"},
];

const github_projects_links = [
        {name: "Python MP3 Player", value : "https://github.com/dragos-vacariu/Python-Projects/tree/master/pyplay%20mp3%20player"},
        {name: "Unity TowerBlocks", value : "https://github.com/dragos-vacariu/Unity-Csharp-Projects/tree/master/TowerBlocks"},
        {name: "Unity 3D Racing Environment", value : "https://github.com/dragos-vacariu/Unity-Csharp-Projects/tree/master/Drag%20Racing"},
        {name: "C# WWBM Quizz Game", value : "https://github.com/dragos-vacariu/CSharp-Projects/tree/master/VS%20Projects%20GUI/WWBM%20Quizz%20Game"},
        {name: "OpenGL Car Game Project 2D", value : "https://github.com/dragos-vacariu/Cpp-OpenGL-Projects/tree/master/Projects/car%20game%20project"},
        {name: "OpenGL Traffic Simulator 2D", value : "https://github.com/dragos-vacariu/Cpp-OpenGL-Projects/tree/master/Projects/traffic%20simulator%202d"},
        {name: "Java 2D Racing Environment", value : "https://github.com/dragos-vacariu/Java-Projects/tree/master/Projects%20GUI/project44%20drag%20racing%20simulator"},
        {name: "Java MP3 Player", value : "https://github.com/dragos-vacariu/Java-Projects/tree/master/Projects%20GUI/project34%20java%20mp3%20player%20application"},
];

*/


const fullstack_apps_page = {
    name: "FullStack WebApps", 
    catalogue: fullstack_catalogue,
    description: "These projects demonstrate my ability to design, develop, and deploy comprehensive \
            fullstack applications that deliver seamless user interactions and robust functionality.",
};
fullstack_apps_page.value = `${rootDir}/catalogue.html#${fullstack_apps_page.name}`;

const unity_page = {
    name: "Unity C# Projects",
    catalogue: unity_csharp_catalogue,
    description: "These projects showcase my growth as a developer, driven by curiosity and a \
            passion for crafting interactive graphical applications using the Unity Game Engine \
            and C#. They demonstrate my ability to create engaging experiences and bring ideas \
            to life through immersive environments.",
};
unity_page.value = `${rootDir}/catalogue.html#${unity_page.name}`;

const embedded_c_page = {
    name: "Embedded C Projects",
    catalogue: embedded_c_catalogue,
    description: "This catalogue features some simple embedded systems projects, developed and \
            simulated using Proteus PCB Design and Circuit Simulator. ",
};
embedded_c_page.value = `${rootDir}/catalogue.html#${embedded_c_page.name}`;

const python_page = {
    name: "Python tKinter Projects",
    catalogue: python_projects_catalogue,
    description: "On this page, you’ll find links to presentations that showcase the projects \
            I’ve developed using Python.",
};
python_page.value = `${rootDir}/catalogue.html#${python_page.name}`;

const c_sharp_page = {
    name: "C# .NET Projects",
    catalogue : c_sharp_projects_catalogue,
    description: "On this page, you’ll find links to presentations showcasing the projects I’ve \
        developed using C# and the Microsoft .NET Framework.",
};
c_sharp_page.value = `${rootDir}/catalogue.html#${c_sharp_page.name}`;

const cpp_opengl_page = {
    name: "C++ OpenGL Projects",
    catalogue : cpp_opengl_projects_catalogue,
    description: "On this page, you’ll find links to presentations showcasing the projects \
        I’ve developed using C++ and the OpenGL graphics API.",
};
cpp_opengl_page.value = `${rootDir}/catalogue.html#${cpp_opengl_page.name}`;

const javascript_games_page = {
    name: "JavaScript Games",
    catalogue : javascript_games_catalogue,
    description: "These projects highlight my growth as a developer, driven by curiosity and a passion \
        for creating interactive, browser-based games using JavaScript, HTML, and CSS.",
};
javascript_games_page.value = `${rootDir}/catalogue.html#${javascript_games_page.name}`;


/*
const javascript_webapps_page = {
    name: "JavaScript WebApps", 
    catalogue : javascript_webapps_catalogue,
    description: "These projects showcase my growth as a developer, fueled by curiosity and a passion \
        for creating interactive web applications primarily using JavaScript, HTML, and CSS.",
};
javascript_webapps_page.value = `${rootDir}/catalogue.html#${javascript_webapps_page.name}`;

const cpp_page = {
    name: "C++ .NET Projects",
    catalogue : cpp_projects_catalogue,
    description: "On this page, you’ll find links to presentations showcasing the projects \
        I’ve developed using C# and the Microsoft .NET Framework.",
};
cpp_page.value = `${rootDir}/catalogue.html#${cpp_page.name}`;

const java_page = {
    name: "Java Projects",
    catalogue: java_catalogue,
    description: "These projects reflect my foundational skills and evolving understanding of \
            desktop application development",
};
java_page.value = `${rootDir}/catalogue.html#${java_page.name}`;

const html_page = {
    name: "HTML & CSS Templates",
    catalogue : html_projects_catalogue,
    description: "On this page, you’ll find links to web templates I created while learning \
        HTML and CSS—marking the early steps of my journey into front-end development.",
};
html_page.value = `${rootDir}/catalogue.html#${html_page.name}`;

const angularjs_page = {
    name: "AngularJS Practicals",
    catalogue : angularjs_projects_catalogue,
    description: "On this page, you’ll find links to several AngularJS exercises I completed during my \
        early days of learning Angular and JavaScript for web development.",
};
angularjs_page.value = `${rootDir}/catalogue.html#${angularjs_page.name}`;

const portable_downloads_page = {
    name: "Portable Downloads", 
    catalogue : portable_downloads,
    description: "On this page, you will find direct download links for some of the most \
        impactful and valuable projects showcased in the Portfolio.",
};
portable_downloads_page.value = `${rootDir}/catalogue.html#${portable_downloads_page.name}`;

const javascript_games_presentation_video = {
    name: "Video Presentation Page", 
    catalogue: javascript_games_videos_catalogue,
    description: "On this page, you'll find presentation videos demonstrating each mini-game \
        I have built with JavaScript.",
};
javascript_games_presentation_video.value = `${rootDir}/catalogue.html#${javascript_games_presentation_video.name}`;

const github_project_external_links_page = {
    name: "GitHub Projects Links", 
    catalogue : github_projects_links,
    description: "On this page, you'll find external links to Github Projects.",
};
github_project_external_links_page.value = `${rootDir}/catalogue.html#${github_project_external_links_page.name}`;

const github_repository_page = {
    name: "GitHub Repositories", 
    catalogue : "",
    description: "On this page, you'll find external links to Github Repositories.",
};
github_repository_page.value = `${rootDir}/catalogue.html#${github_repository_page.name}`;

*/

const pageObject = {
    
    page_navigation : [
        {icon: "🏡", name: "Home", value : homePage},
        {icon: "💼", name: "Project Catalogue", value : rootDir + "/catalogue.html"},
        {icon: "☎", name: "Contact", value : rootDir + "/contact.html"},
        {icon: "👤", name: "About Me", value : rootDir + "/about.html"},
        {icon: "📚", name: "Learning Portal", value : rootDir + "/portal.html"},
    ],
    
    project_catalogue_dropdown : [
        fullstack_apps_page, 
        unity_page, 
        javascript_games_page,
        python_page, 
        cpp_opengl_page, 
        embedded_c_page,
        c_sharp_page,
        //html_page,
        //cpp_page,
        //angularjs_page,
        //java_page,
        
        //github_project_external_links_page,
    ],
    
    template_info : [
        "Author: Dragos Vacariu", "Date: 2017", "Title: Full Web Page Template", 
        "Revised in: 2024", "Hosted by: GitHub", " ", "Tools: HTML4, HTML5, CSS, CSS3, JavaScript, \
        Angular"],
    
    
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
                         
const social_networks = [
    {name: "GitHub", value: "https://www.GitHub.com/dragos-vacariu"}, 
    {name: "LinkedIn", value: "https://www.LinkedIn.com/in/dragos-vacariu-em"},
];

const training_materials = [
    {name: "C Language", value: rootDir + "/portal.html#multiple@C&description_generic-programming_variable-arguments-lists_simple-data-types_complex-data-types_preprocessor-directives_loops_collections_collection-methods_dynamic-memory-allocation_read-from-file_write-to-file_serialization_deserialization_enums_concurrent-programming_exception-handling_bitwise-operators_default-parameters_interfaces_macros_defines_random-generators_command-line-arguments_ternary-operator_modular-programming_string-methods_datatype-conversions_optional-parameters_operators_pre-post-incrementation_recursion_polymorphism_oop_encapsulation_inheritance_abstraction_constructors_instantiation_destructors_function-overloading_operator-overloading_namespaces_abstract-classes_decorators_reflection_partial-classes_minification_regular-expressions_lambda-anonymous-functions%regular"},
    {name: "C++ Language", value: rootDir + "/portal.html#multiple@C++&description_generic-programming_variable-arguments-lists_simple-data-types_complex-data-types_preprocessor-directives_loops_collections_collection-methods_dynamic-memory-allocation_read-from-file_write-to-file_serialization_deserialization_enums_concurrent-programming_exception-handling_bitwise-operators_default-parameters_interfaces_macros_defines_random-generators_command-line-arguments_ternary-operator_modular-programming_string-methods_datatype-conversions_optional-parameters_operators_pre-post-incrementation_recursion_polymorphism_oop_encapsulation_inheritance_abstraction_constructors_instantiation_destructors_function-overloading_operator-overloading_namespaces_abstract-classes_decorators_reflection_partial-classes_minification_regular-expressions_lambda-anonymous-functions%regular"},
    {name: "C# Language", value: rootDir + "/portal.html#multiple@CSharp&description_generic-programming_variable-arguments-lists_simple-data-types_complex-data-types_preprocessor-directives_loops_collections_collection-methods_dynamic-memory-allocation_read-from-file_write-to-file_serialization_deserialization_enums_concurrent-programming_exception-handling_bitwise-operators_default-parameters_interfaces_macros_defines_random-generators_command-line-arguments_ternary-operator_modular-programming_string-methods_datatype-conversions_optional-parameters_operators_pre-post-incrementation_recursion_polymorphism_oop_encapsulation_inheritance_abstraction_constructors_instantiation_destructors_function-overloading_operator-overloading_namespaces_abstract-classes_decorators_reflection_partial-classes_minification_regular-expressions_lambda-anonymous-functions%regular"},
    {name: "Java Language", value: rootDir + "/portal.html#multiple@Java&description_generic-programming_variable-arguments-lists_simple-data-types_complex-data-types_preprocessor-directives_loops_collections_collection-methods_dynamic-memory-allocation_read-from-file_write-to-file_serialization_deserialization_enums_concurrent-programming_exception-handling_bitwise-operators_default-parameters_interfaces_macros_defines_random-generators_command-line-arguments_ternary-operator_modular-programming_string-methods_datatype-conversions_optional-parameters_operators_pre-post-incrementation_recursion_polymorphism_oop_encapsulation_inheritance_abstraction_constructors_instantiation_destructors_function-overloading_operator-overloading_namespaces_abstract-classes_decorators_reflection_partial-classes_minification_regular-expressions_lambda-anonymous-functions%regular"},
    {name: "JavaScript Language", value: rootDir + "/portal.html#multiple@JavaScript&description_generic-programming_variable-arguments-lists_simple-data-types_complex-data-types_preprocessor-directives_loops_collections_collection-methods_dynamic-memory-allocation_read-from-file_write-to-file_serialization_deserialization_enums_concurrent-programming_exception-handling_bitwise-operators_default-parameters_interfaces_macros_defines_random-generators_command-line-arguments_ternary-operator_modular-programming_string-methods_datatype-conversions_optional-parameters_operators_pre-post-incrementation_recursion_polymorphism_oop_encapsulation_inheritance_abstraction_constructors_instantiation_destructors_function-overloading_operator-overloading_namespaces_abstract-classes_decorators_reflection_partial-classes_minification_regular-expressions_lambda-anonymous-functions%regular"},
    {name: "Python Language", value: rootDir + "/portal.html#multiple@Python&description_generic-programming_variable-arguments-lists_simple-data-types_complex-data-types_preprocessor-directives_loops_collections_collection-methods_dynamic-memory-allocation_read-from-file_write-to-file_serialization_deserialization_enums_concurrent-programming_exception-handling_bitwise-operators_default-parameters_interfaces_macros_defines_random-generators_command-line-arguments_ternary-operator_modular-programming_string-methods_datatype-conversions_optional-parameters_operators_pre-post-incrementation_recursion_polymorphism_oop_encapsulation_inheritance_abstraction_constructors_instantiation_destructors_function-overloading_operator-overloading_namespaces_abstract-classes_decorators_reflection_partial-classes_minification_regular-expressions_lambda-anonymous-functions%regular"},
    {name: "AutoSAR", value: rootDir + "/portal.html#multiple@AutoSAR&description_ecu-communication_ecu-networks_can-protocol_can-transceiver_can-controller-driver_can-interface%regular"},
];
                         
const footer_table_contents = [
    {name: "Technical References",  list_values: pageObject.connections_list, content: "objects_with_links"}, 
    {name: "Project Catalogue",  list_values: pageObject.project_catalogue_dropdown, content: "objects_with_links"},
    {name: "Social Networking",  list_values: social_networks, content: "objects_with_links"},
    {name: "Learning Manifests",  list_values: training_materials, content: "objects_with_links"},
];


const HTML_Object_PageHeader = document.getElementById("page_header");

if (HTML_Object_PageHeader != null)
{
    const header_title = document.createElement("div");
    header_title.id = "header_title";
    
        const logo_div = document.createElement("div");
        logo_div.id = "logo_div";
        
            const logo_img = document.createElement("img");
            logo_img.id = "logo";
            logo_img.src = rootDir + "/website_resources/global/images/logo.png";
            logo_img.alt = "logo image";
        
        logo_div.appendChild(logo_img);
        
        const title_and_description_div = document.createElement("div");
        title_and_description_div.id = "title_and_description_div";
        
            const page_title = document.createElement("div");
            page_title.id = "page_title";
            
            const page_description = document.createElement("div");
            page_description.id = "page_description";
        
        title_and_description_div.appendChild(page_title);
        title_and_description_div.appendChild(page_description);
    
    header_title.appendChild(logo_div);
    header_title.appendChild(title_and_description_div);
    
    const nav = document.createElement("nav");
    
    for(let index = 0; index < pageObject.page_navigation.length; index++)
    {
        const divElement = document.createElement("div");
        divElement.className = "menu_page_item";
            const a = document.createElement("a");
            a.className = "outer_href";
            a.id = pageObject.page_navigation[index].name;
            a.href = pageObject.page_navigation[index].value;
            
                const icon = document.createElement("span");
                icon.className = "link_icon";
                icon.innerText = pageObject.page_navigation[index].icon;
                
                const linkText = document.createElement("span");
                linkText.id = "link_text";
                linkText.innerText = pageObject.page_navigation[index].name;
            
            a.appendChild(icon);
            a.appendChild(linkText);
        divElement.appendChild(a);
        
        nav.appendChild(divElement);
    }
    
    HTML_Object_PageHeader.appendChild(header_title);
    HTML_Object_PageHeader.appendChild(nav);
}

const HTML_Object_PageFooter = document.getElementById("page_footer");

if (HTML_Object_PageFooter != null)
{
    const footer_tabelation_div = document.createElement("div");
    footer_tabelation_div.id = "footer_tabelation_div";
    
    for(let index = 0; index < footer_table_contents.length; index++)
    {
        const footer_columns = document.createElement("div");
        footer_columns.className = "footer_columns";
        const column_title = document.createElement("p");
        column_title.className = "column_title";
        column_title.innerHTML = footer_table_contents[index].name;
        
        const footer_list = document.createElement("ul");
        footer_list.className = "footer_list";
        
        for(let j = 0; j < footer_table_contents[index].list_values.length; j++)
        {
            const li = document.createElement("li");
            
            const baseUrl = window.location.href.split("#")[0]
            const isPageUsingRoutes = baseUrl.endsWith(rootDir + "/portal.html") || 
                                  baseUrl.endsWith(rootDir + "/portal_classic.html") ||
                                  baseUrl.endsWith(rootDir + "/catalogue.html");
            
            if(footer_table_contents[index].content == "text")
            {
                li.innerHTML = footer_table_contents[index].list_values[j];
            }
            else if(footer_table_contents[index].content == "objects_with_links" && isPageUsingRoutes == true)
            {
                const value = footer_table_contents[index].list_values[j].value;
                const name = footer_table_contents[index].list_values[j].name;
                
                const a_element = document.createElement("a");
                a_element.href = value;
                a_element.onclick = function()
                {
                    /*This function will be called if I'm on the Portal Page and click on a footer link pointing to a 
                    route of the Portal Page*/
                    window.location.href = value;
                    
                    /*Go to the beggining*/
                    window.scrollTo(0,0);
                    /*Force a reload, that will ensure the route is loaded*/
                    window.location.reload()
                };
                a_element.innerText = name;
                
                li.appendChild(a_element);
            }
            else if(footer_table_contents[index].content == "objects_with_links")
            {
                const value = footer_table_contents[index].list_values[j].value;
                const name = footer_table_contents[index].list_values[j].name;
                
                const a_element = document.createElement("a");
                a_element.href = "/catalogue.html#" + name;
                a_element.innerText = name;
                
                li.appendChild(a_element);
            }
            footer_list.appendChild(li);
        }
        footer_columns.appendChild(column_title);
        footer_columns.appendChild(footer_list);
        
        footer_tabelation_div.appendChild(footer_columns);
    }

    const footer_h5 = document.createElement("h5");
    footer_h5.id = "footer_endline";
    footer_h5.innerHTML = pageObject.footer_paragraph;
    footer_tabelation_div.appendChild(footer_h5);
    
    const copyright_message = document.createElement("h5");
    copyright_message.id = "copyright_message";
    copyright_message.innerHTML = pageObject.footer_copyright;
    footer_tabelation_div.appendChild(copyright_message);


    HTML_Object_PageFooter.appendChild(footer_tabelation_div);
}

document.getElementById("page_title").innerText = page_title;
document.getElementById("page_description").innerText = domain;


function fadingParagraphsOnScrolling_Effect()
{
    /*Adding fading-out transition to paragraphs on scrolling*/
    
    const fading_elements = document.getElementsByClassName("fading_paragraph");
    
    if(fading_elements)
    {
        window.addEventListener("scroll",  () => { addFadingEffect() });
        
        function addFadingEffect()
        {
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
                
                const maxVisible = Math.min(elementHeight, viewportBottom - viewportTop);
                const ratio = visibleHeight / maxVisible;

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
        }
    }
}

function imageScaleOnScrolling_Effect()
{
    /*Adding roll-over transition to paragraphs on scrolling*/
    const sections = document.querySelectorAll('.scale_scroll_img_anim');

    /*
    IntersectionObserver is a JavaScript API that allows you to watch when an element 
    enters or leaves the viewport (or another container).

    You don’t need to manually calculate scroll positions or offsets.

    It’s efficient because the browser handles the observation, rather than running 
    code on every scroll event.
    */
    
    if(sections)
    {
        const scale_scroll_observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting)
                {
                    entry.target.classList.add('visible');  // element enters viewport
                }
                else
                {
                    entry.target.classList.remove('visible'); // element leaves viewport
                }
            });
        }, { threshold: 0.2 }); // 20% of element must be visible
        
        sections.forEach(section => scale_scroll_observer.observe(section));
    }
}

function addActivePageStyle()
{
    /*Add the styling for the page selection, based on the element in which the page is indexed*/
    /*This script is supposed to be included only within the pages listed in the navbar*/
    var menu_items = document.getElementsByClassName("menu_page_item");

    for(var index = 0; index < menu_items.length; index++)
    {
        let link_text = menu_items[index].children[0].querySelector('#link_text');
        
        if (document.title.split(" - ")[0] == link_text.textContent)
        {
           menu_items[index].style = "border-bottom:solid 2px black; font-weight: bold";
           break;
        }
    }
}

function truncatedParagraphsHandling()
{
    const paras = document.getElementsByClassName("paragraph");
    if(paras)
    {
        for (let index = 0; index < paras.length; index++)
        {
                const para = paras[index]; // single element
                const toggle_button = para.querySelector(".show_more_less_toggle_button");
                
                if(toggle_button)
                {
                    toggle_button.addEventListener("click", 
                           (e) => {showMoreLessToggleButton(e.target) } );
                }
        }

        function showMoreLessToggleButton(btn)
        {
            const content = btn.parentElement.querySelector(".content");
            if(content)
            {
                if (content.classList.contains("truncated"))
                {
                    content.classList.remove("truncated");
                    btn.textContent = "See Less";
                }
                else
                {
                    content.classList.add("truncated");
                    btn.textContent = "See More";
                }
            }
        }
    }
}



function updateHeadMeta()
{
    var page_title_list = window.location.href.split("/");
    var parsed_title = "";

    let lastPart = page_title_list[page_title_list.length - 1];
    
    if(lastPart == "")
    {
        parsed_title += "Home - ";
    }
    else if (lastPart.includes("catalogue.html#"))
    {
        parsed_title = "Project Catalogue - ";
    }
    else if (lastPart.includes("portal_classic.html#") || lastPart.includes("portal.html#"))
    {
        parsed_title = "Learning Portal - ";
    }
    else
    {
        lastPart = lastPart.replace('.html', '');
        lastPart = lastPart.replace('index', 'home');
        lastPart = lastPart.replace('portal_classic', 'Learning Portal');
        lastPart = lastPart.replace('portal', 'Learning Portal');
        lastPart = lastPart.replace('about', 'About Me');
        lastPart = lastPart.replace('catalogue', 'Project Catalogue');
        
        if(page_title_list.includes("catalogue"))
        {
            parsed_title += "Project Catalogue - " + lastPart + " - ";
        }
        else
        {
            parsed_title += lastPart + " - ";
        }
    }   
    
    //Capitalizing
    parsed_title += page_title;
    parsed_title = parsed_title.charAt(0).toUpperCase() + parsed_title.slice(1);
    
    //Adding the space
    parsed_title = parsed_title.replace("%20", " ");
    
    const metadata = {
        title: parsed_title,
        description: parsed_title,
        keywords: "Github,Pages,Online,Portfolio,IT,Projects,JavaScript,HTML,CSS,Programming,Software,Development",
        author: "Dragos Vacariu",
        ogTitle: "Open Graph Title",
        ogImage: "path/to/image.jpg",
        ogUrl: "https://dragos-vacariu.github.io"
    };

    // Set document title
    document.title = metadata.title;

    // Helper function to create or update meta tags
    function setMetaTag(attributeName, attributeValue, content) {
        let meta = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute(attributeName, attributeValue);
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
    }

    // Update or create meta tags
    setMetaTag('name', 'description', metadata.description);
    setMetaTag('name', 'keywords', metadata.keywords);
    setMetaTag('name', 'author', metadata.author);
    setMetaTag('property', 'og:title', metadata.ogTitle);
    setMetaTag('property', 'og:image', metadata.ogImage);
    setMetaTag('property', 'og:url', metadata.ogUrl);
}

imageScaleOnScrolling_Effect();

truncatedParagraphsHandling();

fadingParagraphsOnScrolling_Effect();

// Call this function whenever you need to update the metadata
updateHeadMeta();

addActivePageStyle();