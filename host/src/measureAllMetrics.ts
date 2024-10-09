import { onCLS, onINP, onLCP, onFCP, onTTFB } from "web-vitals";
// Function to report metrics
const reportWebVitals = (onPerfEntry?: (metric: any) => void) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Cumulative Layout Shift (CLS): Measures visual stability
    // Relevance: Indicates how much unexpected layout shifts occur during page load
    // Target: Lower is better (ideally below 0.1)
    onCLS((metric) => {
      console.log(`CLS: ${metric.value.toFixed(3)} - Rating: ${metric.rating}`);
      onPerfEntry(metric);
    });

    // Interaction to Next Paint (INP): Measures responsiveness
    // Relevance: Shows how quickly the page responds to user interactions
    // Target: Lower is better (ideally below 200ms)
    onINP((metric) => {
      console.log(
        `INP: ${metric.value.toFixed(0)}ms - Rating: ${metric.rating}`
      );
      onPerfEntry(metric);
    });

    // Largest Contentful Paint (LCP): Measures loading performance
    // Relevance: Indicates when the largest content element becomes visible
    // Target: Lower is better (ideally below 2.5 seconds)
    onLCP((metric) => {
      console.log(
        `LCP: ${(metric.value / 1000).toFixed(2)}s - Rating: ${metric.rating}`
      );
      onPerfEntry(metric);
    });

    // First Contentful Paint (FCP): Measures initial render time
    // Relevance: Shows how quickly the first piece of content is displayed
    // Target: Lower is better (ideally below 1.8 seconds)
    onFCP((metric) => {
      console.log(
        `FCP: ${(metric.value / 1000).toFixed(2)}s - Rating: ${metric.rating}`
      );
      onPerfEntry(metric);
    });

    // Time to First Byte (TTFB): Measures server response time
    // Relevance: Indicates how fast the server responds to initial request
    // Target: Lower is better (ideally below 0.8 seconds)
    onTTFB((metric) => {
      console.log(
        `TTFB: ${(metric.value / 1000).toFixed(2)}s - Rating: ${metric.rating}`
      );
      onPerfEntry(metric);
    });
  }
};

// measures 2 important web performance metrics: Time to Interactive (TTI) and Total Blocking Time (TBT)
const measurePerformance = () => {
  const performanceEntries = performance.getEntriesByType("navigation");
  if (performanceEntries.length > 0) {
    const navigationEntry =
      performanceEntries[0] as PerformanceNavigationTiming;
    const ttiInSeconds = (navigationEntry.domInteractive / 1000).toFixed(2);
    const tbtInSeconds = (
      (navigationEntry.domContentLoadedEventEnd -
        navigationEntry.domContentLoadedEventStart) /
      1000
    ).toFixed(2);

    console.log("Time to Interactive (TTI):", ttiInSeconds, "seconds");
    console.log("Total Blocking Time (TBT):", tbtInSeconds, "seconds");
  }
};

// Measure Network resource all scripts Bundle Size
const measureJSBundleSize = () => {
  const resources = performance.getEntriesByType("resource");
  let totalTransferredSize = 0;
  let totalDecodedSize = 0;
  let scriptCount = 0;
  let cachedScriptCount = 0;

  resources.forEach((resource) => {
    if (resource.initiatorType === "script") {
      const res = resource as PerformanceResourceTiming;
      totalDecodedSize += res.decodedBodySize;
      scriptCount++;

      if (res.transferSize === 0 && res.decodedBodySize > 0) {
        cachedScriptCount++;
        console.log(`${res.name} was loaded from cache`);
      } else {
        totalTransferredSize += res.transferSize;
      }
    }
  });

  const transferredSizeInKB = (totalTransferredSize / 1024).toFixed(2);
  const transferredSizeInMB = (totalTransferredSize / (1024 * 1024)).toFixed(2);
  const decodedSizeInKB = (totalDecodedSize / 1024).toFixed(2);
  const decodedSizeInMB = (totalDecodedSize / (1024 * 1024)).toFixed(2);

  console.log(
    `JS Bundle Size (${scriptCount} scripts, ${cachedScriptCount} cached):`,
    `\nTransferred: ${transferredSizeInKB} KB (${transferredSizeInMB} MB)`,
    `\nDecoded: ${decodedSizeInKB} KB (${decodedSizeInMB} MB)`
  );
};

const measureAdditionalMetrics = () => {
  // Measure Memory Usage
  if ("memory" in performance) {
    const memoryInfo = (performance as any).memory;
    const usedHeapSize = (memoryInfo.usedJSHeapSize / (1024 * 1024)).toFixed(2);
    const totalHeapSize = (memoryInfo.totalJSHeapSize / (1024 * 1024)).toFixed(
      2
    );
    const heapLimit = (memoryInfo.jsHeapSizeLimit / (1024 * 1024)).toFixed(2);

    console.log(`Memory Usage:
      - Used Heap: ${usedHeapSize} MB
      - Total Heap: ${totalHeapSize} MB
      - Heap Limit: ${heapLimit} MB
      - Usage: ${(
        (memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) *
        100
      ).toFixed(2)}% of available memory`);
  }

  // Measure Resource Timing
  const resourceEntries = performance.getEntriesByType("resource");
  resourceEntries.forEach((entry) => {
    if (entry.initiatorType === "script" || entry.initiatorType === "link") {
      console.log(
        `Resource Load Time (${entry.name}): ${entry.duration.toFixed(2)}ms`
      );
    }
  });
};

export const measureAllMetrics = () => {
  // Report web vitals
  reportWebVitals(console.log);
  measurePerformance();
  measureJSBundleSize();
  measureAdditionalMetrics();
};
