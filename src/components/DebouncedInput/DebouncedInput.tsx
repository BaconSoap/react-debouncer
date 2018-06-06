import * as React from "react";
import { Overwrite } from 'type-zoo';
import { Debouncer } from '../Debouncer/Debouncer';

export type DebouncedInputProps = {
  /**
   * Currently selected value from external state. If this changes, it instantly takes precedence over
   * the internally-tracked value.
   */
  value: string;

  /**
   * Function to call when the value has been changed and the debounce timeout has been hit.
   */
  onChange: (newVal: string) => void;

  /**
   * Delay in milliseconds before the change is emitted externally
   */
  debounceDelayMs?: number;
};

type InputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export class DebouncedInput extends React.PureComponent<Overwrite<InputProps, DebouncedInputProps>>
{
  public render() {
    const { debounceDelayMs = 300 } = this.props;
    let { value } = this.props;

    if (value === undefined) {
      value = '';
    }

    return (
      <Debouncer
        debounceDelayMs={debounceDelayMs}
        selectedValue={value}
        onChange={this.props.onChange}
        render={this.innerRender}
      />
    );
  }

  private innerRender = (uiValue: string, innerOnChange: (newVal: React.ChangeEvent<HTMLInputElement>) => void) => {
    const { value, onChange, debounceDelayMs, ...restProps } = this.props;

    return (
      <input
        value={uiValue}
        onChange={innerOnChange}
        {...restProps}
      />
    )
  }
}
