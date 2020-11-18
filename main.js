//Experiencia
function InitializeSelect() {
  $("#input_experiencias").select2();
  GetExperiences();
}
function LimpiarSelect() {
  $("#input_experiencias").val("null").trigger("change");
}
function SelectHasSelectedElement() {
  return $("#input_experiencias").val() == "null";
}

//Obtener elemento seleccionado:
function GetExperienceIdSelect() {
  return $("#input_experiencias").val();
}
var table;
var table2;
var table3;
var serverApi = "https://vmi351008.contaboserver.net:2011/";

// Popular Selector de experiencias
function GetExperiences() {
  $.ajax({
    url: serverApi + "api/experiencedrafts/",
    beforeSend: function (request) {
      request.setRequestHeader(
        "Authorization",
        "Bearer " +
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBiYWl0LmNvbSIsImp0aSI6Ijc1N2JiMDRmLWE4YzYtNGY4Ny04ODAyLWQ1ZDVmZDdlNWZlYyIsImVtYWlsIjoiYWRtaW5AYmFpdC5jb20iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW5AYmFpdC5jb20iLCJuYmYiOjE2MDU2MzU5NTgsImV4cCI6MTYwNTYzNTk3OCwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NDQzMjEiLCJhdWQiOiJodHRwczovL2xvY2FsaG9zdDo0NDMyMSJ9.yKuET9_lAt9PISFL_WODr8huv6tI65yNERkU_5WPZfU"
      );
    },
    type: "GET",
    contentType: "application/json",
  })
    .done(function (result) {
      experiences = result.data.items;
      for (let index_item in experiences) {
        $("#input_experiencias")
          .append(`<option value="${experiences[index_item].idExperience}">
    ${experiences[index_item].name}
   </option>`);
      }
      //hideExperiencesSelectLoader();
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      console.log(
        "XHR ERROR " + jqXHR.status + " - ResponseText:" + jqXHR.responseText
      );
    });
}

//Disparar la obtencion de datos del reporte una vez q se selecciona una experiencia
$("#input_experiencias").change(function () {
  if (this.value !== "null") {
    selectedExperienceID = this.value;
  } else {
    selectedExperienceID = "";
  }
});

