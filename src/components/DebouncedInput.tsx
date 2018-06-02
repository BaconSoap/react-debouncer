import * as React from "react";
import { Debouncer, OnChangeEventArg } from "./Debouncer";

export type DebouncedInputProps = {
  value: string;
  onChange: (newVal: string) => void;
  debounceDelayMs?: number;
} & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export class DebouncedInput extends React.PureComponent<DebouncedInputProps>
{
  public render() {
    const { debounceDelayMs } = this.props;
    let { value } = this.props;

    if (value === undefined) {
      value = '';
    }

    if (typeof value !== 'string') {
      value = value.toString();
    }

    return (
      <Debouncer
        debounceDelayMs={debounceDelayMs === undefined ? 300 : debounceDelayMs}
        selectedValue={value}
        onChange={this.props.onChange}
        render={this.innerRender}
      />
    );
  }

  private innerRender = (uiValue: string, innerOnChange: (newVal: OnChangeEventArg<string>) => void) => {
    const { value, onChange, ...restProps } = this.props;

    return (
      <input
        value={uiValue}
        onChange={innerOnChange}
        {...restProps}
      />
    )
  }
}
