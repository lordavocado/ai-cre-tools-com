'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface WorkerMessage {
  type: string;
  requestId: string;
  result?: any;
  error?: string;
}

interface WorkerTask {
  type: string;
  data: any;
  options?: any;
}

/**
 * Hook for using Web Workers to process heavy data off the main thread
 * Reduces main-thread blocking and improves performance
 */
export function useWebWorker(workerPath: string = '/workers/data-processor.js') {
  const workerRef = useRef<Worker | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pendingTasks = useRef<Map<string, { resolve: Function; reject: Function }>>(new Map());

  // Initialize worker
  useEffect(() => {
    if (typeof Worker !== 'undefined') {
      setIsSupported(true);
      
      try {
        workerRef.current = new Worker(workerPath);
        
        workerRef.current.onmessage = (event: MessageEvent<WorkerMessage>) => {
          const { type, requestId, result, error } = event.data;
          const pendingTask = pendingTasks.current.get(requestId);
          
          if (pendingTask) {
            if (type === 'SUCCESS') {
              pendingTask.resolve(result);
            } else if (type === 'ERROR') {
              pendingTask.reject(new Error(error));
            }
            pendingTasks.current.delete(requestId);
            
            if (pendingTasks.current.size === 0) {
              setIsLoading(false);
            }
          }
        };

        workerRef.current.onerror = (error) => {
          setError('Worker error: ' + error.message);
          setIsLoading(false);
        };

      } catch (err) {
        setError('Failed to create worker: ' + (err as Error).message);
        setIsSupported(false);
      }
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, [workerPath]);

  // Execute task in worker
  const executeTask = useCallback(async <T = any>(task: WorkerTask): Promise<T> => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current || !isSupported) {
        // Fallback to main thread if worker not supported
        console.warn('Web Worker not supported, falling back to main thread');
        reject(new Error('Web Worker not supported'));
        return;
      }

      const requestId = `task_${Date.now()}_${Math.random()}`;
      pendingTasks.current.set(requestId, { resolve, reject });
      
      setIsLoading(true);
      setError(null);
      
      workerRef.current.postMessage({
        ...task,
        requestId
      });

      // Timeout after 30 seconds
      setTimeout(() => {
        if (pendingTasks.current.has(requestId)) {
          pendingTasks.current.delete(requestId);
          reject(new Error('Worker task timeout'));
          setIsLoading(false);
        }
      }, 30000);
    });
  }, [isSupported]);

  // Convenient methods for common tasks
  const processData = useCallback((data: any[], options?: any) => {
    return executeTask({
      type: 'PROCESS_DATA',
      data,
      options
    });
  }, [executeTask]);

  const calculateAnalytics = useCallback((data: any[]) => {
    return executeTask({
      type: 'CALCULATE_ANALYTICS',
      data
    });
  }, [executeTask]);

  const optimizeSearch = useCallback((data: any[], options?: any) => {
    return executeTask({
      type: 'OPTIMIZE_SEARCH',
      data,
      options
    });
  }, [executeTask]);

  const heavyComputation = useCallback((data: any[]) => {
    return executeTask({
      type: 'HEAVY_COMPUTATION',
      data
    });
  }, [executeTask]);

  return {
    isSupported,
    isLoading,
    error,
    executeTask,
    processData,
    calculateAnalytics,
    optimizeSearch,
    heavyComputation
  };
}

/**
 * Fallback function for when Web Workers aren't supported
 * Performs computation on main thread but with requestAnimationFrame
 */
export function useFallbackProcessor() {
  const [isLoading, setIsLoading] = useState(false);

  const processWithRAF = useCallback((callback: () => any) => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      
      requestAnimationFrame(() => {
        try {
          const result = callback();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          setIsLoading(false);
        }
      });
    });
  }, []);

  return { processWithRAF, isLoading };
} 