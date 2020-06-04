import os

from flask import Flask
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask import render_template, request, redirect

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

users = []

channels = ['General']

@app.route("/", methods=['POST', 'GET'])
def index():
    if request.method == 'POST':
        username = request.form.get('username')
        print(username)
        users.append(username)
        return redirect('channels')
    return render_template('index.html')

#@socketio.on('user')
#def user(data):
#    username = data["username"]
#    users.append(username)


@app.route("/channels", methods=['POST', 'GET'])
def yourchannels():
    channels
    print('entered channel list')
    return render_template('yourchannels.html', channels=channels)

@socketio.on('addchannel')
def add(data, methods=['POST', 'GET']):
    channel = data["channel"]
    print(channel)
    if channel not in channels:
        channels.append(channel)
        emit("channel added", {"channel": channel}, broadcast=True)
        print('channel has been added')
    elif channel in channels:
        print('error: channel exists')
        emit("nochan")

@app.route('/channels=<room>', methods=['POST', 'GET'])
def channel(room):
    print('in channel ' + room)
    return render_template('channel.html')

@socketio.on('enter')
def enter(data, methods=['POST', 'GET']):
    room = data["chan"]
    username = data["username"]
    join_room(room)
    print('entering ' + room)
    send(username + 'has joined', room=room)

@socketio.on('leave')
def leave(data, methods=['POST', 'GET']):
    room = data["chan"]
    username = data["username"]
    leave_room(room)
    send(username + 'has left', room=room)


@socketio.on('message')
def message(data, methods=['POST', 'GET']):
    message = data["message"]
    room = data["chan"]
    print(room)
    emit('mes', {"message": message}, room=room)

if __name__ == '__main__':
    socketio.run(app)
