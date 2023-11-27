import { useState, useEffect } from 'react'
import countryService from './service/countries'
import Countries from './component/Countries'

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    countryService.getAll()
      .then(data => {
        setCountries(data.map(d => d.name.common))
      })
  }, [])

  const filtered = countries.filter(country => {
    return country.toLowerCase().includes(search)
  })

  return (
    <div>
      <div>
        <label>find countries</label>
        <input value={search} onChange={(event) => setSearch(event.target.value.toLowerCase())} />
      </div>
      <Countries countryNames={filtered} />
    </div>
  )
}

export default App