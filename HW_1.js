let curPage = 1;
let lastSearchTitle = '';
let lastSearchType = '';

async function sendInfo(title, type, page = 1) {
    try {
        curPage = page;
        lastSearchTitle = title;
        lastSearchType = type; 

        const API_KEY = "9aa61cc7"; // "Ключ оставлен открытым специально для демонстрации работы учебного проекта"
        const response = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&s=${title}&type=${type}&page=${page}`);

        const movies = await response.json();
        console.log("Data Server:", movies);

        const galleryFilm = document.querySelector('.movieFilm');
        galleryFilm.innerHTML = '';

        if (movies.Response === "True" && movies.Search) {
            renderMovies(movies.Search);
            renderPaginat(movies.totalResults, page);
        }
    } catch (error) {
        console.error('Data not send', error);
    }
};

const renderMovies = (moviesArr) => {
    const galleryFilm = document.querySelector('.movieFilm');
    galleryFilm.innerHTML = '';

    moviesArr.forEach(movie => {
        galleryFilm.insertAdjacentHTML('beforeend', `
            <div class="movie-card">
                <div class="img-movie">
                    <img src="${movie.Poster}" alt="${movie.Title}">
                </div>
                <div class="info-movie">
                    <p>${movie.Type}</p>
                    <h3>${movie.Title}</h3>
                    <p class="year">Year: ${movie.Year}</p>
                    <button type="button" id="detal" data-id="${movie.imdbID}">Details</button>
                </div>
            </div>
            `);
        });
};

const renderPaginat = (totalResult, curPage) => {
    const paginCont = document.querySelector('.pag-cont');
    paginCont.innerHTML = '';

    const mathTotal = parseInt(totalResult);
    const total = Math.ceil(mathTotal / 10);

    let pagBtn = '';

    if (total <= 1) return;

    if (curPage > 1) {
        pagBtn +=  `<button class="page-btn" data-page="${curPage - 1}">« Back</button>`;
    }
    
    pagBtn += `<span class="page-info">Page ${curPage} - ${total}</span>`;
    
    if (curPage < total) {
        pagBtn += `<button class="page-btn" data-page="${curPage + 1}">Next »</button>`;
    }

    paginCont.innerHTML = pagBtn;
};

const fullInfo = (movie) => {
    const modal = document.querySelector('.modal');
    const modalBody = document.querySelector('.modal-body');

    modalBody.innerHTML = `
        <div class="info">
            <img src="${movie.Poster}">
            <div>
                <h2>${movie.Title} (${movie.Year})</h2>
                <p>Genre:<strong> ${movie.Genre}</strong></p>
                <p>Actors:<strong> ${movie.Actors}</strong></p>
                <p><strong> ${movie.Plot}</strong></p>
                <p><strong>Rating:</strong> ${movie.imdbRating}</p>
            </div>
        </div>
    `;
    modal.classList.add('active');
};

const form = document.forms.searchForm;

form.addEventListener('submit',(e) => {
    e.preventDefault();

    const inptTitle = form.title.value;
    const inptType = form.type.value;

    sendInfo(inptTitle, inptType);
});

document.querySelector('.pag-cont').addEventListener('click', (e) => {
    if (e.target.classList.contains('page-btn')) {
        const nextPage = parseInt(e.target.dataset.page);
        
        sendInfo(lastSearchTitle, lastSearchType, nextPage);
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }
});

document.querySelector('.movieFilm').addEventListener('click', async (e) => {
    if (e.target.id === 'detal') {
        const id = e.target.dataset.id;
        
        const response = await fetch('http://localhost:3000', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({id}),
        });
        const fullMovie = await response.json();

        fullInfo(fullMovie);
    }
});

window.addEventListener('click', (e) => {
    document.querySelector('.modal').classList.remove('active');
});
