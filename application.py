import os

from flask import Flask, sessions, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

#initializes global variables
channel_list = ['Select a Channel','General']
currentChannel = ""

#when the page is loaded, pass the channel_list variable to index.html
@app.route("/")
def index():
    return render_template("index.html", channel_list=channel_list)

#when the url is "changed" to /hello the greeting string
#is passed through the html form and executes the following code
@app.route("/hello", methods=["POST"])
def hello():
    greeting = request.form.get("greeting")
    return greeting

#when the url is "changed" to /newChannel the channel string
#is passed through the html form and executes the following code
@app.route("/newChannel", methods=["POST"])
def newChannel():
    channel = request.form.get("channel")
    channel_list.append(channel)
    return channel

#when the url is "changed" to /SOMECHANNEL the channel string
#is passed and executes the following code
@app.route("/<channel>", methods=["POST"])
def channel(channel):
    currentChannel=channel
    return channel

#when socket.io 'hears' "submit message", execute the following code
@socketio.on("submit message")
def submit(messageSend):
    emit("display messages", messageSend, broadcast=True)