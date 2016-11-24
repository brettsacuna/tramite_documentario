(function () {
    'use-strict';

    angular
        .module('tramiteApp', ['tramiteApp.controllers', 'tramiteApp.services', 'tramiteApp.directives', 'ui.bootstrap', 'angular-confirm', 'ui.router', 'oc.lazyLoad'])
        .run(appRun)
        .config(appConfig);

    function appRun($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    }

    function appConfig ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {
        $ocLazyLoadProvider.config({
			debug:false,
			events:true,
		});

        $urlRouterProvider
			.otherwise('/acceso/inicio_sesion');

        $stateProvider
			.state('app', {
				abstract: true,
				url: '/app',
				views: {
					'': {
						templateUrl: './views/layout.html'
					},
                    'aside@': {
						templateUrl: './views/aside.html',
                        controller: 'asideCtrl as aside'
					},
					'content@': {
						templateUrl: './views/content.html'
					}
				}
			})
				.state('app.panel', {
					parent: 'app',
					url: '/panel',
					templateUrl: 'views/pages/panel_tpl.html',
					data : { title: 'Panel Principal', sub_title: 'Documentos registrados' },
					controller: 'panelCtrl as panel'
				})
                .state('app.pendientes', {
					parent: 'app',
					url: '/pendientes',
					templateUrl: 'views/pages/pendientes_tpl.html',
					data : { title: 'Listado de documentos pendientes', sub_title: 'Documentos pendientes' },
					controller: 'pendientesCtrl as pendientes'
				})
            .state('acceso', {
    				url: '/acceso',
    				template: '<div class="container" ui-view></div>'
    			})
    				.state('acceso.inicio_sesion', {
    					url: '/inicio_sesion',
    					templateUrl: 'views/pages/inicio_sesion_tpl.html',
    					data : { title: 'Iniciar sesión' },
    					authenticate: false,
    					controller: 'inicioSesionCtrl as inicio_sesion',
    				});
    }
})();
