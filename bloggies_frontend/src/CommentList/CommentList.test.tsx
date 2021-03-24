import React, { Component } from 'react';
import Enzyme, { mount, ReactWrapper, shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import CommentList from './index';
import { MOCK_COMMENTS, MOCK_STORE, MOCK_POST } from '../jest.mock';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import CommentCard from '../CommentCard';

Enzyme.configure({ adapter: new Adapter() });

const mockStore = configureStore();

const mockPostComment = jest.fn(() => "Posted");

describe('CommentList', () => {
  let wrapper: ReactWrapper;

  beforeEach(() => {
    wrapper = mount(shallow<Component>(
      <Provider store={mockStore(MOCK_STORE)}>
        <BrowserRouter>
          <CommentList comments={MOCK_COMMENTS} postId={MOCK_POST.id} postComment={mockPostComment} />
        </BrowserRouter>
      </Provider>
    ).get(0));
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should display comments', () => {
    const commentCards = wrapper.find(CommentCard);
    const firstComment = wrapper.containsMatchingElement(
      <p className="sc-bdfBwQ dhWHrV card-text">
        first test comment
      </p>
    );

    expect(commentCards).toHaveLength(2);
    expect(firstComment).toBeTruthy();
  });

  it('should display "No comments yet" with no comments', () => {
    wrapper = mount(shallow<Component>(
      <Provider store={mockStore(MOCK_STORE)}>
        <BrowserRouter>
          <CommentList comments={[]} postId={MOCK_POST.id} postComment={mockPostComment} />
        </BrowserRouter>
      </Provider>
    ).get(0));

    const elementFound = wrapper.containsMatchingElement(
      <div className="CommentsList-no-comments">No comments yet. Be the first!</div>
    );

    expect(elementFound).toBeTruthy();
  });
});