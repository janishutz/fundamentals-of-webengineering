export interface Ref<T> {
    'set': ( data: T ) => void;
    'get': () => T;
    'setConditionalElements': ( elements: HTMLElement[] ) => void;
    'addConditionalClasses': ( element: HTMLElement, onTrue: string, onFalse: string ) => void;
    'bind': ( element: HTMLInputElement, castFunction: ( val: string ) => T ) => void;
}

export interface ListRef<T> {
    'set': ( data: T[] ) => void;
    'get': () => T[];
    'sort': ( compare: ( a: T, b: T ) => number ) => void;
    'filter': ( predicate: ( value: T ) => boolean ) => void;
    'setTemplate': ( newTemplate: RenderTemplate ) => void;
}

export type HTMLTagNames = keyof HTMLElementTagNameMap;

export interface RenderTemplate {
    /**
     * What kind of element to render. Not all HTML elements supported (couldn't be arsed to do it)
     */
    'type': HTMLTagNames;

    /**
     * The attribute of the element to render. Leave blank if type is not object
     * Will be ignored if you also set children. If no children or attribute set,
     * will simply treat type as string and render accordingly
     */
    'attribute'?: string;

    /**
     * Children to render. Can be used to nest
     */
    'children': RenderTemplate[];

    /**
     * CSS classes to append to the element
     */
    'cssClasses': string[];
}


export interface StringIndexedObject {
    [key: string]: unknown
}
