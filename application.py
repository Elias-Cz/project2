import os

from flask import Flask
from flask_socketio import SocketIO, emit, send, join_room, leave_room
from flask import render_template, request, redirect, session

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
app.config["SECRET_KEY"] = "OCML3BRawWEUeaxcuKHLpw"
socketio = SocketIO(app)

users = []

channels = ['General']

@app.route("/", methods=['POST', 'GET'])
def index():
    return render_template('index.html')

@socketio.on('logged in')
def log(data):
    username = data['username']
    users.append(username)
    print('user ' + username + ' registered')

@app.route("/channels", methods=['POST', 'GET'])
def yourchannels():
    print('entered channel list')
    return render_template('yourchannels.html', channels=channels)

@socketio.on("check")
def check(data):
    channel = data["channel"]
    print(channel)
    if channel not in channels:
        channels.append(channel)
        emit("channel added", {"channel": channel}, broadcast=True)
        print('channel has been added')
    elif channel in channels:
        print('error: channel exists')
        emit("exists")

@socketio.on('join')
def join(data):
    room = data["room"]
    username = data["username"]
    join_room(room)
    print(room)
    send(username + ' has joined', room=room)

@app.route("/<room>", methods=["POST", "GET"])
def channel(room):
    print( 'in channel ' + room)
    return render_template('channel.html')


@socketio.on('r_send')
def r_send(data):
    room = data["room"]
    #print('message in ' + room)
    print(room)
    send(data, room=room)

@socketio.on('leave')
def leave(data):
    room = data["room"]
    leave_room(room)
    print('left')
    send('a user has left the room', room=room)


if __name__ == '__main__':
    socketio.run(app)
