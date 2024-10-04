import React, { useEffect, useState } from "react";
import "./Strengthvids.css";

const Strengthvids = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const API_KEY = "AIzaSyDHYOXeJvtvU3QryCN8tvwN4If-8xhl9oo"; // Make sure this is the updated API key
      const searchQuery = "strength training";
      const maxResults = 16;

      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
            searchQuery
          )}&type=video&maxResults=${maxResults}&key=${API_KEY}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.items) {
          const fetchedVideos = data.items.map((item) => ({
            title: item.snippet.title,
            videoId: item.id.videoId,
            thumbnail: item.snippet.thumbnails.high.url,
          }));
          setVideos(fetchedVideos);
        } else {
          console.error(
            "No videos found or error in response data structure:",
            data
          );
        }
      } catch (error) {
        console.error("Error fetching YouTube videos:", error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="strength-vids-container">
      <div className="circle-1"></div>
      <div className="circle-2"></div>
      <h2 className="strength-vids-header">Strength Training Videos</h2>
      <div className="video-list">
        {videos.map((video) => (
          <div key={video.videoId} className="video-card">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="video-thumbnail"
            />
            <h3 className="video-title">{video.title}</h3>
            <a
              href={`https://www.youtube.com/watch?v=${video.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="watch-video-link"
            >
              Watch Video
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Strengthvids;
