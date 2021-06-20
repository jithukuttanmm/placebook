import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useParams } from "react-router";
import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/components/utils/validators";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import ErrorModal from "../../shared/components/ErrorModal";
import { UserForm } from "../../shared/hooks/form-hook";
import Card from "../../shared/components/UIElements/Card";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "./NewPlace.css";

export default function UpdatePlace() {
  const auth = useContext(AuthContext);
  const placeId = useParams().placeId;
  const history = useHistory();
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
  const [isLoading, isError, sendRequest, clearError] = useHttpClient();
  const [identifiedPlace, setIdentifiedPlace] = useState(null);

  useEffect(() => {
    async function getPlace() {
      try {
        const result = await sendRequest(
          `http://localhost:5000/api/places/${placeId}`,
          "GET"
        );
        result && setIdentifiedPlace(result.data);
      } catch (error) {}
    }
    getPlace();
  }, [placeId, sendRequest]);

  async function handleUpdateSubmit(event) {
    event.preventDefault();

    try {
      const result = await sendRequest(
        `http://localhost:5000/api/places/${placeId}`,
        "PATCH",
        {
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        },
        { Authorization: `Bearer ${auth.token}` }
      );
      if (result) history.goBack();
    } catch (err) {}
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
  if (isLoading)
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  if (isError) return <ErrorModal onClear={clearError} error={isError} />;
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
