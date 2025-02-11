# WhatsApp Sidebar Toggle Extension

A simple Chrome extension that allows you to toggle the WhatsApp Web sidebar for a cleaner interface. Perfect for users who want to focus on their current chat or need more screen space.

## Features

- 🔄 Toggle sidebar visibility with one click
- 💾 Remembers your preference across sessions
- 🎨 Seamlessly integrates with WhatsApp Web's design
- 🚀 Lightweight and performant

## Installation

### From Source (Developer Mode)

1. Clone this repository or download the source code
```bash
git clone https://github.com/sanjeed5/whatsapp-sidebar-toggle.git
```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" in the top right corner

4. Click "Load unpacked" and select the extension directory

5. Open WhatsApp Web and you'll see a new toggle button in the toolbar

## Usage

1. Open WhatsApp Web (https://web.whatsapp.com)
2. Look for the sidebar toggle button in the toolbar (next to Settings)
3. Click to hide/show the sidebar
4. Your preference will be saved for future sessions

## Files Structure

```
whatsapp-sidebar-hider/
  ├── manifest.json      # Extension configuration
  ├── content.js         # Main functionality
  ├── styles.css         # Styling
  ├── icons/            
  │   └── icon.png       # Extension icon
  └── README.md         # This file
```

## Development

The extension is built using vanilla JavaScript and CSS. It uses:
- Chrome Extension Manifest V3
- Chrome Storage API for saving preferences
- CSS for styling and animations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Thanks to WhatsApp Web for their great UI that we could seamlessly integrate with
- Icons and styling inspired by WhatsApp's design system 