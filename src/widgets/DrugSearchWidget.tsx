import { usePlugin } from '@remnote/plugin-sdk';
import React, { useState, useEffect, useCallback } from 'react';

// Define the structure of the drug info we expect
// (No change here)
interface DrugInfo {
  id: string;
  brand_name: string;
  generic_name: string;
  pharm_class: string;
  related_drugs: string[];
}

// Simple debounce function (No change here)
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

export const DrugSearchWidget = () => {
  const plugin = usePlugin();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DrugInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedQuery = useDebounce(query, 300); // 300ms delay

  const fetchDrugs = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      // Use OpenFDA's label endpoint. Search in brand_name and generic_name
      const url = `https://api.fda.gov/drug/label.json?search=(brand_name:"${searchQuery}"+OR+openfda.generic_name:"${searchQuery}")&limit=10`;
      
      // Use the native fetch API
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch data from OpenFDA');
      }
      const data = await response.json();

      if (data.results) {
        const formattedResults: DrugInfo[] = data.results.map((item: any) => ({
          id: item.id,
          brand_name: item.brand_name ? item.brand_name[0] : 'N/A',
          generic_name: item.openfda?.generic_name ? item.openfda.generic_name[0] : 'N/A',
          pharm_class: item.openfda?.pharm_class_epc ? item.openfda.pharm_class_epc[0] : 'N/A',
          related_drugs: item.openfda?.brand_name_base || [],
        }));
        setResults(formattedResults);
      } else {
        setResults([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDrugs(debouncedQuery);
  }, [debouncedQuery, fetchDrugs]);

  // Function to insert the selected drug info into the editor
  const handleResultClick = async (drug: DrugInfo) => {
    const rem = await plugin.focus.getFocusedRem();
    if (rem) {
      // 1. CORRECTED: insertTextAfter is now insertTextAtCursor.
      // We insert the main drug name at the current cursor position.
      await plugin.editor.insertTextAtCursor(
        `${drug.brand_name} (${drug.generic_name})`
      );
      
      // 2. CORRECTED: getByName replaces findByName, and it returns an array of Rems.
      // We grab the first one if found.
      const newRems = await plugin.rem.getByName([`${drug.brand_name} (${drug.generic_name})`]);
      const newRem = newRems ? newRems[0] : null; 
      
      // Add children to the new Rem with more details
      if (newRem) {
        // 3. CORRECTED: createRem now takes the parentId and the content string.
        await plugin.rem.createRem(
          newRem._id, 
          `Family / Action:: ${drug.pharm_class}`
        );
        
        // You'd typically insert related drugs as sub-bullets under the Family/Action rem or under the main drug rem.
        // Let's insert them under the main drug rem for simplicity:
        await plugin.rem.createRem(
          newRem._id,
          `Other Commercial Names:: ${drug.related_drugs.join(', ')}`
        );
      }
    }
    // 4. CORRECTED: closeFloatingWidget takes no arguments.
    plugin.window.closeFloatingWidget();
  };

  return (
    // (Rest of the React Component remains the same)
    <div className="drug-search-widget">
      <h4>Search OpenFDA</h4>
      <input
        type="text"
        placeholder="Type a drug name..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="rem-input"
        autoFocus
      />
      <div className="results-container">
        {isLoading && <div>Loading...</div>}
        {error && <div className="error-message">{error}</div>}
        {!isLoading && !error && results.length === 0 && debouncedQuery.length > 1 && (
          <div>No results found.</div>
        )}
        <ul>
          {results.map((drug) => (
            <li key={drug.id} onClick={() => handleResultClick(drug)} className="result-item">
              <strong>{drug.brand_name}</strong> ({drug.generic_name})
              <small>Class: {drug.pharm_class}</small>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};