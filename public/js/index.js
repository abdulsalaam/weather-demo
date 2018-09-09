$(document).ready(function() {

  // Initial settings
  //var units = "imperial";
  var units = "celsius";
  var forecastFlag = 5;
    getLocation(units, forecastFlag);

  });

function getLocation(units, forecastFlag) {

  var locationAPIURL = 'http://ip-api.com/json/';
  var country;
  var countryCode;
  var city;
  var regionCode;
  var zip;
  var lat;
  var long;

  $.get(locationAPIURL,
    function(ipInfo) {
      console.log('response:',ipInfo)
      if (ipInfo.status === "success") {
        // Retrieve info
        lat = ipInfo.lat;
        long = ipInfo.lon;
        country = ipInfo.country;
        countryCode = ipInfo.countryCode;
        city = ipInfo.city;

        if (countryCode === "US") {
          regionCode = ipInfo.region;
          zip = ipInfo.zip;
        }
      } else {
        // Report error and assume a location of NYC
        console.log("Could not retrieve location. Using default");
        countryCode = "IN";
        city = "New Delhi";
        regionCode = "DL";
        zip = 110062;
        lat = 28.6;
        long = 77.2;
      }

      // Push location information to page
      $('#location').html(locationAssign(country, countryCode, city, regionCode, zip));
      get5DayForecast(units, lat, long, city);
     
     // set city for graph1
     // set city name
    $('#citynameGraph1').html(city);
    $('#citynameGraph2').html(city);
     
    });
}

