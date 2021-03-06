const express = require('express');
const address = require('address');
const os = require('os');

os.networkInterfaces()
const app = express();
const port = 3005;

function returnDefaultText(res) {
  const infoText = 'use /address?type=all or /address?type=ip or /address?type=ipv6 or /address?type=mac or /address?type=dns for now!';
  res.send(infoText);
}

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

function callBackWithError(res) {
  return (err, addr) => {
    if (err) {
      res.send(err);
    } else {
      res.json(addr);
    }
  };
}

function prepareResponse({ package, type, parameters }) {
    console.log('package, type, parameters', package, type, parameters);
    const packageTypes = {
        node:{

        },
        address:{
            all:(parameters)=> console.log('parameters', parameters),
            ip:(parameters)=> console.log('parameters', parameters),
            ipv6:(parameters)=> console.log('parameters', parameters),
            mac:(parameters)=> console.log('parameters', parameters),
            interface:(parameters)=> console.log('parameters', parameters),
            dns:(parameters)=> console.log('parameters', parameters),
        }
    }
    return packageTypes[package][type]
}



app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/address', (req, res) => {
  const { package, type, parameters } = req.query;
  prepareResponse(req.query); 

  switch (type) {
    case 'all':
      address(parameters, callBackWithError(res));
      break;
    case 'ip':
      res.json(address.ip(parameters));
      break;
    case 'ipv6':
      res.json(address.ipv6());
      break;
    case 'mac':
      address.mac(parameters, callBackWithError(res));
      break;
    case 'interface':
      returnDefaultText(res);
      break;
    case 'dns':
      address.dns(callBackWithError(res));
      break;
    default:
      returnDefaultText(res);
      break;
  }
});

app.get('/*', (req, res) => {
  returnDefaultText(res);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
  console.log(`Example app listening at http://localhost:${port}/api-docs`);
});
