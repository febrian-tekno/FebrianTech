// $('.search-button').on('click', function () {
//     $.ajax({
//         url: 'http://www.omdbapi.com/?apikey=dca61bcc&s=' + $('.input-keyword').val(),
//         success: response =>  {
//             const movies = response.Search;
//             let cards = '';

//             movies.forEach((movie) => {
//                 cards += showCard(movie);
//             });
//             $('#hasil').html(cards);

//             // tombol diklik
//         $('.modal-detail-button').on('click', function() {
//         //    console.log($(this).data('imdbid'));     // jquery memanggil data harus dengan hruf kecil ssemua
//             $.ajax({
//                 url: `http://www.omdbapi.com/?apikey=dca61bcc&i=${$(this).data('imdbid')}`,
//                 success: movie => {
//                     console.log(response);
//                     let movieDetails = '';

//                     movieDetails += showMovieDetails(movie);
//                     $('#detailsMovie').html(movieDetails);
//                 },
//                 error: response => alert(`movies ${response.text} tidak ditemukan`)
//             })
//         })

//         },
//         error: response => alert(`movies ${response.text} tidak ditemukan`)
//     })

// })

// fetch
const searchButton = document.querySelector(".search-button");
searchButton.addEventListener("click", function () {
  const inputKey = document.querySelector(".input-keyword");
  console.log("Fetching from:", "https://www.omdbapi.com/?apikey=dca61bcc&s=" + inputKey.value);
  fetch("https://www.omdbapi.com/?apikey=dca61bcc&s=" + inputKey.value)
    .then((response) => response.json())
    .then((response) => {
      const movies = response.Search;
      let cards = "";
      movies.forEach((movie) => (cards += showCard(movie)));

      const containHasil = document.getElementById("hasil");
      containHasil.innerHTML = cards;

      // ketika di klik
      const showDetailsBtn = document.querySelectorAll(".modal-detail-button");
      showDetailsBtn.forEach((btn) => {
        btn.addEventListener("click", function () {
          const imdb = this.dataset.imdbid;

          fetch("https://www.omdbapi.com/?apikey=dca61bcc&i=" + imdb)
            .then((response) => response.json())
            .then((movie) => {
              const detail = showMovieDetails(movie);
              const modal = document.getElementById("detailsMovie");
              modal.innerHTML = detail;
            })
            .catch((error) => console.log(error));
        });
      });
    })
    .catch((error) => console.error(error));
});

function showCard(movie) {
  return `<div class="col-md-4 my-3">
                <div class="card h-100" >
                    <img src="${movie.Poster}" class="card-img-top" alt="${movie.Title}">
                    <div class="card-body d-flex flex-column">
                      <h5 class="card-title" >${movie.Title}</h5>
                      <h6 class="card-subtitle mb-2 text-body-secondary">${movie.Year}</h6>
                      <a href="#" class="btn btn-primary mt-auto modal-detail-button" data-bs-toggle="modal" data-bs-target="#movieDetails"  data-imdbID=${movie.imdbID}>Details</a>
                    </div>
                  </div>
            </div>`;
}

function showMovieDetails(movie) {
  return `<div class="container-fluid">
            <div class="row">
                <div class="col-md-3">
                    <img src="${movie.Poster}" alt="${movie.Title}" class="img-fluid">
                </div>
                <div class="col-md">
                    <ul class="list-group">
                        <li class="list-group-item"><h4>${movie.Title} (${movie.Year})</h4></li>
                        <li class="list-group-item"><strong>Actors : </strong>${movie.Actors}</li>
                        <li class="list-group-item"><strong>Genre : </strong>${movie.Genre}</li>
                        <li class="list-group-item"><strong>Rating : </strong>${movie.imdbRating}</li>
                        <li class="list-group-item"><strong>Plot : </strong><br>${movie.Plot}</li>
                    </ul>
                </div>
            </div>
          </div>`;
}
