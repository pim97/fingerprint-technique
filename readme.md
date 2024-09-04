# Advanced Browser Fingerprinting and Bot Detection Tool

This project provides a comprehensive browser fingerprinting tool that generates a unique identifier for a user's browser and includes advanced bot detection capabilities. It's designed for educational and research purposes, demonstrating various techniques used in browser fingerprinting and bot detection.

## Features

- Collects extensive browser and device characteristics
- Implements canvas, WebGL, and audio fingerprinting techniques
- Detects installed fonts
- Performs CPU benchmarking
- Detects input devices and automation
- Generates a SHA-256 hash as a unique identifier
- Advanced bot detection algorithm
- Works entirely client-side in the browser

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/advanced-browser-fingerprinting-tool.git
   ```

2. Navigate to the project directory:
   ```
   cd advanced-browser-fingerprinting-tool
   ```

3. Open the `index.html` file in a web browser or serve it using a local server.

## Usage

### Method 1: Including in HTML

1. Include the `fp.js` script in your HTML file:

   ```html
   <script src="fp.js"></script>
   ```

2. The script will automatically run when the page loads, collecting fingerprint data, generating a unique identifier, and performing bot detection.

### Method 2: Browser Console Debugging

1. Open your browser's developer tools (usually F12 or right-click and select "Inspect").
2. Go to the Console tab.
3. Copy the entire content of `fp.js` and paste it into the console.
4. Press Enter to execute the code.

The fingerprint data, hash, and bot detection results will be logged to the console for immediate viewing.

## Fingerprinting Techniques

This tool uses various techniques to create a unique browser fingerprint:

- Screen and window properties
- Device information
- Browser details and settings
- Timezone information
- Canvas fingerprinting
- WebGL information
- Audio fingerprinting
- Font detection
- Storage availability
- WebRTC fingerprinting
- Battery status
- CPU benchmarking
- Input device detection
- Browser automation detection
- Enhanced screen properties
- Expanded storage detection

## Bot Detection

The tool includes an advanced bot detection algorithm that analyzes the collected fingerprint data to determine the likelihood of the client being a bot. It checks for:

- Presence of automation tools (WebDriver, Puppeteer, Selenium)
- Headless browser indicators
- Suspicious hardware configurations
- Missing or unusual browser features
- Inconsistent platform and OS information
- Unusual screen properties
- Suspicious timezone settings
- Lack of expected input devices

The bot detection provides a bot score and a list of detected indicators, allowing for flexible decision-making based on the specific use case.

## Customization

You can modify the `fp.js` file to add or remove fingerprinting techniques or adjust the bot detection algorithm as needed for your specific use case. The modular structure allows for easy addition of new fingerprinting methods and bot detection rules.

## Security and Privacy Considerations

This tool is intended for educational and research purposes only. Be aware of legal and ethical considerations when implementing fingerprinting and bot detection techniques in production environments. Always inform users about data collection and respect their privacy preferences.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).