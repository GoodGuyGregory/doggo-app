const select = document.getElementById('breeds');
const card = document.querySelector('.card'); 
const form = document.querySelector('form');

// ------------------------------------------
//  FETCH FUNCTIONS
// ------------------------------------------

// Creates a Simpler Syntax for FETCH calls to the Dog API

//@params takes a API URL:
//@returns: parsed API response
//@docs: Makes the fetch api error proof and DRY
function fetchData(url) {
    return fetch(url)
        .then(checkStatus)
        .then(res => res.json())
        .catch(error => console.log('looks like there was a problem', error))
}

//Promise.all will compose multiple promises into a single promise:
//Pass Fail All or nothing method
Promise.all([
    fetchData('https://dog.ceo/api/breeds/list'),
    fetchData('https://dog.ceo/api/breeds/image/random')
])
    .then(data => {
        const breedList = data[0].message;
        const randomImage = data[1].message;

        generateOptions(breedList);
        generateImage(randomImage)
    })

//Fetch Breeds from API list:
//These are taken care of from Promise.all(function)
// fetchData('https://dog.ceo/api/breeds/list')
//     .then(data => generateOptions(data.message))
//
// // Fetches Dog Images from the Dog Api
// fetchData('https://dog.ceo/api/breeds/image/random')
//     .then(data => generateImage(data.message))

// ------------------------------------------
//  HELPER FUNCTIONS
// ------------------------------------------

function checkStatus(response) {
    if(response.ok) {
        return Promise.resolve(response);
    } else {
        return Promise.reject( new Error(response.statusText));
    }
}

//@params Takes the data object from the Doggo Api
//@returns returns the breed options from the array mapped to specific values in the select dom object
function generateOptions(data) {
    const options = data.map(item => `
    <option value='${item}'>${item}</option>
    `).join(' ');
    select.innerHTML = options;
}



// creates generate image
//@parameters JSON data attribute
//@returns JSON's Image URL as an <img>
function generateImage(data) {
    card.innerHTML = `
    <img src='${data}' alt>
    <p>Click to View images of ${select.value}s</p>
    `;
}

function fetchBreedImages() {
    //uses the value from form selected by client
    const breed = select.value;

    //initial Configurations from client selection
    const img = card.querySelector('img');
    const p = card.querySelector('p');

    fetchData(`https://dog.ceo/api/breed/${breed}/images/random`)
        .then(data => {
            //changes src to new API fetch url
            img.src = data.message;
            //changes alt text to breed
            img.alt = breed;
            //edits UI component to reflect selected breed
            p.textContent = `click to view more ${breed}s`;

        })

}

// ------------------------------------------
//  EVENT LISTENERS
// ------------------------------------------

//listens for the change event on selected options and then uses breed images as the callback
select.addEventListener('change', fetchBreedImages);

//listens for the click event and  call back to fetchBreedimages function
card.addEventListener('click', fetchBreedImages);

form.addEventListener('submit', postData);
// ------------------------------------------
//  POST DATA
// ------------------------------------------

function postData(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const comment = document.getElementById('comment').value;

    fetch('https://jsonplaceholder.typicode.com/comments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, comment })
    })
        .then(checkStatus)
        .then(resp => resp.json())
        .then(data => console.log(data))

}
