import React, { useState, useEffect, useCallback } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { searchDrugs } from '../services/openfda';
import { Drug } from '../types/drug';

export const DrugSearchWidget: React.FC = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Drug[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
  
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      searchDrugs(debouncedQuery).then(drugs => {
        setSuggestions(drugs);
        setIsLoading(false);
      });
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery]);

  const handleDrugSelect = (drug: Drug) => {
    setSelectedDrug(drug);
    // Here you would typically insert the drug info into the document
  };

  return (
    <div className="drug-search-widget">
      <input
        type="text"
        placeholder="Search for drugs..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsLoading(true);
        }}
        className="drug-search-input"
      />
      
      {isLoading && <div className="loading">Loading...</div>}
      
      {suggestions.length > 0 && (
        <div className="suggestions-list">
          {suggestions.map((drug, index) => (
            <div
              key={index}
              className="suggestion-item"
              onClick={() => handleDrugSelect(drug)}
            >
              <div className="drug-name">{drug.name}</div>
              {drug.brand_name && (
                <div className="drug-brand">Brand: {drug.brand_name}</div>
              )}
              {drug.generic_name && (
                <div className="drug-generic">Generic: {drug.generic_name}</div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {selectedDrug && (
        <div className="drug-details">
          <h3>{selectedDrug.name}</h3>
          {/* Add more drug details here */}
        </div>
      )}
    </div>
  );
};