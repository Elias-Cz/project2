var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
function addChannel() {
    document.querySelector('#adds').onsubmit = () => {
      const channel = document.querySelector('#chaname').value
      socket.emit('addchannel', {'channel': channel});
      return false
    };
  }

  // enter channel
function enter(){
    document.querySelectorAll('.nav').forEach(link => {
    link.onclick = () => {
      chan = link.dataset.page
        socket.emit('enter', {'chan': chan})
        console.log(chan)
        return false
      };
    });
    };

    // send message
    function send() {
      document.querySelector('#message').onsubmit = () => {
        const div = document.createElement('div');
        div.innerHTML = document.querySelector('#in').value;
        document.querySelector('#chat').append(div);
        socket.emit('stuff')
        }
      }


function addList() {
socket.on('channel added', data => {
  const li = document.createElement('li');
  li.innerHTML = `<a class='nav' href='channels=${data.channel}' data-page='${data.channel}'>${data.channel}</a>`;
  document.querySelector('#chans').append(li);
  return false
});
}

document.addEventListener('DOMContentLoaded', () => {
   var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
   // Add a channel
   socket.on('connect', () => {
     console.log('Connected')
     });




  // If channel exists in channels
  socket.on('nochan', () => {
    alert('Error: Channel already exists');
  });





  // end dont get rid of this pls ffs
});
