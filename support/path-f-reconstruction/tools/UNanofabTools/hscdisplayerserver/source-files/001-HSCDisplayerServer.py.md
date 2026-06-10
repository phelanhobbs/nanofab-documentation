

# Source Reconstruction: UNanofabTools/HSCDisplayerServer.py

## Breadcrumbs

[Path F Home](../../../../README.md) | [Navigator](../../../../NAVIGATOR.md) | [Troubleshooting Routes](../../../../TROUBLESHOOTING-ROUTES.md) | [Reconstruction Checklist](../../../../RECONSTRUCTION-CHECKLIST.md) | [First Hour](../../../../MAINTAINER-FIRST-HOUR.md) | [Glossary](../../../../GLOSSARY.md) | [Evidence Template](../../../../REBUILD-EVIDENCE-TEMPLATE.md) | [Fixture Index](../../../../FIXTURE-AND-EVIDENCE-INDEX.md) | [Tool Index](../../../INDEX.md) | [System Map](../../../00-system-map/README.md) | [Owning Tool README](../README.md)

If you opened this page directly from search, stop here first: read the owning tool README, then return to this source page only for implementation evidence.

- Repository: `UNanofabTools`
- Relative path: `HSCDisplayerServer.py`
- Lines read: `2664`
- Dirty in working tree at generation time: `no`
- Untracked at generation time: `no`
- Sanitized SHA-256 prefix: `5123d572a827b1dd`
- Code fence language: `python`

## Reconstruction Purpose

This section is written so a maintainer can recreate the file's behavior without opening the source tree. The sanitized code excerpt preserves structure and names while removing secret-looking literal values. The line-by-line notes explain the operational reason for each line, the behavior that must survive a rewrite, and the edge cases to test.

## Python Structure Summary

- Imports: `import cgi`, `import html`, `from http.server import BaseHTTPRequestHandler, HTTPServer`, `import http.cookies`, `import logging`, `import random`, `import socketserver`, `import csv`, `import ssl`, `import sqlite3`, `import bcrypt`, `import uuid`, `import json`, `import datetime`, `from urllib.parse import parse_qs, unquote`, `import os`, `from datetime import datetime, timedelta`, `import io`, `import threading`, `import duo_client`, `import asyncio`, `import urllib.parse`, `from DuoKeys import DUO_IKEY, DUO_SKEY, DUO_HOST`, `import pandas`, `import re`, `import time`, `import traceback`
- Classes: `MyServer`
- Functions: `create_db`, `addUser`, `create_session_db`, `create_task_db`, `delete_old_sessions`, `getUserFromSession`, `hash_password`, `verify_userInfo`, `verify_userUnid`, `isUserAdmin`, `canUserAssign`, `createUserSession`, `sanitize_input`, `fetchUserTasks`, `generateHTMLfromUserTasks`, `generateHTMLfromTasks`, `duo_authenticate`, `cleanup_old_sessions`, `start_cleanup_thread`, `csv_to_html_table`, `getAndDisplay`, `graphLogs`, `preparetoGraph`, `graphCSV`, `graphTXT`, `handleHSCData`, `getMachineData`, `handle_error`, `getCurrUser`, `setSessionCookie`, `serveAdminPanel`, `fetchAdminPanelData`, `generateAdminPanelHTML`, `toggleAssign`, `deleteUser`, `is_secureConnection`, `redirect_to_https`, `sortByTime`, `getLogFiles`, `change_task_status`
- Routes: none detected

## Sanitized Source Excerpt

