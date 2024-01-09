// App.js

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import ReactPlayer from 'react-player';
import './App.css';

function App() {
  const [videoUrl, setVideoUrl] = useState('');
  const [subtitles, setSubtitles] = useState([]);
  const { handleSubmit, control, register } = useForm();

  const onSubmit = (data) => {
    const newSubtitle = {
      start: data.startTime,
      end: data.endTime,
      text: data.subtitleText,
    };
    setSubtitles([...subtitles, newSubtitle]);
  };

  return (
    <div className="App">
      <h1>Video Subtitle App</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          Upload Video:
          <input
            type="text"
            placeholder="Enter video URL"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
        </label>
        <br />
        <label>
          Add Subtitle:
          <input
            type="text"
            placeholder="Start Time (in seconds)"
            {...register('startTime', { required: true, pattern: /^\d+(\.\d{1,2})?$/ })}
          />
          <input
            type="text"
            placeholder="End Time (in seconds)"
            {...register('endTime', { required: true, pattern: /^\d+(\.\d{1,2})?$/ })}
          />
          <input
            type="text"
            placeholder="Subtitle Text"
            {...register('subtitleText', { required: true })}
          />
          <button type="submit">Add Subtitle</button>
        </label>
      </form>
      <ReactPlayer url={videoUrl} controls playing width="100%" />
      <div className="subtitles">
        {subtitles.map((subtitle, index) => (
          <div key={index} className="subtitle">
            <span>{subtitle.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
