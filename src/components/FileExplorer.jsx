import React, { useState, useEffect } from "react";
import {
  FaFolder,
  FaFolderOpen,
  FaFile,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
} from "react-icons/fa";
import fileData from "../data/file.json";

const FileManager = () => {
  const [structure, setStructure] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [expandedFolders, setExpandedFolders] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setStructure(fileData);
  }, []);

  const toggleFolder = (id) => {
    setExpandedFolders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const selectFile = (file) => {
    setSelectedFile(file.name);
    setFileContent(file.content);
  };

  const addFolder = () => {
    const name = prompt("Enter new folder name:");
    if (name) {
      setStructure([
        ...structure,
        { id: Date.now(), name, type: "folder", children: [] },
      ]);
    }
  };

  const addFile = (folderId) => {
    const name = prompt("Enter new file name:");
    if (name) {
      setStructure((prev) =>
        prev.map((folder) =>
          folder.id === folderId
            ? {
                ...folder,
                children: [
                  ...folder.children,
                  {
                    id: Date.now(),
                    name,
                    type: "file",
                    content: "New file content",
                  },
                ],
              }
            : folder
        )
      );
    }
  };

  const renameItem = (id, type) => {
    const name = prompt("Enter new name:");
    if (name) {
      setStructure((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, name }
            : item.type === "folder"
            ? { ...item, children: renameChild(item.children, id, name) }
            : item
        )
      );
    }
  };

  const renameChild = (children, id, name) => {
    return children.map((child) =>
      child.id === id ? { ...child, name } : child
    );
  };

  const deleteItem = (id, type) => {
    if (window.confirm("Are you sure you want to delete?")) {
      setStructure((prev) => removeItem(prev, id));
    }
  };

  const removeItem = (items, id) => {
    return items
      .filter((item) => item.id !== id) // Remove matching item
      .map((item) =>
        item.type === "folder"
          ? { ...item, children: removeItem(item.children, id) } // Recursively remove from nested children
          : item
      );
  };

  const filterStructure = (items, searchTerm) => {
    return items
      .map((item) => {
        if (item.type === "folder") {
          const filteredChildren = filterStructure(item.children, searchTerm);
          if (
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            filteredChildren.length > 0
          ) {
            return { ...item, children: filteredChildren };
          }
        } else if (item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          return item;
        }
        return null;
      })
      .filter(Boolean);
  };

  const filteredStructure = filterStructure(structure, searchTerm);

  return (
    <div className="file-manager-container">
      <div className="sidebar">
        <h2>File Explorer</h2>
        <input
          type="text"
          placeholder="Search files or folders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
        <button className="add-button" onClick={addFolder}>
          <FaPlus /> Add Folder
        </button>
        <ul>
          {filteredStructure.map((item) => (
            <li key={item.id} className="folder-item">
              {item.type === "folder" ? (
                <div>
                  <span
                    onClick={() => toggleFolder(item.id)}
                    className="folder-title"
                  >
                    {expandedFolders[item.id] ? <FaFolderOpen /> : <FaFolder />}{" "}
                    {item.name}
                  </span>
                  <button onClick={() => addFile(item.id)}>
                    <FaPlus />
                  </button>
                  <button onClick={() => renameItem(item.id, "folder")}>
                    <FaEdit />
                  </button>
                  <button onClick={() => deleteItem(item.id, "folder")}>
                    <FaTrash />
                  </button>
                  {expandedFolders[item.id] && (
                    <ul className="nested-list">
                      {item.children.map((file) => (
                        <li key={file.id} className="file-item">
                          <span
                            onClick={() => selectFile(file)}
                            className="file-title"
                          >
                            <FaFile /> {file.name}
                          </span>
                          <button onClick={() => renameItem(file.id, "file")}>
                            <FaEdit />
                          </button>
                          <button onClick={() => deleteItem(file.id, "file")}>
                            <FaTrash />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
      <div className="content-area">
        <h2>File Content</h2>
        {selectedFile ? (
          <div>
            <h3>{selectedFile}</h3>
            <pre className="file-content">{fileContent}</pre>
          </div>
        ) : (
          <p>Select a file to view its content</p>
        )}
      </div>
    </div>
  );
};

export default FileManager;
