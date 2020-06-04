var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

// Begins adding channel, gets name, sends to server as conf
function add() {
  document.querySelector('#adds').onsubmit = () => {
    const channel = document.querySelector('#chaname').value
    socket.emit('addchannel', {'channel': channel});
    return false
  };
}

// Remember user
function usn() {
    const username = document.querySelector('#user').value
    localStorage.setItem('currentuser', JSON.stringify(username));
    return false
}


// Sets up link per channel, enter on click
function enter(event) {
  document.querySelectorAll('.nav').forEach(link => {
    link.onclick = () => {
      var chan = link.dataset.page;
      localStorage.setItem('chan', JSON.stringify(chan))
      const username = localStorage.getItem('currentuser')
      socket.emit('enter', {'chan': chan, 'username': username});
      console.log(chan);
      return false;
    };
  });
};

// Leaving a room
function leave() {
  var chan = localStorage.getItem('chan')
  const username = localStorage.getItem('currentuser')
  window.history.back()
  socket.emit('leave', {'chan': chan, 'username': username})
}

// Sending message
function send() {
  document.querySelector('#message').onsubmit = () => {
    var chan = localStorage.getItem('chan')
    var message = document.querySelector('#in').value;
    socket.emit('message', {'message': message, 'chan': chan})
    return false

  };
};

document.addEventListener('DOMContentLoaded', () => {
   var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
   // Connect conf
   socket.on('connect', () => {
     console.log('connected')
  });

  // After conf, edits list of channels
  socket.on('channel added', data => {
    const li = document.createElement('li');
    li.innerHTML = `<a class='nav' href='channels=${data.channel}' data-page='${data.channel}'>${data.channel}</a>`;
    document.querySelector('#chans').append(li);
    return false
  });

  // If channel exists in channels
  socket.on('nochan', () => {
    alert('Error: Channel already exists');
  });


  // Broadcasting message
  socket.on('mes', data => {
    var message = data.message
    const name = localStorage.getItem('currentuser')
    const div = document.createElement('div');
    var d = new Date();
    var time = d.getHours() + ':' + d.getMinutes();
    div.className = "msg";
    div.innerHTML = message + `<br><small>from: ${name} at: ${time}</small>`;
    document.querySelector('#chat').append(div);
  })

  // end dont get rid of this pls ffs
});
