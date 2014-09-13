var ckanEndpoint = 'http://localhost:5000';
var valuesResourceId = '8b9a25aa-0b79-4aef-9c39-00418935bc37';

jQuery(document).ready(function($) {
  setupCountries();
  setupIndicators();

  bindEvents();

  getData({Indicator: 'BCA', Country: 'GBR'}, function(err, data) {
    console.log(data);
  });
});

var setupCountries = function() {};
var setupIndicators = function() {};

// series look like: [ [indicator, country], [indicator, country] ]
// maybe just get indicators and filter the country (??)
// worry about efficiency later
var getData = function(series, cb) {
  var ckan = new CKAN.Client(ckanEndpoint);
  var queryObj = {
    resource_id: valuesResourceId,
    filters: series
  };
  ckan.action('datastore_search', queryObj, function(err, data) {
    cb(err, data.result.records);
  });
};

var bindEvents = function() {
};

