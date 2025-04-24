import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VideoLayout = () => {
  const videoRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [watchedSet, setWatchedSet] = useState(new Set());
  const [isMetadataLoaded, setIsMetadataLoaded] = useState(false);
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL || "https://video-completion-tracker.onrender.com";

  // 🔐 Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // 1️⃣ Fetch saved progress on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(API_URL + "/api/progress/sample.mp4", {
        headers: { Authorization: token },
      })
      .then(({ data }) => {
        setWatchedSet(new Set(data.watched));
        setCurrentTime(data.currentTime);
      })
      .catch(console.error);
  }, []);

  // 2️⃣ Attach video listeners and save each second
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const saveProgress = (watchedArray, time) => {
      const token = localStorage.getItem("token");
      axios
        .post(
          API_URL + "/api/progress/sample.mp4",
          { watched: watchedArray, currentTime: time },
          { headers: { Authorization: token } }
        )
        .catch(console.error);
    };

    const handleLoadedMetadata = () => {
      setDuration(Math.floor(video.duration));
      setIsMetadataLoaded(true);
      // Now it's safe to set saved progress time
      setTimeout(() => {
        if (currentTime > 0) {
          video.currentTime = currentTime;
        }
      }, 100);
    };

    const handleTimeUpdate = () => {
      const t = Math.floor(video.currentTime);
      setCurrentTime(t);

      setWatchedSet((prev) => {
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
  }, [currentTime]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const percentage =
    duration > 0 ? ((watchedSet.size / duration) * 100).toFixed(2) : 0;

    return (
      <div className="relative min-h-screen bg-white">
        {/* 🔓 Logout Button - fixed to top-right corner */}
        <button
          onClick={handleLogout}
          className="fixed top-4 right-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow z-50"
        >
          Logout
        </button>
    
        <div className="p-8 max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-6">
            🎥 Video Progress Tracker (Skip-proof)
          </h2>
    
          <video
            ref={videoRef}
            src={API_URL + "/videos/sample.mp4"}
            controls
            className="w-full rounded-lg mb-4"
          />
    
          {isMetadataLoaded && (
            <div className="text-left text-base space-y-2 bg-gray-100 p-4 rounded-lg shadow">
              <p>
                <strong>▶ Current Time:</strong> {formatTime(currentTime)}
              </p>
              <p>
                <strong>⏳ Total Duration:</strong> {formatTime(duration)}
              </p>
              <p>
                <strong>📊 Watched:</strong> {watchedSet.size} sec
              </p>
              <p>
                <strong>📈 Percentage Watched:</strong> {percentage}%
              </p>
            </div>
          )}
        </div>
      </div>
    );
    
};

export default VideoLayout;
