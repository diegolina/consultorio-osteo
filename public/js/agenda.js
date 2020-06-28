(function() {

    /*
        $("body").on("click", "#checkB", function(e) {

            //si le da check al box rescata el id y saca check al resto
            if ($(this).is(':checked')) {

                var horario = $(this).data("idens");

                console.log(horario);

               // $('input[id="checkB"]').not(this).prop('checked', false);


        });
    */

    $("#btnGenerar").on("click", function() {

        $("#registro td").each(function() {

            //    if ($('input[id="checkB"]').prop('checked') === true) {

            console.log($('input[id="checkB"]').prop('checked'));

            console.log($(this).text());


            //  }

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