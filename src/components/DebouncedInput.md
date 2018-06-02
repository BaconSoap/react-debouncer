A debounced `input` element. Has all standard `input` props, with the following exceptions:

- `value` is always a string
- `onChange` takes in a string, not an event arg
- `debounceDelayMs` specifies the delay in milliseconds to wait before calling the external `onChange` (default: 300)

```jsx
initialState = {value: 'test'};
<>
  <DebouncedInput
    value={state.value}
    onChange={(val) => setState({value: val})}
  />
  <br />
  {state.value}
</>
```
