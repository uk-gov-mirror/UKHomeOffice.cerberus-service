import React from 'react';
import classNames from 'classnames';

const Label = ({
  className, isPageHeading = false, htmlFor, children, ...attributes
}) => {
  if (isPageHeading === true) {
    return <h1 className={classNames(className, 'govuk-label-wrapper')} {...attributes}>{children}</h1>;
  }

  return (
    <label className={classNames(className, 'govuk-label')} htmlFor={htmlFor} {...attributes}>
      {children}
    </label>
  );
};

export default Label;
