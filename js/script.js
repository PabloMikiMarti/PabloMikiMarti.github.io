// Select DOM elements
const flower = document.querySelector(".flower-container");
const nameContainer = document.querySelector(".name-container");

// Variables for mouse tracking
let mouseX = 0,
  mouseY = 0; // Cursor's actual position
let flowerX = 0,
  flowerY = 0; // Flower's position
const delayFactor = 0.05; // Controls how slowly the flower moves (lower = more delay)

// Function to get CSS variable values
function getCSSVariable(variableName) {
  const rootStyles = getComputedStyle(document.documentElement);
  return parseFloat(rootStyles.getPropertyValue(variableName)) || 0;
}

// Initialize offset variables from CSS
let offsetX = getCSSVariable("--flower-offset-x");
let offsetY = getCSSVariable("--flower-offset-y");

// Function to update offsets dynamically if CSS variables change
function observeCSSVariableChanges() {
  const root = document.documentElement;
  const observer = new MutationObserver(() => {
    offsetX = getCSSVariable("--flower-offset-x");
    offsetY = getCSSVariable("--flower-offset-y");
  });
  observer.observe(root, {
    attributes: true,
    childList: false,
    subtree: false,
  });
}
observeCSSVariableChanges();

// Function to update the flower's position smoothly
function updateFlowerPosition() {
  const targetX = mouseX + offsetX;
  const targetY = mouseY + offsetY;

  // Calculate the distance between the flower's current position and the target position
  const dx = targetX - flowerX;
  const dy = targetY - flowerY;

  // Slowly move the flower towards the target position
  flowerX += dx * delayFactor;
  flowerY += dy * delayFactor;

  // Update flower position
  flower.style.left = `${flowerX}px`;
  flower.style.top = `${flowerY}px`;

  // Continue the animation loop
  requestAnimationFrame(updateFlowerPosition);
}

// Function to track the mouse position
function handleMouseMove(event) {
  mouseX = event.clientX;
  mouseY = event.clientY;
}

// Attach mousemove event listener
document.addEventListener("mousemove", handleMouseMove);

// Start the animation loop for flower movement
requestAnimationFrame(updateFlowerPosition);

// Scroll-based animations and effects
window.addEventListener("scroll", () => {
  const scrollPosition = window.scrollY;

  // Update SVG filter displacement scale based on scroll
  const displacementMap = document.querySelector("#displacement");
  if (displacementMap) {
    const maxScale = 12000; // Adjust for a more pronounced effect
    const newScale = Math.min(scrollPosition / 0.7, maxScale);
    displacementMap.setAttribute("scale", newScale);
  }

  // Update name container opacity based on scroll
  if (nameContainer) {
    const maxScroll = 1000; // Scroll amount to fully fade out the name container
    const newOpacity = Math.max(1 - scrollPosition / maxScroll, 0); // Ensures opacity doesn't go below 0
    nameContainer.style.opacity = newOpacity;
  }
});

// Function to copy email to clipboard
function copyEmail() {
  const emailElement = document.getElementById("email-link");
  if (!emailElement) {
    console.error("Email element not found!");
    return;
  }

  const email = emailElement.textContent;
  navigator.clipboard
    .writeText(email)
    .then(() => {
      // Show tooltip on successful copy
      const tooltip = document.getElementById("copy-tooltip");
      if (tooltip) {
        tooltip.classList.add("visible");
        setTimeout(() => {
          tooltip.classList.remove("visible");
        }, 2000);
      }
    })
    .catch((err) => {
      console.error("Failed to copy email: ", err);
    });
}

// Attach the copyEmail function to the copy button if it exists
const copyButton = document.querySelector(".copy-button");
if (copyButton) {
  copyButton.addEventListener("click", copyEmail);
}
