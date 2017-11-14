import React from 'react';
import { shallow } from 'enzyme';
import Button from './index';

it('renders without crashing', () => {
  const wrapper = shallow(<Button>Hello Button</Button>);
  expect(wrapper.text()).toEqual('Hello Button');
});
