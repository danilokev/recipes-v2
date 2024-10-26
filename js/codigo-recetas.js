let contador = 0; // Variable global para contar el número de recetas mostradas 
let fotos = [];
let fotoActual = 0;

function pedirRecetas() {
  let url = 'api/recetas',
    xhr = new XMLHttpRequest();

  xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.onload = function () {
    let respuesta = xhr.response;

    console.log(respuesta);

    if (respuesta.RESULTADO == 'OK') {
      let html = '';

      respuesta.FILAS.slice(0, 6).forEach(function (receta, idx) { // Mostrar solo las 6 primeras recetas
        let id = receta.id; // Guardar el id de la receta

        html += '<article>';
        html += '<a href="receta.html?' + id + '">';
        html += `<img src="fotos/${receta.imagen}" alt="${receta.nombre}">`;
        html += `<h4 title="${receta.nombre}">${receta.nombre}</h4>`;
        html += '</a>';
        html += '<footer class="article-footer">';
        html += `<p><span class="icon-users"></span>${receta.personas}</p>`;
        html += `<p>Dificultad: ${receta.dificultad}</p>`;
        html += `<p><span class="icon-clock"></span>${receta.tiempo}</p>`;
        html += '</footer>'
        html += '</article>';

        contador++;
      });

      document.querySelector('#recetas').innerHTML = html;

      let footerHTML = `<p>Mostrando <span>${contador}</span> resultados de <span>${respuesta.FILAS.length}</span></p>`;
      footerHTML += '<button onclick="verMasRecetas(event)">Mostrar más</button>'
      document.querySelector('#myFooter').innerHTML = footerHTML;
    }
  }

  xhr.send();
}

function verMasRecetas(evt) {
  evt.preventDefault();

  let url = 'api/recetas',
    xhr = new XMLHttpRequest();

  xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.onload = function () {
    let respuesta = xhr.response;

    if (respuesta.RESULTADO == 'OK') {
      let html = '';

      respuesta.FILAS.slice(contador, contador + 6).forEach(function (receta, idx) {
        html += '<article>';
        html += '<a href="receta.html?' + receta.id + '">';
        html += `<img src="fotos/${receta.imagen}" alt="${receta.nombre}">`;
        html += `<h4 title="${receta.nombre}">${receta.nombre}</h4>`;
        html += '</a>';
        html += '<footer class="article-footer">';
        html += `<p><span class="icon-users"></span>${receta.personas}</p>`;
        html += `<p>Dificultad: ${receta.dificultad}</p>`;
        html += `<p><span class="icon-clock"></span>${receta.tiempo}</p>`;
        html += '</footer>'
        html += '</article>';

        contador++;
      });

      document.querySelector('#recetas').innerHTML += html;

      let footerHTML = `<p>Mostrando <span>${contador}</span> resultados de <span>${respuesta.FILAS.length}</span></p>`;
      footerHTML += '<button onclick="verMasRecetas(event)">Mostrar más</button>'
      document.querySelector('#myFooter').innerHTML = footerHTML;
    }
  }

  xhr.send();
}

function mostrarMenu() {
  let ul = document.querySelector('#menu'),
    pagina = document.body.getAttribute('data-pagina'), // Obtener el valor del atributo data-pagina
    html = ''; // Variable para almacenar el código HTML

  // Si la página actual no es index, añadir un enlace a index
  if (pagina != 'index') {
    html += '<li><a class="nav-link" href="./"><span class="icon-home"></span><span>Inicio</span></a></li>';
  }

  // Si la página actual no es buscar, añadir un enlace a buscar
  if (pagina != 'buscar') {
    html += '<li><a class="nav-link" href="./buscar.html"><span class="icon-search"></span><span>Buscar</span></a></li>'
  }

  if (sessionStorage['datos_usuario']) { // si el usuario está logueado
    if (pagina != 'nueva') {
      html += '<li><a class="nav-link" href="./nueva.html"><span class="icon-upload-1"></span><span>Nueva</span></a></li>';
    }

    if (pagina == 'login' || pagina == 'registro') {
      location.href = './';
    }

    html += '<li><a onclick="hacerLogout(event);" href="" class="nav-link"><span class="icon-logout"></span><span>Logout</span></a></li>';
  } else {
    if (pagina != 'login') {
      html += '<li><a class="nav-link" href="./login.html"><span class="icon-login"></span><span>Login</span></a></li>';
    }
    if (pagina != 'registro') {
      html += '<li><a class="nav-link" href="./registro.html"><span class="icon-user-plus"></span><span>Registro</span></a></li>';
    }

    if (pagina == 'nueva') {
      location.href = './';
    }
  }

  ul.innerHTML = html; // Insertar el código HTML en el menú
}

