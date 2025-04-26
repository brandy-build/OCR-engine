// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
   console.log('AI OCR Extension installed');
 });
 
 // Handle messages from popup
 chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
   if (request.action === 'saveData') {
     chrome.storage.local.set({ ocrData: request.data });
     sendResponse({ success: true });
   }
   return true;
 });  