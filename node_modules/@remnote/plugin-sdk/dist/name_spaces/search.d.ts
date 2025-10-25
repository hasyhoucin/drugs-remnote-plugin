import { RichTextInterface, RemId, Rem } from '../interfaces';
import { InternalCallMethod, NamespaceBase } from './base';
/**
 * # Search Namespace
 *
 * The API Search namespace.
 */
export declare class SearchNamespace extends NamespaceBase {
    /** @hidden */
    constructor(_call: InternalCallMethod);
    /**
     * Search for Rem matching the query text.
     */
    search: (queryText: RichTextInterface, searchContextRem?: RemId | Rem, options?: {
        filterOnlyConcepts?: boolean;
        numResults?: number;
    }) => Promise<Rem[]>;
}
