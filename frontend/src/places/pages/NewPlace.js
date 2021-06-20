import React, { useContext } from "react";
import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/components/utils/validators";
import ErrorModal from "../../shared/components/ErrorModal";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import { UserForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { useHistory } from "react-router-dom";
import "./NewPlace.css";

const newPlace = {
  title: { value: "", isValid: false },
  description: { value: "", isValid: false },
};

const NewPlace = () => {
  const [formState, inputHandler] = UserForm(newPlace, false);
  const [isLoading, isError, sendRequest, clearError] = useHttpClient();
  const auth = useContext(AuthContext);
  const history = useHistory();

  async function placeSubmitHandler(event) {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("address", formState.inputs.address.value);
      formData.append("image", formState.inputs.image.value);

      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
        Authorization: `Bearer ${auth.token}`,
      };
      const response = await sendRequest(
        process.env.REACT_APP_API_URL + "/places/create",
        "POST",
        formData,
        config
      );
      if (response) history.goBack();
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <ErrorModal error={isError} show={isError} onClear={clearError} />{" "}
      {isLoading && <LoadingSpinner asOverlay />}
      <form className="place-form" onSubmit={placeSubmitHandler}>
        <Input
          id="title"
          element="input"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText={"Enter a title"}
          onInput={inputHandler}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
          errorText={"Enter a description of min length 5"}
          onInput={inputHandler}
        />
        <Input
          id="address"
          element="input"
          label="Address"
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
          errorText={"Enter an address of min length 5"}
          onInput={inputHandler}
        />
        <ImageUpload
          id="image"
          onInput={inputHandler}
          errorText="Please provide an image!"
        />
        <Button type="submit" disabled={!formState.isValid}>
          Add Place
        </Button>
      </form>
    </>
  );
};

export default NewPlace;
