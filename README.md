# Statix
Simple zero dependencies Vanilla JS library for simplify, optimize and struct your static HTML website. Statix ​​allows you to easily add dynamics to your static website.
## Documentation
Creating a simple component with JS and Statix.
```js
// components/Button.js
import statix from "statix.core.js";

function Button(props) {
	const instance = new statix.Statix(props.$init);
	const statixDOM = instance.statixDOM();

	const button = statixDOM
		.element("button")
		.text(`Count ${instance.getState()}`)
		.addEvent("click", increment)
		.create();

	statixDOM.setRootByElement(button);

	return instance;
}

// StatixDOM extends default events that you can use instance of
// Statix in you event listeners.
function increment(instance, event) {
	instance.setState(curr => cur++);
}

function onUpdate(instance, curr, prev) {
	// You need to call reset to reset internal instance state.
	// Changes will be applyed automaticaly by function call.
	instance.getStatixDOM().root().text(`Count ${curr}`).reset();
}

// index.js
import Button from "/components/Button.js";

const button_1 = Button({ $init: 0 });
const button_2 = Button({ $init: 20 });

button_1.mount("#app");
button_2.mount("#app");
```
Creat a simple component with Statix and existing in the DOM static element. Statix does not create a copy of the element, he process and work with first element that was found with passed selector!
```js
// components/Button.js
import statix from "statix.core.js";

function Button(props) {
	const instance = new statix.Statix(props.$init);
	const statixDOM = instance.getStatixDOM();

	statixDOM.setRootBySelector(props.selector);

	return instance;
}

// StatixDOM extends default events that you can use instance of
// Statix in you event listeners.
function increment(instance, event) {
	instance.setState(curr => cur++);
}

function onUpdate(instance, curr, prev) {
	// You need to call reset to reset internal instance state.
	// Changes will be applyed automaticaly by function call.
	instance.getStatixDOM().root().text(`Count ${curr}`).reset();
}

// index.js
import Button from "/components/Button.js";

// You not need to mount the element because it is alredy in DOM. 
const button_1 = Button({ $init: 0 });
const button_2 = Button({ $init: 20 });
```
Every element have 3 lifecycle functions, `onMount`, `onUnmount` and `onUpdate`. `onMount` is called each time root element is mounted to the DOM, you can set new state in the `onMount` cycle but `onUpdate` function will be called only after the `onMount` function is executed. You can not set new state in the `onUpdate` and `onUnmount` cycle, by trying it will be cause `StatixInvalidSetStateCall` error.\