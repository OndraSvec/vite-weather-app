import getWeatherData from "./weatherAPI";
import "../../style.css";
import clearIcon from "../assets/clear-day.svg";
import cloudIcon from "../assets/cloudy.svg";
import drizzleIcon from "../assets/drizzle.svg";
import fogIcon from "../assets/fog.svg";
import mistIcon from "../assets/mist.svg";
import overcastIcon from "../assets/overcast.svg";
import partlyCloudyIcon from "../assets/partly-cloudy-day.svg";
import rainIcon from "../assets/rain.svg";
import snowIcon from "../assets/snow.svg";
import thunderstormsIcon from "../assets/thunderstorms.svg";
import windIcon from "../assets/wind.svg";

const searchResDiv = document.querySelector(".searchResult");
const degrees = document.querySelector(".degrees");
const feelsLike = document.querySelector(".feelsLike");
const locationAndCondition = document.querySelector(".locationAndCondition");
const wind = document.querySelector(".wind");
const UV = document.querySelector(".UV");

function appendCondition(data, subdata, sub2data, sub3data) {
  const conditionDiv = searchResDiv.querySelector(".locationAndCondition");
  const para = document.createElement("p");
  const span = document.createElement("span");
  span.textContent = `${data[subdata][sub2data][sub3data]}`;
  para.textContent = "Condition: ";
  const div = document.createElement("div");
  [para, span].forEach((element) => div.appendChild(element));
  conditionDiv.appendChild(div);
}

function appendElement(caption, data, subdata, subsubdata, unit, targetDiv) {
  const para = document.createElement("p");
  const span = document.createElement("span");
  span.textContent = `${data[subdata][subsubdata]} ${unit}`;
  para.textContent = `${caption}: `;
  const div = document.createElement("div");
  [para, span].forEach((element) => div.appendChild(element));
  targetDiv.appendChild(div);
}

function removeElement(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.lastChild);
  }
}

function removeDisplayedElements() {
  [degrees, feelsLike, locationAndCondition, wind, UV].forEach((div) =>
    removeElement(div)
  );
}

export function getSearchResult() {
  const searchInp = document.getElementById("searchInput");
  const { value } = searchInp;
  searchInp.value = "";
  return value;
}

function showSearchResult() {
  searchResDiv.classList.remove("hidden");
}

function hideSearchResult() {
  searchResDiv.classList.add("hidden");
}

function showError() {
  const searchLabel = document.getElementById("searchLabel");
  searchLabel.textContent = "enter a valid location";
  searchLabel.classList.add("invalid-location");
}

function hideError() {
  const searchLabel = document.getElementById("searchLabel");
  searchLabel.textContent = "enter a location";
  searchLabel.classList.remove("invalid-location");
}

async function displayElements() {
  try {
    hideError();
    showSearchResult();
    const response = await getWeatherData(getSearchResult());

    appendElement(
      "City",
      response,
      "location",
      "name",
      "",
      locationAndCondition
    );
    appendElement(
      "Country",
      response,
      "location",
      "country",
      "",
      locationAndCondition
    );
    appendCondition(response, "current", "condition", "text");
    appendElement(
      "Time",
      response,
      "location",
      "localtime",
      "",
      locationAndCondition
    );
    appendElement("Temperature", response, "current", "temp_c", "°C", degrees);
    appendElement("Temperature", response, "current", "temp_f", "°F", degrees);
    appendElement(
      "Feels like",
      response,
      "current",
      "feelslike_c",
      "°C",
      feelsLike
    );
    appendElement(
      "Feels like",
      response,
      "current",
      "feelslike_f",
      "°F",
      feelsLike
    );
    appendElement("Wind speed", response, "current", "wind_kph", "Kph", wind);
    appendElement("Wind direction", response, "current", "wind_dir", "", wind);
    appendElement("UV Index", response, "current", "uv", "", UV);
  } catch (error) {
    hideSearchResult();
    showError();
    [degrees, feelsLike, locationAndCondition, wind, UV].forEach((div) =>
      removeElement(div)
    );
  }
}

function showWeatherIcon() {
  if (locationAndCondition.firstChild) {
    const weatherIcon = document.createElement("img");
    weatherIcon.src = clearIcon;
    locationAndCondition.insertBefore(
      weatherIcon,
      locationAndCondition.firstChild
    );
  }
}

function formatTime() {
  if (locationAndCondition.lastChild) {
    const element = locationAndCondition.lastChild.querySelector("span");
    const textCon = element.textContent.split(" ")[1];
    element.textContent = textCon;
  }
}

function handleUVIndex() {
  if (UV.querySelector("span")) {
    const UVspan = UV.querySelector("span");
    const UVIndex = UVspan.textContent;
    switch (true) {
      case UVIndex < 3:
        UVspan.setAttribute("style", "color: var(--uv-index-low);");
        break;
      case UVIndex < 6:
        UVspan.setAttribute("style", "color: var(--uv-index-med);");
        break;
      case UVIndex < 8:
        UVspan.setAttribute("style", "color: var(--uv-index-medHigh);");
        break;
      case UVIndex >= 8:
        UVspan.setAttribute("style", "color: var(--uv-index-high);");
        break;
      default:
    }
  }
}

export default function events() {
  const form = document.querySelector("form");
  form.addEventListener("submit", (e) => {
    e.preventDefault(), handleUserInput();
  });
  const searchBtn = document.getElementById("searchBtn");
  searchBtn.addEventListener("click", handleUserInput);

  async function handleUserInput() {
    removeDisplayedElements();
    await displayElements();
    showWeatherIcon();
    formatTime();
    handleUVIndex();
  }
}
