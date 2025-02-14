let isDraggingDownloadButton = false;
let isDraggingHelpButton = false;
let currentImageIndex = 0;
const images = [];
let clickTimeout;

// Function to display photos
function displayPhotos() {
  const photosContainer = document.getElementById("photos");
  const totalImages = 203;
  let loadedImages = 0;

  for (let i = 1; i <= totalImages; i++) {
    const photoContainer = document.createElement("div");
    photoContainer.classList.add("photo-container");

    const photo = document.createElement("img");
    photo.src = `PHOTOS/${i}.jpg`; // Display original image
    photo.alt = `Photo ${i}`;
    photo.classList.add("photo");

    const downloadCheckbox = document.createElement("input");
    downloadCheckbox.type = "checkbox";
    downloadCheckbox.classList.add("download-checkbox");
    downloadCheckbox.value = `PHOTOS/${i}.jpg`; // Download original image

    photoContainer.appendChild(photo);
    photoContainer.appendChild(downloadCheckbox);
    photosContainer.appendChild(photoContainer);

    // Add double click event listener to expand the photo
    photoContainer.addEventListener("dblclick", function (e) {
      e.preventDefault();
      currentImageIndex = i - 1; // Set current image index
      openModal(photo.src);
    });

    // Add single click event listener to select/deselect the photo
    photoContainer.addEventListener("click", function () {
      clearTimeout(clickTimeout);
      clickTimeout = setTimeout(() => {
        photoContainer.classList.toggle("selected");
        downloadCheckbox.checked = !downloadCheckbox.checked;
      }, 200); // Single click duration
    });

    // Store image sources for navigation
    images.push(photo.src);

    // Update loading percentage
    photo.onload = () => {
      loadedImages++;
      const percentage = Math.round((loadedImages / totalImages) * 100);
      document.querySelector('.loading-percentage').textContent = `${percentage}%`;

      // Hide loading screen once all images are loaded
      if (loadedImages === totalImages) {
        document.querySelector('.loading-overlay').style.display = 'none';
      }
    };
  }
}

// Function to open modal with expanded image
function openModal(imageSrc) {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  modal.classList.add("open");
  modalImg.src = imageSrc;

  // Update download button href
  const downloadModalButton = document.getElementById("downloadModalButton");
  downloadModalButton.onclick = () => {
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = imageSrc.split('/').pop();
    link.click();
  };
}

// Function to close modal
function closeModal() {
  const modal = document.getElementById("imageModal");
  modal.classList.remove("open");
}

// Close modal when clicking outside the image
window.addEventListener("click", function (event) {
  const modal = document.getElementById("imageModal");
  if (event.target === modal) {
    closeModal();
  }
});

// Close modal when clicking the close button
document.querySelector(".close").addEventListener("click", closeModal);

// Navigation in modal
document.querySelector(".modal-nav.prev").addEventListener("click", function () {
  currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
  document.getElementById("modalImage").src = images[currentImageIndex];
});

document.querySelector(".modal-nav.next").addEventListener("click", function () {
  currentImageIndex = (currentImageIndex + 1) % images.length;
  document.getElementById("modalImage").src = images[currentImageIndex];
});

// Enable swipe gestures for navigation
let touchstartX = 0;
let touchendX = 0;

function handleGesture() {
  if (touchendX < touchstartX) {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    document.getElementById("modalImage").src = images[currentImageIndex];
  }

  if (touchendX > touchstartX) {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    document.getElementById("modalImage").src = images[currentImageIndex];
  }
}

document.getElementById("imageModal").addEventListener('touchstart', function (event) {
  touchstartX = event.changedTouches[0].screenX;
});

document.getElementById("imageModal").addEventListener('touchend', function (event) {
  touchendX = event.changedTouches[0].screenX;
  handleGesture();
});

// Enable keyboard arrow navigation
window.addEventListener("keydown", function (event) {
  const modal = document.getElementById("imageModal");
  if (modal.classList.contains("open")) {
    if (event.key === "ArrowLeft") {
      currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
      document.getElementById("modalImage").src = images[currentImageIndex];
    } else if (event.key === "ArrowRight") {
      currentImageIndex = (currentImageIndex + 1) % images.length;
      document.getElementById("modalImage").src = images[currentImageIndex];
    }
  }
});

// Function to show custom download popup
function showDownloadPopup() {
  document.getElementById("popupOverlay").style.display = "flex";
}

function confirmDownload() {
  document.getElementById("popupOverlay").style.display = "none";
  const checkboxes = document.querySelectorAll('.download-checkbox');
  const selectedImages = [];

  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      selectedImages.push(checkbox.value);
    }
  });

  selectedImages.forEach(image => {
    const link = document.createElement('a');
    link.href = image;
    link.download = image.split('/').pop();
    link.click();
  });
}

function cancelDownload() {
  document.getElementById("popupOverlay").style.display = "none";
}

// Function to show help popup
function showHelpPopup() {
  document.getElementById("helpPopupOverlay").style.display = "flex";
}

function closeHelpPopup() {
  document.getElementById("helpPopupOverlay").style.display = "none";
}

// Make floating buttons movable
const floatingDownloadButton = document.getElementById('floating-download-button');
const floatingHelpButton = document.getElementById('floating-help-button');

function makeButtonMovable(button, isDraggingFlag) {
  let offsetX, offsetY;

  button.addEventListener("mousedown", (e) => {
    window[isDraggingFlag] = true;
    offsetX = e.clientX - button.offsetLeft;
    offsetY = e.clientY - button.offsetTop;
    button.style.transition = "none"; // Disable transition during drag
  });

  window.addEventListener("mousemove", (e) => {
    if (window[isDraggingFlag]) {
      button.style.left = `${e.clientX - offsetX}px`;
      button.style.top = `${e.clientY - offsetY}px`;
    }
  });

  window.addEventListener("mouseup", () => {
    if (window[isDraggingFlag]) {
      window[isDraggingFlag] = false;
      button.style.transition = "background-color 0.3s ease, box-shadow 0.3s ease"; // Re-enable transition after drag
    }
  });

  button.addEventListener("click", () => {
    if (!window[isDraggingFlag]) {
      if (button === floatingDownloadButton) {
        showDownloadPopup();
      } else if (button === floatingHelpButton) {
        showHelpPopup();
      }
    }
  });
}

makeButtonMovable(floatingDownloadButton, 'isDraggingDownloadButton');
makeButtonMovable(floatingHelpButton, 'isDraggingHelpButton');

// Load photos when the page loads
document.addEventListener("DOMContentLoaded", displayPhotos);