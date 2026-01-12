import { useState, useEffect } from "react";
import { searchLocations } from "../../../services/geocodingService";
import { FiSearch, FiMapPin, FiX } from "react-icons/fi";

const LocationSearch = ({ onPlaceSelected, searchValue, onSearchValueChange, placeholder = "Buscar ubicación..." }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [userIsTyping, setUserIsTyping] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchValue && searchValue.length >= 2 && userIsTyping) {
        setLoading(true);
        const searchResults = await searchLocations(searchValue);
        
        setResults(searchResults);
        setShowResults(true);
        setLoading(false);
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchValue, userIsTyping]);

  const handleSelect = (result) => {
    onPlaceSelected({
      lat: result.lat,
      lng: result.lng,
      name: result.displayName,
      city: result.city,
      state: result.state,
      country: result.country,
      municipality: result.municipality,
    });
    onSearchValueChange("");
    setShowResults(false);
    setResults([]);
    setUserIsTyping(false);
  };

  const handleClear = () => {
    onSearchValueChange("");
    setResults([]);
    setShowResults(false);
    setUserIsTyping(false);
  };

  const handleInputChange = (e) => {
    setUserIsTyping(true);
    onSearchValueChange(e.target.value);
  };

  return (
    <div className="relative">
      <div className="relative bg-white rounded-xl shadow-md">
        <div className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-slate-400 z-10">
          <FiSearch className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <input
          type="text"
          value={searchValue}
          onChange={handleInputChange}
          onFocus={() => setUserIsTyping(true)}
          onBlur={() => setTimeout(() => setUserIsTyping(false), 200)}
          placeholder={placeholder}
          className="w-full pl-8 sm:pl-10 pr-8 sm:pr-10 py-2 sm:py-3 text-sm sm:text-base bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {searchValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <FiX className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}
        {loading && (
          <div className="absolute right-8 sm:right-10 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-blue-500" />
          </div>
        )}
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 sm:mt-2 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 sm:max-h-64 overflow-y-auto">
          {results.map((result, index) => (
            <button
              key={`${result.placeId}-${index}`}
              type="button"
              onClick={() => handleSelect(result)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-left hover:bg-slate-50 border-b border-slate-100 last:border-b-0 flex items-start gap-2 sm:gap-3 transition-colors"
            >
              <FiMapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-slate-900 truncate text-sm sm:text-base">
                  {result.city || result.municipality || result.state}
                </div>
                <div className="text-xs sm:text-sm text-slate-500 truncate">
                  {result.displayName}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {showResults && searchValue && results.length === 0 && !loading && (
        <div className="absolute z-50 w-full mt-1 sm:mt-2 bg-white border border-slate-200 rounded-xl shadow-lg p-3 sm:p-4 text-center text-slate-500 text-xs sm:text-sm">
          No se encontraron resultados
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
