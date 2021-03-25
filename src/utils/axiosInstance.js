import axios from 'axios';
import { useEffect, useState } from 'react';
import { useKeycloak } from './keycloak';

const useAxiosInstance = (baseURL = '/') => {
  const keycloak = useKeycloak();
  const [axiosInstance, setAxiosInstance] = useState({});

  useEffect(() => {
    const instance = axios.create({
      baseURL,
      headers: {
        Authorization: keycloak ? `Bearer ${keycloak.token}` : undefined,
      },
    });

    setAxiosInstance({ instance });

    return () => {
      setAxiosInstance({});
    };
  }, [keycloak?.token]);

  return axiosInstance.instance;
};

export default useAxiosInstance;
