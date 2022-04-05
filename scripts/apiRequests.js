const urlItunesApi = (type, id, entityValue, attributeValue=null) => {
    const url = new URL('https://itunes.apple.com/' + type);
    const queryId = (type == 'search') ? 'term' : 'id';
    const params = {
        [queryId]: id,
        country:'de',
        entity: entityValue,
        ...(attributeValue) && {attribute: attributeValue}
    }
    url.search = new URLSearchParams(params);
    return url
}

function getArtist(artistTerm) {

    const url = urlItunesApi('search', artistTerm, 'musicArtist')
    try {
        fetch(url).then(results => {
            return results.json();
        }).then(res => {
            if(res.resultCount>1) {
                //list all possible artists
                let artists = res.results.map(function(r) {return {[r.artistName]: r.artistId}})
                artists = Array.from(new Set(artists.map(JSON.stringify))).map(JSON.parse);
                renderListArtists(artists.slice(0, 11))
                renderArtist(document.querySelector('#artist'), artists[0], true)
                $('#search-suggestions').collapse('show')
                
                //get album of most expected artist
                getAlbums(res.results[0].artistId);
            }
            else{
                const suggestedArtist = createNode('h6')
                suggestedArtist.textContent = "We could not find your Artist. Please adjust your query."
                append(document.querySelector('#artist'), suggestedArtist)
            }
        })
    } catch (error) {
        console.error(error);
    }
}

const getAlbums = (artistId) => {

    const url = urlItunesApi('lookup', artistId, 'album', 'albumTerm')
    try {
        fetch(url).then(results => {
            return results.json();
        }).then(res => {
            if(res.resultCount>1) {
                const filterRes = res.results.filter(r => (r.wrapperType=='collection'))
            
                //const sortedRes = filterRes.sort(function(a, b){return new Date(b.releaseDate) - new Date(a.releaseDate)})
                renderPagination(filterRes.length)
                renderAlbums(filterRes)
                sessionStorage.setItem("albums", JSON.stringify(filterRes)) 
            } else {
                const suggestedArtist = createNode('h6')
                suggestedArtist.textContent = "This Artist has no albums yet."
                append(document.querySelector('#search-results'), suggestedArtist)
            }
        })
    } catch (error) {
        console.error(error);
    }
}

const getAlbumSongs = (albumId) => {
    
    const url = urlItunesApi('lookup', albumId, 'song', 'songTerm')
    try {
        fetch(url).then(results => {
            return results.json();
        }).then(res => {

            const albumHeader =  res.results.filter(r => (r.wrapperType=='collection'))[0]
            const filterRes = res.results.filter(r => (r.wrapperType=='track'))

            //const sortedSongs = filterRes.sort(function(a, b){return new Date(a.trackNumber) - new Date(b.trackNumber)})
            renderPagination(filterRes.length, 'songs')
            renderModal(albumHeader);
            renderSongs(filterRes);
            sessionStorage.setItem("songs", JSON.stringify(filterRes));
        })
    } catch (error) {
        console.error(error);
    }
}