```python
# Copyright (c) 2024 Phelan Hobbs
# All rights reserved.
#
#
# This code was created to be used by the University of Utah Nanofab under the direction of Kathy Anderson and Jim Pierce
# This code is inteaded to display the information gained from the downloaded HSC files from the Nanofab website


import cgi
import html
from http.server import BaseHTTPRequestHandler, HTTPServer
import http.cookies
import logging
import random
import socketserver
import csv
import ssl
import sqlite3
import bcrypt
import uuid
import json
import datetime
import json
from urllib.parse import parse_qs, unquote
import os
from datetime import datetime, timedelta
import io
import ssl
import threading
import logging
import duo_client
import asyncio
import urllib.parse
from DuoKeys import DUO_IKEY, DUO_SKEY, DUO_HOST

import pandas as pd
import re  # Add this import for regular expressions
import time

logging.basicConfig(level=logging.DEBUG)

######################################################################
######################################################################
#DEBUGMODE IS HERE TO ALLOW FOR TESTING ON PERSONAL MACHINE       ####
#NEVER RUN DEBUG MODE ON SERVER                                   ####
#THIS IS JUST TO GET SOME RID OF SOME MILD ANNOYANCES             ####
#FOR EXAMPLE, NO DUO OR SSL STUFF WHEN TESTING                    ####
#ADDITIONALLY, TESTING IS DONE ON LOCALHOST                       ####
######################################################################
######################################################################
DEBUGMODE = False

#sets the directory for the HSC data files
DATA_DIR = os.path.join(os.path.dirname(__file__), 'HSCDATA')


#HTML string that starts the tablesort.js script
#appended to the HTML response
startSort = '''
            <script>
            document.addEventListener('DOMContentLoaded', function() {
                var headers = document.querySelectorAll('#sortableTable th');
                for (let i = 0; i < headers.length; i++) {
                    headers[i].addEventListener('click', function() {
                        sortTable(i);
                    });
                }
            });
            </script>
            '''

#creates a database with relevant loginInfo
def create_db():
    #connects to the database
    conn = sqlite3.connect('signininfo.db')
    cc = conn.cursor()
    #database has to have unique name and uNID
    #password is stored as hash for security purposes
    cc.execute('''CREATE TABLE IF NOT EXISTS signininfo (username TEXT UNIQUE, passwordHash TEXT, uNID TEXT UNIQUE, isAdmin BOOLEAN DEFAULT FALSE, canAssign BOOLEAN DEFAULT FALSE)''')

    conn.commit()
    conn.close()

#adds a user to the database
def addUser(username, password, uNID):
    #connects to the database
    conn = sqlite3.connect('signininfo.db')
    cc = conn.cursor()
    #hashes the password for security purposes
    secure_password = <redacted-secret-value>)
    try:
        #if the username or uNID already exists, the user cannot be added to the system
        #otherwise, the individal is added to the database with their username, password, and uNID
        cc.execute("INSERT INTO signininfo (username, passwordHash, uNID) VALUES (?, ?, ?)", (username, secure_password, uNID))
        conn.commit()
    except sqlite3.IntegrityError:
        print("Username or uNID already exists")
    finally:
        conn.close()

#creates a secondary database for session information that stores active cookies
#TODO TODO TODO TRY TO MAKE COOKIES EXPIRE AFTER A CERTAIN AMOUNT OF TIME
def create_session_db():
    conn = sqlite3.connect('sessioninfo.db')
    cc = conn.cursor()
    #deletes the old table if it existed and creates a new one
    #(this should be reset every time the server launches to prevent old sessions from being stored)
    cc.execute('''Drop TABLE IF EXISTS sessioninfo''')
    cc.execute('''CREATE TABLE sessioninfo (session_id TEXT UNIQUE, username TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)''')
    conn.commit()
    conn.close()

#creates a database for the tasks if it doesn't already exist
def create_task_db():
    conn = sqlite3.connect('tasks.db')
    cc = conn.cursor()

    # Create the tasks table without task_assignee column
    cc.execute('''
        CREATE TABLE IF NOT EXISTS tasks (
            task_id INTEGER PRIMARY KEY AUTOINCREMENT,
            task_title TEXT,
            task_description TEXT,
            task_assign_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            task_due_date TIMESTAMP,
            task_priority TEXT,
            task_assigner TEXT,
            task_status TEXT)
    ''')

    # Create the assignees table
    cc.execute('''
        CREATE TABLE IF NOT EXISTS assignees (
            task_id INTEGER,
            assignee_name TEXT,
            FOREIGN KEY(task_id) REFERENCES tasks(task_id))
    ''')


    #creates the table for task files
    cc.execute('''
        CREATE TABLE IF NOT EXISTS task_files (
            file_id INTEGER PRIMARY KEY AUTOINCREMENT,
            task_id INTEGER,
            file_path TEXT,
            FOREIGN KEY(task_id) REFERENCES tasks(task_id))
    ''')

    conn.commit()
    conn.close()


#deletes old sessions from the sessioninfo database
#sessions are deleted after cookie expiration date
def delete_old_sessions():
    conn = sqlite3.connect('sessioninfo.db')
    c = conn.cursor()

    cookieExp = datetime.now() - timedelta(minutes=2)
    c.execute("DELETE FROM sessioninfo WHERE created_at < ?", (cookieExp,))
    conn.commit()
    conn.close()


#retrieves the username from the session ID
def getUserFromSession(session_id):
    conn = sqlite3.connect('sessioninfo.db')
    c = conn.cursor()
    c.execute("SELECT username FROM sessioninfo WHERE session_id = ?", (session_id,))
    result = c.fetchone()
    conn.close()
    return result[0] if result else None

#hashes and salts passwords for purposes of security
def hash_password(password):
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt())

#adds a user to the sign in info database
#requires a unique username and uNID (used to reset password) alongside a password
def addUser(username, password, uNID):
    conn = sqlite3.connect('signininfo.db')
    #sets the cursor to sqlite3 table representing the start of the database
    cc = conn.cursor()
    secure_password = <redacted-secret-value>)
    #if username or uNID already exists, they cannot be added to the system
    #gives an error message instead
    try:
        cc.execute("INSERT INTO signininfo (username, passwordHash, uNID) VALUES (?, ?, ?)", (username, secure_password, uNID))
        conn.commit()
    except sqlite3.IntegrityError:
        print("Username or uNID already exists")
    finally:
        #Must close the connection
        conn.close()

#verifies the user's information to ensure they are who they say they are
#returns true if the user is verified, false otherwise
def verify_userInfo(username, password):
    conn = sqlite3.connect('signininfo.db')
    c = conn.cursor()
    #grabs the passwordhash from the database using the username as a key
    c.execute("SELECT passwordHash FROM signininfo WHERE username = ?", (username,))
    user = c.fetchone()
    conn.close()
    #bcrypt.checkpw compares the password entered by the user to the password hash stored in the database
    if user and bcrypt.checkpw(password.encode(), user[0]):
        return True
    else:
        return False


#verifies the user's information to ensure they are who they say they are
#returns true if the user is verified, false otherwise
#used for password reset
def verify_userUnid(username, uNID):
    conn = sqlite3.connect('signininfo.db')
    c = conn.cursor()
    #grabs the passwordhash from the database using the username as a key
    c.execute("SELECT uNID FROM signininfo WHERE username = ?", (username,))
    user = c.fetchone()
    conn.close()
    #verifies that the username and uNID match the user located in the database
    if user and uNID == user[0]:
        return True
    else:
        return False


#ensures that the user is an admin
#returns true if the user is an admin, false otherwise
def isUserAdmin(username):
    conn = sqlite3.connect('signininfo.db')
    c = conn.cursor()
    #checks the if the user matching username has true in the isAdmin column
    c.execute("SELECT isAdmin FROM signininfo WHERE username = ?", (username,))
    result = c.fetchone()
    conn.close()
    return result and result[0] == 1

#ensures that the user can assign tasks
#returns true if the user can assign tasks, false otherwise
def canUserAssign(username):
    conn = sqlite3.connect('signininfo.db')
    c = conn.cursor()
    #checks if the user matching username has true in the canAssign column
    c.execute("SELECT canAssign FROM signininfo WHERE username = ?", (username,))
    result = c.fetchone()
    conn.close()
    return result and result[0] == 1

#creates a session for the user
#session details are stored in the sessioninfo.db
def createUserSession(username):
    #generate session ID
    session_id = str(uuid.uuid4())

    #connect and insert session ID into sessioninfo.db
    conn = sqlite3.connect('sessioninfo.db')
    c = conn.cursor()
    c.execute("INSERT INTO sessioninfo (session_id, username) VALUES (?, ?)", (session_id, username))

    #commit and close connection
    conn.commit()
    conn.close()

    return session_id


#sanitizes input to prevent attacks through text fields (sign in and sign up page)
def sanitize_input(input, max_length=255):
    #cut whitespace
    sanitized = input.strip()
    #ensure length is under 255 chars
    sanitized[:max_length]
    #ensure that HTML special characcters aren't used to prevent XSS attacks
    sanitized = html.escape(sanitized)
    return sanitized

#fetches the tasks based off a users name TOFIX
def fetchUserTasks(username):
    conn = sqlite3.connect('tasks.db')
    c = conn.cursor()
    #Finds all tasks where the user is the assigner or assignee
    c.execute('''
        SELECT t.task_id, t.task_title, t.task_description, t.task_assign_date, t.task_due_date, t.task_priority,
        t.task_assigner, t.task_status, GROUP_CONCAT(a.assignee_name) as assignees
        FROM tasks t
        LEFT JOIN assignees a ON t.task_id = a.task_id
        WHERE t.task_assigner = ? OR a.assignee_name = ?
        GROUP BY t.task_id
    ''', (username, username))
    tasks = c.fetchall()
    conn.close()
    return tasks

#generates the HTML response for the /tasks page
def generateHTMLfromUserTasks(tasks):
    #generates header information
    htmlOut = "<html><head><title>User Tasks</title></head><body>"
    #htmlOut += "<h1>User Tasks</h1>"
    #generates the table for the tasks with the appropriate column names
    #additionally other things such as buttons for changing status and uploading files are added
    htmlOut += """
    <table border='1'>
        <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Assign Date</th>
            <th>Due Date</th>
            <th>Priority</th>
            <th>Assigner</th>
            <th>Status</th>
            <th>Update Status</th>
            <th>Assignees</th>
            <th>Files</th>
            <th>Upload File</th>
        </tr>
    """
    #iderates through tasks and generates a new row for each task
    for task in tasks:
        #looks through the assignee list and creates a new line for each assignee
        #there can be multiple assignees for a single task, so listing them out in such a way is important
        assigneeList = task[8].split(',')
        assigneeHTML = "<br>".join(assigneeList)

        #fetches files for current task
        conn = sqlite3.connect('tasks.db')
        c = conn.cursor()
        c.execute("SELECT file_path FROM task_files WHERE task_id = ?", (task[0],))
        files = c.fetchall()
        conn.close()

        #generate HTML for files
        fileHTML = "<br>".join([f"<a href='{file[0]}' download>{os.path.basename(file[0])}</a>" for file in files])
        #generates the row for the task based on the different columns in the tasks database
        #buttons are located to allow the user to change the status of the task and to handle files
        htmlOut += f"""
        <tr>
            <td>{task[1]}</td>
            <td>{task[2]}</td>
            <td>{task[3]}</td>
            <td>{task[4]}</td>
            <td>{task[5]}</td>
            <td>{task[6]}</td>
            <td id='status-{task[0]}'>{task[7]}</td>
            <td><button onclick="changeStatus('{task[0]}')">Advance Status</button></td>
            <td>{assigneeHTML}</td>
            <td>{fileHTML}</td>
            <td>
                <input type='file' id='fileInput-{task[0]}' style='display:none;' />
                <button onclick="uploadFile('{task[0]}')">Upload</button>
            </td>
        </tr>
        """
    htmlOut += "</table></body></html>"
    return htmlOut

def generateHTMLfromTasks(tasks):
    #generates header information
    htmlOut = "<html><head><title>User Tasks</title></head><body>"
    #htmlOut += "<h1>User Tasks</h1>"
    #generates the table for the tasks with the appropriate column names
    #additionally other things such as buttons for changing status and uploading files are added
    htmlOut += """
    <table border='1'>
        <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Assign Date</th>
            <th>Due Date</th>
            <th>Priority</th>
            <th>Assigner</th>
            <th>claim Task</th>
            <th>Assignees</th>
            <th>Files</th>
        </tr>
    """
    #iderates through tasks and generates a new row for each task
    for task in tasks:
        #looks through the assignee list and creates a new line for each assignee
        #there can be multiple assignees for a single task, so listing them out in such a way is important
        assigneeList = task[8].split(',')
        assigneeHTML = "<br>".join(assigneeList)

        #fetches files for current task
        conn = sqlite3.connect('tasks.db')
        c = conn.cursor()
        c.execute("SELECT file_path FROM task_files WHERE task_id = ?", (task[0],))
        files = c.fetchall()
        conn.close()

        #generate HTML for files
        fileHTML = "<br>".join([f"<a href='{file[0]}' download>{os.path.basename(file[0])}</a>" for file in files])
        #generates the row for the task based on the different columns in the tasks database
        #buttons are located to allow the user to change the status of the task and to handle files
        htmlOut += f"""
        <tr>
            <td>{task[1]}</td>
            <td>{task[2]}</td>
            <td>{task[3]}</td>
            <td>{task[4]}</td>
            <td>{task[5]}</td>
            <td>{task[6]}</td>
            <td id='claim-{task[0]}'><button onclick="claimTask('{task[0]}')">Claim Task</button></td>
            <td>{assigneeHTML}</td>
            <td>{fileHTML}</td>
        </tr>
        """
    htmlOut += "</table></body></html>"
    return htmlOut

async def duo_authenticate(username):
    auth_api = duo_client.Auth(
        ikey=DUO_IKEY,
        skey=DUO_SKEY,
        host=DUO_HOST
    )

    auth_params = {
        'username': username,
        'factor': 'push',
        'device': 'auto'
    }

    response = await asyncio.to_thread(auth_api.auth, **auth_params)
    return response['result'] == 'allow'

#class that handles the server
#everything server related is handled here
class MyServer(BaseHTTPRequestHandler):
    # Used by SDS (one of the machines that is not connected to the internet)
    # Variable needs to stay constant during the devices post request, reset back to '' when it stops sending data
    SDSLogFileLocation = ''
    Denton18LogFileLocation = ''

    # Add session tracking for CSV batches
    session_batches = {}  # Dictionary to track batches per session
    session_lock = threading.Lock()  # Thread lock for session data

    #converts from csv to html table
    def csv_to_html_table(self, csv_file):
        #sets up the table to be sortable
        html_output = "<table id='sortableTable' border='1'>"
        with open(csv_file, newline='') as f:
            reader = csv.reader(f)
            header_row = next(reader) #first row is header row
            html_output += "<thead><tr>" + "".join(f"<th>{cell}</th>" for cell in header_row) + "</tr></thead><tbody>"
            #for each row in the csv file, add a row to the html table
            for row in reader:
                html_output += "<tr>" + "".join(f"<td>{cell}</td>" for cell in row) + "</tr>"
        html_output += "</tbody></table>"
        return html_output

    #helper method that generates the html response for static files
    #tablesort.js is used here to sort the table
    def getAndDisplay(self, machine, graphs):
        #header info
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.end_headers()
        #gets the csv file based on what machine is desired and converts it to an html table
        html_table = self.csv_to_html_table(DATA_DIR + '/small_' + machine + '_DataCollection.csv') #if this is broken, replace '/small_' with '\\small_'
        #creates and starts the tablesort.js script to make a sortable table
        html_table += '<script src="/js/tablesort.js"></script>'
        html_table += startSort
        #also implements chart.js (https://www.chartjs.org/) to create graphs
        html_table += '<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>'
        #Prepare data for graphing
        for graph in graphs:
            if isinstance(graph, list):
                 # If graph is a list, join its elements to create a string identifier for the canvas
                canvasID = "".join(graph).replace(" ", "").replace("(", "").replace(")", "")
                yAxis = graph  # Assuming graph is a list of y-axis labels
            else:
                # If graph is a string, proceed as before
                canvasID = graph.replace(" ", "").replace("(", "").replace(")", "")
                yAxis = graph
            #grabs the data from the servers filesystem that will be used to generate the graph
            graphData = self.preparetoGraph(DATA_DIR + '/small_' + machine + '_DataCollection.csv', yAxis)
            graph_table = f'<canvas id="{canvasID}"></canvas>' #sets up a canvas to draw the graph on
            graph_table += f'<script>var {canvasID}Data = {json.dumps(graphData)};</script>' #sets up the data for the graph
            graph_table += f'<script src="/js/graph.js"></script>' #implements my graph.js script
            graph_table += f'<script>generateLineGraph("{canvasID}", {canvasID}Data);</script>' #generates the graph
            html_table += graph_table


        self.wfile.write(html_table.encode('utf-8'))

    #This function is called when the user would like to graph some of the log data present in the server from our machines
    def graphLogs(self, fileLoc, graphs):
        #set up headers
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.end_headers()
        #gets the csv file based on what machine is desired and converts it to an html table

        #set up the chart.js script (https://www.chartjs.org/) and another plugin that allows me to zoom
        #this plugin is called chartjs-plugin-zoom (https://www.chartjs.org/chartjs-plugin-zoom/)
        chartHTML = '<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>'
        chartHTML += '<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-zoom"></script>'
        #Prepare data for graphing
        for graph in graphs:

            if isinstance(graph, list):
                 # If graph is a list, join its elements to create a string identifier for the canvas
                canvasID = "".join(graph).replace(" ", "").replace("(", "").replace(")", "")
                yAxis = graph  # Assuming graph is a list of y-axis labels
            else:
                # If graph is a string, proceed as before
                canvasID = graph.replace(" ", "").replace("(", "").replace(")", "")
                yAxis = graph

            #grabs the data from the servers filesystem that will be used to generate the graph
            graphData = self.preparetoGraph(fileLoc, yAxis)
            chartHTML += f'<canvas id="{canvasID}"></canvas>' #sets up a canvas to draw the graph on
            chartHTML += f'<script>var {canvasID}Data = {json.dumps(graphData)};</script>' #sets up the data for the graph
            chartHTML += f'<script src="/js/graph.js"></script>' #implements my graph.js script
            chartHTML += f'<script>generateLineGraph("{canvasID}", {canvasID}Data);</script>' #generates the graph


        self.wfile.write(chartHTML.encode('utf-8'))

    #small helper function that determines if the thing being graphed is in a csv or txt file
    def preparetoGraph(self, filePath, yAxis):
        # Determine file type based on its extension
        _, file_extension = os.path.splitext(filePath)
        if file_extension.lower() == '.csv':
            return self.graphCSV(filePath, yAxis)
        elif file_extension.lower() == '.txt':
            return self.graphTXT(filePath, yAxis)
        else:
            raise ValueError("Unsupported file type")

    #allows csv files to be graphed on the webpage using chart.js
    def graphCSV(self, csv_file, yAxes):
        with open(csv_file, newline='') as csvfile:
            reader = csv.DictReader(csvfile)            #load the csv file
            run = []                                    #set up the x-axis
            data = {yAxis: [] for yAxis in yAxes}       #set up the y-axis as a bunch of empty lists
            for row in reader:                          #iderates through each row to grab the data for the graph
                run.append(row[reader.fieldnames[0]])   #adds the x-axis data to the graph
                for yAxis in yAxes:                     #adds the y-axis data to the graph
                    try:
                        # Convert the string to an integer before appending
                        data[yAxis].append(float(row[yAxis]))
                    except ValueError:
                        # Handle the case where conversion to integer fails (e.g., non-numeric data)
                        print(f"Error converting {yAxis} value to integer: {row[yAxis]}")
                        # Optionally, append a default value or handle the error as needed
                        data[yAxis].append(0)

            #sets up the curgraph json object that will be used to generate the graph
            try:
                currGraph = {
                'labels': run,
                'datasets': [
                {
                    'label': f'{yAxis} over Time',
                    'data': data[yAxis],
                    'borderColor': f'rgba({random.randint(0, 255)}, {random.randint(0, 255)}, {random.randint(0, 255)}, 1)',
                    'backgroundColor': f'rgba({random.randint(0, 255)}, {random.randint(0, 255)}, {random.randint(0, 255)}, 0.2)',
                } for yAxis in yAxes
            ]
            }
            except Exception as e:
                print(f"Error setting currGraph: {e}") #general error handling
        return currGraph

    #allows txt files to be graphed on the webpage using chart.js
    def graphTXT(self, txt_file, yAxes):
        with open(txt_file, 'r') as file:
            lines = file.readlines()                #load the txt file
            # Assuming the first line contains headers separated by tabs
            headers = lines[0].strip().split('\t')  #grab the headers
            run = []                                #set up the x-axis
            data = {yAxis: [] for yAxis in yAxes}   #set up the y-axis as a bunch of empty lists
            for line in lines[1:]:  # Skip the header line
                values = line.strip().split('\t')   #grab the values for the graph
                row = dict(zip(headers, values))    #zip the headers and values together
                run.append(row[headers[0]])         #add the x-axis data to the graph
                for yAxis in yAxes:                 #add the y-axis data to the graph by iterating through the yAxes
                    try:
                        # Convert the string to an integer before appending
                        data[yAxis].append(float(row[yAxis]))
                    except ValueError:
                        # Handle the case where conversion to integer fails (e.g., non-numeric data)
                        print(f"Error converting {yAxis} value to integer: {row[yAxis]}")
                        # Optionally, append a default value or handle the error as needed
                        data[yAxis].append(0)

            #sets up the curgraph json object that will be used to generate the graph
            try:
                currGraph = {
                    'labels': run,
                    'datasets': [
                        {
                            'label': f'{yAxis} over Time',
                            'data': data[yAxis],
                            'borderColor': f'rgba({random.randint(0, 255)}, {random.randint(0, 255)}, {random.randint(0, 255)}, 1)',
                            'backgroundColor': f'rgba({random.randint(0, 255)}, {random.randint(0, 255)}, {random.randint(0, 255)}, 0.2)',
                        } for yAxis in yAxes
                    ]
                }
            except Exception as e:
                print(f"Error setting currGraph: {e}") #general error handling
        return currGraph

    def handleHSCData(self, machine):
        #header info
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.end_headers()

        if machine == 'ALD':
            with open('ALD_chart.html', 'r') as f:
                html_content = f.read()
            self.wfile.write(html_content.encode('utf-8'))

    def getMachineData(self, machine):
        try :
            df = pd.read_csv(DATA_DIR + '/small_' + machine + '_DataCollection.csv')
            return df
        except FileNotFoundError:
            self.wfile.write(f'<h1>File not found</h1>'.encode('utf-8'))
            return None

    #error handling method to help with logging
    def handle_error(self, e):
        #logs the error message
        logging.error("An error occurred: %s", e)
        self.send_response(500)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        self.wfile.write(f'<h1>An error occurred: {e}</h1>')


    #gets the current user based off browser information
    def getCurrUser(self):
        #Retrieve the current user's username based on the session ID stored in cookies.
        #parse cookie header
        if "Cookie" in self.headers:
            cookie = http.cookies.SimpleCookie(self.headers["Cookie"])
            #checks if the session_id is in the cookie is valid
            if "session_id" in cookie:
                session_id = cookie["session_id"].value
                #grabs the username from the session_id
                username = getUserFromSession(session_id)
                if username:
                    return username

    #takes the session_id and generates a cookie that is sent to the user's browser
    def setSessionCookie(self, session_id):
        returnCookie = http.cookies.SimpleCookie()

        #set session_id to the cookie
        #cookie is set to expire after 24 hours
        cookieExpirationDate = 120
        returnCookie["session_id"] = session_id                             #session_id is the key
        returnCookie["session_id"]["path"] = "/"                            #cookie is valid for the entire domain
        returnCookie["session_id"]["max-age"] = str(cookieExpirationDate)   #cookie expires after 24 hours
        returnCookie["session_id"]["expires"] = cookieExpirationDate        #cookie expires after 24 hours

        #send the cookie to the user's browser
        self.send_response(200)
        self.send_header("Set-Cookie", returnCookie["session_id"].OutputString())
        self.end_headers()

    #serves the html response for the admin panel
    def serveAdminPanel(self):
        #only handles logic to serve admin panel
        users = self.fetchAdminPanelData()
        returnHTML = self.generateAdminPanelHTML(users)
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.end_headers()
        self.wfile.write(returnHTML.encode("utf-8"))

    #grabs the user data from the database to allow admins to manipulate users in the system
    def fetchAdminPanelData(self):
        #fetches from DB
        conn = sqlite3.connect('signininfo.db')
        c = conn.cursor()
        c.execute("SELECT username, uNID, isAdmin, canAssign FROM signininfo")
        users = c.fetchall()
        conn.close()
        return users

    #generates the HTML for the admin panel
    def generateAdminPanelHTML(self, users):
        #generates HTML for admin panel
        returnHTML = "<html><head><title>Admin Panel</title></head>" #title
        #sets up the header for the table
        returnHTML += "<body><h1>User List</h1><table border='1'><tr><th>Username</th><th>uNID</th><th>is Admin</th><th>can assign tasks</th><th>toggle assign tasks</th><th>Delete User</th><th>Toggle Admin</th></tr>"
        for user in users:
            #generates the row for each user in the database
            isAdmin = "Yes" if user[2] else "No"
            canAssign = "Yes" if user[3] else "No"
            returnHTML += f"<tr><td>{html.escape(user[0])}</td><td>{html.escape(user[1])}</td><th>{isAdmin}</th><th>{canAssign}</th>"
            #added a button to delete user and to toggle their admin status
            returnHTML += f"<td><button onclick=\"toggleAssign('{user[1]}')\">Toggle Assign Privs</button></td>"
            returnHTML += f"<td><button onclick=\"deleteUser('{user[1]}')\">Delete</button></td>"
            returnHTML += f"<td><button onclick=\"toggleAdminStatus('{user[1]}')\">Toggle Admin</button></td></tr>"
        #ending HTML tags to close off the table
        returnHTML + "</table>"
        returnHTML += '<script src="/js/adminActions.js"></script>' #adds the adminActions.js script to the HTML
        returnHTML += "</body></html>"
        return returnHTML

    #gives admins the ability to toggle whether or not a user has the ability to assign tasks
    def toggleAssign(self, uNID):
            #connect to database
            conn = sqlite3.connect('signininfo.db')
            c = conn.cursor()
            c.execute("SELECT canAssign FROM signininfo WHERE uNID = ?", (uNID,))
            result = c.fetchone()
            if result:
                #toggles the user's admin status (if they are an admin, they are no longer an admin and vice versa)
                new_status = not result[0]
                c.execute("UPDATE signininfo SET canAssign = ? WHERE uNID = ?", (new_status, uNID))
                conn.commit()
            conn.close()
            self.send_response(200)
            self.end_headers()

    #allows an admin to delete their user information from the server
    def deleteUser(self, uNID):
        conn = sqlite3.connect('signininfo.db')
        c = conn.cursor()
        c.execute("DELETE FROM signininfo WHERE uNID = ?", (uNID,))
        conn.commit()
        conn.close()

    #checks if the connection is secure (HTTPS)
    def is_secureConnection(self):
        x_forwarded_proto = self.headers.get('X-Forwarded-Proto')
        print(f"X-Forwarded-Proto: {x_forwarded_proto}")
        if x_forwarded_proto:
            return x_forwarded_proto == 'https'
        # Fallback mechanism: check if the request is already on port 443
        return self.server.server_port == 443

    #redirects the user to the HTTPS version of the site
    def redirect_to_https(self):
        """Redirect to HTTPS if the request is over HTTP."""
        host = self.headers.get('Host')
        https_url = f'https://{host}{self.path}'
        print(f"Redirecting to: {https_url}")
        self.send_response(301)
        self.send_header('Location', https_url)
        self.end_headers()


    #function used by file uploads that ensures the most recent file is located on top
    def sortByTime(self, files, dateFormat):
        try:
            # Array to store file information with extracted run numbers and dates
            fileDetails = []

            for file in files:
                # Extract the run number using a regex pattern
                match = re.search(r'Event_Log_Run#(\d+)', file)
                run_number = int(match.group(1)) if match else float('inf')  # Default to infinity if no match

                # Extract the date based on the dateFormat
                if dateFormat == 0:
                    parts = file.rsplit('_')
                    runDate = '_'.join(parts[:4])
                    dt = datetime.strptime(runDate, "%m_%d_%Y_%I-%M %p")
                elif dateFormat == 1:
                    parts = file.rsplit('_')
                    runDate = '_'.join(parts[:1])
                    dt = datetime.strptime(runDate, "%Y%m%d%H%M%S")
                elif dateFormat == 2:
                    date_start_pos = file.find('.dat ')
                    if date_start_pos != -1:
                        date_part = file[date_start_pos + 5:]
                        if date_part.endswith('.dat'):
                            date_part = date_part[:-4]
                        date_time_str = date_part.replace('_', ':')
                        dt = datetime.strptime(date_time_str, "%Y-%m-%d %H:%M:%S")
                    else:
                        dt = datetime.now()
                else:
                    dt = datetime.now()  # Fallback for unknown formats

                # Append the file details (filename, run number, and date)
                fileDetails.append((file, run_number, dt))

            # Sort by run number first, then by date
            sorted_files = sorted(fileDetails, key=lambda x: (x[1], x[2]), reverse=True)
            return [file for file, _, _ in sorted_files]

        except ValueError:
            # Handle cases where datetime parsing fails
            return []


    #gathers and displays the log files for the specified machine and datatype
    #for example, the ALD machine has several datatypes, such as RF and pressure
    def getLogFiles(self, machine, datatype):
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.end_headers()

        #gathers data from the ALD machine
        #ALD MACHINE FILES ARE SAVED IN A MM-DD-YYYY HH-MM AM/PM FORMAT
        if machine == 'ALD':
            #gathers data for the RF filetype
            if datatype == 'RF':
                directory_path = os.path.join('LogData', 'ALD', 'RF')  # Adjusted to your specified directory
                #TODO maybe make this a function, might be more efficient
                try:
                    #files is created by listing every single item in the directory
                    #these are then sorted
                    files = os.listdir(directory_path)
                    sortedFiles = self.sortByTime(files, 0)
                    html_content = "<html><body><h2>RF Log Files</h2>"
                    for file in sortedFiles:
                        # Assuming you have a route set up to serve files from this directory
                        file_path = os.path.join('/LogData/ALD/RF', file)
                        # Creating 'View' and 'Download' buttons for each file
                        html_content += f"<p>{file} <a href='/graph{file_path}'><button>View</button></a> <a href='/download{file_path}' download><button>Download</button></a></p>"
                    html_content += "</body></html>"
                #if no files are listed in the directory, the user recieves an error
                except FileNotFoundError:
                    html_content = "<html><body><h2>Directory not found.</h2></body></html>"
            #gathers data for the pressure datatype
            elif datatype == 'Pressure':
                directory_path = os.path.join('LogData', 'ALD', 'Pressure')  # Adjusted to your specified directory
                #TODO this is why it should be a function
                try:
                    #files is created by listing every single item in the directory
                    #these are then sorted
                    files = os.listdir(directory_path)
                    sortedFiles = self.sortByTime(files, 0)
                    html_content = "<html><body><h2>Pressure Log Files</h2>"
                    for file in sortedFiles:
                        # Assuming you have a route set up to serve files from this directory
                        file_path = os.path.join('/LogData/ALD/Pressure', file)
                        # Creating 'View' and 'Download' buttons for each file
                        html_content += f"<p>{file} <a href='/graph{file_path}'><button>View</button></a> <a href='/download{file_path}' download><button>Download</button></a></p>"
                    html_content += "</body></html>"
                #gives an error if no data is stored here
                except FileNotFoundError:
                    html_content = "<html><body><h2>Directory not found.</h2></body></html>"
        #load information from the paralyne machine
        elif machine == 'Paralyne':
            #paralyne only currently has an uploads type, TODO this will change
            if datatype == 'uploads':
                directory_path = os.path.join('LogData', 'Paralyne', 'analog')  # Adjusted to your specified directory
                #TODO AGAIN THIS SHOULD PROBABLY TURN INTO A FUNCTION
                try:
                    #files is created by listing every single item in the directory
                    #these are then sorted
                    files = os.listdir(directory_path)
                    sortedFiles = self.sortByTime(files, 1)
                    html_content = "<html><body><h2>Paralyne analog Files</h2>"
                    for file in sortedFiles:
                        # Assuming you have a route set up to serve files from this directory
                        file_path = os.path.join('/LogData/Paralyne/analog', file)
                        # Creating 'View' and 'Download' buttons for each file
                        html_content += f"<p>{file} <a href='/graph{file_path}'><button>View</button></a> <a href='/download{file_path}' download><button>Download</button></a></p>"
                    html_content += "</body></html>"
                #sends an error if the directory has no data
                except FileNotFoundError:
                    html_content = "<html><body><h2>Directory not found.</h2></body></html>"
        elif machine == 'Denton635':
            #Denton635 only has uploads as a datatype
            # TODO: Move these log files to the project directory structure instead of Desktop/Logs
            if datatype == 'uploads':
                directory_path = os.path.join(os.path.expanduser('~'), 'Desktop', 'Logs', 'Denton635', 'Log_files')
                try:
                    #files is created by listing every single item in the directory
                    #these are then sorted
                    files = os.listdir(directory_path)
                    sortedFiles = self.sortByTime(files, 2)
                    html_content = "<html><body><h2>Denton635 Files</h2>"
                    for file in sortedFiles:
                        # Using the actual file path for serving but a relative path for display
                        actual_file_path = os.path.join(directory_path, file)
                        display_file_path = os.path.join('/Desktop/Logs/Denton635/Log_files', file)
                        # Creating 'View' and 'Download' buttons for each file
                        html_content += f"<p>{file} <a href='/graph{display_file_path}'><button>View</button></a> <a href='/download{display_file_path}' download><button>Download</button></a></p>"
                    html_content += "</body></html>"
                except FileNotFoundError:
                    html_content = "<html><body><h2>Directory not found. Please check the Denton635 logs location.</h2></body></html>"

        #sends the html response back to the user
        self.wfile.write(html_content.encode('utf-8'))

    #allows any user to mark a task as completed
    #TODO maybe allow the assigner to mark it as checked off or allow them to set it back to unfinished
    def change_task_status(self, taskId):
        conn = sqlite3.connect('tasks.db')  # Assuming your tasks are stored in tasks.db
        c = conn.cursor()
        c.execute("UPDATE tasks SET task_status = 'Completed' WHERE task_id = ?", (taskId,))
        conn.commit()
        conn.close()

    #goes through the task database and lists every single task
    #TODO maybe this one should be hidden on another page and only display non checked off tasks first
    def fetchAllTasks(self):
        #connect to the task database and gathers everything
        conn = sqlite3.connect('tasks.db')
        c = conn.cursor()
        c.execute('''
            SELECT
                t.task_id,
                t.task_title,
                t.task_description,
                t.task_assign_date,
                t.task_due_date,
                t.task_priority,
                t.task_assigner,
                t.task_status,
                GROUP_CONCAT(a.assignee_name) as assignees
            FROM tasks t
            LEFT JOIN assignees a ON t.task_id = a.task_id
            GROUP BY t.task_id
        ''')
        files = c.fetchall()
        conn.close()
        return files

    #displays every single unfinished task
    #this is primarily so that lab aides have the ability to claim an unfinshed task
    def fetchUnfinishedTasks(self):
        #connects to the correct database
        conn = sqlite3.connect('tasks.db')
        c = conn.cursor()
        #second last line here results in only gathering information if the task is not marked as complete
        c.execute('''
            SELECT
                t.task_id,
                t.task_title,
                t.task_description,
                t.task_assign_date,
                t.task_due_date,
                t.task_priority,
                t.task_assigner,
                t.task_status,
                GROUP_CONCAT(a.assignee_name) as assignees
            FROM tasks t
            LEFT JOIN assignees a ON t.task_id = a.task_id
            WHERE t.task_status != 'Completed'
            GROUP BY t.task_id
        ''')
        files = c.fetchall()
        conn.close()
        return files

    #allows users of a task to upload a file to the task page
    def handle_file_upload(self, taskID, fileItem):
        # Assuming the file is uploaded as a file item

        #creates a timestamp for the file items
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        file_name, file_extension = os.path.splitext(fileItem.filename)

        fileWithTimestamp = f"{file_name}_{timestamp}{file_extension}"

        #writes file to the OS
        file_path = os.path.join('uploads', fileWithTimestamp)
        with open(file_path, 'wb') as file:
            file.write(fileItem.file.read())
        #connects to the database and adds the filename and path into the file table
        conn = sqlite3.connect('tasks.db')
        c = conn.cursor()
        c.execute("INSERT INTO task_files (task_id, file_path) VALUES (?, ?)", (taskID, file_path))
        conn.commit()
        conn.close()

    #allows the user to download the file
    def serve_file(self):
        # Takes out everything from the filepath request that isn't part of the filename
        file_path = self.path.lstrip('/')

        # Decode URL-encoded characters
        file_path = urllib.parse.unquote(file_path)

        # Special handling for Denton635 log files which are in a different directory
        if 'Desktop/Logs/Denton635/Log_files/' in file_path:
            # Extract the filename from the path - handle the full path more carefully
            path_parts = file_path.split('Desktop/Logs/Denton635/Log_files/')
            if len(path_parts) > 1:
                denton_file_name = path_parts[1]

                # Debug output to help diagnose issues
                print(f"Looking for file: {denton_file_name}")

                # Use the actual path on the filesystem
                actual_path = os.path.join(os.path.expanduser('~'), 'Desktop', 'Logs', 'Denton635', 'Log_files', denton_file_name)
                print(f"Full path: {actual_path}")

                if os.path.isfile(actual_path):
                    self.send_response(200)
                    self.send_header('Content-type', 'application/octet-stream')
                    self.send_header('Content-Disposition', f'attachment; filename="{denton_file_name}"')
                    self.end_headers()
                    with open(actual_path, 'rb') as file:
                        self.wfile.write(file.read())
                    return
                else:
                    self.send_response(404)
                    self.end_headers()
                    self.wfile.write(f'Denton635 log file not found: {actual_path}'.encode('utf-8'))
                    return

        # Regular file handling for files within the project directory
        if os.path.isfile(file_path):
            #sends a 200 response with the file information to the user
            self.send_response(200)
            self.send_header('Content-type', 'application/octet-stream')
            self.send_header('Content-Disposition', f'attachment; filename="{os.path.basename(file_path)}"')
            self.end_headers()
            with open(file_path, 'rb') as file:
                self.wfile.write(file.read())
        else:
            #sends a 404 response if the file is not found
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b'File not found')

    #allows users to claim tasks that they havent been assigned to
    def claimTask(self, taskID, assignee):
        conn = sqlite3.connect('tasks.db')
        c = conn.cursor()

        #checks if user is in the assignee list
        #this needs to be done otherwise its possible for an endless number of users can be placed in the assignees list
        c.execute("SELECT * FROM assignees WHERE task_id = ? AND assignee_name = ?", (taskID, assignee))
        result = c.fetchone()
        if result is None:
            #if not, add them to the assignee list
            c.execute("INSERT INTO assignees (task_id, assignee_name) VALUES (?, ?)", (taskID, assignee))
            conn.commit()
        conn.close()

    #handles login information and uses duo authenticator
    #needs to be an async function otherwise users can halt the server by trying to login and not completing duo authentication
    async def handle_login(self, username, password):
    # Get the uNID
        #connects to the database and gets the uNID from the username
        #needs unid because this is all duo authenticator cares about
        #surprisingly it doesnt care about usernames
        conn = sqlite3.connect('signininfo.db')
        c = conn.cursor()
        c.execute("SELECT uNID FROM signininfo WHERE username = ?", (username,))
        useruNID = c.fetchone()
        conn.close()
        uNID = useruNID[0] if useruNID else None

        # If the user is verified, proceed with 2FA
        if verify_userInfo(username, password):
            print("User credentials verified, proceeding with 2FA")

            # Perform 2FA
            if await duo_authenticate(uNID):
                print("2FA successful, user logged in")
                session = createUserSession(username)
                #redirects users to the task page
                self.send_response(302)
                self.send_header('Set-Cookie', f'session_id={session}; Path=/')
                self.send_header('Location', '/tasks')
                self.end_headers()
            else:
                #informs the user that they couldnt sign in and spits them back into the login page
                print("2FA failed")
                self.send_response(302)
                self.send_header('Location', '/login')
                self.end_headers()
        else:
            #informs the user that their credentials were invalid and spits them back to login
            print("User credentials invalid")
            self.send_response(302)
            self.send_header('Location', '/login')
            self.end_headers()

    #handles signup information and uses duo authenticator
    #needs to be an async function otherwise users can halt the server by trying to login and not completing duo authentication
    async def handle_signup(self, username, password, uNID):
        # Check if the user already exists
        conn = sqlite3.connect('signininfo.db')
        c = conn.cursor()
        c.execute("SELECT 1 FROM signininfo WHERE username = ?", (username,))
        userExists = c.fetchone()
        if userExists:
            #if the user already exists in the database it sends them to the login page
            #this is to ensure that there is only one unique uNID in the database
            print("User already exists")
            self.send_response(302)
            self.send_header('Location', '/login')
            self.end_headers()
            self.wfile.write(b"User already exists")
            return

        #if user isnt in the database, it asks duo authenticator to authenticate the user
        if await duo_authenticate(uNID):
            # Create the user and sends them to the login page
            addUser(username, password, uNID)
            self.send_response(302)
            self.send_header('Location', '/login')
            self.end_headers()
            self.wfile.write(b"User created successfully")
        else:
            #informs the user that they couldnt 2FA and sends them back to the signup page
            print("2FA failed")
            self.send_response(302)
            self.send_header('Location', '/signup')
            self.end_headers()
            self.wfile.write(b"2FA failed")

    #helper method to serve static files
    #this is used so javascript files work
    def serve_static(self, path):
        #figures out the correct datapath
        filePath = DATA_DIR + path
        print(filePath)
        #opens the javascript file
        with open(filePath, 'rb') as f:
            self.send_response(200)
            self.send_header("Content-type", "application/javascript")
            self.end_headers()
            self.wfile.write(f.read())

    def combine_csv_batches_final(self, session_id, cleanup_session=False):
        """Combine all CSV batches for a session into one final file with simplified naming"""
        try:
            if session_id not in MyServer.session_batches:
                print(f"No batches found for session {session_id}")
                return

            session_data = MyServer.session_batches[session_id]
            total_batches = session_data['total_batches']
            batches = session_data['batches']

            # Check if we have any batches to combine
            if not batches:
                print(f"No batch data found for session {session_id}")
                return

            # Create final combined filename with timestamp from session start
            timestamp = session_data['start_time'].strftime('%Y%m%d%H%M%S')
            combined_filename = f"{timestamp}_SDSLOG_combined_{session_id}.csv"
            combined_filepath = os.path.join('LogData', 'Paralyne', 'analog', combined_filename)

            # Ensure directory exists
            os.makedirs(os.path.dirname(combined_filepath), exist_ok=True)

            print(f"Debug: Available batches: {list(batches.keys())}")
            print(f"Debug: Total batches expected: {total_batches}")

            # Sort the available batch numbers to ensure correct order
            available_batch_numbers = sorted(batches.keys())
            print(f"Debug: Processing batches in order: {available_batch_numbers}")

            # Check if file already exists - if so, we're appending
            file_exists = os.path.exists(combined_filepath)
            file_mode = 'a' if file_exists else 'w'

            print(f"Debug: File {'exists' if file_exists else 'does not exist'}, opening in mode '{file_mode}'")

            with open(combined_filepath, file_mode, newline='', encoding='utf-8') as combined_file:
                # Only write header if file is new
                if not file_exists:
                    combined_file.write("timestamp,pressure,vapor,temp\n")
                    print("Debug: Wrote header to new file")

                # Process batches in order
                total_points_added = 0
                for batch_num in available_batch_numbers:
                    batch_content = batches[batch_num]
                    print(f"Debug: Processing batch {batch_num}, content length: {len(batch_content)}")

                    # Split into lines
                    lines = batch_content.strip().split('\n')

                    # Always skip header if it exists in the batch data
                    if lines and lines[0].startswith('timestamp,pressure,vapor,temp'):
                        lines = lines[1:]
                        print(f"Debug: Skipped header in batch {batch_num}")

                    # Append all data lines from this batch to the file
                    batch_line_count = 0
                    for line in lines:
                        if line.strip():  # Only write non-empty lines
                            combined_file.write(line.strip() + '\n')
                            total_points_added += 1
                            batch_line_count += 1

                    print(f"Debug: Appended {batch_line_count} lines from batch {batch_num}")

                # Flush to ensure data is written
                combined_file.flush()

            print(f"Combined CSV updated: {combined_filepath}")
            print(f"Total data points added in this call: {total_points_added}")

            # Verify the final file
            with open(combined_filepath, 'r') as verify_file:
                verify_lines = verify_file.readlines()
                print(f"Debug: Final file now has {len(verify_lines)} total lines (including header)")
                if len(verify_lines) > 1:
                    print(f"Debug: First data line: {verify_lines[1].strip()}")
                if len(verify_lines) > 3:
                    print(f"Debug: Last data line: {verify_lines[-1].strip()}")

            # Only clean up session data if explicitly requested
            if cleanup_session:
                del MyServer.session_batches[session_id]
                print(f"Session {session_id} cleaned up")

        except Exception as e:
            print(f"Error combining CSV batches for session {session_id}: {e}")
            import traceback
            traceback.print_exc()




    #handles get requests
    def do_GET(self):

        #ensures that the user is connected securely
        if not self.is_secureConnection():
            print('redirecting to https')
            self.redirect_to_https()
            return

        #lowercase paths for user
        #originally, path was case sensitive and "login" resolved differently than "Login"
        LCpath = self.path.lower()

        # Add unauthenticated endpoint for Paralyne analog files
        if LCpath.startswith('/api/paralyne/analog/'):
            self.serve_paralyne_analog_files()
            return

        #parse cookie header
        cookie_string = self.headers.get('Cookie')
        cookie = http.cookies.SimpleCookie(cookie_string)
        session_id = cookie.get('session_id').value if 'session_id' in cookie else None

        #grabs session info from the database
        conn = sqlite3.connect('sessioninfo.db')
        c = conn.cursor()
        c.execute("SELECT 1 FROM sessioninfo WHERE session_id = ?", (session_id,))
        session_exists = c.fetchone()
        conn.close()

        #acme challenge path
        #TODO really dont know if I should use this path or get rid of it.
        #this might be causeing the earlier bug
        if self.path.startswith('/.well-known/acme-challenge/'):
            print('getting acme')
            file_path = self.path.lstrip('/')
            script_dir = os.path.dirname(os.path.abspath(__file__))
            full_file_path = os.path.join(script_dir, file_path)
            if os.path.isfile(full_file_path):
                self.send_response(200)
                self.send_header('Content-type', 'text/plain')
                self.end_headers()
                with open(file_path, 'rb') as file:
                    self.wfile.write(file.read())
                return
            else:
                self.send_response(404)
                self.end_headers()
                self.wfile.write(b'File not found')
                return


        #if the user is not logged in and is not trying to access the login or signup page, redirect to login
        if not DEBUGMODE and LCpath not in ['/login', '/signup', '/favicon.ico'] and (session_id is None or session_exists is None):
            self.send_response(302)
            self.send_header('Location', '/login')
            self.end_headers()
            return

        #deposition tools
        if LCpath == '/ald':
            #ALD PAGE
            self.handleHSCData('ALD')
            self.getAndDisplay('ALD', [['Chuck Temperature (C)', 'Precursor Temperature (C)']])
        elif LCpath == '/aldlog/rfdata':
            #ALD PAGE
            self.getLogFiles('ALD', 'RF')
        elif LCpath == '/aldlog/pressuredata':
            #ALD PAGE
            self.getLogFiles('ALD', 'Pressure')
        elif LCpath == '/ebeam':
            #Ebeam PAGE
            self.getAndDisplay('Ebeam', ['Base Pressure', 'Temperature 1', 'Temperature 2'])
        elif LCpath == '/mocvd':
            #MOCVD PAGE
            self.getAndDisplay('MOCVD', [])
        elif LCpath == '/parylene':
            #PARYLENE PAGE
            #self.getAndDisplay('Parylene', [])
            self.getLogFiles('Paralyne', 'uploads')
        elif LCpath == '/pecvd':
            #PVD PAGE
            self.getAndDisplay('PECVD', [])
        elif LCpath == '/denton635':
            #DENTON635 PAGE
            self.getFilesToDownload('Denton635')
        elif LCpath == '/denton18':
            #DENTON635 PAGE
            self.getAndDisplay('Denton18',[])
        elif LCpath == '/tmv':
            #TMV PAGE
            self.getAndDisplay('TMV')
        #Dry Etch Tools
        elif LCpath == '/drie':
            #DRIE PAGE
            self.getAndDisplay('DRIE')
        elif LCpath == '/isotropic':
            #ISOTROPIC PAGE
            self.getAndDisplay('Isotropic')
        elif LCpath == '/plasmalab':
            #PLASMALAB PAGE
            self.getAndDisplay('Plasmalab')
        elif LCpath == '/plasmatherm':
            #PLASMATHERM PAGE
            self.getAndDisplay('PlasmaTherm')
        elif LCpath == '/technics':
            #TECHNICS PAGE
            self.getAndDisplay('Technics')
        #Furnace Tools
        elif LCpath == '/cleanox':
            #CLEANOX PAGE
            self.getAndDisplay('CleanOx')
        elif LCpath == '/dopedox':
            #DOPEDOX PAGE
            self.getAndDisplay('DopedOx')
        elif LCpath == '/lto':
            #LPCVD PAGE
            self.getAndDisplay('LTO')
        elif LCpath == '/nitride':
            #NITRIDE PAGE
            self.getAndDisplay('Nitride')
        elif LCpath == '/poly':
            #POLY PAGE
            self.getAndDisplay('Poly')
        elif LCpath == '/allwin':
            #ALLWIN PAGE
            self.getAndDisplay('Allwin')

        elif LCpath == '/paralyneuploads':
            #PARALYNE UPLOADS PAGE
            self.getLogFiles('Paralyne', 'uploads')
        #Other GET requests
        elif LCpath == '/login':
            #GET request for login page
            self.send_response(200)
            self.send_header("Content-type", "text/html")
            self.end_headers()
            #uses the login.html file to display the login page
            with open("login.html", "r") as f:
                self.wfile.write(f.read().encode("utf-8"))
        elif LCpath == '/signup':
            #GET request for signup page
            self.send_response(200)
            self.send_header("Content-type", "text/html")
            self.end_headers()
            #uses the signup.html file to display the signup page
            with open("signup.html", "r") as f:
                self.wfile.write(f.read().encode("utf-8"))
        elif LCpath == '/adminpanel':
            #GET request for admin panel
            #if the user isn't an admin, they'll receive an unauthorized access message
            currentUser = self.getCurrUser()
            if not currentUser or not isUserAdmin(currentUser):
                self.send_response(403)
                self.end_headers()
                self.wfile.write(b"Unauthorized access attempt.")
                return
            self.serveAdminPanel()
        elif LCpath.startswith('/js/'):
            #handles loading from the js folder and all js files
            self.serve_static('/js/' + LCpath[4:])
        elif LCpath == '/favicon.ico':
            favicon_path = os.path.join(os.path.dirname(__file__), 'favicon.ico')
            if os.path.isfile(favicon_path):
                with open(favicon_path, 'rb') as f:
                    self.send_response(200)
                    self.send_header('Content-type', 'image/x-icon')
                    self.end_headers()
                    with open(favicon_path, 'rb') as f:
                        self.wfile.write(f.read())
            else:
                self.send_response(404)
                self.end_headers()
                self.wfile.write(b'File not found')
        elif LCpath == '/':
            #GET request for the home page
            self.send_response(300)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            with open('index.html', 'r') as f:
                self.wfile.write(f.read().encode('utf-8'))
        elif LCpath == '/machines':
            #GET request for machines page
            self.send_response(300)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            with open('machines.html', 'r') as f:
                self.wfile.write(f.read().encode('utf-8'))
        elif LCpath == '/logfiles':
            #GET request for log files
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            with open('logFileIndex.html', 'r') as f:
                self.wfile.write(f.read().encode('utf-8'))
        elif LCpath == '/tasks':
            #GET request for tasks
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            #some stuff at the top for a title
            htmlresponse = """
            <html>
            <head>
                <title>Task Manager</title>
            </head>
            <body>
                <h1>Task Manager</h1>
            """

            #gets the current user and creates a button if theyre allowed to create a task
            #TODO need to reject users that cant assign tasks
            currUser = self.getCurrUser()
            if (canUserAssign(currUser)):
                htmlresponse += f'<button id="createTaskButton">Create Task</button>'

            #connects to the task database for the next few DB commands
            conn = sqlite3.connect('Tasks.db')
            cursor = conn.cursor()

            #prints out assigned tasks first
            htmlresponse += '<h1>Assigned Tasks</h1>'
            tasks = fetchUserTasks(currUser)
            htmlresponse += generateHTMLfromUserTasks(tasks)

            #then prints out the uncompleted tasks second
            htmlresponse += '<h1>Uncompleted Tasks</h1>'
            uncompleted = self.fetchUnfinishedTasks()
            htmlresponse += generateHTMLfromTasks(uncompleted)

            #then every task after that
            htmlresponse += '<h1>All Tasks</h1>'
            alltasks = self.fetchAllTasks()
            htmlresponse += generateHTMLfromTasks(alltasks)

            #task actions are some helper functions that allow the user to i.e. click a button and redirect
            #or handle file uploads, its a mix of a bunch of things relevant to the task manager portion
            htmlresponse += '<script src="js/taskActions.js"></script></body></html>'
            self.wfile.write(htmlresponse.encode('utf-8'))
        elif LCpath == '/createtasks':
            #GET request for the createtasks page
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            with open('createTask.html', 'r') as f:
                self.wfile.write(f.read().encode('utf-8'))
        elif LCpath == '/users':
            #GET requests for users path
            #while not intended to be perfomed by the user, this path prints out every user currently in the database
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            conn = sqlite3.connect('SigninInfo.db')
            cursor = conn.cursor()
            #users are recieved in alphabetical order
            cursor.execute("SELECT username FROM signininfo ORDER BY username ASC")
            users = cursor.fetchall()
            conn.close()
            userlist = [user[0] for user in users]
            self.wfile.write(json.dumps(userlist).encode())

        elif self.path.startswith('/download/'):
            #GET request for the download path
            #handles all download requests
            #find the real file path
            filePath = unquote(self.path[len('/download/'):])

            # Special handling for Desktop/Logs paths which are in a different directory
            if 'Desktop/Logs/' in filePath:
                # Extract the path after Desktop/Logs/
                relative_path = filePath.split('Desktop/Logs/')[1]

                # Debug output
                print(f"Looking for Desktop log file: {relative_path}")

                # Use the actual path on the filesystem with expanded home directory
                actual_path = os.path.join(os.path.expanduser('~'), 'Desktop', 'Logs', relative_path)
                print(f"Full path: {actual_path}")

                if os.path.isfile(actual_path):
                    self.send_response(200)
                    self.send_header('Content-type', 'application/octet-stream')
                    self.send_header('Content-Disposition', f'attachment; filename="{os.path.basename(filePath)}"')
                    self.end_headers()
                    with open(actual_path, 'rb') as file:
                        self.wfile.write(file.read())
                    return
                else:
                    self.send_response(404)
                    self.end_headers()
                    self.wfile.write(f'Log file not found: {actual_path}'.encode('utf-8'))
                    return

            # Regular file handling for files within the project directory
            #not needed on nix
            #normalizedFilePath = filePath.replace('/', '\\')
            #determine file path from server's file path
            try:
                with open(normalizedFilePath, 'rb') as file:
                    #returns the file to the user as a download
                    self.send_response(200)
                    self.send_header('Content-type', 'application/octet-stream')
                    self.send_header('Content-Disposition', f'attachment; filename="{os.path.basename(filePath)}"')
                    self.end_headers()
                    self.wfile.write(file.read())
            except FileNotFoundError:
                #if a file isnt found, give a 404
                self.send_response(404)
                self.end_headers()
                self.wfile.write(b'File not found')
            return
        elif self.path.startswith('/graph'):
            #GET request for the graph path
            filePath = unquote(self.path[len('/graph/'):])
            #needed to gather the proper data path (not needed on nix
            #normalizedFilePath = filePath.replace('/', '\\')
            partsofURL = normalizedFilePath.split('/')
            try:
                #ALD machine
                if partsofURL[1] == 'ALD':
                    #graph RF data
                    if partsofURL[2] == 'RF':
                        #RF has two sets of data to be graph
                        graphedData = [['For Pwr (W) ', 'Refl Pwr (W)']]
                        self.graphLogs(normalizedFilePath, graphedData)
                    #graph pressure data (only one thing to graph)
                    if partsofURL[2] == 'Pressure':
                        graphedData = [['Pressure ']]
                        self.graphLogs(normalizedFilePath, graphedData)
                #paralyne only needs to graph the vacuum pressure at the moment
                #TODO this will change
                elif partsofURL[1] == 'Paralyne':
                    if partsofURL[2] == 'analog':
                        graphedData = [['Vacuum pressure']]
                        self.graphLogs(normalizedFilePath, graphedData)
            #give a file not found error if the user tries to graph a file that doesnt exist
            except FileNotFoundError:
                self.send_response(404)
                self.end_headers()
                self.wfile.write(b'File not found')
            #value error results in a 400 response
            except ValueError as e:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(str(e).encode('utf-8'))
            #returns all unspecified error
            except Exception as e:
                self.handle_error(e)
            return
        elif self.path.startswith('/uploads/'):
            #GET path for uploads
            #not intended for the user to directly access, but it's important for the server
            self.serve_file()

    def getFilesToDownload(self, machine):
        """
        Displays a list of files for download from the specified machine.
        Handles special cases like files in Desktop/Logs folder.

        Args:
            machine (str): The machine name (e.g., 'Denton635', 'ALD', 'Paralyne')
        """
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.end_headers()

        # Start building the HTML content
        html_content = f"""
        <html>
        <head>
            <title>{machine} Log Files</title>
            <style>
                body {{ font-family: Arial, sans-serif; margin: 20px; }}
                h1 {{ color: #333; }}
                .file-list {{ margin-top: 20px; }}
                .file-item {{ padding: 10px; border-bottom: 1px solid #eee; }}
                .download-btn {{
                    background-color: #4CAF50;
                    border: none;
                    color: white;
                    padding: 8px 16px;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    font-size: 14px;
                    margin: 4px 2px;
                    cursor: pointer;
                    border-radius: 4px;
                }}
            </style>
        </head>
        <body>
            <h1>{machine} Log Files</h1>
            <div class="file-list">
        """

        try:
            # Check if this machine's files are stored in the special Desktop/Logs location
            desktop_logs_path = os.path.join(os.path.expanduser('~'), 'Desktop', 'Logs')
            machine_logs_path = os.path.join(desktop_logs_path, machine)

            # If the machine has a directory in Desktop/Logs, use that path
            if os.path.exists(machine_logs_path):
                # TODO: Move these log files to the project directory structure
                html_content += f"<p><i>Note: These files are stored in Desktop/Logs/{machine} and should be moved to the project structure.</i></p>"

                # Look for subdirectories in the machine's logs folder
                subdirs = [d for d in os.listdir(machine_logs_path) if os.path.isdir(os.path.join(machine_logs_path, d))]

                if subdirs:
                    # If there are subdirectories, list files in each
                    for subdir in subdirs:
                        dir_path = os.path.join(machine_logs_path, subdir)
                        html_content += f"<h2>{subdir}</h2>"

                        try:
                            files = os.listdir(dir_path)
                            # Determine which date format to use based on machine or other criteria
                            date_format = 2 if machine == 'Denton635' else 1
                            sortedFiles = self.sortByTime(files, date_format)

                            for file in sortedFiles:
                                # URL encode the file name to handle spaces and special characters
                                url_encoded_file = urllib.parse.quote(file)
                                relative_path = f"/Desktop/Logs/{machine}/{subdir}/{url_encoded_file}"
                                html_content += f"""
                                <div class="file-item">
                                    <span>{file}</span>
                                    <a href="/download{relative_path}" download="{file}"><button class="download-btn">Download</button></a>
                                </div>
                                """
                        except Exception as e:
                            html_content += f"<p>Error listing files in {subdir}: {str(e)}</p>"
                else:
                    # If no subdirectories, list files directly in the machine's logs folder
                    try:
                        files = os.listdir(machine_logs_path)
                        date_format = 2 if machine == 'Denton635' else 1
                        sortedFiles = self.sortByTime(files, date_format)

                        for file in sortedFiles:
                            url_encoded_file = urllib.parse.quote(file)
                            relative_path = f"/Desktop/Logs/{machine}/{url_encoded_file}"
                            html_content += f"""
                            <div class="file-item">
                                <span>{file}</span>
                                <a href="/download{relative_path}" download="{file}"><button class="download-btn">Download</button></a>
                            </div>
                            """
                    except Exception as e:
                        html_content += f"<p>Error listing files: {str(e)}</p>"
            else:
                # If not in Desktop/Logs, use the standard project directory structure
                directory_path = os.path.join('LogData', machine)
                if os.path.exists(directory_path):
                    html_content += self._listFilesInSubdirectories(directory_path, 1)
                else:
                    html_content += f"<p>No log files found for {machine}.</p>"

        except FileNotFoundError:
            html_content += f"""
            <p>Directory not found. Please check the {machine} logs location.</p>
            """
        except Exception as e:
            html_content += f"""
            <p>Error accessing files: {str(e)}</p>
            """

        # Close the HTML
        html_content += """
            </div>
        </body>
        </html>
        """

        self.wfile.write(html_content.encode('utf-8'))

    def _listFilesInSubdirectories(self, directory, dateFormat):
        """
        Helper method to list files in all subdirectories of the given directory.

        Args:
            directory (str): The base directory to search
            dateFormat (int): The date format to use with sortByTime

        Returns:
            str: HTML content for the files
        """
        html_content = ""

        # List all subdirectories
        subdirectories = [d for d in os.listdir(directory) if os.path.isdir(os.path.join(directory, d))]

        if not subdirectories:
            # If no subdirectories, list files in the main directory
            files = os.listdir(directory)
            sortedFiles = self.sortByTime(files, dateFormat)

            for file in sortedFiles:

                file_path = os.path.join('/', file)

                #file_path = os.path.join('/' + directory.replace('\\', '/'), file)
                html_content += f"""
                <div class="file-item">
                    <span>{file}</span>
                    <a href="/download{file_path}" download="{file}"><button class="download-btn">Download</button></a>
                </div>
                """
        else:
            # List files in each subdirectory
            for subdir in subdirectories:
                subdir_path = os.path.join(directory, subdir)
                files = os.listdir(subdir_path)
                sortedFiles = self.sortByTime(files, dateFormat)

                html_content += f"<h2>{subdir}</h2>"

                for file in sortedFiles:
                    #file_path = os.path.join('/' + subdir_path.replace('\\', '/'), file)
                    file_path = os.path.join('/', file)
                    html_content += f"""
                    <div class="file-item">
                        <span>{file}</span>
                        <a href="/download{file_path}" download="{file}"><button class="download-btn">Download</button></a>
                    </div>
                    """

        return html_content

    def do_POST(self):
        loggedoutPaths = ['/login', '/signup', '/resetpassword', '/sdsanalog', '/sdsanalogfinished', '/denton18pump', '/denton18pumpfinished']

        #TODO ENSURE THAT THE USER IS LOGGED IN BEFORE ALLOWING POST REQUESTS
        if not DEBUGMODE and self.path not in loggedoutPaths and not self.getCurrUser():
            self.send_response(401)
            self.end_headers()
            self.wfile.write(b"Unauthorized access attempt.")
            return



        #ensure that the user is on HTTPS before sending data
        if not DEBUGMODE and not self.is_secureConnection():
            self.redirect_to_https()
            return

        #Post request for login
        if self.path == '/login':

            try:
                #determine content type of the data
                ctype, pdict = cgi.parse_header(self.headers.get('content-type'))
                #if the content type is form data, parse the data
                if ctype == 'multipart/form-data':
                    postvars = cgi.parse_multipart(self.rfile, pdict)
                #if the content type is urlencoded, parse the data as if it were a string
                elif ctype == 'application/x-www-form-urlencoded':
                    length = int(self.headers.get('content-length'))
                    postData = self.rfile.read(length).decode('utf-8')
                    postvars = parse_qs(postData, keep_blank_values=1)
                else:
                    #does nothing if its not form data or urlencoded
                    postvars = {}

                #sanitize the input to prevent attacks
                username = sanitize_input(postvars.get('username', [''])[0])
                password = sanitize_input(postvars.get('password', [''])[0])

                asyncio.run(self.handle_login(username, password))

            except Exception as e:
                #log exception
                print(e)


        #Post request for signup
        elif self.path == '/signup':
            try:
                length = int(self.headers.get('content-length'))
                postData = self.rfile.read(length).decode('utf-8')
                postvars = parse_qs(postData, keep_blank_values=1)

                # Sanitize the input to prevent attacks
                username = sanitize_input(postvars.get('username', [''])[0])
                password = sanitize_input(postvars.get('password', [''])[0])
                uNID = sanitize_input(postvars.get('unid', [''])[0])

                # Handle signup asynchronously
                asyncio.run(self.handle_signup(username, password, uNID))
                #addUser(username, password, uNID)

            except Exception as e:
                #log exception
                print(e)

            self.send_response(302)
            self.send_header('Location', '/login')
            self.end_headers()

        #post request for changing password
        #TODO IMPLEMENT DUO HERE
        elif self.path == '/resetpassword':
            try:
                #determine content type of the data
                ctype, pdict = cgi.parse_header(self.headers.get('content-type'))
                #if the content type is form data, parse the data
                if ctype == 'multipart/form-data':
                    postvars = cgi.parse_multipart(self.rfile, pdict)
                #if the content type is urlencoded, parse the data as if it were a string
                elif ctype == 'application/x-www-form-urlencoded':
                    length = int(self.headers.get('content-length'))
                    postData = self.rfile.read(length).decode('utf-8')
                    postvars = parse_qs(postData, keep_blank_values=1)
                else:
                    #does nothing if its not form data or urlencoded
                    postvars = {}

                #sanitize the input to prevent attacks
                username = sanitize_input(postvars.get('username', [''])[0])
                NewPassword = <redacted-secret-value>, [''])[0])
                #hashes the new password for security purposes
                hashedNewPass = hash_password(NewPassword)
                uNID = sanitize_input(postvars.get('unid', [''])[0])

                #if the user is verified based on their username/uNID combo, they can change their password
                if verify_userUnid(username, uNID):
                    conn = sqlite3.connect('signininfo.db')
                    c = conn.cursor()
                    c.execute("UPDATE signininfo SET passwordHash = ? WHERE username = ?", (hashedNewPass, username))
                    conn.commit()
                    conn.close()
                    #send the user back to the login location
                    self.send_response(302)
                    self.send_header('Location', '/login')
                    self.end_headers()
                else:
                    #if the user is not verified with their username/uNID combo, they are redirected to the login page
                    self.send_response(403)
                    self.end_headers()
                    self.wfile.write(b"Unauthorized access attempt.")
            except Exception as e:
                #log exception
                print(e)
        elif self.path == '/toggleAssign':
            #POST path for the toggleability of the user assignments
            currentUser = self.getCurrUser()
            #ensures that only admins can change this
            #otherwise it gives a 403 error
            if not currentUser or not isUserAdmin(currentUser):
                self.send_response(403)
                self.end_headers()
                self.wfile.write(b"Unauthorized access attempt.")
                return
            #if the user wasnt kicked out, the selected user gets changed to be able to assign
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            user_data = json.loads(post_data.decode('utf-8'))
            #gethers the uNID from the user being assigned
            uNID = user_data['uNID']
            self.toggleAssign(uNID)
            self.send_response(200)
            self.end_headers()
        elif self.path == '/deleteUser':
            #POST path for deleting a user
            currentUser = self.getCurrUser()
            #despite the panel being hidden for non-admins
            #we still need to check for admin status here as users can still send requests to this path manually
            if not currentUser or not isUserAdmin(currentUser):
                #403 error if the user is not an admin
                self.send_response(403)
                self.end_headers()
                self.wfile.write(b"Unauthorized access attempt.")
                return
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            user_data = json.loads(post_data.decode('utf-8'))
            uNID = user_data['uNID']
            #sends a signal to the deleteUser method to delete the user from the database
            self.deleteUser(uNID)
            self.send_response(200)
            self.end_headers()
        elif self.path == '/toggleAdminStatus':
            #POST path for toggling a user's admin status
            currentUser = self.getCurrUser()
            #like above, recheck for admin status in case someone manually sends a request to this path
            if not currentUser or not isUserAdmin(currentUser):
                #throws a 403 error if the user is not an admin
                self.send_response(403)
                self.end_headers()
                self.wfile.write(b"Unauthorized access attempt.")
                return
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            #parse user data from the post data (json format)
            user_data = json.loads(post_data.decode('utf-8'))
            uNID = user_data['uNID']
            conn = sqlite3.connect('signininfo.db')
            c = conn.cursor()
            c.execute("SELECT isAdmin FROM signininfo WHERE uNID = ?", (uNID,))
            result = c.fetchone()
            if result:
                #toggles the user's admin status (if they are an admin, they are no longer an admin and vice versa)
                new_status = not result[0]
                c.execute("UPDATE signininfo SET isAdmin = ? WHERE uNID = ?", (new_status, uNID))
                conn.commit()
            conn.close()
            self.send_response(200)
            self.end_headers()
        elif self.path == '/createtasks':
            #POST request for the createtasks
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)

            #pasrse multipart/form-data
            environ = {'REQUEST_METHOD': 'POST'}
            headers = {key: value if isinstance(value, str) else value.decode('utf-8') for key, value in self.headers.items()}
            headers['Content-Length'] = str(content_length)

            #read through the JSON sent by the user and decodes it
            data = json.loads(post_data.decode('utf-8'))

            title = data.get('title')
            description = data.get('description')
            due_date = data.get('dueDate')
            priority = data.get('priority')
            assignees = data.get('assignees')

            # Ensure assignees is always a list
            if isinstance(assignees, str):
                assignees = [assignees]

            conn = sqlite3.connect('tasks.db')
            c = conn.cursor()

            assigner = self.getCurrUser() or 'Chadmin'
            # Insert the task into the tasks table
            try:
                # Insert the task into the tasks table
                c.execute('''
                    INSERT INTO tasks (task_title, task_description, task_due_date, task_priority, task_assigner, task_status)
                    VALUES (?, ?, ?, ?, ?, ?)
                ''', (title, description, due_date, priority, assigner, 'Pending'))

                task_id = c.lastrowid

                # Insert the assignees into the task_assignees table
                for assignee in assignees:
                    c.execute('''
                        INSERT INTO assignees (task_id, assignee_name)
                        VALUES (?, ?)
                    ''', (task_id, assignee))

                conn.commit()
            #gives an error if it exists
            except sqlite3.OperationalError as e:
                print(f"SQLite error: {e}")
            finally:
                #no matter what, close the connection
                conn.close()

            #redirects the user back to the task page
            self.send_response(302)
            self.send_header('Location', '/tasks')
            self.end_headers()

        elif self.path == '/sdsanalog':
            #POST for the sdsanalog path
            #this is for information coming from the raspberry pi pico device, specifically from the one in the paralyne machine
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)

            # Check content type to determine if it's CSV or JSON
            content_type = self.headers.get('Content-Type', '')

            if content_type == 'text/csv':
                # Handle CSV data from the new implementation
                try:
                    csv_content = post_data.decode('utf-8')

                    # Get session and batch information
                    session_id = self.headers.get('X-Session-ID')
                    batch_number = self.headers.get('X-Batch-Number')
                    total_batches = self.headers.get('X-Total-Batches')
                    batch_points = self.headers.get('X-Batch-Points')
                    is_final_batch = self.headers.get('X-Is-Final-Batch', 'false').lower() == 'true'

                    if not session_id or not batch_number or not total_batches:
                        self.send_response(400)
                        self.send_header('Content-type', 'application/json')
                        self.end_headers()
                        response = {'status': 'error', 'message': 'Missing session or batch headers'}
                        self.wfile.write(json.dumps(response).encode('utf-8'))
                        return

                    batch_number = int(batch_number)
                    total_batches = int(total_batches)

                    print(f'Received batch {batch_number}/{total_batches} for session {session_id} with {batch_points} points')

                    # Store batch data with improved session management
                    with MyServer.session_lock:
                        if session_id not in MyServer.session_batches:
                            MyServer.session_batches[session_id] = {
                                'total_batches': total_batches,
                                'batches': {},
                                'start_time': datetime.now(),
                                'last_batch_time': datetime.now()
                            }

                        # Update last batch time
                        MyServer.session_batches[session_id]['last_batch_time'] = datetime.now()
                        MyServer.session_batches[session_id]['batches'][batch_number] = csv_content

                        # Handle session timeout or completion
                        session_data = MyServer.session_batches[session_id]
                        received_batches = len(session_data['batches'])

                                        # Check if all batches received OR if this is marked as final batch
                        if received_batches == total_batches or is_final_batch:
                            # All batches received or final batch received, combine them
                            print(f"Session {session_id} complete: {received_batches}/{total_batches} batches")
                            self.combine_csv_batches_final(session_id, cleanup_session=False)  # Don't cleanup yet
                        else:
                            # Check for session timeout (handle very long runs)
                            time_since_start = datetime.now() - session_data['start_time']
                            time_since_last = datetime.now() - session_data['last_batch_time']

                            # If session has been running for more than 4 hours or no batches for 10 minutes
                            if time_since_start.total_seconds() > 14400 or time_since_last.total_seconds() > 600:
                                print(f"Session {session_id} timeout: saving partial data ({received_batches}/{total_batches} batches)")
                                self.combine_csv_batches_final(session_id, cleanup_session=True)  # Cleanup on timeout

                    # Send success response
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    response = {
                        'status': 'success',
                        'message': f'Batch {batch_number}/{total_batches} received for session {session_id}',
                        'session_id': session_id
                    }
                    self.wfile.write(json.dumps(response).encode('utf-8'))

                except Exception as e:
                    print(f'Error processing CSV data: {e}')
                    self.send_response(500)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    response = {'status': 'error', 'message': str(e)}
                    self.wfile.write(json.dumps(response).encode('utf-8'))

        elif self.path == '/sdsanalogfinished':
            """Handle session finalization and combine all batches with enhanced timestamp-based de-duplication"""
            try:
                content_length = int(self.headers['Content-Length'])
                if content_length > 0:
                    post_data = self.rfile.read(content_length)
                    try:
                        data = json.loads(post_data.decode('utf-8'))
                        session_id = data.get('session_id')
                    except:
                        session_id = None
                else:
                    session_id = None

                # Also check headers for session ID as backup
                if not session_id:
                    session_id = self.headers.get('X-Session-ID')

                print(f"Finalizing session: {session_id}")

                if session_id:
                    with MyServer.session_lock:
                        if session_id in MyServer.session_batches:
                            session_data = MyServer.session_batches[session_id]
                            received_batches = len(session_data['batches'])
                            total_batches = session_data['total_batches']

                            print(f"Finalizing session {session_id}: combining {received_batches}/{total_batches} batches")

                            # Force combination of all received batches
                            self.combine_csv_batches_final(session_id, cleanup_session=False)

                            # Enhanced de-duplication step specifically for timestamp duplicates
                            timestamp_val = session_data['start_time'].strftime('%Y%m%d%H%M%S')
                            combined_filename = f"{timestamp_val}_SDSLOG_combined_{session_id}.csv"
                            combined_filepath = os.path.join('LogData', 'Paralyne', 'analog', combined_filename)

                            if os.path.exists(combined_filepath):
                                try:
                                    # Read the combined file
                                    with open(combined_filepath, 'r', encoding='utf-8') as file:
                                        lines = file.readlines()

                                    if len(lines) <= 1:  # Only header or empty file
                                        print(f"File {combined_filename} has no data to de-duplicate")
                                        response_message = f"Session {session_id} finalized with {received_batches}/{total_batches} batches combined (no data to de-duplicate)"
                                    else:
                                        # Parse header and data
                                        header = lines[0].strip()
                                        data_lines = lines[1:]

                                        print(f"De-duplicating file: {len(data_lines)} total data lines before processing")

                                        # Parse data lines and extract timestamps
                                        unique_data = {}  # Dictionary to store unique entries by timestamp
                                        duplicate_count = 0

                                        for line in data_lines:
                                            line = line.strip()
                                            if not line:  # Skip empty lines
                                                continue

                                            # Split the CSV line and get timestamp (first column)
                                            parts = line.split(',')
                                            if len(parts) >= 1:
                                                try:
                                                    timestamp = int(parts[0])  # Convert to int for proper comparison

                                                    # Only keep the first occurrence of each timestamp
                                                    if timestamp not in unique_data:
                                                        unique_data[timestamp] = line
                                                    else:
                                                        duplicate_count += 1
                                                        print(f"Duplicate timestamp found: {timestamp}")
                                                except ValueError:
                                                    # If timestamp isn't a valid integer, keep the line anyway
                                                    print(f"Invalid timestamp format in line: {line[:50]}...")
                                                    # Use the original line as a fallback key
                                                    unique_data[line] = line

                                        # Sort by timestamp and rebuild the file
                                        sorted_timestamps = sorted([k for k in unique_data.keys() if isinstance(k, int)])
                                        non_timestamp_keys = [k for k in unique_data.keys() if not isinstance(k, int)]

                                        # Write the de-duplicated data back to file
                                        with open(combined_filepath, 'w', encoding='utf-8', newline='') as file:
                                            file.write(header + '\n')

                                            # Write timestamp-based entries in sorted order
                                            for timestamp in sorted_timestamps:
                                                file.write(unique_data[timestamp] + '\n')

                                            # Write any non-timestamp entries at the end
                                            for key in non_timestamp_keys:
                                                file.write(unique_data[key] + '\n')

                                        final_count = len(unique_data)
                                        print(f"De-duplication complete: {final_count} unique entries, {duplicate_count} duplicates removed")
                                        response_message = f"Session {session_id} finalized with {received_batches}/{total_batches} batches combined and {duplicate_count} timestamp duplicates removed ({final_count} unique entries)"

                                except Exception as e:
                                    print(f"Error during de-duplication: {e}")
                                    response_message = f"Session {session_id} finalized with {received_batches}/{total_batches} batches combined (de-duplication failed: {str(e)})"
                            else:
                                print(f"Combined file not found: {combined_filepath}")
                                response_message = f"Session {session_id} finalized but combined file not found"

                            # Clean up session data
                            del MyServer.session_batches[session_id]
                            print(f"Session {session_id} cleaned up")

                        else:
                            response_message = f"Session {session_id} not found in active sessions"
                            print(response_message)
                else:
                    response_message = "No session ID provided for finalization"
                    print(response_message)

                # Legacy handling for old SDS log file (if still needed)
                if MyServer.SDSLogFileLocation != '':
                    try:
                        if hasattr(self, 'SDSlogFile'):
                            self.SDSlogFile.close()
                        MyServer.SDSLogFileLocation = ''
                        print("Legacy SDS log file closed")
                    except Exception as e:
                        print(f"Error closing legacy log file: {e}")

                # Send success response
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response = {
                    'status': 'session_finalized',
                    'session_id': session_id,
                    'message': response_message
                }
                self.wfile.write(json.dumps(response).encode('utf-8'))

            except Exception as e:
                print(f"Error finalizing session: {e}")
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response = {'status': 'error', 'message': str(e)}
                self.wfile.write(json.dumps(response).encode('utf-8'))

#handles pump for denton 18
        elif self.path == '/denton18pump':
            #this is for information coming from the raspberry pi pico device, specifically from the one in the paralyne machine
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)

            #recieves and decodes the json sent from the pi pico
            data = json.loads(post_data)
            pressureVal = data.get('pressure')


             #if the sds log file isnt currently being written to, create a new one with the name of a timestamp
            #otherwise just inits the SDSlogFile
            if MyServer.Denton18LogFileLocation == '':
                #sets up a timestamp for the file uploads
                #this is in the form of YYYYMMDDHHMMSS
                #then gives it a proper filename
                timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
                filename = f"{timestamp}_DENTON1PUMPLOG.csv"
                filename = os.path.join('LogData', 'denton18', 'pumpdata', filename)
                #saves the file as LogData/Paralyne/analog/FILENAME.csv
                self.Denton18pumplogFile = open(filename, 'a', newline='')
                self.Denton18pumpWriter = csv.writer(self.Denton18pumplogFile)
                #writes the first line with important information for the readibility sake
                self.Denton18pumpWriter.writerow(['Timestamp', 'Vacuum pressure'])

                #sets the LogFileLocation of the file being written to
                #this needs to be done to ensure that it closes properly later on
                MyServer.Denton18pumpWriter = filename
            else:
                #if the file already exists, just write the next line as the file doesnt need to be set up
                self.Denton18pumplogFile = open(MyServer.Denton18LogFileLocation, 'a', newline='')
                self.Denton18pumpWriter = csv.writer(self.Denton18pumplogFile)

            #gathers the exact current time in the format of YYYY-MM-DD HH:MM:SS for logging the data
            runningTimestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            #variables needs to be normalized, mutliplied by 3.3 (max voltage of pin), 3.0 (due to the step down), and 0.009 (converts to torr)
            pressureVal = pressureVal/65535.0 * 3.3 * 3.0 /0.009
            #TODO FIX THIS UP TO ADJUST TO NEW SETS OF PRESSURE DATA.
            #write the values into the next line of the csv file and then flush
            self.Denton18pumpWriter.writerow([runningTimestamp, pressureVal])
            self.Denton18pumplogFile.flush()

            #gives a response back to the raspberry pi that it was successful in its data transfer
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            response = {'status': 'success'}
            self.wfile.write(json.dumps(response).encode('utf-8'))

        elif self.path == '/denton18pumpfinished':
            #POST request to close the csv writer once the machine starts turning off
            if MyServer.Denton18LogFileLocation != '':
                #only can close the writer if it's already open
                self.Denton18pumplogFile = open(MyServer.Denton18LogFileLocation, 'a', newline='')
                self.Denton18pumplogFile.close()
                #sets the logfilelocation back to '' to ensure that it works next trun
                MyServer.Denton18LogFileLocation = ''
                #send a 200 response and a success message back to the pi pico
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response = {'status': 'file closed'}
                self.wfile.write(json.dumps(response).encode('utf-8'))
            else:
                #if a file isn't being written to, send a 400 response back to the pi pico
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response = {'status': 'no file to close'}
                self.wfile.write(json.dumps(response).encode('utf-8'))

        elif self.path == '/changestatus':
            #POST request for the change status path
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            #gets the task_id from the json response, this is the task to toggle
            data = json.loads(post_data)
            task_id = data.get('taskId')
            self.change_task_status(task_id)
            #send a 200 response back
            self.send_response(200)
            self.end_headers()
        elif self.path == '/uploadtaskfile':
            #POST request for file uploads
            content_type, pdict = cgi.parse_header(self.headers.get('content-type'))
            #ensures the correct data type and that everything else is in order
            if content_type == 'multipart/form-data':
                pdict['boundary'] = bytes(pdict['boundary'], 'utf-8')
                form = cgi.FieldStorage(fp=self.rfile, headers=self.headers, environ={'REQUEST_METHOD': 'POST'}, keep_blank_values=True)

                #gets the task_id and file item from the information being uploaded
                task_id = form['task_id'].value
                file_item = form['file']

                #ensures that the server only accepts certain file types
                if file_item.filename.endswith(('.txt', '.pdf', '.csv', '.png', '.jpg', '.jpeg', '.doc', '.docx', '.xls', '.xlsx')):
                    #if it's one of the accepted file types, add the file to the server and send a 200 response back
                    self.handle_file_upload(task_id, file_item)
                    self.send_response(200)
                    self.end_headers()
                else:
                    #if it's not one of the acceptable filetypes or doesnt exist, respond with a 400 and inform the user
                    self.send_response(400)
                    self.end_headers()
                    self.wfile.write(b'No file uploaded or incorrect filetype uploaded.')
            else:
                #send a 400 if the data being sent is something like a json or other invalid content type
                self.send_response(400)
                self.end_headers()
                self.wfile.write(b'Invalid content type.')
        elif self.path == '/claimTask':
            #POST request for claimtask path
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            #read the json and decode the task ID out
            data = json.loads(post_data)
            task_id = data.get('taskId')
            #get the user to ensure that they're allowed to claim a task
            user = self.getCurrUser()
            if user is None:
                #if they arent throw a 403 error
                self.send_response(403)
                self.end_headers()
                self.wfile.write(b'Unauthorized access attempt.')
                return
            #if they're allowed to, claim the task and give a 200 response
            self.claimTask(task_id, user)
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b'Task claimed.')
        elif self.path == '/submitALDData':
            #POST request for the submitALDData path
            #this is so that the user is able to graph out how things are specified
            #TODO at some point I'd like to make the page only return valid combinations
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length).decode('utf-8')

            #parse the data being sent to the post request and gather important information
            post_data = parse_qs(post_data)
            material = post_data['material'][0]
            depmode = post_data['depmode'][0]
            chuckTemp = post_data['temp'][0]

            #if all the varaibles are valid and matching a combination present in the ALD information
            if material and depmode and chuckTemp:
                chuckTemp = int(chuckTemp)
                #gathers the machine data for the ALD
                df = self.getMachineData('ALD')
                if df is not None:
                    #matches the data properly for whats being filtered
                    filteredDF = df[(df['Film Deposited'] == material) &
                                    (df['Deposition Mode'] == depmode) &
                                    (df['Chuck Temperature (C)'] == chuckTemp)]
                    if not filteredDF.empty:
                        #mathematically determines the deposition rate
                        filteredDF['Deposition Rate'] = filteredDF['Measured Thickness (nm)'] / filteredDF['Number of Cycles']
                        # replace NaNs with 0 (SOME PEOPLE DIDNT PUT IN THE NUMBER OF CYCLES)
                        #TODO maybe just exclude these values that turn into NaN
                        filteredDF['Deposition Rate'] = filteredDF['Deposition Rate'].fillna(0)
                        #gathering deposition rates to graph
                        depoRate = filteredDF['Deposition Rate'].tolist()
                        # creating sequential labels
                        labels = list(range(1, len(depoRate) + 1))
                        #starts sending 200 error code
                        self.send_response(200)
                        self.send_header('Content-type', 'text/html')
                        self.end_headers()

                        #Displays the deposition rate over time using chart.js and my custom graph.js libraries
                        #TODO Proooobably some better way to do this and make it look cleaner but thats a problem for future me
                        #(future me will hate past me for this)
                        html_response = """
                        <html>
                        <head>
                            <title>Deposition Rate Graph</title>
                            <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
                            <script src="/js/graph.js"></script>
                        </head>
                        <body>
                            <h2>Deposition Rate Over Time</h2>
                            <canvas id="depositionRateGraph"></canvas>
                            <script>
                                var graphData = {
                                    labels: """ + json.dumps(labels) + """,
                                    datasets: [{
                                        label: 'Deposition Rate (nm/cycle)',
                                        data: """ + json.dumps(depoRate) + """,
                                        borderColor: 'rgba(75, 192, 192, 1)',
                                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                        fill: false
                                    }]
                                };
                                generateLineGraph('depositionRateGraph', graphData);
                            </script>
                        </body>
                        </html>
                        """

                        self.wfile.write(html_response.encode('utf-8'))
            else:
                #if data combination doesnt exist, send a 404 error
                self.send_response(404)
                self.end_headers()
                self.wfile.write(b'Data not found.')

        elif self.path == '/getChartCount':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length).decode('utf-8')
            post_data = parse_qs(post_data)

            # Debugging: Print the parsed data
            print("Parsed data:", post_data)

            material = post_data.get('material', [None])[0]
            depmode = post_data.get('depmode', [None])[0]
            temp = int(post_data.get('temp', [0])[0])

            if material is None or depmode is None or temp == 0:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(b'Missing required parameters.')
                return

            # Read the CSV file and count the instances
            df = pd.read_csv('HSCDATA/small_ALD_DataCollection.csv')
            count = len(df[(df['Film Deposited'] == material) & (df['Deposition Mode'] == depmode) & (df['Chuck Temperature (C)'] == temp)])

            # Send the count as the response
            self.send_response(200)
            self.send_header("Content-type", "text/plain")
            self.end_headers()
            self.wfile.write(str(count).encode('utf-8'))
        else:
            #gives a 404 if the request just doesnt make sense
            self.send_response(400)
            self.end_headers()
            self.wfile.write(b'Invalid input.')

    def serve_paralyne_analog_files(self):
        """
        Serve Paralyne analog files without authentication.
        Endpoints:
        - GET /api/paralyne/analog/list - List all files
        - GET /api/paralyne/analog/download/<filename> - Download specific file
        """
        try:
            path_parts = self.path.split('/')

            if len(path_parts) < 4:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response = {'error': 'Invalid API path'}
                self.wfile.write(json.dumps(response).encode('utf-8'))
                return

            action = path_parts[4] if len(path_parts) > 4 else 'list'

            # Directory path for Paralyne analog files
            directory_path = os.path.join('LogData', 'Paralyne', 'analog')

            if not os.path.exists(directory_path):
                self.send_response(404)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response = {'error': 'Directory not found'}
                self.wfile.write(json.dumps(response).encode('utf-8'))
                return

            if action == 'list':
                # List all files in the directory
                try:
                    files = os.listdir(directory_path)
                    # Filter for CSV files and sort by modification time (newest first)
                    csv_files = [f for f in files if f.endswith('.csv')]

                    file_info = []
                    for file in csv_files:
                        file_path = os.path.join(directory_path, file)
                        stat = os.stat(file_path)
                        file_info.append({
                            'filename': file,
                            'size': stat.st_size,
                            'modified': datetime.fromtimestamp(stat.st_mtime).isoformat(),
                            'download_url': f'/api/paralyne/analog/download/{file}'
                        })

                    # Sort by modification time (newest first)
                    file_info.sort(key=lambda x: x['modified'], reverse=True)

                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    response = {
                        'status': 'success',
                        'files': file_info,
                        'count': len(file_info)
                    }
                    self.wfile.write(json.dumps(response).encode('utf-8'))

                except Exception as e:
                    self.send_response(500)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    response = {'error': f'Failed to list files: {str(e)}'}
                    self.wfile.write(json.dumps(response).encode('utf-8'))

            elif action == 'download' and len(path_parts) > 5:
                # Download specific file
                filename = urllib.parse.unquote(path_parts[5])
                file_path = os.path.join(directory_path, filename)

                # Security check: ensure filename doesn't contain path traversal
                if '..' in filename or '/' in filename or '\\' in filename:
                    self.send_response(400)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    response = {'error': 'Invalid filename'}
                    self.wfile.write(json.dumps(response).encode('utf-8'))
                    return

                if os.path.isfile(file_path) and filename.endswith('.csv'):
                    try:
                        self.send_response(200)
                        self.send_header('Content-type', 'text/csv')
                        self.send_header('Content-Disposition', f'attachment; filename="{filename}"')
                        self.end_headers()

                        with open(file_path, 'rb') as file:
                            self.wfile.write(file.read())

                    except Exception as e:
                        self.send_response(500)
                        self.send_header('Content-type', 'application/json')
                        self.end_headers()
                        response = {'error': f'Failed to read file: {str(e)}'}
                        self.wfile.write(json.dumps(response).encode('utf-8'))
                else:
                    self.send_response(404)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    response = {'error': 'File not found'}
                    self.wfile.write(json.dumps(response).encode('utf-8'))

            else:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response = {'error': 'Invalid action. Use "list" or "download/<filename>"'}
                self.wfile.write(json.dumps(response).encode('utf-8'))

        except Exception as e:
            print(f"Error in serve_paralyne_analog_files: {e}")
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            response = {'error': 'Internal server error'}
            self.wfile.write(json.dumps(response).encode('utf-8'))

def cleanup_old_sessions():
    """Clean up sessions that are older than 10 hours"""
    try:
        with MyServer.session_lock:
            current_time = datetime.now()
            sessions_to_remove = []

            for session_id, session_data in MyServer.session_batches.items():
                time_since_start = current_time - session_data['start_time']
                if time_since_start.total_seconds() > 36000:  # 10 hours
                    print(f"Cleaning up old session {session_id}")
                    sessions_to_remove.append(session_id)

            for session_id in sessions_to_remove:
                # Save partial data before cleanup
                if MyServer.session_batches[session_id]['batches']:
                    print(f"Saving partial data for expired session {session_id}")
                    # Create a temporary server instance to call combine_csv_batches
                    temp_server = type('TempServer', (), {})()
                    temp_server.combine_csv_batches = MyServer.combine_csv_batches.__func__
                    temp_server.combine_csv_batches(temp_server, session_id)
                else:
                    del MyServer.session_batches[session_id]

    except Exception as e:
        print(f"Error during session cleanup: {e}")

def start_cleanup_thread():
    """Start a background thread to clean up old sessions"""
    def cleanup_loop():
        while True:
            time.sleep(1800)  # Run every 30 minutes
            cleanup_old_sessions()

    cleanup_thread = threading.Thread(target=cleanup_loop, daemon=True)
    cleanup_thread.start()



#ensures that code is running only when HSCDisplayerServer.py is run
if __name__ == "__main__":
    #Creates databases
    create_db() #ensures user DB is created
    create_session_db() #ensures session DB is created
    create_task_db() #ensures task DB is created

    # Start cleanup thread for long-running sessions
    start_cleanup_thread()

    #sets the host name and port number
    if DEBUGMODE:
        hostName = "localhost"
        PORT = 443
    else:
        hostName = "155.98.11.8"
        PORT = 443

    #creates a server on the specified port
    httpd = HTTPServer((hostName, PORT), MyServer)

    if not DEBUGMODE:
        context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
        context.load_cert_chain(certfile='/etc/letsencrypt/live/nfhistory.nanofab.utah.edu/cert.pem',
                                keyfile='/etc/letsencrypt/live/nfhistory.nanofab.utah.edu/privkey.pem')
    else:
        context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
        context.load_cert_chain(certfile='C:\\Users\\Phe\\cert.pem',
                                keyfile='C:\\Users\\Phe\\key.pem')

        # Wrap the socket with SSL
    httpd.socket = context.wrap_socket(httpd.socket, server_side=True)

    #prints the server's address
    print("Server started https://%s:%s" % (hostName, PORT))

    #starts the server on an infinite loop
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        #stops the server if computer the server is running on detects a ctrl+c (keyboard interrupt)
        pass

    #closes the server and informs the user that the server has been stopped
    httpd.server_close()
    print("Server stopped.")
```

