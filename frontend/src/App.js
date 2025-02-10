import React, { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("username", username);

    try {
      await axios.post("https://rag-pdf-qna.onrender.com/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("File uploaded successfully.");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred while uploading the file.");
    }
  };

  const handleAskQuestion = async () => {
    if (!username.trim()) {
      alert("Please enter your username.");
      return;
    }
  
    if (!question.trim()) {
      alert("Please enter a question.");
      return;
    }
  
    try {
      let response = await fetch("https://rag-pdf-qna.onrender.com/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question, username }),
      });
  
      if (response.ok) {
        const data = await response.json();
        if (data.answer) {
          setAnswer(data.answer);
          setError("");
        } else {
          setAnswer("");
          setError("No relevant data found.");
        }
      } else {
        setAnswer("");
        setError("An error occurred while retrieving the answer.");
      }
    } catch (error) {
      console.error("Error asking question:", error);
      setAnswer("");
      setError("An error occurred while asking the question.");
    }
  };
  

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        maxWidth: "600px",
        margin: "auto",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#333" }}>RAG-QA System</h1>

      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="username" style={{ display: "block", marginBottom: "8px" }}>Username:</label>
        <input
          type="text"
          id="username"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="file" style={{ display: "block", marginBottom: "8px" }}>Upload PDF:</label>
        <input type="file" id="file" onChange={handleFileChange} />
        <button
          onClick={handleFileUpload}
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Upload
        </button>
      </div>

      <hr style={{ margin: "20px 0" }} />

      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="question" style={{ display: "block", marginBottom: "8px" }}>Ask a Question:</label>
        <input
          type="text"
          id="question"
          placeholder="Type your question here"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <button
          onClick={handleAskQuestion}
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            backgroundColor: "#28A745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Ask
        </button>
      </div>

      {answer && (
        <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#E9F7EF", borderRadius: "4px" }}>
          <h2 style={{ margin: 0 }}>Answer:</h2>
          <p style={{ margin: "10px 0 0" }}>{answer}</p>
        </div>
      )}

      {error && (
        <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#F8D7DA", borderRadius: "4px", color: "#721C24" }}>
          <h2 style={{ margin: 0 }}>Error:</h2>
          <p style={{ margin: "10px 0 0" }}>{error}</p>
        </div>
      )}
    </div>
  );
}

export default App;
