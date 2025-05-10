"use strict"

/**
 *	@typedef  {Object} StatixDOMManipulationMetadata
 *	@property {Object<string, [EventListenerOrEventListenerObject, AddEventListenerOptions]>} mEventListeners
 */

import Statix from "./Statix.js";

import isElement from "./utils/isElement.utils.js";
import isStatix from "./utils/isStatix.utils.js";

import {
	StatixInvalidTypeOrInstance
} from "./StatixErrors.js";

/**
 *	Part of the Statix ​​library that enables memory-friendly modification of existing and newly created elements.
 */
class StatixDOMManipulation {
	/**
	 *  @type {Statix}
	 *  @private
	 */
	#mStatix = null;
	/**
	 *  @type {StatixDOMManipulationMetadata}
	 *  @private 
	 */
	#mMetadata = null;
	/**
	 *  DON'T USE THIS!
	 *  @type {HTMLElement}
	 *  @private
	 */
	__mElement__ = null;
	/**
	 *  DON'T USE THIS!
	 *  @type {HTMLElement}
	 *  @private
	 */
	__mElementCopy__ = null;
	/**
	 *	@param {HTMLElement} element
	 *	@param {Statix} statix
	 */
	constructor(element, statix) {
		if(!isElement(element)) {
			throw new StatixInvalidTypeOrInstance(element, HTMLElement, "element");
		}

		if(!isStatix(statix)) {
			throw new StatixInvalidTypeOrInstance(element, Statix, "statix");
		}

		this.#mStatix = statix;
		this.#mMetadata = { mEventListeners: {}};

		this.__mElement__ = element;
		this.__mElementCopy__ = element;
	}
	/**
	 *	Deletes all instance data.
	 *	@return {void}
	 */
	destructor() {
		this.__mElement__?.remove();

		this.#mMetadata = null;
		this.#mStatix = null;

		this.__mElement__ = null;
		this.__mElementCopy__ = null;
	}
 /**
	*  Saves the element at a specified depth.\
	*	 This saved element can be modified later with other functions.\
	*	 If the second parameter is "false" the search starts from the currently saved element.
	*	 @param   {number[]} deep
	*	 @param   {boolean} fromRoot
	*	 @returns {StatixDOMManipulation} 
	*	 @example
	*	 // HTML
	*	 <section id="section">
	*	 	 <p>Paragraph</p>
	*		 <button>Submit</button>
	*	 </section>
	*  // JS
	*	 instance.root().childAt([0]) // <p>Paragraph</p>
	*	 instance.root().childAt([1]) // <button>Submit</button>
	*/
	childAt(deep, fromRoot = true) {
		if(!!fromRoot) {
			this.__mElement__ = this.__mElementCopy__;
		}

		let index = 0;
		let length = deep.length;

		while(index < length) {
			this.__mElement__ = this.__mElement__.childNodes[deep[index]];
			index++;
		}

		return this;
	}
	/**
	 *	@param   {string} text
	 *	@returns {StatixDOMManipulation} 
	 */
	text(text) {
		this.__mElement__.textContent = text;

		return this;
	}
	/**
	 * 	@param   {any[]} styles
	 *	@returns {StatixDOMManipulation} 
	 */
	style(styles) {
		for(let styleKey in styles) {
			this.__mElement__.style[styleKey] = styles[styleKey];
		}

		return this;
	}
	/**
	 * 	@param   {any[]} datasets
	 *	@returns {StatixDOMManipulation} 
	 */
	dataset(datasets) {
		for(let datasetsKey in datasets) {
			this.__mElement__.dataset[datasetsKey] = datasets[datasetsKey]; 
		}

		return this;
	}
	/**
	 *	@param   {string} selector
	 *	@returns {StatixDOMManipulation} 
	 */
	query(selector) {
		this.__mElement__ = this.__mElement__.querySelector(selector);

		return this;
	}
	/**
	 *  @param {boolean | undefined} preventScroll
	 *	@returns {StatixDOMManipulation} 
	 */
	focus(preventScroll) {
		this.__mElement__?.focus({ preventScroll });

		return this;
	}
	/**
	 *	@returns {StatixDOMManipulation} 
	 */
	remove() {
		this.__mElement__?.remove();

		return this;
	}
	/**
	 *  Insert new CSS class only when class was passed.
	 *  @param   {string} className
	 *  @returns {StatixDOMManipulation} 
	 */
	addClass(className) {
		if(className) {
			this.__mElement__.className = `${this.__mElement__.className} ${className}`;
		}

		return this;
	}
	/**
	 *  Adding the event to the element and save him, this event can be removed.\
	 *  Additionally adds instance of statix ​​to be able to use its functionality like cache and statixDOM.
	 *  @param   {keyof GlobalEventHandlersEventMap} type
	 *  @param   {EventListenerOrEventListenerObject} callback
	 *  @param   {AddEventListenerOptions} options
	 *  @returns {StatixDOMManipulation} 
	 */
	addEvent(type, callback, options) {
		if(type && callback) {
			const bindedCallback = callback.bind(null, this.#mStatix);

			this.#mMetadata.mEventListeners[type] = [bindedCallback, options];
			this.__mElement__?.addEventListener(type, bindedCallback, options);
		}

		return this;
	}
	/**
	 *	@param   {(StatixDOMManipulation | HTMLElement)[]} childs
	 *	@returns {StatixDOMManipulation} 
	 */
	addChilds(childs) {
		const fragment = document.createDocumentFragment();

		let index = 0;
		let length = childs.length;

		while(index < length) {
			if(childs[index] instanceof StatixDOMManipulation) {
				fragment.appendChild(childs[index].__mElement__);
			} else {
				fragment.appendChild(childs[index]);
			}
					
			index++;
		}
			
		this.__mElement__?.append(fragment);

		return this;
	}
	/**
	 *	@param   {string} className
	 *	@returns {StatixDOMManipulation} 
	 */
	 removeClass(className) {
		this.__mElement__.classList?.remove(className);

		return this;
	}
	/**
	 *	@param   {string} type
	 *	@returns {StatixDOMManipulation} 
	 */
	removeEvent(type) {
		this.__mElement__?.removeEventListeners(type, this.#mMetadata.mEventListeners[type][0], this.#mMetadata.mEventListeners[type][1]);
		delete this.#mMetadata.mEventListeners[type];

		return this;
	}
	/**
	 *  Set multiple attributes.
	 *	@param   {any[]} attributes 
	 *	@returns {void}
	 */
	setAttr(attributes) {
		let index = 0;
		let length = attributes.length;
	
		while(index < length) {
			attributes = attributes[index];
	
			for(let attributeKey in attributes) {
				this.__mElement__.setAttribute(attributeKey, attributes[attributeKey]);
			}
	
			index++;
		}

		return this;
	}
	/**
	 *	@returns {HTMLElement | undefined}
	 */
	getParent() {
		return this.__mElement__.parentNode;
	}
};

export default StatixDOMManipulation;