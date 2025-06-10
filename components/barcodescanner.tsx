"use client";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { NotFoundException } from "@zxing/library";
import { useEffect, useRef, useState } from "react";

const BarcodeScanner = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState<string>("");

  const startScanning = async () => {
    try {
      const codeReader = new BrowserMultiFormatReader();
      codeReaderRef.current = codeReader;

      const devices = await BrowserMultiFormatReader.listVideoInputDevices();
      if (devices.length === 0) {
        console.error("No video input devices found");
        return;
      }
      const selectedDeviceId = devices[0].deviceId;
      let videoConstraints;
      if (!selectedDeviceId) {
            videoConstraints = { facingMode: 'environment'};
        }
        else {
            videoConstraints = { deviceId: { exact: selectedDeviceId } };
        }
        const constraints = {video : videoConstraints}

      await codeReader.decodeFromConstraints(
        constraints,
        videoRef.current!,
        (result, err) => {
          if (result) {
            const text = result.getText();
            console.log("Scanned:", text);
            setScannedResult(text); // update the output box
          } else if (err && !(err instanceof NotFoundException)) {
            console.error("Error during scan:", err);
          }
        }
      );

      console.log(`Started scanning with camera ID: ${selectedDeviceId}`);
      setScanning(true);
    } catch (error) {
      console.error("Error starting scanner:", error);
    }
  };

  const resetScanning = () => {
    if (codeReaderRef.current) {
      codeReaderRef.current = null;
      console.log("Scanner reset");
    }
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setScanning(false);
    setScannedResult(""); // clear output box
  };

  useEffect(() => {
    return () => {
      resetScanning();
    };
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <video
        ref={videoRef}
        style={{
          width: "100%",
          maxWidth: "500px",
          height: "550px",
          border: "2px solid #333",
          marginBottom: "1rem",
        }}
      ></video>

      <div>
        <button
          onClick={startScanning}
          disabled={scanning}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            backgroundColor: "#4CAF50",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Start Scanning
        </button>
        <button
          onClick={resetScanning}
          disabled={!scanning}
          style={{
            padding: "10px 20px",
            backgroundColor: "#f44336",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Reset Scanning
        </button>
      </div>

      {/* Output box */}
      <div
        style={{
          marginTop: "1.5rem",
          padding: "1rem",
          border: "2px dashed #333",
          backgroundColor: "#f9f9f9",
          color: "#333",
          maxWidth: "500px",
          marginInline: "auto",
          wordBreak: "break-word",
        }}
      >
        <strong>Scanned Result:</strong>
        <div>{scannedResult || "No result yet."}</div>
      </div>
    </div>
  );
};

export default BarcodeScanner;
