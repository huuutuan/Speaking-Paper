import React from 'react'
import { useState } from 'react';

const SearchBox = () => {
	const [query, setQuery] = useState("");

	const handleSearch = () => {
	  console.log("Searching for:", query);
	  // Implement your search logic here
	};
      
	return (
	  
	      <div className=" flex items-center bg-white border border-gray-300 rounded-full shadow-sm">
		{/* Search Input */}
		<input
		  type="text"
		  placeholder="Search..."
		  value={query}
		  onChange={(e) => setQuery(e.target.value)}
		  className="flex-1 px-4 py-2 text-gray-700 rounded-full outline-none focus:ring-2 focus:ring-blue-500"
		/>
		{/* Search Button */}
		<button
		  onClick={handleSearch}
		  className="px-4 py-2 bg-blue-500 text-white font-medium rounded-full hover:bg-blue-600 transition-colors"
		>
		  Search
		</button>
	      
	  </div>
	);
}

export default SearchBox