var selectedExperienceID = "";
var serverGdApi = "https://vmi351008.contaboserver.net:2021/";
function GetExperiencesOutputId(ID) {
  //Parametros de fecha
  let fromDate = moment(document.getElementById("from_date").value).format(
    "YYYY-MM-DD"
  );
  let toDate = moment(document.getElementById("to_date").value).format(
    "YYYY-MM-DD"
  );
  $.ajax({
    url:
      serverGdApi +
      `api/ExperienceStats?idExperience=${ID}&fromDateTime=${fromDate}&toDateTime=${toDate}`,

    type: "GET",
    contentType: "application/json",
    beforeSend: function (request) {
      request.setRequestHeader(
        "Authorization",
        "Bearer " +
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBiYWl0LmNvbSIsImp0aSI6Ijc1N2JiMDRmLWE4YzYtNGY4Ny04ODAyLWQ1ZDVmZDdlNWZlYyIsImVtYWlsIjoiYWRtaW5AYmFpdC5jb20iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW5AYmFpdC5jb20iLCJuYmYiOjE2MDU2MzU5NTgsImV4cCI6MTYwNTYzNTk3OCwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NDQzMjEiLCJhdWQiOiJodHRwczovL2xvY2FsaG9zdDo0NDMyMSJ9.yKuET9_lAt9PISFL_WODr8huv6tI65yNERkU_5WPZfU"
      );
    },
    success: function (json) {
      //Validacion
      if (
        json.data.openedQuestions == null ||
        json.data.closedQuestions == null
      ) {
        alertify.error("Questions devolvio nulo, la pagina se recargara");
        setTimeout(function () {
          location.reload();
        }, 3000);
      }
      //Obtencion de datos
      var numero = {
        participantes: json.data.numberOfParticipants,
        finalizado: json.data.numberOfFinishedSequences,
      };
      var datos = {
        Alias: json.data.alias,
        Creacion: moment(json.data.creationDate).format("ll"),
        PrimerMsg: moment(json.data.firstMessageDate).format("ll"),
        UltimoMsg: moment(json.data.lastMessageDate).format("ll"),
        FiltroDesde: moment(json.data.filteredFromDate).format("ll"),
        FiltroHasta: moment(json.data.filteredToDate).format("ll"),
      };

      //Recorrer preguntas cerradas
      var questions = json.data.closedQuestions.questions;
      var filas = questions.map(function (v) {
        return {
          alias: v.alias,
          pregTotal: v.preguntasTotales,
          correctas: v.respuestasCorrectas,
          incorrectas: v.respuestasIncorrectas,
        };
      });
      console.log(questions);
      var questions = json.data.closedQuestions.questions;
      var dataReport = questions.slice(0, 1).map(function (v) {
        return {};
      });
      //Recorrer preguntas abiertas
      var questions = json.data.openedQuestions.questions;
      var filasDos = questions.map(function (v) {
        return {
          alias: v.alias,
          ptotales: v.preguntasTotales,
          rtotales: v.respuestasTotales,
        };
      });
      //Destruir la tabla si se cambia la seleccion de experiencia
      if (table) {
        table.destroy();
      }
      //Definicion tabla uno (Preguntas abiertas)
      table = $("#tablaUno").DataTable({
        searching: false,
        info: false,
        paging: false,
        ordering: false,
        select: true,
        data: filas,
        columns: [
          {
            title: "Alias",
            data: "alias",
          },
          {
            title: "Correctas",
            data: "correctas",
            className: "text-success",
          },
          {
            title: "Incorrectas",
            data: "incorrectas",
            className: "text-danger",
          },
          {
            title: "N/R",
            data: null,
            render: function (data, type, row) {
              return numero.participantes - (data.correctas + data.incorrectas);
            },
            className: "text-warning",
          },
          {
            title: "Total",
            data: null,
            render: function (data, type, row) {
              return data.incorrectas + data.correctas + (numero.participantes - (data.correctas + data.incorrectas));
            },
          },
        ],
      });

      //Destruir la tabla si se cambia la seleccion de experiencia
      if (table2) {
        table2.destroy();
      }

      //Definicion tabla uno (Preguntas cerradas)
      table2 = $("#tablaDos").DataTable({
        searching: false,
        info: false,
        select: true,
        paging: false,
        ordering: false,
        data: filasDos,
        columns: [
          {
            width: "10%",
            title: "Alias",
            data: "alias",
          },
          {
            width: "5%",
            title: "Respuestas",
            data: "rtotales",
            className:"text-success"
          },
          {
            title: "N/R",
            data: null,
            render: function (data, type, row) {
              return numero.participantes - data.rtotales;
            },
            className:"text-warning"
          },
          {
            width: "5%",
            title: "Totales",
            data: "ptotales",
          },
        ],
      });
      //Destruir la tabla si se cambia la seleccion de experiencia
      if (table3) {
        table3.destroy();
      }

      //Definicion tabla uno (Datos)
      table3 = $("#tablaTres").DataTable({
        searching: false,
        info: false,
        paging: false,
        ordering: false,
        data: dataReport,
        columns: [
          {
            title: "Datos",
            data: null,
            render: function (data, type, row) {
              return (
                "<strong>Participantes: </strong>" +
                numero.participantes +
                "<br>" +
                "<strong>Finalizaron: </strong>" +
                numero.finalizado +
                "<br>" +
                "<strong>Creacion: </strong>" +
                datos.Creacion +
                "<br>" +
                "<strong>Primer Mensaje: </strong>" +
                datos.PrimerMsg +
                "<br>" +
                "<strong>Ultimo Mensaje: </strong>" +
                datos.UltimoMsg +
                "<br>" +
                "<strong>Filtro Desde: </strong>" +
                datos.FiltroDesde +
                "<br>" +
                "<strong>Filtro Hasta: </strong>" +
                datos.FiltroHasta +
                "<br>"
              );
            },
            className: "text-left",
          },
        ],
      });
      //Visualizar el valor de la experiencia una vez seleccionada como un titulo arriba de la tabla datos
      document.getElementById("h5Participantes").innerHTML = datos.Alias;

      //Cambio de clase hidden a visible
      $(".h5Title").toggleClass("visible");
      $(".h5Cerradas").toggleClass("visible");
      $(".h5Abiertas").toggleClass("visible");
      $("#h5Participantes").toggleClass("visible");

      //Grafico Total (Preguntas cerradas). Sumatoria de datos
      a = table.column(1).data().sum();
      b = table.column(2).data().sum();

      //Definicion tabla Total (Preguntas cerradas)
      let myChartCuatro = document
        .getElementById("myChartCuatro")
        .getContext("2d");
      Chart.controllers.MyType = Chart.DatasetController.extend({});
      let massPopChartCuatro = new Chart(myChartCuatro, {
        type: "pie",
        data: {
          datasets: [
            {
              data: [a, b],
              backgroundColor: [
                "rgb(113, 192, 102)",
                "rgb(192, 102, 102)",
                "rgb(255, 205, 86)",
                "rgb(75, 192, 192)",
                "rgb(54, 162, 235)",
              ],
            },
          ],
          labels: ["Correctas", "Incorrectas"],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            datalabels: {
              formatter: (value) => {
                if(value==0){
                  return value="."
                }
                else{
                  return value;
                }
              },
            },
          },
        },
      });

      //Grafico Total (Preguntas abiertas). Sumatoria de datos
      c = table2.column(3).data().sum();
      d = table2.column(1).data().sum();

      //Definicion tabla Total (Preguntas abiertas)
      let myChartCinco = document
        .getElementById("myChartCinco")
        .getContext("2d");
      Chart.controllers.MyType = Chart.DatasetController.extend({});
      let massPopChartCinco = new Chart(myChartCinco, {
        type: "pie",
        data: {
          datasets: [
            {
              data: [c, d],
              backgroundColor: [
                
                "rgb(255, 159, 64)",
                "rgb(113, 192, 102)",
                "rgb(255, 205, 86)",
                "rgb(75, 192, 192)",
                "rgb(54, 162, 235)",
              ],
            },
          ],
          labels: ["Totales", "Respuestas"],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            datalabels: {
              formatter: (value) => {
                if(value==0){
                  return value="."
                }
                else{
                  return value;
                }
              },
            },
          },
        },
      });
      //Declaracion de variable para utilizacion en los Select
      var graficoPart;
      var graficoPartDos;

      //Grafico particular (Preguntas cerradas)
      function graficoParticular(a, b, c) {
        let myChart = document.getElementById("myChart").getContext("2d");
        Chart.controllers.MyType = Chart.DatasetController.extend({});

        return new Chart(myChart, {
          type: "pie",
          data: {
            labels: ["Correctas", "Incorrectas", "N/R"],
            datasets: [
              {
                data: [a, b, c],
                backgroundColor: [
                  "rgb(113, 192, 102)",
                  "rgb(192, 102, 102)",
                  "rgb(255, 205, 86)",
                  "rgb(75, 192, 192)",
                  "rgb(54, 162, 235)",
                ],
                borderWidth: 1,
                borderColor: "#777",
                hoverBorderWidth: 3,
                hoverBorderColor: "#000",
                order: 1,
              },
            ],
          },

          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              datalabels: {
                formatter: (value) => {
                  if(value==0){
                    return value="."
                  }
                  else{
                    return value;
                  }
                },

              },
            },
          },
        });
      }
      //Grafico particular (Preguntas abiertas)
      function graficoParticularDos(a, b) {
        let myChartDos = document.getElementById("myChartDos").getContext("2d");
        Chart.controllers.MyType = Chart.DatasetController.extend({});

        return new Chart(myChartDos, {
          type: "pie",
          data: {
            labels: ["Totales", "N/R"],
            datasets: [
              {
                data: [a, b],
                backgroundColor: [
                  "rgb(113, 192, 102)",
                  "rgb(255, 205, 86)",
                  "rgb(75, 192, 192)",
                  "rgb(54, 162, 235)",
                ],
                borderWidth: 1,
                borderColor: "#777",
                hoverBorderWidth: 3,
                hoverBorderColor: "#000",
                order: 1,
              },
            ],
          },

          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              datalabels: {
                formatter: (value) => {
                  if(value==0){
                    return value="."
                  }
                  else{
                    return value;
                  }
                },
              },
            },
          },
        });
      }

      //Funcion select GRAFICO PREGUNTAS CERRADAS
      table.on("select", function (e, dt, type, indexes) {
        $(".containerChartCuatro").toggleClass("d-none");

        //Parametros obteniendo los datos de las filas
        var data = table.row({ selected: true }).data();
        var row = table.row({ selected: true });
        var c = table.cell(row, 3).render("display");
        var a = data["correctas"];
        var b = data["incorrectas"];

        //Obtencion del titulo que se encuentra arriba del grafico particular
        $("#h5TitlePartUno").toggleClass("visible");
        var title = data["alias"];
        document.getElementById("h5TitlePartUno").innerHTML = title;

        graficoPart = graficoParticular(a, b, c);
        $("#myChart").removeClass("d-none");
      });

      //Funcion deselect GRAFICO PREGUNTAS CERRADAS
      table.on("deselect", function (e, dt, type, indexes) {
        //Cambio de clases de visible a invisible
        $("#myChart").toggleClass("d-none");
        $(".containerChartCuatro").toggleClass("d-none");
        $("#h5TitlePartUno").toggleClass("d-none");
      });

      //Funcion select GRAFICO PREGUNTAS ABIERTAS
      table2.on("select", function (e, dt, type, indexes) {
        $(".containerChartCinco").toggleClass("d-none");

        //Parametros obteniendo los datos de las filas
        var data = table2.row({ selected: true }).data();
        var row = table2.row({ selected: true });
        var a = data["rtotales"];
        var b = table2.cell(row, 2).render("display");

        //Obtencion del titulo que se encuentra arriba del grafico particular
        $("#h5TitlePartDos").toggleClass("visible");
        var title = data["alias"];
        document.getElementById("h5TitlePartDos").innerHTML = title;

        graficoPartDos = graficoParticularDos(a, b);
        $("#myChartDos").removeClass("d-none");
      });

      //Funcion deselect GRAFICO PREGUNTAS ABIERTAS
      table2.on("deselect", function (e, dt, type, indexes) {
        $("#myChartDos").toggleClass("d-none");
        $(".containerChartCinco").toggleClass("d-none");
        $("#h5TitlePartDos").toggleClass("d-none");
      });

      //Generar grafico DATOS
      let myChartTres = document.getElementById("myChartTres").getContext("2d");
      Chart.controllers.MyType = Chart.DatasetController.extend({});

      let massPopChartTres = new Chart(myChartTres, {
        type: "pie",
        data: {
          datasets: [
            {
              data: [numero.participantes, numero.finalizado],
              backgroundColor: [
                "rgb(113, 192, 102)",
                "rgb(192, 102, 102)",
                "rgb(255, 205, 86)",
                "rgb(75, 192, 192)",
                "rgb(54, 162, 235)",
              ],
            },
          ],
          labels: ["Finalizaron", "No Finalizaron"],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            datalabels: {
              formatter: (value) => {
                if(value==0){
                  return value="."
                }
                else{
                  return value;
                }
              },
            },
          },
        },
      });
    },

    error: function (error) {
      console.log(error);
    },
  });
}
$(document).ready(function () {
  InitializeSelect();
  //Filtro de fechas
  $("#btnObtener").click(function () {
    if (selectedExperienceID) {
      GetExperiencesOutputId(selectedExperienceID);
    }
    if (
      document.getElementById("from_date").value >
      document.getElementById("to_date").value
    ) {
      document.getElementById("from_date").disabled = true;
      document.getElementById("to_date").disabled = true;
      alertify.error("La fecha de inicio debe ser menor a la Fecha fin");
      setTimeout(function () {
        location.reload();
      }, 3000);
    }
  });
});
