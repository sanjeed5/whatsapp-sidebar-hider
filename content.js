// Create and insert the toggle button (robust placement with floating fallback)
function createToggleButton() {
  const button = document.createElement('button');
  button.className = 'sidebar-toggle-btn';
  button.setAttribute('aria-label', 'Toggle Sidebar');
  button.setAttribute('aria-pressed', 'false');
  button.innerHTML = `
    <span aria-hidden="true" data-icon="toggle-sidebar" class="">
      <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" class="" fill="none">
        <path fill="currentColor" d="M20,20H4c-1.1,0-2-0.9-2-2V6c0-1.1,0.9-2,2-2h16c1.1,0,2,0.9,2,2v12C22,19.1,21.1,20,20,20z M4,6v12h16V6H4z"/>
        <path fill="currentColor" d="M11,17H5V7h6V17z"/>
      </svg>
    </span>
  `;

  // Try to attach next to Settings/Profile within header
  const header = document.querySelector('header');
  const settingsButton = document.querySelector('button[aria-label*="Settings" i]') || document.querySelector('button[aria-label*="Profile" i]');
  if (header) {
    const wrapper = document.createElement('div');
    wrapper.className = 'sidebar-toggle-wrapper';
    wrapper.appendChild(button);

    if (settingsButton && settingsButton.parentNode) {
      try {
        const referenceNode = settingsButton.closest('div') || settingsButton;
        const parentNode = referenceNode.parentNode;
        parentNode.insertBefore(wrapper, referenceNode);
        return button;
      } catch (err) {
        // fall through to append to header
      }
    }

    header.appendChild(wrapper);
    return button;
  }

  // Floating fallback if header is not available
  button.classList.add('floating');
  document.body.appendChild(button);
  return button;
}

// Toggle sidebar visibility
function toggleSidebar(button) {
  const body = document.body;
  const isHidden = body.classList.toggle('hide-sidebar');
  button.classList.toggle('active', isHidden);
  button.setAttribute('aria-pressed', isHidden ? 'true' : 'false');
  
  // Save preference with error handling
  chrome.storage.local.set({ sidebarHidden: isHidden }, () => {
    if (chrome.runtime.lastError) {
      console.warn('Failed to save sidebar state:', chrome.runtime.lastError);
      // Revert the UI state if storage fails
      body.classList.toggle('hide-sidebar');
      button.classList.toggle('active');
      button.setAttribute('aria-pressed', body.classList.contains('hide-sidebar') ? 'true' : 'false');
    }
  });
}

// Handle dynamic changes to the DOM
function setupMutationObserver() {
  const observer = new MutationObserver(() => {
    const header = document.querySelector('header');
    let button = document.querySelector('.sidebar-toggle-btn');

    if (!button) {
      console.log('WhatsApp Sidebar Hider: Button missing, creating');
      button = createToggleButton();
    }

    // If we currently have a floating button but header is now available, try migrating into header
    if (button && button.classList.contains('floating') && header) {
      const settingsButton = document.querySelector('button[aria-label*="Settings" i]') || document.querySelector('button[aria-label*="Profile" i]');
      try {
        const wrapper = document.createElement('div');
        wrapper.className = 'sidebar-toggle-wrapper';
        button.classList.remove('floating');
        if (settingsButton && settingsButton.parentNode) {
          const referenceNode = settingsButton.closest('div') || settingsButton;
          const parentNode = referenceNode.parentNode;
          wrapper.appendChild(button);
          parentNode.insertBefore(wrapper, referenceNode);
        } else {
          wrapper.appendChild(button);
          header.appendChild(wrapper);
        }
      } catch (e) {
        // Keep floating if migration fails
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  return observer;
}

// Cleanup function to remove button and event listeners
function cleanup() {
  const button = document.querySelector('.sidebar-toggle-btn');
  if (button) {
    // The click handler is an anonymous closure; removing the element is sufficient
    const wrapper = button.closest('.sidebar-toggle-wrapper') || button.closest('._ajv7');
    if (wrapper) {
      wrapper.remove();
    } else {
      button.remove();
    }
  }
  
  // Remove sidebar hidden state if it was active
  document.body.classList.remove('hide-sidebar');
}

// Handle extension unload
chrome.runtime.onSuspend?.addListener(cleanup);

// Initialize the extension
function init() {
  let retryCount = 0;
  const MAX_RETRIES = 30; // 30 seconds max
  let observer = null;

  const checkInterval = setInterval(() => {
    retryCount++;
    let button = document.querySelector('.sidebar-toggle-btn');
    if (!button) {
      button = createToggleButton();
      if (!button) {
        console.warn('WhatsApp Sidebar Hider: Failed to create toggle button');
        return;
      }
    }

    // Add click handler once
    if (!button.__whatsappSidebarHiderBound) {
      button.addEventListener('click', () => toggleSidebar(button));
      button.__whatsappSidebarHiderBound = true;
    }

    if (!observer) {
      observer = setupMutationObserver();
    }

    // Restore previous state
    chrome.storage.local.get('sidebarHidden', (data) => {
      if (chrome.runtime.lastError) {
        console.warn('Failed to restore sidebar state:', chrome.runtime.lastError);
        return;
      }
      if (data.sidebarHidden) {
        document.body.classList.add('hide-sidebar');
        button.classList.add('active');
        button.setAttribute('aria-pressed', 'true');
      }
    });

    if (retryCount >= MAX_RETRIES) {
      clearInterval(checkInterval);
    }
  }, 1000);

  // Return cleanup function
  return () => {
    clearInterval(checkInterval);
    if (observer) {
      observer.disconnect();
    }
    cleanup();
  };
}

// Start the extension
const cleanupFunction = init();

// Handle page unload
window.addEventListener('unload', cleanupFunction); 