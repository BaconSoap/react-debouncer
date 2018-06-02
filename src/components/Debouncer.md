Wrap your components in `Debouncer` to debounce external change events while still showing the most up-to-date value possible in the UI (even if that value is not yet tracked by your external state management). This is useful for preventing spawning many API calls per-keystroke, or for preventing potentially costly Redux updates.

### Usage with `component`

### Usage with `render`

```jsx
class DebouncedInput extends React.PureComponent {
  constructor(p) {
    super(p);
    this.state = {
      val: "test",
      internalVal: "test",
      updateCount: 0
    };

    this.onChange = this.onChange.bind(this);
  }

  render() {
    return (
      <React.Fragment>
        <Debouncer
          debounceDelayMs={500}
          selectedValue={this.state.val}
          onChange={this.onChange}
          render={(selectedValue, onChange) => (
            <input
              value={selectedValue}
              onChange={e => {
                onChange(e.currentTarget.value);
                this.setState({internalVal: e.currentTarget.value});
              }}
            />
          )}
        />
        <br />
        Current internal value: {this.state.internalVal} <br />
        Current external value: {this.state.val} <br />
        Count `onChange` called: {this.state.updateCount.toString()} <br />
      </React.Fragment>
    );
  }

  onChange(newVal) {
    this.setState(state => ({
      val: newVal,
      updateCount: state.updateCount + 1
    }));
  };
}

<DebouncedInput />
```
