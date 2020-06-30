(function() {

    function formatearFecha(fecha) {
        var array_fecha = fecha.split("/");
        //return array_fecha[2] + "-" + array_fecha[1] + "-" + array_fecha[0];
        return array_fecha[0] + "-" + array_fecha[1] + "-" + array_fecha[2];
    };

    var horarios = [];

    $("body").on("click", "#checkB", function(e) {

        //si le da check al box rescata el id y saca check al resto
        if ($(this).is(':checked')) {

            var horario = $(this).data("idens");

            horarios.push(horario);

        } else {
            console.log("DesChequeado");

            var horarioD = $(this).data("idens");

            var pos = horarios.indexOf(horarioD)

            horarios.splice(pos, 1);

        };

    });


    function verificaTurnos(my_callback) {

        var fecha = $("#fecha_desde").val();
        fecha = formatearFecha(fecha);

        var seleccion = $("#seleccion option:selected").val();

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        myHeaders.append("token", localStorage.getItem("token"));

        var entorno = localStorage.getItem("entorno");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(entorno + '/horario/validar/tipo=' + seleccion + '&fecha=' + fecha, requestOptions)
            .then(response => response.json())
            .then(json => {
                console.log(json);

                retorno = json.turnos.length;
                my_callback(retorno);

            });

    }




    $("#btnGenerar").on("click", function() {

        verificaTurnos(function(resp) {

            console.log("CANTIDAD: " + resp);

            if (resp !== 0) {
                Swal.fire('Ya existe agenda de turnos para la fecha y especialidad', '', 'error ');
                return;

            } else {

                //RECORRE ARRAY/////////////////////////////
                horarios.forEach(function(elemento) {

                    var myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
                    myHeaders.append("token", localStorage.getItem("token"));

                    var entorno = localStorage.getItem("entorno");

                    // Can also constructor from another URLSearchParams
                    var urlencoded = new URLSearchParams();

                    var fecha = $("#fecha_desde").val();

                    var seleccion = $("#seleccion option:selected").val();


                    console.log(fecha);
                    console.log(seleccion);
                    console.log(elemento);


                    urlencoded.append("hora", elemento);
                    urlencoded.append("tipo", seleccion);
                    urlencoded.append("fecha", formatearFecha(fecha));


                    var requestOptions = {
                        method: 'POST',
                        headers: myHeaders,
                        body: urlencoded,
                        redirect: 'follow'
                    };

                    fetch(entorno + '/horario/agenda', requestOptions)
                        .then(function(res) {})
                        .catch(function(res) { console.log(res) })

                    Swal.fire('Agenda de turnos generada correctamente', '', 'success ');
                    $("#tblRegistrosAgenda").empty();


                });
            };

        });

    });


    //BUSQUEDA DE HORARIOS
    $("#btnBuscar").on("click", function() {

        if ($("#fecha_desde").val() === '') {
            Swal.fire('Es necesario ingresar una fecha', '', 'error ');
            return;
        };


        if ($("#seleccion").val() === '') {
            Swal.fire('Es necesario ingresar una especialidad', '', 'error ');
            return;
        };


        $("#tblRegistrosAgenda").empty();

        //Arma la cabecera con el token
        var myHeaders = new Headers();
        myHeaders.append("token", localStorage.getItem("token"));

        var requestOptions = {
            method: 'GET',
            headers: myHeaders
        };

        var entorno = localStorage.getItem("entorno");
        fetch(entorno + '/horario', requestOptions)
            .then(response => response.json())
            .then(json => {
                console.log(json);

                for (i = 0; i < json.horarios.length; i++) {

                    var content = "";
                    content += "<tr id='registro'>";
                    content += "<td style='width:5px;' class='text-center'><input type='checkbox' id='checkB' value='no' data-idens='" + json.horarios[i].hora + "'></td>";
                    content += "<td style='width:20px;' class='text-center'>" + json.horarios[i].hora + "</td>";
                    content += "</tr>";

                    $("#tblRegistrosAgenda").append(content);

                };

            })

    });













    $('.fj-date').datepicker({
        format: "dd/mm/yyyy"
    });

    $('.fj-dateh').datepicker({
        format: "dd/mm/yyyy"
    });

})();