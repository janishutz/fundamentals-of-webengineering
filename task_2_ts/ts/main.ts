import '@fortawesome/fontawesome-free/css/all.css';
import '../css/layout.css';
import '@picocss/pico/css/pico.min.css';
import {
    computeDifferent,
    computeMinMax,
    numberCheckPredicate, stringOrNumberCheckPredicate
} from './util';
import {
    listRef, ref
} from './rendering';
import {
    CSVRecord
} from './types';
import persistance from './persistance';
import {
    readCSV
} from './csv';


// ┌                                               ┐
// │                  Define refs                  │
// └                                               ┘
const tableHeaderElement = document.getElementById( 'table-header' )!;
const dataList = listRef<CSVRecord>(
    document.getElementById( 'table-body' )!,
    [],
    'table-body',
    {
        'type': 'tr',
        'cssClasses': [],
        'children': []
    }
);
const headerList = listRef<string>(
    tableHeaderElement,
    [],
    'table-header',
    {
        'type': 'th',
        'cssClasses': [ 'sortable' ],
        'children': []
    }
);
const columnEntriesElement = document.getElementById( 'column-entries' )!;
const columnMaxElement = document.getElementById( 'column-max' )!;
const columnMinElement = document.getElementById( 'column-min' )!;
const filter = ref<string>( [], '' );
const filterInput = document.getElementById( 'filter' )! as HTMLInputElement;
const filename = ref<string>( [ document.getElementById( 'data-filename' )! ], '' );
const filetype = ref<string>( [ document.getElementById( 'data-filetype' )! ], '' );
const filesize = ref<string>( [ document.getElementById( 'data-filesize' )! ], '' );
const rowCount = ref<string>( [ document.getElementById( 'data-rowcount' )! ], '' );
const columnName = ref<string>( [ document.getElementById( 'column-selected' )! ], '' );
const columnDatatype = ref<string>( [ document.getElementById( 'column-datatype' )! ], '' );
const columnEntries = ref<number>( [ columnEntriesElement ], 0 );
const columnMax = ref<number>( [ columnMaxElement ], 0 );
const columnMin = ref<number>( [ columnMinElement ], 0 );
const fileInput = document.getElementById( 'file-input' )! as HTMLInputElement;
const sorting = ref<string>( [], '' );

let selectedColumn = '';

filterInput.disabled = true;
filterInput.value = '';


// ┌                                               ┐
// │    conditional rendering of some elements     │
// └                                               ┘
columnDatatype.addConditionalElementBind( columnMinElement, numberCheckPredicate );
columnDatatype.addConditionalElementBind( columnMaxElement, numberCheckPredicate );
columnDatatype.addConditionalElementBind( document.getElementById( 'title-column-min' )!, numberCheckPredicate );
columnDatatype.addConditionalElementBind( document.getElementById( 'title-column-max' )!, numberCheckPredicate );
columnDatatype.addConditionalElementBind( columnEntriesElement, stringOrNumberCheckPredicate );
columnDatatype.addConditionalElementBind( document.getElementById( 'title-column-entries' )!,
    stringOrNumberCheckPredicate );
columnDatatype.addConditionalElementBind( document.getElementById( 'column-info' )!, val => val !== '' );
columnDatatype.addConditionalElementBind( document.getElementById( 'column-info-placeholder' )!, val => val === '' );
filename.addConditionalElementBind( document.getElementById( 'data-info' )!, val => val !== '' );
filename.addConditionalElementBind( document.getElementById( 'data-info-placeholder' )!, val => val === '' );



