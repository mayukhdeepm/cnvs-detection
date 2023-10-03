import React, { useState, useRef, useEffect } from "react";
import cv from "@techstark/opencv-js";
import { Tensor, InferenceSession } from "onnxruntime-web";
import Loader from "./components/loader";
import { detectImage } from "./utils/detect";
import {wValues} from "./utils/renderBox"
import "./style/App.css";

const App = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState("Loading OpenCV.js...");
  const [image, setImage] = useState(null);
  const inputImage = useRef(null);
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  let videoRef = useRef(null);
  let mediaStream = null;

  // Configs
  const modelName = "sep19-nails-2.onnx";
  const modelInputShape = [1, 3, 640, 640];
  const topk = 100;
  const iouThreshold = 0.45;
  const scoreThreshold = 0.2;

  // wait until opencv.js initialized
  cv["onRuntimeInitialized"] = async () => {
    // create session
    setLoading("Loading YOLOv8 model...");
    const [yolov8, nms] = await Promise.all([
      InferenceSession.create(`${process.env.PUBLIC_URL}/model/${modelName}`),
      InferenceSession.create(`${process.env.PUBLIC_URL}/model/nms-yolov8.onnx`),
    ]);

    // warmup main model
    setLoading("Warming up model...");
    const tensor = new Tensor(
      "float32",
      new Float32Array(modelInputShape.reduce((a, b) => a * b)),
      modelInputShape
    );
    await yolov8.run({ images: tensor });

    setSession({ net: yolov8, nms: nms });
    setLoading(null);
  };

  const startCamera = async () => {
      const constraints = {
        video: {
          facingMode: "environment", // Use the back camera
        },
        audio: false,
      };

      try {
        if (mediaStream) {
          mediaStream.getTracks().forEach(track => track.stop());
        }
  
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        mediaStream = stream;
        videoRef.current.srcObject = stream;

        const overlayImg = new Image();
      overlayImg.src = "https://cdn.glitch.global/986fc018-8516-42f5-af32-953ec30d55ab/Exclude.png?v=1695641257151"; // Use the path to your overlay image
      overlayImg.onload = () => {
        // Position the overlay image on top of the video element
        overlayImg.style.position = "absolute";
        overlayImg.style.top = "0";
        overlayImg.style.left = "0";
        overlayImg.style.width = "100%";
        overlayImg.style.height = "100%";
        overlayImg.style.pointerEvents = "none"; // Ensure the overlay doesn't block interactions
  
        // Append the overlay image to the container
        videoRef.current.parentNode.appendChild(overlayImg);
      }
      } catch (err) {
        console.log(err);
      }
  };

  useEffect(() => {
    startCamera();
  }, []);

  return (
    <div className="App">
      {loading && <Loader>{loading}</Loader>}
      <div className="header">
        <h1>CNVS Test</h1>
      </div>

      <div className="content">
        <img
          ref={imageRef}
          src="#"
          alt=""
          style={{ display: image ? "block" : "none" }}
          onLoad={() => {
            detectImage(
              imageRef.current,
              canvasRef.current,
              session,
              topk,
              iouThreshold,
              scoreThreshold,
              modelInputShape
            );
          }}
        />
        <canvas
          id="canvas"
          width={modelInputShape[2]}
          height={modelInputShape[3]}
          ref={canvasRef}
        />
      </div>

      <input
        type="file"
        ref={inputImage}
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          // handle next image to detect
          if (image) {
            URL.revokeObjectURL(image);
            setImage(null);
          }

          const url = URL.createObjectURL(e.target.files[0]); // create image url
          imageRef.current.src = url; // set image source
          setImage(url);
        }}
      />
      <div className="btn-container">
        <button
          onClick={() => {
            inputImage.current.click();
          }}
        >
          Open local image
        </button>
        {image && (
          /* show close btn when there is image */
          <button
            onClick={() => {
              inputImage.current.value = "";
              imageRef.current.src = "#";
              URL.revokeObjectURL(image);
              setImage(null);
            }}
          >
            Close image
          </button>
        )}
      </div>

      <div className="content">
        {/* Display the video feed from the camera */}
        <video
          ref={videoRef}
          autoPlay
          style={{ display: !image ? "block" : "none" }}
          playsInline
          muted
        ></video>
        <img
          ref={imageRef}
          src="#"
          alt=""
          style={{ display: image ? "block" : "none" }}
          onLoad={() => {
            detectImage(
              imageRef.current,
              canvasRef.current,
              session,
              topk,
              iouThreshold,
              scoreThreshold,
              modelInputShape
            );
          }}
        />
           
        <canvas
          id="canvas"
          width={modelInputShape[2]}
          height={modelInputShape[3]}
          ref={canvasRef}
        />
      </div>

      <div className="btn-container">
        {/* Add a button to start the camera */}
        <button onClick={startCamera}>Start Camera</button>
        <button
          onClick={() => {
            const canvas = document.createElement("canvas");
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const context = canvas.getContext("2d");
            context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            const capturedImage = canvas.toDataURL("image/jpeg");

            // Set the captured image
            setImage(capturedImage);

            // Display the captured image
            imageRef.current.src = capturedImage;
          }}
        >
          Capture Image
        </button>
      </div>

      <input
        type="file"
        ref={inputImage}
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          // handle next image to detect
          if (image) {
            URL.revokeObjectURL(image);
            setImage(null);
          }

          const url = URL.createObjectURL(e.target.files[0]); // create image URL
          imageRef.current.src = url; // set image source
          setImage(url);
        }}
      />
      <div style={{ color: 'black' }}>{wValues}</div>
      {image && (
        /* show close btn when there is an image */
        <div className="btn-container">
          <button
            onClick={() => {
              inputImage.current.value = "";
              imageRef.current.src = "#";
              URL.revokeObjectURL(image);
              setImage(null);
            }}
          >
            Close Image
          </button>
          
        </div>
      )}
    

    </div>
  );
};

export default App;
