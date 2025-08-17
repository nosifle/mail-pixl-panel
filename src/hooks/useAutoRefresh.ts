import { useEffect, useRef } from 'react';

interface UseAutoRefreshOptions {
  enabled: boolean;
  interval?: number; // in milliseconds, default 30 seconds
  onRefresh: () => Promise<void> | void;
}

export const useAutoRefresh = ({ 
  enabled, 
  interval = 30000, 
  onRefresh 
}: UseAutoRefreshOptions) => {
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
      return;
    }

    // Очищаем предыдущий интервал
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Устанавливаем новый интервал
    intervalRef.current = setInterval(async () => {
      try {
        await onRefresh();
      } catch (error) {
        console.error('Auto refresh error:', error);
      }
    }, interval);

    // Cleanup функция
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
    };
  }, [enabled, interval, onRefresh]);

  // Cleanup при размонтировании
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
};