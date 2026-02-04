from flask import Flask, render_template
from flask import request, jsonify #needed in the chat function for the frontend/chat route
#but it will receive an HTML error page (which starts with <html> or <!doctype html>).

import argparse
import os

from flask_cors import CORS

from flask import send_file

#Creating a Flask app to handle communication between frontend client and the AI server.
#This backend python script will act as middlemen between frontend client and AI server.
#The purpose for this script is to keep the creditentials granting the rights to access the
#AI servers conceilled

app = Flask(__name__, template_folder='.')

#app = Flask(__name__, static_folder='static/', static_url_path='/') #this is done by default

#====================================================================================================================
#CHANGES DONE TO ANY RESOURCES FROM THE STATIC/TEMPLATES DIRECTORIES MAY REQUIRED A RESTART OF THE PYTHON SCRIPT 
#UNLESS USING AUTO-RELOAD
#====================================================================================================================

CORS(app)  # <- This enables CORS for all routes and origins
#Enables Cross-Origin Resource Sharing, allowing the frontend to make requests to this backend.
'''This backend application will act as entry point for the frontend application. So even though the 
user will see the frontend, the access to the frontend index.html is done by this python application.
In order for the Frontend application to be able to request access to the local frontend resources such as
javascript files, css file, logo image, etc. It requires CORS policy permissions.
'''

@app.route('/')
def index():
    #When connecting to the localhost the ip address will lead to index.html
    return render_template('note_taking_appwrite.html')

#Workaround to keep javascript at same level with python script and html file.
@app.route('/note_taking_appwrite_17_0_0.js')
def serve_js():
    return send_file('note_taking_appwrite_17_0_0.js')

if __name__ == "__main__":

    #Defining the port to be used by the application
    parser = argparse.ArgumentParser() #commandline arguments parser
    
    #if no port argument provided via commandline, then the port will be 5000
    parser.add_argument('--port', type=int, default=5000, help='Port to run the server on')
    args = parser.parse_args() #get the arguments we just parsed
    
    #The default value of PORT is 10000 for all Render web services. You can override this value by 
    #setting the environment variable for your service in the Render Dashboard.

    
    #The app will be accessible on all network interfaces (0.0.0.0) allowing external access, not just localhost.
    app.run(host="0.0.0.0", port=80) #use the port
    #0.0.0.0 is not a real IP — it's just an instruction to Flask to accept incoming connections from any IP. 
    #It's useful for servers, as they have different localhost ip addresses.



