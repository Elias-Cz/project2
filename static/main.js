document.addEventListener('DOMContentLoaded', () => {
var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

  socket.on('connect', () => {
    if (!localStorage.getItem('currentuser')){
    const username = prompt('Enter a username: ')
    if(username != null) {
      localStorage.setItem('currentuser', username)
      console.log('new user ' + username)
      socket.emit('logged in', {'username': username})
    } else {
      console.log('welcome back')
      }
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
    const li = document.createElement('li')
    li.innerHTML = `<li><a class='nav' href="" name='${data.channel}'>${data.channel}</a></li>`
    list.append(li)
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
        document.getElementById('chat').value = "";
        const room = link.innerHTML;
        localStorage.clear();
        localStorage.setItem('currentchannel', room)
        localStorage.setItem('currentuser', username)
        socket.emit('join', {'room': room, 'username': username});
        console.log('joining ' + room);
        return false
      }
    });
  }


  // adding a channel
  const chan = document.getElementById('adds')
  if (!chan) {
  } else {
    chan.addEventListener('submit', () => {
      const channel = document.querySelector('#chaname').value;
      socket.emit('check', {'channel': channel})
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
      const room = localStorage.getItem('currentchannel')
      socket.emit('r_send', {'room': room, 'message': message})
      return false
    }
  }

  socket.on('message', username => {
    const div = document.createElement('div');
    div.innerHTML = `${username}`;
    div.className = 'msg';
    const chat = document.querySelector('#chat')
    chat.append(div);
    chat.scrollTop = chat.scrollHeight;

  });


  socket.on('response', data => {
    const div = document.createElement('div')
    div.innerHTML = data.message
    div.className = 'msg'
    document.querySelector('#chat').append(div);
  })




//  const username = localStorage.getItem('currentuser')
//  const room = localStorage.getItem('currentchannel')
//  socket.emit('leave', {'room': room, 'username': username})
//  localStorage.clear()
//  localStorage.setItem('currentuser', username)










  // clear channel then reinsate user

  // socketon message responds to send from python (room)

  // end dont get rid of this pls ffs
});
