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

messages = {}

@app.route("/", methods=['POST', 'GET'])
def index():
    return render_template('index.html', channels=channels)

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
    print('user joined ' + room)
    if room in messages:
        msgs = messages[room]
        print(messages[room])
        emit("stuff", {"username": username, "msgs": msgs}, room=room)
    elif room not in messages:
        msgs = "none"
        emit("stuff", {"msgs": msgs}, room=room)

@socketio.on('r_send')
def r_send(data):
    time = data["time_hrs"]
    room = data["room"]
    username = data["username"]
    message = data["message"], data["username"], data["time_hrs"]
    print('message from ' + username + ' in ' + room)
    if room in messages:
        print('not first message')
        messages[room].append(message)
        print(messages[room])
        emit('response', data, room=room)
    elif room not in messages:
        messages[room] = [message]
        print('first message')
        return('not stuff')
        emit('response', data, room=room)

@socketio.on('leave')
def leave(data):
    room = data["old_room"]
    username = data["username"]
    leave_room(room)
    print(username + ' left')
    send('a user has left the room', room=room)



if __name__ == '__main__':
    socketio.run(app)
