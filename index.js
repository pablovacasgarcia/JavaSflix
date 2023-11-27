window.onload = () => {
    peliculasDiv = document.getElementById("peliculas");
    informesDiv = document.getElementById("informes");
    input = document.getElementById("buscar");
    fondoGris = document.getElementById("fondoGris");
    detalles = document.getElementById("detalles");
    seriesBtn = document.getElementById("seriesBtn");
    pelisBtn = document.getElementById("pelisBtn");
    closeSearch = document.getElementById("closeSearch");
    crearInforme = document.getElementById("informe");
    cerrarInforme = document.getElementById("cerrarinforme");
    calificacionDiv = document.getElementById("calificacion");
    recaudacionDiv = document.getElementById("recaudacion");
    votosDiv = document.getElementById("votos");
    loader = document.getElementById("loader");
    body = document.querySelector("body");
    header = document.querySelector("header");

    // Cargar la biblioteca de Google Charts
    google.charts.load('current', {'packages':['corechart']});    

    apiKey = "b972f468";
    series = false;
    
    // Agregar un listener al evento scroll
    window.addEventListener('scroll', ()=>{if(peliculasDiv.style.display!="none"){scrollInfinito()}});

    input.addEventListener("input", buscar); 

    fondoGris.addEventListener("click", ocultarDetalles);

    seriesBtn.addEventListener("click", () => {
        series=true; 
        buscar()
        seriesBtn.style.textDecoration="underline";
        pelisBtn.style.textDecoration="none";
        cerrarInforme.style.top="-10%";
    });
    pelisBtn.addEventListener("click", () => {
        series=false;
        buscar()
        pelisBtn.style.textDecoration="underline";
        seriesBtn.style.textDecoration="none";
        cerrarInforme.style.top="-10%";
    });

    closeSearch.addEventListener("click", ()=>{
        input.value="";
        peliculasDiv.innerHTML="";
        body.style.backgroundImage="url(img/fondo.jpg)";
        header.style.height="180px";
        crearInforme.style.top="-10%";
        cerrarInforme.style.top="-10%";
        loader.style.display="none";
        document.getElementById("informes").style.display="none";
    })

    crearInforme.addEventListener("click", mostrarInforme);
    cerrarInforme.addEventListener("click", cerrarInformes);
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
                    crearInforme.style.top="3%";
                } else {
                    maxPags = 2;
                    crearInforme.style.top="-10%";
                    noResultados=document.createElement("h5");
                    noResultados.innerHTML="No se han encontrado resultados";
                    peliculasDiv.appendChild(noResultados);
                }
                loader.style.display="none";
            } else if (this.readyState < 4){
                loader.style.display="initial";
            }
        };
        xhttp.open("GET", "https://www.omdbapi.com/?apikey=" + apiKey + "&s=" + title + "&page=" + pagNum + "&type=" + type, true);
        xhttp.send();
    }
}

function mostrarPeliculas(peliculas) {
    body.style.overflow = "initial";
    peliculas.forEach((pelicula) => {
        mostrarPelicula(pelicula, peliculasDiv)
    });
    
    cargando = false;
    loader.style.display="none";
}

function mostrarPelicula(pelicula, div){
    peliculaDiv = document.createElement("div");
    peliculaDiv.id=pelicula.imdbID;
    peliculaDiv.className = "pelicula";
    if (pelicula.Poster!="N/A"){
        peliculaDiv.style.backgroundImage = "url(" + pelicula.Poster + ")";
    } else {
        peliculaDiv.style.backgroundImage = "url(img/noEncontrado.jpg)";
    }
    title = document.createElement("h2");
    if (div==peliculasDiv){
        title.innerHTML = pelicula.Title;
    } else if (div==calificacionDiv){
        title.innerHTML = pelicula.imdbRating;
    } else if (div==recaudacionDiv){
        title.innerHTML = pelicula.BoxOffice;
    } else if (div==votosDiv){
        title.innerHTML = pelicula.imdbVotes;
    }
    
    peliculaDiv.appendChild(title);

    div.appendChild(peliculaDiv);

    peliculaDiv.addEventListener("click", mostarDetalles)
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
    peliculasDiv.style.display="flex";
    peliculasDiv.innerHTML="";
    informesDiv.style.display="none";
    cerrarInforme.style.top="-10%";
    pagNum=1;

    if (input.value.length >= 3){
        busqueda = input.value.replace(" ", "+");
        cargarPelis(busqueda);
        body.style.backgroundImage="none";
        body.style.backgroundColor="black";
        header.style.height="100px";
    } else if (input.value.length == 0){
        body.style.backgroundImage="url(img/fondo.jpg)";
        header.style.height="180px";
        crearInforme.style.top="-10%";
        loader.style.display="none";
    }
}

