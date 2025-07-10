document.addEventListener("DOMContentLoaded", () => {
  const apiKey = "f2b95616d7c202a1822cfa68d601da65";

  const form = document.getElementById("searchForm");
  const input = document.getElementById("cityInput");
  const cityName = document.getElementById("cityName");
  const weatherIcon = document.getElementById("weatherIcon");
  const condition = document.getElementById("condition");
  const temperature = document.getElementById("temperature");
  const humidity = document.getElementById("humidity");
  const windSpeed = document.getElementById("windSpeed");
  const refreshBtn = document.getElementById("refreshBtm");
  const tempSpan = document.getElementById("temperature");
  const unitSpan = document.getElementById("unit");
  const toggleInput = document.getElementById("tempToggle");

  let currentTempC = null; 
  let isCelsius = true;

  document.getElementById("themeToggle").onclick = () => {
    document.body.classList.toggle("dark");
  };

  function updateBackground(desc) {
  document.body.classList.remove("sunny", "cloudy", "rainy");

  const d = desc.toLowerCase();
  if (d.includes("rain") || d.includes("drizzle") || d.includes("thunder")) {
    document.body.classList.add("rainy");
  } else if (d.includes("cloud")) {
    document.body.classList.add("cloudy");
  } else {
    document.body.classList.add("sunny");
  }
}


  toggleInput.addEventListener("change", () => {
    if (currentTempC === null) return;

    if (isCelsius) {
      const f = (currentTempC * 9) / 5 + 32;
      tempSpan.textContent = Math.round(f);
      unitSpan.textContent = "F";
    } else {
      tempSpan.textContent = Math.round(currentTempC);
      unitSpan.textContent = "C";
    }

    isCelsius = !isCelsius;
  });

  function getWeather(city) {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
    )
      .then((res) => {
        if (!res.ok) throw new Error("City not found");
        return res.json();
      })
      .then((data) => {
        const tempC = data.main.temp;
        currentTempC = tempC;
        isCelsius = true;
        toggleInput.checked = false;

        cityName.textContent = data.name;
        condition.textContent = data.weather[0].description;
        temperature.textContent = Math.round(tempC);
        unitSpan.textContent = "C";
        humidity.textContent = data.main.humidity;
        windSpeed.textContent = data.wind.speed;
        weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        weatherIcon.alt = data.weather[0].description;

        updateBackground(data.weather[0].description);
      })
      .catch((err) => {
        alert(`❌ ${err.message}`);
      });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const city = input.value.trim();
    if (city) {
      getWeather(city);
    }
  });

  refreshBtn.addEventListener("click", () => {
    const city = cityName.textContent.trim();
    if (city && city !== "City Name") {
      getWeather(city);
    }
  });

  
  getWeather("Mumbai");
});
