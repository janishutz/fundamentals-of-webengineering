import {
    PersistanceConfig
} from './types';

// Using localStorage for persistance
const persistanceStore: PersistanceConfig = JSON.parse( localStorage.getItem( 'persistance' ) ?? '{}' );

/**
 * Store state for filename.
 * @param filename - The filename to store for
 * @param size - The filesize (in case file is changed)
 * @param sorted - The sorted column
 * @param active - The active column
 * @param sorting - True if sorting ascending
 */
const store = (
    filename: string,
    size: string,
    sorted: string,
    active: string,
    sorting: string
) => {
    persistanceStore[ `${ filename }-${ size }` ] = {
        'active': active,
        'sorted': sorted,
        'sorting': sorting
    };
    localStorage.setItem( 'persistance', JSON.stringify( persistanceStore ) );
};


/**
 * Get the state for filename
 * @param filename - The file to retrieve from
 * @param size - The size of the file
 * @returns The state, if found
 */
const get = ( filename: string, size: string ) => {
    return persistanceStore[ `${ filename }-${ size }` ];
};


export default {
    store,
    get
};