function mostarDetalles(e){

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            data = JSON.parse(this.responseText);
            escribirDetalles(data);
            loader.style.display="none";
        } else if (this.readyState == 2){
            loader.style.display="initial";
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
    actores=document.createElement("p");
    duracion=document.createElement("p");
    fecha=document.createElement("p");
    calificacion=document.createElement("p");
    plot=document.createElement("p");
    imagen=document.createElement("img");

    titulo.innerHTML=data.Title;
    detalles.appendChild(titulo)

    if (data.Genre!="N/A"){
        genero.innerHTML="Género: "+data.Genre;
        detalles.appendChild(genero)
    }
    
    if (data.Type=="series"){
        if (data.Writer!="N/A"){
            director.innerHTML="Escritor: "+data.Writer;
        }
    } else {
        if (data.Director!="N/A"){
            director.innerHTML="Director: "+data.Director;
        }
        detalles.appendChild(director)
    }
    if (data.Actors!="N/A"){
        actores.innerHTML="Actores: "+data.Actors;
        detalles.appendChild(actores)
    }
    if (data.Runtime!="N/A"){
        duracion.innerHTML="Duración: "+data.Runtime;
        detalles.appendChild(duracion)
    }
    if (data.Released!="N/A"){
        fecha.innerHTML="Estreno: "+data.Released;
        detalles.appendChild(fecha)
    }
    data.Ratings.forEach(rating => {
        calificacion.innerHTML+=rating.Source+": "+rating.Value+"<br>";
        detalles.appendChild(calificacion)
    });
    if (data.Plot!="N/A"){
        plot.innerHTML=data.Plot;
        detalles.appendChild(plot)
    }
    if (data.Poster!="N/A"){
        imagen.src=data.Poster;
        detalles.appendChild(imagen)
    }
    
}

function ocultarDetalles(){
    fondoGris.style.display="none";
    detalles.style.display="none";
    body.style.overflow= "initial";
}

