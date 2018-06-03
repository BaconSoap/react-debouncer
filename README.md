# `react-debouncer`

Enables easy debouncing of change events while still presenting a responsive UI.

## Usage

Wrap your component in `<Debouncer />` by passing it into `component`, or implement a `render<T>(value: T, onChange: (newValue: T) => void)` function.

For the common case of debouncing a text input, you can use [`<DebouncedInput />`](src/components/DebouncedInput.tsx) ([docs](src/components/DebouncedInput.md)). This is also an example implementation of `<Debouncer />`.

Example usage ([see it in action](https://codesandbox.io/s/qlr3kmvrv4)):

```tsx
import * as React from 'react';
import { DebouncedInput, OnChangeHandler } from 'react-debouncer';

class DebounceDisplay extends React.PureComponent<{}, { value: string }> {
  public constructor(p: {}) {
    super(p);
    this.state = { value: 'initial value' };
  }

  public render() {
    return (
      <React.Fragment>
        <DebouncedInput value={this.state.value} onChange={this.onChange} />
        <br />
        Global state value: {this.state.value}
      </React.Fragment>
    );
  }

  private onChange: OnChangeHandler = (newVal: string) => {
    this.setState({ value: newVal });
  };
}
```

## Development

Run `yarn start:styleguide` to start the styleguidist server and open the url it mentions

## License

MIT License, Andrew Varnerin 2018.

## Code of Conduct

[See here](CODE_OF_CONDUCT.md).
