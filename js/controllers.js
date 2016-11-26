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
        .controller('visualizarAdjuntoCtrlPrtl', visualizarAdjuntoCtrlPrtl)
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

        panel.visualizar_adjunto = function () {
            var modalVisualizarAdjunto = $uibModal.open({
				templateUrl: 'views/partials/visualizar_adjunto_tpl_prtl.html',
				controller: 'visualizarAdjuntoCtrlPrtl as visualizar_adjunto',
				size: 'md'
			});

			modalVisualizarAdjunto.result.then(function (response) {
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

    function nuevoDocumentoCtrlPrtl ($uibModalInstance, documentoFct, messageFct, $filter, Upload) {
        var nuevo_documento = this;

        nuevo_documento.fecha_documento = new Date();

        nuevo_documento.cerrar = function () {
            $uibModalInstance.dismiss();
        };

        nuevo_documento.abrir_calendario = function () {
            nuevo_documento.fecha_documento_seleccionado = true;
        };

        nuevo_documento.obtener_tipo_documento = function () {
            documentoFct.getTipoDocumento().then(function (response) {
                nuevo_documento.tipos_documento = response;
                nuevo_documento.obtener_secciones();
            }).catch(function (reason) {
                console.log(reason);
            });
        };

        nuevo_documento.obtener_secciones = function () {
            documentoFct.getSecciones().then(function (response) {
                nuevo_documento.secciones = response;
                nuevo_documento.obtener_clasificaciones();
            }).catch(function (reason) {
                console.log(reason);
            });
        };

        nuevo_documento.obtener_clasificaciones = function () {
            documentoFct.getClasificaciones().then(function (response) {
                nuevo_documento.clasificaciones = response;
            }).catch(function (reason) {
                console.log(reason);
            });
        };

        nuevo_documento.inicializar = function () {
            nuevo_documento.obtener_tipo_documento();
        };

        nuevo_documento.inicializar();

        nuevo_documento.obtener_unidades = function (filtro) {
            return documentoFct.getUnidades(filtro).then(function (response) {
				return response.map(function(item){
		          return item;
		        });
			}).catch(function (reason) {
				messageFct.message('Ocurrió un problema --> '+reason);
			});
        };

        nuevo_documento.guardar_documento = function(adjunto){
            if (adjunto) {
                nuevo_documento.cargar_adjunto(adjunto);
            }
        };

        nuevo_documento.cargar_adjunto = function (file) {
            Upload.upload({
                url : api.url+'/upload',
                data: {file : file}
            }).then(function (resp) {
                if(resp.data.error_code === 0){
                    var data = $.param({
                        asunto : nuevo_documento.asunto,
                        documento_fecha : $filter('date')(nuevo_documento.fecha_documento, 'yyyy-MM-dd'),
                        tipo_documento_id : nuevo_documento.tipo_documento.tipo_documento_id,
                        documento_numero : nuevo_documento.numero_documento || '000',
                        unidad_id_origen : nuevo_documento.unidad_origen.unidad_id,
                        seccion_id_destino : nuevo_documento.destino.seccion_id,
                        clasificacion_id : nuevo_documento.clasificacion.clasificacion_id,
                        url_archivo : resp.data.filename
        			});

                    documentoFct.saveDocumento(data).then(function (response) {
                        if (response.affected == 1) {
        					messageFct.message('Se cambió de adjunto al documento correctamente -> '+resp.data.filename);

        					$uibModalInstance.close(true);
        				}  else {
        					messageFct.message("Ocurrió un error al intentar registrar el documento");
        				}
                    }).catch(function (reason) {
                        console.log(reason);
                    });
                } else {
                    messageFct.message('Ocurrió un error al intentar cargar el archivo');
                }
            }, function (resp) {
                console.log('Estado de error : ' + resp.status);
                nuevo_documento.progreso = undefined;
            }, function (evt) {
                var progreso_carga = parseInt(100.0 * evt.loaded / evt.total);

                nuevo_documento.progreso = 'Subiendo : ' + progreso_carga + '% ';
                nuevo_documento.valor = progreso_carga;
            });
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

    function visualizarAdjuntoCtrlPrtl ($scope, $uibModalInstance) {
        var visualizar_adjunto = this;

        visualizar_adjunto.cerrar = function () {
            $uibModalInstance.dismiss();
        };
    }

    function ingresarDecretosCtrlPrtl ($uibModalInstance, documentoFct) {
        var ingresar_decretos = this;

        ingresar_decretos.cerrar = function () {
            $uibModalInstance.dismiss();
        };

        ingresar_decretos.obtener_secciones = function () {
            documentoFct.getSecciones().then(function (response) {
                ingresar_decretos.secciones = response;
            }).catch(function (reason) {
                console.log(reason);
            });
        };

        ingresar_decretos.obtener_disposiciones = function () {
            documentoFct.getDisposiciones().then(function (response) {
                ingresar_decretos.disposiciones = response;
            }).catch(function (reason) {
                console.log(reason);
            });
        };

        ingresar_decretos.inicializar = function () {
            ingresar_decretos.obtener_secciones();
            ingresar_decretos.obtener_disposiciones();
        };

        ingresar_decretos.inicializar();
    }

    function verEstadoCtrlPrtl ($uibModalInstance) {
        var ver_estado = this;

        ver_estado.cerrar = function () {
            $uibModalInstance.dismiss();
        };
    }

    function cambiarAdjuntoCtrlPrtl ($uibModalInstance, Upload, messageFct) {
        var cambiar_adjunto = this;

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
                url : api.url+'/upload',
                data: {file : file}
            }).then(function (resp) {
                if(resp.data.error_code === 0){
                    messageFct.message('Se cambió de adjunto al documento correctamente -> '+resp.data.filename);
                } else {
                    messageFct.message('Ocurrió un error al intentar cargar el archivo');
                }
            }, function (resp) {
                console.log('Estado de error : ' + resp.status);
            }, function (evt) {
                var progreso_carga = parseInt(100.0 * evt.loaded / evt.total);

                cambiar_adjunto.progreso = 'Subiendo : ' + progreso_carga + '% ';
                cambiar_adjunto.valor = progreso_carga;
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
