import axios from 'axios';

const useAxiosInstance = (keycloak, baseURL = '/') => axios.create({
  baseURL,
  headers: {
    Authorization: keycloak ? `Bearer ${keycloak.token}` : undefined,
  },
});

export default useAxiosInstance;
