var socket = io('http://localhost:8081');
socket.on('connect', function (data) {

});
socket.on('disconnect', function (data) { console.log('disc', data) });

// then
socket.on('getRadioTitle', function (data) {

   let currentRadioTitle =  document.createElement('h5').textContent = 'Сейчас играет: ' + data

   let radiotitle =  document.querySelector('.radioTitle')
   radiotitle.innerHTML = ''
   radiotitle.append(currentRadioTitle)
    console.log('data', data)
});



// search input handler

function runSearch(e) {

    if (e.keyCode == 13) {

        // get serach input value
        const search = document.querySelector('#radioInput').value

        //send search result to server 
        socket.emit('parseRadioStations', search);

        // clear old search result
        document.querySelector('.insert').innerHTML = ''

    }
}
// then
socket.on('parseRadioStations', function (data) {
    let domInsert = document.querySelector('.insert')
    console.log('parsed', data)
    data.map((station) => {
        domInsert.insertAdjacentHTML('beforeend', `
    
    <div class="box">
  <article class="media">
    <div class="media-left">
      <figure class="image is-128x128">
        <img src=${station.stationImg} alt="Image">
      </figure>
    </div>
    <div class="media-content">
      <div class="content">
        <p>
          <strong>${station.stationTitle}</strong> <br>
          <small>
            слушают: ${station.stationListeners}
          </small> <br>
          <small>
            Ip: ${station.stationIP}
          </small>
          <br>
        </p>
      </div>
      <nav class="level is-mobile">
  <div class="level-left">

    <a class="level-item" aria-label="like">
      <span  ip=${station.stationIP} id='playRadio' class="icon is-small">
        <i  class="fas fa-play" aria-hidden="true"></i>
      </span>
    </a>
  </div>
</nav>
    </div>
  </article>
</div>

    `)
    })

    // convert NodeList to Array with spread operator ... to be able map over
    const play = [...document.querySelectorAll('#playRadio')]

    play.map((element) => {

        const stationIP = element.getAttribute('ip')

        element.addEventListener('click', () => {
            try {

                document.querySelector('#audioNode').remove()

            } catch (error) {
                console.log('no such element')
            }

            const audio = document.createElement('audio')
            audio.setAttribute('controls', true)
            audio.setAttribute('hidden', true)

            audio.id = 'audioNode'

            audio.insertAdjacentHTML('afterbegin', `<source id='audioNodeSource' src=${stationIP}>`)
            document.body.append(audio)
            audio.play()

            // send current playing radio ip to server which will handle radio music title changings
            // and will send back new song title when new song starts
            socket.emit('sendRadioIp', stationIP);

        })
    })
});





