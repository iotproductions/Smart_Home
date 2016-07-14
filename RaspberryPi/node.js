var wpi 		= require('wiring-pi');
var mqtt_packet = require('mqtt-packet')
var mqtt    	= require('mqtt');
var mqtt_client = mqtt.connect('tcp://*******.com',{
  port: ****,
  username: '*******',
  password: '*******'
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
			}
			else
			{
				console.log("Recevied Wrong Command");
				mqtt_client.publish("W/00/SENSORNODE001","Recevied Wrong Command");
			}
		}
		else
		{
			console.log("OK\r\n");
		}
			

		// message is Buffer
		//mqtt_client.end();
	}
);
