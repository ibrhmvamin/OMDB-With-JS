document.querySelector(".search-button").addEventListener("click", () => {
  getMovie(1);
});

function getMovie(page) {
  const title = document.querySelector(".title-input").value;
  const selection = document.querySelector("select").value;
  const apiKey = "e750289a";

  axios
    .get(
      `http://www.omdbapi.com/?s=${title}&type=${selection}&apikey=${apiKey}&page=${page}`
    )
    .then((response) => {
      console.log("Response:", response.data);
      if (response.data.Response === "True") {
        displayMovies(response.data.Search);
        setupPagination(Math.ceil(response.data.totalResults / 10), page);
      } else {
        document.getElementById(
          "results"
        ).innerHTML = `<p>Movie not found!</p>`;
        document.getElementById("pagination").innerHTML = "";
        document.getElementById("details").innerHTML = "";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function displayMovies(movies) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";
  movies.forEach((movie) => {
    const movieDiv = document.createElement("div");
    movieDiv.className = "movie-item";
    movieDiv.innerHTML = `
      <img src="${
        movie.Poster !== "N/A"
          ? movie.Poster
          : "https://via.placeholder.com/100x150?text=No+Image"
      }" alt="${movie.Title}">
      <div>
        <p><strong>${movie.Title}</strong> (${movie.Year})</p>
        <button onclick="getMovieDetails('${movie.imdbID}')">Details</button>
      </div>
    `;
    resultsDiv.appendChild(movieDiv);
  });
}

function setupPagination(totalPages, currentPage) {
  const paginationDiv = document.getElementById("pagination");
  paginationDiv.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.disabled = i === currentPage;
    pageButton.addEventListener("click", function () {
      getMovie(i);
    });
    paginationDiv.appendChild(pageButton);
  }
}

function getMovieDetails(imdbID) {
  const apiKey = "e750289a";

  axios
    .get(`http://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}`)
    .then((response) => {
      if (response.data.Response === "True") {
        displayMovieDetails(response.data);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function displayMovieDetails(movie) {
  const detailsDiv = document.getElementById("details");
  detailsDiv.style.display = "flex";
  const imgDiv = document.createElement("div");
  const infoDiv = document.createElement("div");
  imgDiv.innerHTML = `<img src="${
    movie.Poster
      ? movie.Poster
      : "https://via.placeholder.com/200?text=No+Image"
  }" alt="${movie.Title}">`;
  infoDiv.innerHTML = `
    <p><strong>Released:</strong> ${movie.Released}</p>
    <p><strong>Genre:</strong> ${movie.Genre}</p>
    <p><strong>Country:</strong> ${movie.Country}</p>
    <p><strong>Director:</strong> ${movie.Director}</p>
    <p><strong>Writer:</strong> ${movie.Writer}</p>
    <p><strong>Actors:</strong> ${movie.Actors}</p>
    <p><strong>Awards:</strong> ${movie.Awards}</p>
  `;
  infoDiv.classList.add("infos");
  detailsDiv.appendChild(imgDiv);
  detailsDiv.appendChild(infoDiv);
}
