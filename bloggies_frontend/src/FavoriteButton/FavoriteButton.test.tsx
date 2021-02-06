import React, { Component } from 'react';
import Enzyme, { mount, ReactWrapper, shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import FavoriteButton from './index';
import { MOCK_POST, MOCK_STORE } from '../jest.mock';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

Enzyme.configure({ adapter: new Adapter() });

const mStore = configureStore();

jest.spyOn(window, 'alert').mockImplementation(() => {});

describe('FavoriteButton', () => {
  let wrapper: ReactWrapper;

  beforeEach(() => {
    wrapper = mount(shallow<Component>(
      <Provider store={mStore(MOCK_STORE)}>
      <FavoriteButton post={MOCK_POST} />
      </Provider>
    ).get(0));
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should have favorite button', () => {
    const favoriteBtn = wrapper.find(".FavoriteButton-btn");
    expect(favoriteBtn).toBeTruthy();
  });

  it('should have alert response when not logged in', () => {
    const favoriteBtn = wrapper.find("svg");
    favoriteBtn.simulate('click');
    expect(window.alert).toBeCalledTimes(1);
  });
});