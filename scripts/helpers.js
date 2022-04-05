function createNode(element) {
    return document.createElement(element);
}

function append(parent, el) {
  return parent.appendChild(el);
}

function deleteChild(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild)
    } 
}

const resetSuggestions = () => {
    deleteChild(document.querySelector('#search-suggestions'))
    deleteChild(document.querySelector('#artist'))
}

const resetResults = () => {

    deleteChild(document.querySelector('#search-results'))
    deleteChild(document.querySelector('#albums-pagination'))
    sessionStorage.setItem("albumsPerPage", DEFAULT_ALBUMS_ROWS_PAGE) 
    sessionStorage.setItem("albumsCurrentPage", DEFAULT_CURRENT_PAGE)
    sessionStorage.setItem("albums", {})
}

const resetModal = () => {
    deleteChild(document.querySelector('.modal-album__details'))
    deleteChild(document.querySelector('.modal-album__songs'))
    deleteChild(document.querySelector('#songs-pagination'))
    sessionStorage.setItem("songsPerPage", DEFAULT_SONGS_ROWS_PAGE) 
    sessionStorage.setItem("songsCurrentPage", DEFAULT_CURRENT_PAGE)
    sessionStorage.setItem("songs", {})
}

const truncate = (input, maxLength=40) => input.length > maxLength ? `${input.substring(0, maxLength)}...` : input;

const renderPagination = (total, type='albums') => {
    
    const rowsPerPage = parseInt((type=='albums') ? sessionStorage.albumsPerPage : sessionStorage.songsPerPage) 
    const nrPages =  total/rowsPerPage
    const paginationList = createNode('ul')
    paginationList.classList.add('pagination')

    for(let counter=1; counter<nrPages+1; counter++) {
        const paginationItem = createNode('li')
        paginationItem.id = counter
        paginationItem.classList.add('page-item')

        const pageLink = createNode('a')
        pageLink.classList.add('page-link')
        pageLink.href="#"
        pageLink.textContent = counter
        pageLink.id = counter
        pageLink.addEventListener('click', function() {
            if((parseInt((type=='albums') ? sessionStorage.albumsCurrentPage:sessionStorage.songsCurrentPage))!=(pageLink.id-1)){
                sessionStorage.setItem(type+'CurrentPage', (pageLink.id-1))
                if (type=='albums') updateAlbumsList()
                else updateSongsList()
            }
        });
       
        append(paginationList, paginationItem)
        append(paginationItem, pageLink)
    }
    append(document.querySelector('#' + type + '-pagination'), paginationList)
} 

function padTo2Digits(num) { return num.toString().padStart(2, '0'); }

function convertMsToTime(milliseconds) {
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);

    seconds = seconds % 60;
    minutes = minutes % 60;

    return `${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
}