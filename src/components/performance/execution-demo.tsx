'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw } from 'lucide-react';

/**
 * JavaScript Execution Optimization Demo
 * 
 * Demonstrates the difference between blocking and non-blocking JavaScript execution
 * Shows how our optimization techniques prevent main-thread blocking
 */
export function ExecutionOptimizationDemo() {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [executionMode, setExecutionMode] = useState<'blocking' | 'optimized'>('optimized');
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [frameDrops, setFrameDrops] = useState(0);

  // Simulate heavy computation that would normally block the main thread
  const heavyComputation = useCallback((iterations: number = 100000): Promise<number> => {
    return new Promise((resolve) => {
      let result = 0;
      let processed = 0;

      const processChunk = () => {
        const chunkSize = executionMode === 'blocking' ? iterations : Math.min(1000, iterations - processed);
        const chunkEnd = Math.min(processed + chunkSize, iterations);

        // Simulate heavy computation
        for (let i = processed; i < chunkEnd; i++) {
          result += Math.sqrt(i) * Math.sin(i) * Math.cos(i);
        }

        processed = chunkEnd;
        setProgress((processed / iterations) * 100);

        if (processed < iterations) {
          if (executionMode === 'blocking') {
            // Blocking mode - continue synchronously
            processChunk();
          } else {
            // Optimized mode - yield control back to browser
            requestAnimationFrame(processChunk);
          }
        } else {
          resolve(result);
        }
      };

      processChunk();
    });
  }, [executionMode]);

  // Monitor frame drops during execution
  useEffect(() => {
    if (!isRunning) return;

    let lastTime = performance.now();
    let drops = 0;

    const checkFrameRate = () => {
      const currentTime = performance.now();
      const deltaTime = currentTime - lastTime;
      
      // If frame time > 16.67ms (60fps), it's a frame drop
      if (deltaTime > 20) {
        drops++;
        setFrameDrops(prev => prev + 1);
      }
      
      lastTime = currentTime;
      
      if (isRunning) {
        requestAnimationFrame(checkFrameRate);
      }
    };

    requestAnimationFrame(checkFrameRate);
  }, [isRunning]);

  const runDemo = async () => {
    setIsRunning(true);
    setProgress(0);
    setFrameDrops(0);
    setExecutionTime(null);

    const startTime = performance.now();
    
    try {
      await heavyComputation(50000);
      const endTime = performance.now();
      setExecutionTime(endTime - startTime);
    } catch (error) {
      console.error('Execution error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const resetDemo = () => {
    setIsRunning(false);
    setProgress(0);
    setFrameDrops(0);
    setExecutionTime(null);
  };

  return (
    <div className="border rounded-lg p-6 space-y-4 bg-card">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">JavaScript Execution Optimization Demo</h3>
        <p className="text-sm text-muted-foreground">
          Compare blocking vs non-blocking JavaScript execution. The optimized mode prevents main-thread blocking.
        </p>
      </div>

      {/* Execution Mode Toggle */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Execution Mode:</span>
        <Button
          variant={executionMode === 'blocking' ? 'destructive' : 'outline'}
          size="sm"
          onClick={() => setExecutionMode('blocking')}
          disabled={isRunning}
        >
          Blocking (Old)
        </Button>
        <Button
          variant={executionMode === 'optimized' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setExecutionMode('optimized')}
          disabled={isRunning}
        >
          Optimized (New)
        </Button>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Computation Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-medium">Frame Drops:</span>
          <Badge variant={frameDrops > 10 ? 'destructive' : frameDrops > 5 ? 'secondary' : 'default'} className="ml-2">
            {frameDrops}
          </Badge>
        </div>
        <div>
          <span className="font-medium">Execution Time:</span>
          {executionTime ? (
            <Badge variant="outline" className="ml-2">
              {Math.round(executionTime)}ms
            </Badge>
          ) : (
            <span className="ml-2 text-muted-foreground">—</span>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <Button
          onClick={runDemo}
          disabled={isRunning}
          size="sm"
          className="flex items-center gap-2"
        >
          <Play className="h-4 w-4" />
          Run Demo
        </Button>
        <Button
          onClick={resetDemo}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>

      {/* Explanation */}
      <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
        <strong>How it works:</strong><br />
        • <strong>Blocking mode:</strong> Executes all computation synchronously, blocking the main thread<br />
        • <strong>Optimized mode:</strong> Breaks computation into chunks using requestAnimationFrame<br />
        • <strong>Frame drops:</strong> Indicates when the browser can't maintain 60fps due to blocking<br />
        • <strong>Our app:</strong> Uses this technique to prevent the 53.3kB framework chunk from blocking execution
      </div>

      {/* Results Interpretation */}
      {executionTime && (
        <div className={`text-sm p-3 rounded ${
          executionMode === 'blocking' 
            ? 'bg-red-50 text-red-800 border border-red-200' 
            : 'bg-green-50 text-green-800 border border-green-200'
        }`}>
          {executionMode === 'blocking' ? (
            <>
              <strong>⚠️ Blocking Execution:</strong> Main thread was blocked for {Math.round(executionTime)}ms. 
              Frame drops: {frameDrops}. User interface would feel frozen.
            </>
          ) : (
            <>
              <strong>✅ Optimized Execution:</strong> Non-blocking execution took {Math.round(executionTime)}ms 
              with only {frameDrops} frame drops. User interface remains responsive.
            </>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Real-time Performance Monitor
 * Shows current JavaScript execution performance
 */
export function RealTimePerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    jsHeapSize: 0,
    usedJSHeapSize: 0,
    jsHeapSizeLimit: 0,
    fps: 0,
    lastFrameTime: 0,
  });

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let lastFpsUpdate = lastTime;

    const updateMetrics = () => {
      const currentTime = performance.now();
      frameCount++;

      // Update FPS every second
      if (currentTime - lastFpsUpdate >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastFpsUpdate));
        frameCount = 0;
        lastFpsUpdate = currentTime;

        // Get memory info if available
        const memory = (performance as any).memory;
        
        setMetrics({
          jsHeapSize: memory ? Math.round(memory.totalJSHeapSize / 1024 / 1024) : 0,
          usedJSHeapSize: memory ? Math.round(memory.usedJSHeapSize / 1024 / 1024) : 0,
          jsHeapSizeLimit: memory ? Math.round(memory.jsHeapSizeLimit / 1024 / 1024) : 0,
          fps,
          lastFrameTime: Math.round(currentTime - lastTime),
        });
      }

      lastTime = currentTime;
      requestAnimationFrame(updateMetrics);
    };

    requestAnimationFrame(updateMetrics);
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-4 left-4 bg-black text-white p-3 rounded text-xs space-y-1 z-50 font-mono">
      <div className="font-semibold text-green-400">Performance Monitor</div>
      <div>FPS: <span className={`${metrics.fps < 50 ? 'text-red-400' : 'text-green-400'}`}>{metrics.fps}</span></div>
      <div>Frame Time: <span className={`${metrics.lastFrameTime > 16 ? 'text-red-400' : 'text-green-400'}`}>{metrics.lastFrameTime}ms</span></div>
      {metrics.jsHeapSize > 0 && (
        <div>Memory: <span className="text-blue-400">{metrics.usedJSHeapSize}MB</span>/{metrics.jsHeapSize}MB</div>
      )}
    </div>
  );
} 