# `react-debouncer`

Enables easy debouncing of change events while still presenting a responsive UI.

## Usage

Wrap your component in `<Debouncer />` by passing it into `component`, or implement a `render<T>(value: T, onChange: (newValue: T) => void)` function.

For the common case of debouncing a text input, you can use [`<DebouncedInput />`](src/components/DebouncedInput.tsx) ([docs](src/components/DebouncedInput.md)). This is also an example implementation of `<Debouncer />`.

## Development

Run `yarn start:styleguide` to start the styleguidist server and open the url it mentions

## License

MIT 2018, Andrew Varnerin.

## Code of Conduct

[See here](CODE_OF_CONDUCT.md).