function get5DayForecast(units, lat, long) {
    // Forecast Data
    // 5 Day Forecast
    var forecastAPIURL = 'http://localhost:3030/weather-demo/api/1.0/getWeatherForecast?lat=' + lat + '&lon=' + long;

    // Declare Variables
    var forecastStartTime;
    var dayForecast = [];
    var forecastTime = [];
    var forecastIcon = [];
    var forecastTemp = [];
    var forecastWeatherDescrip = [];
    var forecastWindSpeed = [];
    var forecastWindDirection = [];
    var forecastHumidity = [];
    var forecastCloudCover = [];
    var key;

    var testString;

    // Get data from API
    $.get(forecastAPIURL,

        //This is the function you are passing in, to be called once the first one completes
        function(forecastData) {
          // generate graph
          tempGraph1(forecastData); // for temperature
          humidityGraph2(forecastData); // for humidity
          
          forecastStartTime = convertUnixTime(forecastData.list[0].dt);

          // Fill the forecast arrays with data from the [2 PM, 11 PM, 2 PM, 2 PM, 2 PM, 2 PM, 2 PM]
          // Fix this as it works perfectly fine after 2:30 PM, but breaks before then

          for (var i = 0; i < forecastData.list.length; i++) {
            // Check if forecastStartTime is after 2 PM and if this is the first time through. Otherwise skip
            if ((forecastStartTime.getHours() > 14) && (typeof forecastTime[0] == 'undefined')) {
              // If past 2 PM and the first element of forecastTime is empty, ignore today data and begin with data for tonight
              dayForecast[0] = "Today";
              forecastTime[0] = forecastStartTime;
              forecastIcon[0] = " ";
              forecastTemp[0] = 0;
              forecastWeatherDescrip[0] = "N/A";
              forecastWindSpeed[0] = 0;
              forecastWindDirection[0] = "N/A";
              forecastHumidity[0] = 0;
              forecastCloudCover[0] = 0;
            }

            // If the forecastStartTime is not after 2 PM and the current entry in list is the 2 PM or 11 PM report and the first element of forecastTime is empty, load the data
            else if (((convertUnixTime(forecastData.list[i].dt).getHours() === 14) || (convertUnixTime(forecastData.list[i].dt).getHours() === 23))) {
              // Check if the forecast provided at list[i] is the 11 PM data and only enter the first instance of 11 PM data
              if ((convertUnixTime(forecastData.list[i].dt).getHours() === 23) && (typeof forecastTime[0] != 'undefined') && (typeof forecastTime[1] == 'undefined')) {

                // Get the 11 PM data for tonight only
                dayForecast[1] = "Tonight";
                forecastTime[1] = convertUnixTime(forecastData.list[i].dt);
                forecastIcon[1] = forecastData.list[i].weather[0].icon;
                let temp = forecastData.list[i].main.temp !== undefined ? forecastData.list[i].main.temp : 0
                forecastTemp[1] = convertTemp(temp, units);

                forecastWeatherDescrip[1] = forecastData.list[i].weather[0].description;


                let windSpeed = forecastData.list[i].wind.speed !== undefined ? forecastData.list[i].wind.speed : 0
                forecastWindSpeed[1] = convertWindspeed(windSpeed, units);


                let windDirection = forecastData.list[i].wind.deg !== undefined ? forecastData.list[i].wind.deg : 0
                console.log('wind direg:1',windDirection)
                forecastWindDirection[1] = convertWindDirection(windDirection);

                forecastHumidity[1] = forecastData.list[i].main.humidity;

                forecastCloudCover[1] = forecastData.list[i].clouds.all;
                
              } else if (convertUnixTime(forecastData.list[i].dt).getHours() === 14) {
                // Get the 2 PM data for remaining days
                // Don't overwrite Today and Tonight, but otherwise insert correct day of the week.
                // Check to see if forecastTime[0] > 2 PM and adjust the days of the week accordingly --- Fix this!!
                // Need to assign a value to forecastTime[0]

                if (typeof forecastTime[0] == 'undefined') {
                  dayForecast.push("Today");
                } else {
                  dayForecast.push(convertDayAbr(convertUnixTime(forecastData.list[i].dt).getDay()));
                }
                forecastTime.push(convertUnixTime(forecastData.list[i].dt));
                forecastIcon.push(forecastData.list[i].weather[0].icon);
                let temp = forecastData.list[i].main.temp !== undefined ? forecastData.list[i].main.temp : 0
                forecastTemp.push(convertTemp(temp, units));

                forecastWeatherDescrip.push(forecastData.list[i].weather[0].description);

                let windSpeed = forecastData.list[i].wind.speed !== undefined ? forecastData.list[i].wind.speed : 0
                forecastWindSpeed.push(convertWindspeed(windSpeed, units));

                let windDirection = forecastData.list[i].wind.deg !== undefined ? forecastData.list[i].wind.deg : 0
                console.log('wind direg:2',forecastData.list[i].wind.deg)
                forecastWindDirection.push(convertWindDirection(windDirection));

                forecastHumidity.push(forecastData.list[i].main.humidity);

                forecastCloudCover.push(forecastData.list[i].clouds.all);

              }

            }

          } // ends i for loop


           // Variable declarations
          var forecastTimeNow;
          var iconNow;
          var tempNow;
          var descripNow;
          var windDirectionNow;
          var windSpeedNow;
          var humidityNow;
          var rainNow;
          var snowNow;
          var pressureNow;
          var sunriseTimeToday;
          var sunsetTimeToday;
          var cloudNow;
          var rain3hr;
          var snow3hr;  

        var currentData = forecastData.list[0];
        console.log('currentData:',currentData)
        forecastTimeNow = convertUnixTime(currentData.dt);
        tempNow = convertTemp(currentData.main.temp, units);
        iconNow = currentData.weather[0].icon;
        descripNow = currentData.weather[0].main;
        windDirectionNow = convertWindDirection(currentData.wind.deg);
        windSpeedNow = convertWindspeed(currentData.wind.speed, units);
        humidityNow = currentData.main.humidity;
        pressureNow = currentData.main.pressure;
        sunriseTimeToday = new Date(currentData.sys.sunrise * 1000);
        sunsetTimeToday = new Date(currentData.sys.sunset * 1000);
        cloudNow = currentData.clouds.all;

        // Verify rain object exists and has data in it
        // Figure out why this does not work
        if (currentData.hasOwnProperty('rain')) {
          key = Object.keys(currentData.rain);

          if (Object.keys(currentData.rain).length !== 0) {
            rain3hr = currentData.rain[key[0]];
          } else {
            rain3hr = 0;
          }
        } else {
          rain3hr = 0;
        }

        // Verify snow object exists and has data in it
        if (currentData.hasOwnProperty('snow')) {

          key = Object.keys(currentData.snow);

          if (!currentData.snow[key[0]].isEmptyObject()) {
            snow3hr = currentData.snow[key[0]];
          } else {
            snow3hr = 0;
          }
        } else {
          snow3hr = 0;
        }
          // Send data to displayToday to push to page    
          displayCurrent(units, forecastTimeNow, iconNow, tempNow, descripNow, windSpeedNow, windDirectionNow, humidityNow, pressureNow, cloudNow, rain3hr, snow3hr, sunriseTimeToday, sunsetTimeToday);

          displayForecast(units, dayForecast, forecastTime, forecastIcon, forecastTemp, forecastWindDirection, forecastWindSpeed, forecastWeatherDescrip);
        }) // End of .get forecast   

  } // End of getForecast()

