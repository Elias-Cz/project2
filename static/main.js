var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

// Begins adding channel, gets name, sends to server as conf
function add() {
  document.querySelector('#adds').onsubmit = () => {
    const channel = document.querySelector('#chaname').value
    socket.emit('addchannel', {'channel': channel});
    return false
  };
}

// Sets up link per channel, enter on click
function enter() {
  document.querySelectorAll('.nav').forEach(link => {
    link.onclick = () => {
      chan = link.dataset.page;
      socket.emit('enter', {'chan': chan});
      console.log(chan);
      return false;
    };
  });
};

// Sending message
function send() {
  document.querySelector('#message').onsubmit = () => {
    var message = document.querySelector('#in').value;
    socket.emit('message', {'message': message})
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

  socket.on('log', data => {
    var username = data.username
    localStorage.setItem('user', username)
  })

  // Broadcasting message
  socket.on('mes', data => {
    var message = data.message
    var name = localStorage.getItem('user')
    const div = document.createElement('div');
    var d = new Date();
    var e = d.getHours() + ':' + d.getMinutes();
    div.className = "msg";
    div.innerHTML = message + `<br><small>from: ${name} at: ${e}</small>`;
    document.querySelector('#chat').append(div);
  })

  // end dont get rid of this pls ffs
});
