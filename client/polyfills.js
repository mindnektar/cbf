import objectEntries from 'object.entries';
import objectValues from 'object.values';
import promiseFinally from 'promise.prototype.finally';

if (!Object.entries) {
    objectEntries.shim();
}

if (!Object.values) {
    objectValues.shim();
}

if (!Promise.finally) {
    promiseFinally.shim();
}
