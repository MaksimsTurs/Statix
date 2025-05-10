"use strict"

/**
 *  @typedef  {Object} StatixMetadata
 * 	@property {[any, Object<string, StatixRenderer>][]} mSignals
 *  ===========================================================================================
 *  @typedef  {(curr: any) => any} StatixSetNewValueOrCallback
 *  ===========================================================================================
 *  @typedef  {(instance: Statix, curr: any) => any} StatixRenderer
 *  ===========================================================================================
 * 	@typedef  {() => any} StatixSignalValue
 *  ===========================================================================================
 * 	@typedef  {(newValueOrCallback: StatixSetNewValueOrCallback) => any} StatixSignalSet
 *  ===========================================================================================
 * 	@typedef  {(renderer: StatixRenderer) => any} StatixSignalSubscribe
 *  ===========================================================================================
 * 	@typedef  {(renderer: StatixRenderer) => any} StatixSignalUnsubscribe
 *  ===========================================================================================
 *	@typedef  {Object} StatixSignal
 *	@property {StatixSignalValue} val
 *	@property {StatixSignalSet} set
 *	@property {StatixSignalSubscribe} subscribe
 *	@property {StatixSignalUnsubscribe} unsubscribe 
 */

import StatixDOM from "./StatixDOM.js";

import isElement from "./utils/isElement.utils.js";

import { 
	signal__val__,
	signal__set__,
	signal__subscribe__,
	signal__unsubscribe__
} from "./utils/precompiled.utils.js";

/**
 *	Library for optimized and easy work with DOM elements 
 *	and DOM manipulation, this library allows you to make 
 *	your static HTML more interactive with dynamic JS.
 */
class Statix {
  /**
	 *	 @type {StatixCache | null}
	 *	 @private 
	 */
	#mCache = null;
  /**
	 *	 @type {StatixDOM | null} 
	 *	 @constant
	 */
	#mStatixDOM = null;
  /**
   *	 @type {StatixMetadata}
	 *	 @private
   */
	#mMetadata = null;
  /**
	 *  @returns {Statix}
	 */
	constructor() {
		this.#mStatixDOM = new StatixDOM(this);
		this.#mCache = {};
		this.#mMetadata = { mSignals: [] };
	}
	/**
	 *	 Completely remove the data of the class instance.
	 *	 @return {void}
	 */
	destructor() {
		this.#mStatixDOM.destructor();

		this.#mStatixDOM = null;
		this.#mCache = null;

		this.#mMetadata = null;
		this.#mMetadata.mSignals = null;
	}
	/**
	 *	Returns instance of StatixDOM instance, StatixDOM is automaticaly created by calling Statix constructor.
	 *	@returns {StatixDOM} 
	 */
	getStatixDOM() {
		return this.#mStatixDOM;
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
	 *	@param {StatixSignal} signal
	 *  @param {StatixSignalShareTarget} target
	 *  @returns {}
	 */
	shareSignalToEvent(signal, target) {
		return target.bind(null, signal);
	}
	/**
	 *  @returns {void}
	 */
	signal(initValue) {
		this.#mMetadata.mSignals.push([initValue, {}]);
		
		const signalId = this.#mMetadata.mSignals.length - 1;
		const signalData = this.#mMetadata.mSignals[signalId];
		
		const val = () => signal__val__(signalData[0]);

		const set = (newValueOrCallback) => signal__set__(newValueOrCallback, signalData, this);

		const subscribe = (renderer) => signal__subscribe__(signalData[1], renderer);

		const unsubscribe = (rendererToUnsubscribe) => signal__unsubscribe__(signalData[1], rendererToUnsubscribe);

		return { val, set, subscribe, unsubscribe };
	}
	/**
	 *	@param {string} key
	 *	@param {any} data 
	 */
	setCache(key, data) {
		if(isElement(data)) {
			this.#mCache[key] = data.cloneNode(true);
		} else {
			this.#mCache[key] = data;
		}
	}
}

export default Statix;