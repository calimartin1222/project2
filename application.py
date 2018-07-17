import os

from flask import Flask, sessions, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# list of all channels
votes = {"yes": 0, "no": 0, "maybe": 0}
channel_list = ['general']

@app.route("/")
def index():
    global channel_list
    return render_template("index.html", channel_list=channel_list, votes=votes)

@app.route("/hello", methods=["POST"])
def hello():
    greeting = request.form.get("greeting")

@app.route("/newChannel", methods=["POST"])
def newChannel():
    global channel_list
    channel_list.append(request.form.get("channelName"))

@socketio.on("submit vote")
def vote(data):
    selection = data["selection"]
    votes[selection] += 1
    emit("vote totals", votes, broadcast=True)