// ┌                                               ┐
// │           Bind to file input event            │
// └                                               ┘
fileInput.addEventListener( 'change', event => {
    if ( fileInput.files && fileInput.files.length > 0 ) {
        const file = fileInput.files[0]!;

        filename.set( file.name );
        filetype.set( file.type );
        filesize.set( String( file.size ) + 'B' );
        readCSV( event )
            .then( data => {
                // Row count
                rowCount.set( String( data.length ) );

                // Header will be the keyset of any row
                const header = Object.keys( data[0]! );

                headerList.set( header );
                columnName.resetConditionalClasses();

                // Initialize sorting
                for ( let i = 0; i < header.length; i++ ) {
                    const column = header[ i ]!;
                    const el = document.getElementById( 'table-header--' + i )!;

                    columnName.addConditionalClasses(
                        el,
                        val => val === header[ i ],
                        [ 'active' ],
                        []
                    );
                    sorting.addConditionalClasses(
                        el, val => {
                            return val === 'ascending' && selectedColumn === header[ i ];
                        }, [ 'asc' ], [ 'desc' ]
                    );
                    sorting.addConditionalClasses(
                        el, val => {
                            return val !== '' && selectedColumn === header[ i ];
                        }, [ 'sorting' ], []
                    );

                    el.addEventListener( 'click', () => {
                        if ( selectedColumn === column ) {
                            const sort = sorting.get();

                            if ( sort === 'ascending' ) {
                                sorting.set( 'descending' );
                            } else if ( sort === 'descending' ) {
                                sorting.set( '' );
                            } else {
                                sorting.set( 'ascending' );
                            }
                        } else {
                            // This column will now be the active column
                            selectedColumn = column;
                            sorting.set( 'ascending' );
                            const dtype = typeof dataList.get()[0]![ column ];

                            columnDatatype.set( dtype );
                            columnName.set( column );

                            if ( dtype === 'string' )
                                filterInput.disabled = false;
                            else
                                filterInput.disabled = true;
                        }
                    } );
                }

                // ── Generate list. Need to first generate the correct template ───
                // Reset, to not trigger expensive rerender
                dataList.set( [] );
                dataList.setTemplate( {
                    'type': 'tr',
                    'cssClasses': [],
                    'children': header.map( val => {
                        return {
                            'type': 'td',
                            'cssClasses': [],
                            'children': [],
                            'attribute': val
                        };
                    } )
                } );

                dataList.set( data );
                const config = persistance.get( file.name, file.size + 'B' );

                if ( config ) {
                    const dtype = typeof dataList.get()[0]![ config.sorted ];

                    selectedColumn = config.active;
                    columnDatatype.set( dtype );
                    columnName.set( config.sorted );
                    sorting.set( config.sorting );

                    if ( dtype === 'string' )
                        filterInput.disabled = false;
                    else
                        filterInput.disabled = true;
                }
            } )
            .catch( e => {
                console.warn( e );
                alert( 'Failed to read CSV' );
            } );
    } else {
        alert( 'No file selected' );
    }
} );



// TODO: Maybe add an overlay that is shown during load?

// ┌                                               ┐
// │                    Sorting                    │
// └                                               ┘
const doSort = () => {
    filter.set( '' );
    persistance.store(
        filename.get(), filesize.get(), selectedColumn, selectedColumn, sorting.get()
    );
    let sorter = ascendingStringSort;

    if ( columnDatatype.get() === 'string' ) {
        columnEntries.set( computeDifferent( dataList.get(), selectedColumn ) );
    } else if ( columnDatatype.get() === 'number' ) {
        const stats = computeMinMax( dataList.get(), selectedColumn );

        columnMin.set( stats[ 0 ] );
        columnMax.set( stats[ 1 ] );
        columnEntries.set( stats[ 2 ] );
        sorter = ascendingNumberSort;
    }

    if ( sorting.get() === 'ascending' ) {
        dataList.sort( ( a, b ) => sorter( a, b ) );
    } else if ( sorting.get() === 'descending' ) {
        dataList.sort( ( a, b ) => sorter( b, a ) );
    } else {
        dataList.resetSort();
    }
};

const ascendingStringSort = ( a: CSVRecord, b: CSVRecord ) => {
    return ( a[ selectedColumn ] as string ).localeCompare( b[ selectedColumn ] as string );
};

const ascendingNumberSort = ( a: CSVRecord, b: CSVRecord ) => {
    return ( a[ selectedColumn ] as number ) - ( b[ selectedColumn ] as number );
};


columnName.onChange( doSort );
sorting.onChange( doSort );



// ┌                                               ┐
// │                   Filtering                   │
// └                                               ┘
// Bind filter ref to element
filter.bind( filterInput, val => val );

// Add listener to change of filter value.
filter.onChange( () => {
    document.dispatchEvent( new CustomEvent( 'explorer:filter', {
        'detail': 'Filtering has changed',
        'cancelable': false
    } ) );

    if ( columnDatatype.get() === 'string' ) {
        dataList.filter( a => {
            return ( a[ selectedColumn ] as string ).includes( filter.get() );
        } );
    } else {
        dataList.filter( () => true );
    }
} );
