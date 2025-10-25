import { usePlugin } from '@remnote/plugin-sdk';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// Define the structure of an API result
interface DrugInfo {
  id: string;
  openfda?: {
    brand_name?: string[];
    generic_name?: string[];
  };
  pharmacologic_class?: string[];
}

export const DrugSearchPopup = () => {
  const plugin = usePlugin();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<DrugInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus the input field when the popup opens
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // This effect runs when 'searchTerm' changes, but "debounced"
  useEffect(() => {
    if (searchTerm.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      fetchDrugs(searchTerm);
    }, 300); // Wait 300ms after user stops typing

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const fetchDrugs = async (term: string) => {
    try {
      const response = await axios.get(
        `https://api.fda.gov/drug/label.json`,
        {
          params: {
            search: `(openfda.brand_name:"${term}" OR openfda.generic_name:"${term}")`,
            limit: 5,
          },
        }
      );
      setResults(response.data.results || []);
    } catch (error) {
      console.error('Error fetching from OpenFDA:', error);
    }
    setLoading(false);
  };

  const handleSelectDrug = (drug: DrugInfo) => {
    // Optional: You could insert the drug name into the editor
    // For now, we'll just close the popup
    plugin.window.closePopup();
  };

  return (
    <div className="drug-search-popup">
      <input
        ref={inputRef}
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Type drug name..."
      />
      <div className="drug-results-list">
        {loading && <div className="drug-result-item">Loading...</div>}
        {!loading &&
          results.map((drug) => {
            const commercialNames = drug.openfda?.brand_name?.join(', ') || 'N/A';
            const genericName = drug.openfda?.generic_name?.join(', ') || 'N/A';
            const family = drug.pharmacologic_class?.join(', ') || 'N_A';

            return (
              <div
                key={drug.id}
                className="drug-result-item"
                onClick={() => handleSelectDrug(drug)}
              >
                <strong>{commercialNames}</strong> (<em>{genericName}</em>)
                <div className="drug-info">
                  <strong>Family/Action:</strong> {family}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};