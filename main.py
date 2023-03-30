# This is the server whereby Flask will run all the files.

# import flask | redirect user to a web page | url_for is used for creating a URL
# to prevent the overhead of having to change URLs
# throughout the application (including in templates)
from fileinput import filename
from os import abort, remove
from flask import Flask, redirect, url_for, request, render_template
from flask_socketio import SocketIO, emit, join_room, leave_room
from threading import Lock, Thread #used for threading th saving process
from queue import Queue # similar to threading but to make a queue for saving

import secrets, json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'MLPQlLg9afWMbBsbAAAB'
socketio = SocketIO(app)


# =========================================>
# players choice page
@app.route('/player/')
def player():
    return render_template('player-choice.html')


# THIS WAS CREATED BECAUSE THE PLAYER CHOICE PAGE DOESN'T OPEN THE DASHBOARD USING
# /templates/dashboard-welcome.html THAT IS STATED IN THE player-choice.js FILE.
# THIS NEEDS TO BE FIXED. ===>
# =======>
# @app.route('/player-open-dashboard/')
# def player_open_dashboard():
#     return render_template('dashboard-welcome.html')          <======================================

# prep for rooms
user_key = ""
# setup for a dictionary or room details
rooms = {}

# makes room codes


def generate_room_code():
    return secrets.token_hex(5)


@socketio.on('connect')
def handle_connect():
    # Generate a unique user key for this client
    user_key = request.sid
    print('Client connected: '+user_key)

    # Send the user key back to the client
    emit('user_key', user_key)

    # creates a file for the user using their specific user key
    filename = f"datastorage/{user_key}.json"
    with open(filename, 'w') as f:
        f.write("")
    f.close()

    # Join the default room for this client
    join_room(user_key)


@socketio.on('disconnect')
def handle_disconnect():
    # Get the user key for this client
    user_key = request.sid
    print('Client disconnected: '+user_key)

    # removes the file that was created for the user
    filename = f"datastorage/{user_key}.json"
    remove(filename)

    # Leave the default room for this client
    leave_room(user_key)


@socketio.on('create')
def create_room(data):
    room = data['room']
    join_room(user_key)
    socketio.emit('status', {'msg': 'User has created and entered the room.', 'room': room}, room=room)

@socketio.on('join')
def join_room(data):
    room = data['room']
    join_room(room)
    socketio.emit('status', {'msg': 'User has entered the room.', 'room': room}, room=room)

@socketio.on('leave')
def leave_room(data):
    room = data['room']
    leave_room(room)
    socketio.emit('status', {'msg': 'User has left the room.', 'room': room}, room=room)


@socketio.on_error()        # Handles the default namespace
def error_handler(e):
    pass


@socketio.on_error_default  # handles all namespaces without an explicit error handler
def default_error_handler(e):
    pass

# will be used if they user gets the wrong answer in the challeneg card (1 dice used)
@socketio.on('diceroll2')
def handle_dice_roll1(data):
    # Extract the dice roll values from the data dictionary
    dice_one, dice_two, hours_from_selected = data['diceRollValues']

    # Convert the selected hours format to an integer
    new_hours_format = int(hours_from_selected.replace("hrs", ""))

    # Calculate the new hours by subtracting the dice roll values from the selected hours
    new_hours = new_hours_format-(int(dice_one)+int(dice_two))
    if new_hours <= 0:
        new_hours = 0
    # Convert the new hours back to a string
    new_hours_text = str(new_hours)

    # Emit the new hours text to the client
    socketio.emit('new_hours', {'newHoursText': new_hours_text})

# will be used if they user gets the right answer in the challeneg card (2 dice used)
@socketio.on('diceroll1')
def handle_dice_roll2(data):
    # Extract the dice roll values from the data dictionary
    dice_one, hours_from_selected = data['diceRollValues']

    # Convert the selected hours format to an integer
    new_hours_format = int(hours_from_selected.replace("hrs", ""))

    # Calculate the new hours by subtracting the dice roll values from the selected hours
    new_hours = new_hours_format-(int(dice_one))
    if new_hours <= 0:
        new_hours = 0
    # Convert the new hours back to a string
    new_hours_text = str(new_hours)

    # Emit the new hours text to the client
    socketio.emit('new_hours', {'newHoursText': new_hours_text})

# home page
@app.route('/')
@app.route('/home/')
def home():
    return render_template('home.html')


# home page continuation ('Learn More')
@app.route('/home-learn-more/')
def home2():
    return render_template('home2.html')


# dashboard-welcome page
@app.route('/dashboard-welcome/')
def dashboardWelcome():
    return render_template('dashboard-welcome.html')


# dashboard page
@app.route('/dashboard/', methods=['GET', 'POST'])
def dashboard():
    if request.method == 'POST':
        hours_for_selected = request.form['hours']
        return render_template('dashboard.html', hours=hours_for_selected)
    else:

        return render_template('dashboard.html')


