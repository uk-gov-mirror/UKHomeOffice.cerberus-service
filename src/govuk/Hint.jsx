import React from 'react';
import classNames from 'classnames';

const Hint = ({ className, children, ...attributes }) => (
  <div className={classNames(className, 'govuk-hint')} {...attributes}>
    {children}
  </div>
);

export default Hint;
