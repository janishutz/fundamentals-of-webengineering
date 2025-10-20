
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
    listRef
} from './list';
import {
    ref
} from './primitives';

export {
    listRef,
    ref
};

export default {
    ref,
    listRef
};
