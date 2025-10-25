export interface Drug {
  id: string;
  name: string;
  brand_name?: string;
  generic_name?: string;
  manufacturer?: string;
  product_type?: string;
  route?: string;
  family?: string;
  action?: string;
  dosage?: string;
}

export interface OpenFDAResponse {
  results: Array<{
    id: string;
    openfda: {
      brand_name?: string[];
      generic_name?: string[];
      manufacturer_name?: string[];
      product_type?: string[];
      route?: string[];
      substance_name?: string[];
      pharm_class_epc?: string[];
    };
    indications_and_usage?: string[];
    dosage_and_administration?: string[];
    adverse_reactions?: string[];
  }>;
}