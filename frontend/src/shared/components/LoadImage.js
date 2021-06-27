import React, { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

export default function LoadImage(props) {
  const [loading, setLoading] = useState(true);
  function hideLoader() {
    setLoading(false);
  }
  return (
    <>
      {loading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      <img
        className={loading ? "zero-height" : ""}
        src={props.src}
        alt={props.alt}
        style={{...props.style}}
        onLoad={hideLoader}
      />
    </>
  );
}
