A simple app to explore IMF World Economic Outlook Indicators.

Powered by the [CKAN DataStore][ds] using the [IMF World Economic Outlook Data
Package][imf-wp].

[ds]: http://ckan.org/
[imf-wp]: http://data.okfn.org/data/core/imf-weo

Specific data used:

* IMF WEO Values get loaded via the [DataStore API for the values table on the DataHub.io][values]
* Indicators list loaded from IMF WEO on data.okfn.org API - <http://data.okfn.org/data/core/imf-weo>
* Country list with 3-digit ISO codes via the data.okfn.org - <http://data.okfn.org/data/core/country-codes>

[values]: http://datahub.io/dataset/imf-weo/resource/24cd8ebe-fa3f-4353-9ad9-d53bd88751a6

----

## User Stories

### Graph an indicator

As a User I want to select any indicator (+country) and add it to line graph

  * Select Indicator then country
    * Should autocomplete

As a User I want to remove an indicator/country combination from a graph

As a User I want to select any indicator/country combination and add it to an existing graph

As a User I want to create multiple plots

### Save config

### Preconfigure

