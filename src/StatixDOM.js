"use strict"

/**
 *	@typedef {(currItem: any) => string} StatixDOMGetKey
 *  ====================================================================================
 *	@typedef {(currItem: any, prevItem: any) => boolean} StatixDOMChildMustBeMutated
 *  ====================================================================================
 *	@typedef {(currItem: any, child: HTMLElement) => void} StatixDOMChangeChildCallback
 *  ====================================================================================
 *	@typedef {(currItem: any) => HTMLElement} StatixDOMCreateChildCallback
 *  ====================================================================================
 *	@typedef  {Object} StatixDOMMetadata
 *	Save some meta information for library optimization.
 *	@property {Object.<string, HTMLElement>} mListItemMap
 *	Used to optimize work with HTML lists.
 */

import {
	G_STATIX_DATASET_ID,
} from "../STRING.const.js";

import {
	StatixInvalidTypeOrInstance
} from "./StatixErrors.js";

import StatixDOMManipulation from "./StatixDOMManipulation.js";
import Statix from "./Statix.js";

import isString  from "./utils/isString.utils.js";
import isElement from "./utils/isElement.utils.js";

class StatixDOM {
	/**
	 *	@type {StatixDOMMetadata}
	 *	@private 
	 */
	#mMetadata = null;
	/**
	 *	@type {HTMLElement}
	 *	@private 
	 */
	#mRoot = null;
	/**
	 *	@type {Statix}
	 *	@private 
	 */
	#mStatix = null;
	/**
	 *	@param {Statix} statix 
	 */
	constructor(statix) {
		this.#mStatix = statix;
		this.#mMetadata = { mListItemMap: {}};
	}
	/**
	 *	Deletes all data, references and root element itself from DOM of this class instance.
	 *	@return {void}
	 */
	destructor() {
		this.#mStatix = null;
		this.#mMetadata = null;
	}
	/**
	 *	Sets root with an existing element that has the same `selector`.
	 *	@param   {string} selector
	 *	@returns {void}
	 */
	setRoot(selector) {
		if(!isString(selector)) {
			throw new StatixInvalidTypeOrInstance(typeof selector, "string", "selector");
		}

		this.#mRoot = document.querySelector(selector);
	}
	/**
	 *	Sets root element for processing.
	 *	@returns {StatixDOMManipulation}
	 */
	root() {
		return new StatixDOMManipulation(this.#mRoot, this.#mStatix);
	}
	/**
   *	If a string is passed, only the `create` function can be called. `create` function returns the created element.\
	 *  If an existing element is passed, you need to call `reset` function, the reset function resets only the internal state.
	 *	@returns {StatixDOMManipulation}
	 *	@example
	 *	const p = instance.element("p").text("Hello World!"); // Create new "p" element.
	 *
	 *	instance.element(p).text("New text!"); // Update text of "p" element.
	 */
	element(tagOrElement) {
		return new StatixDOMManipulation(isElement(tagOrElement) ? tagOrElement : document.createElement(tagOrElement), this.#mStatix);
	}
	/**
	 * 	Function for creating and modifying existing elements in the list, this function enables optimized work with HTML lists.
	 *	@param   {any[]} currArray
	 *	@param   {any[]} prevArray
	 *	@param   {StatixDOMGetKey} getKey 
	 *	@param   {StatixDOMChildMustBeMutated | null} childMustBeChangedCallback
	 *	@param   {StatixDOMChangeChildCallback} changeChildCallback
	 *	@param   {StatixDOMCreateChildCallback} createChildCallback
	 *	@returns {void}
	 */
	each(currArray, prevArray, getKey, childMustBeChangedCallback, changeChildCallback, createChildCallback) {
		const element = this.#mRoot;
		const statix = this.#mStatix;

		const length = currArray.length;
		const listMapCopy = {...this.#mMetadata.mListItemMap };

		let index = 0;

		while(index < length) {
			const currArrayItem = currArray[index];
			const prevArrayItem = prevArray[index];
			const child = element.childNodes[index];
			const key = getKey(currArrayItem);

			delete listMapCopy[key];

			if((currArrayItem && prevArrayItem && childMustBeChangedCallback) && 
			   (child?.dataset[G_STATIX_DATASET_ID] === key) && 
				 childMustBeChangedCallback(currArrayItem, prevArrayItem)) {
				changeChildCallback(statix, currArrayItem, child);
			} else if(key && !child) {
				const newChild = createChildCallback(statix, currArrayItem);
				
				this.#mMetadata.mListItemMap[key] = newChild;
				element.appendChild(newChild);
			}
			
			index++;
		}

		for(let key in listMapCopy) {
			listMapCopy[key].remove();
			delete this.#mMetadata.mListItemMap[key];
		}
	}
}

export default StatixDOM;