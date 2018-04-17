import React from 'react';
import { Button } from 'semantic-ui-react';

//this component takes props, but we're not passing props down. Not explicit, it is implicit.
// these get passed in by braintree dropin react
const RenderSubmitButton = ({
  onClick,
  isDisabled,
  text
}) => (
  <Button
    primary
    onClick={onClick}
    disabled={isDisabled}
  >
    {text}
  </Button>
)

export default RenderSubmitButton;