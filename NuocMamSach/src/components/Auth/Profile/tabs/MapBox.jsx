import React from "react";

const GoogleMap = ({ address }) => {
  return (
    <iframe
      src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
      width="100%"
      height="400"
      style={{ border: "0", borderRadius: "8px" }}
      allowFullScreen
    ></iframe>
  );
};

export default GoogleMap;
