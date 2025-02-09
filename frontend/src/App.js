import React, { useState } from "react";
import axios from 'axios';
function App() {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(""); 
  const [username, setUsername] = useState("");
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
    for (let key of formData.keys()) {
      console.log(key, formData.get(key));
    }
    try {
      const response = await axios.post("http://localhost:8000/upload", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred while uploading the file.");
    }
  };

  const handleAskQuestion = async () => {
    if (!question) {
      alert("Please enter a question.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question ,username}),
      });

      if (response) {
        console.log(response.data)
        setAnswer(data.answer);
      } else {
        alert("Failed to retrieve the answer.");
      }
    } catch (error) {
      console.error("Error asking question:", error);
      alert("An error occurred while asking the question.");
    }
  };

  return (
    <div className="App">
      <h1>QA System</h1>
      <label htmlFor="username">Username:</label>
      <input
        type="text"
        id="username"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <label htmlFor="file">Upload PDF:</label>
      <input type="file" id="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload</button>

      <hr />
      <label htmlFor="question">Ask a Question:</label>
      <input
        type="text"
        id="question"
        placeholder="Type your question here"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button onClick={handleAskQuestion}>Ask</button>
      {answer && (
        <div>
          <h2>Answer:</h2>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

export default App;

