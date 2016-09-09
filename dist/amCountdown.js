(function(window, angular) {
    "use strict";

    (function () {
        "use strict";

        angular
            .module('amCountdown', [])
            .component('amCountdown', {
                template: template,
                bindings: {
                    deadline: "<"
                },
                require: {},
                controllerAs: 'amCountdown',
                controller: AmCountdown
            })
            .factory('amCountdownTemplates', function() {
                return {
                    getTemplate: function(name) {
                        console.log("YAY");
                    }
                }
            });

        function template ($element, $attrs, $templateCache) {
            var providedTemplate = $attrs.template;

            if(providedTemplate) {

                var actualTemplate = $templateCache.get(providedTemplate);

                return actualTemplate || 'error could not find template';
            }


            return  '<span>{{amCountdown.clock.days}}</span>:' +
                    '<span>{{amCountdown.clock.hours}}</span>:' +
                    '<span>{{amCountdown.clock.minutes}}</span>:' +
                    '<span>{{amCountdown.clock.seconds}}</span>';
        }

        template.$inject = ['$element', '$attrs', '$templateCache'];

        function AmCountdown($scope, $element, $attrs, $interval, $reactive) {

            $reactive(this).attach($scope);

            $scope.$on("$destroy", function() {
                if(timeinterval) {
                    $interval.cancel(timeinterval);
                }
            });

            var amCountdown = this,
                timeinterval = null;

            this.clock = {};

            function initializeClock(endtime) {
                function updateClock() {

                    var t = Date.parse(endtime) - Date.parse(new Date());
                    var seconds = Math.floor((t / 1000) % 60);
                    var minutes = Math.floor((t / 1000 / 60) % 60);
                    var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
                    var days = Math.floor(t / (1000 * 60 * 60 * 24));

                    seconds = ('0' + seconds).slice(-2);
                    minutes = ('0' + minutes).slice(-2);
                    hours = ('0' + hours).slice(-2);
                    days = ('0' + days).slice(-2);

                    amCountdown.clock = {
                        'total': t,
                        'days': days,
                        'hours': hours,
                        'minutes': minutes,
                        'seconds': seconds
                    };

                    if (amCountdown.clock.total <= 0) {
                        $interval.cancel(timeinterval);
                    }
                }

                updateClock();

                if(timeinterval) {
                    $interval.cancel(timeinterval);
                }

                timeinterval = $interval(updateClock, 1000);
            }

            this.helpers({
                _clock: function() {
                    var deadline = new Date(Date.parse(new Date(amCountdown.getReactively('deadline'))));
                    initializeClock(deadline);
                }
            });



        }

        AmCountdown.$inject = ['$scope', '$element', '$attrs', '$interval', '$reactive'];

    })();

})(window, window.angular);