function hacerLogin(evt) {
  evt.preventDefault(); // No se recargue la página

  let form = evt.currentTarget,
    url = 'api/usuarios/login',
    xhr = new XMLHttpRequest(), // Objeto para hacer peticiones al servidor
    datos = new FormData(form); // Obtener datos del formulario

  xhr.open('POST', url, true);

  xhr.responseType = 'json';

  xhr.onload = function () {
    let respuesta = xhr.response;

    console.log(respuesta);

    if (respuesta.RESULTADO == 'OK') {
      // Guardar datos del usuario en sesión 
      sessionStorage['datos_usuario'] = JSON.stringify(respuesta);
      mostrarMensaje(sessionStorage['datos_usuario']);

      // Nota: El método JSON.stringify() convierte un objeto o valor de JavaScript en una cadena de texto JSON 
      // Por ejemplo, JSON.stringify({ x: 5, y: 6 }) devuelve la cadena '{"x":5,"y":6}'
    } else {
      mostrarMensaje();
    }
  }

  xhr.send(datos);
}

function mostrarMensaje(datos_usuario) {
  let dialogo = document.createElement('dialog'),
    html = '';

  if (datos_usuario) {
    let usu = JSON.parse(datos_usuario); // parse() convierte una cadena de texto JSON en un objeto de JavaScript. Por ejemplo, JSON.parse('{"x":5,"y":6}') devuelve el objeto { x: 5, y: 6 }
    html += '<div class="dialogo">'
    html += '<h2>¡Hola de nuevo!</h2>';
    html += '<p>Has iniciado sesión correctamente</p>';
    html += '<div>';
    html += '<button onclick="aceptar();">Aceptar</button>';
    html += '</div>';
    // mostrar la ultima vez que se ha logueado
    html += '<p>Último acceso: ' + usu.ULTIMO_ACCESO + '</p>';
    html += '</div>';
  } else {
    html += '<div class="dialogo">'
    html += '<h2>¡Error!</h2>';
    html += '<p>Usuario o contraseña incorrectos</p>';
    html += '<div>';
    html += '<button onclick="focoLogin();">Aceptar</button>';
    html += '</div>';
    html += '</div>';
  }

  dialogo.innerHTML = html;
  dialogo.oncancel = function () {
    console.log('ESCAPE');
  }
  dialogo.onclose = function () {
    console.log('CLOSE');
  }

  document.body.appendChild(dialogo);

  dialogo.showModal();
}

function aceptar() {
  document.querySelector('dialog').close(); // Cerrar el diálogo
  document.querySelector('dialog').remove(); // Eliminar el diálogo
  location.href = './';
}

function focoLogin() {
  document.querySelector('dialog').close();
  document.querySelector('dialog').remove();
  document.querySelector('#login').focus(); // Poner el foco en el campo login
}

function hacerRegistro(evt) {
  evt.preventDefault();

  let form = evt.currentTarget,
    url = 'api/usuarios/registro',
    xhr = new XMLHttpRequest(),
    datos = new FormData(form);

  xhr.open('POST', url, true);
  xhr.responseType = 'json';

  xhr.onload = function () {
    let respuesta = xhr.response;

    console.log(respuesta);

    if (respuesta.RESULTADO == 'OK') {
      mostrarMensajeRegistro();
    }
  }

  xhr.send(datos);
}

function mostrarMensajeRegistro() {
  let dialogo = document.createElement('dialog'),
    html = '';

  html += '<div class="dialogo">'
  html += '<h2>¡Bienvenido!</h2>';
  html += '<p>Te has registrado correctamente</p>';
  html += '<div>';
  html += '<button onclick="aceptarRegistro();">Aceptar</button>';
  html += '</div>';
  html += '</div>';

  dialogo.innerHTML = html;

  document.body.appendChild(dialogo);

  dialogo.showModal();
}

function aceptarRegistro() {
  document.querySelector('dialog').close();
  document.querySelector('dialog').remove();
  location.href = './login.html';
}

