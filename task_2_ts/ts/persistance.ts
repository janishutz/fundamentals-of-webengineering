import {
    PersistanceConfig
} from './types';

// Using localStorage for persistance
const persistanceStore: PersistanceConfig = JSON.parse( localStorage.getItem( 'persistance' ) ?? '{}' );

export const store = (
    filename: string,
    size: number,
    sorted: string,
    active: string
) => {
    persistanceStore[ `${ filename }-${ size }` ] = {
        'active': active,
        'sorted': sorted
    };
    localStorage.setItem( 'persistance', JSON.stringify( persistanceStore ) );
};


export const get = ( filename: string, size: number ) => {
    return persistanceStore[ `${ filename }-${ size }` ];
};