function displayCurrent(units, forecastTimeNow, iconNow, tempNow, descripNow, windSpeedNow, windDirectionNow, humidityNow, pressureNow, cloudNow, rain3hr, snow3hr, sunriseTimeToday, sunsetTimeToday) {

console.log('windDirectionNow:',windDirectionNow)
  $('#forecastTime').html("Report as of " + convertDisplayTime(forecastTimeNow));

  if (units === "imperial") {
    // Fahrenheit, mph
    $('#currentTemp').html(tempNow + " \xB0F");
    $('#windNow').html(windDirectionNow + " " + windSpeedNow + " mph");
  } else if (units === "metric") {
    // Celsius, km/h
    $('#currentTemp').html(tempNow + " \xB0C");
    $('#windNow').html(windDirectionNow + " " + windSpeedNow + " km\/h");
  } else {
    // Kelvin
    $('#currentTemp').html(tempNow + " \xB0K");
    $('#windNow').html(windDirectionNow + " " + windSpeedNow + " m\/s");
  }

  $('#icon').html("<img src='http://openweathermap.org/img/w/" + iconNow + ".png' style='height:100px'>");
  $('#weatherDescripNow').html(descripNow);
  $('#humidityNow').html(humidityNow + " \%");

  $('#pressureNow').html(pressureNow + " mbar");

  $('#cloudNow').html(cloudNow + " \%");

  if (units === "imperial") {
    $('#rainNow').html(convertRain(rain3hr, units) + " in");
  } else {
    $('#rainNow').html(convertRain(rain3hr, units) + " mm");

  }

  $('#snowNow').html(snow3hr + " units");

  $('#sunrise').html(convertDisplayTime(sunriseTimeToday));
  $('#sunset').html(convertDisplayTime(sunsetTimeToday));

  $('#currentPopover').popover({
    html: true,
    placement: 'top',
    content: function() {
      return $($(this).data('contentwrapper')).html();
    }
  }); // End currentPopover function

  $('#precipPopover').popover({
    // Display cloud cover, rain, and snow
    // https://stackoverflow.com/questions/18861957/html-bootstrap-popover-function
    html: true,
    placement: 'top',
    content: function() {
      return $($(this).data('contentwrapper')).html();
    }
  }); // End precipPopover function

}

