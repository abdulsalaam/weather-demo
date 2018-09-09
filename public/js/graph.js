$(document).ready(function() {


  var cityLoc = {
    Copenhagen: {
      lat: 55.6760968,
      lng: 12.5683371
    },
    Tokyo: {
      lat: 35.6894875,
      lng: 139.6917064
    },
    'New York': {
      lat: 40.7127837,
      lng: -74.0059413
    },
    London: {
      lat: 51.5073509,
      lng: -0.1277583
    }
  }


  // setting the current date as required in plotOptions.series.pointStart
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();

  // Chart options
  var options = {
      chart: {
        height: 300
      },
      title: {
          text: null
          //x: -20 //center
      },
      subtitle: {
          text: null

      },
      xAxis: {
          type: 'datetime'
      },
      yAxis: {
          title: {
              text: null
          },
          plotLines: [{
              value: 0,
              width: 1,
              color: '#808080'
          }],
          labels: {
            format: '{value} °C'
          }
      },
      plotOptions: {
            series: {
                pointStart: Date.UTC(year, month, day),
                pointInterval: 24 * 3600 * 1000 // one day
              }
        },
      tooltip: {
          valueSuffix: '°C'
      },
      legend: {
          align: 'center',
          borderWidth: 0
      },
      series: [{
          name: 'Min temperature',
          data: []
      },
      {
        name: 'Max temperature',
        data: [],
        color: '#FF0000'
        }]
  }

  function cityUrl(city) {
    return 'https://api.darksky.net/forecast/51c52962b36fc78232c5d78a3ba8e5e8/' + city.lat + ',' + city.lng + '?callback=?';
  }

  
  $.when($.getJSON(cityUrl(cityLoc['New York'])) )
      .then(function(json1) {
        //console.log('data new yark:',json1);
       /*
        var maxTemperatures = [];
        var minTemperatures = [];
       

        var length = json1.daily.data.length;
        for (var i = 0; i< length; i++) {
          var maxTemp = json1.daily.data[i].temperatureMax;
          var minTemp = json1.daily.data[i].temperatureMin;
         
          maxTemp = Math.round(( maxTemp - 32) / 1.8 * 100) / 100;
          minTemp = Math.round(( minTemp - 32) / 1.8 * 100) / 100;
         
          maxTemperatures.push(maxTemp);
          minTemperatures.push(minTemp);
         
        }
        // Adding data from weather API to options object for first chart.
        options.series[0].data = minTemperatures;
        options.series[1].data = maxTemperatures;
        // rendering chart1
        Highcharts.chart('chart1', options);
       */


      });
  
});     //document.ready
