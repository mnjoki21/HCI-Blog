import { useRouter } from 'next/router'
import { useState } from 'react'

export function SearchBar() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="flex">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search posts..."
        className="px-3 py-1 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm"
      />
      <button
        type="submit"
        className="px-3 py-1 bg-black text-white rounded-r-md hover:bg-gray-800 transition-colors text-sm"
      >
        Search
      </button>
    </form>
  )
}