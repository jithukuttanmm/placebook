import React, { useEffect } from "react";
import { useParams } from "react-router";
import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/components/utils/validators";
import { DUMMY_PLACES } from "./UserPlaces";

import "./NewPlace.css";
import { UserForm } from "../../shared/hooks/form-hook";
import Card from "../../shared/components/UIElements/Card";

export default function UpdatePlace() {
  const placeId = useParams().placeId;
  const [formState, inputHandler, setFormData] = UserForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const identifiedPlace = DUMMY_PLACES.find((p) => p.id === placeId);
  function handleUpdateSubmit(event) {
    event.preventDefault();
    console.log(formState);
  }

  useEffect(() => {
    if (identifiedPlace)
      setFormData(
        {
          title: {
            value: identifiedPlace.title,
            isValid: true,
          },
          description: {
            value: identifiedPlace.description,
            isValid: true,
          },
        },
        true
      );
  }, [identifiedPlace, setFormData]);

  if (!identifiedPlace)
    return (
      <div className="center">
        <Card>
          <h2>Place not found!</h2>
        </Card>
      </div>
    );
  if (formState.inputs.title.value)
    return (
      <form className="place-form" onSubmit={handleUpdateSubmit}>
        <Input
          id="title"
          type="text"
          label="Title"
          element="input"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Enter title."
          onInput={inputHandler}
          initialValue={formState.inputs.title.value}
          initialValid={formState.inputs.title.isValid}
        />
        <Input
          id="description"
          type="text"
          label="Description"
          element="description"
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
          errorText="Enter description."
          onInput={inputHandler}
          initialValue={formState.inputs.description.value}
          initialValid={formState.inputs.description.isValid}
        />
        <Button type="submit" disabled={!formState.isValid}>
          Update Place
        </Button>
      </form>
    );
  return <h2>Loading...</h2>;
}
