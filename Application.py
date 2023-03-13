# This is the server whereby Flask will run all the files.

# import flask | redirect user to a web page | url_for is used for creating a URL
# to prevent the overhead of having to change URLs
# throughout the application (including in templates)
from fileinput import filename
from os import abort
from flask import Flask, redirect, url_for, request, render_template

app = Flask(__name__)

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
@app.route('/dashboard/')
def dashboard():
    return render_template('dashboard.html')

# notes page
@app.route('/dashboard/notes')
def notes():
    return render_template('Notes.html')

# rules page
@app.route('/dashboard/rules')
def rules():
    return render_template('Rules.html')

# teams page
@app.route('/dashboard/teams')
def teams():
    return render_template('Teams.html')