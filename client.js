var net = require('net');               //include module 'net'
const rl = require('readline');         //include module 'readline'
var HOST = '127.0.0.1';                 //set HOST to 129.0.0.1 
var PORT = 6969;                        //set PORT to 6969

const readline = rl.createInterface({   //create interface to receive value from client
    input: process.stdin,               
    output: process.stdout
});

var client = new net.Socket();              //create new socket object to use as client
client.connect(PORT, HOST, function () {    //connect to port and host
    console.log('CONNECTED TO: ' + HOST + ':' + PORT);

});                                         
client.on('data', function (data) {         //listening for event 'data'
    if (data.toString() != 'Are you crazy?') {      //check if client dosen't receive 'Are you crazy?'
        readline.resume();                          //clear buffer to receive input from client
        readline.question(data, data_out => {       //calback and write to server
            client.write(data_out);     
            readline.pause();                       
        })
    }
});

client.on('close', function () {            //listening on event 'close'
    console.log('Connection closed');       
    rl.clearScreenDown(process.stdout);     //stop operation of readline
    readline.close();
    process.exit();
});

client.on('error', function () {            //listening on event 'error'
    //console.log('Client Error');
    readline.close();
    process.exit();
});
