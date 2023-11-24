window.onload = () => {
    peliculasDiv = document.getElementById("peliculas");
    apiKey = "de819033";
    cargarPelis("star");
    
    // Agregar un listener al evento scroll
    window.addEventListener('scroll', () => {
        // Verificar si el usuario ha llegado al final de la página
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight-100) {
            // Incrementar el número de página y cargar más películas
            if (!cargando){
                pagNum++;
                cargarPelis("star");
            }
        
        }
    });
};

pagNum = 1;
maxPags = 2;
cargando = false;

function cargarPelis(title) {
    if (pagNum <= maxPags) {
        cargando = true;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                data = JSON.parse(this.responseText);
                peliculas = data.Search;
                maxPags = Math.ceil(data.totalResults / 10);

                mostrarPeliculas(peliculas);
            }
        };
        xhttp.open("GET", "https://www.omdbapi.com/?apikey=" + apiKey + "&s=" + title + "&page=" + pagNum, true);
        xhttp.send();
    }
}

function mostrarPeliculas(peliculas) {
    peliculas.forEach((pelicula) => {
        peliculaDiv = document.createElement("div");
        peliculaDiv.className = "pelicula";
        peliculaDiv.style.backgroundImage = "url(" + pelicula.Poster + ")";

        peliculasDiv.appendChild(peliculaDiv);
    });
    cargando = false;
}
