# WhatsApp Sidebar Toggle Extension

## Overview
A simple Chrome extension that adds a toggle button to WhatsApp Web to show/hide the sidebar for a cleaner interface.

## Why
WhatsApp Web's default interface always shows the chat sidebar, which can be distracting and takes up valuable screen space when focusing on a single conversation. This extension solves several key problems:

1. **Screen Space Optimization**: Maximizes the chat viewing area, especially beneficial for users with smaller screens
2. **Focus Mode**: Reduces distractions by hiding other conversations when concentrating on one chat
3. **User Control**: Gives users the flexibility to choose their preferred viewing mode
4. **Productivity**: Helps maintain focus during important conversations or when taking meeting notes
5. **Clean Interface**: Provides a more minimalist and cleaner WhatsApp Web experience

## Features
1. Add a toggle button to the WhatsApp Web toolbar
2. Hide/Show the sidebar when button is clicked
3. Remember user's preference across page reloads

## Technical Implementation Plan

### 1. Extension Structure
```
whatsapp-sidebar-hider/
  ├── manifest.json
  ├── content.js
  ├── styles.css
  └── icons/
      └── icon.png
```

### 2. Implementation Steps
1. Create manifest.json with required permissions
2. Create content script to:
   - Add toggle button to toolbar
   - Implement toggle functionality
   - Store user preference
3. Add CSS for styling button and hiding sidebar

### 3. Technical Details
- Target elements:
  - Sidebar container: The parent div containing both header and sidebar
    ```css
    div._aigw[class*="x9f619"][class*="x1n2onr6"]
    ```
  - Sidebar element: `div#side` (with its parent structure)
  - Toolbar: Element with `[data-js-navbar="true"]` attribute
  - Button placement: Inside the toolbar's button group container with class `_ajv7`

- Toggle implementation:
  - Use CSS display property
  - Store preference in chrome.storage.local
  - Toggle both sidebar and its parent container

## Timeline
1-2 hours for basic implementation

## Future Enhancements (Optional)
- Keyboard shortcut for toggle
- Custom animation effects
- Adjustable sidebar width
