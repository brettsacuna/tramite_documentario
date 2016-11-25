(function () {
    'use-strict';

    var api = require('./../config.json');

    angular
        .module('tramiteApp.services', [])
        .factory('documentoFct', documentoFct)
        .factory('messageFct', messageFct);

    function documentoFct ($http, $q) {
        return {
            getSecciones : function (clase) {
				var defered = $q.defer();
		        var promise = defered.promise;

		        $http.get(api.backend+'/ServletSeccion?opcion=list')
		            .success(function(data) {
		                defered.resolve(data);
		            })
		            .error(function(err) {
		                defered.reject(err);
		            });

		        return promise;
			}
        };
    }

    function messageFct ($uibModal, $log) {
		return {
		    message : function (message, callback, button) {
				var modalMessage = $uibModal.open({
					animation: true,
					templateUrl: 'views/partials/message_tpl_prtl.html',
					controller: 'messageCtrlPrtl as alert',
					size: 'md',
					keyboard: false,
					resolve: {
					  message: function () {
					    return message;
					  },
					  callback : function(){
					    return callback;
					  },
					  button: function(){
					    return button;
					  }
					}
				});

				modalMessage.result.then(function (band) {
					return band;
				}, function () {
					console.log('Modal dismissed at: ' + new Date());
				});
		    }
		};
	}
})();