function hacerLogout(evt) {
  evt.preventDefault();

  let url = 'api/usuarios/logout',
    xhr = new XMLHttpRequest(),
    usu = JSON.parse(sessionStorage['datos_usuario']),
    token;

  token = usu.LOGIN + ':' + usu.TOKEN;

  xhr.open('POST', url, true);
  xhr.responseType = 'json';
  xhr.onload = function () {
    let r = xhr.response;

    if (r.RESULTADO == 'OK') {
      sessionStorage.removeItem('datos_usuario');
      location.href = './';
    }
  }

  xhr.setRequestHeader('Authorization', token);
  xhr.send();
}

function mostrarInfoReceta() {
  let idReceta = location.search.substring(1); // substring(1) para quitar el signo de interrogación

  if (isNaN(idReceta)) {
    location.href = 'index.html';
  } else {
    let url = 'api/recetas',
      xhr = new XMLHttpRequest();

    url += '/' + idReceta;
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function () {
      let r = xhr.response;
      console.log(r);

      if (r.RESULTADO == 'OK') {
        let receta = r.FILAS[0],
          html = '',
          autor = '',
          fecha = new Date(receta.fechaCreacion),
          meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
          fechaFormatoAutor = `${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`;

        html += '<div class="receta-dificultad">';
        html += `<p><span class="icon-users"></span>${receta.personas}</p>`;
        html += `<p>Dificultad: ${receta.dificultad}</p>`;
        html += `<p><span class="icon-clock"></span>${receta.tiempo}</p>`;
        html += '</div>';

        autor += `<p>Autor: <a href="buscar.html">${receta.autor}</a></p>`;
        autor += `<p>Fecha de elaboración: ${fechaFormatoAutor}</p>`;

        document.querySelector('h3').innerHTML = receta.nombre;
        document.querySelector('#texto-elaboracion').innerHTML = receta.elaboracion;
        document.querySelector('#detalles-receta').innerHTML = html;
        document.querySelector('#detalles-autor').innerHTML = autor;
        // Pedir ingredientes
        mostrarIngredientes(idReceta);
        // Pedir etiquetas
        mostrarEtiquetas(idReceta);
        // Pedir fotos
        mostrarImagenes(idReceta);
        // Pedir comentarios
        mostrarComentarios(idReceta);
      }
    }

    xhr.send();
  }
}

function mostrarComentarios(idReceta) {
  let url = 'api/recetas/' + idReceta + '/comentarios',
    xhr = new XMLHttpRequest();

  xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.onload = function () {
    let r = xhr.response;

    if (r.RESULTADO == 'OK') {
      let html = '';

      r.FILAS.forEach(function (comentario, idx) {
        let fecha = new Date(comentario.fechaHora),
          meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
          fechaFormato = `${fecha.getDate()}/${meses[fecha.getMonth()]}/${fecha.getFullYear()}, ${fecha.getHours()}:${fecha.getMinutes() < 10 ? '0' : ''}${fecha.getMinutes()}`;

        html += '<div class="comentario">';
        html += `<p><strong>${comentario.titulo}</strong></p>`;
        html += `<p>${comentario.texto}</p>`;
        html += '<footer class="coment-footer">';
        html += `<p class="fecha">${fechaFormato}</p>`;
        html += `<p>Autor: <strong>${comentario.login}</strong></p>`;
        html += '</footer>'
        html += '</div>';
      });

      document.querySelector('#comentarios').innerHTML = html;
    }
  }

  xhr.send();
}

function mostrarImagenes(idReceta) {
  let fotos = [];
  let fotoActual = 0;

  let url = 'api/recetas/' + idReceta + '/fotos',
    xhr = new XMLHttpRequest();

  xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.onload = function () {
    let r = xhr.response;

    if (r.RESULTADO == 'OK') {
      console.log(r);
      r.FILAS.forEach(function (foto, idx) {
        fotos.push({
          archivo: 'fotos/' + foto.archivo,
          descripcion: foto.descripcion
        });
      });
      carruselFotos(fotos, fotoActual);
    }
  }

  xhr.send();
}

function carruselFotos(fotos, fotoActual) {
  let foto = fotos[fotoActual],
    html = '<div>';
  html += `<img src="${foto.archivo}" alt="${foto.descripcion}">`;
  html += `<p>${foto.descripcion}</p>`;
  html += '</div>';
  html += '<div>';
  html += '<button onclick="fotoAnterior();">Anterior</button>';
  html += '<button>Anterior</button>';
  html += '<button onclick="fotoSiguiente();">Siguiente</button>';
  html += '<button>Siguiente</button>';
  html += '</div>';

  document.querySelector('#fotos-recetas').innerHTML = html;
}

