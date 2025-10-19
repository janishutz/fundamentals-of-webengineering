// Yes, I could not be arsed to keep track of state manually, so wrote a framework real quick that
// does that for me. I am well aware that this is well over engineered, but it was a lot of fun
// and no, this is *NOT* AI generated (I know Claude likes to hallucinate that kinda stuff)
// I will be trying to somewhat follow Vue naming here, as that is what I am familiar with
//
// It was also a nice exercise to get familiar with Generics in TypeScript, something I haven't
// really used before

export interface Ref<T> {
    'set': ( data: T ) => void;
    'get': () => T;
    'addConditionalElements': ( elements: HTMLElement[] ) => void;
}

export interface ListRef<T> {
    'set': ( data: T[] ) => void;
    'get': () => T[];
    'sort': ( compare: ( a: T, b: T ) => number ) => void;
    'filter': ( predicate: ( value: T ) => boolean ) => void;
}


/**
 * Responsive data (similar behaviour as in Vue.js)
 * @template T - The data type you wish to use (as long as you don't want it to be a list)
 * @param data - The data stored in this ref
 * @param elements - The elements to bind to
 */
const ref = <T>( elements: HTMLElement[], data: T ): Ref<T> => {
    let value: T = data;
    let conditionalElements: HTMLElement[] = [];

    // ───────────────────────────────────────────────────────────────────
    const get = (): T => {
        return value;
    };

    // ───────────────────────────────────────────────────────────────────
    const set = ( data: T ): void => {
        value = data;

        // Update normal ref elements
        elements.forEach( el => {
            el.innerHTML = String( data );
        } );

        // Update conditional elements
        conditionalElements.forEach( el => {
            // convert to boolean (explicitly)
            el.hidden = Boolean( data );
        } );
    };

    /**
     * Add elements to be rendered conditionally on this ref. Treats type as booleanish
     * @param elements - The elements that are rendered consistently
     */
    const addConditionalElements = ( elements: HTMLElement[] ): void => {
        conditionalElements = elements;
    };

    return {
        set,
        get,
        addConditionalElements
    };
};


// ───────────────────────────────────────────────────────────────────
//          ╭───────────────────────────────────────────────╮
//          │       List ref, dynamic list rendering        │
//          ╰───────────────────────────────────────────────╯
export type HTMLTagNames = 'div' | 'button' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'span';

export interface RenderTemplate {
    [name: string]: {
        'type': HTMLTagNames;
        'attribute': string;
        'cssClasses': string[];
    }
}

interface DiffList<T> {
    'modified': T[];
    'added': T[];
    'removed': T[];
}

const listRef = <T>( parent: HTMLElement, data: T[] ): ListRef<T> => {
    let value: T[] = data;
    let rendered: T[] = [];

    // ───────────────────────────────────────────────────────────────────
    const get = (): T[] => {
        return value;
    };

    // ───────────────────────────────────────────────────────────────────
    const set = ( data: T[] ): void => {
        const diffList: DiffList<T> = {
            'modified': [],
            'added': [],
            'removed': []
        };

        value = data;
        rendered = value;
    };

    const sort = ( compare: ( a: T, b: T ) => number ): void => {
        // Re-render based on compare function
    };

    const filter = ( predicate: ( value: T ) => boolean ): void => {
        const diffList: DiffList<T> = {
            'modified': [],
            'added': [],
            'removed': []
        };
    };

    return {
        get,
        set,
        sort,
        filter
    };
};

// The list renderer using a DiffList
const renderList = <T>( diffList: DiffList<T> ) => {

};


export default {
    ref,
    listRef
};
