document.addEventListener('DOMContentLoaded', () => {
var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

  socket.on('connect', () => {
    if (!localStorage.getItem('currentuser')){
    const username = prompt('Enter a username: ')
    if(username != null) {
      localStorage.setItem('currentuser', username)
      console.log('new user ' + username)
      socket.emit('logged in', {'username': username})
      const room = "General"
      socket.emit('join', {'room': room, 'username': username})
    } else {
      alert('Please enter a valid username')
      location.reload()
      return false
    }
    } else {
      console.log('welcome back')
      const username = localStorage.getItem('currentuser')
      const room = localStorage.getItem('currentchannel')
      document.getElementById('current').innerHTML = room
      socket.emit('join', {'room': room, 'username': username})
      }
  })
  // end log block

  // new channel
  const new_channel = document.getElementById('create')
  if (!new_channel){
  } else {
    new_channel.onclick = () => {
      const channel = prompt('Enter a channel name:')
      socket.emit('check', {'channel': channel})
      return false
    }
  }

  // if channel exists
  socket.on('exists', () => {
    alert('Channel name taken')
  })

  socket.on('channel added', data => {
    const list = document.querySelector('#chans')
    const div = document.createElement('div')
    div.innerHTML = `<br><a class='nav' href="" name='${data.channel}'>${data.channel}</a>`
    list.append(div)
  })

  // entering a channel
  const rooms = document.getElementById('chans')
  if (!rooms){
  } else {
    document.querySelectorAll('.nav').forEach(link => {
      link.onclick = () => {
        const username = localStorage.getItem('currentuser')
        var old_room = localStorage.getItem('currentchannel')
        socket.emit('leave', {'old_room': old_room, 'username': username})
        document.getElementById('chat').innerHTML = '';
        const room = link.innerHTML;
        document.getElementById('current').innerHTML = room
        localStorage.clear();
        localStorage.setItem('currentchannel', room)
        localStorage.setItem('currentuser', username)
        socket.emit('join', {'room': room, 'username': username});
        console.log('joining ' + room);
      }
    });
  }


  // adding a channel
  const chan = document.getElementById('adds');
  if (!chan) {
  } else {
    chan.addEventListener('submit', () => {
      const channel = document.querySelector('#chaname').value;
      socket.emit('check', {'channel': channel});
      return false
    })
  }

  // if channel exists
  socket.on('exists', () => {
    alert('Channel name taken')
  })


  const send = document.getElementById('button')
  if (!send){
  } else {
    send.onclick = () => {
      const message = document.querySelector('#in').value;
      const username = localStorage.getItem('currentuser');
      const room = localStorage.getItem('currentchannel');
      var time = new Date();
      var time_hrs = time.toLocaleTimeString(navigator.language, {hour: '2-digit', minute: '2-digit'});
      socket.emit('r_send', {'time_hrs': time_hrs, 'room': room, 'username': username, 'message': message})
      document.querySelector('#in').value = '';
      return false
    }
  }

  socket.on('message', username => {
    const div = document.createElement('div');
    div.innerHTML = `user ${username}`;
    div.className = 'msg';
    const chat = document.querySelector('#chat');
    chat.append(div);
  });

  // Loads/writes old messages
  socket.on('old_messages', data => {
    if (data.msgs == "none") {
      console.log('No old messages')
    } else {
    const stuff = data.msgs;
    stuff.forEach(element => {
    const div = document.createElement('div');
    div.innerHTML = `${element[0]} <br><small> from: ${element[1]} at ${element[2]} </small>`;
    div.className = 'msg';
    const chat = document.querySelector('#chat');
    chat.append(div);
    chat.scrollTop = chat.scrollHeight;
      });
    }
  });


  socket.on('response', data => {
    const div = document.createElement('div');
    div.innerHTML = `${data.message} <br><small>from: ${data.username} at: ${data.time_hrs}</small>`
    div.className = 'msg';
    document.querySelector('#chat').append(div);
    chat.scrollTop = chat.scrollHeight;
  })

  // Personal Messaging
  const status = document.getElementById('button2')
  if (!status){
  } else {
    status.onclick = () => {
      const username = localStorage.getItem('currentuser');
      const s = document.querySelector('#stat').selectedIndex
      const stat = document.getElementsByTagName("option")[s].value
      var time = new Date();
      var time_hrs = time.toLocaleTimeString(navigator.language, {hour: '2-digit', minute: '2-digit'});
      socket.emit('user_stat', {'time_hrs': time_hrs, 'username': username, 'stat': stat})
      return false
    }
  }

  // Set status
  socket.on('post_status', data => {
    console.log(data)
    if (data.stat === "Online"){
      const room = localStorage.getItem('currentchannel')
      const div = document.createElement('div');
      div.innerHTML = `${data.stat} <br><small>User: ${data.username} at: ${data.time_hrs} In: ${room}</small>`
      div.className = 'msg';
      document.querySelector('#status').append(div);
      chat.scrollTop = chat.scrollHeight;
    } else {
      const div = document.createElement('div');
      div.innerHTML = `${data.stat} <br><small>User: ${data.username} at: ${data.time_hrs}</small>`
      div.className = 'msg';
      document.querySelector('#status').append(div);
      chat.scrollTop = chat.scrollHeight;
    }
  })




  // end dont get rid of this pls ffs
});