function fotoAnterior() {
  fotoActual--;
  if (fotoActual < 0) {
    fotoActual = fotos.length - 1;
  }
  carruselFotos();
}

function fotoSiguiente() {
  fotoActual++;
  if (fotoActual >= fotos.length) {
    fotoActual = 0;
  }
  carruselFotos();
}

function mostrarIngredientes(idReceta) {
  let url = 'api/recetas/' + idReceta + '/ingredientes',
    xhr = new XMLHttpRequest();

  xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.onload = function () {
    let r = xhr.response;

    if (r.RESULTADO == 'OK') {
      let html = '';

      r.FILAS.forEach(function (ingrediente, idx) {
        html += `<li>${ingrediente.texto}</li>`;
      });

      document.querySelector('#ingr-recetas').innerHTML = html;
    }
  }

  xhr.send();
}

function mostrarEtiquetas(idReceta) {
  let url = 'api/recetas/' + idReceta + '/etiquetas',
    xhr = new XMLHttpRequest();

  xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.onload = function () {
    let r = xhr.response;

    if (r.RESULTADO == 'OK') {
      let html = '';

      r.FILAS.forEach(function (etiqueta, idx) {
        html += `<li>${etiqueta.nombre}</li>`;
      });

      document.querySelector('#eti-recetas').innerHTML = html;
    }
  }

  xhr.send();
}

function pedirFormulario() {
  let url = 'formulario.html',
    xhr = new XMLHttpRequest();

  xhr.open('GET', url, true);
  xhr.onload = function () {
    let html = xhr.responseText; // Obtener el contenido del archivo formulario.html

    if (sessionStorage['datos_usuario']) {
      document.querySelector('#formulario').innerHTML = html; // Insertar el contenido en el div con id formulario
    } else {
      let login = '<p>Para poder dejar un comentario tienes que hacer <a href="login.html">login</a>.</p>'
      document.querySelector('#comentario-login').innerHTML = login;
    }
  }

  xhr.send();
}

function dejarComentario(evt) {
  evt.preventDefault(); 

  let form = evt.currentTarget,
    url = 'api/recetas/' + location.search.substring(1) + '/comentarios',
    xhr = new XMLHttpRequest(),
    datos = new FormData(form),
    usu = JSON.parse(sessionStorage['datos_usuario']),
    token = usu.LOGIN + ':' + usu.TOKEN;

  xhr.open('POST', url, true);
  xhr.responseType = 'json';
  xhr.onload = function () {
    let respuesta = xhr.response;

    console.log(respuesta);

    if (respuesta.RESULTADO == 'OK') {
      mostrarComentarios(location.search.substring(1));
      mensajeComentario();

      form.reset(); // Limpiar el formulario
    }
  }

  xhr.setRequestHeader('Authorization', token);
  xhr.send(datos);
}

function mensajeComentario() {
  let dialogo = document.createElement('dialog'),
    html = '';
  html += '<div class="dialogo">'
  html += '<h2>¡Gracias por tu comentario!</h2>';
  html += '<p>El comentario se ha añadido correctamente</p>';
  html += '<div>';
  html += '<button onclick="aceptarComentario();">Aceptar</button>';
  html += '</div>';
  html += '</div>';

  dialogo.innerHTML = html;

  document.body.appendChild(dialogo);

  dialogo.showModal();
}

function aceptarComentario() {
  document.querySelector('dialog').close();
  document.querySelector('dialog').remove();
}

