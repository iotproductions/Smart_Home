var wpi 		= require('wiring-pi');
var mqtt_packet = require('mqtt-packet')
var mqtt    	= require('mqtt');
var http    	= require('http-request');
var https 		= require('https');

var mqtt_client = mqtt.connect('tcp://localhost',{
  port: ****,
  username: '********',
  password: '********'
});

mqtt_client.on('connect', function(){
    console.log('Connected to MQTT Broker\r\n');
});

mqtt_client.subscribe('#');
 
mqtt_client.on('message', function (topic, message) 
	{
		console.log('Recevied message from topic: ' + topic.toString());
		console.log('Message contents: ' + message.toString());
		if(topic.toString() == 'R/00/SENSORNODE001')
		{
			if(message.length > 0)
			{
				var payload 	= message.toString().split("|");;
				var command 	= payload[0];
				var cmd_value	= payload[1];
				console.log("Command: " + command.toString());
				console.log("Command value: " + cmd_value.toString());
				if((command.toString() == '\r\nSOLAR CHARGE') && (cmd_value == 1))
				{
					console.log("Recevied Command !");
					mqtt_client.publish("W/00/SENSORNODE001","Recevied Command !");
					http.get({
						url: 'http://rynanservices.16mb.com/api/control.php?id=status',
						proxy: {
							host: 'rynanservices.16mb.com',
							port: 80
						},
						maxRedirects: 2
						}, function (err, res) {
						if (err) {
							console.error(err);
							return;
						}
						
						console.log(res.code, res.headers, res.buffer.toString());
					});

					https.get('https://script.google.com/macros/s/AKfycbxakziwna_74UINqKUDdsKdzmc8lKTcAdWzGISIIqxbYdIFVBE/exec?mess=Nhi%E1%BB%87t%20%C4%91%E1%BB%99%20ph%C3%B2ng%20tr%E1%BB%8D%20hi%E1%BB%87n%20t%E1%BA%A1i%20qu%C3%A1%20cao%20!', (res) => {
					  console.log('statusCode: ', res.statusCode);
					  console.log('headers: ', res.headers);

					  res.on('data', (d) => {
						process.stdout.write(d);
					  });

					}).on('error', (e) => {
					  console.error(e);
					});
				}
				else
				{
					console.log("Recevied Wrong Command");
					mqtt_client.publish("W/00/SENSORNODE001","Recevied Wrong Command");
				}
			}
		}
		else
		{
			console.log("Other topic\r\n");
		}
			

		// message is Buffer
		//mqtt_client.end();
	}
);
