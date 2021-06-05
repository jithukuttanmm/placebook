import { useCallback, useReducer } from "react";

const formReducer = (state, action) => {
  switch (action.type) {
    case "IMPUT_CHANGE":
      let formValid = true;
      for (let inputId in state.inputs) {
        if (!state.inputs[inputId]) continue;
        if (inputId === action.inputId) formValid = formValid && action.isValid;
        else formValid = formValid && state.inputs[inputId].isValid;
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: {
            value: action.value,
            isValid: action.isValid,
          },
        },
        isValid: formValid,
      };
    case "SET_DATA":
      return {
        inputs: action.inputs,
        isValid: action.isValid,
      };
    default:
      return state;
  }
};
export const UserForm = (initialInputs, initialFormValidity) => {
  const [formState, dispatch] = useReducer(formReducer, {
    isValid: initialFormValidity,
    inputs: initialInputs,
  });
  const inputHandler = useCallback((id, value, isValid) => {
    dispatch({
      type: "IMPUT_CHANGE",
      value,
      isValid,
      inputId: id,
    });
  }, []);
  const setFormData = useCallback((inputData, formValidity) => {
    dispatch({
      type: "SET_DATA",
      inputs: inputData,
      isValid: formValidity,
    });
  }, []);
  return [formState, inputHandler, setFormData];
};
