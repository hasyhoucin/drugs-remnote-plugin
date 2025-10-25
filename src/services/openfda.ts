import { Drug, OpenFDAResponse } from '../types/drug';

const OPENFDA_BASE_URL = 'https://api.fda.gov/drug';
const API_KEY = ''; // You might want to get an API key from OpenFDA

export async function searchDrugs(query: string): Promise<Drug[]> {
  try {
    // Search in drug labeling endpoint
    const response = await fetch(
      `${OPENFDA_BASE_URL}/label.json?search=openfda.brand_name:"${query}"+OR+openfda.generic_name:"${query}"&limit=10`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch drug data');
    }
    
    const data: OpenFDAResponse = await response.json();
    
    return data.results.map(result => ({
      id: result.id,
      name: result.openfda.brand_name?.[0] || result.openfda.generic_name?.[0] || 'Unknown Drug',
      brand_name: result.openfda.brand_name?.[0],
      generic_name: result.openfda.generic_name?.[0],
      manufacturer: result.openfda.manufacturer_name?.[0],
      product_type: result.openfda.product_type?.[0],
      route: result.openfda.route?.[0],
      // Add more fields as needed
    }));
  } catch (error) {
    console.error('Error fetching drug data:', error);
    return [];
  }
}