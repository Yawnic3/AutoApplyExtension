// Save user data to storage
document.getElementById('saveBtn').addEventListener('click', () => {
  const data = {
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    preferredName: document.getElementById('preferredName').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    address: document.getElementById('address').value,
    city: document.getElementById('city').value,
    state: document.getElementById('state').value,
    zip: document.getElementById('zip').value,
    country: document.getElementById('country').value
  };

  chrome.storage.sync.set(data, () => {
    if (chrome.runtime.lastError) {
      console.error('Error saving data:', chrome.runtime.lastError);
    } else {
      alert('Data saved successfully!');
    }
  });
});

document.getElementById('pdfUpload').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
    const reader = new FileReader();
    reader.onload = function(e) {
        const pdfData = e.target.result;
        chrome.storage.sync.set({ pdfData }, () => {
          if (chrome.runtime.lastError) {
            console.error('Error saving PDF data:', chrome.runtime.lastError);
          } else {
            alert('PDF data saved successfully!');
          }
        });
      };
      reader.readAsArrayBuffer(file);
    } else {
        alert('Please upload a valid PDF file.');
    }
});