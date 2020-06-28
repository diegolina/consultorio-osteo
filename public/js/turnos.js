(function() {


    $("#btnBuscar").on("click", function() {
        $("#myModalAgenda").show();
    });

    $("#modalCerrarAgenda").on("click", function() {
        $("#myModalAgenda").hide();
    });

    function formatearFecha(fecha) {
        var array_fecha = fecha.split("/");
        //return array_fecha[2] + "-" + array_fecha[1] + "-" + array_fecha[0];
        return array_fecha[0] + "-" + array_fecha[1] + "-" + array_fecha[2];
    };


    function muestraAsistencia(valor) {

        if (valor === 'au_aviso') {
            return 'Ausente con Aviso';
        };

        if (valor === 'concurrio') {
            return 'Concurrio';
        };

        if (valor === 'au_sinaviso') {
            return 'Ausente sin Aviso';
        };

        return '';

    }

    function cargaAgenda(fechaAgenda, especialidadAgenda) {

        $("#tblRegistros").empty();

        if (especialidadAgenda === 'kine') {
            var titulo = ' - Kinesiologia'
        };

        if (especialidadAgenda === 'osteo') {
            var titulo = ' - Osteopatia'
        };

        if (especialidadAgenda === 'rpg') {
            var titulo = ' - RPG'
        };

        $("#titPrincipal").text('Gestion de Turnos' + titulo);

        //Arma la cabecera con el token
        var myHeaders = new Headers();
        myHeaders.append("token", localStorage.getItem("token"));

        var requestOptions = {
            method: 'GET',
            headers: myHeaders
        };

        var entorno = localStorage.getItem("entorno");
        fetch(entorno + '/turno/buscar/fecha=' + fechaAgenda + '&especialidad=' + especialidadAgenda, requestOptions)
            .then(response => response.json())
            .then(json => {
                console.log(json);

                if (json.cantidad === 0) {
                    Swal.fire('No existe Agenda para la fecha y especialidad seleccionada');
                    return false;
                };


                for (i = 0; i < json.turnos.length; i++) {

                    var content = "";

                    content += "<tr id='registro'>";

                    content += "<td style='width:5px;' class='text-center'><input type='checkbox' id='check' value='no' data-estado='" +
                        json.turnos[i].estado + "' data-iden='" + json.turnos[i]._id + "' data-hora='" + json.turnos[i].hora + "'></td>";
                    content += "<td style='height:10px;' class='text-center'>" + json.turnos[i].fecha + "</td>";
                    content += "<td style='height:10px;' class='text-center'>" + json.turnos[i].hora + "</td>";

                    if (json.turnos[i].estado === 'ocupado') {
                        content += "<td class='text-center'>X</td>";
                        content += "<td class='text-center'>X</td>";
                        content += "<td class='text-center'>X</td>";
                        content += "<td class='text-center'>X</td>";
                    } else {
                        if (json.turnos[i].paciente === null) {
                            content += "<td class='text-center'></td>";
                        } else {
                            content += "<td class='text-center'>" + json.turnos[i].paciente.nombre + "</td>";
                        };
                        if (json.turnos[i].paciente === null) {
                            content += "<td class='text-center'></td>";
                        } else {
                            content += "<td class='text-center'>" + json.turnos[i].paciente.obra_soc + "</td>";
                        };
                        if (json.turnos[i].paciente === null) {
                            content += "<td class='text-center'></td>";
                        } else {
                            content += "<td class='text-center'>" + json.turnos[i].paciente.plan + "</td>";
                        };

                        if (json.turnos[i].paciente === null) {
                            content += "<td class='text-center'></td>";
                        } else {
                            content += "<td class='text-center'>" + json.turnos[i].paciente.telefono + "</td>";
                        }
                    };

                    if (json.turnos[i].estado === 'libre') {
                        content += "<td class='text-center'></td>";
                    } else {
                        if (json.turnos[i].estado === 'ocupado') {
                            content += "<td class='text-center'><img src='img/ocupado.jpg'></td>";
                        } else {
                            content += "<td class='text-center'><img src='img/ok.jpg'></td>";
                        }
                    };

                    content += "<td class='text-center'>" + muestraAsistencia(json.turnos[i].asistencia) + "</td>";

                    content += "</tr>";

                    $("#tblRegistros").append(content);


                };

                $("#myModalAgenda").hide();


            });


    };

    //hace la busqueda de la agenda
    $("#myModalAgenda").on("submit", function(e) {

        e.preventDefault();

        if ($("#fecha_desde").val() === '') {
            Swal.fire('Es necesario cargar una fecha de agenda');
            return false;
        };

        var fecha = $("#fecha_desde").val();

        var seleccion = $("#seleccion option:selected").val();

        var nueva_fecha = formatearFecha(fecha);

        cargaAgenda(nueva_fecha, seleccion);

    });


    $("body").on("click", "#check", function(e) {

        //si le da check al box rescata el id y saca check al resto
        if ($(this).is(':checked')) {

            var id = $(this).data("iden");

            $("#idAg").val(id);
            $("#idAgAsis").val(id);

            $('input[id="check"]').not(this).prop('checked', false);

        } else
            console.log("DesChequeado");

    });


    $("body").on("click", "#checkB", function(e) {

        //si le da check al box rescata el id y saca check al resto
        if ($(this).is(':checked')) {

            var idPaciente = $(this).data("idens");

            $("#idPac").val(idPaciente);

            $('input[id="checkB"]').not(this).prop('checked', false);

        } else
            console.log("DesChequeado");

    });


    $("body").on("click", "#checkA", function(e) {

        //si le da check al box rescata el id y saca check al resto
        if ($(this).is(':checked')) {


            $('input[id="checkA"]').not(this).prop('checked', false);

        } else
            console.log("DesChequeado");

    });



    $("body").on("click", "#btnDar", function(e) {

        e.preventDefault();

        //trae el check seleccionado
        var dato = $("input[type=checkbox]:checked");

        if (dato.length === 0) {
            Swal.fire('Es necesario seleccionar un elemento');
            return false;
        };

        var estado_ag = dato.data("estado");

        if (estado_ag !== 'libre') {
            Swal.fire('No es posible dar turnos sobre agenda Ocupada o Tomada');
            return false;
        } else {

            var fecha = $("#fecha_desde").val();
            var hora = dato.data("hora");
            var titulo = "Ingreso de Turno: " + fecha + " " + hora;

            $("#tituloTurnos").text(titulo);
            $("#listaPac").hide();
            $("#ingresoPac").hide();
            $("#myModalDarTurno").show();

        };

    });


    //BUSQUEDA DE PACIENTE EN MODAL DE DAR TURNO
    $("#btnBusqPac").on("click", function() {
        $("#ingresoPac").hide();
        $("#listaPac").show();

        //pone en el hidden accion para validar despues
        $("#idPacAccion").val("buscar");

        var nombre = $("#pacienteTurno").val();

        $("#tblRegPac").empty();

        //Arma la cabecera con el token
        var myHeaders = new Headers();
        myHeaders.append("token", localStorage.getItem("token"));

        var requestOptions = {
            method: 'GET',
            headers: myHeaders
        };

        var entorno = localStorage.getItem("entorno");
        fetch(entorno + '/turno/buscarnombre/nombre=' + nombre, requestOptions)
            .then(response => response.json())
            .then(json => {
                console.log(json);

                for (i = 0; i < json.pacientes.length; i++) {

                    var content = "";
                    content += "<tr id='registro'>";
                    content += "<td style='width:5px;' class='text-center'><input type='checkbox' id='checkB' value='no' data-idens='" + json.pacientes[i]._id + "'></td>";
                    content += "<td style='width:20px;' class='text-center'>" + json.pacientes[i].nombre + "</td>";
                    content += "</tr>";

                    $("#tblRegPac").append(content);

                };

            })

    });

    $("#btnCerrarDar").on("click", function() {
        $("#myModalDarTurno").hide();
    });


    function formateaModalTurno() {
        //Cierra y limpia objetos y recarga agenda
        $("#myModalDarTurno").hide();
        $("#tblRegPac").empty();
        $("#pacienteTurno").val("");

        $("#pacienteIn").val("");
        $("#obraSocial").val("");
        $("#plan").val("");
        $("#telefono").val("");
        $("#observac").val("");

        var fecha = $("#fecha_desde").val();
        var seleccion = $("#seleccion option:selected").val();
        var nueva_fecha = formatearFecha(fecha);
        cargaAgenda(nueva_fecha, seleccion);

    };

    $("body").on("click", "#btnIngresarTurno", function(e) {

        e.preventDefault();

        var formulario = $("#formIngreso");
        var datosSerializados = formulario.serialize();

        console.log('SERIAL NEW: ' + datosSerializados);

        //entro por buscar valida que haya algo seleccionado
        if ($("#idPacAccion").val() === 'buscar') {
            var dato = $("input[id=checkB]:checked");

            if (dato.length === 0) {
                Swal.fire('Es necesario seleccionar un elemento');
                return false;
            } else {

                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
                myHeaders.append("token", localStorage.getItem("token"));

                var urlencoded = new URLSearchParams(datosSerializados);

                urlencoded.append("paciente", urlencoded.get('idPac'));
                urlencoded.append("_id", urlencoded.get('idAg'));

                var requestOptions = {
                    method: 'PUT',
                    headers: myHeaders,
                    body: urlencoded,
                    redirect: 'follow'
                };

                var entorno = localStorage.getItem("entorno");
                fetch(entorno + '/turno/dar', requestOptions)

                .then(function(res) {
                    console.log(res)

                    Swal.fire('Turno ingresado correctamente', '', 'success');

                    formateaModalTurno();

                });

            };

        } else {
            if ($("#pacienteIn").val() === '') {
                Swal.fire('El nombre del paciente es obligatorio');
                return false;
            };

            //CREA EL PACIENTE Y ASIGNA TURNO
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
            myHeaders.append("token", localStorage.getItem("token"));

            var urlencoded = new URLSearchParams(datosSerializados);

            urlencoded.append("paciente", urlencoded.get('idPac'));
            urlencoded.append("nombre", urlencoded.get('paciente'));
            urlencoded.append("obra", urlencoded.get('obra'));
            urlencoded.append("plan", urlencoded.get('plan'));
            urlencoded.append("telefono", urlencoded.get('telefono'));
            urlencoded.append("observacion", urlencoded.get('observac'));

            //Seguir pasando los parametros

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: urlencoded,
                redirect: 'follow'
            };

            var entorno = localStorage.getItem("entorno");
            fetch(entorno + '/turno/creadar', requestOptions)

            .then(function(res) {

                console.log('RESSSS: ', res.paciente);

                console.log(res)

                Swal.fire('Turno ingresado correctamente', '', 'success');

                formateaModalTurno();

            });

        };

    });


    $("#btnIngPac").on("click", function() {
        $("#tblRegPac").empty();
        $("#listaPac").hide();
        $("#ingresoPac").show();

        //pone en el hidden accion para validar despues
        $("#idPacAccion").val("ingreso");

    });



    //Liberar Turno
    $("body").on("click", "#btnLiberar", function(e) {

        e.preventDefault();

        //trae el check seleccionado
        var dato = $("input[type=checkbox]:checked");

        if (dato.length === 0) {
            Swal.fire('Es necesario seleccionar un elemento');
            return false;
        };

        var estado_ag = dato.data("estado");

        if (estado_ag === 'libre') {
            Swal.fire('No es posible liberar turnos sobre agenda Libre');
            return false;
        };

        var id_ag = dato.data("iden");

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        myHeaders.append("token", localStorage.getItem("token"));

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: {},
            redirect: 'follow'
        };

        var entorno = localStorage.getItem("entorno");
        fetch(entorno + '/turno/liberar/' + id_ag, requestOptions)
            .then(function(res) {
                console.log(res)

                Swal.fire('Turno liberado correctamente', '', 'success');
                var fecha = $("#fecha_desde").val();
                var seleccion = $("#seleccion option:selected").val();
                var nueva_fecha = formatearFecha(fecha);

                cargaAgenda(nueva_fecha, seleccion);

            })


        .catch(function(res) { console.log(res) })

    });


    //Ocupar TURNO
    $("body").on("click", "#btnOcupar", function(e) {

        e.preventDefault();

        //trae el check seleccionado
        var dato = $("input[type=checkbox]:checked");

        if (dato.length === 0) {
            Swal.fire('Es necesario seleccionar un elemento');
            return false;
        };

        var estado_ag = dato.data("estado");

        if (estado_ag !== 'libre') {
            Swal.fire('No es posible ocupar turnos sobre agenda asignada');
            return false;
        };

        var id_ag = dato.data("iden");

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        myHeaders.append("token", localStorage.getItem("token"));

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: {},
            redirect: 'follow'
        };

        var entorno = localStorage.getItem("entorno");
        fetch(entorno + '/turno/ocupar/' + id_ag, requestOptions)

        .then(function(res) {
            console.log(res)

            Swal.fire('Turno ocupado correctamente', '', 'success');

            var fecha = $("#fecha_desde").val();

            var seleccion = $("#seleccion option:selected").val();

            var nueva_fecha = formatearFecha(fecha);

            cargaAgenda(nueva_fecha, seleccion);

        })

        .catch(function(res) { console.log(res) })

    });

    //MARCAR CONCURRENCIA
    $("body").on("click", "#btnConcurrencia", function(e) {

        e.preventDefault();

        //trae el check seleccionado
        var dato = $("input[type=checkbox]:checked");

        if (dato.length === 0) {
            Swal.fire('Es necesario seleccionar un elemento');
            return false;
        };

        var estado_ag = dato.data("estado");

        if (estado_ag !== 'tomado') {
            Swal.fire('No es posible marcar asistencia en turnos libres u ocupados');
            return false;
        };

        $("#myModalAsistencia").show();

    });

    $("#modalMarcarAsis").on("click", function() {

        var datoA = $("input[id=checkA]:checked");
        var valor = datoA.data("valor");

        id_ag = $("#idAgAsis").val();

        if (datoA.length === 0) {
            Swal.fire('Es necesario seleccionar un elemento');
            return false;
        } else {

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
            myHeaders.append("token", localStorage.getItem("token"));

            var urlencoded = new URLSearchParams();

            urlencoded.append("asistencia", valor);

            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: urlencoded,
                redirect: 'follow'
            };

            var entorno = localStorage.getItem("entorno");
            fetch(entorno + '/turno/marcar/' + id_ag, requestOptions)

            .then(function(res) {
                console.log(res)

                Swal.fire('Asistencia registrada correctamente', '', 'success');
                $("#myModalAsistencia").hide();

                var fecha = $("#fecha_desde").val();
                var seleccion = $("#seleccion option:selected").val();
                var nueva_fecha = formatearFecha(fecha);

                cargaAgenda(nueva_fecha, seleccion);

            })

            .catch(function(res) { console.log(res) })

        };

    });

    $("#modalCerrarAsis").on("click", function() {
        $("#myModalAsistencia").hide();
    });

    $('.fj-date').datepicker({
        format: "dd/mm/yyyy"
    });

    $('.fj-dateh').datepicker({
        format: "dd/mm/yyyy"
    });


})();