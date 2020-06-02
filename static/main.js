document.addEventListener('DOMContentLoaded', () => {
   var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
   // Add a channel
   socket.on('connect', () => {
    document.querySelector('#adds').onsubmit = () => {
      const channel = 'vartest';
      socket.emit('addchannel', {'channel': channel});
    };
  });

  socket.on('channel added', data => {
    const li = document.createElement('li');
    li.innerHTML = `ch: ${data.channel}`;
    document.querySelector('#chans').append(li);
  });
});
