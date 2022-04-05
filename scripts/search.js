
// create search element
const containerSearch = document.querySelector('section.search > .container');
const input = document.createElement('input')
input.type='text'
input.classList.add('js-choice')
containerSearch.appendChild(input)

const searchElement = document.querySelector('.js-choice');
const choices = new Choices(searchElement, {
    maxItemCount: 1,
    placeholderValue:'Search for Artists or Bands...',
    duplicateItemsAllowed:false});

searchElement.addEventListener(
    'addItem',
    function(event) {
        getArtist(event.detail.value)
    },
    false,
);
searchElement.addEventListener(
    'removeItem',
    function(event) {
        resetSuggestions()
        resetResults()
        resetModal(event.detail.value)
    },
    false,
);
