"use strict"

/**
 *	@import {
 *		StatixDOMMetadata,
 *		StatixDOMGetKey,
 *	  StatixDOMIsChildMustBeMutated,
 *		StatixDOMChangeChildCallback,
 *		StatixDOMCreateChildCallback
 * 	} from "../types.js"; 
 */

import {
	G_DATASET_LIST_KEY,
} from "../STRING.const.js";

import {
	StatixInvalidTypeOrInstance
} from "./StatixErrors.js"

import statix from "./statix.core.js";

import isString  from "./utils/isString.utils.js";
import isElement from "./utils/isElement.utils.js";

import addUnwritableField from "./utils/addUnwritableField.utils.js";

class StatixDOM {
	/**
	 * 	@type {HTMLElement[] | null}
	 *	@private 
	 */
	#mElements = null;
	/**
	 *	@type {number} 
	 *	@private
	 */
	#mElementsIndex = null;
	/**
	 *	@type {StatixDOMMetadata}
	 *	@private 
	 */
	#mMetadata = null;
	/**
	 *	@type {statix.Statix}
	 *	@private 
	 */
	#mStatixInstance = null;
	/**
	 *	@type {HTMLElement | null}
	 *	@private
	 */
	#mProcessedElementCopy = null;

	constructor() {
		this.#mElements = [];
		this.#mElementsIndex = -1;
		this.#mMetadata = { mListeners: {}, mListItemMap: {}};
	}
	/**
	 *	Deletes all data, references and root element itself from DOM of this class instance.
	 *	@return {void}
	 */
	destructor() {
		this.__mRoot__.remove();
		this.#mElementsIndex = null;
		this.#mElements = null;
		this.#mMetadata = null;
		this.#mStatixInstance = null;
	}
	/**
	 *	Sets root element for processing.
	 *	@returns {StatixDOM}
	 */
	root() {
		this.#mElementsIndex++;
		this.#mElements[this.#mElementsIndex] = this.__mRoot__;
		this.#mProcessedElementCopy = this.__mRoot__;

		return this;
	}
	/**
   *	If a string is passed, only the `create` function can be called. `create` function returns the created element.\
	 *  If an existing element is passed, you need to call `reset` function, the reset function resets only the internal state.
	 *	@returns {StatixDOM}
	 *	@example
	 *	const p = instance.element("p").text("Hello World!").create(); // Create new "p" element.
	 *
	 *	instance.element(p).text("New text!").reset(); // Update text of "p" element.
	 */
	element(tagOrElement) {
		this.#mElementsIndex++;

		if(isElement(tagOrElement)) {
			this.#mElements[this.#mElementsIndex] = tagOrElement;
		} else {
			this.#mElements[this.#mElementsIndex] = document.createElement(tagOrElement);
		}

		this.#mProcessedElementCopy = this.#mElements[this.#mElementsIndex];

		return this;
	}
	/**
	 *	Sets root with an existing element that has the same `selector`.
	 *	@param   {string} selector
	 *	@returns {void}
	 */
	setRootBySelector(selector) {
		if(!isString(selector)) {
			throw new StatixInvalidTypeOrInstance(typeof selector, "string", "selector");
		}

		addUnwritableField(this, "__mRoot__", document.querySelector(selector));
	}
	/**
	 *	Sets root with an element that was created with js.
	 *	@param   {HTMLElement} element
	 *	@returns {void}
	 */
	setRootByElement(element) {
		if(!isElement(element)) {
			throw new StatixInvalidTypeOrInstance(element, HTMLElement, "element");
		}

		addUnwritableField(this, "__mRoot__", element);
	}
	/**
	 *	Returns a created element.
	 *	@returns {HTMLElement}
	 */
	create() {
		const element = this.#mElements[this.#mElementsIndex];
				
		if(this.#mElementsIndex === 0) {
			this.#mElements = [];
		}
		
		this.#mElementsIndex--;

		return element;
	}
	/**
	 *	Reset the internal state.
	 *	@returns {void}
	 */
	reset() {
		this.#mElementsIndex--;
		this.#mElements = [];
	}
	/**
	 *	@param   {string} text
	 *	@returns {StatixDOM} 
	 */
	text(text) {
		this.#mElements[this.#mElementsIndex].textContent = text;

		return this;
	}
	/**
	 *	@param   {string} key
	 *	@param   {string} value
	 *	@returns {StatixDOM} 
	 */
	style(key, value) {
		this.#mElements[this.#mElementsIndex].style[key] = value;

		return this;
	}
	/**
	 *	@param   {string} key
	 *	@param   {string} value
	 *	@returns {StatixDOM} 
	 */
	dataset(key, value) {
		this.#mElements[this.#mElementsIndex].dataset[key] = value; 

		return this;
	}
	/**
	 *	@returns {HTMLElement | undefined}
	 */
	getParent() {
		return this.#mElements[this.#mElementsIndex].parentNode;
	}
	/**
	 *	@param   {string} className
	 *	@returns {StatixDOM} 
	 */
	addClass(className) {
		this.#mElements[this.#mElementsIndex].className = `${this.#mElements[this.#mElementsIndex].className} ${className}`;
		
		return this;
	}
	/**
	 *	@param   {HTMLElement[]} childs
	 *	@returns {StatixDOM} 
	 */
	addChilds(childs) {
		const fragment = document.createDocumentFragment();

		let index = 0;
		let length = childs.length;

		while(index < length) {
			fragment.appendChild(childs[index]);
			index++;
		}
		
		this.#mElements[this.#mElementsIndex].append(fragment);

		return this;
	}
	/**
	 *	@param   {GlobalEventHandlersEventMap} type
	 *	@param   {EventListenerOrEventListenerObject} callback
	 *	@param   {AddEventListenerOptions} options
	 *	@returns {StatixDOM} 
	 */
	addEvent(type, callback, options) {
		const bindedCallback = callback.bind(null, this.__mStatix__);
		
		this.#mMetadata.mListeners[type] = [bindedCallback, options];
		this.#mElements[this.#mElementsIndex].addEventListener(type, bindedCallback, options);

		return this;
	}
	/**
	 *	@param   {string} className
	 *	@returns {StatixDOM} 
	 */
	removeClass(className) {
		this.#mElements[this.#mElementsIndex].classList.remove(className);

		return this;
	}
	/**
	 *	@param   {string} type
	 *	@returns {StatixDOM} 
	 */
	removeEvent(type) {
		this.#mElements[this.#mElementsIndex].removeEventListeners(type, this.#mMetadata.mListeners[type][0], this.#mMetadata.mListeners[type][1]);
		this.#mMetadata.mListeners[type] = null;

		return this;
	}
	/**
	 *	@returns {StatixDOM} 
	 */
	remove() {
		this.#mElements[this.#mElementsIndex].remove();

		return this;
	}
	/**
	 * 	@param   {number[]} awayIndexes
	 *	@returns {StatixDOM} 
	 */
	childAt(awayIndexes) {
		this.#mElements[this.#mElementsIndex] = this.#mProcessedElementCopy;

		let index = 0;
		let length = awayIndexes.length;

		while(index < length) {
			this.#mElements[this.#mElementsIndex] = this.#mElements[this.#mElementsIndex].childNodes[awayIndexes[index]];
			index++;
		}

		return this;
	}
	/**
	 * 	Function for creating and modifying existing elements in the list, this function enables optimized work with HTML lists.
	 *	@param   {any[]} currArray
	 *	@param   {any[]} prevArray
	 *	@param   {StatixDOMGetKey} getKey 
	 *	@param   {StatixDOMIsChildMustBeMutated | null} isChildMustBeChangedCallback
	 *	@param   {StatixDOMChangeChildCallback} changeChildCallback
	 *	@param   {StatixDOMCreateChildCallback} createChildCallback
	 *	@returns {void}
	 */
	each(currArray, prevArray, getKey, isChildMustBeChangedCallback, changeChildCallback, createChildCallback) {
		const element = this.__mRoot__;
		const statix = this.__mStatix__;

		const length = element.childElementCount > currArray.length ? element.childElementCount : currArray.length;
		const listMapCopy = new Map(this.#mMetadata.mListMap);

		let index = 0;

		while(index < length) {
			const currArrayItem = currArray[index];
			const prevArrayItem = prevArray[index];
			const child = element.childNodes[index];
			const key = getKey(currArrayItem);

			delete listMapCopy[key];

			if((currArrayItem && prevArrayItem && isChildMustBeChangedCallback) && 
			   (child?.dataset[G_DATASET_LIST_KEY] === key) && 
				 isChildMustBeChangedCallback(currArrayItem, prevArrayItem)) {
				changeChildCallback(currArrayItem, child);
			} else if(key && !element.childNodes[index]) {
				const child = createChildCallback(statix, currArrayItem);
				
				this.#mMetadata.mListItemMap[key] = child;
				element.appendChild(child);
			}
			
			index++;
		}

		for(let data of listMapCopy) {
			delete this.#mMetadata.mListItemMap[data[0]];
			data[1].remove();
		}
	}
}

export default StatixDOM;