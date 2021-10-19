function genera_tabla() {
  // Obtener la referencia del elemento body
  var body = document.getElementsByTagName("body")[0];

  // Crea un elemento <table> y un elemento <tbody>
  var tabla   = document.createElement("table");
  var tblBody = document.createElement("tbody");
  var tblHead = document.createElement("thead");
  var d_head = document.createElement('tr');
  var t_cell = document.createElement('td');
  var t2_cell = document.createElement('td');
  var title_1 = document.createTextNode("titulo 1");
  var title_2 = document.createTextNode("titulo 2");
  t_cell.appendChild(title_1);
  t2_cell.appendChild(title_2);
  d_head.appendChild(t_cell);
  d_head.appendChild(t2_cell);
  tblHead.appendChild(d_head);
  tabla.appendChild(tblHead);

  // Crea las celdas
  for (var i = 0; i < 10; i++) {
    // Crea las hileras de la tabla
    var hilera = document.createElement("tr");

    for (var j = 0; j < 2; j++) {
      // Crea un elemento <td> y un nodo de texto, haz que el nodo de
      // texto sea el contenido de <td>, ubica el elemento <td> al final
      // de la hilera de la tabla
      var celda = document.createElement("td");
      var textoCelda = document.createTextNode("celda en la hilera "+i+", columna "+j);
      celda.appendChild(textoCelda);
      hilera.appendChild(celda);
    }

    // agrega la hilera al final de la tabla (al final del elemento tblbody)
    tblBody.appendChild(hilera);
  }

  // posiciona el <tbody> debajo del elemento <table>
  tabla.appendChild(tblBody);
  // appends <table> into <body>
  body.appendChild(tabla);
  // modifica el atributo "border" de la tabla y lo fija a "2";
  tabla.setAttribute("border", "2");
  tabla.className = "table table-bordered";
}
genera_tabla();