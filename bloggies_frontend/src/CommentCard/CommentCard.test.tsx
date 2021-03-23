import React, { Component } from 'react';
import Enzyme, { mount, ReactWrapper, shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import CommendCard from './index';
import { MOCK_COMMENT } from '../jest.mock';

Enzyme.configure({ adapter: new Adapter() });

const mockHandlePostReply = jest.fn((post) => {
  return undefined;
})

describe('CommentCard', () => {
  let wrapper: ReactWrapper;

  beforeEach(() => {
    wrapper = mount(shallow<Component>(
      <CommendCard comment={MOCK_COMMENT} handlePostReply={mockHandlePostReply} />
    ).get(0));
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should display comment', () => {
    const isCommentBody = wrapper.containsMatchingElement(
      <p className="sc-bdfBwQ dhWHrV card-text">
        test comment
      </p>
    );
    expect(isCommentBody).toBeTruthy();
  });
});