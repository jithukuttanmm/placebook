import React, { useContext, useState } from "react";
import ErrorModal from "../../shared/components/ErrorModal";
import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import Card from "../../shared/components/UIElements/Card";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/components/utils/validators";
import { AuthContext } from "../../shared/context/auth-context";
import { UserForm } from "../../shared/hooks/form-hook";
import "./AuthenticatePage.css";
import { useHttpClient } from "../../shared/hooks/http-hook";

export default function AuthenticatePage() {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, isError, sendRequest, clearError] = useHttpClient();
  const [formState, inputHandler, setFormData] = UserForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const authSubmitHandler = async (event) => {
    event.preventDefault();
    if (isLoginMode) {
      try {
        const response = await sendRequest(
          "http://localhost:5000/api/users/login",
          "POST",
          {
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }
        );

        if (response) {
          auth.setUser(response.data.user);
          auth.setToken(response.data.token);
          auth.login();
        }
      } catch (error) {
        console.log("got error");
      }
    } else {
      try {
        const formData = new FormData();
        formData.append("email", formState.inputs.email.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("name", formState.inputs.name.value);
        formData.append("image", formState.inputs.image.value);

        const config = {
          headers: {
            "content-type": "multipart/form-data",
          },
        };

        const response = await sendRequest(
          "http://localhost:5000/api/users/signup",
          "POST",
          formData,
          config
        );
        auth.setUser(response.data.user);
        auth.login();
      } catch (error) {}
    }
  };
  function switchModeHandler() {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image: {
            value: "",
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode((prevState) => !prevState);
  }
  return (
    <>
      <ErrorModal error={isError} show={isError} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login required</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              id="name"
              element="input"
              type="text"
              label="Your name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter your name."
              onInput={inputHandler}
            />
          )}
          {!isLoginMode && (
            <ImageUpload
              id="image"
              onInput={inputHandler}
              errorText="Please provide an image!"
            />
          )}
          <Input
            id="email"
            element="input"
            type="email"
            label="Email"
            validators={[VALIDATOR_EMAIL(), VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter email."
            onInput={inputHandler}
          />
          <Input
            id="password"
            element="input"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter password."
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? "Login" : "Signup"}
          </Button>
          <Button inverse type="button" onClick={switchModeHandler}>
            Switch to {!isLoginMode ? "Login" : "Signup"}
          </Button>
        </form>
      </Card>
    </>
  );
}
