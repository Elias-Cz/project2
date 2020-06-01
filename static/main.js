document.addEventListener('DOMContentLoaded', () => {
   var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
   // Add a channel
   socket.on('connect', () => {
    document.querySelector('#adds').onclick = () => {
      var channel = document.getElementById('chaname').value;
      socket.emit('addchannel', {'channel': channel});
    };
    });

    socket.on('channeladded', channel => {
      const li = document.createElement('li');
      li.innerHTML = `<a href="#">${channel}</a>`;
      document.querySelector('#chans').append(li);
      console.log('adding channel');
    });
});
