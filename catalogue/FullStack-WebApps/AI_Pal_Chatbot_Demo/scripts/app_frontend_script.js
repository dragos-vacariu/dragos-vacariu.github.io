//======================================================================================
//  CONFIGURATION SECTION
//======================================================================================

//The backend API endpoints for local and online (Render) deployment
const local_url_route = "/api/chat"
const global_url_route = "https://ai-pal-chatbot.vercel.app/api/chat"

//THIS SHOULD BE TOGGLED BETWEEN GLOBAL / LOCAL DEPENDING TO WHERE THE FRONTEND IS RUNNING:
//FRONTEND APP RUNNING ON GITHUB PAGES -> global_url_route should be used
//FRONTEND APP RUNNING ON VERCEL -> local_url_route may be used
 
const active_url = global_url_route;

//======================================================================================
//  CHAT FUNCTION IMPLEMENTATION
//======================================================================================

//Cooldown configuration (in milliseconds)
const COOLDOWN_TIME = 10000; //10 seconds delay between requests (prevents spamming the backend)
let isCooldown = false; //Used to control when the user can send another message


//This function is executed every time the user hits the "Send" button.
async function send() 
{
    //Accessing the DOM elements representing the input text area and chat window.
    const input = document.getElementById('userInput');
    const chat = document.getElementById('chatbot_app');

    //Extracting the message entered by the user and removing extra spaces
    const message = input.value.trim(); 
    
    //If the user entered a message and the cooldown timer is not active
    if (message && !isCooldown)
    {
        input.value = ""; //removing the user message from the textArea element
        
        //Creating a chat bubble and adding the user's sent message:
        chat.innerHTML += `<div class="bubble user">${marked.parse(message)}</div>`;

        try 
        {
            //======================================================================================
            //      SHOWING A TEMPORARY "THINKING" BUBBLE WHILE WAITING FOR THE AI RESPONSE
            //======================================================================================
            const loadingBubble = document.createElement('div');
            loadingBubble.className = "bubble bot typing";
            loadingBubble.textContent = "🤔 Thinking...";
            chat.appendChild(loadingBubble);
            chat.scrollTop = chat.scrollHeight;

            //======================================================================================
            //      ATTEMPTING TO CONNECT TO THE SERVER AND GET A VALID REPLY
            //======================================================================================
            const response = await fetch(active_url, //the frontend will wait for a reply from the backend
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });

            //======================================================================================
            //      HANDLING POSSIBLE SERVER-SIDE ERRORS AND RATE LIMITING
            //======================================================================================

            //Error 429 means that the service is busy or your daily token limit has been reached
            if (response.status === 429) 
            {
                chat.removeChild(loadingBubble);
                chat.innerHTML += `<div class="bubble bot error">
                    The AI service is busy or your free daily quota has been reached.<br>
                    Please wait a few minutes and try again.
                </div>`;
                startCooldown(); //start a cooldown timer to avoid spam requests
                return;
            }

            //Any other unexpected server-side error
            if (!response.ok) 
            {
                chat.removeChild(loadingBubble);
                chat.innerHTML += `<div class="bubble bot error">
                    An unexpected server error occurred (Code: ${response.status}).<br>
                    Please try again later.
                </div>`;
                startCooldown(); //start a cooldown timer
                return;
            }

            //======================================================================================
            //      PROCESSING THE SERVER RESPONSE WHEN NO ERROR OCCURRED
            //======================================================================================

            // Wait for the response body to be fully read and parsed into a JavaScript object
            const data = await response.json(); 
            chat.removeChild(loadingBubble); //remove the temporary "thinking" bubble

            //If the AI returned a valid reply message
            if (data.reply) 
            {
                console.log(data.reply);
                console.log("===================================");
                ////Replacing markdown-like characters with equivalent HTML formatting for readability
                //data.reply = data.reply.replaceAll("###", "<br><br>");
                //data.reply = data.reply.replace(/```([\s\S]*?)```/g, (match, p1) => 
                //{
                //    //Wrap the captured code content with <pre><code> tags
                //    return `<pre><code>${p1}</code></pre>`;
                //});
                //data.reply = data.reply.replaceAll(" **", " <b>");
                //data.reply = data.reply.replaceAll("**", "</b> ");
                //data.reply = data.reply.replaceAll("- ", "<br>- ");
                //data.reply = data.reply.replaceAll("##", "<br><br> ");
                
                //If there is a reply, add the reply dynamically to the document
                chat.innerHTML += `<div class="bubble bot">${marked.parse(data.reply)}</div>`;
            } 
            else if (data.error) 
            {
                //If there is an error message received from the server, add the error message dynamically to the document
                chat.innerHTML += `<div class="bubble bot error">Error: ${data.error}</div>`;
            }
        } 
        catch (error) 
        {
            //======================================================================================
            //      HANDLING CLIENT-SIDE ERRORS (NETWORK / UNEXPECTED)
            //======================================================================================
            chat.innerHTML += `<div class="bubble bot error">🚫 Error: ${error.message}</div>`;
        }

        // Scroll chat window to bottom to keep the newest messages visible
        chat.scrollTop = chat.scrollHeight;
    }
    else
    {
        /*Nothing to do here. The user hit Send without entering a message or while in cooldown*/
    }
}


//======================================================================================
//      HELPER FUNCTIONS
//======================================================================================

//This function disables the Send button temporarily to prevent spamming requests
function startCooldown()
{
    isCooldown = true;
    const sendButton = document.getElementById('sendButton');
    if (sendButton) sendButton.disabled = true;

    setTimeout(() => 
    {
        isCooldown = false;
        if (sendButton) sendButton.disabled = false;
    }, COOLDOWN_TIME);
}


//Fixes a common issue on mobile browsers where the viewport height changes
//when the virtual keyboard appears. This ensures consistent layout size.
function updateVh() 
{
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

//Running the viewport adjustment once on page load and on every window resize.
updateVh();
window.addEventListener('resize', updateVh);
