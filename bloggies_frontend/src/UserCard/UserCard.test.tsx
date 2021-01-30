import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import UserCard from './index';
import { MOCK_USER } from '../jest.mock';

Enzyme.configure({ adapter: new Adapter() });

describe('UserCard', () => {
  it('should show user information', () => {

    const wrapper = shallow(<UserCard user={MOCK_USER}/>);
    expect(wrapper.debug()).toMatchSnapshot();
  });
});
