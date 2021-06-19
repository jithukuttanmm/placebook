import React, { useEffect, useRef, useState } from "react";
import Button from "./Button";
import "./ImageUpload.css";

export default function ImageUpload(props) {
  const filePickerRef = useRef();
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState("");
  const [isValid, setIsValid] = useState(false);
  const pickedHandler = (event) => {
    let pickedFile,
      fileIsValid = false;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      fileIsValid = true;
      setFile(pickedFile);
      setIsValid(true);
    } else {
      setIsValid(false);
    }
    props.onInput(props.id, pickedFile, fileIsValid);
  };
  const pickImageHandler = () => {
    filePickerRef.current.click();
  };
  useEffect(() => {
    if (!file) return;
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);
  return (
    <div className="form-control">
      <input
        ref={filePickerRef}
        id={props.id}
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center ? "center" : ""}`}>
        <div className="image-upload__preview">
          {previewUrl ? (
            <img src={previewUrl} alt="preview" style={{maxHeight:'150px'}}></img>
          ) : (
            <p>Please pick an image.</p>
          )}
        </div>
        <Button type="button" onClick={pickImageHandler} center>
          PICK IMAGE
        </Button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
}
