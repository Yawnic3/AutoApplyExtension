// Content script for Workday auto-apply
// This runs on Workday pages

console.log('Content script loaded on Workday page');

// Example: Detect if on a job application page
if (window.location.href.includes('job')) {
  console.log('On a job page - ready for automation');
  // Add your auto-fill logic here
}
