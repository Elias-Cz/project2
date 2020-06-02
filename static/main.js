document.addEventListener('DOMContentLoaded', () => {
   var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
   // Add a channel
   socket.on('connect', () => {
    document.querySelector('#adds').onsubmit = () => {
      const channel = document.querySelector('#chaname').value
      socket.emit('addchannel', {'channel': channel});
      return false
    };
  });
  // adds list item
  socket.on('channel added', data => {
    const li = document.createElement('li');
    li.innerHTML = `<a class='nav' data-page='${data.channel}' href=''>${data.channel}</a>`;
    document.querySelector('#chans').append(li);
    return false
  });
  // If channel exists in channels
  socket.on('nochan', () => {
    alert('Error: Channel already exists');
  });
  // enter channel
  socket.on('connect', () => {
    document.querySelectorAll('.nav').forEach(link => {
    link.onclick = () => {
      chan = link.dataset.page
        socket.emit('enter', {'chan': chan})
        console.log(chan)
      };
    });
  });




  // end dont get rid of this pls ffs
});
