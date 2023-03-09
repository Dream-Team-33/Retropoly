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

# dashboard page
@app.route('/dashboard/')
def dashboard():
    return render_template('dashboard-welcome.html')