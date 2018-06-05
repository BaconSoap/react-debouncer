import { mount } from 'enzyme';
import * as React from 'react';
import { DebouncedInput } from '../components';

describe('DebouncedInput', () => {
  const getDefaultProps = () => ({
    debounceDelayMs: 500,
    onChange: (newVal: string) => void (0),
    value: 'asdf',
  });

  it('should show initial value', () => {
    const { value, onChange } = getDefaultProps();

    const wrapper = mount(<DebouncedInput value={value} onChange={onChange} />);
    const input = wrapper.find('input');

    expect(input.props().value).toBe(value);

    wrapper.unmount();
  });

  it('should respond to value updates from the parent', () => {
    const { value, onChange } = getDefaultProps();

    const wrapper = mount(<DebouncedInput value={value} onChange={onChange} />);
    let input = wrapper.find('input');

    expect(input.props().value).toBe(value);

    wrapper.setProps({ value: value + '_updated' });

    input = wrapper.find('input');
    expect(input.props().value).toBe(value + '_updated');

    wrapper.unmount();
  });

  it('should not call onChange immediately', () => {
    const { value } = getDefaultProps();

    let externalValue = value;
    const onChange = (newVal: string) => externalValue = newVal;

    const wrapper = mount(<DebouncedInput value={value} onChange={onChange} debounceDelayMs={100} />);

    const input = wrapper.find('input');
    const inputOnChange = input.props().onChange;
    if (!inputOnChange) {
      throw new Error('oops');
    }

    inputOnChange({ currentTarget: { value: value + '_updated' } } as any);

    // force the external wrapper to respond to the state change and re-render
    wrapper.update();

    const inputAfterChange = wrapper.find('input');

    expect(inputAfterChange.props().value).toBe(value + '_updated');
    expect(externalValue).toBe(value);

    wrapper.unmount();
  });

  it('should call onChange after a quiet period', (done) => {
    const { value } = getDefaultProps();

    let externalValue = value;
    const onChange = (newVal: string) => externalValue = newVal;

    const wrapper = mount(<DebouncedInput value={value} onChange={onChange} debounceDelayMs={100} />);

    const input = wrapper.find('input');
    const inputOnChange = input.props().onChange;
    if (!inputOnChange) {
      throw new Error('oops');
    }

    inputOnChange({ currentTarget: { value: value + '_updated' } } as any);

    setTimeout(() => {
      // force the external wrapper to respond to the state change and re-render
      wrapper.update();

      const inputAfterChange = wrapper.find('input');

      expect(inputAfterChange.props().value).toBe(value + '_updated');
      expect(externalValue).toBe(value + '_updated');

      wrapper.unmount();

      done();
    }, 105);
  });
})
