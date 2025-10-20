import {
    Ref
} from './rendering';

/**
 * Responsive data (similar behaviour as in Vue.js)
 * @template T - The data type you wish to use (as long as you don't want it to be a list)
 * @param data - The data stored in this ref
 * @param elements - The elements to bind to
 */
export const ref = <T>( elements: HTMLElement[], data: T ): Ref<T> => {
    let value: T = data;
    let conditionalElements: HTMLElement[] = [];

    const onChangeFunctions: ( () => Promise<void> )[] = [];
    const conditionalClasses: {
        'element': HTMLElement,
        'onTrue': string,
        'onFalse': string
    }[] = [];
    const boundElements: HTMLInputElement[] = [];

    // ───────────────────────────────────────────────────────────────────
    const get = (): T => {
        return value;
    };

    // ───────────────────────────────────────────────────────────────────
    const set = ( data: T ): void => {
        value = data;

        // Update normal ref elements
        elements.forEach( el => {
            el.innerText = String( data );
        } );

        // Update conditional elements
        conditionalElements.forEach( el => {
            // convert to boolean (explicitly)
            el.hidden = Boolean( data );
        } );

        conditionalClasses.forEach( el => {
            el.element.classList.value = data ? el.onTrue : el.onFalse;
        } );

        // Update boundElements
        boundElements.forEach( el => {
            el.value = String( value );
        } );

        for ( let i = 0; i < onChangeFunctions.length; i++ ) {
            onChangeFunctions[ i ]!();
        }
    };

    /**
     * Bind to input change of an HTMLInputElement (two way bind)
     * @param element - The element to bind to (i.e. add a two-way bind to)
     * @param castFunction - Function used for type casting from string to T
     */
    const bind = ( element: HTMLInputElement, castFunction: ( val: string ) => T ) => {
        element.addEventListener( 'change', () => {
            set( castFunction( element.value ) );
        } );
        boundElements.push( element );
    };

    /**
     * Add elements to be rendered conditionally on this ref. Treats type as booleanish
     * @param elements - The elements that are rendered consistently
     */
    const setConditionalElements = ( elements: HTMLElement[] ): void => {
        conditionalElements = elements;
    };

    /**
     * @param element - The element to do the operation on
     * @param onTrue - The classes (as strings) to set if true(ish)
     * @param onFalse - The classes to set on false(ish)
     */
    const addConditionalClasses = (
        element: HTMLElement,
        onTrue: string,
        onFalse: string
    ) => {
        conditionalClasses.push( {
            'element': element,
            'onTrue': onTrue,
            'onFalse': onFalse
        } );
    };


    /**
     * Connect to change event
     * @param callback - The callback that is executed each time the value is updated
     */
    const onChange = ( callback: () => void ) => {
        const asyncWrapper = async () => callback();

        onChangeFunctions.push( asyncWrapper );
    };

    set( data );

    return {
        set,
        get,
        setConditionalElements,
        addConditionalClasses,
        bind,
        onChange
    };
};
