/*
Name: Proxy Service
Project: Mäelstrom - Proxy
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Socket.io events
*/

module.exports=function(socket){
    socket.on('echo',function(msg){
        socket.emit('echo',msg);
    });
    
    
    
    
}
