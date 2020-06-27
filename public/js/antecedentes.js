(function() {


    $("#modalCerrarFicha").on("click", function() {

        $("#antecedentes").val("");
        $("#myModalFicha").hide();

    })

    $("#modalIngresarFicha").on("click", function() {

        var id = $("#idPacFicha").val(); //obtiene id del paciente

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        myHeaders.append("token", localStorage.getItem("token"));

        var entorno = localStorage.getItem("entorno");

        let antec = $("#antecedentes").val();

        var urlencoded = new URLSearchParams();

        urlencoded.append("antecedentes", antec);

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch(entorno + '/paciente/actualizarAntec/' + id, requestOptions)
            .then(function(res) {
                Swal.fire('El Antecedente ha sido ingresado correctamente', '', 'success');
                $("#antecedentes").val("");
                $("#myModalFicha").hide();

            })
            .catch(function(res) { console.log(res) })

    })




    $("body").on("click", "#btnFicha", function(e) {

        e.preventDefault();

        var id = $(this).parent().data("iden"); //obtiene id del paciente

        $("#idPacFicha").val(id);

        console.log(id);

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

                $("#antecedentes").val(json.pacientes.antecedentes);
                $("#myModalFicha").show();

            });

    });

})();