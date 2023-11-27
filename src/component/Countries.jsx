import { useEffect } from "react"
import { useState } from "react"
import countryService from '../service/countries'
import weatherService from '../service/weather'

function Country({ countryName }) {
    const [country, setCountry] = useState(null)
    const [weather, setWeather] = useState(null)

    function kelvinToCelcius(k) {
        return k - 273.15
    }

    useEffect(() => {
        if (!country) {
            if (!countryName) {
                return
            }
            countryService.getByName(countryName)
                .then(data => {
                    setCountry({
                        name: data.name.common,
                        capital: data.capital[0],
                        area: data.area,
                        languages: Object.values(data.languages),
                        flag: data.flags.png,
                        alt: data.flags.alt,
                        lat: data.capitalInfo.latlng[0],
                        lng: data.capitalInfo.latlng[1],
                    })
                })

        }
        if (!weather) {
            if (!country) {
                return
            }
            weatherService.getWeather(country.lat, country.lng)
                .then(data => {
                    setWeather({
                        main: data.weather[0].main,
                        img: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
                        temperature: kelvinToCelcius(data.main.temp).toFixed(2),
                        wind: data.wind.speed,
                    })
                })
        }

    }, [country])

    return (
        country &&
        <div>
            <h1>{country.name}</h1>
            <p>capital {country.capital}</p>
            <p>area {country.area}</p>
            <h3>languages:</h3>
            <ul>
                {
                    country.languages.map(language => {
                        return <li key={language}>{language}</li>
                    })
                }
            </ul>
            <img src={country.flag} alt={country.alt} />
            {
                weather && <div>
                    <h2>Weather in {country.capital}</h2>
                    <p>{weather.main}</p>
                    <p>temperature {weather.temperature} Celcius</p>
                    <img src={weather.img} alt={weather.main} />
                    <p>wind {weather.wind} meter/sec</p>
                </div>
            }
        </div>
    )
}

function Countries({ countryNames }) {
    const [selected, setSelected] = useState(-1)

    useEffect(() => {
        setSelected(-1)
    }, [countryNames])

    const onShowButtonClick = (index) => {
        setSelected(index)
    }

    return (
        <>
            {countryNames.length > 10 && <span>Too many countries, specify another filter</span>}
            {
                countryNames.length <= 10 && countryNames.length > 1 &&
                <ul>
                    {
                        countryNames
                            .map((countryName, index) => {
                                return (
                                    <li key={countryName}>
                                        <p>{countryName} <button onClick={() => onShowButtonClick(index)}>show</button></p>
                                        {selected === index && <Country countryName={countryName} />}
                                    </li>
                                )
                            })
                    }
                </ul>
            }
            {countryNames.length === 1 && <Country countryName={countryNames[0]} />}
        </>
    )
}

export default Countries