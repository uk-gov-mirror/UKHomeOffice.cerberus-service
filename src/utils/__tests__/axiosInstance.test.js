import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { renderHook } from '@testing-library/react-hooks';
import useAxiosInstance from '../axiosInstance';

describe('axios hooks', () => {
  const mockAxios = new MockAdapter(axios);
  test('can perform a API call', async () => {
    mockAxios.onGet('/api/data').reply(200, [{ id: 'test' }]);
    const axiosInstance = renderHook(() => useAxiosInstance());

    const result = await axiosInstance.result.current.get('/api/data');
    expect(result.status).toBe(200);
    expect(result.data.length).toBe(1);
  });
});
