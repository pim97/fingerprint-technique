(async function debugFingerprinting() {
    const T = {};

    // Screen properties
    T.screen = {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth,
        pixelDepth: screen.pixelDepth,
        availWidth: screen.availWidth,
        availHeight: screen.availHeight
    };

    // Device information
    T.device = {
        platform: navigator.platform,
        userAgent: navigator.userAgent,
        hardwareConcurrency: navigator.hardwareConcurrency,
        deviceMemory: navigator.deviceMemory
    };

    // Browser details
    T.browser = {
        language: navigator.language,
        languages: [...navigator.languages],
        cookieEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack,
        plugins: Array.from(navigator.plugins).map(p => p.name),
        mimeTypes: Array.from(navigator.mimeTypes).map(m => m.type)
    };

    // Timezone
    T.timezone = {
        offset: new Date().getTimezoneOffset(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };

    // Canvas fingerprinting
    function getCanvasFingerprint() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = "top";
        ctx.font = "14px 'Arial'";
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = "#f60";
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = "#069";
        ctx.fillText("Hello, world!", 2, 15);
        ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
        ctx.fillText("Hello, world!", 4, 17);
        return canvas.toDataURL();
    }
    T.canvasFingerprint = getCanvasFingerprint();

    // WebGL information
    function getWebGLInfo() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) return null;
        return {
            vendor: gl.getParameter(gl.VENDOR),
            renderer: gl.getParameter(gl.RENDERER),
            extensions: gl.getSupportedExtensions()
        };
    }
    T.webgl = getWebGLInfo();

    // Audio fingerprinting
    async function getAudioFingerprint() {
        try {
            const audioContext = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, 44100, 44100);
            const oscillator = audioContext.createOscillator();
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(10000, audioContext.currentTime);
            const compressor = audioContext.createDynamicsCompressor();
            oscillator.connect(compressor);
            compressor.connect(audioContext.destination);
            oscillator.start(0);
            const audioBuffer = await audioContext.startRendering();
            const audioData = audioBuffer.getChannelData(0).slice(4500, 5000);
            return audioData.reduce((acc, val) => acc + Math.abs(val), 0).toString();
        } catch (e) {
            return null;
        }
    }
    T.audioFingerprint = await getAudioFingerprint();

    // Font detection
    function detectFont(fontName) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const testText = 'abcdefghijklmnopqrstuvwxyz0123456789';
        context.font = '12px serif';
        const serifWidth = context.measureText(testText).width;
        context.font = `12px ${fontName}, serif`;
        return context.measureText(testText).width !== serifWidth;
    }
    T.detectedFonts = [
        'Arial', 'Helvetica', 'Times New Roman', 'Courier', 'Verdana', 'Georgia', 'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS', 'Trebuchet MS', 'Arial Black', 'Impact'
    ].filter(detectFont);

    // Storage availability
    T.storageAvailability = {
        localStorage: !!window.localStorage,
        sessionStorage: !!window.sessionStorage,
        indexedDB: !!window.indexedDB
    };

    async function getWebRTCFingerprint() {
        return new Promise((resolve) => {
            const rtcPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
            if (rtcPeerConnection) {
                const pc = new rtcPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
                pc.createDataChannel("");
                pc.createOffer().then(offer => pc.setLocalDescription(offer));
                pc.onicecandidate = (ice) => {
                    if (ice && ice.candidate && ice.candidate.candidate) {
                        const localIP = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate)[1];
                        resolve(localIP);
                        pc.onicecandidate = () => { };
                        pc.close();
                    }
                };
            } else {
                resolve(null);
            }
        });
    }

    // Battery status
    function getBatteryStatus() {
        return new Promise((resolve) => {
            if ('getBattery' in navigator) {
                navigator.getBattery().then(battery => {
                    resolve({
                        level: battery.level,
                        charging: battery.charging,
                        chargingTime: battery.chargingTime,
                        dischargingTime: battery.dischargingTime
                    });
                });
            } else {
                resolve(null);
            }
        });
    }

    // CPU benchmarking
    function performCPUBenchmark() {
        const start = performance.now();
        let result = 0;
        for (let i = 0; i < 1000000; i++) {
            result += Math.sqrt(i);
        }
        const end = performance.now();
        return end - start;
    }

    // Pointer and input device detection
    function getInputDeviceInfo() {
        return {
            maxTouchPoints: navigator.maxTouchPoints || 0,
            touchSupport: 'ontouchstart' in window,
            pointerSupport: !!window.PointerEvent,
            hoverSupport: window.matchMedia('(hover: hover)').matches,
        };
    }

    const isHeadless = (() => {
        const userAgent = navigator.userAgent.toLowerCase();
        const oscpu = navigator.oscpu;
        const platform = navigator.platform.toLowerCase();

        if (
            /headless/.test(userAgent) ||
            navigator.webdriver ||
            !window.chrome ||
            !navigator.languages ||
            navigator.languages.length === 0
        ) {
            return true;
        }

        // Additional checks for inconsistencies
        if (platform.indexOf('win') === 0 && oscpu && oscpu.indexOf('Windows NT 10.0;') !== 0) {
            return true;
        }
        if (platform.indexOf('linux') === 0 && oscpu && oscpu.indexOf('Linux') !== 0) {
            return true;
        }
        if (
            /android/.test(userAgent) &&
            !('ontouchstart' in window || navigator.maxTouchPoints > 0)
        ) {
            return true;
        }

        return false;
    })();

    // Browser automation detection
    function detectAutomation() {
        return {
            webdriver: navigator.webdriver,
            automationControlled: !!window.cdc_adoQpoasnfa76pfcZLmcfl_Array,
            puppeteer: !!window._phantom || !!window.callPhantom,
            selenium: !!window.__selenium_evaluate || !!document.__selenium_evaluate,
            headless: isHeadless
        };
    }

    // Enhanced screen properties
    function getEnhancedScreenProperties() {
        return {
            pixelRatio: window.devicePixelRatio || 1,
            colorDepth: screen.colorDepth,
            orientation: screen.orientation ? screen.orientation.type : 'unknown',
            multiMonitor: window.screen.isExtended !== undefined ? window.screen.isExtended : 'unknown',
        };
    }

    // Expanded storage detection
    function getStorageCapacities() {
        return new Promise(async (resolve) => {
            const storage = {
                localStorage: !!window.localStorage,
                sessionStorage: !!window.sessionStorage,
                indexedDB: !!window.indexedDB,
            };

            if (navigator.storage && navigator.storage.estimate) {
                const { quota, usage } = await navigator.storage.estimate();
                storage.quota = quota;
                storage.usage = usage;
            }

            resolve(storage);
        });
    }

    // SHA-256 function
    async function sha256(message) {
        const utf8 = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    T.browser.webrtc = await getWebRTCFingerprint();
    T.device.battery = await getBatteryStatus();
    T.device.cpuBenchmark = performCPUBenchmark();
    T.device.inputDevices = getInputDeviceInfo();
    T.browser.automation = detectAutomation();
    T.screen.enhanced = getEnhancedScreenProperties();
    T.browser.storage = await getStorageCapacities();

    function detectBot(fingerprint) {
        let botScore = 0;
        const botIndicators = [];

        // Check for common bot indicators
        if (fingerprint.browser.automation.webdriver) {
            botScore += 0.5;
            botIndicators.push("Webdriver detected");
        }
        if (fingerprint.browser.automation.automationControlled) {
            botScore += 0.5;
            botIndicators.push("Automation controlled");
        }
        if (fingerprint.browser.automation.puppeteer) {
            botScore += 0.5;
            botIndicators.push("Puppeteer detected");
        }
        if (fingerprint.browser.automation.selenium) {
            botScore += 0.5;
            botIndicators.push("Selenium detected");
        }

        if (isHeadless) {
            botScore += 0.3;
            botIndicators.push("Headless browser detected");
        }

        // Check for suspicious hardware configurations
        if (fingerprint.device.hardwareConcurrency === 1) {
            botScore += 0.2;
            botIndicators.push("Single core CPU");
        }
        if (fingerprint.device.deviceMemory < 2) {
            botScore += 0.2;
            botIndicators.push("Low device memory");
        }

        // Check for missing or suspicious features
        if (!fingerprint.audioFingerprint) {
            botScore += 0.2;
            botIndicators.push("No audio fingerprint");
        }
        if (!fingerprint.canvasFingerprint) {
            botScore += 0.2;
            botIndicators.push("No canvas fingerprint");
        }
        if (!fingerprint.webgl) {
            botScore += 0.2;
            botIndicators.push("No WebGL support");
        }

        // Check for suspicious screen properties
        if (fingerprint.screen.width < 800 || fingerprint.screen.height < 600) {
            botScore += 0.2;
            botIndicators.push("Unusual screen size");
        }

        // Check for suspicious timezone
        if (fingerprint.timezone.offset === 0 && fingerprint.timezone.timezone === "UTC") {
            botScore += 0.2;
            botIndicators.push("UTC timezone");
        }

        // Check for lack of input devices
        if (fingerprint.device.inputDevices.maxTouchPoints === 0 && !fingerprint.device.inputDevices.touchSupport) {
            botScore += 0.1;
            botIndicators.push("No touch support");
        }

        // Determine if it's likely a bot
        const isLikelyBot = botScore >= 0.7;

        return {
            isLikelyBot,
            botScore,
            botIndicators
        };
    }

    // Generate fingerprint hash
    const fingerprintString = JSON.stringify(T);
    const fingerprintHash = await sha256(fingerprintString);

    // Perform bot detection
    const botDetectionResult = detectBot(T);

    // Display the fingerprint and hash
    console.log("Fingerprint data:", JSON.stringify(T, null, 2));
    console.log("Fingerprint hash (SHA-256):", fingerprintHash);

    // Bot detection result
    console.log("Bot detection result:", JSON.stringify(botDetectionResult, null, 2));

    // Return the fingerprint object and hash for further use
    return { fingerprint: T, hash: fingerprintHash, botDetection: botDetectionResult };
})().then(result => {
    // You can access the result here if needed
    console.log("Fingerprinting complete. Access the result via the returned Promise.");
}).catch(error => {
    console.error("An error occurred during fingerprinting:", error);
});