function displayForecast(units, dayForecast, forecastTime, forecastIcon, forecastTemp, forecastWindDirection, forecastWindSpeed, forecastWeatherDescrip) {

  // Push "Today" data to table
  $('#today').html(dayForecast[0]);
  $('#todayIcon').html("<img src='http://openweathermap.org/img/w/" + forecastIcon[0] + ".png'>");

  if (units === "imperial") {
    // Fahrenheit, mph
    $('#todayTemp').html(forecastTemp[0] + " \xB0F");
    $('#todayWind').html(forecastWindDirection[0] + " " + forecastWindSpeed[0] + " mph");

  } else if (units === "metric") {
    // Celsius, km/h
    $('#todayTemp').html(forecastTemp[0] + " \xB0C");
    $('#todayWind').html(forecastWindDirection[0] + " " + forecastWindSpeed[0] + " km\/h");

  } else {
    // Kelvin
    $('#todayTemp').html(forecastTemp[0] + " K");
    $('#todayWind').html(forecastWindDirection[0] + " " + forecastWindSpeed[0] + " m\/s");
  }
  $('#todayWeatherDescrip').html(forecastWeatherDescrip[0]);

  // Push "Tonight" data to table
  $('#tonight').html(dayForecast[1]);
  $('#tonightIcon').html("<img src='http://openweathermap.org/img/w/" + forecastIcon[1] + ".png'>");
  if (units === "imperial") {
    // Fahrenheit, mph
    $('#tonightTemp').html(forecastTemp[1] + " \xB0F");
    $('#tonightWind').html(forecastWindDirection[1] + " " + forecastWindSpeed[1] + " mph");
  } else if (units === "metric") {
    // Celsius, km/h
    $('#tonightTemp').html(forecastTemp[1] + " \xB0C");
    $('#tonightWind').html(forecastWindDirection[1] + " " + forecastWindSpeed[1] + " km\/h");
  } else {
    // Kelvin
    $('#tonightTemp').html(forecastTemp[1] + " K");
    $('#tonightWind').html(forecastWindDirection[1] + " " + forecastWindSpeed + " m\/s");
  }
  $('#tonightWeatherDescrip').html(forecastWeatherDescrip[1]);

  // Day 2 Forecast push to table
  $('#day2forecast').html(dayForecast[2]);

  $('#day2forecastIcon').html("<img src='http://openweathermap.org/img/w/" + forecastIcon[2] + ".png'>");
  if (units === "imperial") {
    // Fahrenheit, mph
    $('#day2forecastTemp').html(forecastTemp[2] + " \xB0F");
    $('#day2forecastWind').html(forecastWindDirection[2] + " " + forecastWindSpeed[2] + " mph");

  } else if (units === "metric") {
    // Celsius, km/h
    $('#day2forecastTemp').html(forecastTemp[2] + " \xB0C");
    $('#day2forecastWind').html(forecastWindDirection[2] + " " + forecastWindSpeed[2] + " km\/h");

  } else {
    // Kelvin
    $('#day2forecastTemp').html(forecastTemp[2] + " K");
    $('#day2forecastWind').html(forecastWindDirection[2] + " " + forecastWindSpeed[2] + " m\/s");

  }
  $('#day2forecastWeatherDescrip').html(forecastWeatherDescrip[2]);

  // Day 3 Forecast push to table
  $('#day3forecast').html(dayForecast[3]);

  $('#day3forecastIcon').html("<img src='http://openweathermap.org/img/w/" + forecastIcon[3] + ".png'>");
  if (units === "imperial") {
    // Fahrenheit, mph
    $('#day3forecastTemp').html(forecastTemp[3] + " \xB0F");
    $('#day3forecastWind').html(forecastWindDirection[3] + " " + forecastWindSpeed[3] + " mph");

  } else if (units === "metric") {
    // Celsius, km/h
    $('#day3forecastTemp').html(forecastTemp[3] + " \xB0C");
    $('#day3forecastWind').html(forecastWindDirection[3] + " " + forecastWindSpeed[3] + " km\/h");

  } else {
    // Kelvin
    $('#day3forecastTemp').html(forecastTemp[3] + " K");
    $('#day3forecastWind').html(forecastWindDirection[3] + " " + forecastWindSpeed[3] + " m\/s");

  }
  $('#day3forecastWeatherDescrip').html(forecastWeatherDescrip[3]);

  // Day 4 Forecast push to table
  $('#day4forecast').html(dayForecast[4]);

  $('#day4forecastIcon').html("<img src='http://openweathermap.org/img/w/" + forecastIcon[4] + ".png'>");
  if (units === "imperial") {
    // Fahrenheit, mph
    $('#day4forecastTemp').html(forecastTemp[4] + " \xB0F");
    $('#day4forecastWind').html(forecastWindDirection[4] + " " + forecastWindSpeed[4] + " mph");

  } else if (units === "metric") {
    // Celsius, km/h
    $('#day4forecastTemp').html(forecastTemp[4] + " \xB0C");
    $('#day4forecastWind').html(forecastWindDirection[4] + " " + forecastWindSpeed[4] + " km\/h");

  } else {
    // Kelvin
    $('#day4forecastTemp').html(forecastTemp[4] + " K");
    $('#day4forecastWind').html(forecastWindDirection[4] + " " + forecastWindSpeed[4] + " m\/s");

  }
  $('#day4forecastWeatherDescrip').html(forecastWeatherDescrip[4]);

  // Day 5 forecast push to table

  $('#day5forecast').html(dayForecast[5]);

  $('#day5forecastIcon').html("<img src='http://openweathermap.org/img/w/" + forecastIcon[5] + ".png'>");
  if (units === "imperial") {
    // Fahrenheit, mph
    $('#day5forecastTemp').html(forecastTemp[5] + " \xB0F");
    $('#day5forecastWind').html(forecastWindDirection[5] + " " + forecastWindSpeed[5] + " mph");

  } else if (units === "metric") {
    // Celsius, km/h
    $('#day5forecastTemp').html(forecastTemp[5] + " \xB0C");
    $('#day5forecastWind').html(forecastWindDirection[5] + " " + forecastWindSpeed[5] + " km\/h");

  } else {
    // Kelvin
    $('#day5forecastTemp').html(forecastTemp[5] + " K");
    $('#day5forecastWind').html(forecastWindDirection[5] + " " + forecastWindSpeed[5] + " m\/s");

  }
  $('#day5forecastWeatherDescrip').html(forecastWeatherDescrip[5]);

  // Day 6 forecast push to table

  $('#day6forecast').html(dayForecast[6]);

  $('#day6forecastIcon').html("<img src='http://openweathermap.org/img/w/" + forecastIcon[6] + ".png'>");
  if (units === "imperial") {
    // Fahrenheit, mph
    $('#day6forecastTemp').html(forecastTemp[6] + " \xB0F");
    $('#day6forecastWind').html(forecastWindDirection[6] + " " + forecastWindSpeed[6] + " mph");

  } else if (units === "metric") {
    // Celsius, km/h
    $('#day6forecastTemp').html(forecastTemp[6] + " \xB0C");
    $('#day6forecastWind').html(forecastWindDirection[6] + " " + forecastWindSpeed[6] + " km\/h");

  } else {
    // Kelvin
    $('#day6forecastTemp').html(forecastTemp[6] + " K");
    $('#day6forecastWind').html(forecastWindDirection[6] + " " + forecastWindSpeed[6] + " m\/s");

  }
  $('#day6forecastWeatherDescrip').html(forecastWeatherDescrip[6]);

  // Change table row visibility based on time
  displayForecastStartDate(forecastTime[0]);
}

