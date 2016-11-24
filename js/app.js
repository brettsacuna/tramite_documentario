(function () {
    'use-strict';

    angular
        .module('tramiteApp', ['tramiteApp.controllers', 'tramiteApp.services', 'tramiteApp.directives', 'ui.bootstrap', 'ui.router', 'oc.lazyLoad'])
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
			.otherwise('/app/panel');

        $stateProvider
			.state('app', {
				abstract: true,
				url: '/app',
				views: {
					'': {
						templateUrl: './views/layout.html'
					},
                    'aside@': {
						templateUrl: './views/aside.html'
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
            .state('access', {
    				url: '/access',
    				template: '<div class="row" ui-view></div>'
    			})
    				.state('access.login', {
    					url: '/login',
    					templateUrl: 'views/pages/login_tpl.html',
    					data : { title: 'Log In' },
    					authenticate: false,
    					controller: 'loginCtrl as login',
    				});
    }
})();
