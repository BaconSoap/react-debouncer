import * as React from "react";
import { polyfill } from 'react-lifecycles-compat';

export type DebouncerProps<T> = {

  /**
   * Delay in milliseconds before we emit the change externally
   */
  debounceDelayMs: number;

  /**
   * Currently selected value from external state. If this changes, it instantly takes precedence over
   * the internally-tracked value.
   */
  selectedValue: T;

  /**
   * Function to call when the value has been changed and the debounce timeout has been hit.
   */
  onChange: (newValue: T) => void;

  /**
   * Controls rendering by using a function that returns a JSX element. Only one of `render` or
   * `component` may be set.
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
    selectedValue: T,
    onChange: (newValue: T) => void
  ) => React.ReactNode;

  /**
   * Controls rendering by using a component that takes in props (this can be either a functional
   * stateless component or a class-based component). Only one of `render` or `component` may be set.
   *
   * `props.value` behaves as it does in the `render` prop.
   *
   * `props.onChange` behaves as it does in the `render` prop.
   */
  component?: React.ComponentType<{ value: T, onChange: (newValue: T) => void }>;
};


export type OnChangeEventArg<T = string> = T | React.FormEvent<{ value: T }>;
export type OnChangeHandler<T = string> = (newValue: OnChangeEventArg<T>) => void;
type DebouncerState<T> = { selectedValue: T; selectedValueFromProps: T };
export class Debouncer<T> extends React.PureComponent<DebouncerProps<T>, DebouncerState<T>> {

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

  public constructor(p: any) {
    super(p);

    this.timeoutId = null;

    this.state = {
      selectedValue: this.props.selectedValue,
      selectedValueFromProps: this.props.selectedValue
    };
  }


  public render() {
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

  private onChange = (e: T) => {
    this.clearTimeout();

    const newValue = this.extractValue(e);

    this.setState({ selectedValue: newValue }, () => {
      this.clearTimeout();

      this.timeoutId = setTimeout(() => {
        this.props.onChange(this.state.selectedValue);
      }, this.props.debounceDelayMs);
    });
  };

  private extractValue = (val: OnChangeEventArg<T>): T => {
    if (typeof val === 'string' || typeof val === 'number') {
      return val;
    }

    const formEventVal = val as React.FormEvent<{ value: T }>;

    if (formEventVal.currentTarget) {
      return formEventVal.currentTarget.value;
    }

    return val as T;
  }
}

polyfill(Debouncer);
