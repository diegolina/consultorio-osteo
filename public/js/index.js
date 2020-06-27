(function() {


    opcionesMenu = {

        opcionesPage: [],
        opcionesText: [],

        iniciaMenu: function(elementosPage, elementosText) {

            $.extend(opcionesMenu, elementosPage);
            $.extend(opcionesMenu, elementosText);

            for (i = 0; i < opcionesMenu.opcionesPage.length; i++) {
                var pagina = opcionesMenu.opcionesPage[i];
                var opcion = opcionesMenu.opcionesText[i];
                $("<a>", {
                    href: pagina + ".html",
                    text: opcion
                }).appendTo("#opciones");
            };
        }

    };

    opcionesMenu.iniciaMenu({
        opcionesPage: ["pacientes", "turnos", "agendas", "login"]
    }, { opcionesText: ["Pacientes", "Gestion de Turnos", "Gestion de Agendas", "Cerrar Sesion"] });


    //manejo de las imagenes	
    $("#imgKine")
        .addClass('img-circle img-thumbnail');

    //modificaciones al 2do bloque
    $("#turnos")
        .append(function() {
            f = new Date;
            fecha = f.getDate() + "/" + (f.getMonth() + 1) + "/" + f.getFullYear();
            return " " + fecha;
        });

})();