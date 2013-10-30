var app = angular.module('tedVids', []);

app.config(function($httpProvider) { //Fix for cross domain access
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

app.controller('MainCtrl', ['$scope', '$http', '$timeout',
    function($scope, $http, $timeout) {
        var dataUrl = 'http://pipes.yahoo.com/pipes/pipe.run?_id=c6b9f27dbbdfed8e30e5dc0a9b445bda&_render=json';
        $scope.videos = [];
        var element = $('#videoPlayer')[0];
        var sliding = false;
        $scope.prevVideoIndex = -1;
        $scope.currentVideoIndex = 0;
        $scope.nextVideoIndex = 1;
        $scope.currentVideo;
        $scope, videoTitle = '';
        $scope.vidSrc = '';
        $scope, videoDesc = '';
        $scope.showVid = false;

        //make AJAX call
        $http.get(dataUrl).success(function(data) {
            $scope.videos = data.value.items;
            $scope.loadVideo(0);
        });

        $scope.closeVideo = function() {
            element.pause();
            $scope.showVid = false;
        }
        //Shows the current video and sets up the source for playing the video
        $scope.loadVideo = function(index) {
            $scope.currentVideoIndex = index;
            $scope.prevVideoIndex = ($scope.currentVideoIndex > 0) ? $scope.currentVideoIndex - 1 : $scope.videos.length - 1;
            $scope.nextVideoIndex = ($scope.currentVideoIndex < $scope.videos.length - 1) ? $scope.currentVideoIndex + 1 : 0;

            console.log($scope.prevVideoIndex, $scope.currentVideoIndex, $scope.nextVideoIndex);
            $scope.vidSrc = $scope.videos[$scope.currentVideoIndex]['media:content']['url'];
        };

        $scope.playVideo = function() {
            $scope.showVid = true;
            setTimeout(function() {
                element.load();
                element.play();
            }, 1500);
        };

        $scope.nextVideo = function() {
            if (sliding === true) {
                return false;
            }
            $('.vidNav').addClass('slideLeft');
            sliding = true;
            $timeout(function() {
                var nextIndex = $scope.currentVideoIndex + 1;
                if (nextIndex < $scope.videos.length) {
                    $scope.loadVideo(nextIndex);
                } else {
                    $scope.loadVideo(0);
                }
                $('.vidNav').removeClass('slideLeft');
                sliding = false;
            }, 1000);
        };

        $scope.prevVideo = function() {
            if (sliding === true) {
                return false;
            }
            $('.vidNav').addClass('slideRight');
            sliding = true;
            $timeout(function() {
                var prevIndex = $scope.currentVideoIndex - 1;
                if (prevIndex >= 0) {
                    $scope.loadVideo(prevIndex);
                } else {
                    $scope.loadVideo($scope.videos.length - 1);
                }
                $('.vidNav').removeClass('slideRight');
                sliding = false;
            }, 1000);
        };

    }
]);