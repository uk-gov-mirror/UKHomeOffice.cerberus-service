import React, { useEffect } from 'react';
import classNames from 'classnames';
import ButtonJS from 'govuk-frontend/govuk/components/button/button';

const Button = ({
  isStartButton = false, type = 'submit', component = 'button',
  preventDoubleClick = null, className, children, ...attributes
}) => {
  const buttonRef = React.createRef();
  useEffect(() => {
    new ButtonJS(buttonRef.current).init();
  }, []);

  const buttonAttributes = {
    ...attributes,
    type,
    'data-module': 'govuk-button',
    'data-prevent-double-click': preventDoubleClick,
  };

  if (attributes.disabled) {
    buttonAttributes['aria-disabled'] = true;
    buttonAttributes.disabled = 'disabled';
  }

  const commonAttributes = {
    className: classNames(className, 'govuk-button', {
      'govuk-button--disabled': attributes.disabled,
      'govuk-button--start': isStartButton,
    }),
    ref: buttonRef,
  };

  const startButtonIcon = isStartButton ? (
    <svg className="govuk-button__start-icon" xmlns="http://www.w3.org/2000/svg" width="17.5" height="19" viewBox="0 0 33 40" role="presentation" focusable="false">
      <path fill="currentColor" d="M0 0h13l20 20-20 20H0l20-20z" />
    </svg>
  ) : null;

  if (component === 'a' || attributes.href || attributes.to) {
    const linkAttributes = {
      ...attributes,
      ...commonAttributes,
      role: 'button',
      draggable: 'false',
      'data-module': 'govuk-button',
    };

    return (
      <component {...linkAttributes}>
        {children}
        {startButtonIcon}
      </component>
    );
  } if (component === 'button') {
    return (
      <button {...buttonAttributes} {...commonAttributes}>
        {children}
        {startButtonIcon}
      </button>
    );
  } if (component === 'input') {
    return <input value={children} {...buttonAttributes} {...commonAttributes} />;
  }

  return null;
};

export default Button;
