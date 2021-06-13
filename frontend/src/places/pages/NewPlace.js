import React, { useContext } from "react";
import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/components/utils/validators";
import ErrorModal from "../../shared/components/ErrorModal";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import { UserForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

import "./NewPlace.css";
import { useHistory } from "react-router-dom";

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
      await sendRequest("http://localhost:5000/api/places/create", "POST", {
        title: formState.inputs.title.value,
        description: formState.inputs.description.value,
        address: formState.inputs.address.value,
        creator: auth.user.id,
      });

      history.goBack();
    } catch (error) {}
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
        <Button type="submit" disabled={!formState.isValid}>
          Add Place
        </Button>
      </form>
    </>
  );
};

export default NewPlace;
