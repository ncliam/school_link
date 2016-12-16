// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ionic-material', 'ionMdInput', 'SchoolLink.service','LocalStorageModule', 
    'toaster', 'pascalprecht.translate', 'angular.filter'])

.run(function($ionicPlatform, $rootScope, localStorageService, $state, $Longpolling, $pouchDb, MultipleViewsManager, $translate) {
    $ionicPlatform.ready(function() {
        $pouchDb.initDB("res.user");
        //$pouchDb.destroyDatabase("res.user");
        localStorageService.remove("doPoll");
        $pouchDb.getAllDocs("res.user").then(function(allUser){
          var existUser = _.find(allUser, function(user){
            return user.data.login;
          });
          if(existUser){
            localStorageService.set("user", existUser.data);
            localStorageService.set("children", existUser.data.children);
            localStorageService.set("listChildren", existUser.data.listChildren);
            localStorageService.set("setting", existUser.data.setting);
            localStorageService.set("class", existUser.data.class);
            $Longpolling.user = existUser.data;
            $Longpolling.last = 0;
            $Longpolling.poll();
            MultipleViewsManager.updateView("chooseChildren");
            $state.go("app.message");
            window.plugins.OneSignal.sendTag("user_id", existUser.data.uid);
          } else{
            $state.go("app.login");
          }
        });
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.notification.badge.clear();
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          cordova.plugins.Keyboard.disableScroll(true);
          navigator.globalization.getPreferredLanguage(
              function (language) {
                $translate.refresh();
                $translate.use(language.value);
              },
              function () {alert('Error getting language\n');}
          );
        } else{
            $translate.use('vi')
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
        /*alert("get tags");*/
        window.plugins.OneSignal
          .startInit("3fcdf8f2-9523-4ca7-8489-fefb29cbecc4", "204984235412")
          .handleNotificationReceived(function(jsonData) {
            cordova.plugins.notification.badge.increase();
            //alert("Notification received:\n" + JSON.stringify(jsonData));
            MultipleViewsManager.updateView("notification");
            //console.log('Did I receive a notification: ' + JSON.stringify(jsonData));
          })
          .inFocusDisplaying(window.plugins.OneSignal.OSInFocusDisplayOption.Notification)
          .endInit();
        $ionicPlatform.registerBackButtonAction(function (e) {
          //ionic.Platform.exitApp();
          e.preventDefault();
          e.stopImmediatePropagation();
          e.stopPropagation();
        }, 100);
    });
    

})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $translateProvider) {

    // Turn off caching for demo simplicity's sake
    $ionicConfigProvider.views.maxCache(0);

    /*
    // Turn off back button text
    $ionicConfigProvider.backButton.previousTitleText(false);
    */

    $stateProvider.state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })

    .state('app.activity', {
        url: '/activity',
        views: {
            'menuContent': {
                templateUrl: 'templates/activity.html',
                controller: 'ActivityCtrl'
            },
            'fabContent': {
                template: '<button id="fab-activity" class="button button-fab button-fab-top-right expanded button-energized-900 flap"><i class="icon ion-paper-airplane"></i></button>',
                controller: function ($timeout) {
                    $timeout(function () {
                        document.getElementById('fab-activity').classList.toggle('on');
                    }, 200);
                }
            }
        }
    })

    .state('app.friends', {
        url: '/friends',
        views: {
            'menuContent': {
                templateUrl: 'templates/friends.html',
                controller: 'FriendsCtrl'
            },
            'fabContent': {
                template: '<button id="fab-friends" class="button button-fab button-fab-top-left expanded button-energized-900 spin"><i class="icon ion-chatbubbles"></i></button>',
                controller: function ($timeout) {
                    $timeout(function () {
                        document.getElementById('fab-friends').classList.toggle('on');
                    }, 900);
                }
            }
        }
    })

    .state('app.gallery', {
        url: '/gallery',
        views: {
            'menuContent': {
                templateUrl: 'templates/gallery.html',
                controller: 'GalleryCtrl'
            },
            'fabContent': {
                template: '<button id="fab-gallery" class="button button-fab button-fab-top-right expanded button-energized-900 drop"><i class="icon ion-heart"></i></button>',
                controller: function ($timeout) {
                    $timeout(function () {
                        document.getElementById('fab-gallery').classList.toggle('on');
                    }, 600);
                }
            }
        }
    })

    .state('app.login', {
        url: '/login',
        views: {
            'menuContent': {
                templateUrl: 'js/pages/login/login.html',
                controller: 'LoginCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })

    .state('app.school', {
        url: '/school',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'js/pages/school/school.html',
                controller: 'SchoolCtrl'
            }
        }
    })
    .state('app.notification', {
        url: '/notification',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'js/pages/notification/notification.html',
                controller: 'NotificationCtrl'
            }
        }
    })

    .state('app.detail_notification', {
        url: '/detail_notification',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'js/pages/detail_notification/detail_notification.html',
                controller: 'DetailNotificationCtrl'
            }
        }
    })
    .state('app.message', {
        url: '/message',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'js/pages/message/message.html',
                controller: 'MessageCtrl'
            }
        }
    })
    .state('app.schedule', {
        url: '/schedule',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'js/pages/schedule/schedule.html',
                controller: 'ScheduleCtrl'
            }
        }
    })

    .state('app.goal', {
        url: '/goal',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'js/pages/goal/goal.html',
                controller: 'GoalCtrl as vm'
            }
        }
    })

    .state('app.contact', {
        url: '/contact',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'js/pages/contact/cantact.html',
                controller: 'ContactCtrl'
            }
        }
    })

    .state('app.channel', {
        url: '/channel',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'js/pages/channel/channel.html',
                controller: 'ChannelCtrl'
            }
        }
    })

    .state('app.setting', {
        url: '/setting',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'js/pages/setting/setting.html',
                controller: 'SettingCtrl'
            }
        }
    })

    .state('app.profile', {
        url: '/profile',
        views: {
            'menuContent': {
                templateUrl: 'templates/profile.html',
                controller: 'ProfileCtrl'
            },
            'fabContent': {
                template: '<button id="fab-profile" class="button button-fab button-fab-bottom-right button-energized-900"><i class="icon ion-plus"></i></button>',
                controller: function ($timeout) {
                    /*$timeout(function () {
                        document.getElementById('fab-profile').classList.toggle('on');
                    }, 800);*/
                }
            }
        }
    })
    ;

    // if none of the above states are matched, use this as the fallback
    $translateProvider.useStaticFilesLoader({
      prefix: (function() {
        try {
          var rootPath  = require('app-root-path');
          var path = rootPath + '/locale/locale-';
          console.log(path);
          return path;
        } catch (ex) {
          return './locale/locale-'
        }
      })(),
      suffix: '.json'
    });
    
});
