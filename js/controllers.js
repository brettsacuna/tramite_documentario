(function () {
    'use-strict';

    var api = require('./../config.json');

    angular
        .module('tramiteApp.controllers', [])
        .controller('panelCtrl', panelCtrl)
        .controller('asideCtrl', asideCtrl)
        .controller('inicioSesionCtrl', inicioSesionCtrl)
        .controller('pendientesCtrl', pendientesCtrl)
        .controller('nuevoDocumentoCtrlPrtl', nuevoDocumentoCtrlPrtl)
        .controller('editarDocumentoCtrlPrtl', editarDocumentoCtrlPrtl)
        .controller('ingresarDecretosCtrlPrtl', ingresarDecretosCtrlPrtl)
        .controller('verEstadoCtrlPrtl', verEstadoCtrlPrtl)
        .controller('cambiarAdjuntoCtrlPrtl', cambiarAdjuntoCtrlPrtl)
        .controller('messageCtrlPrtl', messageCtrlPrtl);

    function panelCtrl ($uibModal) {
        var panel = this;

        panel.tipo_busqueda = "0";

        panel.hoy = function () {
            panel.desde = new Date();
            panel.hasta = new Date();
        };

        panel.abrir_calendario = function (calendario) {
            if (calendario == 'desde') {
                panel.desde_seleccionado = true;
            } else {
                panel.hasta_seleccionado = true;
            }
        };

        panel.hoy();

        panel.nuevo_documento = function () {
            var modalNuevoDocumento = $uibModal.open({
				templateUrl: 'views/partials/nuevo_documento_tpl_prtl.html',
				controller: 'nuevoDocumentoCtrlPrtl as nuevo_documento',
				size: 'md'
			});

			modalNuevoDocumento.result.then(function (response) {
				console.log(response);
			}, function () {
				console.log('Modal dismissed at: ' + new Date());
			});
        };

        panel.editar_documento = function () {
            var modalEditarDocumento = $uibModal.open({
				templateUrl: 'views/partials/editar_documento_tpl_prtl.html',
				controller: 'editarDocumentoCtrlPrtl as editar_documento',
				size: 'md'
			});

			modalEditarDocumento.result.then(function (response) {
				console.log(response);
			}, function () {
				console.log('Modal dismissed at: ' + new Date());
			});
        };

        panel.cambiar_adjunto = function () {
            var modalCambiarAdjunto = $uibModal.open({
				templateUrl: 'views/partials/cambiar_adjunto_tpl_prtl.html',
				controller: 'cambiarAdjuntoCtrlPrtl as cambiar_adjunto',
				size: 'sm'
			});

			modalCambiarAdjunto.result.then(function (response) {
				console.log(response);
			}, function () {
				console.log('Modal dismissed at: ' + new Date());
			});
        };

        panel.ingresar_decretos = function () {
            var modalIngresarDecretos = $uibModal.open({
				templateUrl: 'views/partials/ingresar_decretos_tpl_prtl.html',
				controller: 'ingresarDecretosCtrlPrtl as ingresar_decretos',
				size: 'md'
			});

			modalIngresarDecretos.result.then(function (response) {
				console.log(response);
			}, function () {
				console.log('Modal dismissed at: ' + new Date());
			});
        };

        panel.ver_estado = function () {
            var modalVerEstado = $uibModal.open({
				templateUrl: 'views/partials/ver_estado_tpl_prtl.html',
				controller: 'verEstadoCtrlPrtl as ver_estado',
				size: 'sm'
			});

			modalVerEstado.result.then(function (response) {
				console.log(response);
			}, function () {
				console.log('Modal dismissed at: ' + new Date());
			});
        };
    }

    function asideCtrl ($timeout) {
        var aside = this;

        aside.clock = "Cargando fecha y hora ...";
        aside.tickInterval = 1000;

        var tick = function() {
            aside.clock = Date.now();
            $timeout(tick, aside.tickInterval);
        };

        $timeout(tick, aside.tickInterval);
    }

    function inicioSesionCtrl () {
        var inicio_sesion = this;
    }

    function pendientesCtrl () {
        var pendientes = this;
    }

    function nuevoDocumentoCtrlPrtl ($uibModalInstance) {
        var nuevo_documento = this;

        nuevo_documento.fecha_documento = new Date();

        nuevo_documento.cerrar = function () {
            $uibModalInstance.dismiss();
        };

        nuevo_documento.abrir_calendario = function () {
            nuevo_documento.fecha_documento_seleccionado = true;
        };
    }

    function editarDocumentoCtrlPrtl ($uibModalInstance) {
        var editar_documento = this;

        editar_documento.fecha_documento = new Date();

        editar_documento.cerrar = function () {
            $uibModalInstance.dismiss();
        };

        editar_documento.abrir_calendario = function () {
            editar_documento.fecha_documento_seleccionado = true;
        };
    }

    function ingresarDecretosCtrlPrtl ($uibModalInstance) {
        var ingresar_decretos = this;

        ingresar_decretos.cerrar = function () {
            $uibModalInstance.dismiss();
        };
    }

    function verEstadoCtrlPrtl ($uibModalInstance) {
        var ver_estado = this;

        ver_estado.cerrar = function () {
            $uibModalInstance.dismiss();
        };
    }

    function cambiarAdjuntoCtrlPrtl ($uibModalInstance, Upload, messageFct) {
        var cambiar_adjunto = this;
        console.log(api.url);
        cambiar_adjunto.cerrar = function () {
            $uibModalInstance.dismiss();
        };

        cambiar_adjunto.guardar_adjunto = function(adjunto){
            if (adjunto) {
                cambiar_adjunto.cargar_adjunto(adjunto);
            }
        };

        cambiar_adjunto.cargar_adjunto = function (file) {
            Upload.upload({
                url: api.url+'/upload',
                data:{file:file}
            }).then(function (resp) {
                if(resp.data.error_code === 0){
                    messageFct.message('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
                } else {
                    messageFct.message('an error occured');
                }
            }, function (resp) {
                console.log('Error status: ' + resp.status);
            }, function (evt) {
                console.log(evt);
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                cambiar_adjunto.progress = 'progress: ' + progressPercentage + '% ';
            });
        };
    }

    function messageCtrlPrtl ($uibModalInstance, $sce, message, callback, button) {
		var alert = this;

		callback = callback || null;

		alert.button = button;
		alert.message = $sce.trustAsHtml(message);

		alert.close = function () {
			$uibModalInstance.dismiss();
		};

		alert.success = function () {
			$uibModalInstance.close();
		};

		if(callback){
			alert.callback = callback;
		}
	}
})();
