var Promise = require('bluebird');
var request = Promise.promisifyAll(require('request'));
var _ = require('lodash');

var settings = {
  user: {
    email: ''
  },
  domain: {
    token: '',
    name: ''
  },
};

var recordToCreate = {
  name: '',
  record_type: 'CNAME',
  content: ''
};

var api = {
  getToken: _.template('https://api.dnsimple.com/v1/domains/<%= domain %>'),
  createRecord: _.template('https://api.dnsimple.com/v1/domains/<%= domain %>/records')
};

request.getAsync({
  url: api.getToken({ domain: settings.domain.name }),
  headers: {
    'X-DNSimple-Domain-Token': settings.domain.token
  }
})
.spread(function(response, body) {
  if (response.statusCode >= 400 && response.statusCode < 500) {
    throw new ClientError(response.statusCode);
  }

  var content = JSON.parse(body);
  return content.domain.token;
})
.then(function (token) {
  return request.postAsync({
    url: api.createRecord({ domain: settings.domain.name }),
    body: {
      record: recordToCreate
    },
    json: true,
    headers: {
      'Accept': 'application/json',
      'X-DNSimple-Token': settings.user.email + ':' + token
    }
  });
})
.spread(function (response, body) {
  if (response.statusCode >= 400 && response.statusCode < 500) {
    throw new ClientError(response.statusCode);
  }

  console.log(JSON.parse(body));
})
.catch(ClientError, function (e) {
  console.error(e);
});

function ClientError(message) {
  this.name = 'ClientError';
  this.message = message || 'HTTP error';
}
ClientError.prototype = Object.create(Error.prototype);
ClientError.prototype.constructor = ClientError;