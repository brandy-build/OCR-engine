import { extractTextFromImage } from '../ocr.js';
import { analyzeDocument } from '../ai.js';

document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('fileInput');
  const dropZone = document.getElementById('dropZone');
  const captureBtn = document.getElementById('captureBtn');
  const resultsDiv = document.getElementById('results');
  const textOutput = document.getElementById('textOutput');
  const aiOutput = document.getElementById('aiOutput');
  const errorOutput = document.getElementById('errorOutput');

  // Clear error message 
  function clearError() {
    errorOutput.textContent = '';
  }

  // Show error message
  function showError(message) {
    errorOutput.textContent = message;
  }

  // Handle file selection
  fileInput.addEventListener('change', () => {
    clearError();
    handleFiles();
  });
  
  // Drag and drop handlers
  dropZone.addEventListener('click', () => fileInput.click());
  dropZone.addEventListener('dragover', (e) => e.preventDefault());
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    clearError();
    fileInput.files = e.dataTransfer.files;
    handleFiles();
  });

  // Screen capture handler
  captureBtn.addEventListener('click', async () => {
    clearError();
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) {
        showError('No active tab found.');
        return;
      }
      const dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId);
      if (!dataUrl) {
        showError('Failed to capture visible tab.');
        return;
      }
      processImage(dataUrl);
    } catch (error) {
      console.error("Capture error:", error);
      showError('Capture error: ' + error.message);
    }
  });

  function handleFiles() {
    if (fileInput.files.length === 0) return;
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => processImage(e.target.result);
    reader.onerror = () => showError('Failed to read file.');
    reader.readAsDataURL(file);
  }

  async function processImage(imageData) {
    try {
      const { text } = await extractTextFromImage(imageData);
      if (!text) {
        showError('No text extracted from image.');
        return;
      }
      const analysis = await analyzeDocument(text);
      
      textOutput.textContent = text;
      aiOutput.innerHTML = Object.entries(analysis)
        .map(([q, a]) => `<p><strong>${q}:</strong> ${a}</p>`)
        .join('');
      
      resultsDiv.style.display = 'block';
      clearError();
    } catch (error) {
      console.error("Processing error:", error);
      showError('Processing error: ' + error.message);
    }
  }
});
