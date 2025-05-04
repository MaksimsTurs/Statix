import {
	G_ERROR_NAME
} from "../STRING.const.js";

import isFunction from "./utils/isFunction.utils.js";
import isObject from "./utils/isObject.utils.js";

import getRenderPhaseName from "./utils/getRenderPhaseName.utils.js";
import getOperationName from "./utils/getOperationName.utils.js";

class StatixInvalidSetStateCall extends Error {
	constructor(renderPhaseId) {
		super();

		this.name = G_ERROR_NAME;
		this.message = `You can not call "setState" in "${getRenderPhaseName(renderPhaseId)}" phase!`;
	}
}

class StatixInvalidTypeOrInstance extends Error {
	constructor(typeOrObject, mustBe, were) {
		super();

		this.name = G_ERROR_NAME;

		if(isFunction(mustBe)) {
			mustBe = mustBe.name;
		}

		if(isObject(typeOrObject)) {
			typeOrObject = typeOrObject.toString().replace(/\[object (.*)\]/, "$1");
		}

		this.message = `"${were}" must be type of or instance of "${mustBe}" but is "${typeOrObject}"!`;
	}
}

class StatixInvalidOperationAndAttribute extends Error {
	constructor(operationId, attribute) {
		super();

		this.name = G_ERROR_NAME;
		this.message = `Attribute or DOM manipulation "${attribute}" can not be applyed in operation "${getOperationName(operationId)}"`;
	}
}

export { 
	StatixInvalidOperationAndAttribute,
	StatixInvalidTypeOrInstance,
	StatixInvalidSetStateCall
};