import '@fortawesome/fontawesome-free/css/all.css';
import '../css/layout.css';
import '@picocss/pico/css/pico.min.css';
import {
    listRef, ref
} from './rendering';
import {
    CSVRecord
} from './types';
import {
    readCSV
} from './csv';

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
    document.getElementById( 'table-header' )!,
    [],
    'table-header',
    {
        'type': 'td',
        'cssClasses': [],
        'children': []
    }
);
const filter = ref<string>( [ document.getElementById( 'filter' )! ], '' );
const filename = ref<string>( [ document.getElementById( 'data-filename' )! ], '' );
const filetype = ref<string>( [ document.getElementById( 'data-filetype' )! ], '' );
const filesize = ref<string>( [ document.getElementById( 'data-filesize' )! ], '' );
const rowCount = ref<string>( [ document.getElementById( 'data-rowcount' )! ], '' );
const columnName = ref<string>( [ document.getElementById( 'column-selected' )! ], '' );
const columnDatatype = ref<string>( [ document.getElementById( 'column-datatype' )! ], '' );
const columnEntries = ref<string>( [ document.getElementById( 'column-entries' )! ], '' );
const columnMax = ref<string>( [ document.getElementById( 'column-max' )! ], '' );
const columnMin = ref<string>( [ document.getElementById( 'column-min' )! ], '' );
const fileInput = document.getElementById( 'file-input' )! as HTMLInputElement;


// Bind to file input event
fileInput.addEventListener( 'change', event => {
    loadFile( event );
} );

const loadFile = ( event: Event ) => {
    if ( fileInput.files && fileInput.files.length > 0 ) {
        const file = fileInput.files[0]!;

        filename.set( file.name );
        filetype.set( file.type );
        filesize.set( String( file.size ) + 'B' ); // TODO: KB / MB conversion stuff
        readCSV( event )
            .then( data => {
                // Row count
                rowCount.set( String( data.length ) );

                // Header will be the keyset of any row
                const header = Object.keys( data[0]! );

                headerList.set( header );

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
            } )
            .catch( e => {
                console.warn( e );
                alert( 'Failed to read CSV' );
            } );
    } else {
        alert( 'No file selected' );
    }
};
