// src/components/VideoLayout.jsx
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const VideoLayout = () => {
  const videoRef  = useRef(null);
  const [duration, setDuration]       = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [watchedSet, setWatchedSet]   = useState(new Set());

  // 1️⃣ On mount, fetch saved progress
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5001/api/progress/sample.mp4", {
        headers: { Authorization: token }
      })
      .then(({ data }) => {
        setWatchedSet(new Set(data.watched));
        setCurrentTime(data.currentTime);
        if (videoRef.current) {
          videoRef.current.currentTime = data.currentTime;
        }
      })
      .catch(console.error);
  }, []);

  // 2️⃣ Attach video listeners and save each new second
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const saveProgress = (watchedArray, time) => {
      const token = localStorage.getItem("token");
      axios
        .post(
          "http://localhost:5001/api/progress/sample.mp4",
          { watched: watchedArray, currentTime: time },
          { headers: { Authorization: token } }
        )
        .catch(console.error);
    };

    const handleLoadedMetadata = () => {
      setDuration(Math.floor(video.duration));
    };

    const handleTimeUpdate = () => {
      const t = Math.floor(video.currentTime);
      setCurrentTime(t);

      setWatchedSet(prev => {
        if (prev.has(t)) return prev;
        const updated = new Set(prev).add(t);
        saveProgress(Array.from(updated), t);
        return updated;
      });
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  const formatTime = secs => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const percentage = duration
    ? ((watchedSet.size / duration) * 100).toFixed(2)
    : 0;

  return (
    <div className="p-8 max-w-xl mx-auto text-center">
      <h2 className="text-2xl font-semibold mb-6">
        🎥 Video Progress Tracker (Skip-proof)
      </h2>

      <video
        ref={videoRef}
        src="http://localhost:5001/videos/sample.mp4"
        controls
        className="w-full rounded-lg mb-4"
      />

      <div className="text-left text-base space-y-2 bg-gray-100 p-4 rounded-lg shadow">
        <p><strong>▶ Current Time:</strong> {formatTime(currentTime)}</p>
        <p><strong>⏳ Total Duration:</strong> {formatTime(duration)}</p>
        <p><strong>📊 Watched:</strong> {watchedSet.size} sec</p>
        <p><strong>📈 Percentage Watched:</strong> {percentage}%</p>
      </div>
    </div>
  );
};

export default VideoLayout;
