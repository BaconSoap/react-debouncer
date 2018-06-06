// react-docgen-typescript has some issue with `polyfill`, where polyfilled things will
// no longer be parseable & won't show any props in the docs, so... here we are.
import { polyfill } from 'react-lifecycles-compat';
import { Debouncer } from './Debouncer/Debouncer';
polyfill(Debouncer);

export { Debouncer, DebouncerProps } from './Debouncer/Debouncer';
export { DebouncedInput, DebouncedInputProps } from './DebouncedInput/DebouncedInput';
