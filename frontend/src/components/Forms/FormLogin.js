import React, { useState } from "react";
import { Form, Button, Spinner } from "react-bootstrap";

import useInput from "../../hooks/use-input";

// Form : User login
const FormLogin = (props) => {
  const isLoading = props.isLoading; // get <isLoading> status from props (for display and disable button)
  const [formIsSubmitted, setFormIsSubmitted] = useState(false);

  // typed in username (using use-input custom hook)
  const {
    value: username,
    isValid: usernameIsValid,
    hasError: usernameHasError,
    valueChangeHandler: usernameChangedHandler,
    inputBlurHandler: usernameBlurHandler,
    // reset: resetUsernameInput,
  } = useInput((value) => value.trim() !== ""); // username input is valid if not empty

  // typed in password (using use-input custom hook)
  const {
    value: password,
    isValid: passwordIsValid,
    hasError: passwordHasError,
    valueChangeHandler: passwordChangedHandler,
    inputBlurHandler: passwordBlurHandler,
    // reset: resetPasswordInput,
  } = useInput((value) => value.trim() !== ""); // password input is valid if not empty

  // remember me checkbox
  const [rememberMe, setRememberMe] = useState(false);

  let formIsValid = usernameIsValid && passwordIsValid;

  // on form submission - check if all fields are valid and call <onSubmit> function passed from props
  const submitHandler = (event) => {
    event.preventDefault(); // prevent form submission's default action that would reload the page
    setFormIsSubmitted(true);
    // if any of form's inputs is not valid, return
    if (!formIsValid) {
      return;
    }
    // otherwise call <onSubmit> function passed through props
    props.onSubmit(username, password, rememberMe);
  };

  return (
    <Form
      onSubmit={submitHandler}
      className="rounded border border-dark bg-dark pt-2 pb-3 px-5"
    >
      <h2 className="text-light">Στοιχεία Σύνδεσης</h2>

      <Form.Label htmlFor="username-input" className="text-center text-light">
        Όνομα Χρήστη
      </Form.Label>
      <Form.Control
        aria-describedby="username-error-block"
        name="username-input"
        type="text"
        disabled={isLoading}
        onChange={usernameChangedHandler}
        onBlur={usernameBlurHandler}
        value={username}
      />
      <p
        className={`text-danger ${
          formIsSubmitted && usernameHasError ? "visible" : "invisible"
        }`}
      >
        Εισάγετε μία τιμή στο πεδίο Όνομα Χρήστη
      </p>
      <Form.Label htmlFor="password-input" className="text-center text-light">
        Κωδικός Πρόσβασης
      </Form.Label>
      <Form.Control
        name="password-input"
        type="password"
        disabled={isLoading}
        onChange={passwordChangedHandler}
        onBlur={passwordBlurHandler}
        value={password}
      />
      <p
        className={`text-danger ${
          formIsSubmitted && passwordHasError ? "visible" : "invisible"
        }`}
      >
        Εισάγετε μία τιμή στο πεδίο Κωδικός Πρόσβασης
      </p>
      <Form.Check
        type="checkbox"
        label="Διατήρηση Σύνδεσης"
        className="text-light d-flex gap-2 align-items-center"
        value={rememberMe}
        onClick={() => setRememberMe((prev) => !prev)}
      />

      <div className="d-grid gap-2 my-2">
        <Button type="submit" variant="light" size="lg" disabled={isLoading}>
          {isLoading && (
            <Spinner
              as="span"
              animation="border"
              variant="dark"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          )}
          Είσοδος
        </Button>
      </div>
    </Form>
  );
};

export default FormLogin;
