// Create and insert the toggle button
function createToggleButton() {
  const button = document.createElement('button');
  button.className = 'sidebar-toggle-btn x78zum5 x6s0dn4 x1afcbsf x1heor9g x1y1aw1k x1sxyh0 xwib8y2 xurb0ha';
  button.setAttribute('aria-label', 'Toggle Sidebar');
  button.innerHTML = `
    <span aria-hidden="true" data-icon="toggle-sidebar" class="">
      <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" class="" fill="none">
        <path fill="currentColor" d="M20,20H4c-1.1,0-2-0.9-2-2V6c0-1.1,0.9-2,2-2h16c1.1,0,2,0.9,2,2v12C22,19.1,21.1,20,20,20z M4,6v12h16V6H4z"/>
        <path fill="currentColor" d="M11,17H5V7h6V17z"/>
      </svg>
    </span>
  `;
  
  // Find the toolbar container
  const toolbar = document.querySelector('[data-js-navbar="true"]');
  if (!toolbar) return;

  // Create a wrapper div similar to other toolbar items
  const wrapper = document.createElement('div');
  wrapper.className = '_ajv7 x1n2onr6 x1okw0bk x5yr21d x14yjl9h xudhj91 x18nykt9 xww2gxu xlkovuz x16j0l1c xyklrzc x1mh8g0r x1anpbxc x18wx58x xo92w5m';
  wrapper.appendChild(button);

  // Find the settings button container (it's usually the last section before profile)
  const settingsButton = toolbar.querySelector('button[aria-label="Settings"]');
  if (settingsButton) {
    const settingsContainer = settingsButton.closest('._ajv7');
    if (settingsContainer) {
      settingsContainer.parentNode.insertBefore(wrapper, settingsContainer);
    } else {
      toolbar.appendChild(wrapper);
    }
  } else {
    // Fallback: append to the end of toolbar
    toolbar.appendChild(wrapper);
  }

  return button;
}

// Toggle sidebar visibility
function toggleSidebar(button) {
  const body = document.body;
  const isHidden = body.classList.toggle('hide-sidebar');
  button.classList.toggle('active', isHidden);
  
  // Save preference
  chrome.storage.local.set({ sidebarHidden: isHidden });
}

// Initialize the extension
function init() {
  let retryCount = 0;
  const MAX_RETRIES = 30; // 30 seconds max
  
  const checkInterval = setInterval(() => {
    retryCount++;
    const toolbar = document.querySelector('[data-js-navbar="true"]');
    
    if (toolbar) {
      clearInterval(checkInterval);
      const button = createToggleButton();
      if (!button) {
        console.warn('WhatsApp Sidebar Hider: Failed to create toggle button');
        return;
      }

      // Add click handler
      button.addEventListener('click', () => toggleSidebar(button));

      // Restore previous state
      chrome.storage.local.get('sidebarHidden', (data) => {
        if (chrome.runtime.lastError) {
          console.warn('Failed to restore sidebar state:', chrome.runtime.lastError);
          return;
        }
        if (data.sidebarHidden) {
          document.body.classList.add('hide-sidebar');
          button.classList.add('active');
        }
      });
    } else if (retryCount >= MAX_RETRIES) {
      clearInterval(checkInterval);
      console.warn('WhatsApp Sidebar Hider: Failed to find toolbar after 30 seconds');
    }
  }, 1000);
}

// Start the extension
init(); 