import React, { Component } from 'react';
import Enzyme, { mount, ReactWrapper, shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import BlogCard from './index';
import ReactRouter from 'react-router';
import { MOCK_POST, MOCK_STORE } from '../jest.mock';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

Enzyme.configure({ adapter: new Adapter() });

const mockStore = configureStore();

describe('BlogCard', () => {
  let wrapper: ReactWrapper;

  beforeEach(() => {
    jest.spyOn(ReactRouter, 'useParams').mockReturnValue({ userId: '1', displayName: 'test-user' });

    wrapper = mount(shallow<Component>(
      <Provider store={mockStore(MOCK_STORE)}>
        <BrowserRouter>
          <BlogCard post={MOCK_POST} />
        </BrowserRouter>
      </Provider>
    ).get(0));
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should display correct post text', () => {
    const bodyTextTag = wrapper.find(".BlogCard-body > p");
    expect(bodyTextTag.text()).toBe(MOCK_POST.body);
  });
});