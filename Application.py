from flask import Flask, redirect, url_for, request, render_template
from flask_socketio import SocketIO, emit, join_room, leave_room
import secrets, json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'MLPQlLg9afWMbBsbAAAB'
socketio = SocketIO(app)


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

    # Join the default room for this client
    join_room(user_key)


@socketio.on('disconnect')
def handle_disconnect():
    # Get the user key for this client
    user_key = request.sid
    print('Client disconnected: '+user_key)

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


@socketio.on('diceroll')
def handle_dice_roll(data):
    # Extract the dice roll values from the data dictionary
    dice_one, dice_two, hours_from_selected = data['diceRollValues']

    # Convert the selected hours format to an integer
    new_hours_format = int(hours_from_selected.replace("hrs", ""))

    # Calculate the new hours by subtracting the dice roll values from the selected hours
    new_hours = new_hours_format-(int(dice_one)+int(dice_two))

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


# players choice page
@app.route('/player/')
def player():
    return render_template('player-choice.html')


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


# rules page
@app.route('/dashboard/rules')
def rules():
    return render_template('Rules.html')


# teams page
@app.route('/dashboard/teams')
def teams():
    return render_template('Teams.html')


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


# handle JSON data
@app.route('/save-json', methods=['POST'])
def save_json():
    data = request.get_json()
    with open('data.json', 'w') as f:
        json.dump(data, f)
    return jsonify({'message': 'Data saved successfully.'})

@app.route('/read-json', methods=['GET'])
def read_json():
    with open('data.json', 'r') as f:
        data = json.load(f)
    return jsonify(data)

if __name__ == '__main__':
    # CHANGE BACK TO socketio.run(app) IF NOT WORKING
    socketio.run(app, debug=True, port=5000, host='0.0.0.0')