function mostrarInforme() {
    peliculasDiv.style.display = "none";
    crearInforme.style.top = "-10%";
    informesDiv.style.display = "flex";
    calificacionDiv.innerHTML="";
    recaudacionDiv.innerHTML="";
    votosDiv.innerHTML="";
    cerrarInforme.style.top="3%";
    

    peliculas = new Array;
    peliculas = document.querySelectorAll(".pelicula");
    loader.style.display="initial";

    // Función para hacer una solicitud y devolver una promesa
    function hacerSolicitud(url) {
        return new Promise(function (resolve, reject) {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        resolve(JSON.parse(this.responseText));
                    } else {
                        reject(new Error("Error en la solicitud"));
                    }
                }
            };
            xhttp.open("GET", url, true);
            xhttp.send();
        });
    }

    // Array de promesas para todas las solicitudes
    var promesas = new Array;

    peliculas.forEach(pelicula => {
        var url = "https://www.omdbapi.com/?apikey=" + apiKey + "&i=" + pelicula.id;
        promesas.push(hacerSolicitud(url));
    });

    // Esperar a que todas las promesas se resuelvan
    Promise.all(promesas)
        .then(function (resultados) {
            loader.style.display="none";
            // Llamar a la función de dibujo después de cargar la biblioteca
            dibujarGraficos(resultados);

            informesCalificacion = [...resultados].filter(pelicula => pelicula.imdbRating !== "N/A");

            informesCalificacion = informesCalificacion.sort(function (a, b) {
                return parseFloat(b.imdbRating) - parseFloat(a.imdbRating);
            });

            for (let i=0; i<5; i++) {
                mostrarPelicula(informesCalificacion[i], calificacionDiv)
            }

            if (resultados[0].Type!="series"){
                document.getElementById("BoxOffice-chart").style.display="initial";
                informesRecaudacion = [...resultados].filter(pelicula => pelicula.BoxOffice !== "N/A");
                informesRecaudacion=informesRecaudacion.sort(function (a, b) {
                    return parseInt(b.BoxOffice.replace(/[^d.-e]/g, "")) - parseInt(a.BoxOffice.replace(/[^d.-e]/g, ""));
                });    
                
                for (let i=0; i<5; i++) {
                    mostrarPelicula(informesRecaudacion[i], recaudacionDiv)
                }
    
            } else {
                document.getElementById("BoxOffice-chart").style.display="none";
            }

            informesVotos = [...resultados].filter(pelicula => pelicula.imdbVotes !== "N/A");

            informesVotos = informesVotos.sort(function (a, b) {
                return parseInt(b.imdbVotes.replace(/[^d.-e]/g, "")) - parseInt(a.imdbVotes.replace(/[^d.-e]/g, ""));
            })


            for (let i=0; i<5; i++) {
                mostrarPelicula(informesVotos[i], votosDiv)
            }

            
        })
        .catch(function (error) {
            console.error("Error al realizar las solicitudes:", error);
        });

}


function dibujarGraficos(resultados) {
    // Obtener datos relevantes para los gráficos
    var informesCalificacion = obtenerDatosValidos(resultados, 'imdbRating');
    var informesRecaudacion = obtenerDatosValidos(resultados, 'BoxOffice');
    var informesVotos = obtenerDatosValidos(resultados, 'imdbVotes');

    // Dibujar gráficos
    dibujarGraficoBarras('Calificación', 'Rating', 'imdbRating', informesCalificacion);
    if (resultados[0].Type!="series"){
        dibujarGraficoBarras('Recaudación', 'Dólares', 'BoxOffice', informesRecaudacion);
    }
    dibujarGraficoBarras('Votos', 'Número de Votos', 'imdbVotes', informesVotos);
}

// Función para dibujar un gráfico de barras
function dibujarGraficoBarras(titulo, ejeX, atributo, datos) {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Título');
    data.addColumn('number', ejeX);

    // Agregar datos al DataTable
    datos.forEach(pelicula => {
        if (atributo=="imdbRating"){
            data.addRow([pelicula.Title, parseFloat(pelicula[atributo])]);
        } else if (atributo=="BoxOffice"){
            data.addRow([pelicula.Title, parseInt(pelicula[atributo].replace(/,/g, "").replace("$", ""))]);
        } else if (atributo=="imdbVotes"){
            data.addRow([pelicula.Title, parseInt(pelicula[atributo].replace(/,/g, ""))]);
        }
    });

    var options = {
        title: titulo,
        legend: 'none', // Puedes cambiar esto según tus preferencias
        hAxis: {
            title: 'Películas'
        },
        vAxis: {
            title: ejeX
        },
        backgroundColor: 'black', // Cambiar el color del fondo
        colors: ['white'], // Cambiar el color de las barras
        textStyle: {
            color: 'white' // Cambiar el color del texto
        },
        width: 800
    };

    document.getElementById(atributo+"-chart").innerHTML="";
    var chart = new google.visualization.ColumnChart(document.getElementById(atributo+"-chart"));

    chart.draw(data, options);
}

// Función para filtrar películas con datos válidos en un atributo específico
function obtenerDatosValidos(peliculas, atributo) {
    return peliculas.filter(pelicula => pelicula[atributo] !== 'N/A');
}

function cerrarInformes(){
    cerrarInforme.style.top="-10%";
    crearInforme.style.top="3%";
    peliculasDiv.style.display="flex";
    informesDiv.style.display="none";
}
