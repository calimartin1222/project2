import os

from flask import Flask, sessions, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# list of all channels
channel_list = ['Select a Channel','General']
currentChannel = ""
messages = []

@app.route("/")
def index():
    return render_template("index.html", channel_list=channel_list, messages=messages, currentChannel=currentChannel)

@app.route("/hello", methods=["POST"])
def hello():
    greeting = request.form.get("greeting")
    return greeting

@app.route("/newChannel", methods=["POST"])
def newChannel():
    channelName = request.form.get("channelName")
    channel_list.append(channelName)
    return channelName

@app.route("/<channel>", methods=["POST"])
def channel(channel):
    currentChannel=channel
    return channel

@socketio.on("submit message")
def submit(message):
    messageSend = f"user says: {message}"
    messages.append(messageSend)
    emit("display messages", messageSend, broadcast=True)