function convertTemp(temp, tempUnits) {
  /* convertTemp takes in a temperature in Kelvin and the user-selected units and converts the temperature into either Fahrenheit or Celsius  */

  if (tempUnits === "imperial") {
    // Temperature is automatically loaded in Kelvin. Convert to Fahreheit
    return ((temp - 273.15) * 1.8 + 32).toFixed(0);
  } else {
    // Temperature is automatically loaded in Kelvin. Convert to Celsius
    return (temp - 273.15).toFixed(1);
  }
}

function convertWindDirection(direction) {
  console.log('wind',direction)
  /* convertWindDirection takes in a wind direction in degrees and returns a cardinal coordinate based upon the given angle. */

  var compass = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  var point = Math.floor(direction / 15);

  console.log('point',point)
  let directionSymbol = compass[point] !== undefined ? compass[point] : 'N'
  return directionSymbol;
}

function convertWindspeed(windSpeed, units) {
  /* convertWindSpeed converts the windspeed from m/s to the user-selected units of either mph or kph  */

  if (units === "imperial") {
    // Windspeed is loaded in m/s. Convert to mph and return
    return (windSpeed * 2.23694).toFixed(0);
  } else {
    // Windspeed is loaded in m/s. Convert to kph and return
    return (windSpeed * 3.6).toFixed(0);
  }
}

function convertDisplayTime(time) {
  /* convertDisplayTime takes in a pre-converted time (unix time to system time) and displays the time in the more familiar 88:88 AM/PM format  */

  var minutes = time.getMinutes();

  minutes = minutes > 9 ? minutes : '0' + minutes;

  if (time.getHours() > 11) {
    if (time.getHours() === 12) {
      return "12:" + minutes + " PM";
    } else {
      return (time.getHours() - 12) + ":" + minutes + " PM";
    }
  } else if (time.getHours() === 0) {
    return "12:" + minutes + " AM";
  } else {
    return time.getHours() + ":" + minutes + " AM";
  }
}

