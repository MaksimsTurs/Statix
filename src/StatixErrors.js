import isFunction from "./utils/isFunction.utils.js";
import isObject from "./utils/isObject.utils.js";

class StatixInvalidTypeOrInstance extends Error {
	/**
	 *	@param {any} currObject
	 *	@param {any} mustBe
	 *	@param {string} were 
	 */
	constructor(currObject, mustBe, were) {
		super();

		this.name = "[Statix]";

		if(isFunction(mustBe)) {
			mustBe = mustBe.name;
		}

		if(isObject(currObject)) {
			currObject = currObject.toString().replace(/\[object (.*)\]/, "$1");
		}

		this.message = `"${were}" must be type of or instance of "${mustBe}" but is "${currObject}"!`;
	}
}

class StatixInvalidRendererName extends Error {
	/**
	 *	@param {string} name 
	 */
	constructor(name) {
		super();

		this.name = "[Statix]";
		this.message = `Invalid renderer name "${name}"!`;
	}
}

class StatixInvalidArgumentsLength extends Error {
	/**
	 *	@param {number} isLength
	 *	@param {number} mustBeLength
	 *	@param {string} functionName 
	 */
	constructor(isLength, mustBeLength, functionName) {
		super();

		this.name = "[Statix]";
		this.message = `Invalid function "${functionName}" arguments length, must be ${mustBeLength} is "${isLength}"!`;
	}
}

export { 
	StatixInvalidTypeOrInstance,
	StatixInvalidRendererName,
	StatixInvalidArgumentsLength
};