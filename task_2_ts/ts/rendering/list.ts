import {
    ListRef, RenderTemplate
} from './rendering';
import listRenderer from './list-renderer';

export const listRef = <T>( parent: HTMLElement, data: T[], name: string, template: RenderTemplate ): ListRef<T> => {
    if ( parent === null ) throw new Error( 'Parent is null!' );

    let list: T[] = data; // contains all values passed in

    const nodes: HTMLElement[] = [];
    const rendered: boolean[] = []; // Mask for
    const onChangeFunctions: ( () => Promise<void> )[] = [];

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
        parent.textContent = '';

        // Render the list based on template
        for ( let i = 0; i < data.length; i++ ) {
            const element = data[i]!;

            // Render list
            nodes[ i ] = listRenderer.renderList(
                element, template, name, i
            );
            rendered[ i ] = true;
            parent.appendChild( nodes[ i ]! );
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
                rendered[ index ] = false;
            } else if ( evaluation && !rendered[ index ] ) {
                currentIndexInChildrenList++;
                parent.insertBefore( nodes[ index ]!, children[ currentIndexInChildrenList ]! );
            } else {
                currentIndexInChildrenList++;
            }
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
        get,
        set,
        sort,
        filter,
        setTemplate,
        onChange
    };
};
