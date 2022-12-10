//TMBD
const API_KEY = 'api_key=a23374874c03f500767b04f50f5497d9';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&'+API_KEY;
const searchURL = BASE_URL + '/search/movie?'+API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

const main = document.getElementById('main');
const form = document.getElementById('form');
const input = document.getElementById('search')
const button = document.getElementById('button')

const prev = document.getElementById('prev')
const next = document.getElementById('next')
const current = document.getElementById('current')

var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var lastUrl = '';
var totalPages = 100;

getMovies(API_URL);


function getMovies(url) {
    lastUrl = url;
    fetch(url).then(res => res.json()).then(data => {
        console.log(data.results)
        showMovies(data.results);
        currentPage = data.page;
        nextPage = currentPage + 1;
        prevPage = currentPage - 1;
        totalPages = data.total_pages;

        current.innerText = currentPage;

            if(currentPage <= 1){
              prev.classList.add('disabled');
              next.classList.remove('disabled')
            }else if(currentPage>= totalPages){
              prev.classList.remove('disabled');
              next.classList.add('disabled')
            }else{
              prev.classList.remove('disabled');
              next.classList.remove('disabled')
            }
    })
}

function showMovies(data) {
    main.innerHTML = '';

    data.forEach(movie => {
        const {title, poster_path, vote_average, overview, id}= movie;
        const movieE1 = document.createElement('div');
        movieE1.classList.add('movie');
        movieE1.innerHTML=`
        <div class="movie">
            <img src="${IMG_URL + poster_path}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
                <h3>${title}</h3>
                <p>${overview}</p>
                <button class="know__more" id="${id}">Know more</button>
            </div>
        </div>
        `

        main.appendChild(movieE1)

        document.getElementById(id).addEventListener('click', () =>{
          console.log(id)
          openNav(movie)
          
    })
    });

const OverlayContent = document.getElementById('overlay-content');
/* Open when someone clicks on the span element */
function openNav(movie) {
  let id = movie.id;
  fetch(BASE_URL + "/movie/"+id+"/videos?"+API_KEY).then(res => res.json()).then(videoData => {
    console.log(videoData);
    if (videoData){
      document.getElementById("myNav").style.width = "100%";
      if (videoData.results.length > 0) {
        var embed =[];
        videoData.results.forEach((video) => {
          let {name, key, site} = video

          if(site == 'YouTube'){
              
            embed.push(`
              <iframe width="560" height="315" src="https://www.youtube.com/embed/${key}" title="${name}" class="embed hide" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          `)
          }
        })
        var content = `
        <h1 class="no-results">${movie.original_title}</h1>
        <br/>
        ${embed.join('')}
        <br/>
        `
        OverlayContent.innerHTML = content;
        activeSlide=0;
        // showVideos();
          // OverlayContent.innerHTML = embed.join('')
      }else{
        OverlayContent.innerHTML =` <h1 class="no-result">No Result</h1>
      `}
    }
  })
  
}

window.onclick = closeNav;
function closeNav() {
  document.getElementById("myNav").style.width = "0%";
}

}function getColor(vote) {
    if(vote>= 8){
        return 'green'
    }else if (vote >= 5){
        return 'orange'
    }else{
        return 'red'
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const searchTerm = input.value;
        if(searchTerm) {
            getMovies(searchURL+'&query='+searchTerm)
        }else{
            getMovies(API_URL);
        }
    
})
prev.addEventListener('click', () => {
    if(prevPage > 0){
      pageCall(prevPage);
    }
  })
  
  next.addEventListener('click', () => {
    if(nextPage <= totalPages){
      pageCall(nextPage);
    }
  })
function pageCall(page){
    let urlSplit = lastUrl.split('?');
    let queryParams = urlSplit[1].split('&');
    let key = queryParams[queryParams.length -1].split('=');
    if(key[0] != 'page'){
      let url = lastUrl + '&page='+page
      getMovies(url);
    }else{
      key[1] = page.toString();
      let a = key.join('=');
      queryParams[queryParams.length -1] = a;
      let b = queryParams.join('&');
      let url = urlSplit[0] +'?'+ b
      getMovies(url);
    }
  }