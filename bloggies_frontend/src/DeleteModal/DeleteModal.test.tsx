import React, { Component } from 'react';
import Enzyme, { mount, ReactWrapper, shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import DeleteModal from './index';

Enzyme.configure({ adapter: new Adapter() });

const mockDeletePost = jest.fn(() => "Deleted");

describe('DeleteModal', () => {
  let wrapper: ReactWrapper;

  beforeEach(() => {
    wrapper = mount(shallow<Component>(
      <DeleteModal show={true} handleClose={() => "Closed"} deletePost={mockDeletePost} />
    ).get(0));
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should display delete modal text', () => {
    const isDeleteModalText = wrapper.containsMatchingElement(
      <div className="modal-body">
        Are you sure you want to delete this post?
      </div>
    );
    expect(isDeleteModalText).toBeTruthy();
  });

  it('should contain two buttons for confirm and close', () => {
    const buttonNodes = wrapper.findWhere(node => {
      return node.type() === 'button' &&
        (node.text() === 'Go back' || node.text() === 'Yes');
    });
    expect(buttonNodes).toHaveLength(2);
  });

  it('should delete when pressed "Yes"', () => {
    const yesButton = wrapper.find(".btn-danger");
    yesButton.simulate('click');

    expect(mockDeletePost).toBeCalledTimes(1);
  });
});