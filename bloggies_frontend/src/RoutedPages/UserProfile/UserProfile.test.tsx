import React, { Component } from 'react';
import Enzyme, { mount, ReactWrapper, shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import UserProfile from './index';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import ReactRouter from 'react-router';
import { MOCK_STORE } from '../../jest.mock';

Enzyme.configure({ adapter: new Adapter() });

const mockStore = configureStore();


describe('SearchBar', () => {
  let wrapper: ReactWrapper;

  beforeEach(() => {
    jest.spyOn(ReactRouter, 'useParams').mockReturnValue({ userId: '1', displayName: 'test-user' });
 
    wrapper = mount(shallow<Component>(
      <Provider store={mockStore(MOCK_STORE)}>
        <UserProfile />
      </Provider>
    ).get(0));
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should display user name', () => {
    const displayNameTag = wrapper.find(".UserProfile > h1");
    expect(displayNameTag.text()).toBe('test user\'s profile');
  });
});