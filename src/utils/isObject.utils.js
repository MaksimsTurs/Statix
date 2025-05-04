const isObject = (maybeObject) => typeof maybeObject === "object" && !Array.isArray(maybeObject);

export default isObject;