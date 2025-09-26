    fetch('https://api.openweathermap.org/data/3.0/onecall/overview?lat=31.344412&lon=-94.607179&appid=a16e6f878d0070be0c1818af74186a3b&units=metric') 
      .then(response => {
        if (!response.ok) {
          throw new Error('WARNING::PROHIBITIVE_INCOHERENCY_DETECTED//COULDNT_FIND_THOUGHTFORM');
        }
        return response.json();
      })
      .then(data => {
        const weatherOverview = data.weather_overview || "ERROR::UNRENDERABLE_OUTPUT";
        document.getElementById('weather').textContent = weatherOverview;
      })
      .catch(error => {
        console.error('ERROR::', error);
        document.getElementById('weather').textContent = "ERROR::UNRENDERABLE_OUTPUT";
      });
