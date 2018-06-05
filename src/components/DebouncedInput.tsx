import * as React from "react";
import { Overwrite } from 'type-zoo';
import { Debouncer, OnChangeHandler } from "./Debouncer";

export type DebouncedInputProps = {
  value: string;
  onChange: (newVal: string) => void;
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

  private innerRender = (uiValue: string, innerOnChange: OnChangeHandler) => {
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