function buscarRecetas(evt) {
  evt.preventDefault();

  let form = evt.currentTarget,
    url = 'api/recetas',
    xhr = new XMLHttpRequest(),
    datos = new FormData(form),
    ingredientes = datos.getAll('ingredientes[]').flatMap(i => i.split(',')),
    etiquetas = datos.getAll('etiquetas[]').flatMap(e => e.split(',')),
    dificultad = datos.get('dificultad'),
    nombre = datos.get('nombre');

  // Nota: flatMap() se utiliza para aplanar un array de arrays en un solo array. Por ejemplo, [[1, 2], [3, 4]] se convierte en [1, 2, 3, 4]

  url += '?i=' + ingredientes.join('&i=') + '&e=' + etiquetas.join('&e=') + '&d=' + dificultad + '&t=' + nombre;

  xhr.open('GET', url, true);
  xhr.responseType = 'json';

  xhr.onload = function () {
    let respuesta = xhr.response;

    if (respuesta.RESULTADO == 'OK') {
      let html = '';

      respuesta.FILAS.forEach(function (receta, idx) {
        html += '<article>';
        html += '<a href="receta.html?' + receta.id + '">'; // Enlazar a la receta con su id correspondiente 
        html += `<img src="fotos/${receta.imagen}" alt="${receta.nombre}">`;
        html += `<h4 title="${receta.nombre}">${receta.nombre}</h4>`;
        html += '</a>';
        html += '<footer class="article-footer">';
        html += `<p><span class="icon-users"></span>${receta.personas}</p>`;
        html += `<p>Dificultad: ${receta.dificultad}</p>`;
        html += `<p><span class="icon-clock"></span>${receta.tiempo}</p>`;
        html += '</footer>'
        html += '</article>';
      });

      document.querySelector('#recetasBuscar').innerHTML = html;

      let footerHTML = `<p>Mostrando <span>${respuesta.FILAS.length}</span> resultados</p>`;
      document.querySelector('#myFooter').innerHTML = footerHTML;

      form.reset();
    }
  }

  xhr.send();
}

function comprobarLogin(inp) {
  let url = 'api/usuarios/' + inp.value,
    xhr = new XMLHttpRequest();

  xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.onload = function () {
    let respuesta = xhr.response;

    if (respuesta.RESULTADO == 'OK') {
      if (inp.parentElement.querySelector('p.error')) {
        inp.parentElement.querySelector('p.error').remove();
      }

      if (!respuesta.DISPONIBLE) {
        let p = document.createElement('p');
        p.innerHTML = 'El usuario ya existe';
        p.classList.add('error');
        inp.parentElement.appendChild(p);
      }
    }
  }

  xhr.send();
}

function comprobarContrasenas() {
  let contrasena = document.querySelector('#pwd'),
    confirmar = document.querySelector('#rpwd');

  if (contrasena.value != confirmar.value) {
    if (!confirmar.parentElement.querySelector('p.errorPassword') && confirmar.value != '') {
      let p = document.createElement('p');
      p.innerHTML = 'Las contraseñas no coinciden';
      p.classList.add('errorPassword');
      confirmar.parentElement.appendChild(p);
    }
  } else {
    if (confirmar.parentElement.querySelector('p.errorPassword')) {
      confirmar.parentElement.querySelector('p.errorPassword').remove();
    }
  }
}

function crearReceta(evt) {
  evt.preventDefault();

  let form = evt.currentTarget,
    url = 'api/recetas',
    xhr = new XMLHttpRequest(),
    datos = new FormData(form),
    usu = JSON.parse(sessionStorage['datos_usuario']),
    token = usu.LOGIN + ':' + usu.TOKEN,
    ingredientes = document.querySelectorAll('#ingredientes > li'),
    etiquetas = document.querySelectorAll('#etiquetas > li'),
    fotos = document.querySelectorAll('#fotos > div');

  datos.append('fotos[]', fotos.length);

  ingredientes.forEach(function (li, idx) {
    // esto lo que hace es coger el texto que hay dentro de la etiqueta span
    let texto = li.querySelector('span').textContent;

    datos.append('ingredientes[]', texto);
  });

  etiquetas.forEach(function (li, idx) {
    let texto = li.querySelector('span').textContent;

    datos.append('etiquetas[]', texto);
  });

  xhr.open('POST', url, true);
  xhr.responseType = 'json';
  xhr.onload = function () {
    let respuesta = xhr.response;

    console.log(respuesta);

    if (respuesta.RESULTADO == 'OK') {
      let nombreReceta = datos.get('nombre'); // datos.get('nombre') obtiene el valor del campo nombre del formulario
      mensajeRecetaGuardada(nombreReceta);
    }
  }

  xhr.setRequestHeader('Authorization', token);
  xhr.send(datos);
}

function mensajeFotos() {
  let dialogo = document.createElement('dialog'),
    html = '';
  html += '<div class="dialogo">'
  html += '<h2>¡Error!</h2>';
  html += '<p>Debes subir al menos una foto</p>';
  html += '<div>';
  html += '<button onclick="aceptarFoto();">Aceptar</button>';
  html += '</div>';
  html += '</div>';

  dialogo.innerHTML = html;

  document.body.appendChild(dialogo);

  dialogo.showModal();
}

