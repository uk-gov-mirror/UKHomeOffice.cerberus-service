import React from 'react';
import classNames from 'classnames';
import Button from './Button';

const SecondaryButton = ({ className, ...attributes }) => {
  return <Button className={classNames(className, 'govuk-button--secondary')} {...attributes} />;
}

export default SecondaryButton;