## Line-By-Line Reconstruction Notes

### Line 9

```text
import cgi
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 10

```text
import html
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 11

```text
from http.server import BaseHTTPRequestHandler, HTTPServer
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 12

```text
import http.cookies
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 13

```text
import logging
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 14

```text
import random
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 15

```text
import socketserver
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 16

```text
import csv
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 17

```text
import ssl
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 18

```text
import sqlite3
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 19

```text
import bcrypt
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 20

```text
import uuid
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 21

```text
import json
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 22

```text
import datetime
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 23

```text
import json
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 24

```text
from urllib.parse import parse_qs, unquote
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 25

```text
import os
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 26

```text
from datetime import datetime, timedelta
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 27

```text
import io
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 28

```text
import ssl
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 29

```text
import threading
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 30

```text
import logging
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 31

```text
import duo_client
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 32

```text
import asyncio
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 33

```text
import urllib.parse
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 34

```text
from DuoKeys import DUO_IKEY, DUO_SKEY, DUO_HOST
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 36

```text
import pandas as pd
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 37

```text
import re  # Add this import for regular expressions
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 38

```text
import time
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 40

```text
logging.basicConfig(level=logging.DEBUG)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 51

```text
DEBUGMODE = False
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 54

```text
DATA_DIR = os.path.join(os.path.dirname(__file__), 'HSCDATA')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 59

