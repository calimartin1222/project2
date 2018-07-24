import os

from flask import Flask, sessions, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# list of all channels
channel_list = ['Select a Channel','General']
currentChannel = ""

@app.route("/")
def index():
    return render_template("index.html", channel_list=channel_list)

@app.route("/hello", methods=["POST"])
def hello():
    greeting = request.form.get("greeting")
    return greeting

@app.route("/newChannel", methods=["POST"])
def newChannel():
    channel = request.form.get("channel")
    channel_list.append(channel)
    return channel

@app.route("/<channel>", methods=["POST"])
def channel(channel):
    currentChannel=channel
    return channel

@socketio.on("submit message")
def submit(message):
    emit("display messages", message, broadcast=True)