function displayForecastStartDate(startdt) {
  /* displayForecastStartDate takes in a converted system date / time and gets the current hour. If the time is beyond 2 PM, the function hides the "Today" row in the forecast table and displays the last date in the forecast table. If the time is before 2 PM, the function shows the "Today" row in the forecast table and hides the last date in the forecast table */

  // Initially set today as visible and day five as hidden
  // Use system time instead of forecastTime
  $('#todayForecastRow').show();
  $('#day6ForecastRow').hide();
  // Determines whether to start on "Today" or "Tonight" on Forecast Table and displays data
  if ((startdt.getHours() < 17) && (startdt.getHours() > 5)) {
    // Time is before 2 PM local. Display "Today" row, hide 5th day row
    $('#todayForecastRow').show();
    $('#day6ForecastRow').hide();
  } else {
    // Time is before 2 PM local. Hide "Today" row, display 5th day row
    $('#day6ForecastRow').show();
    $('#todayForecastRow').hide();
  }

}

function convertDayAbr(dayNum) {
  // Converts a given index from the Date.getDay() function into a three letter day abbreviation

  // Return day of the week
  var days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  return days[dayNum];
}

function convertDayFull(dayNum) {
  // Converts a given index from the Date.getDay() function into the day of the week

  var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[dayNum];
}

function convertUnixTime(unixTime) {
  // Shorthand function to convert a unix time into a new date object

  var time = new Date(unixTime * 1000);

  return time;
}

function locationAssign(country, countryCode, city, regionCode, zip) {
  /* Location assign takes in the city, state, zip, and country / country code for the given IP address and formats the output based upon if it is a US address or not. US addresses are given in the familiar City, ST (Zip), while non-US addresses are given in City, Country */

  if (countryCode === "US") {
    return city + ", " + regionCode + " \(" + zip + "\) Weather";
  } else {
    return city + ", " + country + " Weather";
  }

}

function convertRain(rainfall, units) {
  // Reads in precipitation amount and units. Converts to inches if necessary.
  if (units === "imperial") {
    // Rain is loaded in mm. Convert to inches and return
    return (rainfall * 0.0393701).toFixed(1);
  } else {
    // Rain is loaded in mm. Keep as is and return
    return rainfall.toFixed(1);
  }
}

function tempGraph1(forecastDataJson) {
    
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
		type: 'datetime',
		tickInterval:24 * 3600 * 1000 * 2,
        tickPositioner: function(min, max){
             var interval = this.options.tickInterval,
                 ticks = [],
                 count = 0;
            
            while(min < max) {
                ticks.push(min);
                min += interval;
                count ++;
            }
            
            ticks.info = {
                unitName: 'day',
                count: 2,
                higherRanks: {},
		        totalRange: interval * count
            }

            
            return ticks;
        }
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
                pointInterval: 24 * 3600 * 1000  // one day
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
  
   
        var maxTemperatures = [];
        var minTemperatures = [];
       

        var length = forecastDataJson.list.length;
        for (var i = 0; i< length; i++) {
          
          //var maxTemp = json1.daily.data[i].temperatureMax;
          //var minTemp = json1.daily.data[i].temperatureMin;
          
          var maxTemp = forecastDataJson.list[i].main.temp_max
          var minTemp = forecastDataJson.list[i].main.temp_min
         
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
}




function humidityGraph2(forecastDataJson) {
    
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
		type: 'datetime',
		tickInterval:24 * 3600 * 1000 * 2,
        tickPositioner: function(min, max){
             var interval = this.options.tickInterval,
                 ticks = [],
                 count = 0;
            
            while(min < max) {
                ticks.push(min);
                min += interval;
                count ++;
            }
            
            ticks.info = {
                unitName: 'day',
                count: 2,
                higherRanks: {},
		        totalRange: interval * count
            }

            
            return ticks;
        }
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
            format: '{value} g/m3'
          }
      },
      plotOptions: {
            series: {
                pointStart: Date.UTC(year, month, day),
                pointInterval: 24 * 3600 * 1000  // one day
              }
        },
      tooltip: {
          valueSuffix: 'g/m3'
      },
      legend: {
          align: 'center',
          borderWidth: 0
      },
      series: [{
          name: 'Humidity',
          data: []
      }]
  }
  
   
        var humidityData = [];
       

        var length = forecastDataJson.list.length;
        for (var i = 0; i< length; i++) {
          
          var humidity = forecastDataJson.list[i].main.humidity;
         
          humidity = Math.round(humidity);
          humidityData.push(humidity);
          
         
        }
        // Adding data from weather API to options object for first chart.
        options.series[0].data = humidityData;
       
        // rendering chart1
        Highcharts.chart('chart2', options);
}