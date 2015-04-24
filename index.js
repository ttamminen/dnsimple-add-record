var Promise = require('bluebird');
var request = Promise.promisifyAll(require('request'));

var settings = {
	domain: {
		token: '',
		name: ''
	},
	api: {
		getToken: 'https://api.dnsimple.com/v1/domains/'
	}
};

function ClientError(e) {
  return e.code >= 400 && e.code < 500;
}

request.getAsync({
	url: settings.api.getToken + settings.domain.name,
	headers: {
		'X-DNSimple-Domain-Token': settings.domain.token
	}
})
.spread(function(response, body) {
  if (response.code >= 400 && e.code < 500) {
    throw new ClientError();
  }

  console.log(body);
})
.catch(ClientError, function (e) {
  console.error(e.trace);
});

function ClientError(message) {
  this.name = 'ClientError';
  this.message = message || 'HTTP error';
}
ClientError.prototype = Object.create(Error.prototype);
ClientError.prototype.constructor = ClientError;