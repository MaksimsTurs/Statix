import isFunction from "./isFunction.utils.js";

import { StatixInvalidArgumentsLength, StatixInvalidRendererName } from "../StatixErrors.js";

export function signal__val__(val) {
	return val;
}

export function signal__set__(newValueOrCallback, currSignal, statix) {
	let tmpValue = null;

	if(isFunction(newValueOrCallback)) {
		tmpValue = newValueOrCallback()
	} else {
		tmpValue = newValueOrCallback;
	}

	if(!Object.is(tmpValue, currSignal[0])) {
		currSignal[0] = tmpValue;
		
		for(let rendererKey in currSignal[1]) {
			currSignal[1][rendererKey](statix, tmpValue);
		}
	}
}

export function signal__subscribe__(rendererMap, renderer) {
	if(!renderer.name) {
		throw new StatixInvalidRendererName(renderer.name);
	}

	if(renderer.length !== 2) {
		throw new StatixInvalidArgumentsLength(renderer.length, 2, renderer.name);
	}

	rendererMap[renderer.name] = renderer;
}

export function signal__unsubscribe__(rendererMap, renderer) {
	if(!renderer.name) {
		throw new StatixInvalidRendererName(renderer.name);
	}

	rendererMap[renderer.name] = renderer;
}