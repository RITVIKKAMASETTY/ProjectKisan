import React from "react";

function Loader() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(5px)",
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <img
        src="/plantgrowingunscreen.gif"
        alt="Loading animation"
        style={{ width: "200px", height: "auto" }}
      />
      <p style={{ marginTop: "1rem", fontSize: "1.2rem", color: "#333" }}>
        Loading...
      </p>
    </div>
  );
}

export default Loader;
