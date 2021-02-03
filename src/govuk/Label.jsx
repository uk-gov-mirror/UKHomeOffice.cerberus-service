import React from 'react';
import classNames from 'classnames';

const Label = ({
  className, isPageHeading = false, children, ...attributes
}) => {
  if (isPageHeading === true) {
    return <h1 className={classNames(className, 'govuk-label-wrapper')} {...attributes}>{children}</h1>;
  }

  return (
    <label className={classNames(className, 'govuk-label')} {...attributes}>
      {children}
    </label>
  );
};

export default Label;
