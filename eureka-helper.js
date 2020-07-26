const Eureka = require('eureka-js-client').Eureka;
const eurekaHost = (process.env.EUREKA_CLIENT_SERVICEURL_DEFAULTZONE || 'localhost');
const eurekaPort = 8761;
const hostName = (process.env.HOSTNAME || 'localhost')
const ipAddr = '172.0.0.1';

exports.registerWithEureka = function(appName, PORT) {
 
  const client = new Eureka({
    // application instance information
    instance: {
      app: 'service',
      hostName: 'localhost',
      ipAddr: '127.0.0.1',
      statusPageUrl: 'http://localhost:3001',
      vipAddress: 'service',
      port: {
        $: PORT,
        '@enabled': 'true',
      },
      dataCenterInfo: {
        '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
        name: 'MyOwn',
      },
      registerWithEureka: true,
      fetchRegistry: true,
    },
    eureka: {
      // eureka server host / port
      host: 'localhost',
      port: 8761,
      servicePath: '/eureka/apps/',
    },
  });
client.logger.level('debug')

client.start( error => {
    console.log(error || "user service registered")
});



function exitHandler(options, exitCode) {
    if (options.cleanup) {
    }
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) {
        client.stop();
    }
}




process.on('SIGINT', exitHandler.bind(null, {exit:true}));
};
