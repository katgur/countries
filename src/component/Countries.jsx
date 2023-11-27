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
                        img: `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`,
                        temperature: kelvinToCelcius(data.main.temp).toFixed(2),
                        wind: data.wind.speed,
                    })
                })
        }

    }, [country])

    return (
        country &&
        <div className="shadow-2xl rounded p-6 mt-4">
            <img width="150px" className="float-right block mx-[auto] mt-6 border-[1px]" src={country.flag} alt={country.alt} />
            <h1 className="font-bold">{country.name}</h1>
            <p className="mt-2"><span className="text-sm text-gray-500">capital</span> {country.capital}</p>
            <p className="mt-2"><span className="text-sm text-gray-500">area</span> {country.area}</p>
            <p className="mt-2 text-sm text-gray-500">languages</p>
            <ul className="mt-1">
                {
                    country.languages.map(language => {
                        return <li className="bg-blue-100 rounded p-1 inline-block mr-1 mt-1" key={language}>{language}</li>
                    })
                }
            </ul>
            {
                weather && <div className="mt-4">
                    <h2 className="font-bold">Weather in {country.capital}</h2>
                    <p> {weather.main} <img className="inline-block" width="100px" src={weather.img} alt={weather.main} /></p>
                    <p><span className="text-sm text-gray-500">temperature</span> {weather.temperature} Celcius</p>
                    <p><span className="text-sm text-gray-500">wind</span> {weather.wind} meter/sec</p>
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
            {
                countryNames.length <= 10 && countryNames.length > 1 &&
                <ul>
                    {
                        countryNames
                            .map((countryName, index) => {
                                return (
                                    <li className="py-6 border-b-[1px]" key={countryName}>
                                        <div className="flex justify-between">
                                            <p>{countryName}</p>
                                            <button className="bg-blue-500 text-white py-1 px-2 rounded" onClick={() => onShowButtonClick(index)}>Show</button>
                                        </div>
                                        {selected === index && <Country countryName={countryName} />}
                                    </li>
                                )
                            })
                    }
                </ul>
            }
            {countryNames.length === 1 && <Country countryName={countryNames[0]} />}
            {countryNames.length === 0 &&
                <p className="bg-red-100 rounded p-4 mt-3">No matching names</p>}
        </>
    )
}

export default Countries