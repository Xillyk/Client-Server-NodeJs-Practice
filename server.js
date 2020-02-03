var net = require('net');               //include module 'net'
var HOST = '127.0.0.1';                 //set HOST to 129.0.0.1
var PORT = 6969;                        //set PORT to 6969
var clientName = [];                    //declare to store the name of each client
var clientScore = [];                   //declare to store the score of each client
var countClientOnServer = 0;            //declare 'countClientOnServer' to count online-client
var checkDataOnFirstTimeConnection;     //declare to recieve first input from client
var server = net.createServer();
server.listen(PORT, HOST);              //set server to listen on port and host

server.on('connection', function (sock) {
    var strIn;                                              //declare variable 'strIn' for keeping input value
    var name;                                               //declare variable 'name' for keeping name of each client
    var index;                                              //declare variable 'index'
    var checkFirstTimeConnection = true;                    //decare to check for the first time connection
    countClientOnServer++;                                  //count online clients
    console.log('SERVER LOG :: New Connection');            //show activity of server in terminal
    console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
    console.log(`Clients online : ${countClientOnServer} `);
    sock.write('Server listening >> ');                     //write to client
    sock.on('data', function (data) {                       //listen for event that send data to server
        if (checkFirstTimeConnection) {                     //check for first time connection
            strIn = data.toString();
            checkDataOnFirstTimeConnection = strIn.search('I am ');
            //check that first message from client contain "I am " at the beginning of message 
            if (checkDataOnFirstTimeConnection != -1 && checkDataOnFirstTimeConnection == 0) {
                strIn = strIn.substring(5);                 //extract first 5 characters from strIn (string)
                name = strIn;                               //set name (for each sock)
                if (strIn != "") {                          //check for ensuring that msg is contain name
                    clientName.push(strIn);                 //push name of client in array (storage of server)
                    clientScore.push(0);                    //set score of client to 0 and push into array
                    sock.write(`You score is ${clientScore[clientName.indexOf(name)]} : `);
                    checkFirstTimeConnection = false;       //set 'checkFirstTimeConnection' to false 
                }
                else {
                    console.log(`SERVER LOG :: not follow protocol (no "name")`);
                    sock.write('Are you crazy?\n');
                    sock.destroy();                         //disconnection
                }
            }
            else {
                console.log(`SERVER LOG :: not follow protocol (no "I am")`);
                sock.write('Are you crazy?\n');
                sock.destroy();                             //disconnection
            }
        }
        else {                                     //operation for client (not for first time connection)
            strIn = data.toString();
            if (strIn == 'Bye') {                           //check if client send msg "Bye" to server
                //clear name and score of client that want to disconnect from server
                clientScore.splice(parseInt(clientName.indexOf(name)), 1);
                clientName.splice(parseInt(clientName.indexOf(name)), 1);
                console.log(`SERVER LOG [ ${name} ] :: Client Disconnect`);
                sock.write('Disconnect!!\n');
                sock.destroy();
            }
            else if (!isNaN(parseInt(strIn))) {             //check to ensuring that message is type integer
                console.log(`SERVER LOG [ ${name} ] :: get data from client`);

                clientScore[clientName.indexOf(name)] += parseInt(strIn);
                sock.write(`You score is ${clientScore[clientName.indexOf(name)]} : `);
            }
            else {                                          //send message to client to retry 
                console.log(`SERVER LOG [ ${name} ] :: invalid input from client`)
                sock.write('Not Invalid Input, Try again : ');
            }
        }
    });
    sock.on('close', function () {                          //listen for event 'close'
        console.log(`SERVER LOG [ ${name} ] :: CLOSED: ` + sock.remoteAddress + ' ' + sock.remotePort);
        countClientOnServer--;                              //decrease online-client 
        sock.write('Disconnect\n')
        console.log(`Clients online : ${countClientOnServer} `);
        for (index = 0; index < clientName.length; index++) {       //print online-client's name and score 
            console.log(`[${clientName[index]} : ${clientScore[index]}] `);
        }
    });
    sock.on('error', function () {                          //listen for event 'error' 
        console.log("Error");
    });
});
console.log('Server listening on ' + HOST + ':' + PORT);



