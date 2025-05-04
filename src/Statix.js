"use strict"

/**
 *	@import { 
 *		StatixMetadata,
 *		StatixState,
 * 		StatixOnMount,
 * 		StatixOnUnmount,
 * 		StatixOnUpdate,
 * 		StatixCache
 *		StatixNewStateOrCallback,
 *		StatixConstructorParam
 *	} from "../types.js"; 
 */

import {
	G_RENDER_PHASE_IDS
} from "../NUMBER.const.js";

import { 
	StatixInvalidSetStateCall,
	StatixInvalidTypeOrInstance 
} from "./StatixErrors.js";

import StatixDOM from "./StatixDOM.js";

import addUnwritableField from "./utils/addUnwritableField.utils.js";

import isString from "./utils/isString.utils.js";
import isElement from "./utils/isElement.utils.js";
import isFunction from "./utils/isFunction.utils.js";

/**
 *	Library for optimized and easy work with DOM elements 
 *	and DOM manipulation, this library allows you to make 
 *	your static HTML more interactive with dynamic JS.
 */
class Statix {
	/**
	 *	@type {StatixMetadata | null}
	 *	@private
	 */
	#mMetadata  = null;
	/**
	 *	@type {StatixState | null}
	 *	@private 
	 */
	#mState = null;
	/**
	 *	@type {StatixOnMount | null}
	 *	@private 
	 */
	#mOnMount = null;
	/**
	 *	@type {StatixOnUnmount | null}
	 *	@private 
	 */
	#mOnUnmount = null;
	/**
	 *	@type {StatixOnUpdate | null}
	 *	@private 
	 */
	#mOnUpdate = null;
	/**
	 *	@type {StatixCache | null}
	 *	@private 
	 */
	#mCache = null;
	/**
	 *	@type {StatixDOM | null} 
	 *	@constant
	 */
	 #mStatixDOM = null;
	/**
	 *	@param {StatixConstructorParam | undefined} state
	 */	
	constructor(state) {
		this.#mStatixDOM = new StatixDOM();
		this.#mState = state?.$init;
		this.#mCache = {};
		this.#mMetadata = {	mRenderPhase: G_RENDER_PHASE_IDS.IDLE, mSetStateLastValue: [] };

		addUnwritableField(this.#mStatixDOM, "__mStatix__", this);
	}
	/**
	 *	Completely remove the data of the class instance.
	 *	@return {void}
	 */
	destructor() {
		this.#mStatixDOM.destructor();
		this.#mStatixDOM = null;
		this.#mState = null;
		this.#mOnUpdate = null;
		this.#mOnUnmount = null;
		this.#mOnMount = null;
		this.#mMetadata = null;
		this.#mCache = null;
	}
	/**
	 *	Returns instance of StatixDOM instance, StatixDOM is automaticaly created by calling Statix constructor.
	 *	@returns {StatixDOM} 
	 */
	getStatixDOM() {
		return this.#mStatixDOM;
	}
	/**
	 *	Return current state. 
	 *	@returns {StatixState}
	 */
	getState() {
		return this.#mState;
	}
	/**
	 *	Returns a cached value or undefined, when value is a element, returns deep cloned of them.
	 *	@param   {string} key
	 *	@returns {any | undefined}
	 */
	getCache(key) {
		const data = this.#mCache[key];

		if(isElement(data)) {
			return data.cloneNode(true);
		}

		return data;
	}
	/**
	 *	Update state and call `onUpdate` function when references or values of current 
	 *	state and new state are not equal. When calling this function from the `onMount`, state will
	 *	be changed after `onMount` function executed.
	 *	@param   {StatixNewStateOrCallback} newStateOrCallback
	 *	@returns {void}
	 *	@example
	 *	instance.setState(5); // cause onUpdate call.
	 *	instance.setState(5); // doesn't cause onUpdate call. 
	 */
	setState(newStateOrCallback) {
		if(this.#mMetadata.mRenderPhase === G_RENDER_PHASE_IDS.IDLE) {
			this.#mMetadata.mRenderPhase = G_RENDER_PHASE_IDS.UPDATE;
	
			let tmpState = this.#mState;
	
			if(isFunction(newStateOrCallback)) {
				tmpState = newStateOrCallback(tmpState);
			} else {
				tmpState = newStateOrCallback;
			}
	
			if(!Object.is(tmpState, this.#mState)) {
				this.#mOnUpdate(this, tmpState, this.#mState);
				this.#mState = tmpState;
			}

			this.#mMetadata.mRenderPhase = G_RENDER_PHASE_IDS.IDLE;
		} else if(this.#mMetadata.mRenderPhase === G_RENDER_PHASE_IDS.MOUNT) {
			this.#mMetadata.mSetStateLastValue = [newStateOrCallback];
		} else if((this.#mMetadata.mRenderPhase === G_RENDER_PHASE_IDS.UNMOUNT)
							(this.#mMetadata.mRenderPhase === G_RENDER_PHASE_IDS.UPDATE)) {
			throw new StatixInvalidSetStateCall(this.#mMetadata.mRenderPhase);
		}
	}
	/**
	 *	Save data in the cache under passed key, when data ist HTML Element create deep clone of them.
	 *	@param   {string} key
	 *	@param   {any} data
	 *	@returns {void}
	 */
	setCache(key, data) {
		if(isElement(data)) {
			this.#mCache[key] = data.cloneNode(true);
		} else {
			this.#mCache[key] = data;
		}
	}
	/**
	 *	@param   {StatixOnMount} onMountCallback
	 *	@returns {void}
	 */
	onMount(onMountCallback) {
		if(!isFunction(onMountCallback)) {
			throw new StatixInvalidTypeOrInstance(typeof onMountCallback, "function", "onMountCallback");
		}

		this.#mOnMount = onMountCallback;
	}
	/**
	 *	@param   {StatixOnUpdate} onUpdateCallback
	 *	@returns {void}
	 */
	onUpdate(onUpdateCallback) {
		if(!isFunction(onUpdateCallback)) {
			throw new StatixInvalidTypeOrInstance(typeof onUpdateCallback, "function", "onUpdateCallback");
		}

		this.#mOnUpdate = onUpdateCallback;
	}
	/**
	 *	@param   {StatixOnUnmount} onUnmountCallback
	 *	@returns {void}
	 */
	onUnmount(onUnmountCallback) {
		if(!isFunction(onUnmountCallback)) {
			throw new StatixInvalidTypeOrInstance(typeof onUnmountCallback, "function", "onUnmountCallback");
		}

		this.#mOnUnmount = onUnmountCallback;
	}
	/**
	 *	Mount a element to the another element with passed selector, the element will be passed only when
	 * 	he doesn't have a parent node.
	 *	@param   {string} mountIn
	 *	@returns {void}
	 */
	mount(mountIn) {
		if(!isString(mountIn)) {
			throw new StatixInvalidTypeOrInstance(typeof mountIn, "string", "mountIn");
		}

		const element = this.#mStatixDOM.__mRoot__;

		if(!this.#mStatixDOM.getParent()) {
			this.#mMetadata.mRenderPhase = G_RENDER_PHASE_IDS.MOUNT;

			if(mountIn[0] === ".") {
				document.querySelector(mountIn).appendChild(element);
			} else {
				document.getElementById(mountIn).appendChild(element);
			}

			this.#mOnMount?.(this, this.#mState);
			this.#mMetadata.mRenderPhase = G_RENDER_PHASE_IDS.IDLE;

			if(this.#mMetadata.mSetStateLastValue?.length === 1) {
				this.setState(this.#mMetadata.mSetStateLastValue[0]);
			}
		}
	}
	/**
	 * 	Remove the element from the DOM.
	 *	@returns {void} 
	 */
	unmount() {
		if(this.#mStatixDOM.getParent()) {
			this.#mMetadata.mRenderPhase = G_RENDER_PHASE_IDS.UNMOUNT;
			this.#mOnUnmount(this);
			this.#mMetadata = {	mRenderPhase: G_RENDER_PHASE_IDS.IDLE, mSetStateLastValue: null };
			this.#mStatixDOM.root().remove().reset();
		}
	}
}

export default Statix;