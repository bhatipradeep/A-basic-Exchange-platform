global.fetch = require('node-fetch');
const cc = require('cryptocompare');

//connecting to cryptocompare api;
cc.setApiKey('d95a965ef463bdcfad9f50207b43e585537b4688d5db89433d773469db80dc3d');
var api1 = cc;
module.exports.cryptoCompareApi = api1;
