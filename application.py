import os

from flask import Flask
from flask_socketio import SocketIO, emit
from flask import render_template, request, redirect

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

users = []

channels = []

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
    return render_template('yourchannels.html')

@socketio.on('addchannel')
def add(channel, methods=['POST', 'GET']):
    channel = channel
    print('adding channel..')
    channels.append(channel)
    emit('channeladded', channel)
