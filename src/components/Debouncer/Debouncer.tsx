import * as React from "react";

type DebouncerState<TValue> = { selectedValue: TValue; selectedValueFromProps: TValue };

export type DebouncerProps<TValue> = {
  /**
   * Delay in milliseconds before we emit the change externally. 300 is a good arbitrary number.
   */
  debounceDelayMs: number;

  /**
   * Currently selected value from external state. If this changes, it instantly takes precedence over
   * the internally-tracked value.
   */
  selectedValue: TValue;

  /**
   * Function to call when the value has been changed and the debounce timeout has been hit.
   */
  onChange: (newValue: TValue) => void;

  /**
   * Controls rendering by using a function that returns a JSX element.
   *
   * The inner `selectedValue` is the internally-tracked value and may not yet have been propagated
   * up via the onChange prop. Use this value to prevent input lag.
   *
   * The inner `onChange` function should be called with the new value from the inner component when
   * that component updates itself (when typing in a textbox, or clicking an option in a list). This
   * updates `selectedValue` instantly, while debouncing it to eventually call the `onChange` prop.
   * This function must be called with the *entire* current value, and not only the incremental change.
   */
  render: (
    selectedValue: TValue,
    onChange: (newValue: TValue | any) => void
  ) => React.ReactNode;

  /**
   * Function to extract the value of type `TValue` from the inner onChange event of type `TEvent`.
   * If not specified, the following logic is used to try to extract the value, based on common usage:
   *
   * 1. If the argument to `onChange` is a `number` or `string`, use that
   * 2. If the argument has a `currentTarget`, use `currentTarget.value`
   * 3. Else use the input value as-is
   */
  extractValueFromEvent?: <TEvent>(e: TEvent) => TValue;
};

export class Debouncer<TValue> extends React.PureComponent<DebouncerProps<TValue>, DebouncerState<TValue>> {

  public static getDerivedStateFromProps<T>(props: DebouncerProps<T>, state: DebouncerState<T>) {
    if (props.selectedValue === state.selectedValueFromProps) {
      return state;
    }

    return {
      selectedValue: props.selectedValue,
      selectedValueFromProps: props.selectedValue
    };
  }

  private timeoutId: any | null;

  public constructor(p: DebouncerProps<TValue>) {
    super(p);

    this.timeoutId = null;

    this.state = {
      selectedValue: this.props.selectedValue,
      selectedValueFromProps: this.props.selectedValue
    };
  }


  public render(): null | React.ReactNode {
    if (this.props.render) {
      return this.props.render(this.state.selectedValue, this.onChange);
    }

    return null;
  }

  private clearTimeout = () => {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
    }
  };

  private onChange = (e: TValue) => {
    this.clearTimeout();

    const newValue = this.extractValue(e);

    this.setState({ selectedValue: newValue }, () => {
      this.clearTimeout();

      this.timeoutId = setTimeout(() => {
        this.props.onChange(this.state.selectedValue);
      }, this.props.debounceDelayMs);
    });
  };

  private extractValue = (val: TValue | React.FormEvent<{ value: TValue }>): TValue => {
    if (this.props.extractValueFromEvent) {
      return (this.props.extractValueFromEvent(val));
    }

    if (typeof val === 'string' || typeof val === 'number') {
      return val;
    }

    const formEventVal = val as React.FormEvent<{ value: TValue }>;

    if (formEventVal.currentTarget) {
      return formEventVal.currentTarget.value;
    }

    return val as TValue;
  }
}
