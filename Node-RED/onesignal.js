var https = require('https');

module.exports = function (RED) {
  function OneSignalNode(config) {
    RED.nodes.createNode(this, config);
    var oneSignalConfig = RED.nodes.getNode(config.config);
    var [web, android, ios, segment, targetType] = [config.web, config.android, config.ios, config.segments, config.targetType];

    var node = this;
    var headers = {
      "Content-Type": "application/json; charset=utf-8",
      "Authorization": "Basic " + oneSignalConfig.restApiKey
    };

    var options = {
      host: "onesignal.com",
      port: 443,
      path: "/api/v1/notifications",
      method: "POST",
      headers: headers
    };

    this.on('input', function (msg) {
      var req = https.request(options, function (res) {
        res.on('data', function (data) {
          var response = JSON.parse(data);
          if (response.errors) {
            response.errors.forEach(function (err) {
              console.log("ONESIGNAL Responce Error:", err);
              node.error("ONESIGNAL Responce Error->"+ err);
            })
            node.status({ fill: "red", shape: "ring", text: "OneSignal ERROR" });
          } else {
            node.log("Notification SENT SUCCESSFULLY");
            node.status({ fill: "green", shape: "ring", text: "SENT!" });
          }
        });

        req.on('error', function (e) {
          console.log("ONE SIGNAL ERROR:", e);
          node.error("ONE SIGNAL ERROR", e);
          node.status({ fill: "red", shape: "ring", text: "OneSignal ERROR" });
        });
      });

      var title = msg.payload.title || config.title;
      var text = msg.payload.content || config.message;
      var playerId = [];
      playerId = msg.payload.playerId || config.player;
      var messageJson = {
        app_id: oneSignalConfig.appId,
        headings: { "en": title },
        contents: { "en": text },
		included_segments: ["All"]
      };
	  console.log('OneSignal Message:- ', messageJson);
      req.write(JSON.stringify(messageJson));
      req.end();
    });
  }
  RED.nodes.registerType("onesignal", OneSignalNode);
}
