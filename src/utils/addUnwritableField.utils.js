export default function addUnwritableField(object, key, value) {
	Object.defineProperty(object, key, {
		configurable: false,
		enumerable: false,
		writable: false,
		value: value
	});
}