```text
startSort = '''
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 60

```text
            <script>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 61

```text
            document.addEventListener('DOMContentLoaded', function() {
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 62

```text
                var headers = document.querySelectorAll('#sortableTable th');
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 63

```text
                for (let i = 0; i < headers.length; i++) {
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 64

```text
                    headers[i].addEventListener('click', function() {
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 65

```text
                        sortTable(i);
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 66

```text
                    });
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 67

```text
                }
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 68

```text
            });
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 69

```text
            </script>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 70

```text
            '''
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 73

```text
def create_db():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 75

```text
    conn = sqlite3.connect('signininfo.db')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 76

```text
    cc = conn.cursor()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 79

```text
    cc.execute('''CREATE TABLE IF NOT EXISTS signininfo (username TEXT UNIQUE, passwordHash TEXT, uNID TEXT UNIQUE, isAdmin BOOLEAN DEFAULT FALSE, canAssign BOOLEAN DEFAULT FALSE)''')
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 81

```text
    conn.commit()
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 82

```text
    conn.close()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 85

```text
def addUser(username, password, uNID):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 87

```text
    conn = sqlite3.connect('signininfo.db')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 88

```text
    cc = conn.cursor()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 90

```text
    secure_password = <redacted-secret-value>)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 91

```text
    try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 94

```text
        cc.execute("INSERT INTO signininfo (username, passwordHash, uNID) VALUES (?, ?, ?)", (username, secure_password, uNID))
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 95

```text
        conn.commit()
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 96

```text
    except sqlite3.IntegrityError:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 97

```text
        print("Username or uNID already exists")
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 98

```text
    finally:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 99

```text
        conn.close()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 103

```text
def create_session_db():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 104

```text
    conn = sqlite3.connect('sessioninfo.db')
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 105

```text
    cc = conn.cursor()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 108

```text
    cc.execute('''Drop TABLE IF EXISTS sessioninfo''')
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 109

```text
    cc.execute('''CREATE TABLE sessioninfo (session_id TEXT UNIQUE, username TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)''')
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 110

```text
    conn.commit()
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 111

```text
    conn.close()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 114

```text
def create_task_db():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 115

```text
    conn = sqlite3.connect('tasks.db')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 116

```text
    cc = conn.cursor()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 119

```text
    cc.execute('''
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 120

```text
        CREATE TABLE IF NOT EXISTS tasks (
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 121

```text
            task_id INTEGER PRIMARY KEY AUTOINCREMENT,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 122

