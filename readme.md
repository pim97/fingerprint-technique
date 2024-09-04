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
   git clone https://github.com/pim97/fingerprint-technique.git
   ```

2. Navigate to the project directory:
   ```
   cd fingerprint-technique
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

## Brotector-inspired Detections

This fingerprinting script includes several detection methods inspired by Brotector:

1. **Webdriver Detection**: Checks if `navigator.webdriver` is true, which can indicate automation.

2. **CDC Properties**: Searches for window properties matching the pattern `cdc_[a-z0-9]`, which are often associated with Chrome DevTools Protocol.

3. **Runtime Enabled and Debugger Detection**: 
   - Counts stack lookups, which can be higher when a debugger is attached.
   - Measures timing differences that may occur when a debugger is present.

4. **High Entropy Values**: Attempts to retrieve high entropy values from the user agent, which can provide detailed system information.

5. **Input Coordinate Leak Detection**: Checks for suspicious patterns in mouse event coordinates that might indicate automation.

These detections contribute to a more comprehensive fingerprint and aid in identifying potential automated or headless browsers.


## Customization

You can modify the `fp.js` file to add or remove fingerprinting techniques or adjust the bot detection algorithm as needed for your specific use case. The modular structure allows for easy addition of new fingerprinting methods and bot detection rules.

## Security and Privacy Considerations

This tool is intended for educational and research purposes only. Be aware of legal and ethical considerations when implementing fingerprinting and bot detection techniques in production environments. Always inform users about data collection and respect their privacy preferences.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).