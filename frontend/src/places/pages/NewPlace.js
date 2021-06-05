import React from "react";
import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/components/utils/validators";
import { UserForm } from "../../shared/hooks/form-hook";

import "./NewPlace.css";

const newPlace = {
  title: { value: "", isValid: false },
  description: { value: "", isValid: false },
};

const NewPlace = () => {
  const [formState, inputHandler] = UserForm(newPlace, false);

  function placeSubmitHandler(event) {
    event.preventDefault();
    console.log(formState.inputs);
  }
  return (
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
  );
};

export default NewPlace;
