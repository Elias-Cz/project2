import os

from flask import Flask
from flask_socketio import SocketIO, emit
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
        users.append(username)
        return redirect('/channels')
    return render_template('index.html')


@app.route("/channels", methods=['POST', 'GET'])
def yourchannels():
    print('entered channel list')
    socketio.emit('init')
    return render_template('yourchannels.html')

@socketio.on('addchannel')
def add(data, methods=['POST', 'GET']):
    channel = data["channel"]
    print(channel)
    if channel not in channels:
        channels.append(channel)
        emit("channel added", {"channel": channel}, broadcast=True)
        print('channel added')
    elif channel in channels:
        print('error: channel exists')
        emit("nochan")

@app.route('/channels=<chan>', methods=['POST', 'GET'])
def channel(chan):
    print('in channel ' + chan)
    return render_template('channel.html')

@socketio.on('enter')
def enter(data, methods=['POST', 'GET']):
    chan = data["chan"]
    print('entering ' + chan)



if __name__ == '__main__':
    socketio.run(app)
