import { useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import { useDebounce } from '../hooks/useDebounce'
import { useEffect } from 'react'

function SearchBar({ onSearch, placeholder = 'Search...' }) {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    onSearch(debouncedQuery)
  }, [debouncedQuery, onSearch])

  return (
    <div className="search-bar">
      <FiSearch className="search-icon" />
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  )
}

export default SearchBar
