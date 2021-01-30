import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import UserCard from './index';
import { MOCK_USER } from '../jest.mock';

Enzyme.configure({ adapter: new Adapter() });

describe('UserCard', () => {
  it('should match snapshot', () => {
    const wrapper = shallow(<UserCard user={MOCK_USER}/>);
    expect(wrapper).toMatchSnapshot();
  });
  it('should show correct display name', () => {
    const wrapper = shallow(<UserCard user={MOCK_USER}/>);
    const name = wrapper.find(".BlogCard-body");
    expect(name.text()).toBe(MOCK_USER.display_name);
  });
});