```text
            task_title TEXT,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 123

```text
            task_description TEXT,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 124

```text
            task_assign_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 125

```text
            task_due_date TIMESTAMP,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 126

```text
            task_priority TEXT,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 127

```text
            task_assigner TEXT,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 128

```text
            task_status TEXT)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 129

```text
    ''')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 132

```text
    cc.execute('''
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 133

```text
        CREATE TABLE IF NOT EXISTS assignees (
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 134

```text
            task_id INTEGER,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 135

```text
            assignee_name TEXT,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 136

```text
            FOREIGN KEY(task_id) REFERENCES tasks(task_id))
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 137

```text
    ''')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 141

```text
    cc.execute('''
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 142

```text
        CREATE TABLE IF NOT EXISTS task_files (
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 143

```text
            file_id INTEGER PRIMARY KEY AUTOINCREMENT,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 144

```text
            task_id INTEGER,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 145

```text
            file_path TEXT,
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 146

```text
            FOREIGN KEY(task_id) REFERENCES tasks(task_id))
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 147

```text
    ''')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 149

```text
    conn.commit()
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 150

```text
    conn.close()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 155

```text
def delete_old_sessions():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 156

```text
    conn = sqlite3.connect('sessioninfo.db')
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 157

```text
    c = conn.cursor()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 159

```text
    cookieExp = datetime.now() - timedelta(minutes=2)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 160

```text
    c.execute("DELETE FROM sessioninfo WHERE created_at < ?", (cookieExp,))
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 161

```text
    conn.commit()
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 162

```text
    conn.close()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 166

```text
def getUserFromSession(session_id):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 167

```text
    conn = sqlite3.connect('sessioninfo.db')
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 168

```text
    c = conn.cursor()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 169

```text
    c.execute("SELECT username FROM sessioninfo WHERE session_id = ?", (session_id,))
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 170

```text
    result = c.fetchone()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 171

```text
    conn.close()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 172

```text
    return result[0] if result else None
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 175

```text
def hash_password(password):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 176

```text
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt())
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 180

```text
def addUser(username, password, uNID):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 181

```text
    conn = sqlite3.connect('signininfo.db')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 183

```text
    cc = conn.cursor()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 184

```text
    secure_password = <redacted-secret-value>)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 187

```text
    try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 188

```text
        cc.execute("INSERT INTO signininfo (username, passwordHash, uNID) VALUES (?, ?, ?)", (username, secure_password, uNID))
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 189

```text
        conn.commit()
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 190

```text
    except sqlite3.IntegrityError:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 191

```text
        print("Username or uNID already exists")
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 192

```text
    finally:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 194

```text
        conn.close()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 198

```text
def verify_userInfo(username, password):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 199

```text
    conn = sqlite3.connect('signininfo.db')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 200

```text
    c = conn.cursor()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 202

```text
    c.execute("SELECT passwordHash FROM signininfo WHERE username = ?", (username,))
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 203

```text
    user = c.fetchone()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 204

```text
    conn.close()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 206

```text
    if user and bcrypt.checkpw(password.encode(), user[0]):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 207

```text
        return True
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 208

```text
    else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 209

```text
        return False
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 215

```text
def verify_userUnid(username, uNID):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 216

```text
    conn = sqlite3.connect('signininfo.db')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 217

```text
    c = conn.cursor()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 219

```text
    c.execute("SELECT uNID FROM signininfo WHERE username = ?", (username,))
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 220

```text
    user = c.fetchone()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 221

```text
    conn.close()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 223

```text
    if user and uNID == user[0]:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 224

```text
        return True
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 225

```text
    else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 226

```text
        return False
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 231

```text
def isUserAdmin(username):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 232

```text
    conn = sqlite3.connect('signininfo.db')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 233

```text
    c = conn.cursor()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 235

```text
    c.execute("SELECT isAdmin FROM signininfo WHERE username = ?", (username,))
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 236

```text
    result = c.fetchone()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 237

```text
    conn.close()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 238

```text
    return result and result[0] == 1
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 242

```text
def canUserAssign(username):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 243

```text
    conn = sqlite3.connect('signininfo.db')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 244

```text
    c = conn.cursor()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 246

```text
    c.execute("SELECT canAssign FROM signininfo WHERE username = ?", (username,))
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 247

```text
    result = c.fetchone()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 248

```text
    conn.close()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 249

```text
    return result and result[0] == 1
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 253

```text
def createUserSession(username):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 255

```text
    session_id = str(uuid.uuid4())
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 258

```text
    conn = sqlite3.connect('sessioninfo.db')
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 259

```text
    c = conn.cursor()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 260

```text
    c.execute("INSERT INTO sessioninfo (session_id, username) VALUES (?, ?)", (session_id, username))
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 263

```text
    conn.commit()
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 264

```text
    conn.close()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 266

```text
    return session_id
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 270

```text
def sanitize_input(input, max_length=255):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 272

```text
    sanitized = input.strip()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 274

```text
    sanitized[:max_length]
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 276

```text
    sanitized = html.escape(sanitized)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 277

```text
    return sanitized
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 280

```text
def fetchUserTasks(username):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 281

```text
    conn = sqlite3.connect('tasks.db')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 282

```text
    c = conn.cursor()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 284

```text
    c.execute('''
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 285

```text
        SELECT t.task_id, t.task_title, t.task_description, t.task_assign_date, t.task_due_date, t.task_priority,
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 286

```text
        t.task_assigner, t.task_status, GROUP_CONCAT(a.assignee_name) as assignees
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 287

```text
        FROM tasks t
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 288

```text
        LEFT JOIN assignees a ON t.task_id = a.task_id
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 289

```text
        WHERE t.task_assigner = ? OR a.assignee_name = ?
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 290

```text
        GROUP BY t.task_id
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 291

```text
    ''', (username, username))
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 292

```text
    tasks = c.fetchall()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 293

```text
    conn.close()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 294

```text
    return tasks
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 297

```text
def generateHTMLfromUserTasks(tasks):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 299

```text
    htmlOut = "<html><head><title>User Tasks</title></head><body>"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 303

```text
    htmlOut += """
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 304

```text
    <table border='1'>
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 305

```text
        <tr>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 306

```text
            <th>Title</th>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 307

```text
            <th>Description</th>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 308

```text
            <th>Assign Date</th>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 309

```text
            <th>Due Date</th>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 310

```text
            <th>Priority</th>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 311

```text
            <th>Assigner</th>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 312

```text
            <th>Status</th>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 313

```text
            <th>Update Status</th>
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 314

```text
            <th>Assignees</th>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 315

```text
            <th>Files</th>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 316

```text
            <th>Upload File</th>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 317

```text
        </tr>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 318

```text
    """
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 320

```text
    for task in tasks:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 323

```text
        assigneeList = task[8].split(',')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 324

```text
        assigneeHTML = "<br>".join(assigneeList)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 327

```text
        conn = sqlite3.connect('tasks.db')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 328

```text
        c = conn.cursor()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 329

```text
        c.execute("SELECT file_path FROM task_files WHERE task_id = ?", (task[0],))
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 330

```text
        files = c.fetchall()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 331

```text
        conn.close()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 334

```text
        fileHTML = "<br>".join([f"<a href='{file[0]}' download>{os.path.basename(file[0])}</a>" for file in files])
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 337

```text
        htmlOut += f"""
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 338

```text
        <tr>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 339

```text
            <td>{task[1]}</td>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 340

```text
            <td>{task[2]}</td>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 341

```text
            <td>{task[3]}</td>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 342

```text
            <td>{task[4]}</td>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 343

```text
            <td>{task[5]}</td>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 344

```text
            <td>{task[6]}</td>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 345

```text
            <td id='status-{task[0]}'>{task[7]}</td>
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 346

```text
            <td><button onclick="changeStatus('{task[0]}')">Advance Status</button></td>
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 347

```text
            <td>{assigneeHTML}</td>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 348

```text
            <td>{fileHTML}</td>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 349

```text
            <td>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 350

```text
                <input type='file' id='fileInput-{task[0]}' style='display:none;' />
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 351

```text
                <button onclick="uploadFile('{task[0]}')">Upload</button>
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 352

```text
            </td>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 353

```text
        </tr>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 354

```text
        """
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 355

```text
    htmlOut += "</table></body></html>"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 356

```text
    return htmlOut
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 358

```text
def generateHTMLfromTasks(tasks):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 360

```text
    htmlOut = "<html><head><title>User Tasks</title></head><body>"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 364

```text
    htmlOut += """
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 365

```text
    <table border='1'>
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 366

```text
        <tr>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 367

```text
            <th>Title</th>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 368

```text
            <th>Description</th>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 369

```text
            <th>Assign Date</th>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 370

```text
            <th>Due Date</th>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 371

```text
            <th>Priority</th>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 372

```text
            <th>Assigner</th>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 373

```text
            <th>claim Task</th>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 374

```text
            <th>Assignees</th>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 375

```text
            <th>Files</th>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 376

```text
        </tr>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 377

```text
    """
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 379

```text
    for task in tasks:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 382

```text
        assigneeList = task[8].split(',')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 383

```text
        assigneeHTML = "<br>".join(assigneeList)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 386

```text
        conn = sqlite3.connect('tasks.db')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 387

```text
        c = conn.cursor()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 388

```text
        c.execute("SELECT file_path FROM task_files WHERE task_id = ?", (task[0],))
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 389

```text
        files = c.fetchall()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 390

```text
        conn.close()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 393

```text
        fileHTML = "<br>".join([f"<a href='{file[0]}' download>{os.path.basename(file[0])}</a>" for file in files])
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 396

```text
        htmlOut += f"""
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 397

```text
        <tr>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 398

```text
            <td>{task[1]}</td>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 399

```text
            <td>{task[2]}</td>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 400

```text
            <td>{task[3]}</td>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 401

```text
            <td>{task[4]}</td>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 402

```text
            <td>{task[5]}</td>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 403

```text
            <td>{task[6]}</td>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 404

```text
            <td id='claim-{task[0]}'><button onclick="claimTask('{task[0]}')">Claim Task</button></td>
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 405

```text
            <td>{assigneeHTML}</td>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 406

```text
            <td>{fileHTML}</td>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 407