function mensajeRecetaGuardada(nom) {
  let dialogo = document.createElement('dialog'),
    html = '';
  html += '<div class="dialogo">'
  html += '<h2>¡Receta guardada!</h2>';
  html += `<p>La receta se ha guardado correctamente: ${nom}</p>`;
  html += '<div>';
  html += '<button onclick="aceptarMensajeReceta();">Aceptar</button>';
  html += '</div>';
  html += '</div>';

  dialogo.innerHTML = html;

  document.body.appendChild(dialogo);

  dialogo.showModal();
}

function aceptarMensajeReceta() {
  document.querySelector('dialog').close();
  document.querySelector('dialog').remove();
  location.href = './';
}

function anyadirIngrediente() {
  let ingrediente = document.querySelector('#ingr').value,
    li = document.createElement('li');

  li.innerHTML = '<span>' + ingrediente + '</span><span onclick="eliminarElemento(this)"><span class="icon-cancel"></span></span>';

  document.querySelector('#ingredientes').appendChild(li);
  document.querySelector('#ingr').value = '';
}

function anyadirEtiqueta() {
  let etiqueta = document.querySelector('#eti').value,
    li = document.createElement('li');

  li.innerHTML = '<span>' + etiqueta + '</span><span onclick="eliminarElemento(this)"><span class="icon-cancel"></span></span>';

  document.querySelector('#etiquetas').appendChild(li);
  document.querySelector('#eti').value = '';
}

function anyadirFoto(evt) {
  evt.preventDefault();

  let div = document.createElement('div');
  let html = '';

  html += '<span>';
  html += '<span onclick="subirFotoIcon(event);"><span class="icon-upload-1"></span></span>';
  html += '<span onclick="eliminarElementoFoto(this)"><span class="icon-cancel"></span></span>';
  html += '</span>';
  html += '<input type="file" name="fotos[]" accept="image/*" onchange="mostrarFoto(this);">';
  html += '<img id="preview" src="images/Upload-photo-image.png" alt="imagen de receta" onclick="subirFoto(event);">';
  html += '<textarea name="descripciones[]" maxlength="200" placeholder="Escribe tu texto aquí..." required></textarea>';

  div.innerHTML = html;
  div.classList.add('form-input');

  document.querySelector('#fotos').appendChild(div);
}

function eliminarElemento(spn) {
  spn.parentElement.remove();
}

function eliminarElementoFoto(spn) {
  spn.parentElement.parentElement.remove();
}

function subirFoto(evt) {
  evt.preventDefault();

  let ficha = evt.currentTarget.parentElement;

  ficha.querySelector('input[type="file"]').click();
}

function subirFotoIcon(evt) {
  evt.preventDefault();

  let ficha = evt.currentTarget.parentElement.parentElement;

  ficha.querySelector('input[type="file"]').click();
}

function mostrarFoto(inp) {
  let fichero = inp.files[0],
    img = inp.parentElement.querySelector('img'),
    reader = new FileReader(),
    tamano = fichero.size / 1024;

  reader.onload = function () {
    img.src = reader.result;
  }

  if (fichero) {
    if (tamano > 200) {
      mensajeFoto();
      return;
    }

    reader.readAsDataURL(fichero);
  } else {
    img.src = "";
  }
}

function mensajeFoto() {
  let dialogo = document.createElement('dialog'),
    html = '';
  html += '<div class="dialogo">'
  html += '<h2>¡Error!</h2>';
  html += '<p>La imagen no puede superar los 200 KB</p>';
  html += '<div>';
  html += '<button onclick="aceptarFoto();">Aceptar</button>';
  html += '</div>';
  html += '</div>';

  dialogo.innerHTML = html;

  document.body.appendChild(dialogo);

  dialogo.showModal();
}

function aceptarFoto() {
  document.querySelector('dialog').close();
  document.querySelector('dialog').remove();
}

function pedirEtiquetas() {
  let url = 'api/etiquetas',
    xhr = new XMLHttpRequest();

  xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.onload = function () {
    let r = xhr.response;

    if (r.RESULTADO == 'OK') {
      let html = '';

      r.FILAS.forEach(function (etiqueta, idx) {
        html += `<option value="${etiqueta.nombre}"></option>`;
      });

      document.querySelector('#lista').innerHTML = html;
    }
  }

  xhr.send();
}