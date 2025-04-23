import React, { useRef, useEffect, useState } from 'react';
import { mergeIntervals, getTotalWatchedTime } from '../utils/intervalUtils';

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const videoId = 'sample-video'; // Unique identifier
  const [watchedIntervals, setWatchedIntervals] = useState([]);
  const [currentInterval, setCurrentInterval] = useState([null, null]);
  const [progress, setProgress] = useState(0);
  const videoDuration = 60; // seconds (you can also use videoRef.current.duration dynamically)

  useEffect(() => {
    const savedData = localStorage.getItem(`progress_${videoId}`);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setWatchedIntervals(parsed.intervals || []);
      setProgress(parsed.progress || 0);
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;

    const handlePlay = () => {
      setCurrentInterval([video.currentTime, null]);
    };

    const handlePause = () => {
      if (currentInterval[0] !== null) {
        const newInterval = [currentInterval[0], video.currentTime];
        const merged = mergeIntervals([...watchedIntervals, newInterval]);
        const totalWatched = getTotalWatchedTime(merged);
        const newProgress = ((totalWatched / videoDuration) * 100).toFixed(2);

        setWatchedIntervals(merged);
        setProgress(newProgress);
        setCurrentInterval([null, null]);

        localStorage.setItem(`progress_${videoId}`, JSON.stringify({
          intervals: merged,
          progress: newProgress
        }));
      }
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handlePause);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handlePause);
    };
  }, [currentInterval, watchedIntervals]);

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">📹 Video Progress Tracker</h2>
      <video
        ref={videoRef}
        width="640"
        height="360"
        controls
        src="/sample.mp4" // Place file inside /public folder
        className="mb-4"
      />
      <div className="text-lg">
        Watched Progress: <span className="font-bold">{progress}%</span>
      </div>
    </div>
  );
};

export default VideoPlayer;
