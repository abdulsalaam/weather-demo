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

  /*
  $.when($.getJSON(cityUrl(cityLoc.Tokyo)),$.getJSON(cityUrl(cityLoc['New York'])),$.getJSON(cityUrl(cityLoc.London)) )
          .then(function(data1, data2, data3) {
            console.log(data1);
            console.log(data2);
            console.log(data3);
          });
*/
  $.when($.getJSON(cityUrl(cityLoc.Copenhagen)),$.getJSON(cityUrl(cityLoc['New York'])) )
      .then(function(json1,json2) {
        console.log(json1);
        console.log(json2);
        var maxTemperatures = [];
        var minTemperatures = [];
        var maxTemperatures2 = [];
        var minTemperatures2 = [];

        var length = json1[0].daily.data.length;
        for (var i = 0; i< length; i++) {
          var maxTemp = json1[0].daily.data[i].temperatureMax;
          var minTemp = json1[0].daily.data[i].temperatureMin;
          var maxTemp2 = json2[0].daily.data[i].temperatureMax;
          var minTemp2 = json2[0].daily.data[i].temperatureMin;
          maxTemp = Math.round(( maxTemp - 32) / 1.8 * 100) / 100;
          minTemp = Math.round(( minTemp - 32) / 1.8 * 100) / 100;
          maxTemp2 = Math.round(( maxTemp2 - 32) / 1.8 * 100) / 100;
          minTemp2 = Math.round(( minTemp2 - 32) / 1.8 * 100) / 100;
          maxTemperatures.push(maxTemp);
          minTemperatures.push(minTemp);
          maxTemperatures2.push(maxTemp2);
          minTemperatures2.push(minTemp2);
        }
        // Adding data from weather API to options object for first chart.
        options.series[0].data = minTemperatures;
        options.series[1].data = maxTemperatures;
        // rendering chart1
        Highcharts.chart('chart1', options);
        // Adding data from weather API to options object for second chart.
        options.series[0].data = minTemperatures2;
        options.series[1].data = maxTemperatures2;
        // rendering chart2
        Highcharts.chart('chart2', options);

      });




  //Chart 2

    //Chart3
    Highcharts.chart('chart3', {
        chart: {
            height: 300,
            type: 'area'
        },
        title: {
            text: 'Historic and Estimated Worldwide Population Growth by Region'
        },
        subtitle: {
            text: 'Source: Wikipedia.org'
        },
        xAxis: {
            categories: ['1750', '1800', '1850', '1900', '1950', '1999', '2050'],
            tickmarkPlacement: 'on',
            title: {
                enabled: false
            }
        },
        yAxis: {
            title: {
                text: 'Billions'
            },
            labels: {
                formatter: function () {
                    return this.value / 1000;
                }
            }
        },
        tooltip: {
            split: true,
            valueSuffix: ' millions'
        },
        plotOptions: {
            area: {
                stacking: 'normal',
                lineColor: '#666666',
                lineWidth: 1,
                marker: {
                    lineWidth: 1,
                    lineColor: '#666666'
                }
            }
        },
        series: [{
            name: 'Asia',
            data: [502, 635, 809, 947, 1402, 3634, 5268]
        }, {
            name: 'Africa',
            data: [106, 107, 111, 133, 221, 767, 1766]
        }, {
            name: 'Europe',
            data: [163, 203, 276, 408, 547, 729, 628]
        }, {
            name: 'America',
            data: [18, 31, 54, 156, 339, 818, 1201]
        }, {
            name: 'Oceania',
            data: [2, 2, 2, 6, 13, 30, 46]
        }]
    });

    //Chart 4
    Highcharts.chart('chart4', {
          chart: {
              height: 300,
              type: 'spline'
          },
          title: {
              text: 'Monthly Average Temperature'
          },
          subtitle: {
              text: 'Source: WorldClimate.com'
          },
          xAxis: {
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
          },
          yAxis: {
              title: {
                  text: 'Temperature'
              },
              labels: {
                  formatter: function () {
                      return this.value + '°';
                  }
              }
          },
          tooltip: {
              crosshairs: true,
              shared: true
          },
          plotOptions: {
              spline: {
                  marker: {
                      radius: 4,
                      lineColor: '#666666',
                      lineWidth: 1
                  }
              }
          },
          series: [{
              name: 'Tokyo',
              marker: {
                  symbol: 'square'
              },
              data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, {
                  y: 26.5,
                  marker: {
                      symbol: 'url(https://www.highcharts.com/samples/graphics/sun.png)'
                  }
              }, 23.3, 18.3, 13.9, 9.6]

          }, {
              name: 'London',
              marker: {
                  symbol: 'diamond'
              },
              data: [{
                  y: 3.9,
                  marker: {
                      symbol: 'url(https://www.highcharts.com/samples/graphics/snow.png)'
                  }
              }, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
          }]
      });


});     //document.ready