```text
        </tr>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 408

```text
        """
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 409

```text
    htmlOut += "</table></body></html>"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 410

```text
    return htmlOut
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 412

```text
async def duo_authenticate(username):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 413

```text
    auth_api = duo_client.Auth(
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 414

```text
        ikey=DUO_IKEY,
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 415

```text
        skey=DUO_SKEY,
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 416

```text
        host=DUO_HOST
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 417

```text
    )
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 419

```text
    auth_params = {
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 420

```text
        'username': username,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 421

```text
        'factor': 'push',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 422

```text
        'device': 'auto'
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 423

```text
    }
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 425

```text
    response = await asyncio.to_thread(auth_api.auth, **auth_params)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 426

```text
    return response['result'] == 'allow'
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 430

```text
class MyServer(BaseHTTPRequestHandler):
```

`class` — This class boundary groups state and behavior. Recreate the constructor expectations, instance attributes, inheritance, class-level constants, and public methods; edge cases include partially initialized objects, reused instances, and serialization or database mapping assumptions.

### Line 433

```text
    SDSLogFileLocation = ''
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 434

```text
    Denton18LogFileLocation = ''
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 437

```text
    session_batches = {}  # Dictionary to track batches per session
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 438

```text
    session_lock = threading.Lock()  # Thread lock for session data
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 441

```text
    def csv_to_html_table(self, csv_file):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 443

```text
        html_output = "<table id='sortableTable' border='1'>"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 444

```text
        with open(csv_file, newline='') as f:
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 445

```text
            reader = csv.reader(f)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 446

```text
            header_row = next(reader) #first row is header row
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 447

```text
            html_output += "<thead><tr>" + "".join(f"<th>{cell}</th>" for cell in header_row) + "</tr></thead><tbody>"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 449

```text
            for row in reader:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 450

```text
                html_output += "<tr>" + "".join(f"<td>{cell}</td>" for cell in row) + "</tr>"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 451

```text
        html_output += "</tbody></table>"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 452

```text
        return html_output
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 456

```text
    def getAndDisplay(self, machine, graphs):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 458

```text
        self.send_response(200)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 459

```text
        self.send_header("Content-type", "text/html")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 460

```text
        self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 462

```text
        html_table = self.csv_to_html_table(DATA_DIR + '/small_' + machine + '_DataCollection.csv') #if this is broken, replace '/small_' with '\\small_'
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 464

```text
        html_table += '<script src="/js/tablesort.js"></script>'
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 465

```text
        html_table += startSort
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 467

```text
        html_table += '<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>'
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 469

```text
        for graph in graphs:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 470

```text
            if isinstance(graph, list):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 472

```text
                canvasID = "".join(graph).replace(" ", "").replace("(", "").replace(")", "")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 473

```text
                yAxis = graph  # Assuming graph is a list of y-axis labels
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 474

```text
            else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 476

```text
                canvasID = graph.replace(" ", "").replace("(", "").replace(")", "")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 477

```text
                yAxis = graph
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 479

```text
            graphData = self.preparetoGraph(DATA_DIR + '/small_' + machine + '_DataCollection.csv', yAxis)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 480

```text
            graph_table = f'<canvas id="{canvasID}"></canvas>' #sets up a canvas to draw the graph on
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 481

```text
            graph_table += f'<script>var {canvasID}Data = {json.dumps(graphData)};</script>' #sets up the data for the graph
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 482

```text
            graph_table += f'<script src="/js/graph.js"></script>' #implements my graph.js script
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 483

```text
            graph_table += f'<script>generateLineGraph("{canvasID}", {canvasID}Data);</script>' #generates the graph
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 484

```text
            html_table += graph_table
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 487

```text
        self.wfile.write(html_table.encode('utf-8'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 490

```text
    def graphLogs(self, fileLoc, graphs):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 492

```text
        self.send_response(200)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 493

```text
        self.send_header("Content-type", "text/html")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 494

```text
        self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 499

```text
        chartHTML = '<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>'
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 500

```text
        chartHTML += '<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-zoom"></script>'
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 502

```text
        for graph in graphs:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 504

```text
            if isinstance(graph, list):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 506

```text
                canvasID = "".join(graph).replace(" ", "").replace("(", "").replace(")", "")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 507

```text
                yAxis = graph  # Assuming graph is a list of y-axis labels
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 508

```text
            else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 510

```text
                canvasID = graph.replace(" ", "").replace("(", "").replace(")", "")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 511

```text
                yAxis = graph
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 514

```text
            graphData = self.preparetoGraph(fileLoc, yAxis)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 515

```text
            chartHTML += f'<canvas id="{canvasID}"></canvas>' #sets up a canvas to draw the graph on
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 516

```text
            chartHTML += f'<script>var {canvasID}Data = {json.dumps(graphData)};</script>' #sets up the data for the graph
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 517

```text
            chartHTML += f'<script src="/js/graph.js"></script>' #implements my graph.js script
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 518

```text
            chartHTML += f'<script>generateLineGraph("{canvasID}", {canvasID}Data);</script>' #generates the graph
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 521

```text
        self.wfile.write(chartHTML.encode('utf-8'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 524

```text
    def preparetoGraph(self, filePath, yAxis):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 526

```text
        _, file_extension = os.path.splitext(filePath)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 527

```text
        if file_extension.lower() == '.csv':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 528

```text
            return self.graphCSV(filePath, yAxis)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 529

```text
        elif file_extension.lower() == '.txt':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 530

```text
            return self.graphTXT(filePath, yAxis)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 531

```text
        else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 532

```text
            raise ValueError("Unsupported file type")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 535

```text
    def graphCSV(self, csv_file, yAxes):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 536

```text
        with open(csv_file, newline='') as csvfile:
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 537

```text
            reader = csv.DictReader(csvfile)            #load the csv file
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 538

```text
            run = []                                    #set up the x-axis
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 539

```text
            data = {yAxis: [] for yAxis in yAxes}       #set up the y-axis as a bunch of empty lists
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 540

```text
            for row in reader:                          #iderates through each row to grab the data for the graph
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 541

```text
                run.append(row[reader.fieldnames[0]])   #adds the x-axis data to the graph
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 542

```text
                for yAxis in yAxes:                     #adds the y-axis data to the graph
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 543

```text
                    try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 545

```text
                        data[yAxis].append(float(row[yAxis]))
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 546

```text
                    except ValueError:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 548

```text
                        print(f"Error converting {yAxis} value to integer: {row[yAxis]}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 550

```text
                        data[yAxis].append(0)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 553

```text
            try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 554

```text
                currGraph = {
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 555

```text
                'labels': run,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 556

```text
                'datasets': [
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 557

```text
                {
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 558

```text
                    'label': f'{yAxis} over Time',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 559

```text
                    'data': data[yAxis],
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 560

```text
                    'borderColor': f'rgba({random.randint(0, 255)}, {random.randint(0, 255)}, {random.randint(0, 255)}, 1)',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 561

```text
                    'backgroundColor': f'rgba({random.randint(0, 255)}, {random.randint(0, 255)}, {random.randint(0, 255)}, 0.2)',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 562

```text
                } for yAxis in yAxes
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 563

```text
            ]
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 564

```text
            }
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 565

```text
            except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 566

```text
                print(f"Error setting currGraph: {e}") #general error handling
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 567

```text
        return currGraph
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 570

```text
    def graphTXT(self, txt_file, yAxes):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 571

```text
        with open(txt_file, 'r') as file:
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 572

```text
            lines = file.readlines()                #load the txt file
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 574

```text
            headers = lines[0].strip().split('\t')  #grab the headers
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 575

```text
            run = []                                #set up the x-axis
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 576

```text
            data = {yAxis: [] for yAxis in yAxes}   #set up the y-axis as a bunch of empty lists
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 577

```text
            for line in lines[1:]:  # Skip the header line
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 578

```text
                values = line.strip().split('\t')   #grab the values for the graph
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 579

```text
                row = dict(zip(headers, values))    #zip the headers and values together
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 580

```text
                run.append(row[headers[0]])         #add the x-axis data to the graph
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 581

```text
                for yAxis in yAxes:                 #add the y-axis data to the graph by iterating through the yAxes
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 582

```text
                    try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 584

```text
                        data[yAxis].append(float(row[yAxis]))
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 585

```text
                    except ValueError:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 587

```text
                        print(f"Error converting {yAxis} value to integer: {row[yAxis]}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 589

```text
                        data[yAxis].append(0)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 592

```text
            try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 593

```text
                currGraph = {
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 594

```text
                    'labels': run,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 595

```text
                    'datasets': [
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 596

```text
                        {
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 597

```text
                            'label': f'{yAxis} over Time',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 598

```text
                            'data': data[yAxis],
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 599

```text
                            'borderColor': f'rgba({random.randint(0, 255)}, {random.randint(0, 255)}, {random.randint(0, 255)}, 1)',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 600

```text
                            'backgroundColor': f'rgba({random.randint(0, 255)}, {random.randint(0, 255)}, {random.randint(0, 255)}, 0.2)',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 601

```text
                        } for yAxis in yAxes
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 602

```text
                    ]
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 603

```text
                }
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 604

```text
            except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 605

```text
                print(f"Error setting currGraph: {e}") #general error handling
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 606

```text
        return currGraph
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 608

```text
    def handleHSCData(self, machine):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 610

```text
        self.send_response(200)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 611

```text
        self.send_header("Content-type", "text/html")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 612

```text
        self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 614

```text
        if machine == 'ALD':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 615

```text
            with open('ALD_chart.html', 'r') as f:
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 616

```text
                html_content = f.read()
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 617

```text
            self.wfile.write(html_content.encode('utf-8'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 619

```text
    def getMachineData(self, machine):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 620

```text
        try :
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 621

```text
            df = pd.read_csv(DATA_DIR + '/small_' + machine + '_DataCollection.csv')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 622

```text
            return df
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 623

```text
        except FileNotFoundError:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 624

```text
            self.wfile.write(f'<h1>File not found</h1>'.encode('utf-8'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 625

```text
            return None
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 628

```text
    def handle_error(self, e):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 630

```text
        logging.error("An error occurred: %s", e)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 631

```text
        self.send_response(500)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 632

```text
        self.send_header('Content-type', 'text/html')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 633

```text
        self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 634

```text
        self.wfile.write(f'<h1>An error occurred: {e}</h1>')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 638

```text
    def getCurrUser(self):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 641

```text
        if "Cookie" in self.headers:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 642

```text
            cookie = http.cookies.SimpleCookie(self.headers["Cookie"])
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 644

```text
            if "session_id" in cookie:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 645

```text
                session_id = cookie["session_id"].value
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 647

```text
                username = getUserFromSession(session_id)
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 648

```text
                if username:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 649

```text
                    return username
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 652

```text
    def setSessionCookie(self, session_id):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 653

```text
        returnCookie = http.cookies.SimpleCookie()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 657

```text
        cookieExpirationDate = 120
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 658

```text
        returnCookie["session_id"] = session_id                             #session_id is the key
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 659

```text
        returnCookie["session_id"]["path"] = "/"                            #cookie is valid for the entire domain
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 660

```text
        returnCookie["session_id"]["max-age"] = str(cookieExpirationDate)   #cookie expires after 24 hours
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 661

```text
        returnCookie["session_id"]["expires"] = cookieExpirationDate        #cookie expires after 24 hours
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 664

```text
        self.send_response(200)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 665

```text
        self.send_header("Set-Cookie", returnCookie["session_id"].OutputString())
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 666

```text
        self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 669

```text
    def serveAdminPanel(self):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 671

```text
        users = self.fetchAdminPanelData()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 672

```text
        returnHTML = self.generateAdminPanelHTML(users)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 673

```text
        self.send_response(200)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 674

```text
        self.send_header("Content-type", "text/html")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 675

```text
        self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 676

```text
        self.wfile.write(returnHTML.encode("utf-8"))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 679

```text
    def fetchAdminPanelData(self):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 681

```text
        conn = sqlite3.connect('signininfo.db')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 682

```text
        c = conn.cursor()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 683

```text
        c.execute("SELECT username, uNID, isAdmin, canAssign FROM signininfo")
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 684

```text
        users = c.fetchall()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 685

```text
        conn.close()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 686

```text
        return users
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 689

```text
    def generateAdminPanelHTML(self, users):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 691

```text
        returnHTML = "<html><head><title>Admin Panel</title></head>" #title
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 693

```text
        returnHTML += "<body><h1>User List</h1><table border='1'><tr><th>Username</th><th>uNID</th><th>is Admin</th><th>can assign tasks</th><th>toggle assign tasks</th><th>Delete User</th><th>Toggle Admin</th></tr>"
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 694

```text
        for user in users:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 696

```text
            isAdmin = "Yes" if user[2] else "No"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 697

```text
            canAssign = "Yes" if user[3] else "No"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 698

```text
            returnHTML += f"<tr><td>{html.escape(user[0])}</td><td>{html.escape(user[1])}</td><th>{isAdmin}</th><th>{canAssign}</th>"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 700

```text
            returnHTML += f"<td><button onclick=\"toggleAssign('{user[1]}')\">Toggle Assign Privs</button></td>"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 701

```text
            returnHTML += f"<td><button onclick=\"deleteUser('{user[1]}')\">Delete</button></td>"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 702

```text
            returnHTML += f"<td><button onclick=\"toggleAdminStatus('{user[1]}')\">Toggle Admin</button></td></tr>"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 704

```text
        returnHTML + "</table>"
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 705

```text
        returnHTML += '<script src="/js/adminActions.js"></script>' #adds the adminActions.js script to the HTML
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 706

```text
        returnHTML += "</body></html>"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 707

```text
        return returnHTML
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 710

```text
    def toggleAssign(self, uNID):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 712

```text
            conn = sqlite3.connect('signininfo.db')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 713

```text
            c = conn.cursor()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 714

```text
            c.execute("SELECT canAssign FROM signininfo WHERE uNID = ?", (uNID,))
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 715

```text
            result = c.fetchone()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 716

```text
            if result:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 718

```text
                new_status = not result[0]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 719

```text
                c.execute("UPDATE signininfo SET canAssign = ? WHERE uNID = ?", (new_status, uNID))
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 720

```text
                conn.commit()
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 721

```text
            conn.close()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 722

```text
            self.send_response(200)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 723

```text
            self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 726

```text
    def deleteUser(self, uNID):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 727

```text
        conn = sqlite3.connect('signininfo.db')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 728

```text
        c = conn.cursor()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 729

```text
        c.execute("DELETE FROM signininfo WHERE uNID = ?", (uNID,))
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 730

```text
        conn.commit()
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 731

```text
        conn.close()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 734

```text
    def is_secureConnection(self):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 735

```text
        x_forwarded_proto = self.headers.get('X-Forwarded-Proto')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 736

```text
        print(f"X-Forwarded-Proto: {x_forwarded_proto}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 737

```text
        if x_forwarded_proto:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 738

```text
            return x_forwarded_proto == 'https'
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 740

```text
        return self.server.server_port == 443
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 743

```text
    def redirect_to_https(self):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 744

```text
        """Redirect to HTTPS if the request is over HTTP."""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 745

```text
        host = self.headers.get('Host')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 746

```text
        https_url = f'https://{host}{self.path}'
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 747

```text
        print(f"Redirecting to: {https_url}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 748

```text
        self.send_response(301)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 749

```text
        self.send_header('Location', https_url)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 750

```text
        self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 754

```text
    def sortByTime(self, files, dateFormat):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 755

```text
        try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 757

```text
            fileDetails = []
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 759

```text
            for file in files:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 761

```text
                match = re.search(r'Event_Log_Run#(\d+)', file)
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 762

```text
                run_number = int(match.group(1)) if match else float('inf')  # Default to infinity if no match
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 765

```text
                if dateFormat == 0:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 766

```text
                    parts = file.rsplit('_')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 767

```text
                    runDate = '_'.join(parts[:4])
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 768

```text
                    dt = datetime.strptime(runDate, "%m_%d_%Y_%I-%M %p")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 769

```text
                elif dateFormat == 1:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 770

```text
                    parts = file.rsplit('_')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 771

```text
                    runDate = '_'.join(parts[:1])
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 772

```text
                    dt = datetime.strptime(runDate, "%Y%m%d%H%M%S")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 773

```text
                elif dateFormat == 2:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 774

```text
                    date_start_pos = file.find('.dat ')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 775

```text
                    if date_start_pos != -1:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 776

```text
                        date_part = file[date_start_pos + 5:]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 777

```text
                        if date_part.endswith('.dat'):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 778

```text
                            date_part = date_part[:-4]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 779

```text
                        date_time_str = date_part.replace('_', ':')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 780

```text
                        dt = datetime.strptime(date_time_str, "%Y-%m-%d %H:%M:%S")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 781

```text
                    else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 782

```text
                        dt = datetime.now()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 783

```text
                else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 784

```text
                    dt = datetime.now()  # Fallback for unknown formats
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 787

```text
                fileDetails.append((file, run_number, dt))
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 790

```text
            sorted_files = sorted(fileDetails, key=lambda x: (x[1], x[2]), reverse=True)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 791

```text
            return [file for file, _, _ in sorted_files]
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 793

```text
        except ValueError:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 795

```text
            return []
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 800

```text
    def getLogFiles(self, machine, datatype):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 801

```text
        self.send_response(200)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 802

```text
        self.send_header("Content-type", "text/html")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 803

```text
        self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 807

```text
        if machine == 'ALD':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 809

```text
            if datatype == 'RF':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 810

```text
                directory_path = os.path.join('LogData', 'ALD', 'RF')  # Adjusted to your specified directory
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 812

```text
                try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 815

```text
                    files = os.listdir(directory_path)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 816

```text
                    sortedFiles = self.sortByTime(files, 0)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 817

```text
                    html_content = "<html><body><h2>RF Log Files</h2>"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 818

```text
                    for file in sortedFiles:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 820

```text
                        file_path = os.path.join('/LogData/ALD/RF', file)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 822

```text
                        html_content += f"<p>{file} <a href='/graph{file_path}'><button>View</button></a> <a href='/download{file_path}' download><button>Download</button></a></p>"
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 823

```text
                    html_content += "</body></html>"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 825

```text
                except FileNotFoundError:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 826

```text
                    html_content = "<html><body><h2>Directory not found.</h2></body></html>"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 828

```text
            elif datatype == 'Pressure':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 829

```text
                directory_path = os.path.join('LogData', 'ALD', 'Pressure')  # Adjusted to your specified directory
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 831

```text
                try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 834

```text
                    files = os.listdir(directory_path)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 835

```text
                    sortedFiles = self.sortByTime(files, 0)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 836

```text
                    html_content = "<html><body><h2>Pressure Log Files</h2>"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 837

```text
                    for file in sortedFiles:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 839

```text
                        file_path = os.path.join('/LogData/ALD/Pressure', file)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 841

```text
                        html_content += f"<p>{file} <a href='/graph{file_path}'><button>View</button></a> <a href='/download{file_path}' download><button>Download</button></a></p>"
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 842

```text
                    html_content += "</body></html>"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 844

```text
                except FileNotFoundError:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 845

```text
                    html_content = "<html><body><h2>Directory not found.</h2></body></html>"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 847

```text
        elif machine == 'Paralyne':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 849

```text
            if datatype == 'uploads':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 850

```text
                directory_path = os.path.join('LogData', 'Paralyne', 'analog')  # Adjusted to your specified directory
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 852

```text
                try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 855

```text
                    files = os.listdir(directory_path)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 856

```text
                    sortedFiles = self.sortByTime(files, 1)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 857

```text
                    html_content = "<html><body><h2>Paralyne analog Files</h2>"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 858

```text
                    for file in sortedFiles:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 860

```text
                        file_path = os.path.join('/LogData/Paralyne/analog', file)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 862

```text
                        html_content += f"<p>{file} <a href='/graph{file_path}'><button>View</button></a> <a href='/download{file_path}' download><button>Download</button></a></p>"
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 863

```text
                    html_content += "</body></html>"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 865

```text
                except FileNotFoundError:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 866

```text
                    html_content = "<html><body><h2>Directory not found.</h2></body></html>"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 867

```text
        elif machine == 'Denton635':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 870

```text
            if datatype == 'uploads':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 871

```text
                directory_path = os.path.join(os.path.expanduser('~'), 'Desktop', 'Logs', 'Denton635', 'Log_files')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 872

```text
                try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 875

```text
                    files = os.listdir(directory_path)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 876

```text
                    sortedFiles = self.sortByTime(files, 2)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 877

```text
                    html_content = "<html><body><h2>Denton635 Files</h2>"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 878

```text
                    for file in sortedFiles:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 880

```text
                        actual_file_path = os.path.join(directory_path, file)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 881

```text
                        display_file_path = os.path.join('/Desktop/Logs/Denton635/Log_files', file)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 883

```text
                        html_content += f"<p>{file} <a href='/graph{display_file_path}'><button>View</button></a> <a href='/download{display_file_path}' download><button>Download</button></a></p>"
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 884

```text
                    html_content += "</body></html>"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 885

```text
                except FileNotFoundError:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 886

```text
                    html_content = "<html><body><h2>Directory not found. Please check the Denton635 logs location.</h2></body></html>"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 889

```text
        self.wfile.write(html_content.encode('utf-8'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 893

```text
    def change_task_status(self, taskId):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 894

```text
        conn = sqlite3.connect('tasks.db')  # Assuming your tasks are stored in tasks.db
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 895

```text
        c = conn.cursor()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 896

```text
        c.execute("UPDATE tasks SET task_status = 'Completed' WHERE task_id = ?", (taskId,))
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 897

```text
        conn.commit()
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 898

```text
        conn.close()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 902

```text
    def fetchAllTasks(self):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 904

```text
        conn = sqlite3.connect('tasks.db')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 905

```text
        c = conn.cursor()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 906

```text
        c.execute('''
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 907

```text
            SELECT
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 908

```text
                t.task_id,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 909

```text
                t.task_title,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 910

```text
                t.task_description,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 911

```text
                t.task_assign_date,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 912

```text
                t.task_due_date,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 913

```text
                t.task_priority,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 914

```text
                t.task_assigner,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 915

```text
                t.task_status,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 916

```text
                GROUP_CONCAT(a.assignee_name) as assignees
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 917

```text
            FROM tasks t
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 918

```text
            LEFT JOIN assignees a ON t.task_id = a.task_id
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 919

```text
            GROUP BY t.task_id
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 920

```text
        ''')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 921

```text
        files = c.fetchall()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 922

```text
        conn.close()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 923

```text
        return files
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 927

```text
    def fetchUnfinishedTasks(self):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 929

```text
        conn = sqlite3.connect('tasks.db')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 930

```text
        c = conn.cursor()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 932

```text
        c.execute('''
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 933

```text
            SELECT
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 934

```text
                t.task_id,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 935

```text
                t.task_title,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 936

```text
                t.task_description,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 937

```text
                t.task_assign_date,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 938

```text
                t.task_due_date,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 939

```text
                t.task_priority,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 940

```text
                t.task_assigner,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 941

```text
                t.task_status,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 942

```text
                GROUP_CONCAT(a.assignee_name) as assignees
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 943

```text
            FROM tasks t
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 944

```text
            LEFT JOIN assignees a ON t.task_id = a.task_id
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 945

```text
            WHERE t.task_status != 'Completed'
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 946

```text
            GROUP BY t.task_id
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 947

```text
        ''')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 948

```text
        files = c.fetchall()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 949

```text
        conn.close()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 950

```text
        return files
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 953

```text
    def handle_file_upload(self, taskID, fileItem):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 957

```text
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 958

```text
        file_name, file_extension = os.path.splitext(fileItem.filename)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 960

```text
        fileWithTimestamp = f"{file_name}_{timestamp}{file_extension}"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 963

```text
        file_path = os.path.join('uploads', fileWithTimestamp)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 964

```text
        with open(file_path, 'wb') as file:
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 965

```text
            file.write(fileItem.file.read())
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 967

```text
        conn = sqlite3.connect('tasks.db')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 968

```text
        c = conn.cursor()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 969

```text
        c.execute("INSERT INTO task_files (task_id, file_path) VALUES (?, ?)", (taskID, file_path))
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 970

```text
        conn.commit()
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 971

```text
        conn.close()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 974

```text
    def serve_file(self):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 976

```text
        file_path = self.path.lstrip('/')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 979

```text
        file_path = urllib.parse.unquote(file_path)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 982

```text
        if 'Desktop/Logs/Denton635/Log_files/' in file_path:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 984

```text
            path_parts = file_path.split('Desktop/Logs/Denton635/Log_files/')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 985

```text
            if len(path_parts) > 1:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 986

```text
                denton_file_name = path_parts[1]
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 989

```text
                print(f"Looking for file: {denton_file_name}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 992

```text
                actual_path = os.path.join(os.path.expanduser('~'), 'Desktop', 'Logs', 'Denton635', 'Log_files', denton_file_name)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 993

```text
                print(f"Full path: {actual_path}")
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 995

```text
                if os.path.isfile(actual_path):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 996

```text
                    self.send_response(200)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 997

```text
                    self.send_header('Content-type', 'application/octet-stream')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 998

```text
                    self.send_header('Content-Disposition', f'attachment; filename="{denton_file_name}"')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 999

```text
                    self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1000

```text
                    with open(actual_path, 'rb') as file:
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1001

```text
                        self.wfile.write(file.read())
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1002

```text
                    return
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1003

```text
                else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1004

```text
                    self.send_response(404)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1005

```text
                    self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1006

```text
                    self.wfile.write(f'Denton635 log file not found: {actual_path}'.encode('utf-8'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1007

```text
                    return
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1010

```text
        if os.path.isfile(file_path):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1012

```text
            self.send_response(200)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1013

```text
            self.send_header('Content-type', 'application/octet-stream')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1014

```text
            self.send_header('Content-Disposition', f'attachment; filename="{os.path.basename(file_path)}"')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1015

```text
            self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1016

```text
            with open(file_path, 'rb') as file:
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1017

```text
                self.wfile.write(file.read())
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1018

```text
        else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1020

```text
            self.send_response(404)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1021

```text
            self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1022

```text
            self.wfile.write(b'File not found')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1025

```text
    def claimTask(self, taskID, assignee):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 1026

```text
        conn = sqlite3.connect('tasks.db')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1027

```text
        c = conn.cursor()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1031

```text
        c.execute("SELECT * FROM assignees WHERE task_id = ? AND assignee_name = ?", (taskID, assignee))
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 1032

```text
        result = c.fetchone()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1033

```text
        if result is None:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1035

```text
            c.execute("INSERT INTO assignees (task_id, assignee_name) VALUES (?, ?)", (taskID, assignee))
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 1036

```text
            conn.commit()
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 1037

```text
        conn.close()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1041

```text
    async def handle_login(self, username, password):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 1046

```text
        conn = sqlite3.connect('signininfo.db')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1047

```text
        c = conn.cursor()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1048

```text
        c.execute("SELECT uNID FROM signininfo WHERE username = ?", (username,))
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 1049

```text
        useruNID = c.fetchone()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1050

```text
        conn.close()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1051

```text
        uNID = useruNID[0] if useruNID else None
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1054

```text
        if verify_userInfo(username, password):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1055

```text
            print("User credentials verified, proceeding with 2FA")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1058

```text
            if await duo_authenticate(uNID):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1059

```text
                print("2FA successful, user logged in")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1060

```text
                session = createUserSession(username)
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 1062

```text
                self.send_response(302)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1063

```text
                self.send_header('Set-Cookie', f'session_id={session}; Path=/')
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 1064

```text
                self.send_header('Location', '/tasks')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1065

```text
                self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1066

```text
            else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1068

```text
                print("2FA failed")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1069

```text
                self.send_response(302)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1070

```text
                self.send_header('Location', '/login')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1071

```text
                self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1072

```text
        else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1074

```text
            print("User credentials invalid")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1075

```text
            self.send_response(302)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1076

```text
            self.send_header('Location', '/login')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1077

```text
            self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1081

```text
    async def handle_signup(self, username, password, uNID):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 1083

```text
        conn = sqlite3.connect('signininfo.db')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1084

```text
        c = conn.cursor()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1085

```text
        c.execute("SELECT 1 FROM signininfo WHERE username = ?", (username,))
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 1086

```text
        userExists = c.fetchone()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1087

```text
        if userExists:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1090

```text
            print("User already exists")
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1091

```text
            self.send_response(302)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1092

```text
            self.send_header('Location', '/login')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1093

```text
            self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1094

```text
            self.wfile.write(b"User already exists")
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1095

```text
            return
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1098

```text
        if await duo_authenticate(uNID):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1100

```text
            addUser(username, password, uNID)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1101

```text
            self.send_response(302)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1102

```text
            self.send_header('Location', '/login')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1103

```text
            self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1104

```text
            self.wfile.write(b"User created successfully")
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1105

```text
        else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1107

```text
            print("2FA failed")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1108

```text
            self.send_response(302)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1109

```text
            self.send_header('Location', '/signup')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1110

```text
            self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1111

```text
            self.wfile.write(b"2FA failed")
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1115

```text
    def serve_static(self, path):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 1117

```text
        filePath = DATA_DIR + path
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1118

```text
        print(filePath)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1120

```text
        with open(filePath, 'rb') as f:
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1121

```text
            self.send_response(200)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1122

```text
            self.send_header("Content-type", "application/javascript")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1123

```text
            self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1124

```text
            self.wfile.write(f.read())
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1126

```text
    def combine_csv_batches_final(self, session_id, cleanup_session=False):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 1127

```text
        """Combine all CSV batches for a session into one final file with simplified naming"""
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 1128

```text
        try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 1129

```text
            if session_id not in MyServer.session_batches:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1130

```text
                print(f"No batches found for session {session_id}")
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 1131

```text
                return
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1133

```text
            session_data = MyServer.session_batches[session_id]
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 1134

```text
            total_batches = session_data['total_batches']
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 1135

```text
            batches = session_data['batches']
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 1138

```text
            if not batches:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1139

```text
                print(f"No batch data found for session {session_id}")
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 1140

```text
                return
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1143

```text
            timestamp = session_data['start_time'].strftime('%Y%m%d%H%M%S')
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 1144

```text
            combined_filename = f"{timestamp}_SDSLOG_combined_{session_id}.csv"
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 1145

```text
            combined_filepath = os.path.join('LogData', 'Paralyne', 'analog', combined_filename)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1148

```text
            os.makedirs(os.path.dirname(combined_filepath), exist_ok=True)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1150

```text
            print(f"Debug: Available batches: {list(batches.keys())}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1151

```text
            print(f"Debug: Total batches expected: {total_batches}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1154

```text
            available_batch_numbers = sorted(batches.keys())
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1155

```text
            print(f"Debug: Processing batches in order: {available_batch_numbers}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1158

```text
            file_exists = os.path.exists(combined_filepath)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1159

```text
            file_mode = 'a' if file_exists else 'w'
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1161

```text
            print(f"Debug: File {'exists' if file_exists else 'does not exist'}, opening in mode '{file_mode}'")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1163

```text
            with open(combined_filepath, file_mode, newline='', encoding='utf-8') as combined_file:
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1165

```text
                if not file_exists:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1166

```text
                    combined_file.write("timestamp,pressure,vapor,temp\n")
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1167

```text
                    print("Debug: Wrote header to new file")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1170

```text
                total_points_added = 0
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1171

```text
                for batch_num in available_batch_numbers:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 1172

```text
                    batch_content = batches[batch_num]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1173

```text
                    print(f"Debug: Processing batch {batch_num}, content length: {len(batch_content)}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1176

```text
                    lines = batch_content.strip().split('\n')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1179

```text
                    if lines and lines[0].startswith('timestamp,pressure,vapor,temp'):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1180

```text
                        lines = lines[1:]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1181

```text
                        print(f"Debug: Skipped header in batch {batch_num}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1184

```text
                    batch_line_count = 0
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1185

```text
                    for line in lines:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 1186

```text
                        if line.strip():  # Only write non-empty lines
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1187

```text
                            combined_file.write(line.strip() + '\n')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1188

```text
                            total_points_added += 1
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1189

```text
                            batch_line_count += 1
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1191

```text
                    print(f"Debug: Appended {batch_line_count} lines from batch {batch_num}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1194

```text
                combined_file.flush()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1196

```text
            print(f"Combined CSV updated: {combined_filepath}")
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1197

```text
            print(f"Total data points added in this call: {total_points_added}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1200

```text
            with open(combined_filepath, 'r') as verify_file:
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1201

```text
                verify_lines = verify_file.readlines()
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1202

```text
                print(f"Debug: Final file now has {len(verify_lines)} total lines (including header)")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1203

```text
                if len(verify_lines) > 1:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1204

```text
                    print(f"Debug: First data line: {verify_lines[1].strip()}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1205

```text
                if len(verify_lines) > 3:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1206

```text
                    print(f"Debug: Last data line: {verify_lines[-1].strip()}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1209

```text
            if cleanup_session:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1210

```text
                del MyServer.session_batches[session_id]
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 1211

```text
                print(f"Session {session_id} cleaned up")
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 1213

```text
        except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 1214

```text
            print(f"Error combining CSV batches for session {session_id}: {e}")
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 1215

```text
            import traceback
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 1216

```text
            traceback.print_exc()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1222

```text
    def do_GET(self):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 1225

```text
        if not self.is_secureConnection():
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1226

```text
            print('redirecting to https')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1227

```text
            self.redirect_to_https()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1228

```text
            return
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1232

```text
        LCpath = self.path.lower()
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1235

```text
        if LCpath.startswith('/api/paralyne/analog/'):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1236

```text
            self.serve_paralyne_analog_files()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1237

```text
            return
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1240

```text
        cookie_string = self.headers.get('Cookie')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1241

```text
        cookie = http.cookies.SimpleCookie(cookie_string)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1242

```text
        session_id = cookie.get('session_id').value if 'session_id' in cookie else None
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 1245

```text
        conn = sqlite3.connect('sessioninfo.db')
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 1246

```text
        c = conn.cursor()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1247

```text
        c.execute("SELECT 1 FROM sessioninfo WHERE session_id = ?", (session_id,))
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 1248

```text
        session_exists = c.fetchone()
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 1249

```text
        conn.close()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1254

```text
        if self.path.startswith('/.well-known/acme-challenge/'):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1255

```text
            print('getting acme')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1256

```text
            file_path = self.path.lstrip('/')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1257

```text
            script_dir = os.path.dirname(os.path.abspath(__file__))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1258

```text
            full_file_path = os.path.join(script_dir, file_path)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1259

```text
            if os.path.isfile(full_file_path):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1260

```text
                self.send_response(200)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1261

```text
                self.send_header('Content-type', 'text/plain')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1262

```text
                self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1263

```text
                with open(file_path, 'rb') as file:
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1264

```text
                    self.wfile.write(file.read())
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1265

```text
                return
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1266

```text
            else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1267

```text
                self.send_response(404)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1268

```text
                self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1269

```text
                self.wfile.write(b'File not found')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1270

```text
                return
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1274

```text
        if not DEBUGMODE and LCpath not in ['/login', '/signup', '/favicon.ico'] and (session_id is None or session_exists is None):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1275

```text
            self.send_response(302)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1276

```text
            self.send_header('Location', '/login')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1277

```text
            self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1278

```text
            return
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1281

```text
        if LCpath == '/ald':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1283

```text
            self.handleHSCData('ALD')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1284

```text
            self.getAndDisplay('ALD', [['Chuck Temperature (C)', 'Precursor Temperature (C)']])
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1285

```text
        elif LCpath == '/aldlog/rfdata':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1287

```text
            self.getLogFiles('ALD', 'RF')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1288

```text
        elif LCpath == '/aldlog/pressuredata':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1290

```text
            self.getLogFiles('ALD', 'Pressure')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1291

```text
        elif LCpath == '/ebeam':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1293

```text
            self.getAndDisplay('Ebeam', ['Base Pressure', 'Temperature 1', 'Temperature 2'])
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1294

```text
        elif LCpath == '/mocvd':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1296

```text
            self.getAndDisplay('MOCVD', [])
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1297

```text
        elif LCpath == '/parylene':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1300

```text
            self.getLogFiles('Paralyne', 'uploads')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1301

```text
        elif LCpath == '/pecvd':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1303

```text
            self.getAndDisplay('PECVD', [])
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1304

```text
        elif LCpath == '/denton635':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1306

```text
            self.getFilesToDownload('Denton635')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1307

```text
        elif LCpath == '/denton18':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1309

```text
            self.getAndDisplay('Denton18',[])
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1310

```text
        elif LCpath == '/tmv':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1312

```text
            self.getAndDisplay('TMV')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1314

```text
        elif LCpath == '/drie':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1316

```text
            self.getAndDisplay('DRIE')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1317

```text
        elif LCpath == '/isotropic':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1319

```text
            self.getAndDisplay('Isotropic')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1320

```text
        elif LCpath == '/plasmalab':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1322

```text
            self.getAndDisplay('Plasmalab')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1323

```text
        elif LCpath == '/plasmatherm':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1325

```text
            self.getAndDisplay('PlasmaTherm')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1326

```text
        elif LCpath == '/technics':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1328

```text
            self.getAndDisplay('Technics')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1330

```text
        elif LCpath == '/cleanox':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1332

```text
            self.getAndDisplay('CleanOx')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1333

```text
        elif LCpath == '/dopedox':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1335

```text
            self.getAndDisplay('DopedOx')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1336

```text
        elif LCpath == '/lto':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1338

```text
            self.getAndDisplay('LTO')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1339

```text
        elif LCpath == '/nitride':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1341

```text
            self.getAndDisplay('Nitride')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1342

```text
        elif LCpath == '/poly':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1344

```text
            self.getAndDisplay('Poly')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1345

```text
        elif LCpath == '/allwin':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1347

```text
            self.getAndDisplay('Allwin')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1349

```text
        elif LCpath == '/paralyneuploads':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1351

```text
            self.getLogFiles('Paralyne', 'uploads')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1353

```text
        elif LCpath == '/login':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1355

```text
            self.send_response(200)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1356

```text
            self.send_header("Content-type", "text/html")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1357

```text
            self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1359

```text
            with open("login.html", "r") as f:
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1360

```text
                self.wfile.write(f.read().encode("utf-8"))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1361

```text
        elif LCpath == '/signup':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1363

```text
            self.send_response(200)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1364

```text
            self.send_header("Content-type", "text/html")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1365

```text
            self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1367

```text
            with open("signup.html", "r") as f:
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1368

```text
                self.wfile.write(f.read().encode("utf-8"))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1369

```text
        elif LCpath == '/adminpanel':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1372

```text
            currentUser = self.getCurrUser()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1373

```text
            if not currentUser or not isUserAdmin(currentUser):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1374

```text
                self.send_response(403)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1375

```text
                self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1376

```text
                self.wfile.write(b"Unauthorized access attempt.")
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1377

```text
                return
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1378

```text
            self.serveAdminPanel()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1379

```text
        elif LCpath.startswith('/js/'):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1381

```text
            self.serve_static('/js/' + LCpath[4:])
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1382

```text
        elif LCpath == '/favicon.ico':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1383

```text
            favicon_path = os.path.join(os.path.dirname(__file__), 'favicon.ico')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1384

```text
            if os.path.isfile(favicon_path):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1385

```text
                with open(favicon_path, 'rb') as f:
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1386

```text
                    self.send_response(200)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1387

```text
                    self.send_header('Content-type', 'image/x-icon')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1388

```text
                    self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1389

```text
                    with open(favicon_path, 'rb') as f:
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1390

```text
                        self.wfile.write(f.read())
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1391

```text
            else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1392

```text
                self.send_response(404)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1393

```text
                self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1394

```text
                self.wfile.write(b'File not found')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1395

```text
        elif LCpath == '/':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1397

```text
            self.send_response(300)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1398

```text
            self.send_header('Content-type', 'text/html')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1399

```text
            self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1400

```text
            with open('index.html', 'r') as f:
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1401

```text
                self.wfile.write(f.read().encode('utf-8'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1402

```text
        elif LCpath == '/machines':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1404

```text
            self.send_response(300)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1405

```text
            self.send_header('Content-type', 'text/html')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1406

```text
            self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1407

```text
            with open('machines.html', 'r') as f:
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1408

```text
                self.wfile.write(f.read().encode('utf-8'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1409

```text
        elif LCpath == '/logfiles':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1411

```text
            self.send_response(200)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1412

```text
            self.send_header('Content-type', 'text/html')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1413

```text
            self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1414

```text
            with open('logFileIndex.html', 'r') as f:
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1415

```text
                self.wfile.write(f.read().encode('utf-8'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1416

```text
        elif LCpath == '/tasks':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1418

```text
            self.send_response(200)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1419

```text
            self.send_header('Content-type', 'text/html')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1420

```text
            self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1422

```text
            htmlresponse = """
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1423

```text
            <html>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1424

```text
            <head>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1425

```text
                <title>Task Manager</title>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1426

```text
            </head>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1427

```text
            <body>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1428

```text
                <h1>Task Manager</h1>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1429

```text
            """
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1433

```text
            currUser = self.getCurrUser()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1434

```text
            if (canUserAssign(currUser)):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1435

```text
                htmlresponse += f'<button id="createTaskButton">Create Task</button>'
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1438

