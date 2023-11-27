import { useState, useEffect } from 'react'
import countryService from './service/countries'
import Countries from './component/Countries'

const App = () => {
  const [countries, setCountries] = useState()
  const [search, setSearch] = useState('')

  useEffect(() => {
    countryService.getAll()
      .then(data => {
        setCountries(data.map(d => d.name.common))
      })
  }, [])

  const filtered = countries?.filter(country => {
    return country.toLowerCase().includes(search)
  })

  return (
    <div className='p-4'>
      <div className='block mx-[auto] md:w-1/2'>
        <label className="font-bold text-2xl block text-center">Find countries</label>
        <input placeholder='Enter the name of a country' className="mt-2 block w-full px-2 py-1 border-[1px] rounded bg-blue-50 hover:border-blue-100" value={search} onChange={(event) => setSearch(event.target.value.toLowerCase())} />
        <Countries countryNames={filtered} />
        {search.length !== 0 && filtered.length > 10 &&
          <p className="bg-red-100 rounded p-4 mt-3">Too many countries, specify another filter</p>}
      </div>
    </div>
  )
}

export default App