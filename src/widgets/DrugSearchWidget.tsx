import { usePlugin } from '@remnote/plugin-sdk';
import React, { useState, useEffect, useCallback } from 'react';

// Define the structure of the drug info we expect
interface DrugInfo {
  id: string;
  brand_name: string;
  generic_name: string;
  pharm_class: string;
  related_drugs: string[];
}

// Simple debounce function to avoid firing API calls on every keystroke
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
      // Insert the main info at the current cursor
      await plugin.editor.insertTextAfter(
        `${drug.brand_name} (${drug.generic_name})`
      );
      // Get the Rem ID of the newly inserted text
      const newRem = await plugin.rem.findByName([`${drug.brand_name} (${drug.generic_name})`]);
      
      // Add children to the new Rem with more details
      if (newRem) {
        await plugin.rem.createRem(
          { text: `Family / Action`, parentId: newRem._id, children: [drug.pharm_class] }
        );
        await plugin.rem.createRem(
          { text: `Other Commercial Names`, parentId: newRem._id, children: drug.related_drugs }
        );
      }
    }
    // Close the widget after inserting
    plugin.window.closeFloatingWidget();
  };

  return (
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