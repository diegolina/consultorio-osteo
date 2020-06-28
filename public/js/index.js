(function() {

    function seteaEntorno() {

        var entorno = $("#entorno").val();

        localStorage.setItem("entorno", entorno);

        return;

    }


    $("#cambioPass").on("click",
        function() {

            if ($("#entorno").val() === '') {
                Swal.fire('Es necesario ingresar un entorno', '', 'error ');
                return;
            };

            seteaEntorno();
            var entorno = $("#entorno").val();

            correo = $("#correo").val();

            if (correo === '') {
                Swal.fire('Es necesario ingresar un usuario', '', 'error');
            } else {

                //Carga las preguntas
                fetch(entorno + "/usuario/preguntas/" + correo)
                    .then(response => response.text())
                    .then(result => {
                        console.log(result);
                        let respuesta = JSON.parse(result);

                        $("#lblPreg1").text(respuesta.usuarios[0].pregunta1);
                        $("#lblPreg2").text(respuesta.usuarios[0].pregunta2);
                        $("#lblPreg3").text(respuesta.usuarios[0].pregunta3);
                        $("#idUsuario").val(respuesta.usuarios[0]._id);

                    })
                    .catch(error => console.log('error', error));

                //Muestra el formulario y limpia
                $("#btnPass").hide()
                $("#lblPass").hide()
                $("#nuevaPass").hide()
                $("#myModalPass").show();
                $("#respuesta1").val('');
                $("#respuesta2").val('');
                $("#respuesta3").val('');

            };

        });



    $("#btnVolver").on("click",
        function() {
            $("#btnPass").hide()
            $("#lblPass").hide()
            $("#nuevaPass").hide()
            $("#myModalPass").hide();

        });

    $("#btnPass").on("click",
        function() {

            if ($("#entorno").val() === '') {
                Swal.fire('Es necesario ingresar un entorno', '', 'error ');
                return;
            };

            seteaEntorno();
            var entorno = $("#entorno").val();

            let nuevaPass = $("#nuevaPass").val();

            if (nuevaPass === '') {
                Swal.fire('Es necesario ingresar una contraseña', '', 'error ');
            } else {
                //hace el cambio de pass

                id = $("#idUsuario").val();

                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

                // Can also constructor from another URLSearchParams
                var urlencoded = new URLSearchParams()

                urlencoded.append("password", nuevaPass);

                var requestOptions = {
                    method: 'PUT',
                    headers: myHeaders,
                    body: urlencoded,
                    redirect: 'follow'
                };

                fetch(entorno + '/usuario/pass/' + id, requestOptions)
                    .then(function(res) {
                        Swal.fire('Contraseña modificada correctamente!', '', 'sucess ');
                        $("#myModalPass").hide();

                    })
                    .catch(function(res) { console.log(res) })

            }

        });

    $("#btnValidar").on("click",
        function() {

            if ($("#entorno").val() === '') {
                Swal.fire('Es necesario ingresar un entorno', '', 'error ');
                return;
            };

            seteaEntorno();

            var datosSerializados = "email=" + $("#correo").val() + "&" + "respuesta1=" + $("#respuesta1").val() + "&" + "respuesta2=" + $("#respuesta2").val() + "&" + "respuesta3=" + $("#respuesta3").val();

            console.log('DATOS SERIALIZADOS: ' + datosSerializados);


            var entorno = $("#entorno").val();

            fetch(entorno + "/usuario/respuestas/" + datosSerializados)
                .then(response => response.text())
                .then(result => {
                    console.log('RESULTADO ', result);

                    let respuesta = JSON.parse(result);

                    console.log(respuesta.cantidad);

                    if (respuesta.cantidad == 0) {
                        Swal.fire('Existe un error en alguna de sus respuestas!', '', 'error');

                    } else {
                        Swal.fire('Respuestas correctas. Puede proceder a cambiar su password', '', 'success');
                        $("#btnValidar").hide();
                        $("#btnPass").show()
                        $("#lblPass").show()
                        $("#nuevaPass").show()

                    }

                })
                .catch(error => console.log('error', error));




            /*
            $("#myModalPass").hide();
            */

        });




    $("#btnEntrar").on("click", function(e) {

        if ($("#entorno").val() === '') {
            Swal.fire('Es necesario ingresar un entorno', '', 'error ');
            return;
        };

        var entorno = $("#entorno").val();

        localStorage.setItem("entorno", entorno);



        var email = $("#correo").val();
        var contrasenia = $("#palabraSecreta").val();

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        console.log(email);
        console.log(contrasenia);

        var urlencoded = new URLSearchParams();
        urlencoded.append("password", contrasenia);
        urlencoded.append("email", email);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };


        fetch(entorno + "/login", requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log(result);
                let respuesta = JSON.parse(result);
                console.log(respuesta.ok);

                if (respuesta.ok === false) {
                    Swal.fire('Correo o Password incorrecto', '', 'error');

                } else {

                    localStorage.setItem("token", respuesta.token);
                    location.href = "main.html";

                }

            })
            .catch(error => console.log('error', error));

    });


})();