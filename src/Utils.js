"use strict"

/**
 *	@import {
 *		StatixDelayCallback,
 *	} from "../types.js"; 
 */

const Utils = {
	/**
	 *	@returns {string} 
	 */
	generateRandomValue: function() {
		let string = "";
		
		const ASCII = "!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~";
	
		string += (~~(Math.random() * 100)).toString(16);
		string += ASCII[~~(Math.random() * ASCII.length)];
		
		string += (~~(Math.random() * 100)).toString(16);
		string += ASCII[~~(Math.random() * ASCII.length)];
		
		string += (~~(Math.random() * 100)).toString(16);
		string += ASCII[~~(Math.random() * ASCII.length)];

		string += (~~(Math.random() * 100)).toString(16);
		string += ASCII[~~(Math.random() * ASCII.length)];
	
		return string;
	},
  /**
	 *	@param  {StatixDelayCallback} callback
	 *	@param  {number} 							delay
	 *	@return {StatixDelayCallback}
	 */
	debounce(callback, delay) {
		let timerId = 0;

		return function(...args) {
			clearTimeout(timerId);
			timerId = setTimeout(() => callback(...args), delay);
		}
	},
  /**
	 *	@param  {StatixDelayCallback} callback
	 *	@param  {number} 							delay
	 *	@return {StatixDelayCallback}
	 */
	throttle(callback, delay) {
		let timerId = null;

		return function(...args) {
			if(!timerId) {
				callback(...args);
				timerId = setTimeout(() => {
					timerId = null;
				}, delay);
			}
		}
	}
}

export default Utils;