



document.addEventListener('DOMContentLoaded', () => {
var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

  // logging the user in + saving to localStorage
  const log = document.getElementById('log')
  if (!log){
  } else {
  log.addEventListener('submit', () => {
    const username = document.querySelector('#user').value
    localStorage.setItem('currentuser', username)
    console.log(username)
    socket.emit('logged in', {'username': username})
    //window.location = '/channels'
    document.querySelector('#user').value = "";
    return false
  });
};
  // end log block

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

  // entering a channel
  const rooms = document.getElementById('chans')
  if (!rooms){
  } else {
    document.querySelectorAll('.nav').forEach(link => {
      link.onclick = () => {
        const room = link.innerHTML;
        localStorage.setItem('currentchannel', room)
        const username = localStorage.getItem('currentuser')
        socket.emit('join', {'room': room, 'username': username});
        console.log(room);
      }
    });
  }


  // remember user on leave
  const leave = document.getElementById('leave')
  if (!leave){
  } else {
    leave.onclick = () => {
      socket.emit('leave')
      const username = localStorage.getItem('currentuser')
      const room = localStorage.getItem('currentchannel')
      socket.emit('leave', {'room': room, 'username': username})
      localStorage.clear()
      localStorage.setItem('currentuser', username)
    }
  }

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

  socket.on('message', data => {
    console.log(data)
   })

  socket.on('sent', data => {
    const div = document.createElement('div')
    div.innerHTML = data.message
    div.className = 'msg'
    document.querySelector('#chat').append(div);
  })






  // clear channel then reinsate user

  // socketon message responds to send from python (room)

  // end dont get rid of this pls ffs
});