```text
            conn = sqlite3.connect('Tasks.db')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1439

```text
            cursor = conn.cursor()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1442

```text
            htmlresponse += '<h1>Assigned Tasks</h1>'
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1443

```text
            tasks = fetchUserTasks(currUser)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1444

```text
            htmlresponse += generateHTMLfromUserTasks(tasks)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1447

```text
            htmlresponse += '<h1>Uncompleted Tasks</h1>'
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1448

```text
            uncompleted = self.fetchUnfinishedTasks()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1449

```text
            htmlresponse += generateHTMLfromTasks(uncompleted)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1452

```text
            htmlresponse += '<h1>All Tasks</h1>'
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1453

```text
            alltasks = self.fetchAllTasks()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1454

```text
            htmlresponse += generateHTMLfromTasks(alltasks)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1458

```text
            htmlresponse += '<script src="js/taskActions.js"></script></body></html>'
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1459

```text
            self.wfile.write(htmlresponse.encode('utf-8'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1460

```text
        elif LCpath == '/createtasks':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1462

```text
            self.send_response(200)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1463

```text
            self.send_header('Content-type', 'text/html')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1464

```text
            self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1465

```text
            with open('createTask.html', 'r') as f:
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1466

```text
                self.wfile.write(f.read().encode('utf-8'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1467

```text
        elif LCpath == '/users':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1470

```text
            self.send_response(200)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1471

```text
            self.send_header('Content-type', 'application/json')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1472

```text
            self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1473

```text
            conn = sqlite3.connect('SigninInfo.db')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1474

```text
            cursor = conn.cursor()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1476

```text
            cursor.execute("SELECT username FROM signininfo ORDER BY username ASC")
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 1477

```text
            users = cursor.fetchall()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1478

```text
            conn.close()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1479

```text
            userlist = [user[0] for user in users]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1480

```text
            self.wfile.write(json.dumps(userlist).encode())
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1482

```text
        elif self.path.startswith('/download/'):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1486

```text
            filePath = unquote(self.path[len('/download/'):])
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1489

```text
            if 'Desktop/Logs/' in filePath:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1491

```text
                relative_path = filePath.split('Desktop/Logs/')[1]
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1494

```text
                print(f"Looking for Desktop log file: {relative_path}")
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1497

```text
                actual_path = os.path.join(os.path.expanduser('~'), 'Desktop', 'Logs', relative_path)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1498

```text
                print(f"Full path: {actual_path}")
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1500

```text
                if os.path.isfile(actual_path):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1501

```text
                    self.send_response(200)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1502

```text
                    self.send_header('Content-type', 'application/octet-stream')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1503

```text
                    self.send_header('Content-Disposition', f'attachment; filename="{os.path.basename(filePath)}"')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1504

```text
                    self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1505

```text
                    with open(actual_path, 'rb') as file:
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1506

```text
                        self.wfile.write(file.read())
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1507

```text
                    return
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1508

```text
                else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1509

```text
                    self.send_response(404)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1510

```text
                    self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1511

```text
                    self.wfile.write(f'Log file not found: {actual_path}'.encode('utf-8'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1512

```text
                    return
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1518

```text
            try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 1519

```text
                with open(normalizedFilePath, 'rb') as file:
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1521

```text
                    self.send_response(200)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1522

```text
                    self.send_header('Content-type', 'application/octet-stream')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1523

```text
                    self.send_header('Content-Disposition', f'attachment; filename="{os.path.basename(filePath)}"')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1524

```text
                    self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1525

```text
                    self.wfile.write(file.read())
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1526

```text
            except FileNotFoundError:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 1528

```text
                self.send_response(404)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1529

```text
                self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1530

```text
                self.wfile.write(b'File not found')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1531

```text
            return
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1532

```text
        elif self.path.startswith('/graph'):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1534

```text
            filePath = unquote(self.path[len('/graph/'):])
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1537

```text
            partsofURL = normalizedFilePath.split('/')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1538

```text
            try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 1540

```text
                if partsofURL[1] == 'ALD':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1542

```text
                    if partsofURL[2] == 'RF':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1544

```text
                        graphedData = [['For Pwr (W) ', 'Refl Pwr (W)']]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1545

```text
                        self.graphLogs(normalizedFilePath, graphedData)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1547

```text
                    if partsofURL[2] == 'Pressure':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1548

```text
                        graphedData = [['Pressure ']]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1549

```text
                        self.graphLogs(normalizedFilePath, graphedData)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1552

```text
                elif partsofURL[1] == 'Paralyne':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1553

```text
                    if partsofURL[2] == 'analog':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1554

```text
                        graphedData = [['Vacuum pressure']]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1555

```text
                        self.graphLogs(normalizedFilePath, graphedData)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1557

```text
            except FileNotFoundError:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 1558

```text
                self.send_response(404)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1559

```text
                self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1560

```text
                self.wfile.write(b'File not found')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1562

```text
            except ValueError as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 1563

```text
                self.send_response(400)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1564

```text
                self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1565

```text
                self.wfile.write(str(e).encode('utf-8'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1567

```text
            except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 1568

```text
                self.handle_error(e)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1569

```text
            return
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1570

```text
        elif self.path.startswith('/uploads/'):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1573

```text
            self.serve_file()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1575

```text
    def getFilesToDownload(self, machine):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 1576

```text
        """
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1577

```text
        Displays a list of files for download from the specified machine.
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1578

```text
        Handles special cases like files in Desktop/Logs folder.
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1580

```text
        Args:
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1581

```text
            machine (str): The machine name (e.g., 'Denton635', 'ALD', 'Paralyne')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1582

```text
        """
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1583

```text
        self.send_response(200)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1584

```text
        self.send_header("Content-type", "text/html")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1585

```text
        self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1588

```text
        html_content = f"""
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1589

```text
        <html>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1590

```text
        <head>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1591

```text
            <title>{machine} Log Files</title>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1592

```text
            <style>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1593

```text
                body {{ font-family: Arial, sans-serif; margin: 20px; }}
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1594

```text
                h1 {{ color: #333; }}
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1595

```text
                .file-list {{ margin-top: 20px; }}
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1596

```text
                .file-item {{ padding: 10px; border-bottom: 1px solid #eee; }}
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1597

```text
                .download-btn {{
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1598

```text
                    background-color: #4CAF50;
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1599

```text
                    border: none;
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1600

```text
                    color: white;
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1601

```text
                    padding: 8px 16px;
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1602

```text
                    text-align: center;
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1603

```text
                    text-decoration: none;
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1604

```text
                    display: inline-block;
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1605

```text
                    font-size: 14px;
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1606

```text
                    margin: 4px 2px;
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1607

```text
                    cursor: pointer;
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1608

```text
                    border-radius: 4px;
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1609

```text
                }}
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1610

```text
            </style>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1611

```text
        </head>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1612

```text
        <body>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1613

```text
            <h1>{machine} Log Files</h1>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1614

```text
            <div class="file-list">
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1615

```text
        """
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1617

```text
        try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 1619

```text
            desktop_logs_path = os.path.join(os.path.expanduser('~'), 'Desktop', 'Logs')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1620

```text
            machine_logs_path = os.path.join(desktop_logs_path, machine)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1623

```text
            if os.path.exists(machine_logs_path):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1625

```text
                html_content += f"<p><i>Note: These files are stored in Desktop/Logs/{machine} and should be moved to the project structure.</i></p>"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1628

```text
                subdirs = [d for d in os.listdir(machine_logs_path) if os.path.isdir(os.path.join(machine_logs_path, d))]
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1630

```text
                if subdirs:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1632

```text
                    for subdir in subdirs:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 1633

```text
                        dir_path = os.path.join(machine_logs_path, subdir)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1634

```text
                        html_content += f"<h2>{subdir}</h2>"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1636

```text
                        try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 1637

```text
                            files = os.listdir(dir_path)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1639

```text
                            date_format = 2 if machine == 'Denton635' else 1
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1640

```text
                            sortedFiles = self.sortByTime(files, date_format)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1642

```text
                            for file in sortedFiles:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 1644

```text
                                url_encoded_file = urllib.parse.quote(file)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1645

```text
                                relative_path = f"/Desktop/Logs/{machine}/{subdir}/{url_encoded_file}"
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1646

```text
                                html_content += f"""
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1647

```text
                                <div class="file-item">
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1648

```text
                                    <span>{file}</span>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1649

```text
                                    <a href="/download{relative_path}" download="{file}"><button class="download-btn">Download</button></a>
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1650

```text
                                </div>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1651

```text
                                """
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1652

```text
                        except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 1653

```text
                            html_content += f"<p>Error listing files in {subdir}: {str(e)}</p>"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1654

```text
                else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1656

```text
                    try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 1657

```text
                        files = os.listdir(machine_logs_path)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1658

```text
                        date_format = 2 if machine == 'Denton635' else 1
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1659

```text
                        sortedFiles = self.sortByTime(files, date_format)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1661

```text
                        for file in sortedFiles:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 1662

```text
                            url_encoded_file = urllib.parse.quote(file)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1663

```text
                            relative_path = f"/Desktop/Logs/{machine}/{url_encoded_file}"
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1664

```text
                            html_content += f"""
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1665

```text
                            <div class="file-item">
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1666

```text
                                <span>{file}</span>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1667

```text
                                <a href="/download{relative_path}" download="{file}"><button class="download-btn">Download</button></a>
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1668

```text
                            </div>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1669

```text
                            """
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1670

```text
                    except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 1671

```text
                        html_content += f"<p>Error listing files: {str(e)}</p>"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1672

```text
            else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1674

```text
                directory_path = os.path.join('LogData', machine)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1675

```text
                if os.path.exists(directory_path):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1676

```text
                    html_content += self._listFilesInSubdirectories(directory_path, 1)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1677

```text
                else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1678

```text
                    html_content += f"<p>No log files found for {machine}.</p>"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1680

```text
        except FileNotFoundError:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 1681

```text
            html_content += f"""
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1682

```text
            <p>Directory not found. Please check the {machine} logs location.</p>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1683

```text
            """
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1684

```text
        except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 1685

```text
            html_content += f"""
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1686

```text
            <p>Error accessing files: {str(e)}</p>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1687

```text
            """
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1690

```text
        html_content += """
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1691

```text
            </div>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1692

```text
        </body>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1693

```text
        </html>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1694

```text
        """
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1696

```text
        self.wfile.write(html_content.encode('utf-8'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1698

```text
    def _listFilesInSubdirectories(self, directory, dateFormat):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 1699

```text
        """
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1700

```text
        Helper method to list files in all subdirectories of the given directory.
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1702

```text
        Args:
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1703

```text
            directory (str): The base directory to search
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1704

```text
            dateFormat (int): The date format to use with sortByTime
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1706

```text
        Returns:
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1707

```text
            str: HTML content for the files
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1708

```text
        """
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1709

```text
        html_content = ""
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1712

```text
        subdirectories = [d for d in os.listdir(directory) if os.path.isdir(os.path.join(directory, d))]
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1714

```text
        if not subdirectories:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1716

```text
            files = os.listdir(directory)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1717

```text
            sortedFiles = self.sortByTime(files, dateFormat)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1719

```text
            for file in sortedFiles:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 1721

```text
                file_path = os.path.join('/', file)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1724

```text
                html_content += f"""
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1725

```text
                <div class="file-item">
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1726

```text
                    <span>{file}</span>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1727

```text
                    <a href="/download{file_path}" download="{file}"><button class="download-btn">Download</button></a>
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1728

```text
                </div>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1729

```text
                """
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1730

```text
        else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1732

```text
            for subdir in subdirectories:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 1733

```text
                subdir_path = os.path.join(directory, subdir)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1734

```text
                files = os.listdir(subdir_path)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1735

```text
                sortedFiles = self.sortByTime(files, dateFormat)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1737

```text
                html_content += f"<h2>{subdir}</h2>"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1739

```text
                for file in sortedFiles:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 1741

```text
                    file_path = os.path.join('/', file)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1742

```text
                    html_content += f"""
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1743

```text
                    <div class="file-item">
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1744

```text
                        <span>{file}</span>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1745

```text
                        <a href="/download{file_path}" download="{file}"><button class="download-btn">Download</button></a>
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1746

```text
                    </div>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1747

```text
                    """
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1749

```text
        return html_content
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 1751

```text
    def do_POST(self):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 1752

```text
        loggedoutPaths = ['/login', '/signup', '/resetpassword', '/sdsanalog', '/sdsanalogfinished', '/denton18pump', '/denton18pumpfinished']
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1755

```text
        if not DEBUGMODE and self.path not in loggedoutPaths and not self.getCurrUser():
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1756

```text
            self.send_response(401)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1757

```text
            self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1758

```text
            self.wfile.write(b"Unauthorized access attempt.")
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1759

```text
            return
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1764

```text
        if not DEBUGMODE and not self.is_secureConnection():
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1765

```text
            self.redirect_to_https()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1766

```text
            return
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1769

```text
        if self.path == '/login':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1771

```text
            try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 1773

```text
                ctype, pdict = cgi.parse_header(self.headers.get('content-type'))
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1775

```text
                if ctype == 'multipart/form-data':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1776

```text
                    postvars = cgi.parse_multipart(self.rfile, pdict)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1778

```text
                elif ctype == 'application/x-www-form-urlencoded':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1779

```text
                    length = int(self.headers.get('content-length'))
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1780

```text
                    postData = self.rfile.read(length).decode('utf-8')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1781

```text
                    postvars = parse_qs(postData, keep_blank_values=1)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1782

```text
                else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1784

```text
                    postvars = {}
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1787

```text
                username = sanitize_input(postvars.get('username', [''])[0])
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1788

```text
                password = sanitize_input(postvars.get('password', [''])[0])
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1790

```text
                asyncio.run(self.handle_login(username, password))
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1792

```text
            except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 1794

```text
                print(e)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1798

```text
        elif self.path == '/signup':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1799

```text
            try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 1800

```text
                length = int(self.headers.get('content-length'))
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1801

```text
                postData = self.rfile.read(length).decode('utf-8')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1802

```text
                postvars = parse_qs(postData, keep_blank_values=1)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1805

```text
                username = sanitize_input(postvars.get('username', [''])[0])
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1806

```text
                password = sanitize_input(postvars.get('password', [''])[0])
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1807

```text
                uNID = sanitize_input(postvars.get('unid', [''])[0])
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1810

```text
                asyncio.run(self.handle_signup(username, password, uNID))
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1813

```text
            except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 1815

```text
                print(e)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1817

```text
            self.send_response(302)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1818

```text
            self.send_header('Location', '/login')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1819

```text
            self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1823

```text
        elif self.path == '/resetpassword':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1824

```text
            try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 1826

```text
                ctype, pdict = cgi.parse_header(self.headers.get('content-type'))
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1828

```text
                if ctype == 'multipart/form-data':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1829

```text
                    postvars = cgi.parse_multipart(self.rfile, pdict)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1831

```text
                elif ctype == 'application/x-www-form-urlencoded':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1832

```text
                    length = int(self.headers.get('content-length'))
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1833

```text
                    postData = self.rfile.read(length).decode('utf-8')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1834

```text
                    postvars = parse_qs(postData, keep_blank_values=1)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1835

```text
                else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1837

```text
                    postvars = {}
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1840

```text
                username = sanitize_input(postvars.get('username', [''])[0])
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1841

```text
                NewPassword = <redacted-secret-value>, [''])[0])
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1843

```text
                hashedNewPass = hash_password(NewPassword)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1844

```text
                uNID = sanitize_input(postvars.get('unid', [''])[0])
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1847

```text
                if verify_userUnid(username, uNID):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1848

```text
                    conn = sqlite3.connect('signininfo.db')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1849

```text
                    c = conn.cursor()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1850

```text
                    c.execute("UPDATE signininfo SET passwordHash = ? WHERE username = ?", (hashedNewPass, username))
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 1851

```text
                    conn.commit()
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 1852

```text
                    conn.close()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1854

```text
                    self.send_response(302)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1855

```text
                    self.send_header('Location', '/login')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1856

```text
                    self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1857

```text
                else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1859

```text
                    self.send_response(403)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1860

```text
                    self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1861

```text
                    self.wfile.write(b"Unauthorized access attempt.")
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1862

```text
            except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 1864

```text
                print(e)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1865

```text
        elif self.path == '/toggleAssign':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1867

```text
            currentUser = self.getCurrUser()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1870

```text
            if not currentUser or not isUserAdmin(currentUser):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1871

```text
                self.send_response(403)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1872

```text
                self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1873

```text
                self.wfile.write(b"Unauthorized access attempt.")
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1874

```text
                return
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1876

```text
            content_length = int(self.headers['Content-Length'])
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1877

```text
            post_data = self.rfile.read(content_length)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1878

```text
            user_data = json.loads(post_data.decode('utf-8'))
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1880

```text
            uNID = user_data['uNID']
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1881

```text
            self.toggleAssign(uNID)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1882

```text
            self.send_response(200)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1883

```text
            self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1884

```text
        elif self.path == '/deleteUser':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1886

```text
            currentUser = self.getCurrUser()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1889

```text
            if not currentUser or not isUserAdmin(currentUser):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1891

```text
                self.send_response(403)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1892

```text
                self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1893

```text
                self.wfile.write(b"Unauthorized access attempt.")
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1894

```text
                return
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1895

```text
            content_length = int(self.headers['Content-Length'])
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1896

```text
            post_data = self.rfile.read(content_length)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1897

```text
            user_data = json.loads(post_data.decode('utf-8'))
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1898

```text
            uNID = user_data['uNID']
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1900

```text
            self.deleteUser(uNID)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1901

```text
            self.send_response(200)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1902

```text
            self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1903

```text
        elif self.path == '/toggleAdminStatus':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1905

```text
            currentUser = self.getCurrUser()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1907

```text
            if not currentUser or not isUserAdmin(currentUser):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1909

```text
                self.send_response(403)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1910

```text
                self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1911

```text
                self.wfile.write(b"Unauthorized access attempt.")
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1912

```text
                return
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1913

```text
            content_length = int(self.headers['Content-Length'])
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1914

```text
            post_data = self.rfile.read(content_length)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1916

```text
            user_data = json.loads(post_data.decode('utf-8'))
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1917

```text
            uNID = user_data['uNID']
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1918

```text
            conn = sqlite3.connect('signininfo.db')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1919

```text
            c = conn.cursor()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1920

```text
            c.execute("SELECT isAdmin FROM signininfo WHERE uNID = ?", (uNID,))
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 1921

```text
            result = c.fetchone()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1922

```text
            if result:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1924

```text
                new_status = not result[0]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1925

```text
                c.execute("UPDATE signininfo SET isAdmin = ? WHERE uNID = ?", (new_status, uNID))
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 1926

```text
                conn.commit()
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 1927

```text
            conn.close()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1928

```text
            self.send_response(200)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1929

```text
            self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1930

```text
        elif self.path == '/createtasks':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1932

```text
            content_length = int(self.headers['Content-Length'])
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1933

```text
            post_data = self.rfile.read(content_length)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1936

```text
            environ = {'REQUEST_METHOD': 'POST'}
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1937

```text
            headers = {key: value if isinstance(value, str) else value.decode('utf-8') for key, value in self.headers.items()}
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1938

```text
            headers['Content-Length'] = str(content_length)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1941

```text
            data = json.loads(post_data.decode('utf-8'))
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1943

```text
            title = data.get('title')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1944

```text
            description = data.get('description')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1945

```text
            due_date = data.get('dueDate')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1946

```text
            priority = data.get('priority')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1947

```text
            assignees = data.get('assignees')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1950

```text
            if isinstance(assignees, str):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1951

```text
                assignees = [assignees]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1953

```text
            conn = sqlite3.connect('tasks.db')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1954

```text
            c = conn.cursor()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1956

```text
            assigner = self.getCurrUser() or 'Chadmin'
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1958

```text
            try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 1960

```text
                c.execute('''
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 1961

```text
                    INSERT INTO tasks (task_title, task_description, task_due_date, task_priority, task_assigner, task_status)
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 1962

```text
                    VALUES (?, ?, ?, ?, ?, ?)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1963

```text
                ''', (title, description, due_date, priority, assigner, 'Pending'))
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1965

```text
                task_id = c.lastrowid
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1968

```text
                for assignee in assignees:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 1969

```text
                    c.execute('''
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 1970

```text
                        INSERT INTO assignees (task_id, assignee_name)
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 1971

```text
                        VALUES (?, ?)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1972

```text
                    ''', (task_id, assignee))
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1974

```text
                conn.commit()
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 1976

