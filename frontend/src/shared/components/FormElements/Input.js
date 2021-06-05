import React, { useReducer, useEffect } from "react";
import { validate } from "../utils/validators";
import "./Input.css";

const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.value,
        isValid: validate(action.value, action.validators),
      };
    case "TOUCHED":
      return { ...state, touched: true };
    default:
      return state;
  }
};

export default function Input(props) {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || "",
    isValid: props.initialValid || false,
  });

  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, onInput, value, isValid]);

  const element =
    props.element === "input" ? (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={changeHandler}
        value={inputState.value}
        onBlur={touchHandler}
      />
    ) : (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        placeholder={props.placeholder}
        onChange={changeHandler}
        value={inputState.value}
        onBlur={touchHandler}
      />
    );
  function touchHandler() {
    dispatch({ type: "TOUCHED" });
  }
  function changeHandler(event) {
    dispatch({
      type: "CHANGE",
      value: event.target.value,
      validators: props.validators,
    });
  }
  return (
    <div
      className={`form-control ${
        !inputState.isValid && inputState.touched && "form-control--invalid"
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label> {element}
      {!inputState.isValid && inputState.touched && <p>{props.errorText}</p>}
    </div>
  );
}
