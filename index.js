window.onload = () => {
    peliculasDiv = document.getElementById("peliculas");
    input = document.getElementById("buscar");
    fondoGris = document.getElementById("fondoGris");
    detalles = document.getElementById("detalles");
    seriesBtn = document.getElementById("seriesBtn");
    pelisBtn = document.getElementById("pelisBtn");
    closeSearch = document.getElementById("closeSearch");
    body = document.querySelector("body");

    apiKey = "de819033";
    series = false;
    
    // Agregar un listener al evento scroll
    window.addEventListener('scroll', scrollInfinito);

    input.addEventListener("input", buscar); 

    fondoGris.addEventListener("click", ocultarDetalles);

    seriesBtn.addEventListener("click", () => {
        series=true; 
        buscar()
        seriesBtn.style.textDecoration="underline";
        pelisBtn.style.textDecoration="none";
    });
    pelisBtn.addEventListener("click", () => {
        series=false;
        buscar()
        pelisBtn.style.textDecoration="underline";
        seriesBtn.style.textDecoration="none";
    });

    closeSearch.addEventListener("click", ()=>{input.value=""; peliculasDiv.innerHTML=""})
};

pagNum = 1;
maxPags = 2;
cargando = false;
busqueda="";

function cargarPelis(title) {
    if (series){
        type="series";
    } else {
        type="movie"
    }

    if (pagNum <= maxPags) {
        cargando = true;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                data = JSON.parse(this.responseText);
                maxPags = Math.ceil(data.totalResults / 10);
                if (data.totalResults>0){
                    peliculas = data.Search;
                    mostrarPeliculas(peliculas);
                } else {
                    maxPags = 2;
                }
            }
        };
        xhttp.open("GET", "https://www.omdbapi.com/?apikey=" + apiKey + "&s=" + title + "&page=" + pagNum + "&type=" + type, true);
        xhttp.send();
    }
}

function mostrarPeliculas(peliculas) {
    peliculas.forEach((pelicula) => {
        peliculaDiv = document.createElement("div");
        peliculaDiv.id=pelicula.imdbID;
        peliculaDiv.className = "pelicula";
        peliculaDiv.style.backgroundImage = "url(" + pelicula.Poster + ")";
        title = document.createElement("h2");
        title.innerHTML = pelicula.Title;
        peliculaDiv.appendChild(title);

        peliculasDiv.appendChild(peliculaDiv);

        peliculaDiv.addEventListener("click", mostarDetalles)
    });
    cargando = false;
}

function scrollInfinito(){
    // Verificar si el usuario ha llegado al final de la página
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight-300) {
        // Incrementar el número de página y cargar más películas
        if (!cargando){
            pagNum++;
            cargarPelis(busqueda);
        }
    
    }
}

function buscar(){
    peliculasDiv.innerHTML="";
    pagNum=1;

    if (input.value.length >= 3){
        busqueda = input.value.replace(" ", "+");
        cargarPelis(busqueda);
    }
}

function mostarDetalles(e){

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            data = JSON.parse(this.responseText);
            escribirDetalles(data);
        }
    };
    xhttp.open("GET", "https://www.omdbapi.com/?apikey=" + apiKey + "&i=" + e.target.id, true);
    xhttp.send();

}

function escribirDetalles(data){
    
    detalles.innerHTML="";
    fondoGris.style.display="initial";
    detalles.style.display="initial";
    body.style.overflow= "hidden";

    titulo=document.createElement("h3");
    genero=document.createElement("p");
    director=document.createElement("p");
    duracion=document.createElement("p");
    fecha=document.createElement("p");
    calificacion=document.createElement("p");
    plot=document.createElement("p");

    titulo.innerHTML=data.Title;
    genero.innerHTML=data.Genre;
    director.innerHTML=data.Director;
    duracion.innerHTML=data.Runtime;
    fecha.innerHTML=data.Released;
    calificacion.innerHTML=data.imdbRating;
    plot.innerHTML=data.Plot;

    detalles.appendChild(titulo)
    detalles.appendChild(genero)
    detalles.appendChild(director)
    detalles.appendChild(duracion)
    detalles.appendChild(fecha)
    detalles.appendChild(calificacion)
    detalles.appendChild(plot)
}

function ocultarDetalles(){
    fondoGris.style.display="none";
    detalles.style.display="none";
    body.style.overflow= "initial";
}
