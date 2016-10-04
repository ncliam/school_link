/**
 * @author v.lugovsky
 * created on 03.05.2016
 */
  angular.module('SchoolLink.service').
  factory('mySocket', function (socketFactory, $request, localStorageService) {
    /*var path = $request.host + ":" + $request.port;
    
    var myIoSocket = io.connect("http://192.168.0.105:3003");

    mySocket = socketFactory({
      ioSocket: myIoSocket
    });

    mySocket.forward('message');
    mySocket.on('connect', function(){
      var user = localStorageService.get("user");
      mySocket.emit('confirm connect', {user: user});
      mySocket.on("notification", function(data){
        console.log(data);
      })
    });*/
    return null;
  });
