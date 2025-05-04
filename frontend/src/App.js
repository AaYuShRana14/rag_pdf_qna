import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";

// Animated search particles effect
function ParticleEffect() {
  return (
    <div className="particle-container">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="particle"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: 0,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

function App() {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("home");
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0]?.name || "");
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    if (!username.trim()) {
      alert("Please enter your username.");
      return;
    }

    setIsLoading(true);
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
      setActiveSection("ask"); // Move to ask section after successful upload
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred while uploading the file.");
    } finally {
      setIsLoading(false);
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

    setIsLoading(true);
    setAnswer("");
    setError("");

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
        } else {
          setError("No relevant data found.");
        }
      } else {
        setError("An error occurred while retrieving the answer.");
      }
    } catch (error) {
      console.error("Error asking question:", error);
      setError("An error occurred while asking the question.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderHome = () => (
    <div className="landing-section">
      <ParticleEffect />
      <motion.div
        className="hero"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Welcome to PDF QnA Assistant
        </motion.h1>
        <motion.p
          className="subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Your AI-powered document assistant
        </motion.p>
        <motion.p
          className="description"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          Upload your PDF documents and get instant answers to your questions
          using advanced AI technology. Our system uses RAG (Retrieval-Augmented
          Generation) to provide accurate responses based on your documents.
        </motion.p>
        <motion.div
          className="cta-buttons"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <motion.button
            className="cta-button primary"
            onClick={() => setActiveSection("upload")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started
          </motion.button>
          <motion.button
            className="cta-button secondary"
            onClick={() => setActiveSection("learn")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Learn More
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Replace 3D model with a simple animated illustration */}
      <motion.div
        className="pdf-illustration"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <div className="pdf-icon">
          <div className="pdf-page">
            <div className="pdf-text-line"></div>
            <div className="pdf-text-line"></div>
            <div className="pdf-text-line"></div>
            <div className="pdf-text-line pdf-text-line-short"></div>
            <div className="pdf-corner"></div>
          </div>
          <div className="pdf-label">PDF</div>
        </div>

        <motion.div
          className="arrow"
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        ></motion.div>

        <div className="ai-icon">
          <div className="ai-circle">
            <div className="ai-brain">
              <div className="ai-node"></div>
              <div className="ai-node"></div>
              <div className="ai-node"></div>
              <div className="ai-connection"></div>
              <div className="ai-connection"></div>
            </div>
          </div>
        </div>

        <motion.div
          className="arrow"
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
        ></motion.div>

        <div className="answer-icon">
          <div className="answer-bubble">
            <div className="answer-text-line"></div>
            <div className="answer-text-line answer-text-line-short"></div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="features"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <motion.div
          className="feature-card"
          whileHover={{ y: -10, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.div
            className="feature-icon"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            📄
          </motion.div>
          <h3>PDF Processing</h3>
          <p>
            Upload any PDF document and our system will process and analyze its
            contents
          </p>
        </motion.div>
        <motion.div
          className="feature-card"
          whileHover={{ y: -10, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.div
            className="feature-icon"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🔍
          </motion.div>
          <h3>Smart Retrieval</h3>
          <p>
            Our system uses vector embeddings to find the most relevant
            information
          </p>
        </motion.div>
        <motion.div
          className="feature-card"
          whileHover={{ y: -10, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.div
            className="feature-icon"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          >
            🤖
          </motion.div>
          <h3>AI-Powered Answers</h3>
          <p>Get clear, concise answers generated by advanced AI models</p>
        </motion.div>
      </motion.div>
    </div>
  );

  const renderLearn = () => (
    <motion.div
      className="learn-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        How It Works
      </motion.h2>
      <div className="process-steps">
        {[
          {
            number: 1,
            title: "Upload Your Document",
            description:
              "Upload your PDF file and provide a username to identify your documents",
          },
          {
            number: 2,
            title: "Document Processing",
            description:
              "Our system extracts and analyzes the text content of your document",
          },
          {
            number: 3,
            title: "Ask Questions",
            description: "Ask any question related to your document's content",
          },
          {
            number: 4,
            title: "Get Answers",
            description:
              "Receive AI-generated answers based specifically on your document's content",
          },
        ].map((step, index) => (
          <motion.div
            className="step"
            key={step.number}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.2, duration: 0.8 }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              className="step-number"
              animate={{
                backgroundColor: ["#2563eb", "#4f46e5", "#7c3aed", "#2563eb"],
                transition: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            >
              {step.number}
            </motion.div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </motion.div>
        ))}
      </div>
      <motion.button
        className="back-button"
        onClick={() => setActiveSection("home")}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Back to Home
      </motion.button>
    </motion.div>
  );

  const renderUpload = () => (
    <motion.div
      className="upload-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        Upload Your Document
      </motion.h2>
      <motion.div
        className="upload-form"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <motion.input
            type="text"
            id="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-field"
            whileFocus={{ boxShadow: "0 0 0 2px rgba(37, 99, 235, 0.5)" }}
          />
          <p className="help-text">
            This will be used to identify your documents
          </p>
        </div>

        <div className="form-group">
          <label htmlFor="file">Select PDF File:</label>
          <div className="file-input-container">
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              className="file-input"
              accept=".pdf"
            />
            <motion.label
              htmlFor="file"
              className="file-label"
              whileHover={{ scale: 1.02, backgroundColor: "#e5e7eb" }}
              whileTap={{ scale: 0.98 }}
            >
              {fileName ? fileName : "Choose a file"}
            </motion.label>
          </div>
        </div>

        <div className="form-actions">
          <motion.button
            onClick={handleFileUpload}
            className="upload-button"
            disabled={isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLoading ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{ display: "inline-block" }}
              >
                ⟳
              </motion.span>
            ) : (
              "Upload Document"
            )}
          </motion.button>
          <motion.button
            className="back-button"
            onClick={() => setActiveSection("home")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Home
          </motion.button>
        </div>

        {/* Simple animated upload illustration */}
        <motion.div
          className="upload-illustration"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="upload-arrow"></div>
          <div className="upload-document">
            <div className="upload-document-icon">PDF</div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );

  const renderAsk = () => (
    <motion.div
      className="ask-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        Ask Questions About Your Document
      </motion.h2>

      <motion.div
        className="question-form"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <div className="form-group">
          <label htmlFor="question">Your Question:</label>
          <motion.input
            type="text"
            id="question"
            placeholder="Type your question here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="input-field"
            whileFocus={{ boxShadow: "0 0 0 2px rgba(37, 99, 235, 0.5)" }}
          />
        </div>

        <div className="form-actions">
          <motion.button
            onClick={handleAskQuestion}
            className="ask-button"
            disabled={isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLoading ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{ display: "inline-block" }}
              >
                ⟳
              </motion.span>
            ) : (
              "Ask Question"
            )}
          </motion.button>
        </div>

        {/* Simple AI assistant illustration */}
      </motion.div>

      <AnimatePresence>
        {answer && (
          <motion.div
            className="answer-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h3>Answer:</h3>
            <motion.div
              className="answer-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              {answer.split("").map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.03 * index, duration: 0.1 }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        )}

        {error && (
          <motion.div
            className="error-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h3>Error:</h3>
            <div className="error-content">{error}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="navigation-options"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <motion.button
          className="option-button"
          onClick={() => setActiveSection("upload")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Upload Another Document
        </motion.button>
        <motion.button
          className="option-button"
          onClick={() => setActiveSection("home")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Back to Home
        </motion.button>
      </motion.div>
    </motion.div>
  );

  const renderNavbar = () => (
    <motion.nav
      className="navbar"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="logo" onClick={() => setActiveSection("home")}>
        <motion.span
          animate={{
            color: ["#2563eb", "#4f46e5", "#7c3aed", "#2563eb"],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          PDF
        </motion.span>{" "}
        QnA
      </div>
      <div className="nav-links">
        {["home", "upload", "ask", "learn"].map((section, index) => (
          <motion.button
            key={section}
            className={`nav-link ${activeSection === section ? "active" : ""}`}
            onClick={() => setActiveSection(section)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.5 }}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </motion.button>
        ))}
      </div>
    </motion.nav>
  );

  return (
    <div className="app-container">
      {renderNavbar()}
      <AnimatePresence mode="wait">
        <main className="main-content">
          {activeSection === "home" && renderHome()}
          {activeSection === "upload" && renderUpload()}
          {activeSection === "ask" && renderAsk()}
          {activeSection === "learn" && renderLearn()}
        </main>
      </AnimatePresence>
      <motion.footer
        className="footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <motion.p
          animate={{
            color: ["#e0e7ff", "#c7d2fe", "#e0e7ff"],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          &copy; {new Date().getFullYear()} PDF QnA Assistant. All rights
          reserved.
        </motion.p>
      </motion.footer>
    </div>
  );
}

export default App;
