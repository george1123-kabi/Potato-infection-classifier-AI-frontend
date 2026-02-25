import React, { useState } from 'react';
import { Camera, Upload, CheckCircle, Loader2 } from 'lucide-react';
import './App.css'// Importing your CSS file
import axios from 'axios';

const PotatoClassifier = () => {
  const [image,setImage] = useState(null)
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [action,setAction] = useState(null)



  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setPrediction(null);
      setImage(file)
    }
  };

  const analyzeImage = async () => {
    setIsLoading(true);
    // Simulating the backend response
    // setTimeout(() => {
    //   setPrediction({
    //     label: "Late Blight",
    //     confidence: 0.98,
    //     treatment: "Ensure better air circulation and use fungicides immediately."
    //   });
    //   setIsLoading(false);
    // }, 2000);
    const formdata = new FormData()

    formdata.append('file',image)

    const response = await axios.post(import.meta.env.VITE_API_URL+'/predict',formdata)
  
 
    setPrediction(response.data)
    setIsLoading(false)
   };

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="title">SpudScan AI</h1>
        <p className="subtitle">Instant Potato Health Check</p>
      </header>

      <main className="main-content">
        <div className="upload-card">
          {preview ? (
            <img src={preview} alt="Leaf preview" className="preview-image" />
          ) : (
            <div className="placeholder-box">
              <Camera size={48} />
              <p>Take a photo of the leaf</p>
            </div>
          )}

          <div className="button-group">
            <label className="upload-btn">
              <Upload size={20} />
              <span>{preview ? "Change Photo" : "Upload Photo"}</span>
              <input 
                type="file" 
                accept="image/*" 
                capture="environment" 
                onChange={handleImageChange} 
                style={{ display: 'none' }} 
              />
            </label>

            {preview && !prediction && (
              <button 
                onClick={analyzeImage} 
                disabled={isLoading}
                className="analyze-btn"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : "Analyze Now"}
              </button>
            )}
          </div>
        </div>

        {prediction && (
          <div className="result-card">
            <div className="result-header">
              <CheckCircle color="#22c55e" />
              <h3>Analysis Results</h3>
            </div>
            <div className="badge">{prediction.class_name}</div>
            <p>Confidence: <strong>{(prediction.confidence * 100).toFixed(1)}%</strong></p>
            <div className="treatment-box">
              <strong>Action Plan:</strong>
              <p>{prediction.action}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PotatoClassifier;