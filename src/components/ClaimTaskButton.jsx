import React, { useState } from 'react';
import LinkButton from '../govuk/LinkButton';
import useAxiosInstance from '../utils/axiosInstance';
import config from '../config';
import { useKeycloak } from '../utils/keycloak';

const ClaimTaskButton = ({ assignee, taskId, setError = () => {}, ...props }) => {
  const [isAssignmentInProgress, setAssignmentProgress] = useState(false);
  const keycloak = useKeycloak();
  const camundaClient = useAxiosInstance(keycloak, config.camundaApiUrl);
  const currentUser = keycloak.tokenParsed.email;

  const CommonButton = (p) => (
    <span className="govuk-!-margin-left-3">
      {isAssignmentInProgress
        ? <span className="govuk-body">Please wait...</span>
        : <LinkButton type="button" {...p} />}
    </span>
  );

  const handleClaim = async () => {
    try {
      setAssignmentProgress(true);
      await camundaClient.post(`task/${taskId}/claim`, {
        userId: currentUser,
      });
      history.go(0);
    } catch (e) {
      setError(e.message);
      setAssignmentProgress(false);
    }
  };

  const handleUnclaim = async () => {
    try {
      setAssignmentProgress(true);
      await camundaClient.post(`task/${taskId}/unclaim`, {
        userId: currentUser,
      });
      history.go(0);
    } catch (e) {
      setError(e.message);
      setAssignmentProgress(false);
    }
  };

  if (assignee === currentUser) {
    return <CommonButton onClick={handleUnclaim} {...props}>Unclaim</CommonButton>;
  }
  if (!assignee) {
    return <CommonButton onClick={handleClaim} {...props}>Claim</CommonButton>;
  }
  return null;
};

export default ClaimTaskButton;
