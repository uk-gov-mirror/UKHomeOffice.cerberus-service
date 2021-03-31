import React from 'react';
import classNames from 'classnames';

import './__assets__/LinkButton.scss';

const LinkButton = ({ className, ...props }) => (
  <button className={classNames('link-button', className)} {...props} />
);

export default LinkButton;
