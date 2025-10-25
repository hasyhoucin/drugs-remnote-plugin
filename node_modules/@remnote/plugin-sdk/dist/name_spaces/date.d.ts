import { Rem } from '../interfaces';
import { InternalCallMethod, NamespaceBase } from './base';
/**
 * # Date Namespace
 *
 * The API Date namespace.
 */
export declare class DateNamespace extends NamespaceBase {
    /** @hidden */
    constructor(_call: InternalCallMethod);
    /**
     * Get the daily document for any date. Will create the document if it does not already exist.
     */
    getDailyDoc: (date: Date) => Promise<Rem | undefined>;
    /**
     * Get the Rem representing today's document.
     */
    getTodaysDoc: () => Promise<Rem | undefined>;
}
