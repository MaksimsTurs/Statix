import Statix from "./src/Statix.js";

//====================Statix instance field types====================//

/**
 *	@typedef  {Object} StatixMetadata
 *	@property {number} mRenderPhase 
 *	Our programm have three different render phases `mount`, `unmount` and `update`, every of this render
 *	phases have their own function that will be called only in their render phase.
 *	@property {any[]} mSetStateLastValue
 *	This field is used to store data that will be saved in instance state after `onMount` (if `setState` 
 *	was called in `onMount`) and called `onUpdate` again.
 */

/**
 *	@typedef {any} StatixState
 *	User defined state for class instance data that will be used for element rendering.
 */

 /**
 *	@typedef {(instance: Statix, state: StatixState) => void} StatixOnMount
 *	Function that is called every time the element is mounted to the DOM.
 */

/**
 *	@typedef {(instance: Statix, state: StatixState) => void} StatixOnUnmount
 *	Function that is called every time the element is removed from the DOM. 
 */

/**
 *	@typedef {(instance: Statix, state: StatixState) => void} StatixOnUpdate
 *	Function that is called after each state changes. To trigger the state change you need to pass
 *  either new primitive value or new reference.  
 */

/**
 *	@typedef {Object<string, any>} StatixCache
 *	Cache object that save any data of current class instance.
 */

 /**
 *	@typedef  {Object} StatixConstructorParam
 *	@property {any} $init
 *	Init value of the class instance state.  
 */

//====================Statix instance field types====================//
//====================Statix Method types====================//

/**
 *	@typedef {StatixState | ((currentState: StatixState) => StatixState)} StatixNewStateOrCallback
 *	Function that will be change the state or some new value of state and call render function. 
 */

//====================Statix Method types====================//
//====================Statix Utils functions types====================//

/**
 *	@typedef {(...any) => any} StatixDelayCallback
 *	Function that will be executed after some delay. 
 */

//====================Statix Utils functions types====================//
//====================StatixDOM instance filed types====================//

/**
 *	@typedef  {Object} StatixDOMMetadata
 *	Save some meta information for library optimization.
 *	@property {Object.<GlobalEventHandlersEventMap, [EventListenerOrEventListenerObject, AddEventListenerOptions]>} mEventListeners
 *	Save listeners to the track object, this data will be used in the future for removing event listener.
 *	@property {Object.<string, HTMLElement>} mListItemMap
 *	Used to optimize work with HTML lists.
 */

/**
 *	@typedef {(currItem: any) => string} StatixDOMGetKey
 */

/**
 *	@typedef {(currItem: any, prevItem: any) => boolean} StatixDOMIsChildMustBeMutated
 */

/**
 *	@typedef {(currItem: any, child: HTMLElement) => void} StatixDOMChangeChildCallback
 */

/**
 *	@typedef {(currItem: any) => HTMLElement} StatixDOMCreateChildCallback
 */

export {};