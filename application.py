import os

from flask import Flask, sessions, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# list of all channels
channel_list = ['Select a Channel','General']
messagesList = []

@app.route("/")
def index():
    return render_template("index.html", channel_list=channel_list)

@app.route("/hello", methods=["POST"])
def hello():
    greeting = request.form.get("greeting")
    return greeting;

@app.route("/newChannel", methods=["POST"])
def newChannel():
    channelName = request.form.get("channelName")
    channel_list.append(channelName)
    return channelName;

@app.route("/<channel>", methods=["POST"])
def channel(channel):
    return channel;

@socketio.on("submit message")
def message(data):
    selection = data["selection"]
    emit("display messages", selection, broadcast=True)