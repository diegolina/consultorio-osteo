(function() {

    $("body").on("click", "#checkB", function(e) {

        //si le da check al box rescata el id y saca check al resto
        if ($(this).is(':checked')) {

            var idTratam = $(this).data("idens");

            $("#idTratam").val(idTratam);

            var idestado = $(this).data("cierre");
            $("#idEstado").val(idestado);

            $('input[id="checkB"]').not(this).prop('checked', false);

        } else
            console.log("DesChequeado");

    });

    $("body").on("click", "#checkA", function(e) {

        //si le da check al box rescata el id y saca check al resto
        if ($(this).is(':checked')) {

            var idSesion = $(this).data("idensesion");

            $("#idSesion").val(idSesion);

            $('input[id="checkA"]').not(this).prop('checked', false);

        } else
            console.log("DesChequeado");

    });

    function cargaTratamiento(id) {
        $("#datosTrat").hide();
        //Limpia GRilla
        $("#tblRegTrat").empty();

        //Arma la cabecera con el token
        var myHeaders = new Headers();
        myHeaders.append("token", localStorage.getItem("token"));

        var requestOptions = {
            method: 'GET',
            headers: myHeaders
        };

        var entorno = localStorage.getItem("entorno");
        fetch(entorno + '/tratamiento/' + id, requestOptions)
            .then(response => response.json())
            .then(json => {
                console.log(json);

                for (i = 0; i < json.tratamientos.length; i++) {

                    var content = "";
                    content += "<tr id='registro'>";
                    content += "<td style='width:3px;' class='text-center'><input type='checkbox' id='checkB' value='no' data-idens='" + json.tratamientos[i]._id + "' data-cierre='" + json.tratamientos[i].Cierre + "' + ></td>";
                    content += "<td style='width:3px;' class='text-center'>" + json.tratamientos[i].fecha + "</td>";
                    content += "<td style='width:20px;' class='text-center'>" + json.tratamientos[i].titulo + "</td>";
                    content += "</tr>";

                    $("#tblRegTrat").append(content);

                };


            });

    };

    $("#btnBuscarTrat").on("click", function() {

        var id = $("#idPacTrat").val(); //obtiene id del paciente
        cargaTratamiento(id);

    })


    $("#btnVerTrat").on("click", function() {

        //trae el check seleccionado
        var dato = $("input[type=checkbox]:checked");

        if (dato.length === 0) {
            Swal.fire('Es necesario seleccionar un tratamiento');
            return false;
        };

        //Arma la cabecera con el token
        var myHeaders = new Headers();
        myHeaders.append("token", localStorage.getItem("token"));

        var requestOptions = {
            method: 'GET',
            headers: myHeaders
        };

        var entorno = localStorage.getItem("entorno");
        var id = $("#idTratam").val(); //obtiene id del tratam

        fetch(entorno + '/tratamiento/porid/' + id, requestOptions)
            .then(response => response.json())
            .then(json => {
                console.log(json.tratamientos.fecha);

                $("#fecha_desde").val(json.tratamientos.fecha);
                $("#titCorto").val(json.tratamientos.titulo);
                $("#tratamiento").val(json.tratamientos.tratamiento);
                $("#comCierre").val(json.tratamientos.comentarioCierre);

                //si el tratamiento esta cerrado o no deja editarlo
                if ($("#idEstado").val() === 'true') {
                    poneReadOnly();
                    $("#btnGrabarTrat").hide();
                    $("#datosTrat").show();
                } else {
                    sacaReadOnly();
                    $("#comCierre").attr("readonly", "readonly");
                    $("#idAccion").val("editaTratam");
                    $("#btnGrabarTrat").show();
                    $("#datosTrat").show();
                }

            });
    })


    function cargaSesiones(id, desde) {

        $("#tblRegSesion").empty();
        //Arma la cabecera con el token
        var myHeaders = new Headers();
        myHeaders.append("token", localStorage.getItem("token"));

        var requestOptions = {
            method: 'GET',
            headers: myHeaders
        };

        var entorno = localStorage.getItem("entorno");
        fetch(entorno + '/sesion/tratamiento/id=' + id + '&desde=' + desde, requestOptions)
            .then(response => response.json())
            .then(json => {

                console.log(json);

                for (i = 0; i < json.sesiones.length; i++) {

                    var content = "";
                    content += "<tr id='registroSesion'>";
                    content += "<td style='width:3px;' class='text-center'><input type='checkbox' id='checkA' value='no' data-idensesion='" + json.sesiones[i]._id + "' + ></td>";
                    content += "<td style='width:3px;' class='text-center'>" + json.sesiones[i].fecha + "</td>";
                    content += "<td style='width:40px;' class='text-center'>" + json.sesiones[i].sesion + "</td>";
                    content += "</tr>";

                    $("#tblRegSesion").append(content);

                };

                console.log(json.cantidad);

                $("#sesionCantidad").val(json.cantidad);

            });

    };


    $("#btnSesionTrat").on("click", function() {

        //trae el check seleccionado
        var dato = $("input[type=checkbox]:checked");

        if (dato.length === 0) {
            Swal.fire('Es necesario seleccionar un tratamiento');
            return false;
        };


        ocultaTratam();
        $("#idAccion").val("Sesion");
        $("#datosSesion").show();
        $("#btnGrabarTrat").hide();
        $("#btnSesionTrat").hide();

        $("#btnMenos").show();
        $('#btnMenos').attr("disabled", true);
        $("#btnMas").show();
        $('#btnMas').attr("enabled", true);

        if ($("#idEstado").val() === 'false') {
            $("#btnIngSesionTrat").show();
            $("#btnDelSesionTrat").show();


        };

        var id = $("#idTratam").val(); //obtiene id del tratam

        //Levanta por 1ra vez las sesiones desde el botòn
        $("#sesionDesde").val("0");

        cargaSesiones(id, $("#sesionDesde").val());

    });


    $("#btnMas").on("click", function() {

        var id = $("#idTratam").val(); //obtiene id del tratam

        //Levanta por 1ra vez las sesiones desde el botòn
        var desde = Number($("#sesionDesde").val()) + 5;
        console.log(desde);
        $("#sesionDesde").val(desde);

        cargaSesiones(id, $("#sesionDesde").val());

        $("#btnMenos").show();

        $('#btnMenos').attr("disabled", false);

        cantidad = $("#sesionCantidad").val();

        let nuevoMax = desde + 5;

        if (nuevoMax > cantidad) {
            //$("#btnMas").hide();
            $('#btnMas').attr("disabled", true);
        }

    });

    $("#btnMenos").on("click", function() {

        var id = $("#idTratam").val(); //obtiene id del tratam

        //Levanta por 1ra vez las sesiones desde el botòn
        var desde = Number($("#sesionDesde").val()) - 5;
        console.log(desde);
        $("#sesionDesde").val(desde);

        cargaSesiones(id, $("#sesionDesde").val());

        //$("#btnMas").show();
        $('#btnMas').attr("disabled", false);

        //si llega a cero oculto el menos
        if (desde === 0) {
            //$("#btnMenos").hide();
            $('#btnMenos').attr("disabled", true);
        }
    });


    $("#btnCerrarTrat").on("click", function() {

        //trae el check seleccionado
        var dato = $("input[type=checkbox]:checked");

        if (dato.length === 0) {
            Swal.fire('Es necesario seleccionar un tratamiento');
            return false;
        };

        if ($("#idEstado").val() === 'true') {
            Swal.fire('El tratamiento ya fue cerrado');
            poneReadOnly();
            return false;
        };


        //Arma la cabecera con el token
        var myHeaders = new Headers();
        myHeaders.append("token", localStorage.getItem("token"));

        var requestOptions = {
            method: 'GET',
            headers: myHeaders
        };

        var entorno = localStorage.getItem("entorno");
        var id = $("#idTratam").val(); //obtiene id del tratam

        fetch(entorno + '/tratamiento/porid/' + id, requestOptions)
            .then(response => response.json())
            .then(json => {
                console.log(json.tratamientos.fecha);

                $("#fecha_desde").val(json.tratamientos.fecha);
                $("#titCorto").val(json.tratamientos.titulo);
                $("#tratamiento").val(json.tratamientos.tratamiento);
                $("#comCierre").val(json.tratamientos.comentarioCierre);

                poneReadOnly();
                $("#comCierre").removeAttr("readonly");
                $("#btnGrabarTrat").show();
                $("#idAccion").val("CierreTratamiento")
                $("#datosTrat").show();
            });
    })



    $("#btnGrabarTrat").on("click", function() {

        //Cierre de Tratamiento
        if ($("#idAccion").val() === "CierreTratamiento") {

            if ($("#comCierre").val() === "") {
                Swal.fire('Es necesario registrar un comentario de Cierre');
                return false;
            }

            var id = $("#idTratam").val(); //obtiene id del tratam

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
            myHeaders.append("token", localStorage.getItem("token"));

            let comentario = $("#comCierre").val();

            var urlencoded = new URLSearchParams();

            urlencoded.append("comentarioCierre", comentario);
            urlencoded.append("Cierre", true);

            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: urlencoded,
                redirect: 'follow'
            };

            var entorno = localStorage.getItem("entorno");
            fetch(entorno + '/tratamiento/cierre/' + id, requestOptions)
                .then(function(res) {
                    Swal.fire('El tratamiento ha sido Cerrado', '', 'success');

                    var idPac = $("#idPacTrat").val(); //obtiene id del paciente
                    cargaTratamiento(idPac);
                    $("#btnGrabarTrat").hide();
                    poneReadOnly();
                    $("#datosTrat").hide();

                })
                .catch(function(res) { console.log(res) })

        }

        if ($("#idAccion").val() === "creaTratam") {

            //crea un tratamiento
            if ($("#fecha_desde").val() === "") {
                Swal.fire('Es necesario ingresar una fecha');
                return false;
            };

            if ($("#titCorto").val() === "") {
                Swal.fire('Es necesario ingresar un titulo corto');
                return false;
            };

            if ($("#tratamiento").val() === "") {
                Swal.fire('Es necesario ingresar un tratamiento');
                return false;
            };

            var id = $("#idTratam").val(); //obtiene id del tratam
            var idPac = $("#idPacTrat").val(); //obtiene id del paciente

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
            myHeaders.append("token", localStorage.getItem("token"));

            var urlencoded = new URLSearchParams();

            urlencoded.append("paciente", idPac);
            urlencoded.append("fecha", $("#fecha_desde").val());
            urlencoded.append("titulo", $("#titCorto").val());
            urlencoded.append("tratamiento", $("#tratamiento").val());

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: urlencoded,
                redirect: 'follow'
            };

            var entorno = localStorage.getItem("entorno");
            fetch(entorno + '/tratamiento/crear', requestOptions)
                .then(function(res) {
                    Swal.fire('El tratamiento ha sido Creado', '', 'success');

                    var idPac = $("#idPacTrat").val(); //obtiene id del paciente
                    cargaTratamiento(idPac);
                    $("#btnGrabarTrat").hide();
                    $("#datosTrat").hide();

                })
                .catch(function(res) { console.log(res) })


        }


        if ($("#idAccion").val() === "editaTratam") {

            //crea un tratamiento
            if ($("#fecha_desde").val() === "") {
                Swal.fire('Es necesario ingresar una fecha');
                return false;
            };

            if ($("#titCorto").val() === "") {
                Swal.fire('Es necesario ingresar un titulo corto');
                return false;
            };

            if ($("#tratamiento").val() === "") {
                Swal.fire('Es necesario ingresar un tratamiento');
                return false;
            };

            var id = $("#idTratam").val(); //obtiene id del tratam

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
            myHeaders.append("token", localStorage.getItem("token"));

            var urlencoded = new URLSearchParams();

            urlencoded.append("fecha", $("#fecha_desde").val());
            urlencoded.append("titulo", $("#titCorto").val());
            urlencoded.append("tratamiento", $("#tratamiento").val());

            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: urlencoded,
                redirect: 'follow'
            };

            var entorno = localStorage.getItem("entorno");
            fetch(entorno + '/tratamiento/modifica/' + id, requestOptions)
                .then(function(res) {
                    Swal.fire('El tratamiento ha sido Modificado', '', 'success');

                    var idPac = $("#idPacTrat").val(); //obtiene id del paciente
                    cargaTratamiento(idPac);
                    $("#btnGrabarTrat").hide();
                    //poneReadOnly();

                })
                .catch(function(res) { console.log(res) })


        }


    })


    $("#btnSalirTrat").on("click", function() {

        if ($("#idAccion").val() === "Sesion") {

            $("#tblRegSesion").empty()
            muestraTratam();
            //  $("#btnSesionTrat").show();
            //  $("#btnSalirTrat").show();
            $("#datosSesion").hide();
            $("#idAccion").val(" ");
            $("#btnIngSesionTrat").hide();
            $("#btnDelSesionTrat").hide();
            $("#btnSesionTrat").show();
            $("#btnMenos").hide();
            $("#btnMas").hide();

        } else {
            $("#antecedentes").val("");
            $("#tblRegTrat").empty();
            $("#myModalTratamiento").hide();
            $("#btnGrabarTrat").hide();
        }

    })

    /////////////////////////////////////////////////
    //////// ELIMINA DATOS SESION///////////////////
    $("#btnDelSesionTrat").on("click", function() {

        //trae el check seleccionado
        var datoS = $("input[id=checkA]:checked");

        if (datoS.length === 0) {
            Swal.fire('Es necesario seleccionar una sesion');
            return false;
        };

        var idSesion = $("#idSesion").val(); //obtiene id de sesion

        //Arma la cabecera con el token
        var myHeaders = new Headers();
        myHeaders.append("token", localStorage.getItem("token"));

        var requestOptions = {
            method: 'DELETE',
            headers: myHeaders
        };

        var entorno = localStorage.getItem("entorno");
        fetch(entorno + '/sesion/borrar/' + idSesion, requestOptions)
            .then(response => response.json())
            .then(json => {

                console.log(json);

                Swal.fire('La sesion ha sido eliminada');

                var idTratam = $("#idTratam").val(); //obtiene id del tratam
                cargaSesiones(idTratam, $("#sesionDesde").val());

            });



    })


    /////////////////////////////////////////////////
    //////// INGRESO DATOS SESION///////////////////
    $("#btnIngSesionTrat").on("click", function() {

        if ($("#fecha_sesion").val() === "") {
            Swal.fire('Es necesario ingresar una fecha');
            return false;
        };

        if ($("#datoSesion").val() === "") {
            Swal.fire('Es necesario ingresar un detalle');
            return false;
        };


        var id = $("#idTratam").val(); //obtiene id del tratam

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        myHeaders.append("token", localStorage.getItem("token"));

        var urlencoded = new URLSearchParams();

        urlencoded.append("tratamiento", id);
        urlencoded.append("fecha", $("#fecha_sesion").val());
        urlencoded.append("sesion", $("#datoSesion").val());

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        var entorno = localStorage.getItem("entorno");
        fetch(entorno + '/sesion/crear', requestOptions)
            .then(function(res) {
                Swal.fire('La sesion ha sido Creada', '', 'success');

                var id = $("#idTratam").val(); //obtiene id del tratam
                cargaSesiones(id, $("#sesionDesde").val());


            })
            .catch(function(res) { console.log(res) })


    })



    $("#btnCrearTrat").on("click", function() {
        sacaReadOnly();
        $("#comCierre").attr("readonly", "readonly");
        limpiaTratam();
        $("#btnGrabarTrat").show();
        $("#datosTrat").show();
        $("#idAccion").val("creaTratam");

    })


    $("body").on("click", "#btnTratam", function(e) {

        var id = $(this).parent().data("iden"); //obtiene id del paciente

        $("#idPacTrat").val(id);

        $("#titTratamiento").text('Tratamientos y Sesiones - ' + $(this).parent().data("nombre"));

        muestraTratam();
        $("#datosTrat").hide();
        $("#btnGrabarTrat").hide();
        $("#btnIngSesionTrat").hide();
        $("#btnDelSesionTrat").hide();
        $("#btnMenos").hide();
        $("#btnMas").hide();


        $("#myModalTratamiento").show();
        $("#datosSesion").hide();


    });

    $('.fj-date').datepicker({
        format: "dd/mm/yyyy"
    });

    $('.fj-dateh').datepicker({
        format: "dd/mm/yyyy"
    });


    function limpiaTratam() {

        $("#fecha_desde").val("");
        $("#titCorto").val("");
        $("#tratamiento").val("");
        $("#comCierre").val("");

    }

    function poneReadOnly() {

        $("#fecha_desde").attr("readonly", "readonly");
        $("#titCorto").attr("readonly", "readonly");
        $("#tratamiento").attr("readonly", "readonly");
        $("#comCierre").attr("readonly", "readonly");
    };

    function sacaReadOnly() {

        $("#fecha_desde").removeAttr("readonly");
        $("#titCorto").removeAttr("readonly");
        $("#tratamiento").removeAttr("readonly");
        $("#comCierre").removeAttr("readonly");

    };

    function ocultaTratam() {

        $("#datosTratGrilla").hide();
        $("#datosTrat").hide();

        $("#btnBuscarTrat").hide();
        $("#btnCrearTrat").hide();
        $("#btnVerTrat").hide();
        $("#btnCerrarTrat").hide();

    }

    function muestraTratam() {

        $("#datosTratGrilla").show();

        $("#btnBuscarTrat").show();
        $("#btnCrearTrat").show();
        $("#btnVerTrat").show();
        $("#btnCerrarTrat").show();

    }


    function ocultaIngSesion() {
        $("#ingSesion").hide();

    }

    function muestraIngSesion() {

        $("#ingSesion").show();


    }

})();