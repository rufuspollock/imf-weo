// var ckanEndpoint = 'http://localhost:5000';
// var valuesResourceId = '8b9a25aa-0b79-4aef-9c39-00418935bc37';
var ckanEndpoint = 'https://datahub.io'
  , valuesResourceId = '24cd8ebe-fa3f-4353-9ad9-d53bd88751a6'
  ;

var Data = {
  cache: {},
  // country codes keyed by 3-digit iso
  countryCodes: {},
  // keyed by id
  indicators: {},
  // data for internal recline dataset we use to show results
  rawDataset: {
    fields: [
      { id: 'year', type: 'date' }
    ],
    records: []
  }
};

jQuery(document).ready(function($) {
  // WEO starts in 1980 and current runs until 2019
  for(var xx=0; xx<40; xx++) {
    Data.rawDataset.records.push({year: 1980+xx});
  }

  loadSetupData(function() {
    $('.chosen-select').chosen();
    $('form').submit(onAdd);

    addSeries({Indicator: 'LUR', Country: 'GBR'});
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
  var series = {Indicator: indicator, Country: country};
  addSeries(series);
}

function addSeries(series) {
  // todo: check cache first
  getData(series, function(err, data) {
    // cache the data
    if (!(series.Indicator in Data.cache)) {
      Data.cache[series.Indicator] = {};
    }
    Data.cache[series.Indicator][series.Country] = data;

    var fieldId = series.Indicator + '/' + series.Country
      fieldLabel = Data.indicators[series.Indicator].title + ' / ' + Data.countryCodes[series.Country]
      ;
    Data.rawDataset.fields.push({id: fieldId, label: fieldLabel, type: 'number'});
    _.each(data, function(row) {
      var idx = row.Year - 1980;
      Data.rawDataset.records[idx][fieldId] = row.Value;
    });
    // this is getting sort of ugly in terms of nesting
    render();
  });
}

var render = function() {
  var dataset = new recline.Model.Dataset({
    fields: Data.rawDataset.fields,
    records: Data.rawDataset.records
  });

  var $el = $('.grid-holder');
  $el.empty();
  var grid = new recline.View.SlickGrid({
    model: dataset,
    el: $el
  });
  grid.visible = true;
  grid.render();

  var $el = $('.flot-holder');
  $el.empty();
  var graphSeries = _.pluck(Data.rawDataset.fields.slice(1), 'id');
  var graph = new recline.View.Graph({
    model: dataset,
    state: {
      group: "year",
      series: graphSeries
    }
  });
  $el.append(graph.el);
  graph.render();
  graph.redraw();
}

var loadSetupData = function(cb) {
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
      Data.countryCodes[country['ISO3166-1-Alpha-3']] = country.name;
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
    Data.indicators = _.object(_.pluck(data, 'id'), data);
    _.each(data, function(ind) {
      var $option = $('<option />')
        .attr('value', ind.id)
        .text(ind.title + ' [' + ind.id + ']')
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

