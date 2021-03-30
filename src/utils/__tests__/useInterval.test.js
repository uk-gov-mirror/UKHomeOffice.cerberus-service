import { renderHook } from '@testing-library/react-hooks';
import useInterval from '../useInterval';

describe('useInterval Hook:', () => {
  let callback = jest.fn();

  beforeEach(() => {
    // we're using fake timers because we don't want to
    // wait a full 60sec for this test to run.
    jest.useFakeTimers();
  });

  afterEach(() => {
    callback.mockRestore();
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should initialize hook with 60sec delay', () => {
    const { result } = renderHook(() => useInterval(callback, 60000));

    expect(result.current).toBeUndefined();
    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 60000);
  });

  test('should repeatedly calls provided callback with a fixed time delay between each call', () => {
    // eslint-disable-next-line no-unused-vars
    const { result } = renderHook(() => useInterval(callback, 60000));
    expect(callback).not.toHaveBeenCalled();

    // fast-forward time until 1s before it should be executed
    jest.advanceTimersByTime(59999);
    expect(callback).not.toHaveBeenCalled();

    // fast-forward until 1st call should be executed
    jest.advanceTimersToNextTimer(1);
    expect(callback).toHaveBeenCalledTimes(1);

    // fast-forward until next timer should be executed
    jest.advanceTimersToNextTimer();
    expect(callback).toHaveBeenCalledTimes(2);

    // fast-forward until 3 more timers should be executed
    jest.advanceTimersToNextTimer(3);
    expect(callback).toHaveBeenCalledTimes(5);
  });
});
