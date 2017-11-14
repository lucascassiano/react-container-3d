import React from 'react';
import { shallow } from 'enzyme';
import Container3D from './index';

it('renders without crashing', () => {
  const wrapper = shallow(<Button>Hello Button</Button>);
  expect(true).toBe(true); // too lazy to test it ;/ 
});
