# This is the server whereby Flask will run all the files.

# import flask | redirect user to a web page | url_for is used for creating a URL
# to prevent the overhead of having to change URLs
# throughout the application (including in templates)
from fileinput import filename
from os import abort
from flask import Flask, redirect, url_for, request, render_template
from flask_socketio import SocketIO, emit


app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def test_disconnect():
    print('Client disconnected')

@socketio.on_error()        # Handles the default namespace
def error_handler(e):
    pass

@socketio.on_error_default  # handles all namespaces without an explicit error handler
def default_error_handler(e):
    pass

@socketio.on('diceroll')
def handle_dice_roll(data):
    dice_one, dice_two = data['diceRollValues']

    print("dice rolled :"+str(dice_one)+" and "+str(dice_two))



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
@app.route('/dashboard/', methods=['GET','POST'])
def dashboard():
    if request.method == 'POST':
        hours_for_selected = request.form['hours']
        return render_template('dashboard.html', hours=hours_for_selected)
    else:
        
        return render_template('dashboard.html')

# notes page
@app.route('/dashboard/notes', methods=['GET','POST'])
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

if __name__ == '__main__':
    socketio.run(app)