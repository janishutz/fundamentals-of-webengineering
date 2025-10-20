/*
 *                      fundamentals-of-webengineering - framework.ts
 *
 *    Created by Janis Hutz 10/20/2025, Licensed under the GPL V3 License
 *           https://janishutz.com, development@janishutz.com
 *
 *
*/
// Yes, I could not be arsed to keep track of state manually, so wrote a framework real quick that
// does that for me. I am well aware that this is well over engineered, but it was a lot of fun
// and no, this is *NOT* AI generated (I know Claude likes to hallucinate that kinda stuff)
// I will be trying to somewhat follow Vue naming here, as that is what I am familiar with
// (The only thing that is AI generated is the name of the little framework)
//
// It was also a nice exercise to get familiar with Generics in TypeScript, something I haven't
// really used before

import {
    ListRef, Ref, RenderTemplate
} from './rendering';
import listRenderer from './list-renderer';


/**
 * Responsive data (similar behaviour as in Vue.js)
 * @template T - The data type you wish to use (as long as you don't want it to be a list)
 * @param data - The data stored in this ref
 * @param elements - The elements to bind to
 */
export const ref = <T>( elements: HTMLElement[], data: T ): Ref<T> => {
    let value: T = data;
    let conditionalElements: HTMLElement[] = [];

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

    return {
        set,
        get,
        setConditionalElements,
        addConditionalClasses,
        bind
    };
};


// ───────────────────────────────────────────────────────────────────
//          ╭───────────────────────────────────────────────╮
//          │       List ref, dynamic list rendering        │
//          ╰───────────────────────────────────────────────╯
export const listRef = <T>( parent: HTMLElement, data: T[], name: string, template: RenderTemplate ): ListRef<T> => {
    let list: T[] = data; // contains all values passed in

    const nodes: HTMLElement[] = [];
    const rendered: boolean[] = []; // Mask for


    /**
     * @returns All currently rendered elements
     */
    const get = (): T[] => {
        return list.filter( ( _, index ) => {
            return rendered[ index ];
        } );
    };


    /**
     * Deletes all child nodes and recreates them based on the new data.
     * @param data - The new data to set
     */
    const set = ( data: T[] ): void => {
        // Yes, I know, really bad performance, etc, but it's not needed for any other use case
        // here, other than a full replace of the data (no dynamic updates)
        list = data;

        // Render the list based on template
        for ( let i = 0; i < data.length; i++ ) {
            const element = data[i]!;

            // Render list
            nodes[ i ] = listRenderer.renderList(
                element, template, name, i
            );
            rendered[ i ] = true;
        }
    };

    const setTemplate = ( newTemplate: RenderTemplate ): void => {
        template = newTemplate;
        set( data );
    };


    /**
     * Sort function, a wrapper for native JS's sort on arrays.
     * Will be more performant than doing a re-render by sorting and setting,
     * as it will sort in-place, instead of regenerating.
     * @param compare - The comparison function to use
     */
    const sort = ( compare: ( a: T, b: T ) => number ): void => {
        // Re-render based on compare function
        const children = [ ...parent.children ];

        children.sort( ( elA, elB ) => {
            // Need array index somehow on the element to make comparison easier for consumer
            const a = parseInt( elA.id.split( '--' )[1]! );
            const b = parseInt( elB.id.split( '--' )[1]! );

            // Coaxing the TypeScript compiler into believing this value will exist
            return compare( list[a]!, list[b]! );
        } );

        children.forEach( el => {
            parent.appendChild( el );
        } );
    };


    /**
     * Filter elements. More performant than doing it with set operation, as it is cheaper to reverse.
     * It also does not touch the nodes that are going to remain in DOM
     * @param predicate - Filtering predicate
     */
    const filter = ( predicate: ( value: T ) => boolean ): void => {
        let currentIndexInChildrenList = 0;

        const children = [ ...parent.children ];

        list.forEach( ( val, index ) => {
            const evaluation = predicate( val );

            if ( !evaluation && rendered[ index ] ) {
                // can use ! here, as semantics of program tell us that this index will exist
                nodes[ index ]!.remove();
            } else if ( evaluation && !rendered[ index ] ) {
                currentIndexInChildrenList++;
                parent.insertBefore( nodes[ index ]!, children[ currentIndexInChildrenList ]! );
            } else {
                currentIndexInChildrenList++;
            }
        } );
    };

    set( data );

    return {
        get,
        set,
        sort,
        filter,
        setTemplate
    };
};


export default {
    ref,
    listRef
};
