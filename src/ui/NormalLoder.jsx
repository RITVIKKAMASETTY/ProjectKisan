import React from "react";

function Loader() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f9f9f9",
        zIndex: 9999,
      }}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{ width: "200px", height: "auto" }}
      >
        <source src="/plantgrowing.mov" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <p style={{ marginTop: "1rem", fontSize: "1.2rem", color: "#333" }}>
        Loading...
      </p>
    </div>
  );
}

export default Loader;
