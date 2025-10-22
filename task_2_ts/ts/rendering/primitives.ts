import {
    Ref
} from './rendering';

interface ConditionalElement<T> {
    'element': HTMLElement;
    'predicate': ( value: T ) => boolean;
}

interface ConditionalClass<T> {
    'element': HTMLElement,
    'onTrue': string,
    'onFalse': string,
    'predicate': ( value: T ) => boolean;
}

/**
 * Responsive data (similar behaviour as in Vue.js)
 * @template T - The data type you wish to use (as long as you don't want it to be a list)
 * @param data - The data stored in this ref
 * @param elements - The elements to bind to
 */
export const ref = <T>( elements: HTMLElement[], data: T ): Ref<T> => {
    let value: T = data;

    const onChangeFunctions: ( () => Promise<void> )[] = [];
    const boundElements: HTMLInputElement[] = [];

    let conditionalElements: ConditionalElement<T>[] = [];
    let conditionalClasses: ConditionalClass<T>[] = [];


    /**
     * Bind to a further element (DOM text is updated for it)
     * @param element - The element to add
     */
    const addAdditionalElement = ( element: HTMLElement ) => {
        elements.push( element );
    };

    /**
     * @returns The value the ref currently holds
     */
    const get = (): T => {
        return value;
    };


    /**
     * @param data - The new value of the
     */
    const set = ( data: T ): void => {
        value = data;

        // Update normal ref elements
        elements.forEach( el => {
            el.textContent = String( data );
        } );

        // Update conditional elements
        conditionalElements.forEach( el => {
            // convert to boolean (explicitly)
            el.element.hidden = !el.predicate( data );
        } );

        conditionalClasses.forEach( el => {
            // FIXME: Use add and remove!
            el.element.classList.value = el.predicate( data ) ? el.onTrue : el.onFalse;
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
        element.value = String( value );
        boundElements.push( element );
    };


    /**
     * Add elements to be rendered conditionally on this ref. Treats type as booleanish
     * @param element - The element that will be affected by predicate
     * @param predicate - The predicate to evaluate when value is changed
     */
    const addConditionalElementBind = ( element: HTMLElement, predicate: ( value: T ) => boolean ): void => {
        conditionalElements.push( {
            'element': element,
            'predicate': predicate
        } );
        element.hidden = !predicate( value );
    };

    const resetConditionalElementBinds = () => {
        conditionalElements = [];
    };


    /**
     * @param element - The element to do the operation on
     * @param predicate - The predicate to evaluate when value is changed
     * @param onTrue - The classes (as strings) to set if true(ish)
     * @param onFalse - The classes to set on false(ish)
     */
    const addConditionalClasses = (
        element: HTMLElement,
        predicate: ( value: T ) => boolean,
        onTrue: string,
        onFalse: string
    ) => {
        conditionalClasses.push( {
            'element': element,
            'onTrue': onTrue,
            'onFalse': onFalse,
            'predicate': predicate
        } );
    };

    const resetConditionalClasses = () => {
        conditionalClasses = [];
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
        addAdditionalElement,
        addConditionalElementBind,
        resetConditionalElementBinds,
        addConditionalClasses,
        resetConditionalClasses,
        bind,
        onChange
    };
};
