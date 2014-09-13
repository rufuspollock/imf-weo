var ckanEndpoint = 'http://localhost:5000';
var valuesResourceId = '8b9a25aa-0b79-4aef-9c39-00418935bc37';
var Data = {
  cache: {}
};

jQuery(document).ready(function($) {
  setup(function() {
    $('.chosen-select').chosen();
    $('form').submit(onAdd);
  });
});

function onAdd(e) {
  e.preventDefault();

  var country = $('select[name="country"]').val()
    , indicator = $('select[name="indicator"]').val()
    ;

  // check we don't have a blank
  if (!(country && indicator)) {
    return;
  }

  getData({Indicator: indicator, Country: country}, function(err, data) {
    console.log(data);
    Data.cache[indicator] 
  });
}

var setup = function(cb) {
  var countryCodes = 'http://data.okfn.org/data/core/country-codes/r/country-codes.json'
    , indicators = 'http://data.okfn.org/data/core/imf-weo/r/indicators.json'
    ;

  var count = 0;
  function done() {
    count ++;
    if (count == 2) cb();
  }

  $.getJSON(countryCodes, function(data) {
    var $select = $('select[name="country"]');
    _.each(data, function(country) {
      var $option = $('<option />')
        .attr('value', country['ISO3166-1-Alpha-3'])
        .text(country.name)
        ;
      $select.append($option);
    });
    done();
  });

  $.getJSON(indicators, function(data) {
    var $select = $('select[name="indicator"]');
    Data.indicators = data;
    _.each(data, function(ind) {
      var $option = $('<option />')
        .attr('value', ind.id)
        .text(ind.title)
        ;
      $select.append($option);
    });
    done();
  });
}

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

