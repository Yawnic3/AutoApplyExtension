// Content script for Workday auto-apply
console.log('🚀 EXTENSION ACTIVE: Content script loaded on page:', window.location.href);

// Retrieve stored data and auto-fill
chrome.storage.sync.get(['firstName', 'lastName', 'preferredName', 'email', 'phone', 'address', 'city', 'state', 'zip', 'country', 'resumePdf'], (result) => {
  if (chrome.runtime.lastError) {
    console.error('Error retrieving data:', chrome.runtime.lastError);
    return;
  }

  // Detect if on a job application page
  if (window.location.href.includes('job') || window.location.href.includes('apply')) {
    console.log('✅ EXTENSION: On a job/apply page - starting auto-fill');

    // Fill text fields
    fillField('input[placeholder*="first name" i], input[name*="firstname" i], input[id*="firstname" i]', result.firstName);
    fillField('input[placeholder*="last name" i], input[name*="lastname" i], input[id*="lastname" i]', result.lastName);
    fillField('input[placeholder*="preferred name" i], input[name*="preferredname" i], input[id*="preferredname" i]', result.preferredName);
    fillField('input[placeholder*="email" i], input[name*="email" i], input[id*="email" i], input[type="email"]', result.email);
    fillField('input[placeholder*="phone" i], input[name*="phone" i], input[id*="phone" i], input[type="tel"]', result.phone);
    fillField('input[placeholder*="address" i], input[name*="address" i], input[id*="address" i]', result.address);
    fillField('input[placeholder*="city" i], input[name*="city" i], input[id*="city" i]', result.city);
    fillField('input[placeholder*="state" i], input[name*="state" i], input[id*="state" i]', result.state);
    fillField('input[placeholder*="zip" i], input[name*="zip" i], input[id*="zip" i], input[placeholder*="postal" i]', result.zip);
    fillField('input[placeholder*="country" i], input[name*="country" i], input[id*="country" i]', result.country);

    // Fill PDF if available
    if (result.resumePdf) {
      const fileInputs = document.querySelectorAll('input[type="file"]');
      fileInputs.forEach(input => {
        if (input.accept && input.accept.includes('pdf') || !input.accept) {
          const byteString = atob(result.resumePdf.split(',')[1]);
          const mimeType = result.resumePdf.split(',')[0].split(':')[1].split(';')[0];
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          const blob = new Blob([ab], { type: mimeType });
          const file = new File([blob], 'resume.pdf', { type: mimeType });
          const dt = new DataTransfer();
          dt.items.add(file);
          input.files = dt.files;
          console.log('📄 EXTENSION: PDF uploaded to file input');
        }
      });
    }

    // Auto-click next/continue/submit button after a delay
    setTimeout(() => {
      const buttons = document.querySelectorAll('button, input[type="submit"], input[type="button"]');
      let clicked = false;
      buttons.forEach(btn => {
        const text = btn.textContent || btn.value || '';
        if (/next|continue|submit|apply/i.test(text) && !clicked) {
          btn.click();
          console.log('▶️ EXTENSION: Clicked button:', text);
          clicked = true;
        }
      });
      if (!clicked) {
        console.log('⚠️ EXTENSION: No matching button found to click');
      }
    }, 2000); // 2-second delay to allow filling

  } else {
    console.log('❌ EXTENSION: Not on a job/apply page');
  }
});

// Helper function to fill a field
function fillField(selector, value) {
  if (!value) return;
  const field = document.querySelector(selector);
  if (field) {
    field.value = value;
    field.dispatchEvent(new Event('input', { bubbles: true })); // Trigger change events
    field.dispatchEvent(new Event('change', { bubbles: true }));
    console.log('✏️ EXTENSION: Filled field with:', value);
  } else {
    console.log('⚠️ EXTENSION: Field not found for selector:', selector);
  }
}