# notes page
@app.route('/dashboard/notes', methods=['GET', 'POST'])
def notes():
    if request.method == 'POST':
        notes_title = request.form['notes_title']
        notes_content = request.form['notes_content']
        return render_template('Notes.html', notes=notes_content, title=notes_title)
    else:
        return render_template('Notes.html')


# Room Creation
@app.route('/dashboard/teams/create', methods=['GET', 'POST'])
def create():
    if request.method == 'POST':
        # Get the room name from the request data
        room_name = request.form['room_name']
        user_name = request.form['user_name']
        # Generate a unique room code
        room_code = generate_room_code()

        # Add the room to the rooms dictionary
        rooms[room_code] = {
            'name': room_name,
            'users': {user_name},
        }
        print(str(rooms))
        # Return the room code to the user
        return render_template('Teams.html', room_name=room_name, room_code=room_code)
    else:
        return render_template('Teams.html')


# Join Room
@app.route('/dashboard/teams/join', methods=['GET', 'POST'])
def join():
    # If the request method is POST, extract the room code and username from the request arguments
    if request.method == 'POST':
        room_code = request.form['room_code']
        username = request.form['username']

        # If the room code is in the dictionary of rooms
        if room_code in rooms:
            # Check if the username is not already in the list of users in the room
            if username not in rooms[room_code]['users']:
                # Use Flask's join_room function to add the user to the room
                print("Joined Room:" + room_code)
                join_room(room_code)
                
                # Add the username to the list of users in the room
                rooms[room_code]['users'].add(username)
                # Render the join template with a success message
                return render_template('Teams.html', room_code=room_code, username=username, message=f"You joined room {room_code} as {username}.")
            else:
                # Render the join template with a message indicating the user is already in the room
                return render_template('Teams.html', room_code=room_code, username=username, message=f"You are already in room {room_code}.")
        else:
            # Render the join template with a message indicating the room does not exist
            return render_template('Teams.html', room_code=room_code, username=username, message=f"Room {room_code} does not exist.")

    else:
        # If the request method is GET, render the join template
        return render_template('Teams.html')

# INFO: This is the code for file saving and reading for the cards
# handle JSON data


# creates a new Queue object and Lock object to allow for queueing of data to be saved
# this will hold the data to be saved to the JSON files until the thread can save it
saveQueue = Queue()
# this will be used to lock the queue so that only one thread can access it at a time to prevent data loss
queueLock = Lock()

# used to process all of the data in the queue and save it to the JSON files
def processQueue():
    print("Starting queue processing thread") # to validate the thread is running
    while True: # loop forever
        with queueLock: # lock the queue so that only one thread can access it at a time
            if not saveQueue.empty(): # if there is data in the queue
                data = saveQueue.get() # get the data from the queue
            else:
                socketio.sleep(1) # if there is no data in the queue, wait 0.1 seconds and check again
                #time.sleep(0.1) # if there is a problem with the socketio.sleep function and it waits too long then switch to this. should be fine though
                continue
        # assign the vars to the their appropriate values - raw data and the client ID
        dataToSaveRAW = data["cardInfo"]
        clientID = data["socketid"]
        #assign the standard file path to the variable with the client ID appended in the middle
        filePath = 'datastorage/'+clientID+'.json'
        
        # print("saving data: " + str(dataToSaveRAW)) #troubleshooting print statement
        try:
            # file handling - open the file, read the data, close the file
            with open(filePath, 'r') as rJson:
                fileContent = json.load(rJson)
                rJson.close()
            # append the new data to the old file data
            fileContent.append(dataToSaveRAW)
            # file handling - open the file, write the data, close the file
            with open(filePath, 'w') as wJson:
                json.dump(fileContent, wJson, indent=4)
                wJson.close()
        except:
            # if the file is empty then create a new list and append the data to it
            print("No data in file. Creating blank variable.")
            fileContent = []
                
            fileContent.append(dataToSaveRAW)
            with open(filePath, 'w') as wJson:
                json.dump(fileContent, wJson, indent=4)
                wJson.close()
# start the queue processing thread - this will run in the background and save the data to the JSON files (processQueue is the name of the function that is above that will actually process the requests for saving)
Thread(target=processQueue).start()            

# if the client requests the JSON data, send it to them (their socket id should be passed in the request so that the correct file can be read)
@socketio.on('jsonRead')
def read_json(sid):
    with open('datastorage/'+sid+'.json', 'r') as f:
        data = json.load(f) # load the data from the file into the var data
        socketio.emit("recieveJson", data)#send the data to the client

# if the client sends data to be saved, add it to the queue to be saved
@socketio.on('jsonSave')
def save_json(data, sid): # DO NOT CHANGE "SID" - it will break and i dont know why yet)
    # print("adding " + str(data["socketid"]) + " to save queue") # troubleshooting print statement
    with queueLock: # blocks more than one thread from accessing the queue at a time
        saveQueue.put(data) # add the data to the queue
            
    # read_json()


if __name__ == '__main__':
    # CHANGE BACK TO socketio.run(app) IF NOT WORKING
    socketio.run(app, debug=True, port=5000, host='0.0.0.0')