(function() {

    //Al completar la pantalla tira un listado con los ultimos 10 pacientes//
    $(document).ready(function() {

        // carga los pacientes

        cargaListaPac()

    });


    //boton de buscar paciente en modal//	
    $("#formBuscar").on("submit", function(e) {

        e.preventDefault();

        var formulario = $(this);

        var datosSerializados = formulario.serialize();

        console.log('DATOS SERIALIZADOS: ' + datosSerializados);

        //Arma la cabecera con el token
        var myHeaders = new Headers();
        myHeaders.append("token", localStorage.getItem("token"));

        var requestOptions = {
            method: 'GET',
            headers: myHeaders
        };

        var entorno = localStorage.getItem("entorno");

        fetch(entorno + '/paciente/buscar/' + datosSerializados, requestOptions)
            .then(response => response.json())
            .then(json => {
                console.log(json);

                limpiaModalBusq();
                $("#myModal").hide();

                $("#tblRegistros").empty();

                for (i = 0; i < json.pacientes.length; i++) {

                    var content = "";

                    content += "<tr id='registro'>";
                    // content += "<td style='height:10px;' class='text-center'>" + data.pacientes[i].pac_id + "</td>";
                    content += "<td style='height:10px;' class='text-center'>" + json.pacientes[i].nombre + "</td>";
                    content += "<td class='text-center'>" + json.pacientes[i].obra_soc + "</td>";
                    content += "<td class='text-center'>" + json.pacientes[i].afiliado + "</td>";
                    content += "<td class='text-center'>" + json.pacientes[i].plan + "</td>";
                    content += "<td class='text-center'>" + json.pacientes[i].telefono + "</td>";
                    content += "<td data-iden='" + json.pacientes[i]._id + "' class='text-center'><button id='btnEdit' class='btn btn-primary btn-sm'>Editar</button></td>";
                    content += "<td data-iden='" + json.pacientes[i]._id + "' class='text-center'><button id='btnDel' class='btn btn-danger btn-sm'>Eliminar</button></td>";
                    content += "<td data-iden='" + json.pacientes[i]._id + "' class='text-center'><button id='btnVer' class='btn btn-primary btn-sm'>Ver</button></td>";
                    content += "<td data-iden='" + json.pacientes[i]._id + "' class='text-center'><button id='btnFicha' class='btn btn-primary btn-sm'>Antededentes</button></td>";
                    content += "<td id='idtrat' data-nombre='" + json.pacientes[i].nombre + "' data-iden='" + json.pacientes[i]._id + "' class='text-center'><button id='btnTratam' class='btn btn-primary btn-sm'>Tratamiento</button></td>";
                    content += "</tr>";

                    $("#tblRegistros").append(content);

                };

            });

    });


    //boton de ingresar paciente en modal//	
    $("#formIngreso").on("submit", function(e) {

        e.preventDefault();

        if (validaObligatorios()) {

            validaPacExist(function(resp) {

                if (resp) {

                    var entorno = localStorage.getItem("entorno");

                    var formulario = $("#formIngreso");

                    var datosSerializados = formulario.serialize();

                    console.log("datos serializados" + datosSerializados);

                    var tipoAccion = $("#tipoAccion").val(); //se fija que tipo de accion tiene q hacer

                    if (tipoAccion === "Alta") {

                        var myHeaders = new Headers();
                        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
                        myHeaders.append("token", localStorage.getItem("token"));

                        // Can also constructor from another URLSearchParams
                        var urlencoded = new URLSearchParams(datosSerializados);

                        urlencoded.append("nombre", urlencoded.get('paciente'));
                        urlencoded.append("obra_soc", urlencoded.get('obra'));
                        //urlencoded.append("afiliado", urlencoded.get('afiliado'));
                        //urlencoded.append("plan", urlencoded.get('plan'));
                        //urlencoded.append("telefono", urlencoded.get('telefono'));
                        //urlencoded.append("observacion", urlencoded.get('observac'));
                        urlencoded.append("estado", "activo");
                        urlencoded.append("fecha_baja", "31/12/2099");
                        urlencoded.append("fecha_creacion", "07/06/2020");

                        var requestOptions = {
                            method: 'POST',
                            headers: myHeaders,
                            body: urlencoded,
                            redirect: 'follow'
                        };

                        fetch(entorno + '/paciente/crear', requestOptions)
                            .then(function(res) {
                                pacienteInsertado()
                            })
                            .catch(function(res) { console.log(res) })


                    } else {

                        var myHeaders = new Headers();
                        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
                        myHeaders.append("token", localStorage.getItem("token"));

                        // Can also constructor from another URLSearchParams
                        var urlencoded = new URLSearchParams(datosSerializados);

                        var id = urlencoded.get('idPac');

                        urlencoded.append("nombre", urlencoded.get('paciente'));
                        urlencoded.append("obra_soc", urlencoded.get('obra'));
                        //urlencoded.append("afiliado", urlencoded.get('afiliado'));
                        //urlencoded.append("plan", urlencoded.get('plan'));
                        //urlencoded.append("telefono", urlencoded.get('telefono'));
                        urlencoded.append("observacion", urlencoded.get('observac'));
                        urlencoded.append("estado", "activo");
                        urlencoded.append("fecha_baja", "31/12/2099");
                        urlencoded.append("fecha_creacion", "07/06/2020");

                        var requestOptions = {
                            method: 'PUT',
                            headers: myHeaders,
                            body: urlencoded,
                            redirect: 'follow'
                        };

                        fetch(entorno + '/paciente/actualizar/' + id, requestOptions)
                            .then(function(res) {
                                pacienteModificado()
                            })
                            .catch(function(res) { console.log(res) })

                    };

                };

            });

        }
    });


    //codigo para mostrar y ocultar los formularios modales Actualizar Paciente
    $("body").on("click", "#btnEdit", function(e) {

        e.preventDefault();

        var id = $(this).parent().data("iden"); //obtiene id del paciente

        sacaReadOnly();
        $("#idPac").val(id); //inicializa valores referentes a modificacion
        $("#tipoAccion").val("Modif");
        $("#modalIngresarPac").text("Actualizar");
        $("#titulo").text("Actualizacion datos del Paciente");
        $("#modalIngresarPac").show();

        //Arma la cabecera con el token
        var myHeaders = new Headers();
        myHeaders.append("token", localStorage.getItem("token"));

        var requestOptions = {
            method: 'GET',
            headers: myHeaders
        };

        var entorno = localStorage.getItem("entorno");

        fetch(entorno + '/paciente/porid/' + id, requestOptions)
            .then(response => response.json())
            .then(json => {
                console.log(json);

                $("#pacienteIn").val(json.pacientes.nombre);
                $("#obraSocial").val(json.pacientes.obra_soc);
                $("#afiliado").val(json.pacientes.afiliado);
                $("#plan").val(json.pacientes.plan);
                $("#telefono").val(json.pacientes.telefono);
                $("#observac").val(json.pacientes.observacion);

                $("#myModalIngreso").show();

            });


    });


    //codigo para mostrar y ocultar los formularios modales Actualizar Paciente
    $("body").on("click", "#btnDel", function(e) {

        e.preventDefault();

        var id = $(this).parent().data("iden"); //obtiene id del paciente

        $("#idPacDel").val(id);
        $("#myModalDel").show();


    });



    //codigo boton eliminar
    $("#modalEliminarPac").on("click", function() {

        var formulario = $("#formDel");
        var datosSerializados = formulario.serialize();

        console.log(datosSerializados);

        var urlencoded = new URLSearchParams(datosSerializados);
        var id = urlencoded.get('idPacDel');

        //Arma la cabecera con el token
        var myHeaders = new Headers();
        myHeaders.append("token", localStorage.getItem("token"));

        var requestOptions = {
            method: 'DELETE',
            headers: myHeaders
        };

        var entorno = localStorage.getItem("entorno");

        fetch(entorno + '/paciente/borrar/' + id, requestOptions)
            .then(response => response.json())
            .then(json => {

                console.log(json);
                $("#myModalDel").hide();
                Swal.fire('El paciente ha sido eliminado');
                cargaListaPac();

            });




    });


    //codigo para mostrar boton Ver
    $("body").on("click", "#btnVer", function(e) {

        e.preventDefault();

        var id = $(this).parent().data("iden"); //obtiene id del paciente

        poneReadOnly();
        $("#idPac").val(id); //inicializa valores referentes a modificacion
        $("#tipoAccion").val("Consul");
        $("#modalIngresarPac").hide();
        $("#titulo").text("Visualizacion datos del Paciente");

        //Arma la cabecera con el token
        var myHeaders = new Headers();
        myHeaders.append("token", localStorage.getItem("token"));

        var requestOptions = {
            method: 'GET',
            headers: myHeaders
        };

        var entorno = localStorage.getItem("entorno");
        fetch(entorno + '/paciente/porid/' + id, requestOptions)
            .then(response => response.json())
            .then(json => {
                console.log(json);

                $("#pacienteIn").val(json.pacientes.nombre);
                $("#obraSocial").val(json.pacientes.obra_soc);
                $("#afiliado").val(json.pacientes.afiliado);
                $("#plan").val(json.pacientes.plan);
                $("#telefono").val(json.pacientes.telefono);
                $("#observac").val(json.pacientes.observacion);

                $("#myModalIngreso").show();

            });
    });



    $("#btnIngreso").on("click", function() {
        sacaReadOnly();
        $("#tipoAccion").val("Alta");
        $("#titulo").text("Ingreso datos del Paciente");
        $("#modalIngresarPac").show();
        $("#modalIngresarPac").text("Ingreso");
        $("#myModalIngreso").show();
    });

    $("#btnBuscar").on("click", function() {
        $("#myModal").show();
    });

    $("#modalCerrar").on("click", function() {
        $("#myModal").hide();

    });

    $("#modalCerrarDar").on("click", function() {
        $("#myModalIngreso").hide();
        limpiaModalIngreso();
    });

    $("#modalCerrarEliminar").on("click", function() {
        $("#myModalDel").hide();
    });

    $("#modalCerrarAc").on("click", function() {
        $("#myModalAc").hide();
        limpiaModalAc();
    });

    function limpiaModalAc() {
        $("#pacienteAc").val('');
        $("#obraSocialAc").val('');
        $("#afiliadoAc").val('');
        $("#planAc").val('');
        $("#telefonoAc").val('');
        $("#observacAc").val('');
    };


    function limpiaModalIngreso() {
        $("#pacienteIn").val('');
        $("#obraSocial").val('');
        $("#afiliado").val('');
        $("#plan").val('');
        $("#telefono").val('');
        $("#observac").val('');
    };

    function limpiaModalBusq() {
        $("#pacienteBus").val('');
        $("#obraSocBus").val('');
    };


    function poneReadOnly() {

        $("#pacienteIn").attr("readonly", "readonly");
        $("#obraSocial").attr("readonly", "readonly");
        $("#afiliado").attr("readonly", "readonly");
        $("#plan").attr("readonly", "readonly");
        $("#telefono").attr("readonly", "readonly");
        $("#observac").attr("readonly", "readonly");
    };

    function sacaReadOnly() {

        $("#pacienteIn").removeAttr("readonly");
        $("#obraSocial").removeAttr("readonly");
        $("#afiliado").removeAttr("readonly");
        $("#plan").removeAttr("readonly");
        $("#telefono").removeAttr("readonly");
        $("#observac").removeAttr("readonly");
    };


    function validaObligatorios() {

        if (!$("#pacienteIn").val()) {
            Swal.fire('El nombre del paciente es obligatorio');
            return false;
        };

        if (!$("#obraSocial").val()) {
            Swal.fire('La Obra Social es obligatoria');
            return false;
        };

        if (!$("#afiliado").val()) {
            Swal.fire('El numero de afiliado es obligatorio');
            return false;
        };

        if (!$("#plan").val()) {
            Swal.fire('El plan es obligatorio');
            return false;
        };

        if (!$("#telefono").val()) {
            Swal.fire('El telefono es obligatorio');
            return false;
        };

        return true;
    }


    function pacienteInsertado() {
        Swal.fire('Paciente ingresado correctamente', '', 'success');
        $("#myModalIngreso").hide();
        limpiaModalIngreso();
        cargaListaPac();
    };

    function pacienteModificado() {
        Swal.fire('Paciente actualizado correctamente', '', 'success');
        $("#myModalIngreso").hide();
        limpiaModalIngreso();
        cargaListaPac();
    };

    function $_GET(param) {
        var vars = {};
        window.location.href.replace(location.hash, '').replace(
            /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
            function(m, key, value) { // callback
                vars[key] = value !== undefined ? value : '';
            }
        );

        if (param) {
            return vars[param] ? vars[param] : null;
        }
        return vars;
    }

    function validaPacExist(my_callback) {

        //si es modificacion no valida repetidos despues hay que verlo bien
        if ($("#tipoAccion").val() === "Alta") {

            var retorno = false;
            afil = $("#afiliado").val();

            //Arma la cabecera con el token
            var myHeaders = new Headers();
            myHeaders.append("token", localStorage.getItem("token"));

            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            };

            var entorno = localStorage.getItem("entorno");
            fetch(entorno + '/paciente/afiliado/' + afil, requestOptions)
                .then(response => response.json())
                .then(json => {

                    if (json.cantidad == 0) {
                        retorno = true;
                        my_callback(retorno);
                    } else {
                        Swal.fire('El afiliado ya se encuentra registrado');
                        retorno = false;
                        my_callback(retorno);
                    };

                    return retorno;
                })

        } else {

            retorno = true;
            my_callback(retorno);
            return retorno;
        };

    };


    function cargaListaPac() {

        $("#tblRegistros").empty();

        //Arma la cabecera con el token
        var myHeaders = new Headers();
        myHeaders.append("token", localStorage.getItem("token"));

        var requestOptions = {
            method: 'GET',
            headers: myHeaders
        };

        var entorno = localStorage.getItem("entorno");
        fetch(entorno + "/paciente", requestOptions)
            .then(response => response.json())
            .then(json => {
                console.log(json);

                for (i = 0; i < json.pacientes.length; i++) {

                    var content = "";

                    content += "<tr id='registro'>";
                    // content += "<td style='height:10px;' class='text-center'>" + json.pacientes[i]._id + "</td>";
                    content += "<td style='height:10px;' class='text-center'>" + json.pacientes[i].nombre + "</td>";
                    content += "<td class='text-center'>" + json.pacientes[i].obra_soc + "</td>";
                    content += "<td class='text-center'>" + json.pacientes[i].afiliado + "</td>";
                    content += "<td class='text-center'>" + json.pacientes[i].plan + "</td>";
                    content += "<td class='text-center'>" + json.pacientes[i].telefono + "</td>";
                    content += "<td data-iden='" + json.pacientes[i]._id + "' class='text-center'><button id='btnEdit' class='btn btn-primary btn-sm'>Editar</button></td>";
                    content += "<td data-iden='" + json.pacientes[i]._id + "' class='text-center'><button id='btnDel' class='btn btn-danger btn-sm'>Eliminar</button></td>";
                    content += "<td data-iden='" + json.pacientes[i]._id + "' class='text-center'><button id='btnVer' class='btn btn-primary btn-sm'>Ver</button></td>";
                    content += "<td data-iden='" + json.pacientes[i]._id + "' class='text-center'><button id='btnFicha' class='btn btn-primary btn-sm'>Antecedentes</button></td>";
                    content += "<td id='idtrat' data-nombre='" + json.pacientes[i].nombre + "' data-iden='" + json.pacientes[i]._id + "' class='text-center'><button id='btnTratam' class='btn btn-primary btn-sm'>Tratamiento</button></td>";
                    content += "</tr>";

                    $("#tblRegistros").append(content);

                };

            });

    };

})();