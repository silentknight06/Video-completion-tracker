export const mergeIntervals = (intervals) => {
    if (!intervals.length) return [];
  
    intervals.sort((a, b) => a[0] - b[0]);
    const merged = [intervals[0]];
  
    for (let i = 1; i < intervals.length; i++) {
      const last = merged[merged.length - 1];
      const current = intervals[i];
  
      if (last[1] >= current[0]) {
        last[1] = Math.max(last[1], current[1]);
      } else {
        merged.push(current);
      }
    }
  
    return merged;
  };
  
  export const getTotalWatchedTime = (intervals) => {
    return intervals.reduce((total, [start, end]) => total + (end - start), 0);
  };
  