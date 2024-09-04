(async function debugFingerprinting() {
    const fingerprint = {};

    // Screen properties
    fingerprint.screen = {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth,
        pixelDepth: screen.pixelDepth,
        availWidth: screen.availWidth,
        availHeight: screen.availHeight
    };

    // Device information
    fingerprint.device = {
        platform: navigator.platform,
        userAgent: navigator.userAgent,
        hardwareConcurrency: navigator.hardwareConcurrency,
        deviceMemory: navigator.deviceMemory
    };

    // Browser details
    fingerprint.browser = {
        language: navigator.language,
        languages: navigator.languages,
        cookieEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack,
        plugins: Array.from(navigator.plugins).map(p => p.name),
        mimeTypes: Array.from(navigator.mimeTypes).map(m => m.type)
    };

    // Timezone
    fingerprint.timezone = {
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
    fingerprint.canvasFingerprint = getCanvasFingerprint();

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
    fingerprint.webgl = getWebGLInfo();

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
    fingerprint.audioFingerprint = await getAudioFingerprint();

    // Font detection (limited set for demonstration)
    function detectFont(fontName) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const testText = 'abcdefghijklmnopqrstuvwxyz0123456789';
        context.font = '12px serif';
        const serifWidth = context.measureText(testText).width;
        context.font = `12px ${fontName}, serif`;
        return context.measureText(testText).width !== serifWidth;
    }
    fingerprint.detectedFonts = [
        'Arial', 'Helvetica', 'Times New Roman', 'Courier', 'Verdana', 'Georgia', 'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS', 'Trebuchet MS', 'Arial Black', 'Impact'
    ].filter(detectFont);

    // Storage availability
    fingerprint.storageAvailability = {
        localStorage: !!window.localStorage,
        sessionStorage: !!window.sessionStorage,
        indexedDB: !!window.indexedDB
    };

    function sha256(message) {
        const utf8 = new TextEncoder().encode(message);
        return crypto.subtle.digest('SHA-256', utf8).then(hashBuffer => {
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        });
    }

    const fingerprintHash = await sha256(fingerprint);
    
    // Display the fingerprint
    console.log(JSON.stringify(fingerprint, null, 2));
    console.log("Fingerprint hash (SHA-256):", fingerprintHash);
})();