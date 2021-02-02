import React from 'react';
import classNames from 'classnames';
import Button from './Button';

const SecondaryButton = ({ className, type = 'button', ...attributes }) => {
  return <Button type={type} className={classNames(className, 'govuk-button--secondary')} {...attributes} />;
};

export default SecondaryButton;
