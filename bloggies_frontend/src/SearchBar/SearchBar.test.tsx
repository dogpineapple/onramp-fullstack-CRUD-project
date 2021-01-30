import React, { Component } from 'react';
import Enzyme, { mount, ReactWrapper, shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import SearchBar from './index';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { MOCK_STORE } from '../jest.mock';
Enzyme.configure({ adapter: new Adapter() });

const mockStore = configureStore();

describe('SearchBar', () => {
  let wrapper: ReactWrapper;

  beforeEach(() => {
    wrapper = mount(shallow<Component>(
      <Provider store={mockStore(MOCK_STORE)}>
        <SearchBar />
      </Provider>
    ).get(0));
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

});