import React, { Component } from 'react';
import Enzyme, { mount, ReactWrapper, shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import EditModal from './index';
import { MOCK_POST } from '../jest.mock';

Enzyme.configure({ adapter: new Adapter() });

const mEditItem = jest.fn(() => "Editted");

describe('EditModal', () => {
  let wrapper: ReactWrapper;

  beforeEach(() => {
    wrapper = mount(shallow<Component>(
      <EditModal show={true} handleClose={() => "Closed"} item={MOCK_POST} editItem={mEditItem} />
    ).get(0));
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should display edit modal text', () => {
    const isEditModalText = wrapper.containsMatchingElement(
      <div className="modal-title h4">
        Make an edit
      </div>
    );
    expect(isEditModalText).toBeTruthy();
  });
});