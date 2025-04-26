let workerPromise = null;

export async function getWorker() {
  if (!workerPromise) {
    const { createWorker } = await import('tesseract.js');
    const worker = await createWorker();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    workerPromise = Promise.resolve(worker);
  }
  return workerPromise;
}
 
export async function extractTextFromImage(imageData) {
  try {
    const worker = await getWorker();
    const { data } = await worker.recognize(imageData);
    return {
      text: data.text,
      confidence: data.confidence
    };
  } catch (error) {
    throw new Error('OCR extraction failed: ' + error.message);
  }
}

// Optional: add a cleanup function to terminate the worker if needed
export async function terminateWorker() {
  if (workerPromise) {
    const worker = await workerPromise;
    await worker.terminate();
    workerPromise = null;
  }
}
