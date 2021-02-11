import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { uploadFileToApi } from "../redux/actionCreators";

interface IProp {
  show: boolean,
  handleClose: Function
}

/**
 * `UploadPhotoModal` renders a `BlogForm` component for making an
 * edit for a post.
 * - passes a handler function to blogForm that invokes the `editItem` function
 *    in the parent component. (which will do a PATCH request)
 */
function UploadPhotoModal({ show, handleClose }: IProp) {
  const [uploadFile, setUploadFile] = useState<Blob | string>("");
  const [fileName, setFileName] = useState("Click to select photo");
  const dispatch = useDispatch();

  function handleUpload(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    try {
      const data = new FormData();
      data.append("upload", uploadFile);
      // ISSUE: Argument of type 'FormData' is not assignable to parameter of type 'FormEvent<Element>'.
      // QUICK-FIX: 'as any'
      dispatch(uploadFileToApi(data as any));
      handleClose();
    } catch (err) {
      console.log(err);
    }
  }

  const handleChange = (file: FileList | null) => {
    console.log(file);
    if (file) {
      setUploadFile(file[0]);
      setFileName(file[0].name);
    }
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Upload profile photo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleUpload}>
          <Form.Group>
            <Form.File
              id="photo-file"
              label={fileName}
              custom
              onChange={(e: React.FormEvent<HTMLInputElement>) => handleChange(e.currentTarget.files)}
            ></Form.File>
          </Form.Group>
          <Button type="submit">Upload</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UploadPhotoModal;