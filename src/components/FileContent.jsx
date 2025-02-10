import React from "react";

const FileContent = ({ file }) => {
  if (!file) return <div className="empty">Select a file to view content</div>;

  return (
    <div className="file-content">
      <h3>{file.name}</h3>
      <label>{file.content}</label>
    </div>
  );
};

export default FileContent;
