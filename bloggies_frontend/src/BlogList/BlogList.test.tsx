import React, { Component } from 'react';
import Enzyme, { mount, ReactWrapper, shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import BlogList from './index';
import { MOCK_POSTS, MOCK_STORE } from '../jest.mock';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import BlogCard from '../BlogCard';

Enzyme.configure({ adapter: new Adapter() });

const mockStore = configureStore();

describe('BlogList', () => {
  let wrapper: ReactWrapper;

  beforeEach(() => {
    wrapper = mount(shallow<Component>(
      <Provider store={mockStore(MOCK_STORE)}>
        <BrowserRouter>
          <BlogList posts={MOCK_POSTS} />
        </BrowserRouter>
      </Provider>
    ).get(0));
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should display posts', () => {
    const postsWrapper = wrapper.find(BlogCard);
    expect(postsWrapper).toHaveLength(3);
  });

  it('should not display "No posts made yet" with posts', () => {
    const nodesFound = wrapper.findWhere(node => {
      return node.text() === 'No posts made yet.';
    });

    expect(nodesFound).toHaveLength(0);
  });

  it('should display "No posts made yet" with no posts', () => {
    wrapper = mount(shallow<Component>(
      <Provider store={mockStore(MOCK_STORE)}>
        <BrowserRouter>
          <BlogList posts={[]} />
        </BrowserRouter>
      </Provider>
    ).get(0));

    const nodesFound = wrapper.findWhere(node => {
      return node.text() === 'No posts made yet.';
    });

    expect(nodesFound).toHaveLength(11);
  });
});