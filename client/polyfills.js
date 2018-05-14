import objectEntries from 'object.entries';
import objectValues from 'object.values';

if (!Object.entries) {
    objectEntries.shim();
}

if (!Object.values) {
    objectValues.shim();
}
