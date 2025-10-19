import {
    CSV_Data
} from './types';
import {
    csv2json
} from 'json-2-csv';

const convertCSVtoJSON = async ( csvText: string ) => {
    // Type cast OK, as the typing of the external library is not perfect -> Actually it is.
    // NOTE: On transpilation to JS, it will be (more or less) disregarded anyway.
    // If you claim it isn't good typing, it's the same as expecting it to guess the typing,
    // which is literally impossible in TS. But sure...
    return ( await csv2json( csvText ) ) as CSV_Data;
};

/**
 * Reads a CSV file and returns the data as JSON.
 * @param event The change event of the file input.
 */
export const readCSV = async ( event: Event ): Promise<CSV_Data> => {
    if ( !( event.target instanceof HTMLInputElement ) ) {
        throw new Error( 'Not an HTMLInputElement' );
    }

    const file = event.target.files?.[0];

    if ( file == null ) {
        throw new Error( 'No file selected' );
    }

    const result = await file.text();

    return await convertCSVtoJSON( result );
};