```text
            except sqlite3.OperationalError as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 1977

```text
                print(f"SQLite error: {e}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1978

```text
            finally:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 1980

```text
                conn.close()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1983

```text
            self.send_response(302)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1984

```text
            self.send_header('Location', '/tasks')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1985

```text
            self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 1987

```text
        elif self.path == '/sdsanalog':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1990

```text
            content_length = int(self.headers['Content-Length'])
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1991

```text
            post_data = self.rfile.read(content_length)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 1994

```text
            content_type = self.headers.get('Content-Type', '')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 1996

```text
            if content_type == 'text/csv':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 1998

```text
                try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 1999

```text
                    csv_content = post_data.decode('utf-8')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2002

```text
                    session_id = self.headers.get('X-Session-ID')
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2003

```text
                    batch_number = self.headers.get('X-Batch-Number')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2004

```text
                    total_batches = self.headers.get('X-Total-Batches')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2005

```text
                    batch_points = self.headers.get('X-Batch-Points')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2006

```text
                    is_final_batch = self.headers.get('X-Is-Final-Batch', 'false').lower() == 'true'
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2008

```text
                    if not session_id or not batch_number or not total_batches:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2009

```text
                        self.send_response(400)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2010

```text
                        self.send_header('Content-type', 'application/json')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2011

```text
                        self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2012

```text
                        response = {'status': 'error', 'message': 'Missing session or batch headers'}
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2013

```text
                        self.wfile.write(json.dumps(response).encode('utf-8'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2014

```text
                        return
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2016

```text
                    batch_number = int(batch_number)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2017

```text
                    total_batches = int(total_batches)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2019

```text
                    print(f'Received batch {batch_number}/{total_batches} for session {session_id} with {batch_points} points')
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2022

```text
                    with MyServer.session_lock:
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2023

```text
                        if session_id not in MyServer.session_batches:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2024

```text
                            MyServer.session_batches[session_id] = {
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2025

```text
                                'total_batches': total_batches,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2026

```text
                                'batches': {},
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2027

```text
                                'start_time': datetime.now(),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2028

```text
                                'last_batch_time': datetime.now()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2029

```text
                            }
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2032

```text
                        MyServer.session_batches[session_id]['last_batch_time'] = datetime.now()
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2033

```text
                        MyServer.session_batches[session_id]['batches'][batch_number] = csv_content
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2036

```text
                        session_data = MyServer.session_batches[session_id]
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2037

```text
                        received_batches = len(session_data['batches'])
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2040

```text
                        if received_batches == total_batches or is_final_batch:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2042

```text
                            print(f"Session {session_id} complete: {received_batches}/{total_batches} batches")
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2043

```text
                            self.combine_csv_batches_final(session_id, cleanup_session=False)  # Don't cleanup yet
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2044

```text
                        else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2046

```text
                            time_since_start = datetime.now() - session_data['start_time']
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2047

```text
                            time_since_last = datetime.now() - session_data['last_batch_time']
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2050

```text
                            if time_since_start.total_seconds() > 14400 or time_since_last.total_seconds() > 600:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2051

```text
                                print(f"Session {session_id} timeout: saving partial data ({received_batches}/{total_batches} batches)")
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2052

```text
                                self.combine_csv_batches_final(session_id, cleanup_session=True)  # Cleanup on timeout
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2055

```text
                    self.send_response(200)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2056

```text
                    self.send_header('Content-type', 'application/json')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2057

```text
                    self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2058

```text
                    response = {
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2059

```text
                        'status': 'success',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2060

```text
                        'message': f'Batch {batch_number}/{total_batches} received for session {session_id}',
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2061

```text
                        'session_id': session_id
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2062

```text
                    }
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2063

```text
                    self.wfile.write(json.dumps(response).encode('utf-8'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2065

```text
                except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 2066

```text
                    print(f'Error processing CSV data: {e}')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2067

```text
                    self.send_response(500)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2068

```text
                    self.send_header('Content-type', 'application/json')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2069

```text
                    self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2070

```text
                    response = {'status': 'error', 'message': str(e)}
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2071

```text
                    self.wfile.write(json.dumps(response).encode('utf-8'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2073

```text
        elif self.path == '/sdsanalogfinished':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2074

```text
            """Handle session finalization and combine all batches with enhanced timestamp-based de-duplication"""
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2075

```text
            try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 2076

```text
                content_length = int(self.headers['Content-Length'])
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2077

```text
                if content_length > 0:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2078

```text
                    post_data = self.rfile.read(content_length)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2079

```text
                    try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 2080

```text
                        data = json.loads(post_data.decode('utf-8'))
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2081

```text
                        session_id = data.get('session_id')
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2082

```text
                    except:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 2083

```text
                        session_id = None
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2084

```text
                else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2085

```text
                    session_id = None
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2088

```text
                if not session_id:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2089

```text
                    session_id = self.headers.get('X-Session-ID')
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2091

```text
                print(f"Finalizing session: {session_id}")
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2093

```text
                if session_id:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2094

```text
                    with MyServer.session_lock:
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2095

```text
                        if session_id in MyServer.session_batches:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2096

```text
                            session_data = MyServer.session_batches[session_id]
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2097

```text
                            received_batches = len(session_data['batches'])
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2098

```text
                            total_batches = session_data['total_batches']
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2100

```text
                            print(f"Finalizing session {session_id}: combining {received_batches}/{total_batches} batches")
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2103

```text
                            self.combine_csv_batches_final(session_id, cleanup_session=False)
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2106

```text
                            timestamp_val = session_data['start_time'].strftime('%Y%m%d%H%M%S')
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2107

```text
                            combined_filename = f"{timestamp_val}_SDSLOG_combined_{session_id}.csv"
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2108

```text
                            combined_filepath = os.path.join('LogData', 'Paralyne', 'analog', combined_filename)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2110

```text
                            if os.path.exists(combined_filepath):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2111

```text
                                try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 2113

```text
                                    with open(combined_filepath, 'r', encoding='utf-8') as file:
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2114

```text
                                        lines = file.readlines()
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2116

```text
                                    if len(lines) <= 1:  # Only header or empty file
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2117

```text
                                        print(f"File {combined_filename} has no data to de-duplicate")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2118

```text
                                        response_message = f"Session {session_id} finalized with {received_batches}/{total_batches} batches combined (no data to de-duplicate)"
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2119

```text
                                    else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2121

```text
                                        header = lines[0].strip()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2122

```text
                                        data_lines = lines[1:]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2124

```text
                                        print(f"De-duplicating file: {len(data_lines)} total data lines before processing")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2127

```text
                                        unique_data = {}  # Dictionary to store unique entries by timestamp
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2128

```text
                                        duplicate_count = 0
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2130

```text
                                        for line in data_lines:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 2131

```text
                                            line = line.strip()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2132

```text
                                            if not line:  # Skip empty lines
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2133

```text
                                                continue
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2136

```text
                                            parts = line.split(',')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2137

```text
                                            if len(parts) >= 1:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2138

```text
                                                try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 2139

```text
                                                    timestamp = int(parts[0])  # Convert to int for proper comparison
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2142

```text
                                                    if timestamp not in unique_data:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2143

```text
                                                        unique_data[timestamp] = line
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2144

```text
                                                    else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2145

```text
                                                        duplicate_count += 1
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2146

```text
                                                        print(f"Duplicate timestamp found: {timestamp}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2147

```text
                                                except ValueError:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 2149

```text
                                                    print(f"Invalid timestamp format in line: {line[:50]}...")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2151

```text
                                                    unique_data[line] = line
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2154

```text
                                        sorted_timestamps = sorted([k for k in unique_data.keys() if isinstance(k, int)])
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2155

```text
                                        non_timestamp_keys = [k for k in unique_data.keys() if not isinstance(k, int)]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2158

```text
                                        with open(combined_filepath, 'w', encoding='utf-8', newline='') as file:
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2159

```text
                                            file.write(header + '\n')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2162

```text
                                            for timestamp in sorted_timestamps:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 2163

```text
                                                file.write(unique_data[timestamp] + '\n')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2166

```text
                                            for key in non_timestamp_keys:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 2167

```text
                                                file.write(unique_data[key] + '\n')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2169

```text
                                        final_count = len(unique_data)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2170

```text
                                        print(f"De-duplication complete: {final_count} unique entries, {duplicate_count} duplicates removed")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2171

```text
                                        response_message = f"Session {session_id} finalized with {received_batches}/{total_batches} batches combined and {duplicate_count} timestamp duplicates removed ({final_count} unique entries)"
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2173

```text
                                except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 2174

```text
                                    print(f"Error during de-duplication: {e}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2175

```text
                                    response_message = f"Session {session_id} finalized with {received_batches}/{total_batches} batches combined (de-duplication failed: {str(e)})"
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2176

```text
                            else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2177

```text
                                print(f"Combined file not found: {combined_filepath}")
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2178

```text
                                response_message = f"Session {session_id} finalized but combined file not found"
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2181

```text
                            del MyServer.session_batches[session_id]
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2182

```text
                            print(f"Session {session_id} cleaned up")
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2184

```text
                        else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2185

```text
                            response_message = f"Session {session_id} not found in active sessions"
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2186

```text
                            print(response_message)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2187

```text
                else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2188

```text
                    response_message = "No session ID provided for finalization"
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2189

```text
                    print(response_message)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2192

```text
                if MyServer.SDSLogFileLocation != '':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2193

```text
                    try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 2194

```text
                        if hasattr(self, 'SDSlogFile'):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2195

```text
                            self.SDSlogFile.close()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2196

```text
                        MyServer.SDSLogFileLocation = ''
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2197

```text
                        print("Legacy SDS log file closed")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2198

```text
                    except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 2199

```text
                        print(f"Error closing legacy log file: {e}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2202

```text
                self.send_response(200)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2203

```text
                self.send_header('Content-type', 'application/json')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2204

```text
                self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2205

```text
                response = {
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2206

```text
                    'status': 'session_finalized',
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2207

```text
                    'session_id': session_id,
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2208

```text
                    'message': response_message
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2209

```text
                }
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2210

```text
                self.wfile.write(json.dumps(response).encode('utf-8'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2212

```text
            except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 2213

```text
                print(f"Error finalizing session: {e}")
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2214

```text
                self.send_response(500)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2215

```text
                self.send_header('Content-type', 'application/json')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2216

```text
                self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2217

```text
                response = {'status': 'error', 'message': str(e)}
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2218

```text
                self.wfile.write(json.dumps(response).encode('utf-8'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2221

```text
        elif self.path == '/denton18pump':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2223

```text
            content_length = int(self.headers['Content-Length'])
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2224

```text
            post_data = self.rfile.read(content_length)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2227

```text
            data = json.loads(post_data)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2228

```text
            pressureVal = data.get('pressure')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2233

```text
            if MyServer.Denton18LogFileLocation == '':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2237

```text
                timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2238

```text
                filename = f"{timestamp}_DENTON1PUMPLOG.csv"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2239

```text
                filename = os.path.join('LogData', 'denton18', 'pumpdata', filename)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2241

```text
                self.Denton18pumplogFile = open(filename, 'a', newline='')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2242

```text
                self.Denton18pumpWriter = csv.writer(self.Denton18pumplogFile)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2244

```text
                self.Denton18pumpWriter.writerow(['Timestamp', 'Vacuum pressure'])
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2248

```text
                MyServer.Denton18pumpWriter = filename
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2249

```text
            else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2251

```text
                self.Denton18pumplogFile = open(MyServer.Denton18LogFileLocation, 'a', newline='')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2252

```text
                self.Denton18pumpWriter = csv.writer(self.Denton18pumplogFile)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2255

```text
            runningTimestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2257

```text
            pressureVal = pressureVal/65535.0 * 3.3 * 3.0 /0.009
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2260

```text
            self.Denton18pumpWriter.writerow([runningTimestamp, pressureVal])
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2261

```text
            self.Denton18pumplogFile.flush()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2264

```text
            self.send_response(200)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2265

```text
            self.send_header('Content-type', 'application/json')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2266

```text
            self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2267

```text
            response = {'status': 'success'}
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2268

```text
            self.wfile.write(json.dumps(response).encode('utf-8'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2270

```text
        elif self.path == '/denton18pumpfinished':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2272

```text
            if MyServer.Denton18LogFileLocation != '':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2274

```text
                self.Denton18pumplogFile = open(MyServer.Denton18LogFileLocation, 'a', newline='')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2275

```text
                self.Denton18pumplogFile.close()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2277

```text
                MyServer.Denton18LogFileLocation = ''
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2279

```text
                self.send_response(200)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2280

```text
                self.send_header('Content-type', 'application/json')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2281

```text
                self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2282

```text
                response = {'status': 'file closed'}
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2283

```text
                self.wfile.write(json.dumps(response).encode('utf-8'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2284

```text
            else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2286

```text
                self.send_response(400)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2287

```text
                self.send_header('Content-type', 'application/json')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2288

```text
                self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2289

```text
                response = {'status': 'no file to close'}
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2290

```text
                self.wfile.write(json.dumps(response).encode('utf-8'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2292

```text
        elif self.path == '/changestatus':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2294

```text
            content_length = int(self.headers['Content-Length'])
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2295

```text
            post_data = self.rfile.read(content_length)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2297

```text
            data = json.loads(post_data)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2298

```text
            task_id = data.get('taskId')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2299

```text
            self.change_task_status(task_id)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2301

```text
            self.send_response(200)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2302

```text
            self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2303

```text
        elif self.path == '/uploadtaskfile':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2305

```text
            content_type, pdict = cgi.parse_header(self.headers.get('content-type'))
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2307

```text
            if content_type == 'multipart/form-data':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2308

```text
                pdict['boundary'] = bytes(pdict['boundary'], 'utf-8')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2309

```text
                form = cgi.FieldStorage(fp=self.rfile, headers=self.headers, environ={'REQUEST_METHOD': 'POST'}, keep_blank_values=True)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2312

```text
                task_id = form['task_id'].value
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2313

```text
                file_item = form['file']
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2316

```text
                if file_item.filename.endswith(('.txt', '.pdf', '.csv', '.png', '.jpg', '.jpeg', '.doc', '.docx', '.xls', '.xlsx')):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2318

```text
                    self.handle_file_upload(task_id, file_item)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2319

```text
                    self.send_response(200)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2320

```text
                    self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2321

```text
                else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2323

```text
                    self.send_response(400)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2324

```text
                    self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2325

```text
                    self.wfile.write(b'No file uploaded or incorrect filetype uploaded.')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2326

```text
            else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2328

```text
                self.send_response(400)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2329

```text
                self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2330

```text
                self.wfile.write(b'Invalid content type.')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2331

```text
        elif self.path == '/claimTask':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2333

```text
            content_length = int(self.headers['Content-Length'])
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2334

```text
            post_data = self.rfile.read(content_length)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2336

```text
            data = json.loads(post_data)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2337

```text
            task_id = data.get('taskId')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2339

```text
            user = self.getCurrUser()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2340

```text
            if user is None:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2342

```text
                self.send_response(403)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2343

```text
                self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2344

```text
                self.wfile.write(b'Unauthorized access attempt.')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2345

```text
                return
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2347

```text
            self.claimTask(task_id, user)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2348

```text
            self.send_response(200)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2349

```text
            self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2350

```text
            self.wfile.write(b'Task claimed.')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2351

```text
        elif self.path == '/submitALDData':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2355

```text
            content_length = int(self.headers['Content-Length'])
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2356

```text
            post_data = self.rfile.read(content_length).decode('utf-8')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2359

```text
            post_data = parse_qs(post_data)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2360

```text
            material = post_data['material'][0]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2361

```text
            depmode = post_data['depmode'][0]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2362

```text
            chuckTemp = post_data['temp'][0]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2365

```text
            if material and depmode and chuckTemp:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2366

```text
                chuckTemp = int(chuckTemp)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2368

```text
                df = self.getMachineData('ALD')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2369

```text
                if df is not None:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2371

```text
                    filteredDF = df[(df['Film Deposited'] == material) &
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2372

```text
                                    (df['Deposition Mode'] == depmode) &
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2373

```text
                                    (df['Chuck Temperature (C)'] == chuckTemp)]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2374

```text
                    if not filteredDF.empty:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2376

```text
                        filteredDF['Deposition Rate'] = filteredDF['Measured Thickness (nm)'] / filteredDF['Number of Cycles']
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2379

```text
                        filteredDF['Deposition Rate'] = filteredDF['Deposition Rate'].fillna(0)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2381

```text
                        depoRate = filteredDF['Deposition Rate'].tolist()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2383

```text
                        labels = list(range(1, len(depoRate) + 1))
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2385

```text
                        self.send_response(200)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2386

```text
                        self.send_header('Content-type', 'text/html')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2387

```text
                        self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2392

```text
                        html_response = """
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2393

```text
                        <html>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2394

```text
                        <head>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2395

```text
                            <title>Deposition Rate Graph</title>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2396

```text
                            <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2397

```text
                            <script src="/js/graph.js"></script>
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2398

```text
                        </head>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2399

```text
                        <body>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2400

```text
                            <h2>Deposition Rate Over Time</h2>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2401

```text
                            <canvas id="depositionRateGraph"></canvas>
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2402

```text
                            <script>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2403

```text
                                var graphData = {
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2404

```text
                                    labels: """ + json.dumps(labels) + """,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2405

```text
                                    datasets: [{
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2406

```text
                                        label: 'Deposition Rate (nm/cycle)',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2407

```text
                                        data: """ + json.dumps(depoRate) + """,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2408

```text
                                        borderColor: 'rgba(75, 192, 192, 1)',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2409

```text
                                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2410

```text
                                        fill: false
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2411

```text
                                    }]
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2412

```text
                                };
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2413

```text
                                generateLineGraph('depositionRateGraph', graphData);
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2414

```text
                            </script>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2415

```text
                        </body>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2416

```text
                        </html>
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2417

```text
                        """
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2419

```text
                        self.wfile.write(html_response.encode('utf-8'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2420

```text
            else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2422

```text
                self.send_response(404)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2423

```text
                self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2424

```text
                self.wfile.write(b'Data not found.')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2426

```text
        elif self.path == '/getChartCount':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2427

```text
            content_length = int(self.headers['Content-Length'])
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2428

```text
            post_data = self.rfile.read(content_length).decode('utf-8')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2429

```text
            post_data = parse_qs(post_data)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2432

```text
            print("Parsed data:", post_data)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2434

```text
            material = post_data.get('material', [None])[0]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2435

```text
            depmode = post_data.get('depmode', [None])[0]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2436

```text
            temp = int(post_data.get('temp', [0])[0])
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2438

```text
            if material is None or depmode is None or temp == 0:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2439

```text
                self.send_response(400)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2440

```text
                self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2441

```text
                self.wfile.write(b'Missing required parameters.')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2442

```text
                return
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2445

```text
            df = pd.read_csv('HSCDATA/small_ALD_DataCollection.csv')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2446

```text
            count = len(df[(df['Film Deposited'] == material) & (df['Deposition Mode'] == depmode) & (df['Chuck Temperature (C)'] == temp)])
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2449

```text
            self.send_response(200)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2450

```text
            self.send_header("Content-type", "text/plain")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2451

```text
            self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2452

```text
            self.wfile.write(str(count).encode('utf-8'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2453

```text
        else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2455

```text
            self.send_response(400)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2456

```text
            self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2457

```text
            self.wfile.write(b'Invalid input.')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2459

```text
    def serve_paralyne_analog_files(self):
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 2460

```text
        """
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2461

```text
        Serve Paralyne analog files without authentication.
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2462

```text
        Endpoints:
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2463

```text
        - GET /api/paralyne/analog/list - List all files
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2464

```text
        - GET /api/paralyne/analog/download/<filename> - Download specific file
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2465

```text
        """
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2466

```text
        try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 2467

```text
            path_parts = self.path.split('/')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2469

```text
            if len(path_parts) < 4:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2470

```text
                self.send_response(400)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2471

```text
                self.send_header('Content-type', 'application/json')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2472

```text
                self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2473

```text
                response = {'error': 'Invalid API path'}
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2474

```text
                self.wfile.write(json.dumps(response).encode('utf-8'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2475

```text
                return
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2477

```text
            action = path_parts[4] if len(path_parts) > 4 else 'list'
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2480

```text
            directory_path = os.path.join('LogData', 'Paralyne', 'analog')
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2482

```text
            if not os.path.exists(directory_path):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2483

```text
                self.send_response(404)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2484

```text
                self.send_header('Content-type', 'application/json')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2485

```text
                self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2486

```text
                response = {'error': 'Directory not found'}
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2487

```text
                self.wfile.write(json.dumps(response).encode('utf-8'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2488

```text
                return
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2490

```text
            if action == 'list':
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2492

```text
                try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 2493

```text
                    files = os.listdir(directory_path)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2495

```text
                    csv_files = [f for f in files if f.endswith('.csv')]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2497

```text
                    file_info = []
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2498

```text
                    for file in csv_files:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 2499

```text
                        file_path = os.path.join(directory_path, file)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2500

```text
                        stat = os.stat(file_path)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2501

```text
                        file_info.append({
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2502

```text
                            'filename': file,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2503

```text
                            'size': stat.st_size,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2504

```text
                            'modified': datetime.fromtimestamp(stat.st_mtime).isoformat(),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2505

```text
                            'download_url': f'/api/paralyne/analog/download/{file}'
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2506

```text
                        })
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2509

```text
                    file_info.sort(key=lambda x: x['modified'], reverse=True)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2511

```text
                    self.send_response(200)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2512

```text
                    self.send_header('Content-type', 'application/json')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2513

```text
                    self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2514

```text
                    response = {
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2515

```text
                        'status': 'success',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2516

```text
                        'files': file_info,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2517

```text
                        'count': len(file_info)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2518

```text
                    }
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2519

```text
                    self.wfile.write(json.dumps(response).encode('utf-8'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2521

```text
                except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 2522

```text
                    self.send_response(500)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2523

```text
                    self.send_header('Content-type', 'application/json')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2524

```text
                    self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2525

```text
                    response = {'error': f'Failed to list files: {str(e)}'}
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2526

```text
                    self.wfile.write(json.dumps(response).encode('utf-8'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2528

```text
            elif action == 'download' and len(path_parts) > 5:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2530

```text
                filename = urllib.parse.unquote(path_parts[5])
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2531

```text
                file_path = os.path.join(directory_path, filename)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2534

```text
                if '..' in filename or '/' in filename or '\\' in filename:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2535

```text
                    self.send_response(400)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2536

```text
                    self.send_header('Content-type', 'application/json')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2537

```text
                    self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2538

```text
                    response = {'error': 'Invalid filename'}
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2539

```text
                    self.wfile.write(json.dumps(response).encode('utf-8'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2540

```text
                    return
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2542

```text
                if os.path.isfile(file_path) and filename.endswith('.csv'):
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2543

```text
                    try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 2544

```text
                        self.send_response(200)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2545

```text
                        self.send_header('Content-type', 'text/csv')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2546

```text
                        self.send_header('Content-Disposition', f'attachment; filename="{filename}"')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2547

```text
                        self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2549

```text
                        with open(file_path, 'rb') as file:
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2550

```text
                            self.wfile.write(file.read())
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2552

```text
                    except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 2553

```text
                        self.send_response(500)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2554

```text
                        self.send_header('Content-type', 'application/json')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2555

```text
                        self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2556

```text
                        response = {'error': f'Failed to read file: {str(e)}'}
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2557

```text
                        self.wfile.write(json.dumps(response).encode('utf-8'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2558

```text
                else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2559

```text
                    self.send_response(404)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2560

```text
                    self.send_header('Content-type', 'application/json')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2561

```text
                    self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2562

```text
                    response = {'error': 'File not found'}
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2563

```text
                    self.wfile.write(json.dumps(response).encode('utf-8'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2565

```text
            else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2566

```text
                self.send_response(400)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2567

```text
                self.send_header('Content-type', 'application/json')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2568

```text
                self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2569

```text
                response = {'error': 'Invalid action. Use "list" or "download/<filename>"'}
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2570

```text
                self.wfile.write(json.dumps(response).encode('utf-8'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2572

```text
        except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 2573

```text
            print(f"Error in serve_paralyne_analog_files: {e}")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2574

```text
            self.send_response(500)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2575

```text
            self.send_header('Content-type', 'application/json')
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2576

```text
            self.end_headers()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2577

```text
            response = {'error': 'Internal server error'}
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2578

```text
            self.wfile.write(json.dumps(response).encode('utf-8'))
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2580

```text
def cleanup_old_sessions():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 2581

```text
    """Clean up sessions that are older than 10 hours"""
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2582

```text
    try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 2583

```text
        with MyServer.session_lock:
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2584

```text
            current_time = datetime.now()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2585

```text
            sessions_to_remove = []
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2587

```text
            for session_id, session_data in MyServer.session_batches.items():
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 2588

```text
                time_since_start = current_time - session_data['start_time']
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2589

```text
                if time_since_start.total_seconds() > 36000:  # 10 hours
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2590

```text
                    print(f"Cleaning up old session {session_id}")
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2591

```text
                    sessions_to_remove.append(session_id)
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2593

```text
            for session_id in sessions_to_remove:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 2595

```text
                if MyServer.session_batches[session_id]['batches']:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2596

```text
                    print(f"Saving partial data for expired session {session_id}")
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2598

```text
                    temp_server = type('TempServer', (), {})()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2599

```text
                    temp_server.combine_csv_batches = MyServer.combine_csv_batches.__func__
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2600

```text
                    temp_server.combine_csv_batches(temp_server, session_id)
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2601

```text
                else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2602

```text
                    del MyServer.session_batches[session_id]
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2604

```text
    except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 2605

```text
        print(f"Error during session cleanup: {e}")
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2607

```text
def start_cleanup_thread():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 2608

```text
    """Start a background thread to clean up old sessions"""
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2609

```text
    def cleanup_loop():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 2610

```text
        while True:
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 2611

```text
            time.sleep(1800)  # Run every 30 minutes
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2612

```text
            cleanup_old_sessions()
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2614

```text
    cleanup_thread = threading.Thread(target=cleanup_loop, daemon=True)
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2615

```text
    cleanup_thread.start()
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2620

```text
if __name__ == "__main__":
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2622

```text
    create_db() #ensures user DB is created
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2623

```text
    create_session_db() #ensures session DB is created
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 2624

```text
    create_task_db() #ensures task DB is created
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2627

```text
    start_cleanup_thread()
```

`filesystem` — This filesystem line touches paths, files, directories, or subprocesses. Preserve relative-vs-absolute path assumptions, permissions, encoding, missing-file behavior, overwrite policy, and cleanup behavior; edge cases include stale symlinks, spaces in paths, locked files, and partial writes.

### Line 2630

```text
    if DEBUGMODE:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2631

```text
        hostName = "localhost"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2632

```text
        PORT = 443
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2633

```text
    else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2634

```text
        hostName = "155.98.11.8"
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2635

```text
        PORT = 443
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2638

```text
    httpd = HTTPServer((hostName, PORT), MyServer)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2640

```text
    if not DEBUGMODE:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2641

```text
        context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2642

```text
        context.load_cert_chain(certfile='/etc/letsencrypt/live/nfhistory.nanofab.utah.edu/cert.pem',
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2643

```text
                                keyfile='/etc/letsencrypt/live/nfhistory.nanofab.utah.edu/privkey.pem')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2644

```text
    else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 2645

```text
        context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2646

```text
        context.load_cert_chain(certfile='C:\\Users\\Phe\\cert.pem',
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2647

```text
                                keyfile='C:\\Users\\Phe\\key.pem')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2650

```text
    httpd.socket = context.wrap_socket(httpd.socket, server_side=True)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 2653

```text
    print("Server started https://%s:%s" % (hostName, PORT))
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2656

```text
    try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 2657

```text
        httpd.serve_forever()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2658

```text
    except KeyboardInterrupt:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 2660

```text
        pass
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2663

```text
    httpd.server_close()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2664

```text
    print("Server stopped.")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.



## Edge-Case Matrix For This File

1. **Empty Input**: When recreating `UNanofabTools/HSCDisplayerServer.py`, test the `empty input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
2. **Single Input**: When recreating `UNanofabTools/HSCDisplayerServer.py`, test the `single input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
3. **Large Input**: When recreating `UNanofabTools/HSCDisplayerServer.py`, test the `large input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
4. **Duplicate Input**: When recreating `UNanofabTools/HSCDisplayerServer.py`, test the `duplicate input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
5. **Malformed Input**: When recreating `UNanofabTools/HSCDisplayerServer.py`, test the `malformed input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
6. **Missing File**: When recreating `UNanofabTools/HSCDisplayerServer.py`, test the `missing file` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
7. **Permission Denied**: When recreating `UNanofabTools/HSCDisplayerServer.py`, test the `permission denied` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
8. **Network Timeout**: When recreating `UNanofabTools/HSCDisplayerServer.py`, test the `network timeout` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
9. **Stale Credential**: When recreating `UNanofabTools/HSCDisplayerServer.py`, test the `stale credential` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
10. **Rotated Secret**: When recreating `UNanofabTools/HSCDisplayerServer.py`, test the `rotated secret` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
11. **Schema Drift**: When recreating `UNanofabTools/HSCDisplayerServer.py`, test the `schema drift` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
12. **Partial Database Write**: When recreating `UNanofabTools/HSCDisplayerServer.py`, test the `partial database write` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
13. **Concurrent Request**: When recreating `UNanofabTools/HSCDisplayerServer.py`, test the `concurrent request` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
14. **Browser Refresh**: When recreating `UNanofabTools/HSCDisplayerServer.py`, test the `browser refresh` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
15. **Double Submit**: When recreating `UNanofabTools/HSCDisplayerServer.py`, test the `double submit` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
16. **Stale Tmux Session**: When recreating `UNanofabTools/HSCDisplayerServer.py`, test the `stale tmux session` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
17. **Wrong Working Directory**: When recreating `UNanofabTools/HSCDisplayerServer.py`, test the `wrong working directory` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
18. **Wrong User Account**: When recreating `UNanofabTools/HSCDisplayerServer.py`, test the `wrong user account` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
19. **University It Boundary**: When recreating `UNanofabTools/HSCDisplayerServer.py`, test the `University IT boundary` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
20. **Backup Restore**: When recreating `UNanofabTools/HSCDisplayerServer.py`, test the `backup restore` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
21. **Disk Pressure**: When recreating `UNanofabTools/HSCDisplayerServer.py`, test the `disk pressure` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
22. **Old Source Copy**: When recreating `UNanofabTools/HSCDisplayerServer.py`, test the `old source copy` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
23. **Production Versus Development Configuration**: When recreating `UNanofabTools/HSCDisplayerServer.py`, test the `production versus development configuration` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
24. **Redacted Secret Reconstruction**: When recreating `UNanofabTools/HSCDisplayerServer.py`, test the `redacted secret reconstruction` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
