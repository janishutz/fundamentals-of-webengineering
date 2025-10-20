import {
    CSVRecord
} from './types';

export const numberCheckPredicate = ( value: string ) => {
    return value === 'number';
};

export const stringOrNumberCheckPredicate = ( value: string ) => {
    return value === 'string' || value === 'number';
};


export const computeMinMax = ( list: CSVRecord[], selectedColumn: string ): [number, number, number] => {
    const containsList: number[] = [];

    let min = Number.MAX_VALUE;
    let max = Number.MIN_VALUE;

    for ( let i = 0; i < list.length; i++ ) {
        const el = list[i]!;
        const curr = el[ selectedColumn ]! as number;

        if ( curr < min ) min = curr;
        else if ( curr > max ) max = curr;

        if ( !containsList.includes( curr ) ) containsList.push( curr );
    }

    return [
        min,
        max,
        containsList.length
    ];
};

export const computeDifferent = ( list: CSVRecord[], selectedColumn: string ): number => {
    const containsList: string[] = [];

    for ( let i = 0; i < list.length; i++ ) {
        const el = list[i]!;
        const curr = el[ selectedColumn ]! as string;

        if ( !containsList.includes( curr ) ) containsList.push( curr );
    }

    return containsList.length;
};
