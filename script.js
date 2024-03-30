const APIKEY = "e5906f306cc89666307eb717f459844f"
const baseUrl = "https://api.themoviedb.org/3"
const imgPath = "https://image.tmdb.org/t/p/original"
// https://image.tmdb.org/t/p/original

const apiPATHs = {
    fetchALLCategories: `${baseUrl}/genre/movie/list?api_key=${APIKEY}`,
    fetchMoviesList: (id) => `${baseUrl}/discover/movie?api_key=${APIKEY}&with_genres=${id}`,
    fetchTrending: `${baseUrl}/trending/all/day?api_key=${APIKEY}&language=en-US`,
    serachTrailerOnYoutube : (query) => `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=AIzaSyCIpq7jz8Z77NjocIbAOhpsx2UWy2B0SjY` 

}


// https://api.themoviedb.org/3/trending/all/day?api_key=e5906f306cc89666307eb717f459844f&language=en-US
// https://api.themoviedb.org/3/movie/550?api_key=e5906f306cc89666307eb717f459844f

// https://api.themoviedb.org/3/genre/movie/list?api_key=e5906f306cc89666307eb717f459844f


function init() {
    fetchTrendingMovies()
    fetchAndBuildAllSections()
}

function fetchTrendingMovies() {
    fetchAndBuildInvidualMovieSection(apiPATHs.fetchTrending, "Trending Now")
        .then(list => {
            // console.log(list[0]);
            const randomIndex = parseInt(Math.random() * list.length)
            buildBannerSection(list[randomIndex])
        }).catch(err => {
            console.error(err)
        });

}

function buildBannerSection(movie) {
    const bannerCont = document.getElementById("banner-content")
    bannerCont.innerHTML = ""
    bannerCont.style.backgroundImage = `url(${imgPath}${movie.backdrop_path})`

    bannerCont.innerHTML = `
            <h2 class="banner-title">${movie.original_title}</h2>
            <p class="banner-info">Trending Movies</p>
            <p class="banner-overview"> ${movie.overview && (movie.overview.length > 200) ? movie.overview.slice(0, 200).trim() + '...' : movie.overview}</p>
            <div class="action-button-container">
                <button class="play-btn"><i class="fa-solid fa-play"></i> &nbsp;Play</button>
                <button class="info-btn"><i class="fa-solid fa-circle-info"></i> &nbsp;More Info</button>
            </div>
            <div class="banner-fade-bottom"></div>
    `

}

function fetchAndBuildAllSections() {
    fetch(apiPATHs.fetchALLCategories)
        .then(res => res.json())
        .then(res => {
            const categories = res.genres;
            if (Array.isArray(categories) && categories.length > 0) {
                // console.log(categories.length)
                categories.forEach(individualCategory => {
                    fetchAndBuildInvidualMovieSection(
                        apiPATHs.fetchMoviesList(individualCategory.id),
                        individualCategory.name
                    )
                })
            }
            // console.log(typeof res.genres)
            // console.table(res.genres)
        })
        .catch(err => console.log(err))
}

function fetchAndBuildInvidualMovieSection(fetchUrl, individualCategoryName) {
    // console.log(fetchUrl, individualCategory)
    return fetch(fetchUrl)
        .then(res => res.json())
        .then(res => {
            // console.table(res.results)
            const movies = res.results;
            if (Array.isArray(movies) && movies.length) {
                buildMoviesSection(movies, individualCategoryName)
            }
            return movies;
        })
        .catch(err => console.log(err))


}

function buildMoviesSection(List, categoryName) {
    // console.log(List,categoryName)

    const moviesContainer = document.getElementById("movies-container")

    const moviesList = List.map((item) => {
        return `
            <div class="movie-item" onmouseenter="searchTrailer('${item.original_title}','yt${item.id}')">
                <img class="movie-item-img" src="${imgPath}${item.backdrop_path}" alt="${item.original_title}"  />
                <div class="iframe-wrap" id="yt${item.id}"></div>
            </div>
            `;
    }).join("");

    // console.log(moviesList);

    const movieSection = `
        
            <h2 class="movie-section-heading">${categoryName} <span  class="explore">Explore all</span></h2>
            <div class="movies-row">${moviesList}</div>
    `

    const div = document.createElement("div")
    div.className = "movie-section"
    div.innerHTML = movieSection

    // console.log(div.innerHTML);
    moviesContainer.appendChild(div)

}

function searchTrailer(movieName, iframeId){
    if(!movieName) return

    fetch(apiPATHs.serachTrailerOnYoutube(movieName))
    .then(res => res.json())
    .then(res => {
        console.log(res.items[0])
        const bestResult = res.items[0]

        const elements = document.getElementById(iframeId)
        console.log(`${bestResult.id.videoId}`);
        console.log(iframeId)
        const div = document.createElement("div")
        div.innerHTML = `<iframe src="https://www.youtube.com/embed/${bestResult.id.videoId}?autoplay=1&controls=0"</iframe>`
        elements.append(div)
    }).catch(err => console.log(err))
}



window.addEventListener("load", function () {
    init();
    // console.log("akash")
    window.addEventListener("scroll", (e) => {
        let header = document.getElementById("header")
        if (window.scrollY > 40) {
            header.classList.add("black-bg")
        } else {
            header.classList.remove("black-bg")
        }
    })
})