import { mount, ReactWrapper } from 'enzyme';
import * as React from 'react';
import { Debouncer } from '../components';

const noop = () => null;
const delay = 10;
const getInner = (el: ReactWrapper<any, any>) => el.find(InnerEl);
const triggerChange = (el: ReactWrapper<any, any>, newVal: string) => (
  (getInner(el).instance() as InnerEl).triggerOnChange(newVal)
);

describe('DebouncedInput', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('renders without crashing', () => {
    const el = mount(<Debouncer
      debounceDelayMs={delay}
      onChange={noop}
      selectedValue={''}
      render={renderInnerEl}
    />);

    el.unmount();
  });

  it('debounces inner on change', () => {
    const onChange = jest.fn();

    const el = mount(<Debouncer
      debounceDelayMs={delay}
      onChange={onChange}
      selectedValue={''}
      render={renderInnerEl}
    />);

    triggerChange(el, 'testing');
    expect(onChange).not.toHaveBeenCalled();

    triggerChange(el, 'testing 2');
    expect(onChange).not.toHaveBeenCalled();

    triggerChange(el, 'testing 3');
    jest.advanceTimersByTime(delay + 5);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('testing 3');

    el.unmount();
  });

  it('allows using custom extractors', () => {
    const onChange = jest.fn();
    const extract = () => (++num).toString();
    let num = 0;
    const el = mount(<Debouncer
      debounceDelayMs={delay}
      onChange={onChange}
      selectedValue={''}
      render={renderInnerEl}
      extractValueFromEvent={extract}
    />);

    triggerChange(el, 'testing');
    expect(onChange).not.toHaveBeenCalled();
    expect(num).toBe(1);

    triggerChange(el, 'testing 3');
    jest.advanceTimersByTime(delay + 5);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('2');
    expect(num).toBe(2);

    el.unmount();
  });

  it('passes selectedValue properly', () => {
    const el = mount(<Debouncer
      debounceDelayMs={delay}
      onChange={noop}
      selectedValue={'apples'}
      render={renderInnerEl}
    />);

    const inner = getInner(el);
    expect(inner.props().value).toBe('apples');

    el.setProps({ selectedValue: 'bananas' });

    const updatedInner = getInner(el);
    expect(updatedInner.props().value).toBe('bananas');

    el.unmount();
  });
});

class InnerEl extends React.PureComponent<{ onChange: (newVal: string) => void, value: string }> {
  public render() {
    return <div />;
  }

  public triggerOnChange = (newVal: string) => this.props.onChange(newVal);
}

const renderInnerEl = (selectedValue: string, onChange: (newVal: string) => void) => (
  <InnerEl value={selectedValue} onChange={onChange} />
);
