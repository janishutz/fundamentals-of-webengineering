import {
    RenderTemplate,
    StringIndexedObject
} from './rendering';

const renderList = <T extends StringIndexedObject>(
    data: T,
    template: RenderTemplate,
    name: string, id: number
): HTMLElement => {
    const parent = renderer( data, template );

    parent.id = `${ name }--${ id }`;

    return parent;
};

const renderer = <T extends StringIndexedObject>( data: T, template: RenderTemplate ): HTMLElement => {
    const parent = document.createElement( template.type );

    for ( let i = 0; i < template.cssClasses.length; i++ ) {
        console.log( 'Adding css class', template.cssClasses[i]! );
        parent.classList.add( template.cssClasses[i]! );
    }

    for ( let i = 0; i < template.children.length; i++ ) {
        const element = template.children[i]!;

        parent.appendChild( renderer( data, element ) );
    }

    if ( template.children.length === 0 ) {
        if ( template.attribute ) {
            parent.textContent = String( data[ template.attribute ] );
        } else {
            parent.textContent = String( data );
        }
    }

    return parent;
};

export default {
    renderList
};
