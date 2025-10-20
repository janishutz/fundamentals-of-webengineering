import '@fortawesome/fontawesome-free/css/all.css';
import '../css/layout.css';
import '@picocss/pico/css/pico.min.css';
import {
    listRef, ref
} from './rendering/framework';
import {
    CSV_Data
} from './types';
import {
    RenderTemplate
} from './rendering/rendering';

const dataList = listRef<CSV_Data>(
    document.getElementById( 'data-table' )!,
    [],
    'table-body',
    {
        'type': 'tr',
        'cssClasses': [],
        'children': []
    }
);
const headerList = listRef<string>(
    document.getElementById( 'data-header' )!,
    [],
    'table-header',
    {
        'type': 'td',
        'cssClasses': [],
        'children': []
    }
);
const tableRowElement: RenderTemplate = {
    'type': 'td',
    'cssClasses': [],
    'children': [],
};
const filename = ref<string>( [ document.getElementById( 'data-filename' )! ], '' );
const filetype = ref<string>( [ document.getElementById( 'data-filetype' )! ], '' );
const filesize = ref<string>( [ document.getElementById( 'data-filesize' )! ], '' );
const rowCount = ref<string>( [ document.getElementById( 'data-rowcount' )! ], '' );
const filter = ref<string>( [ document.getElementById( 'filter' )! ], '' );
const columnName = ref<string>( [ document.getElementById( 'column-selected' )! ], '' );
const columnDatatype = ref<string>( [ document.getElementById( 'column-datatype' )! ], '' );
const columnEntries = ref<string>( [ document.getElementById( 'column-entries' )! ], '' );
const columnMax = ref<string>( [ document.getElementById( 'column-max' )! ], '' );
const columnMin = ref<string>( [ document.getElementById( 'column-min' )! ], '' );
