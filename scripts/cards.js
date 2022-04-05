const renderAlbumBody = (parent, album, truncateStatus=true) => {
  
    const albumBody =  createNode('div')
    albumBody.classList.add('album-card__content')

    const albumTitle = createNode('h5')
    albumTitle.textContent = truncateStatus ? truncate(album.collectionCensoredName) : album.collectionCensoredName
    albumTitle.classList.add('album-card__title')

    const albumMeta = createNode('div')
    albumMeta.classList.add('album-card__meta')

    const albumArtist = createNode('h6')
    albumArtist.textContent = truncate(album.artistName, 30)
    albumArtist.classList.add('album-card__code')

    const albumGenre = createNode('span')
    albumGenre.textContent = album.primaryGenreName
    albumGenre.classList.add('album-card__code')

    const albumDate = createNode('span')
    albumDate.textContent = new Date(album.releaseDate).getFullYear()
    albumDate.classList.add('album-card__code')

    const albumTotalTracks = createNode('span')
    albumTotalTracks.textContent = album.trackCount+" tracks"
    albumTotalTracks.classList.add('album-card__code')

    append(parent, albumArtist)
    append(parent, albumMeta)

    append(albumMeta, albumTotalTracks)
    append(albumMeta, albumDate)
    append(albumMeta, albumGenre)
    
    append(parent, albumTitle)
}

const albumCard = (parent, album, query) => {
    const albumCard = createNode('div')
    albumCard.classList.add('album-card')
    albumCard.id = query

    const albumItem = createNode('div')
    albumItem.classList.add('album-card__item')

    const albumImg =  createNode('div')
    albumImg.style.backgroundImage = 'url(' + album.artworkUrl100 +')'
    albumImg.classList.add('album-card__img')

    const albumBody =  createNode('div')
    albumBody.classList.add('album-card__content')

    const albumButton = createNode('button')
    const albumPlus = createNode('i')
    albumPlus.classList.add('gg-more-vertical-alt')
    albumButton.id=album.collectionId
    albumButton.type='button'
    albumButton["data-target"]="#album-modal"
    albumButton.classList.add('album-card__button')
    albumButton.addEventListener('click', function() {
        updateModal(albumButton.id)
    });

    append(albumCard, albumItem)
    append(albumItem, albumImg)

    append(albumItem, albumBody)
    renderAlbumBody(albumBody, album, true)

    append(albumButton, albumPlus)
    append(albumItem, albumButton)

    append(parent, albumCard)
}

const renderAlbums = (albums, query) => {
    const start = parseInt(sessionStorage.albumsCurrentPage) * parseInt(sessionStorage.albumsPerPage)
    const end = parseInt(sessionStorage.albumsPerPage) + start

    const sliced = albums.slice(start,end)
    Object.keys(sliced).map((a) => { 
        albumCard(document.querySelector('#search-results'), sliced[a], query)
    })
}

const renderModal = (album) => {
   
    document.querySelector('.modal-content').id=album.collectionId
    const albumHeader = document.querySelector('.modal-album__details')

    const albumImg =  createNode('div')
    albumImg.style.backgroundImage = 'url(' + album.artworkUrl100 +')'
    albumImg.classList.add('album-card__img')

    const albumBody =  createNode('div')
    albumBody.classList.add('album-card__content')

    renderAlbumBody(albumBody, album, false)

    append(albumHeader, albumImg)
    append(albumHeader, albumBody)

    const songsElement = document.querySelector('.modal-album__songs')
    const songsList = createNode('ul')
    songsList.classList.add('list-group')
    songsList.classList.add('list-group-flush')

    append(songsElement, songsList)
}

const songCard = (parent, song) => {
    
    const songElement = createNode('li')
    songElement.classList.add('list-group-item')
    songElement.classList.add('song-item')

    const songName = createNode('p')
    songName.textContent = truncate(song.trackName)
    songName.classList.add('song-item__name')

    const songDuration = createNode('span')
    songDuration.textContent = convertMsToTime(song.trackTimeMillis)
    songDuration.classList.add('song-item__duration')

    const discNr = createNode('span')
    discNr.textContent = 'Disc '+song.discNumber
    discNr.classList.add('song-item__disc')

    const songNr = createNode('span')
    songNr.textContent = '#'+song.trackNumber
    songNr.classList.add('song-item__nr')

    const songPlay = createNode('audio')
    songPlay.controls = 'controls';
    
    const songPlayUrl = createNode('source')
    songPlayUrl.src=song.previewUrl
    songPlayUrl.classList.add('song-item__url')

    append(parent, songElement)
    append(songElement, discNr)
    append(songElement, songNr)
    append(songElement, songName)
    append(songElement, songDuration)
    append(songElement, songPlay)
    append(songPlay, songPlayUrl)
}

const renderSongs = (songs) => {
 
    const start = parseInt(sessionStorage.songsCurrentPage) * parseInt(sessionStorage.songsPerPage)
    const end = parseInt(sessionStorage.songsPerPage) + start

    const sliced = songs.slice(start,end)
    Object.keys(sliced).map((s) => {
        songCard(document.querySelector('.modal-album__songs ul'),  sliced[s])
    })
}

const updateAlbumsList = (query) => {
    deleteChild(document.querySelector('#search-results'))
    const albums = JSON.parse(sessionStorage.getItem("albums"))
    return renderAlbums(albums, query) 
}

const updateModal = (query) => {
    const currentAlbumId = document.querySelector('.modal-content').id
    if(!currentAlbumId) getAlbumSongs(query)
    else {
        if(currentAlbumId!=query) {
            resetModal()
            getAlbumSongs(query)
        }
    }
    $("#album-modal").modal("show");
}

const updateSongsList = (query) => {
    deleteChild(document.querySelector('.modal-album__songs ul'))
    const songs = JSON.parse(sessionStorage.getItem("songs"))
    return renderSongs(songs, query) 
}

const renderArtist = (parent, artist, isFirst=false) => {

    const name = Object.keys(artist)[0]

    const buttonArtist = createNode('button')
    buttonArtist.addEventListener('click', function() {
        if(document.querySelector('.choices__item--selectable')) {
            document.querySelector('.choices__item--selectable').textContent=name
            document.querySelector('.choices__item--selectable')['data-value']=name
            document.querySelector('#artist span').textContent = name
            renderResultsForSuggestion(Object.values(artist)[0])
        }   
       
    })

    const spanArtist = createNode('span')
    spanArtist.classList.add('badge')
    spanArtist.classList.add('span-artist__name')
    spanArtist.textContent=name

    if(isFirst) {
        const suggestedArtist = createNode('h6')
        suggestedArtist.textContent = "Displaying albums for"
        append(parent, suggestedArtist)
    }

    append(parent, buttonArtist)
    append(buttonArtist, spanArtist)
}

const renderListArtists = (artists) => {

    const searchArtists = document.querySelector('#search-suggestions')
    const others = createNode('h6')
    others.textContent = "All"
    append(searchArtists, others)

    Object.keys(artists).map((a) => {  
        renderArtist(searchArtists, artists[a])
    });
}

const renderResultsForSuggestion = (id) => {
    resetResults()
    resetModal()
    getAlbums(id)
}