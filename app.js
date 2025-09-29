// Hls will now be available globally because it's loaded via a standard script tag in index.html

// Import recording utility from recorder.js
import { startSuccessAnimationRender } from './recorder.jsx';

const videoContainer = document.getElementById('video-container');
const tvPlayer = document.getElementById('tv-player');
const mediaViewerImg = document.getElementById('media-viewer-img'); // New image element
const mainContent = document.getElementById('main-content');
const channelButtons = document.querySelectorAll('.channel-button');
const playerUI = document.getElementById('player-ui');
const uiChannelName = document.getElementById('ui-channel-name');
const uiStopButton = document.getElementById('ui-stop-button');
const uiRecordButton = document.getElementById('ui-record-button');
const uiCaptureButton = document.getElementById('ui-capture-button');
const uiPlayPauseButton = document.getElementById('ui-play-pause-button');
const uiGuideButton = document.getElementById('ui-guide-button'); // New Guide button
const uiRewindButton = document.getElementById('ui-rewind-button'); // New Rewind button
const uiFastForwardButton = document.getElementById('ui-fast-forward-button'); // New Fast Forward button
const uiCCButton = document.getElementById('ui-cc-button'); // NEW CC button
const channelNumberDisplay = document.getElementById('channel-number-display');

// Seek Overlay Elements (New)
const seekOverlay = document.getElementById('seek-overlay');
const seekTimeDisplay = document.getElementById('seek-time');
const seekIndicator = document.getElementById('seek-indicator');
const seekCurrentTime = document.getElementById('seek-current-time');
const seekLiveTime = document.getElementById('seek-live-time');
const progressBuffer = document.getElementById('progress-buffer');
const progressSeekThumb = document.getElementById('progress-seek-thumb');
const progressLiveEdge = document.getElementById('progress-live-edge');

// Recording Status Overlay Elements (New)
const recordingStatusOverlay = document.getElementById('recording-status-overlay');
const recordingTimestamp = document.getElementById('recording-timestamp');
const uiRecordPauseButton = document.getElementById('ui-record-pause');
const uiRecordStopButton = document.getElementById('ui-record-stop');

// Custom Alert Elements (New)
const customAlertModal = document.getElementById('custom-alert-modal');
const customAlertMessage = document.getElementById('custom-alert-message');
const customAlertButtons = document.getElementById('custom-alert-buttons');
let customAlertCallback = null; // Stores the promise resolve function or callback for the current alert
let activeAlertButtons = []; // Stores the actual button elements

// P2P Transfer Modal Elements (New)
const p2pTransferModal = document.getElementById('p2p-transfer-modal');
const p2pCloseButton = document.getElementById('p2p-close-button');
const transferShareModeButton = document.getElementById('transfer-share-mode');
const transferReceiveModeButton = document.getElementById('transfer-receive-mode');
const transferShareUI = document.getElementById('transfer-share-ui');
const transferReceiveUI = document.getElementById('transfer-receive-ui');
const transferContentSelect = document.getElementById('transfer-content-select');
const transferGenerateCodeButton = document.getElementById('transfer-generate-code');
const transferCodeDisplay = document.getElementById('transfer-code-display');
const sharingCodeSpan = document.getElementById('sharing-code');
const transferStatusCodeShare = document.getElementById('transfer-status-share');
const transferCodeInput = document.getElementById('transfer-code-input');
const transferStartReceiveButton = document.getElementById('transfer-start-receive');
const transferStatusCodeReceive = document.getElementById('transfer-status-receive');
let transferInterval = null; // Interval for polling transfer status

// Guide Overlay Elements
const guideOverlay = document.getElementById('guide-overlay'); // New overlay container
const guideBackButton = document.getElementById('guide-back-button'); // New back button
const guideRealTimeClock = document.getElementById('guide-real-time-clock'); // New clock element

// Tab Navigation Elements
const navButtons = document.querySelectorAll('.nav-button');
const liveTvView = document.getElementById('live-tv-view');
const recordingsView = document.getElementById('recordings-view');
const capturesView = document.getElementById('captures-view'); // New capture view
const guideView = document.getElementById('guide-view'); // Fallback/Standalone guide view
const recordingsList = document.getElementById('recordings-list');
const noRecordingsMessage = document.getElementById('no-recordings');
const capturesList = document.getElementById('captures-list'); // New capture list
const noCapturesMessage = document.getElementById('no-captures'); // New no captures message

// Settings View Elements (New)
const settingsView = document.getElementById('settings-view');
const themeSelect = document.getElementById('theme-select');
const applyThemeButton = document.getElementById('apply-theme-button');

// New Settings Controls
const fontSelect = document.getElementById('font-select'); // New element
const liveTvFramesSelect = document.getElementById('live-tv-frames');
const liveTvQualitySelect = document.getElementById('live-tv-quality');
const recordingConversionSelect = document.getElementById('recording-conversion');
const openColorPickerButton = document.getElementById('open-color-picker-button');
const buttonColorDisplay = document.getElementById('button-color-display');

// NEW Captions Style Elements
const captionFontSelect = document.getElementById('caption-font-select');
const captionTextColorInput = document.getElementById('caption-text-color-input');
const captionTextTransparencyInput = document.getElementById('caption-text-transparency-input');
const captionTextTransparencyDisplay = document.getElementById('caption-text-transparency-display');
const captionBgColorInput = document.getElementById('caption-bg-color-input');
const captionBgTransparencyInput = document.getElementById('caption-bg-transparency-input');
const captionBgTransparencyDisplay = document.getElementById('caption-bg-transparency-display');
const captionOutlineSelect = document.getElementById('caption-outline-select');
const captionShadowSelect = document.getElementById('caption-shadow-select');

// NEW Captions Size and Position Elements
const captionSizeSelect = document.getElementById('caption-size-select');
const captionPositionSelect = document.getElementById('caption-position-select');

// NEW Language and Scale controls
const languageSelect = document.getElementById('language-select');
const guiScaleSelect = document.getElementById('gui-scale-select');

// Color Picker Modal Elements
const colorPickerModal = document.getElementById('color-picker-modal');
const colorPickerCloseButton = document.getElementById('color-picker-close-button');
const htmlColorInput = document.getElementById('html-color-input');
const colorSwatchesContainer = document.getElementById('color-swatches');
const applyColorButton = document.getElementById('apply-color-button');

// Notification Elements (New)
const notificationPopup = document.getElementById('notification-popup');
const notificationMessage = document.getElementById('notification-message');
let audioContext = null;
let recordingSuccessBuffer = null; // This will hold the "tada" sound

// Guide elements
const guideChannelsContainer = document.getElementById('guide-channels');
const guideTimelineContainer = document.getElementById('guide-timeline');

let hlsInstance = null;
let uiTimeout = null;
let clockUpdateInterval = null; // New interval for the clock
let guideUpdateInterval = null; // New interval variable for time indicator // This variable is now mostly redundant but keeping for old context, the tracking happens on the indicatorLine element itself.
let currentChannelId = null;
let currentChannelName = '';
let isRecording = false;
let isRecordingPaused = false; // New state for recording pause
let isCCEnabled = false; // NEW state for Closed Captioning
let mediaRecorder = null; // Media Recorder API instance
let recordedChunks = []; // Array to hold recorded data chunks
let recordingStartTime = 0; // Timestamp for recording duration
let recordingPauseTime = 0; // Timestamp for handling pauses
let recordingDurationOffset = 0; // Accumulated duration during pauses
let recordingTimerInterval = null; // Interval for updating recording timestamp

let currentView = 'live-tv';
let previousChannelContext = null; // Store channel info when going to guide/main menu

// State for seeking UI
let seekOverlayTimeout = null;
let isSeeking = false;
const MAX_DVR_WINDOW_SECONDS = 3600; // Assume a 1 hour DVR window for demonstration

// Global arrays to store metadata
let recordings = loadRecordings();
let captures = loadCaptures();

// Channel Map for number switching
const channelMap = {
    1: { name: "Duna World", url: "https://c402-node61-cdn.connectmedia.hu/150106/70ab723615bc8a634a45a5aad84c39ab/68d99429/index.m3u8" },
    2: { name: "M1", url: "https://c402-node61-cdn.connectmedia.hu/110101/a97828deb07e70d70b41d3032a7de1b2/68da2a2b/index.m3u8" },
    3: { name: "M2", url: "https://c201-node61-cdn.connectmedia.hu/110102/2449392930b8d80b9a5e80c1a9be8b0e/68da2b55/index.m3u8" },
    4: { name: "M4 Sport", url: "https://c201-node62-cdn.connectmedia.hu/150104/601bd25e6c88cddcca86c4ba45ec8927/68da9e5a/index.m3u8" },
    5: { name: "M4 Sport 2", url: "https://c202-node62-cdn.connectmedia.hu/150108/b56fb5c15b2ae8656c345b9179797fe4/68da9f78/index.m3u8" },
    6: { name: "M4 Sport 3", url: "https://c201-node62-cdn.connectmedia.hu/150109/e95304df4cb1ee757c003fe9b7a5c0fb/68daa00f/index.m3u8" },
    7: { name: "M4 Sport 4", url: "https://c201-node61-cdn.connectmedia.hu/150110/323ab759df9f3e03809c580b8a485898/68daa076/index.m3u8" },
    8: { name: "M4 Sport 5", url: "https://c402-node61-cdn.connectmedia.hu/150111/d73176fe0f6fe995c8a4f4da4b388b84/68daa0c8/index.m3u8" },
};

// --- Dynamic Configuration Variables ---
let RECORDING_FPS = 60; // Default, loaded from settings
let RECORDING_BITRATE = 10000000; // Default, loaded from settings
let RECORDING_FORMAT = 'mp4'; // Default, loaded from settings
let BUTTON_COLOR = '#00bcd4'; // Default cyan
let FONT_FAMILY = 'sans-serif'; // New: Default font

// NEW Caption Style Defaults
const CAPTION_STYLE_DEFAULTS = {
    captionFont: 'sans-serif',
    captionTextColor: '#ffffff',
    captionTextOpacity: 100,
    captionBgColor: '#000000',
    captionBgOpacity: 80,
    captionOutline: 'none',
    captionShadow: 'none',
    captionSize: 'medium', // NEW default size
    captionPosition: 'bottom', // NEW default position
};

// NEW Localization and GUI Scale Variables
let CURRENT_LANGUAGE = 'en';
let GUI_SCALE = 'medium'; // 'small', 'medium', 'large'

// Flag URL Map
const FLAG_URLS = {
    'en': 'https://flagpedia.net/data/flags/h240/us.webp',
    'hu': 'https://flagpedia.net/data/flags/h240/hu.webp',
    'pl': 'https://flagpedia.net/data/flags/h240/pl.webp',
    'ru': 'https://flagpedia.net/data/flags/h240/ru.webp',
};

// Localization Map (Basic translation of key static UI elements)
const LANG_MAP = {
    'en': {
        'live-tv': 'Live TV',
        'recordings': 'Recordings',
        'captures': 'Captures',
        'settings': 'Settings',
        'channels': 'Current Channels',
        'your-recordings': 'Your Recordings',
        'your-captures': 'Your Captures (Screenshots)',
        'settings-h2': 'Settings',
        'appearance': 'Appearance',
        'select-theme': 'Select Theme:',
        'apply-theme': 'Apply Theme',
        'select-font': 'Select Font Family:',
        'btn-custom': 'Button Customization',
        'primary-color': 'Primary Button Color:',
        'choose-color': 'Choose Color',
        'tv-quality-recording': 'Live TV Quality & Recording',
        'tv-frames': 'Live TV Frames (FPS):',
        'tv-quality': 'Live TV Quality (Bitrate Mbps):',
        'recording-conversion': 'Recording Conversion Format:',
        'select-language': 'Select Language:',
        'gui-scale': 'GUI Scale:',
    },
    'hu': {
        'live-tv': 'Élő TV',
        'recordings': 'Felvételek',
        'captures': 'Képernyőképek',
        'settings': 'Beállítások',
        'channels': 'Jelenlegi csatornák',
        'your-recordings': 'Saját felvételek',
        'your-captures': 'Saját Képernyőképek',
        'settings-h2': 'Beállítások',
        'appearance': 'Megjelenés',
        'select-theme': 'Válasszon témát:',
        'apply-theme': 'Alkalmazza a témát',
        'select-font': 'Válasszon betűtípust:',
        'btn-custom': 'Gomb testreszabása',
        'primary-color': 'Elsődleges gomb színe:',
        'choose-color': 'Szín kiválasztása',
        'tv-quality-recording': 'Élő TV minőség és felvétel',
        'tv-frames': 'Élő TV képkocka (FPS):',
        'tv-quality': 'Élő TV minőség (Bitráta Mbps):',
        'recording-conversion': 'Felvétel konverziós formátuma:',
        'select-language': 'Válasszon nyelvet:',
        'gui-scale': 'GUI skála:',
    },
    'pl': {
        'live-tv': 'TV na żywo',
        'recordings': 'Nagrania',
        'captures': 'Zrzuty ekranu',
        'settings': 'Ustawienia',
        'channels': 'Aktualne kanały',
        'your-recordings': 'Twoje nagrania',
        'your-captures': 'Twoje zrzuty ekranu',
        'settings-h2': 'Ustawienia',
        'appearance': 'Wygląd',
        'select-theme': 'Wybierz motyw:',
        'apply-theme': 'Zastosuj motyw',
        'select-font': 'Wybierz rodzinę czcionek:',
        'btn-custom': 'Dostosowanie przycisków',
        'primary-color': 'Główny kolor przycisku:',
        'choose-color': 'Wybierz kolor',
        'tv-quality-recording': 'Jakość TV na żywo i nagrywanie',
        'tv-frames': 'Klatki TV na żywo (FPS):',
        'tv-quality': 'Jakość TV na żywo (Bitrate Mbps):',
        'recording-conversion': 'Format konwersji nagrania:',
        'select-language': 'Wybierz język:',
        'gui-scale': 'Skala GUI:',
    },
    'ru': {
        'live-tv': 'Прямой эфир',
        'recordings': 'Записи',
        'captures': 'Скриншоты',
        'settings': 'Настройки',
        'channels': 'Текущие каналы',
        'your-recordings': 'Ваши записи',
        'your-captures': 'Ваши скриншоты',
        'settings-h2': 'Настройки',
        'appearance': 'Внешний вид',
        'select-theme': 'Выбрать тему:',
        'apply-theme': 'Применить тему',
        'select-font': 'Выбрать шрифт:',
        'btn-custom': 'Настройка кнопок',
        'primary-color': 'Основной цвет кнопки:',
        'choose-color': 'Выбрать цвет',
        'tv-quality-recording': 'Качество прямого эфира и запись',
        'tv-frames': 'Кадры в секунду (FPS):',
        'tv-quality': 'Качество прямого эфира (Битрейт Mbps):',
        'recording-conversion': 'Формат конвертации записи:',
        'select-language': 'Выбрать язык:',
        'gui-scale': 'Масштаб интерфейса:',
    }
};

// --- Configuration Constants ---
const UPLOAD_SIMULATION_MAX_PROGRESS = 0.20; // Upload finishes at 20%
const REMOTION_SIMULATION_MIN_PROGRESS = 0.20; // Remotion starts at 20% and goes up to 100%

// --- Guide Configuration Constants ---
const GUIDE_START_MINUTES = 360; // 6:00 AM
const GUIDE_END_MINUTES = 1080; // 6:00 PM (18:00)

// Removed channels 3 and 4 as per user request to use only existing streams/channels in the guide
// For the Guide, we only use the primary channels (1 and 2) but we still need static guide data.
const STATIC_GUIDE_DATA = {
    1: [ // Duna World
        { start: 360, duration: 60, name: "Early Morning News" }, // 6:00 - 7:00 (360-420)
        { start: 450, duration: 90, name: "Kids Cartoons" }, // 7:30 - 9:00 (450-540)
        { start: 540, duration: 90, name: "Morning News" }, // 9:00 - 10:30 (540-630)
        { start: 630, duration: 60, name: "Hungarian Folklore" }, // 10:30 - 11:30 (630-690)
        { start: 690, duration: 120, name: "Noontime Documentary Series" }, // 11:30 - 1:30 (690-810)
        { start: 810, duration: 120, name: "Afternoon Report" }, // 1:30 - 3:30 (810-930)
        { start: 930, duration: 150, name: "Evening Magazine" }, // 3:30 - 6:00 (930-1080)
    ],
    2: [ // M1
        { start: 360, duration: 180, name: "Breakfast Talk Show" }, // 6:00 - 9:00 (360-540)
        { start: 540, duration: 120, name: "International Affairs Live" }, // 9:00 - 11:00 (540-660)
        { start: 660, duration: 60, name: "Weather Report" }, // 11:00 - 12:00 (660-720)
        { start: 720, duration: 90, name: "Political Talk Show" }, // 12:00 - 1:30 (720-810)
        { start: 810, duration: 270, name: "Prime Time Preparation" }, // 1:30 - 6:00 (810-1080)
    ],
    3: [ // M2
        { start: 360, duration: 120, name: "Good Morning Hungary" }, // 6:00 - 8:00 (360-480)
        { start: 480, duration: 90, name: "Cultural Focus" }, // 8:00 - 9:30 (480-570)
        { start: 570, duration: 90, name: "Morning Magazine" }, // 9:30 - 11:00 (570-660)
        { start: 660, duration: 120, name: "Regional News Hour" }, // 11:00 - 1:00 (660-780)
        { start: 780, duration: 90, name: "Classical Music Block" }, // 1:00 - 2:30 (780-870)
        { start: 870, duration: 210, name: "Late Afternoon Drama Series" }, // 2:30 - 6:00 (870-1080)
    ],
    4: [ // M4 Sport (New)
        { start: 360, duration: 120, name: "Sports Morning" }, // 6:00 - 8:00
        { start: 480, duration: 120, name: "E-Sport Tournament Highlights" }, // 8:00 - 10:00
        { start: 600, duration: 60, name: "Live Athletics: Marathon" }, // 10:00 - 11:00
        { start: 660, duration: 150, name: "Football Analysis" }, // 11:00 - 1:30
        { start: 810, duration: 150, name: "Afternoon Match Live" }, // 1:30 - 4:00
        { start: 960, duration: 120, name: "Prime Time Sports News" }, // 4:00 - 6:00
    ],
    5: [ // M4 Sport 2 (New)
        { start: 360, duration: 180, name: "Tennis Replay" }, // 6:00 - 9:00
        { start: 540, duration: 180, name: "Archived Olympic Events" }, // 9:00 - 12:00
        { start: 720, duration: 120, name: "Swimming Practice Live" }, // 12:00 - 2:00
        { start: 840, duration: 240, name: "Regional Basketball League" }, // 2:00 - 6:00
    ],
    6: [ // M4 Sport 3 (New)
        { start: 360, duration: 60, name: "Morning Warmup" }, // 6:00 - 7:00
        { start: 420, duration: 120, name: "Cycling Tour Stage 1" }, // 7:00 - 9:00
        { start: 540, duration: 180, name: "Handball Highlights" }, // 9:00 - 12:00
        { start: 720, duration: 180, name: "International Horse Racing" }, // 12:00 - 3:00
        { start: 900, duration: 180, name: "Motor Sports Magazine" }, // 3:00 - 6:00
    ],
    7: [ // M4 Sport 4 (New)
        { start: 360, duration: 120, name: "Adventure Sports Showcase" }, // 6:00 - 8:00
        { start: 480, duration: 120, name: "Fitness Workout Class" }, // 8:00 - 10:00
        { start: 600, duration: 180, name: "Golf Tournament Day 2" }, // 10:00 - 1:00
        { start: 780, duration: 150, name: "Volleyball Championship" }, // 1:00 - 3:30
        { start: 930, duration: 150, name: "Local Sports Interviews" }, // 3:30 - 6:00
    ],
    8: [ // M4 Sport 5 (New)
        { start: 360, duration: 180, name: "Water Polo Training" }, // 6:00 - 9:00
        { start: 540, duration: 120, name: "Fencing World Cup Replay" }, // 9:00 - 11:00
        { start: 660, duration: 120, name: "Live Commentary Block" }, // 11:00 - 1:00
        { start: 780, duration: 300, name: "Multi-Sport Coverage" }, // 1:00 - 6:00
    ]
};

// Map channel numbers from the map keys
const channelIds = Object.keys(channelMap).map(id => parseInt(id)).sort((a, b) => a - b);

// Utility function to format bytes
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}


// --- Storage Functions ---
function loadRecordings() {
    try {
        const stored = localStorage.getItem('tvz_recordings');
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error("Could not load recordings from storage", e);
        return [];
    }
}

function saveRecordings() {
    localStorage.setItem('tvz_recordings', JSON.stringify(recordings));
    renderRecordingsList();
}

function loadCaptures() {
    try {
        const stored = localStorage.getItem('tvz_captures');
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error("Could not load captures from storage", e);
        return [];
    }
}

function saveCaptures() {
    localStorage.setItem('tvz_captures', JSON.stringify(captures));
    renderCapturesList();
}

// --- Theme Management ---

const DEFAULT_SETTINGS = {
    theme: 'dark',
    fps: 60,
    bitrate: 10000000,
    format: 'mp4',
    buttonColor: '#00bcd4', // Default: cyan (little bit dark)
    fontFamily: 'sans-serif', // New default font
    language: 'en', // NEW default language
    guiScale: 'medium', // NEW default scale
    ...CAPTION_STYLE_DEFAULTS // NEW Caption styles
};

function loadSettings() {
    try {
        const storedSettings = JSON.parse(localStorage.getItem('tvz_settings'));
        return { ...DEFAULT_SETTINGS, ...storedSettings };
    } catch (e) {
        console.error("Could not load settings, using defaults.", e);
        return DEFAULT_SETTINGS;
    }
}

function saveSettings(settings) {
    localStorage.setItem('tvz_settings', JSON.stringify(settings));
    applySettings(settings);
}

function applySettings(settings) {
    // 1. Theme
    applyTheme(settings.theme);
    if (themeSelect) themeSelect.value = settings.theme;
    
    // 2. Button Color
    applyButtonColor(settings.buttonColor);

    // 3. Font Family
    applyFontFamily(settings.fontFamily);
    if (fontSelect) fontSelect.value = settings.fontFamily;
    
    // NEW: 4. Language and Localization
    applyLanguage(settings.language);
    
    // NEW: 5. GUI Scale
    applyGuiScale(settings.guiScale);

    // NEW: 6. Captions Style
    applyCaptionsStyle(settings);
    
    // 7. Recording Quality
    RECORDING_FPS = parseInt(settings.fps);
    RECORDING_BITRATE = parseInt(settings.bitrate);
    RECORDING_FORMAT = settings.format;

    // Update UI select boxes
    if (liveTvFramesSelect) liveTvFramesSelect.value = RECORDING_FPS;
    if (liveTvQualitySelect) liveTvQualitySelect.value = RECORDING_BITRATE;
    if (recordingConversionSelect) recordingConversionSelect.value = RECORDING_FORMAT;
}

function applyTheme(themeName) {
    if (themeName === 'light') {
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.remove('light-theme');
    }
    // Theme setting is now part of the central settings object, but we keep this for legacy storage
    // localStorage.setItem('tvz_theme', themeName); 
}

function applyButtonColor(color) {
    BUTTON_COLOR = color;
    document.documentElement.style.setProperty('--primary-color', color);
    
    // Check luminance to determine primary text color (black or white)
    const r = parseInt(color.substring(1, 3), 16);
    const g = parseInt(color.substring(3, 5), 16);
    const b = parseInt(color.substring(5, 7), 16);
    // Simple luminance calculation (0 to 255)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b); 
    const textColor = luminance > 180 ? '#1a1a1a' : 'white'; // Use darker text for brighter backgrounds
    document.documentElement.style.setProperty('--primary-text-color', textColor);

    // Update the color display circle in settings
    if (buttonColorDisplay) {
        buttonColorDisplay.style.backgroundColor = color;
    }
}

function applyFontFamily(fontName) {
    FONT_FAMILY = fontName; // Corrected: use fontName parameter instead of undefined variable 'fontFamily'
    document.documentElement.style.setProperty('--main-font-family', fontName);
}

/**
 * Converts a hex color and opacity percentage (0-100) into an RGBA string.
 * @param {string} hex Hex color string (#RRGGBB)
 * @param {number} opacity Opacity percentage (0 to 100)
 * @returns {string} RGBA string
 */
function hexToRgba(hex, opacity) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const a = opacity / 100;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/**
 * Applies the selected caption styles to CSS variables.
 * @param {Object} settings Current application settings object.
 */
function applyCaptionsStyle(settings) {
    const root = document.documentElement.style;
    
    // Font
    root.setProperty('--caption-font-family', settings.captionFont);
    if (captionFontSelect) captionFontSelect.value = settings.captionFont;
    
    // Size (Map semantic size to a REM value)
    let fontSizeRem = 1.2;
    switch (settings.captionSize) {
        case 'small':
            fontSizeRem = 1.0;
            break;
        case 'large':
            fontSizeRem = 1.5;
            break;
        case 'extra-large':
            fontSizeRem = 2.0;
            break;
        case 'medium':
        default:
            fontSizeRem = 1.2;
            break;
    }
    root.setProperty('--caption-font-size', `${fontSizeRem}rem`);
    if (captionSizeSelect) captionSizeSelect.value = settings.captionSize;
    
    // Position (Maps position to a vertical alignment setting, 
    // which is used to position the VTT container if custom rendering is used)
    let positionVertical = 'end'; // 'start', 'center', 'end' (bottom)
    switch (settings.captionPosition) {
        case 'top':
            positionVertical = 'start';
            break;
        case 'center':
            positionVertical = 'center';
            break;
        case 'bottom':
        default:
            positionVertical = 'end';
            break;
    }
    // We use a CSS variable that can influence a custom rendering layer's layout
    root.setProperty('--caption-position-vertical', positionVertical);
    if (captionPositionSelect) captionPositionSelect.value = settings.captionPosition;
    
    // Text Color & Opacity
    root.setProperty('--caption-text-color', settings.captionTextColor);
    root.setProperty('--caption-text-opacity', settings.captionTextOpacity / 100);
    if (captionTextColorInput) captionTextColorInput.value = settings.captionTextColor;
    if (captionTextTransparencyInput) captionTextTransparencyInput.value = settings.captionTextOpacity;
    if (captionTextTransparencyDisplay) captionTextTransparencyDisplay.textContent = `${settings.captionTextOpacity}%`;
    
    // Background Color & Opacity
    // To properly support background opacity in a universal way, we modify the background color variable
    const bgRgba = hexToRgba(settings.captionBgColor, settings.captionBgOpacity);
    root.setProperty('--caption-bg-color', bgRgba); // Set as RGBA
    
    if (captionBgColorInput) captionBgColorInput.value = settings.captionBgColor;
    if (captionBgTransparencyInput) captionBgTransparencyInput.value = settings.captionBgOpacity;
    if (captionBgTransparencyDisplay) captionBgTransparencyDisplay.textContent = `${settings.captionBgOpacity}%`;

    // Outline/Shadow/Glow (Text Shadow simulation)
    let shadowStyle = 'none';
    
    // 1. Outline simulation
    if (settings.captionOutline === 'solid') {
        shadowStyle += '1px 1px 0 black, -1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black';
    } else if (settings.captionOutline === 'thin') {
        shadowStyle += '1px 1px 1px white';
    } else if (settings.captionOutline === 'thick') {
        shadowStyle += '2px 2px 0px yellow, -2px -2px 0px yellow, 2px -2px 0px yellow, -2px 2px 0px yellow';
    }
    
    // 2. Shadow/Glow simulation
    if (settings.captionShadow === 'raised') {
        if (shadowStyle !== 'none') shadowStyle += ', ';
        shadowStyle = shadowStyle.replace('none', '') + '2px 2px 3px rgba(0, 0, 0, 0.7)';
    } else if (settings.captionShadow === 'depressed') {
        if (shadowStyle !== 'none') shadowStyle += ', ';
        shadowStyle = shadowStyle.replace('none', '') + '1px 1px 1px rgba(255, 255, 255, 0.4), -1px -1px 1px rgba(0, 0, 0, 0.4)';
    } else if (settings.captionShadow === 'glow') {
        if (shadowStyle !== 'none') shadowStyle += ', ';
        shadowStyle = shadowStyle.replace('none', '') + '0 0 5px rgba(255, 255, 255, 0.8)';
    }
    
    if (shadowStyle.startsWith(', ')) {
        shadowStyle = shadowStyle.substring(2);
    }
    
    root.setProperty('--caption-text-shadow', shadowStyle.trim() === '' ? 'none' : shadowStyle);
    
    if (captionOutlineSelect) captionOutlineSelect.value = settings.captionOutline;
    if (captionShadowSelect) captionShadowSelect.value = settings.captionShadow;
    
    // Attempt to force update native video caption style if available
    // We check if the video element is currently attached to a stream
    if (tvPlayer.textTracks) {
         Array.from(tvPlayer.textTracks).forEach(track => {
            if (track.kind === 'subtitles' || track.kind === 'captions') {
                 // Even if CC is toggled off in our app, we still want to update the styling 
                 // in case the user toggles it back on via our CC button or native controls.
                 
                 // NOTE: This property change doesn't directly apply the CSS variables 
                 // to already rendered cues, but it's the necessary step to signal 
                 // the browser to update the ::cue pseudo-element style.
                 
                 // Since our CC button state (isCCEnabled) is not globally saved/restored,
                 // we rely on it being toggled on/off after loading settings.
                 // For immediate visibility of style changes, we re-apply the track mode 
                 // based on the global state, even though this function is called on settings load.
                 // The actual CC state is managed by toggleClosedCaptioning().
                 
                 // If the track is set to 'showing', modifying the CSS variable 
                 // should trigger a redraw in supporting browsers.
            }
        });
    }
}


/**
 * Applies the selected language and updates relevant static texts.
 * @param {string} langCode 
 */
function applyLanguage(langCode) {
    CURRENT_LANGUAGE = langCode;
    const lang = LANG_MAP[langCode] || LANG_MAP['en'];
    
    if (languageSelect) languageSelect.value = langCode;

    // 1. Update Navigation Buttons
    navButtons.forEach(btn => {
        const view = btn.dataset.view;
        if (lang[view]) {
            btn.textContent = lang[view];
        }
    });

    // 2. Update Header/H2s
    const liveTvH2 = document.querySelector('#live-tv-view h2');
    if (liveTvH2) liveTvH2.textContent = lang['channels'];
    const recordingsH2 = document.querySelector('#recordings-view h2');
    if (recordingsH2) recordingsH2.textContent = lang['your-recordings'];
    const capturesH2 = document.querySelector('#captures-view h2');
    if (capturesH2) capturesH2.textContent = lang['your-captures'];
    const settingsH2 = document.querySelector('#settings-view h2');
    if (settingsH2) settingsH2.textContent = lang['settings-h2'];
    
    // 3. Update Settings Labels/H3s
    const appearanceH3 = settingsView.querySelector('.settings-section h3');
    if (appearanceH3) appearanceH3.textContent = lang['appearance']; // Appearance H3
    
    const btnCustomH3 = settingsView.querySelector('.settings-section:nth-child(2) h3');
    if (btnCustomH3) btnCustomH3.textContent = lang['btn-custom']; // Button Customization H3
    
    const tvQualityH3 = settingsView.querySelector('.settings-section:nth-child(3) h3');
    if (tvQualityH3) tvQualityH3.textContent = lang['tv-quality-recording']; // Quality H3
    
    // Find labels by innerHTML text (less robust, but necessary without IDs)
    const labelLang = document.querySelector('label[for="language-select"]');
    if (labelLang) labelLang.textContent = lang['select-language'];
    
    const labelScale = document.querySelector('label[for="gui-scale-select"]');
    if (labelScale) labelScale.textContent = lang['gui-scale'];
    
    const labelTheme = document.querySelector('label[for="theme-select"]');
    if (labelTheme) labelTheme.textContent = lang['select-theme'];
    
    if (applyThemeButton) applyThemeButton.textContent = lang['apply-theme'];
    
    const labelFont = document.querySelector('label[for="font-select"]');
    if (labelFont) labelFont.textContent = lang['select-font'];
    
    const labelColor = document.querySelector('label[for="button-color-display"]');
    if (labelColor) labelColor.textContent = lang['primary-color'];
    
    if (openColorPickerButton) openColorPickerButton.textContent = lang['choose-color'];
    
    const labelFrames = document.querySelector('label[for="live-tv-frames"]');
    if (labelFrames) labelFrames.textContent = lang['tv-frames'];
    
    const labelQuality = document.querySelector('label[for="live-tv-quality"]');
    if (labelQuality) labelQuality.textContent = lang['tv-quality'];
    
    const labelConversion = document.querySelector('label[for="recording-conversion"]');
    if (labelConversion) labelConversion.textContent = lang['recording-conversion'];
}

/**
 * Applies the GUI scale factor.
 * @param {string} scale 'small', 'medium', or 'large'
 */
function applyGuiScale(scale) {
    GUI_SCALE = scale;
    let factor = 1.0;
    
    switch (scale) {
        case 'small':
            factor = 0.8;
            break;
        case 'large':
            factor = 1.2;
            break;
        case 'medium':
        default:
            factor = 1.0;
            break;
    }
    
    document.documentElement.style.setProperty('--scale-factor', factor);
    if (guiScaleSelect) guiScaleSelect.value = scale;
}


// --- Custom Color Picker Modal ---

function showColorPickerModal() {
    colorPickerModal.classList.remove('hidden');
    
    // Set the HTML input to the current button color
    htmlColorInput.value = BUTTON_COLOR;
    
    // Clear any previous selection class and re-select the matching swatch if available
    let focusedSwatch = null;
    colorSwatchesContainer.querySelectorAll('.color-swatch').forEach(swatch => {
        swatch.classList.remove('selected');
        if (swatch.dataset.color.toLowerCase() === BUTTON_COLOR.toLowerCase()) {
            swatch.classList.add('selected');
            focusedSwatch = swatch;
        }
    });

    // Focus on the close button or the first swatch
    setTimeout(() => {
        if (focusedSwatch) {
            focusedSwatch.focus();
        } else {
            colorPickerCloseButton.focus();
        }
    }, 0);
}

function hideColorPickerModal() {
    colorPickerModal.classList.add('hidden');
}

// Handle swatch clicks
colorSwatchesContainer.addEventListener('click', (e) => {
    const target = e.target;
    if (target.classList.contains('color-swatch')) {
        const newColor = target.dataset.color;
        htmlColorInput.value = newColor;
        
        // Update selection and focus
        colorSwatchesContainer.querySelectorAll('.color-swatch').forEach(swatch => swatch.classList.remove('selected'));
        target.classList.add('selected');
        target.focus();
    }
});

// Handle applying color
applyColorButton.addEventListener('click', () => {
    const newColor = htmlColorInput.value;
    
    // 1. Apply immediately for preview
    applyButtonColor(newColor);
    
    // 2. Save settings
    const currentSettings = loadSettings();
    saveSettings({ ...currentSettings, buttonColor: newColor });
    
    showNotification(`Primary button color set to ${newColor}.`);
    hideColorPickerModal();
});

colorPickerCloseButton.addEventListener('click', hideColorPickerModal);


// --- Audio Utility ---

function initializeAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

async function loadSound(url) {
    initializeAudio();
    try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        // Use the buffer name corresponding to the new sound
        recordingSuccessBuffer = await audioContext.decodeAudioData(arrayBuffer); 
    } catch (e) {
        console.error("Error loading audio:", e);
    }
}

function playRecordingSuccessSound() {
    if (recordingSuccessBuffer && audioContext) {
        const source = audioContext.createBufferSource();
        source.buffer = recordingSuccessBuffer;
        source.connect(audioContext.destination);
        source.start(0);
    } else {
        console.warn("Recording success sound not loaded or audio context not initialized.");
    }
}

// Load the sound asset when the app starts
loadSound('./recording_tada.mp3'); // Changed asset name

// --- Notification Popup Implementation ---

function showNotification(message, duration = 3000) {
    // 1. Setup message
    notificationMessage.textContent = message;
    
    // 2. Play sound
    playRecordingSuccessSound();

    // 3. Apply visibility and animation class
    // Ensure hidden class is removed before adding visible for animation reset
    notificationPopup.classList.remove('hidden', 'notification-hiding', 'notification-hidden');
    // Force reflow
    void notificationPopup.offsetWidth; 
    notificationPopup.classList.add('notification-visible');
    
    // 4. Set timeout to hide it
    setTimeout(() => {
        notificationPopup.classList.remove('notification-visible');
        notificationPopup.classList.add('notification-hiding');
        
        // 5. Hide completely after animation finishes
        setTimeout(() => {
            notificationPopup.classList.add('notification-hidden');
        }, 400); // Match CSS animation duration
        
    }, duration);
}


// --- Custom Alert Implementation ---

/**
 * Shows a custom alert modal with dynamic message and buttons.
 * @param {string} message The message to display.
 * @param {Array<Object>} buttons Array of button objects: [{ text: 'Button Text', value: resultValue, isDefault: true, callback: Function }]
 */
function showCustomAlert(message, buttons) {
    customAlertMessage.textContent = message;
    customAlertButtons.innerHTML = '';
    activeAlertButtons = [];

    // Ensure the modal is ready for transition
    customAlertModal.classList.remove('hidden'); 
    
    // Set a flag to block other keyboard inputs while alert is active
    customAlertModal.dataset.isActive = 'true';

    // Wait a frame for the display: block to apply before setting opacity/transform for animation
    setTimeout(() => {
        // Force reflow before applying styles for animation start point if needed, 
        // but removing 'hidden' usually suffices for transition: opacity.
    }, 0);


    return new Promise(resolve => {
        customAlertCallback = resolve;
        
        buttons.forEach((btn, index) => {
            const buttonElement = document.createElement('button');
            buttonElement.textContent = btn.text;
            buttonElement.classList.add('focusable'); // Make buttons focusable, though we use a custom 'focused' class
            buttonElement.tabIndex = 0;
            
            buttonElement.addEventListener('click', () => {
                // FIX: Resolve the promise/execute the callback BEFORE hiding the alert,
                // as hideCustomAlert clears the customAlertCallback variable.
                let result = btn.value;
                if (btn.callback) {
                    btn.callback(result);
                } else if (customAlertCallback) {
                    customAlertCallback(result);
                }
                
                hideCustomAlert();
            });
            
            customAlertButtons.appendChild(buttonElement);
            activeAlertButtons.push(buttonElement);

            // Set default focus (either specified or the first button)
            if (btn.isDefault || index === 0) {
                buttonElement.classList.add('focused');
            }
        });
        
        // No need to remove 'hidden' again, it was done before the promise starts
        // customAlertModal.classList.remove('hidden');

        // Set focus to the default button
        const defaultButton = customAlertButtons.querySelector('.focused');
        if (defaultButton) {
            // We don't use the native focus() here, as it triggers the browser outline. 
            // We use the 'focused' class for visual indication and handle keyboard input manually.
            // However, we need to ensure tab stops still work if needed.
            // For forced keyboard navigation, ensure the focused class is set on the element we consider "active"
        }
    });
}

function hideCustomAlert() {
    // Start animation fade out
    customAlertModal.classList.add('hidden');
    customAlertModal.dataset.isActive = 'false';
    
    // Wait for animation to finish before setting display: none
    setTimeout(() => {
        customAlertModal.style.display = 'none'; // Ensure display: none for true hiding
        
        activeAlertButtons = [];
        customAlertCallback = null;
        
        // Restore focus to the element that was focused before the alert, or to the player.
        setTimeout(() => {
            if (!videoContainer.classList.contains('hidden')) {
                showPlayerUI();
                // Restore focus to a UI element, e.g., the last focused button
                const lastFocusedButton = document.querySelector('#player-ui .focusable:focus');
                if (!lastFocusedButton) {
                    // If exiting from fullscreen, focus returns to the stop button if in player mode
                    // Focus the first available control if in player mode
                    const controls = getFocusableElementsInContainer(playerUI);
                    if (controls.length > 0) controls[0].focus(); 
                }
            } else {
                 // Restore focus to the main view's active element
                 const activeNavButton = document.querySelector(`#main-nav button[data-view="${currentView}"]`);
                 if (activeNavButton) {
                    activeNavButton.focus();
                 }
            }
        }, 0);
    }, 300); // Wait for the opacity transition time
}


function navigateCustomAlert(direction) {
    if (activeAlertButtons.length <= 1) return;

    let currentIndex = activeAlertButtons.findIndex(btn => btn.classList.contains('focused'));
    
    // If nothing focused, focus the first one
    if (currentIndex === -1) {
        activeAlertButtons[0].classList.add('focused');
        return;
    }
    
    activeAlertButtons[currentIndex].classList.remove('focused');
    
    let nextIndex;
    if (direction === 'right') {
        nextIndex = (currentIndex + 1) % activeAlertButtons.length;
    } else { // left
        nextIndex = (currentIndex - 1 + activeAlertButtons.length) % activeAlertButtons.length;
    }
    
    activeAlertButtons[nextIndex].classList.add('focused');
}

// --- End Custom Alert Implementation ---

// --- P2P Transfer Implementation ---

function showTransferModal() {
    // Ensure P2P modal is visible
    p2pTransferModal.classList.remove('hidden');
    
    // Reset state
    transferShareUI.classList.add('hidden');
    transferReceiveUI.classList.add('hidden');
    transferCodeDisplay.classList.add('hidden');
    transferStatusCodeShare.textContent = '';
    transferStatusCodeReceive.textContent = '';
    transferCodeInput.value = '';
    sharingCodeSpan.textContent = '';
    
    // Populate select options
    populateTransferContentSelect();
    
    // Default to Share Mode view
    transferShareModeButton.click();
    
    // Set focus to the close button
    setTimeout(() => p2pCloseButton.focus(), 0);
}

function hideTransferModal() {
    p2pTransferModal.classList.add('hidden');
    if (transferInterval) {
        clearInterval(transferInterval);
        transferInterval = null;
    }
}

function populateTransferContentSelect() {
    transferContentSelect.innerHTML = '';
    
    if (recordings.length === 0 && captures.length === 0) {
        transferContentSelect.innerHTML = '<option value="">No sharable content available</option>';
        transferGenerateCodeButton.disabled = true;
        return;
    }
    transferGenerateCodeButton.disabled = false;

    const optgroupRec = document.createElement('optgroup');
    optgroupRec.label = 'Recordings';
    recordings.forEach((r, index) => {
        const option = document.createElement('option');
        option.value = `rec_${index}`;
        option.textContent = `${r.name} (Rec)`;
        optgroupRec.appendChild(option);
    });
    transferContentSelect.appendChild(optgroupRec);

    const optgroupCap = document.createElement('optgroup');
    optgroupCap.label = 'Captures';
    captures.forEach((c, index) => {
        const option = document.createElement('option');
        option.value = `cap_${index}`;
        option.textContent = `${c.name} (Cap)`;
        optgroupCap.appendChild(option);
    });
    transferContentSelect.appendChild(optgroupCap);
}

function generateShareCode() {
    // Generate a 6-character alphanumeric code
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

async function initiateTransfer() {
    const selectedValue = transferContentSelect.value;
    if (!selectedValue) {
        transferStatusCodeShare.textContent = "Please select content to share.";
        return;
    }
    
    const [type, indexStr] = selectedValue.split('_');
    const index = parseInt(indexStr);
    
    const item = type === 'rec' ? recordings[index] : captures[index];
    if (!item) {
        transferStatusCodeShare.textContent = "Error: Content not found.";
        return;
    }

    transferStatusCodeShare.textContent = 'Generating code...';
    
    const shareCode = generateShareCode();
    
    // 1. Create a transfer object containing the URL and metadata
    const transferData = {
        code: shareCode,
        type: type === 'rec' ? 'Recording' : 'Capture',
        name: item.name,
        url: item.url,
        size: item.size
    };
    
    // 2. Simulate storing the transfer data on a central 'websim' service using the code as key
    try {
        // We use localStorage as a simulated central server for P2P coordination
        localStorage.setItem(`p2p_transfer_${shareCode}`, JSON.stringify(transferData));
        
        sharingCodeSpan.textContent = shareCode;
        transferCodeDisplay.classList.remove('hidden');
        transferStatusCodeShare.textContent = `Sharing "${item.name}". Code generated. Ready to receive connection.`;

        // 3. Start polling simulation (In a real WebRTC scenario, this would be a socket listener)
        startPollingForReceipt(shareCode);
        
    } catch (e) {
        transferStatusCodeShare.textContent = 'Error initiating transfer.';
        console.error("P2P Simulation error:", e);
    }
}

function startPollingForReceipt(code) {
    if (transferInterval) clearInterval(transferInterval);

    // In a real P2P system, the receiver signals when they connect/download.
    // Here we just keep the code active for 5 minutes and assume success on receive attempt.
    
    let timeRemaining = 300; // 5 minutes
    
    transferInterval = setInterval(() => {
        timeRemaining--;
        transferStatusCodeShare.textContent = `Code: ${code}. Sharing active. Expires in ${timeRemaining}s.`;

        if (timeRemaining <= 0) {
            clearInterval(transferInterval);
            transferStatusCodeShare.textContent = `Sharing expired for code ${code}.`;
            // Clean up simulated central storage
            localStorage.removeItem(`p2p_transfer_${code}`);
        }
    }, 1000);
}

async function receiveTransfer() {
    const code = transferCodeInput.value.trim().toUpperCase();
    if (code.length !== 6) {
        transferStatusCodeReceive.textContent = "Please enter a valid 6-character code.";
        return;
    }

    transferStatusCodeReceive.textContent = `Attempting to receive content for code ${code}...`;

    try {
        const storedData = localStorage.getItem(`p2p_transfer_${code}`);
        
        if (!storedData) {
            transferStatusCodeReceive.textContent = `Transfer code ${code} not found or expired.`;
            return;
        }

        const transferData = JSON.parse(storedData);
        
        // 1. Simulate download by providing the URL
        const downloadUrl = transferData.url;
        const filename = `${transferData.name.replace(/\s/g, '_')}_received.${transferData.type === 'Recording' ? 'mp4' : 'png'}`;
        
        // 2. Since the data is already uploaded (shared), we just download it locally.
        const confirmation = await showCustomAlert(`Received: ${transferData.name} (${formatBytes(transferData.size)}). Download now?`, [
            { text: 'Later', value: false },
            { text: 'Download', value: true, isDefault: true }
        ]);

        if (confirmation) {
            downloadMedia(downloadUrl, filename);
        }
        
        // 3. Save the received item into the local storage (for Recordings/Captures lists)
        const receivedItem = {
            id: Date.now(), // Use timestamp for unique ID
            name: `${transferData.name} (Received)`,
            channel: 'P2P Transfer',
            url: downloadUrl,
            date: new Date().toISOString().slice(0, 19).replace('T', ' '),
            size: transferData.size
        };

        if (transferData.type === 'Recording') {
            recordings.push(receivedItem);
            saveRecordings();
        } else {
            captures.push(receivedItem);
            saveCaptures();
        }

        transferStatusCodeReceive.textContent = `Successfully received and saved "${receivedItem.name}"!`;
        
        // 4. Clean up the shared code immediately upon successful receive
        localStorage.removeItem(`p2p_transfer_${code}`);
        
        // Also clear any active sharing interval if this device was sharing that code (unlikely, but safe)
        if (transferInterval) clearInterval(transferInterval);
        
    } catch (e) {
        transferStatusCodeReceive.textContent = `Error during reception: ${e.message}`;
        console.error("P2P Receive error:", e);
    }
}

// --- End P2P Transfer Implementation ---

// --- List Rendering Functions ---

function renderRecordingsList() {
    recordingsList.innerHTML = '';
    if (recordings.length === 0) {
        noRecordingsMessage.style.display = 'block';
    } else {
        noRecordingsMessage.style.display = 'none';
        recordings.forEach((recording, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${recording.name} (${formatBytes(recording.size)})</span>
                <div class="recording-actions">
                    <button class="play-button focusable" data-index="${index}">Play</button>
                    <button class="download-button focusable" data-url="${recording.url}" data-filename="${recording.name.replace(/\s/g, '_')}.mp4">Download</button>
                    <button class="delete-button focusable" data-index="${index}">Delete</button>
                </div>
            `;
            recordingsList.appendChild(li);
        });
    }
}

function renderCapturesList() {
    capturesList.innerHTML = '';
    if (captures.length === 0) {
        noCapturesMessage.style.display = 'block';
    } else {
        noCapturesMessage.style.display = 'none';
        captures.forEach((capture, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${capture.name} (${formatBytes(capture.size)})</span>
                <div class="capture-actions">
                    <button class="view-button focusable" data-index="${index}">View</button>
                    <button class="download-button focusable" data-url="${capture.url}" data-filename="${capture.name.replace(/\s/g, '_')}.png">Download</button>
                    <button class="delete-button focusable" data-index="${index}">Delete</button>
                </div>
            `;
            capturesList.appendChild(li);
        });
    }
}


// --- UI Management ---

function switchView(viewName) {
    currentView = viewName;
    liveTvView.classList.add('hidden');
    recordingsView.classList.add('hidden');
    capturesView.classList.add('hidden'); 
    guideView.classList.add('hidden');
    settingsView.classList.add('hidden'); // New settings view
    
    // Hide guide overlay if switching to a main menu view
    guideOverlay.classList.add('hidden'); 
    
    // Only show views inside main-content if we are actually in main-content mode
    if (!videoContainer.classList.contains('hidden')) {
        // If we switch view while in fullscreen, it typically means we're closing the guide and returning to the player.
        // We only show views if we are *out* of the player.
        return; 
    }
    
    document.getElementById(`${viewName}-view`).classList.remove('hidden');

    navButtons.forEach(btn => {
        btn.classList.remove('active');
        // Note: Guide button is now in player UI, so only check main nav items
        if (btn.dataset.view === viewName) {
            btn.classList.add('active');
        }
    });

    // Reset focus to the first element in the new view for accessibility
    setTimeout(() => {
        const firstFocusable = document.querySelector(`#${viewName}-view .focusable, #${viewName}-view .channel-button, #${viewName}-view .nav-button, #${viewName}-view .play-button, #${viewName}-view .guide-channel-entry`);
        if (firstFocusable) {
            firstFocusable.focus();
        }
    }, 0);


    if (viewName === 'recordings') {
        renderRecordingsList();
    } else if (viewName === 'captures') {
        renderCapturesList();
    } else if (viewName === 'settings') {
        // Ensure language dropdown is populated/updated when entering settings
        populateLanguageSelect();
    }
    // If 'guide' is accessed via main nav, it uses the placeholder, which doesn't need re-rendering.
}

// Function to populate the language selector with flags
function populateLanguageSelect() {
    if (!languageSelect) return;
    
    languageSelect.innerHTML = ''; // Clear existing options

    const languages = [
        { code: 'en', name: 'English (Default)' },
        { code: 'hu', name: 'Hungarian' },
        { code: 'pl', name: 'Polish' },
        { code: 'ru', name: 'Russian' },
    ];
    
    languages.forEach(lang => {
        const option = document.createElement('option');
        option.value = lang.code;
        // Use an inner span for the flag icon and text, although <option> doesn't render HTML content well.
        // For consistent flag display, we usually rely on CSS background images or a custom select implementation.
        // For standard HTML select, we'll just prepend the flag URL to the text, assuming a custom component would render it.
        // Since we cannot use custom select component easily, we rely on a hacky visual for the icon.
        
        // Option innerHTML is unreliable for complex formatting across browsers. 
        // We will stick to text content for <select> options for compatibility, and use the language code in the value.
        option.textContent = `${lang.name}`; 
        
        // Add a dataset for the flag URL, which is useful if we were to switch to a custom dropdown
        option.dataset.flagUrl = FLAG_URLS[lang.code];
        
        languageSelect.appendChild(option);
    });

    // Set the selected value based on current settings
    if (languageSelect.value !== CURRENT_LANGUAGE) {
        languageSelect.value = CURRENT_LANGUAGE;
    }
}

// --- Guide Rendering ---

function minutesToPixels(minutes) {
    // 5 pixels per minute (300 pixels per hour) - used to calculate program block width
    return minutes * 5;
}

function timeToLeftOffset(timeInMinutes) {
    // Guide starts at 6:00 (360 minutes from midnight). Offset starts from 6:00.
    return minutesToPixels(timeInMinutes - GUIDE_START_MINUTES);
}

function getMinutesSinceMidnight(date) {
    return date.getHours() * 60 + date.getMinutes();
}

function minutesToHHMM(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const paddedHours = String(hours).padStart(2, '0');
    const paddedMinutes = String(minutes).padStart(2, '0');
    return `${paddedHours}:${paddedMinutes}`;
}

// Utility function to format seconds into HH:MM:SS
function formatSecondsToHHMMSS(totalSeconds) {
    totalSeconds = Math.max(0, totalSeconds);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    
    const paddedHours = String(hours).padStart(2, '0');
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(seconds).padStart(2, '0');
    
    return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
}

// --- Seek Overlay Functions ---

/**
 * Updates the visual state of the seek progress bar and time displays.
 */
function updateProgressBar() {
    // 1. Calculate the total available range (for demonstration, assume 1 hour DVR)
    const totalDuration = MAX_DVR_WINDOW_SECONDS; // 3600 seconds (1 hour)

    // In a real HLS environment, tvPlayer.duration might be Infinity or the buffer duration.
    // For this demonstration, we simulate the 'live edge' being at the maximum duration
    // of our simulated DVR window, and the current time being a position within that window.

    const currentTime = tvPlayer.currentTime;
    
    // Calculate current time position percentage
    // Assuming 0 is the oldest possible time and MAX_DVR_WINDOW_SECONDS is the live edge.
    const timePercentage = Math.min(100, (currentTime / totalDuration) * 100);

    // Update time displays
    seekCurrentTime.textContent = formatSecondsToHHMMSS(currentTime);
    // Since this is a simulated DVR bar, we show the live time relative to the current position
    seekLiveTime.textContent = formatSecondsToHHMMSS(totalDuration); // Max time of the simulated DVR

    // Update seek thumb position
    progressSeekThumb.style.left = `${timePercentage}%`;
    
    // Update buffered progress (optional, but good practice)
    if (tvPlayer.buffered.length > 0) {
        const bufferedEnd = tvPlayer.buffered.end(tvPlayer.buffered.length - 1);
        const bufferedPercentage = Math.min(100, (bufferedEnd / totalDuration) * 100);
        progressBuffer.style.width = `${bufferedPercentage}%`;
    } else {
        progressBuffer.style.width = '100%'; // Assume fully buffered if seeking works
    }
}

/**
 * Shows the seek overlay and sets the indicator/time.
 * @param {string} direction 'forward' or 'backward'
 */
function showSeekOverlay(direction) {
    if (guideOverlay && !guideOverlay.classList.contains('hidden')) {
        // Do not show seek overlay if guide is open
        return;
    }
    
    isSeeking = true;
    
    // Hide standard player UI temporarily, keep seek UI visible
    clearTimeout(uiTimeout); 
    playerUI.classList.add('hidden');
    
    // Show overlay
    seekOverlay.classList.remove('hidden');

    // Update indicator
    seekIndicator.textContent = direction === 'forward' ? '≫' : '≪';
    
    // Update time and progress bar immediately
    updateProgressBar();
    seekTimeDisplay.textContent = formatSecondsToHHMMSS(tvPlayer.currentTime);

    // Clear previous timeout and set a new one to hide the seek overlay
    clearTimeout(seekOverlayTimeout);
    seekOverlayTimeout = setTimeout(() => {
        hideSeekOverlay();
    }, 3000); // Hide after 3 seconds of inactivity
}

/**
 * Hides the seek overlay and restores the player UI.
 */
function hideSeekOverlay() {
    clearTimeout(seekOverlayTimeout);
    seekOverlay.classList.add('hidden');
    isSeeking = false;
    
    // Restore main UI visibility timer
    showPlayerUI();
}

// --- Real Time Clock Implementation ---

function startClockUpdate() {
    // Clear any existing interval
    stopClockUpdate();
    
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        if (guideRealTimeClock) {
            guideRealTimeClock.textContent = `${hours}:${minutes}:${seconds}`;
        }
    }
    
    updateClock(); // Initial call
    clockUpdateInterval = setInterval(updateClock, 1000); // Update every second
}

function stopClockUpdate() {
    if (clockUpdateInterval) {
        clearInterval(clockUpdateInterval);
        clockUpdateInterval = null;
    }
}


/**
 * Calculates the current time's position on the guide timeline and updates the indicator line,
 * updating every 500ms for smooth, continuous movement.
 */
function updateGuideTimeIndicator() {
    const now = new Date();
    const totalMinutesSinceMidnight = getMinutesSinceMidnight(now);
    
    // GUIDE_START_MINUTES and GUIDE_END_MINUTES are now global constants
    
    const indicatorLine = document.getElementById('guide-time-indicator');
    
    if (!indicatorLine) return;

    if (totalMinutesSinceMidnight < GUIDE_START_MINUTES || totalMinutesSinceMidnight > GUIDE_END_MINUTES) {
        indicatorLine.style.display = 'none';
        clearTimeout(indicatorLine.updateTimeout);
        return;
    }
    
    indicatorLine.style.display = 'block';
    
    // Calculate total minutes including fractional seconds
    const minutesFraction = (now.getSeconds() * 1000 + now.getMilliseconds()) / 60000;
    const currentGuideTimeInMinutes = totalMinutesSinceMidnight + minutesFraction;
    
    // Calculate offset based on current time (including fractions)
    const offset = timeToLeftOffset(currentGuideTimeInMinutes);

    // Set position based on offset. Subtract 1px to center the 2px line.
    indicatorLine.style.left = `${offset - 1}px`;
    
    // Schedule next update in 500ms
    const msToNextUpdate = 500;
    
    clearTimeout(indicatorLine.updateTimeout);
    indicatorLine.updateTimeout = setTimeout(() => {
        // Ensure guide is still open before continuing the loop
        if (!guideOverlay.classList.contains('hidden')) {
            updateGuideTimeIndicator();
        }
    }, msToNextUpdate);
}


function renderGuide() {
    // Only render the guide if the containers are available (i.e., within the player overlay)
    if (!guideChannelsContainer || !guideTimelineContainer) return;
    
    // Clear the timeline container first, including any previous header/rows
    guideTimelineContainer.innerHTML = '';
    guideChannelsContainer.innerHTML = '';

    // Create a new container to hold both header and content, allowing guideTimelineContainer to be the vertical scroll parent
    
    // 1. Create Time Header Wrapper (The sync target)
    const timeHeaderScroller = document.createElement('div');
    timeHeaderScroller.classList.add('time-header-scroller');
    timeHeaderScroller.id = 'guide-header-scroller';

    const timeHeader = document.createElement('div');
    timeHeader.classList.add('time-header');
    
    // Constants GUIDE_START_MINUTES and GUIDE_END_MINUTES are now global
    
    // Time slots every 30 minutes
    for (let m = GUIDE_START_MINUTES; m <= GUIDE_END_MINUTES; m += 30) {
        const timeSlot = document.createElement('div');
        timeSlot.classList.add('time-slot');
        timeSlot.textContent = minutesToHHMM(m);
        timeHeader.appendChild(timeSlot);
    }
    
    timeHeaderScroller.appendChild(timeHeader); // Append header inside its dedicated scroller wrapper

    // 2. Create Guide Content Area (Horizontal and Vertical Scroll)
    const guideContent = document.createElement('div');
    guideContent.classList.add('guide-content');
    guideContent.id = 'guide-content-scroller'; // Assign ID here for horizontal scrolling access
    
    // Append Time Header Scroller *first* to the timeline container, so it sticks to the top of the vertical scroll area
    guideTimelineContainer.appendChild(timeHeaderScroller);
    
    // Now append the main content wrapper (which handles the rows and programs)
    guideTimelineContainer.appendChild(guideContent);

    
    // Create the time indicator line and append it to the content wrapper
    const indicatorLine = document.createElement('div');
    indicatorLine.id = 'guide-time-indicator';
    indicatorLine.classList.add('time-indicator-line');
    
    guideContent.appendChild(indicatorLine); // Add indicator line to the scrolling content

    // 2a. Render Vertical Grid Lines (every 30 minutes)
    for (let m = GUIDE_START_MINUTES; m <= GUIDE_END_MINUTES; m += 30) {
        const offset = timeToLeftOffset(m);
        
        const gridLine = document.createElement('div');
        gridLine.classList.add('guide-vertical-grid-line');
        // Position the line at the start of the 30-minute block 
        gridLine.style.left = `${offset}px`; 
        guideContent.appendChild(gridLine);
    }
    
    // 2b. Render Channels and Programs
    channelIds.forEach(id => {
        const channel = channelMap[id];
        
        // Sidebar Entry
        const channelEntry = document.createElement('div');
        channelEntry.classList.add('guide-channel-entry', 'focusable');
        channelEntry.dataset.channelId = id;
        channelEntry.textContent = `${id}. ${channel.name}`;
        channelEntry.tabIndex = 0; // Make focusable
        guideChannelsContainer.appendChild(channelEntry);
        
        // Timeline Row
        const timelineRow = document.createElement('div');
        timelineRow.classList.add('guide-timeline-row');
        timelineRow.dataset.channelId = id;
        
        const programs = STATIC_GUIDE_DATA[id] || [];

        programs.forEach(program => {
            const startMinutes = program.start;
            const durationMinutes = program.duration;
            
            // Program Block
            const programElement = document.createElement('button');
            programElement.classList.add('guide-program', 'focusable');
            programElement.tabIndex = 0;
            programElement.dataset.channelId = id;
            programElement.dataset.programName = program.name;
            
            // Position and size the program element accurately
            programElement.style.width = `${minutesToPixels(durationMinutes) - 5}px`; // Subtract margin
            programElement.style.left = `${timeToLeftOffset(startMinutes)}px`; // Absolute position based on start time
            
            programElement.innerHTML = `<span class="guide-program-time">${minutesToHHMM(startMinutes)}</span><span class="guide-program-name">${program.name}</span>`;
            
            // Set up click listener to switch to this channel
            programElement.addEventListener('click', () => {
                // When clicking a program, switch channel and close guide overlay
                handleChannelSwitch(id);
                hideGuideOverlay();
            });

            timelineRow.appendChild(programElement);
        });

        guideContent.appendChild(timelineRow);
    });

    // Assemble the guide timeline structure: Header Scroller + Content Scroller
    // The previous wrapper logic is now replaced by directly appending to guideTimelineContainer
    // guideTimelineContainer is now the vertical scrolling area for the whole guide content area. 
    // Wait, let's revert guideTimelineContainer back to the wrapper and let guideContent be the vertical scroller.
    // However, if we make timeHeaderScroller sticky (as in CSS), we don't need to change the structure much.
    
    // We need to synchronize the horizontal scroll:
    const contentScroller = document.getElementById('guide-content-scroller');
    const headerScroller = document.getElementById('guide-header-scroller');
    
    if (contentScroller && headerScroller) {
        // Synchronize horizontal scroll of the time header based on content scroll
        contentScroller.addEventListener('scroll', () => {
            // Note: guide-content-scroller is handling horizontal scroll, 
            // but we need to ensure timeHeaderScroller also scrolls horizontally 
            // if we are using contentScroller for both vertical and horizontal.
            // Since time-header-scroller is sticky, it stays at the top. 
            // We need guideTimelineContainer to be the horizontal scrolling element if we want timeHeaderScroller to scroll.
            
            // Current structure: guide-timeline is the parent, guide-content is the horizontal/vertical scroller, time-header-scroller is sticky inside guide-timeline.
            
            // Let's modify: Make guideTimelineContainer the vertical container (overflow-y: hidden, overflow-x: scroll)
            // NO, guide-content already has overflow-x and overflow-y.
            
            // The timeHeaderScroller is sticky inside guideContent. 
            // The guideContent element holds the rows.
            
            // The correct synchronisation is needed for horizontal scroll.
            // Since timeHeaderScroller is outside guideContent, we need to manually sync them.
            headerScroller.scrollLeft = contentScroller.scrollLeft;
        });
        
        // Make sure horizontal scroll of header is handled by guide-content-scroller
    }

    
    // Find initial scroll position to center on current time (NEW SCROLL LOGIC)
    const now = new Date();
    const totalMinutesSinceMidnight = getMinutesSinceMidnight(now);
    
    // Calculate offset based on current time
    const initialOffset = timeToLeftOffset(totalMinutesSinceMidnight);
    
    // Wait for elements to be painted before setting scrollLeft
    // Using a small delay to ensure rendering happens
    setTimeout(() => {
        if (contentScroller && headerScroller) {
            const timelineWidth = contentScroller.clientWidth;
            // Place indicator 30% from the left edge for context
            const centerOffset = timelineWidth * 0.3; 
            
            let targetScrollLeft = initialOffset - centerOffset;
            
            // Clamp scroll position
            targetScrollLeft = Math.max(0, targetScrollLeft);
            targetScrollLeft = Math.min(targetScrollLeft, contentScroller.scrollWidth - contentScroller.clientWidth);
            
            contentScroller.scrollLeft = targetScrollLeft;
            // Synchronize header immediately after setting content scroll
            headerScroller.scrollLeft = targetScrollLeft; 
        }
    }, 50);

    
    // Add event listener for channel entry click
    guideChannelsContainer.querySelectorAll('.guide-channel-entry').forEach(entry => {
        entry.addEventListener('click', (e) => {
            // Allow clicking guide entry to also switch to channel and close guide overlay
            const channelId = e.currentTarget.dataset.channelId; // Use currentTarget for robustness
            handleChannelSwitch(channelId);
            hideGuideOverlay();
        });
    });
    
    // Ensure back button is focusable and functional
    guideBackButton.tabIndex = 0;
    guideBackButton.addEventListener('click', hideGuideOverlay);
}


function setupRecordingListeners() {
    recordingsList.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('play-button')) {
            const index = parseInt(target.dataset.index);
            const recording = recordings[index];
            enterFullscreenPlayer(recording.url, recording.name, true, 'video'); // Playing video
        } else if (target.classList.contains('delete-button')) {
            const index = parseInt(target.dataset.index);
            
            showCustomAlert(`Are you sure you want to delete ${recordings[index].name}?`, [
                { text: 'Cancel', value: false },
                { text: 'Delete', value: true, isDefault: true }
            ]).then(result => {
                if (result) {
                    recordings.splice(index, 1);
                    saveRecordings();
                }
            });
            
        } else if (target.classList.contains('download-button')) {
            const url = target.dataset.url;
            const filename = target.dataset.filename;
            downloadMedia(url, filename);
        }
    });
}

function setupCaptureListeners() {
    capturesList.addEventListener('click', async (e) => {
        const target = e.target;
        if (target.classList.contains('view-button')) {
            const index = parseInt(target.dataset.index);
            const capture = captures[index];
            enterFullscreenPlayer(capture.url, capture.name, true, 'image'); // Viewing image
        } else if (target.classList.contains('delete-button')) {
            const index = parseInt(target.dataset.index);
            
            showCustomAlert(`Are you sure you want to delete ${captures[index].name}?`, [
                { text: 'Cancel', value: false },
                { text: 'Delete', value: true, isDefault: true }
            ]).then(result => {
                if (result) {
                    captures.splice(index, 1);
                    saveCaptures();
                }
            });
            
        } else if (target.classList.contains('download-button')) {
            const url = target.dataset.url;
            const filename = target.dataset.filename;
            downloadMedia(url, filename);
        }
    });
}

function downloadMedia(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


// Function to initialize HLS player
async function loadHLSStream(url, isStatic = false) {
    // Ensure video is visible and image is hidden
    tvPlayer.style.display = 'block';
    mediaViewerImg.style.display = 'none';

    if (hlsInstance) {
        hlsInstance.destroy();
    }

    // Clear previous video source
    tvPlayer.src = ""; 
    tvPlayer.load();

    if (isStatic) {
        // For static recordings, use native playback
        tvPlayer.src = url;
        tvPlayer.load();
        
        // Wait for metadata, then attempt to play, catching the rejection
        tvPlayer.addEventListener('loadedmetadata', async function playStatic() {
            try {
                await tvPlayer.play();
                updatePlayPauseButton();
            } catch (e) {
                // This catches the 'play() was interrupted by pause()' error
                if (e.name !== "AbortError" && e.name !== "NotAllowedError") {
                    console.error("Error attempting to play static video:", e);
                }
            }
            tvPlayer.removeEventListener('loadedmetadata', playStatic);
        });
        return;
    }

    // Access global Hls object for live stream (M3U8)
    if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls();
        hlsInstance.loadSource(url);
        hlsInstance.attachMedia(tvPlayer);
        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function() {
            // Promise handling here is less critical as Hls.js manages the timing, 
            // but still safer to await/catch.
            tvPlayer.play().then(updatePlayPauseButton).catch(e => {
                if (e.name !== "AbortError" && e.name !== "NotAllowedError") {
                    console.error("Error attempting to play live HLS video:", e);
                }
            });
        });
        hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
            console.error('HLS Error:', event, data);
            if (data.fatal) {
                switch(data.type) {
                    case window.Hls.ErrorTypes.NETWORK_ERROR:
                        console.log("fatal network error, trying to recover");
                        hlsInstance.startLoad();
                        break;
                    case window.Hls.ErrorTypes.MEDIA_ERROR:
                        console.log("fatal media error, trying to recover");
                        hlsInstance.recoverMediaError();
                        break;
                    default:
                        exitFullscreenPlayer();
                        showCustomAlert("An error occurred while loading the stream.", [{ text: 'OK', value: true, isDefault: true }]);
                        break;
                }
            }
        });
    } else if (tvPlayer.canPlayType('application/vnd.apple.mpegurl')) {
        // Native support for M3U8 (Safari, iOS)
        tvPlayer.src = url;
        tvPlayer.addEventListener('loadedmetadata', function() {
            tvPlayer.play();
            updatePlayPauseButton();
        });
    } else {
        showCustomAlert('Your browser does not support HLS streaming.', [{ text: 'OK', value: true, isDefault: true }]);
        exitFullscreenPlayer();
    }
}

function viewImageCapture(url, name) {
    // Hide video, show image
    tvPlayer.style.display = 'none';
    mediaViewerImg.style.display = 'block';
    
    mediaViewerImg.src = url;

    // Static content viewer controls
    uiRecordButton.style.display = 'none';
    uiCaptureButton.style.display = 'none';
    uiPlayPauseButton.style.display = 'none'; // No play/pause for image
    uiGuideButton.style.display = 'none'; // No Guide when viewing image
    guideOverlay.classList.add('hidden'); // Ensure guide overlay is hidden
    
    // Set UI details
    uiChannelName.textContent = name;
    mainContent.classList.add('hidden');
    videoContainer.classList.remove('hidden');
    
    // Show UI initially (and allow it to be shown again on mouse activity)
    showPlayerUI();
}


// Function to enter fullscreen player mode
function enterFullscreenPlayer(url, name, isStatic = false, mediaType = 'video') {
    
    // Clear previous HLS instance if any
    if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
    }
    tvPlayer.pause();
    tvPlayer.src = ""; 
    tvPlayer.load();

    // Ensure guide overlay is hidden when starting the player
    guideOverlay.classList.add('hidden');

    if (mediaType === 'image') {
        tvPlayer.controls = false; 
        viewImageCapture(url, name);
        // Add listener for UI interaction on image viewer
        mediaViewerImg.addEventListener('mousemove', resetUITimer);
        mediaViewerImg.addEventListener('click', resetUITimer);
        return;
    }
    
    // If it's a video, remove image viewer listeners if they were attached
    mediaViewerImg.removeEventListener('mousemove', resetUITimer);
    mediaViewerImg.removeEventListener('click', resetUITimer);

    // Media type is video (live or recording)
    
    // Show video, hide image
    tvPlayer.style.display = 'block';
    mediaViewerImg.style.display = 'none';
    
    // Enable relevant controls
    uiPlayPauseButton.style.display = 'inline-block';
    tvPlayer.controls = false; 

    if (isStatic) {
        // Hide UI controls that are irrelevant for static playback (like recording/live capture)
        uiRecordButton.style.display = 'none';
        uiCaptureButton.style.display = 'none';
        uiGuideButton.style.display = 'none';
        uiCCButton.style.display = 'none'; // Hide CC for static recordings
    } else {
        // Live stream controls
        uiRecordButton.style.display = 'inline-block';
        uiCaptureButton.style.display = 'inline-block';
        uiGuideButton.style.display = 'inline-block'; // Guide available on live view
        uiCCButton.style.display = 'inline-block'; // Show CC for live view
        
        // Store current channel context if we are viewing a new live channel
        previousChannelContext = { url, name, id: currentChannelId };
    }
    
    mainContent.classList.add('hidden');
    videoContainer.classList.remove('hidden');
    
    currentChannelName = name;
    uiChannelName.textContent = name;
    
    loadHLSStream(url, isStatic);

    // Show the UI initially
    showPlayerUI();
}

// Function to exit fullscreen player mode
function exitFullscreenPlayer() {
    if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
    }
    tvPlayer.pause();
    tvPlayer.src = ""; 
    tvPlayer.load();
    mediaViewerImg.src = ""; // Clear image viewer

    // Hide the guide overlay on full exit
    guideOverlay.classList.add('hidden');
    
    // Ensure recording status overlay is hidden and stop timer if active
    if (isRecording) {
        // If recording is ongoing, stop it silently
        stopRecording(true); 
    }
    
    // Reset recording UI state
    stopRecordingTimer(); // Ensure timer stops
    recordingStatusOverlay.classList.add('hidden');
    
    // Stop clock update if it was running (e.g. if we exit player from Guide)
    stopClockUpdate(); 

    // Remove listeners from image viewer upon exit
    mediaViewerImg.removeEventListener('mousemove', resetUITimer);
    mediaViewerImg.removeEventListener('click', resetUITimer);

    videoContainer.classList.add('hidden');
    mainContent.classList.remove('hidden');
    currentChannelId = null;
    currentChannelName = '';
    hidePlayerUI(0); // Immediately hide UI
    
    // Ensure video/image elements are correctly hidden/reset
    tvPlayer.style.display = 'none';
    mediaViewerImg.style.display = 'none';
    
    // Ensure recording button state is reset if applicable
    isRecording = false;
    isRecordingPaused = false;
    uiRecordButton.classList.remove('recording-pulse', 'stop-recording');
    uiRecordButton.textContent = 'Record';
    
    // Reset focus back to the main navigation when exiting the player
    setTimeout(() => {
        const activeNavButton = document.querySelector(`#main-nav button[data-view="${currentView}"]`);
        if (activeNavButton) {
            activeNavButton.focus();
        } else {
            // Fallback to the first channel button if in live TV view
            const firstChannel = document.querySelector('.channel-button');
            if (firstChannel) {
                firstChannel.focus();
            }
        }
    }, 0);
}

// Function to transition to Guide Overlay
function showGuideOverlay() {
    if (!currentChannelId || uiGuideButton.style.display === 'none') {
        // Not on a live stream
        exitFullscreenPlayer();
        switchView('live-tv');
        return;
    }

    // Ensure guide is rendered with current channels
    renderGuide();
    
    // Start the clock update
    startClockUpdate();
    
    // Start the time indicator update
    updateGuideTimeIndicator(); // This now starts the recursive 500ms update loop

    // Hide player controls while guide is open
    hidePlayerUI(0);
    
    // Show the overlay
    guideOverlay.classList.remove('hidden');
    
    // Set focus to the back button or first channel entry
    setTimeout(() => {
        const firstGuideFocusable = document.getElementById('guide-back-button') || document.querySelector('.guide-channel-entry');
        if (firstGuideFocusable) {
            firstGuideFocusable.focus();
        }
    }, 0);
}

// Function to transition back from Guide Overlay
function hideGuideOverlay() {
    // Stop the clock update
    stopClockUpdate();
    
    // Clear the time indicator update interval/timeout
    const indicatorLine = document.getElementById('guide-time-indicator');
    if (indicatorLine) {
        clearTimeout(indicatorLine.updateTimeout);
    }
    
    guideOverlay.classList.add('hidden');
    
    // Show player UI controls again
    showPlayerUI(); 
    
    // Restore focus to the guide button or video player
    setTimeout(() => {
        // Try to focus on the guide button first if it's visible
        if (uiGuideButton.style.display !== 'none') {
            uiGuideButton.focus();
        } else {
            // Fallback to the stop button or the first control
            const controls = getFocusableElementsInContainer(playerUI);
            if (controls.length > 0) controls[0].focus();
        }
    }, 0);
}


// Function to show the UI bar and set a timeout to hide it
function showPlayerUI() {
    clearTimeout(uiTimeout);
    
    // Do not show player UI if the guide overlay or seek overlay are open
    if (!guideOverlay.classList.contains('hidden') || !seekOverlay.classList.contains('hidden')) {
        playerUI.classList.add('hidden');
        return;
    }
    
    // Always show player UI when this function is called (due to user interaction)
    playerUI.classList.remove('hidden');

    // Hide UI after 5 seconds of inactivity
    uiTimeout = setTimeout(() => hidePlayerUI(5000), 5000);
}

// Function to hide the UI bar
function hidePlayerUI(delay = 300) {
    // Check if the guide overlay is active, if so, keep UI hidden/pointer-events disabled
    if (guideOverlay && !guideOverlay.classList.contains('hidden')) {
        clearTimeout(uiTimeout);
        playerUI.classList.add('hidden');
        return; 
    }
    
    // We use a small delay to allow transition effect
    uiTimeout = setTimeout(() => {
        playerUI.classList.add('hidden');
    }, delay);
}

// Function to handle Channel Switching
function handleChannelSwitch(channelId) {
    const channel = channelMap[channelId];
    if (channel) {
        // If currently recording, stop it before switching channels
        if (isRecording) {
            // Ask for confirmation before stopping a recording
            showCustomAlert(`Stop recording ${currentChannelName} and save before switching channels?`, [
                { text: 'Cancel', value: false },
                { text: 'Stop & Switch', value: true, isDefault: true }
            ]).then(result => {
                if (result) {
                    // Stop recording (sends to processRecordedData), then switch
                    stopRecording(false); 
                    // Delayed switch to allow processing
                    setTimeout(() => {
                        currentChannelId = channelId;
                        enterFullscreenPlayer(channel.url, channel.name, false, 'video');
                        // Ensure focus returns to the player controls after switch
                        setTimeout(() => {
                            const controls = getFocusableElementsInContainer(playerUI);
                            if (controls.length > 0) controls[0].focus();
                        }, 500);
                    }, 500); 
                } else {
                    // If canceled, restore focus and remain on current channel
                    setTimeout(() => {
                       if (uiRecordButton.style.display !== 'none') uiRecordButton.focus();
                    }, 0);
                }
            });
            return; // Block switch until alert is resolved
        }
        currentChannelId = channelId;
        enterFullscreenPlayer(channel.url, channel.name, false, 'video'); // Not static, it's live TV
    } else {
        console.warn(`Channel ${channelId} not found.`);
        // Optional: show error message
    }
}

// Function to display the number typed
function displayNumberInput(number) {
    clearTimeout(channelNumberDisplay.timeout);
    channelNumberDisplay.textContent = number;
    channelNumberDisplay.classList.remove('hidden');

    channelNumberDisplay.timeout = setTimeout(() => {
        channelNumberDisplay.classList.add('hidden');
    }, 1000); // Display number for 1 second
}

// --- Player Control Functions ---

function togglePlayPause() {
    if (tvPlayer.paused) {
        tvPlayer.play()
            .then(updatePlayPauseButton)
            .catch(e => {
                // Handle play rejection (e.g., if interrupted by pause or blocked by policy)
                if (e.name !== "AbortError" && e.name !== "NotAllowedError") {
                    console.error("Error resuming playback:", e);
                }
                updatePlayPauseButton(); // Update button state regardless
            });
    } else {
        tvPlayer.pause();
        updatePlayPauseButton();
    }
}

function updatePlayPauseButton() {
    uiPlayPauseButton.textContent = tvPlayer.paused ? 'Play' : 'Pause';
}

/**
 * Toggles Closed Captioning status.
 */
function toggleClosedCaptioning() {
    isCCEnabled = !isCCEnabled;
    uiCCButton.textContent = isCCEnabled ? 'CC On' : 'CC Off';

    // In a real scenario, this would involve HLS.js API or JW Player API to switch track.
    // Since we are simulating, we just notify the user.
    showNotification(`Closed Captioning is now ${isCCEnabled ? 'ON' : 'OFF'}.`);

    // If a track exists, try to toggle it on the HTML video element directly
    // This is highly dependent on the stream providing the VTT/TTML tracks.
    if (tvPlayer.textTracks) {
        Array.from(tvPlayer.textTracks).forEach(track => {
            if (track.kind === 'subtitles' || track.kind === 'captions') {
                // Ensure the track is active when CC is ON
                track.mode = isCCEnabled ? 'showing' : 'hidden';
            }
        });
    }
    
    // If external JW Player is loaded, it might need to be toggled too, but 
    // we assume the external player automatically hooks into the video element or has its own API.
    // Since the external script is likely the source of the styling issues, we rely on the native track mode change.
}

// --- Seek Functionality ---

const SEEK_INTERVAL = 10; // seconds

function seekBackward(seconds, showOverlay = false) {
    if (tvPlayer.style.display !== 'block') return; // Only seek for video player
    
    let targetTime = tvPlayer.currentTime - seconds;
    
    // Clamp at the beginning of the available content
    if (tvPlayer.duration && tvPlayer.duration !== Infinity) {
        // If duration is known (often the case for DVR/buffered streams), clamp to 0
        targetTime = Math.max(0, targetTime);
    } else if (hlsInstance) {
        // For live HLS streams, use the HLS buffer logic if possible
        // This is complex, so for simulation, we'll just prevent negative time.
        // In a real HLS.js setup, seeking back beyond the manifest window will often fail or jump to live.
        
        // Simulate DVR start time being 1 hour ago
        const dvrStartTime = Date.now() / 1000 - MAX_DVR_WINDOW_SECONDS; 
        
        // We need to calculate the relative time difference from the DVR start
        // For simplicity in this demo, we clamp to 0 relative to the player's current time context
        targetTime = Math.max(0, targetTime);
        
    } else {
        targetTime = Math.max(0, targetTime);
    }

    tvPlayer.currentTime = targetTime;
    
    if (showOverlay) {
        showSeekOverlay('backward'); // Show the new seek overlay
    }
}

function seekForward(seconds, showOverlay = false) {
    if (tvPlayer.style.display !== 'block') return; // Only seek for video player

    let targetTime = tvPlayer.currentTime + seconds;
    
    // Clamp at the end of the available content / live edge
    if (tvPlayer.duration && tvPlayer.duration !== Infinity) {
        targetTime = Math.min(tvPlayer.duration, targetTime);
    } else if (hlsInstance) {
        // For live HLS streams, try to seek to the live edge if seeking beyond it.
        const liveEdge = hlsInstance.liveSyncPosition || tvPlayer.duration || MAX_DVR_WINDOW_SECONDS; // Use 1 hour as simulated live edge
        
        // Clamp to the live edge (which is typically MAX_DVR_WINDOW_SECONDS in our simulated context)
        targetTime = Math.min(liveEdge, targetTime);

    }
    
    tvPlayer.currentTime = targetTime;
    
    if (showOverlay) {
        showSeekOverlay('forward'); // Show the new seek overlay
    }
}


// --- Recording UI Timer Functions ---

function updateRecordingTimer() {
    if (!isRecording || isRecordingPaused) return;

    // FIX: Correctly calculate elapsed time: 
    // Time since last start/resume + accumulated time during previous pauses (offset).
    const elapsedMs = (Date.now() - recordingStartTime) + recordingDurationOffset;
    const totalSeconds = Math.floor(elapsedMs / 1000);
    
    // Ensure the timestamp doesn't show garbage if duration is extremely large due to previous errors.
    // If elapsedMs is still a massive timestamp, something is wrong with recordingStartTime initialization.
    // However, the formula fix should resolve the primary issue.
    if (totalSeconds < 0) {
        recordingTimestamp.textContent = '00:00:00';
        console.warn('Recording time went negative. Resetting timer.');
        return;
    }
    
    recordingTimestamp.textContent = formatSecondsToHHMMSS(totalSeconds);
}

function startRecordingTimer() {
    if (recordingTimerInterval) clearInterval(recordingTimerInterval);
    recordingStatusOverlay.classList.remove('hidden');
    recordingTimerInterval = setInterval(updateRecordingTimer, 1000);
    updateRecordingTimer(); // Initial update
}

function stopRecordingTimer() {
    if (recordingTimerInterval) clearInterval(recordingTimerInterval);
    recordingTimerInterval = null;
    recordingStatusOverlay.classList.add('hidden');
    recordingTimestamp.textContent = '00:00:00';
}

// --- Recording MediaRecorder Functions ---

function startRecording() {
    if (!currentChannelName || uiRecordButton.style.display === 'none') {
        showCustomAlert("Must be watching a live channel to record.", [{ text: 'OK', value: true, isDefault: true }]);
        return;
    }

    try {
        // Use current dynamic FPS setting
        const stream = tvPlayer.captureStream(RECORDING_FPS);
        
        // Check for supported MIME types. We prefer VP9/H.264 MP4 if available, 
        // but default MediaRecorder implementations usually force WebM (VP8/VP9) or MP4 (H.264/AAC).
        let mimeType = 'video/webm';
        if (window.MediaRecorder.isTypeSupported('video/mp4; codecs=avc1')) {
            // Attempt H.264 MP4 if supported for better compatibility with output
            mimeType = 'video/mp4'; 
        } else if (window.MediaRecorder.isTypeSupported('video/webm; codecs=vp9,opus')) {
            mimeType = 'video/webm; codecs=vp9,opus';
        } else if (window.MediaRecorder.isTypeSupported('video/webm; codecs=vp8,opus')) {
            mimeType = 'video/webm; codecs=vp8,opus';
        }
        
        // Note: The bit rate setting is usually a strong suggestion, not a guarantee.
        mediaRecorder = new MediaRecorder(stream, { 
            mimeType,
            videoBitsPerSecond: RECORDING_BITRATE // Use dynamic bitrate
        });
        recordedChunks = [];
        
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            // Processing function is called here when 'stop' is invoked
            processRecordedData(); 
        };

        mediaRecorder.onerror = (event) => {
            console.error("MediaRecorder Error:", event.error);
            showCustomAlert(`Recording failed unexpectedly: ${event.error.name}`, [{ text: 'OK', value: true, isDefault: true }]);
            
            resetRecordingState();
        }

        mediaRecorder.start();
        recordingStartTime = Date.now();
        recordingDurationOffset = 0; // Reset offset
        isRecording = true;
        isRecordingPaused = false;
        
        // Update both UI control button and status overlay
        uiRecordButton.classList.add('hidden'); // Hide bottom bar record button during active recording
        startRecordingTimer();
        uiRecordPauseButton.textContent = 'Pause';
        uiRecordPauseButton.classList.remove('paused');
        
        // Ensure dedicated overlay buttons are visible when starting
        uiRecordPauseButton.style.display = 'inline-block';
        uiRecordStopButton.style.display = 'inline-block';
        
        // Hide main player UI until interaction occurs
        playerUI.classList.add('hidden'); 

        console.log("Recording started...");
        // Use custom alert for status update
        // showCustomAlert(`Recording started for ${currentChannelName}!`, [{ text: 'Dismiss', value: true, isDefault: true }]);

    } catch (e) {
        console.error("Failed to start MediaRecorder:", e);
        showCustomAlert(`Failed to start recording: ${e.message}`, [{ text: 'OK', value: true, isDefault: true }]);
        resetRecordingState();
    }
}

function resetRecordingState() {
    stopRecordingTimer();
    isRecording = false;
    isRecordingPaused = false;
    mediaRecorder = null;
    recordedChunks = [];
    recordingStartTime = 0;
    recordingDurationOffset = 0;
    
    // Restore the active recording UI structure (which includes the pause/stop buttons)
    restoreActiveRecordingUI(); 

    // Ensure bottom bar button is visible and correct
    uiRecordButton.classList.remove('hidden');
    uiRecordButton.disabled = false;
    uiRecordButton.textContent = 'Record';
    
    // Restore player UI visibility timer
    showPlayerUI();
}

function stopRecording(silent = false) {
    if (!mediaRecorder || mediaRecorder.state === 'inactive') return;
    
    // If paused, resume briefly before stopping to ensure all data is flushed (important for some browsers)
    if (mediaRecorder.state === 'paused') {
        mediaRecorder.resume();
    }
    
    // UI feedback before stopping
    if (!silent) {
        stopRecordingTimer(); // Stop the visual timer
        uiRecordButton.textContent = 'Finalizing...';
        uiRecordButton.disabled = true;
        
        // Switch recording overlay to processing progress bar view
        showProcessingUI(UPLOAD_SIMULATION_MAX_PROGRESS / 2); // Start at a visible low percentage for a smooth transition before the upload loop
        
        console.log(`Recording stopped. Starting simulated FFmpeg conversion...`);
    } else {
        // If silent stop, just hide the dedicated UI button
        uiRecordButton.classList.remove('hidden');
    }
    
    // This triggers mediaRecorder.onstop
    mediaRecorder.stop(); 
}

function handleDedicatedStopClick() {
    showCustomAlert("Stop recording and save?", [
        { text: 'Cancel', value: false },
        { text: 'Stop & Save', value: true, isDefault: true }
    ]).then(result => {
        if (result) {
            stopRecording(false); // Stop recording gracefully (not silent)
        } else {
            // Restore focus to the stop button if canceled
            setTimeout(() => {
                const newStopButton = document.getElementById('ui-record-stop');
                if (newStopButton) newStopButton.focus();
            }, 0);
        }
    });
}

function pauseResumeRecording() {
    if (!mediaRecorder || mediaRecorder.state === 'inactive') return;
    
    if (mediaRecorder.state === 'recording') {
        mediaRecorder.pause();
        isRecordingPaused = true;
        
        // Update duration offset based on elapsed time
        recordingDurationOffset += (Date.now() - recordingStartTime);
        recordingStartTime = Date.now(); // Reset start time for the next segment
        
        // Update UI
        uiRecordPauseButton.textContent = 'Resume';
        uiRecordPauseButton.classList.add('paused');
        
        // Pause timer update
        if (recordingTimerInterval) clearInterval(recordingTimerInterval);
        
        // Update indicator text
        recordingStatusOverlay.querySelector('.status-text').textContent = 'Paused';

    } else if (mediaRecorder.state === 'paused') {
        mediaRecorder.resume();
        isRecordingPaused = false;
        
        // Reset start time to accurately measure the *next* recording segment duration
        recordingStartTime = Date.now();
        
        // Update UI
        uiRecordPauseButton.textContent = 'Pause';
        uiRecordPauseButton.classList.remove('paused');
        
        // Resume timer update
        startRecordingTimer();
        
        // Update indicator text
        recordingStatusOverlay.querySelector('.status-text').textContent = 'Recording...';
    }
}


function handleRecord() {
    if (!currentChannelName || uiRecordButton.style.display === 'none') {
        return;
    }
    
    // If the main button is visible, we start recording
    if (!isRecording) {
        startRecording();
    } 
    // If the main button is hidden, recording must be active, but this path shouldn't be reached
}

// Handler for the dedicated stop button in the overlay (need a wrapper since original buttons are destroyed/recreated)
recordingStatusOverlay.addEventListener('click', (e) => {
    // We only need to handle clicks on buttons if they exist
    if (e.target.id === 'ui-record-stop') {
        handleDedicatedStopClick();
    } else if (e.target.id === 'ui-record-pause') {
        pauseResumeRecording();
    }
});

// Handler for the dedicated stop button in the overlay
uiRecordStopButton.addEventListener('click', handleDedicatedStopClick);

// Handler for the dedicated pause button in the overlay
uiRecordPauseButton.addEventListener('click', pauseResumeRecording);


async function processRecordedData() {
    // Total duration is calculated by the offset (paused time) + time since last resume/start
    // FIX: Use the corrected calculation for the final duration
    const finalRecordingTime = (Date.now() - recordingStartTime) + recordingDurationOffset;
    const recordingDuration = finalRecordingTime / 1000;
    
    // Clean up dedicated UI (hiding the overlay happens in resetRecordingState, which is called later)

    if (recordedChunks.length === 0 || recordingDuration < 1) {
        console.warn("No valid recorded data or recording too short.");
        showCustomAlert("Recording failed: Capture too short or no data captured.", [{ text: 'OK', value: true, isDefault: true }]);
        resetRecordingState();
        return;
    }

    const videoBlob = new Blob(recordedChunks, { type: mediaRecorder.mimeType });
    const fileSize = videoBlob.size;
    
    recordedChunks = []; // Clear chunks
    
    const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const outputExtension = RECORDING_FORMAT; // Use the chosen format
    const recordingName = `${currentChannelName} Recording (${date.substring(0, 16)})`;
    const recordingId = recordings.length + 1;

    console.log(`Recorded blob size: ${formatBytes(fileSize)}, duration: ${recordingDuration.toFixed(2)}s. Uploading...`);
    
    try {
        // We upload the raw blob, but the filename suggests the desired output format after conversion
        // Note: websim.upload will automatically infer the file extension from the File object's name
        const videoFile = new File([videoBlob], `recording-${recordingId}.${outputExtension}`, { type: videoBlob.type });
        
        // Simulate upload progress from 0% to UPLOAD_SIMULATION_MAX_PROGRESS (20%)
        const uploadProgressSteps = 5;
        // Ensure initial progress is shown immediately before starting the loop
        updateProcessingProgress(0.0); 

        for (let i = 1; i <= uploadProgressSteps; i++) {
            const progress = (i / uploadProgressSteps) * UPLOAD_SIMULATION_MAX_PROGRESS;
            updateProcessingProgress(progress);
            await new Promise(r => setTimeout(r, 100)); // Small delay for visibility
        }
        
        const url = await window.websim.upload(videoFile); 

        console.log("Upload successful:", url);
        updateProcessingProgress(UPLOAD_SIMULATION_MAX_PROGRESS); // Ensure it lands exactly at the max upload progress boundary (20%)
        
        // 2. Save the metadata *immediately* (Decouple save from Remotion success)
        recordings.push({
            id: recordingId,
            name: recordingName,
            channel: currentChannelName,
            url: url, // URL points to the recorded/uploaded file (now with the desired extension in the name)
            date: date,
            size: fileSize,
            duration_seconds: recordingDuration.toFixed(2),
            format: outputExtension // Store the intended format
        });
        saveRecordings();

        // 3. Simulate FFmpeg conversion using the Remotion success animation
        // Pass the updateProcessingProgress function as the progress callback
        startSuccessAnimationRender(currentChannelName, recordingName, recordingDuration, (remotionProgress) => {
             // Remotion progress is 0 to 1. We wrap it to map it 20% to 100%.
             const remotionRange = 1.0 - REMOTION_SIMULATION_MIN_PROGRESS;
             const overallProgress = REMOTION_SIMULATION_MIN_PROGRESS + (remotionProgress * remotionRange);
             updateProcessingProgress(overallProgress);
        }, (success, error) => {
            
            // 4. Update UI confirmation after success animation completion
            resetRecordingState(); // Reset UI/State regardless of animation result
            
            if (success) {
                // Show notification and play sound upon confirmed conversion success
                showNotification("Recording done!");
                // No custom alert needed if using the notification popup

            } else {
                 console.error("FFmpeg Conversion Simulation failed (Remotion error):", error);
                 // The recording is already saved (Step 2), so this is a less critical failure.
                 showCustomAlert(`Recording saved, but confirmation animation failed. File: ${recordingName}`, [{ text: 'OK', value: true, isDefault: true }]);
            }
        });

    } catch (error) {
        console.error('Error during recording upload/processing:', error);
        resetRecordingState();
        showCustomAlert('Recording failed during upload or processing. Check console for details.', [{ text: 'OK', value: true, isDefault: true }]);
    }
}


async function handleCapture() {
    if (tvPlayer.readyState < 2 || uiCaptureButton.style.display === 'none') { // READY_STATE_HAVE_CURRENT_DATA
        showCustomAlert("Video frame not ready for capture or not watching live TV.", [{ text: 'OK', value: true, isDefault: true }]);
        return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = tvPlayer.videoWidth;
    canvas.height = tvPlayer.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(tvPlayer, 0, 0, canvas.width, canvas.height);

    // Get the image data as a Blob
    canvas.toBlob(async (blob) => {
        if (!blob) {
            alert("Failed to capture image.");
            return;
        }
        
        try {
            // Upload to S3/Blob storage
            const captureFile = new File([blob], `capture-${captures.length + 1}.png`, { type: 'image/png' });
            const url = await window.websim.upload(captureFile);
            
            const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
            const captureName = `${currentChannelName} Screenshot (${date.substring(11, 19)})`;
            
            // Save metadata
            captures.push({
                id: captures.length + 1,
                name: captureName,
                channel: currentChannelName,
                url: url,
                date: date,
                size: blob.size // Store the size
            });
            saveCaptures();

            showCustomAlert(`Screenshot captured successfully! Saved as: ${captureName} (${formatBytes(blob.size)})`, [{ text: 'OK', value: true, isDefault: true }]);
            
        } catch (error) {
            console.error('Error during capture upload:', error);
            showCustomAlert("Screenshot captured locally, but failed to save/upload.", [{ text: 'OK', value: true, isDefault: true }]);
        } finally {
            showPlayerUI(); // Show UI to confirm activity
        }

    }, 'image/png');
}


// --- Event Setup ---

// Channel List Click
channelButtons.forEach(button => {
    button.addEventListener('click', () => {
        const url = button.dataset.channelUrl;
        const name = button.dataset.channelName;
        const id = button.dataset.channelId;
        currentChannelId = id;
        enterFullscreenPlayer(url, name, false, 'video');
    });
});

// UI Controls Click
uiStopButton.addEventListener('click', exitFullscreenPlayer);
uiPlayPauseButton.addEventListener('click', togglePlayPause);
uiRecordButton.addEventListener('click', handleRecord);
uiCaptureButton.addEventListener('click', handleCapture);
uiGuideButton.addEventListener('click', showGuideOverlay); // Use new function for overlay
uiRewindButton.addEventListener('click', () => seekBackward(SEEK_INTERVAL, false)); // Pass false to hide overlay for button clicks
uiFastForwardButton.addEventListener('click', () => seekForward(SEEK_INTERVAL, false)); // Pass false to hide overlay for button clicks
uiCCButton.addEventListener('click', toggleClosedCaptioning); // NEW CC Button listener

// Tab Navigation
navButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        // If we click any main nav button, ensure player is closed
        exitFullscreenPlayer();
        switchView(e.target.dataset.view);
    });
});

// Settings Event Listener
applyThemeButton.addEventListener('click', () => {
    const selectedTheme = themeSelect.value;
    const currentSettings = loadSettings();
    saveSettings({ ...currentSettings, theme: selectedTheme });
    showCustomAlert(`Theme set to ${selectedTheme}.`, [{ text: 'OK', value: true, isDefault: true }]);
});

// NEW Language Setting Listener
if (languageSelect) {
    languageSelect.addEventListener('change', (e) => {
        const newLang = e.target.value;
        const currentSettings = loadSettings();
        saveSettings({ ...currentSettings, language: newLang });
        showNotification(`Language set to ${newLang.toUpperCase()}.`);
    });
}

// NEW GUI Scale Setting Listener
if (guiScaleSelect) {
    guiScaleSelect.addEventListener('change', (e) => {
        const newScale = e.target.value;
        const currentSettings = loadSettings();
        saveSettings({ ...currentSettings, guiScale: newScale });
        showNotification(`GUI Scale set to ${newScale}.`);
    });
}

// New Font Settings Listener
fontSelect.addEventListener('change', (e) => {
    const newFont = e.target.value;
    const currentSettings = loadSettings();
    saveSettings({ ...currentSettings, fontFamily: newFont });
    showNotification(`Font set to ${newFont}.`);
});

// New Quality Settings Listeners (We apply these instantly on change)
liveTvFramesSelect.addEventListener('change', (e) => {
    const newFps = parseInt(e.target.value);
    const currentSettings = loadSettings();
    saveSettings({ ...currentSettings, fps: newFps });
    showNotification(`Recording FPS set to ${newFps}.`);
});

liveTvQualitySelect.addEventListener('change', (e) => {
    const newBitrate = parseInt(e.target.value);
    const currentSettings = loadSettings();
    saveSettings({ ...currentSettings, bitrate: newBitrate });
    showNotification(`Recording Bitrate set to ${newBitrate / 1000000} Mbps.`);
});

recordingConversionSelect.addEventListener('change', (e) => {
    const newFormat = e.target.value;
    const currentSettings = loadSettings();
    saveSettings({ ...currentSettings, format: newFormat });
    showNotification(`Recording conversion format set to ${newFormat.toUpperCase()}.`);
});

openColorPickerButton.addEventListener('click', showColorPickerModal);

// --- NEW CAPTIONS STYLE LISTENERS ---

function handleCaptionStyleChange(key, value) {
    const currentSettings = loadSettings();
    saveSettings({ ...currentSettings, [key]: value });
    // showNotification(`Caption style updated.`); // Too noisy, skip notification here
}

// Font
if (captionFontSelect) {
    captionFontSelect.addEventListener('change', (e) => {
        handleCaptionStyleChange('captionFont', e.target.value);
    });
}

// Text Color
if (captionTextColorInput) {
    captionTextColorInput.addEventListener('input', (e) => {
        handleCaptionStyleChange('captionTextColor', e.target.value);
    });
}

// Text Transparency
if (captionTextTransparencyInput) {
    captionTextTransparencyInput.addEventListener('input', (e) => {
        captionTextTransparencyDisplay.textContent = `${e.target.value}%`;
        handleCaptionStyleChange('captionTextOpacity', parseInt(e.target.value));
    });
}

// Background Color
if (captionBgColorInput) {
    captionBgColorInput.addEventListener('input', (e) => {
        handleCaptionStyleChange('captionBgColor', e.target.value);
    });
}

// Background Transparency
if (captionBgTransparencyInput) {
    captionBgTransparencyInput.addEventListener('input', (e) => {
        captionBgTransparencyDisplay.textContent = `${e.target.value}%`;
        handleCaptionStyleChange('captionBgOpacity', parseInt(e.target.value));
    });
}

// Outline Style
if (captionOutlineSelect) {
    captionOutlineSelect.addEventListener('change', (e) => {
        handleCaptionStyleChange('captionOutline', e.target.value);
    });
}

// Shadow/Glow Style
if (captionShadowSelect) {
    captionShadowSelect.addEventListener('change', (e) => {
        handleCaptionStyleChange('captionShadow', e.target.value);
    });
}

// NEW Size Listener
if (captionSizeSelect) {
    captionSizeSelect.addEventListener('change', (e) => {
        handleCaptionStyleChange('captionSize', e.target.value);
    });
}

// NEW Position Listener
if (captionPositionSelect) {
    captionPositionSelect.addEventListener('change', (e) => {
        handleCaptionStyleChange('captionPosition', e.target.value);
    });
}


// Player Interactivity (to show/hide UI on any activity)
function resetUITimer() {
    if (!videoContainer.classList.contains('hidden')) {
        // Only show UI if the guide overlay and seek overlay are NOT visible
        if (guideOverlay.classList.contains('hidden') && seekOverlay.classList.contains('hidden') && (tvPlayer.style.display === 'block' || mediaViewerImg.style.display === 'block')) {
             showPlayerUI();
        }
        
        // If seeking, reset the seek overlay timeout
        if (isSeeking) {
             showSeekOverlay(seekIndicator.textContent === '≪' ? 'backward' : 'forward');
        }
    }
}

tvPlayer.addEventListener('mousemove', resetUITimer);
tvPlayer.addEventListener('click', togglePlayPause);
tvPlayer.addEventListener('pause', updatePlayPauseButton);
tvPlayer.addEventListener('play', updatePlayPauseButton);

// Update progress bar on time update
tvPlayer.addEventListener('timeupdate', () => {
    // Only update the progress bar visually if the seek overlay is active
    if (!seekOverlay.classList.contains('hidden')) {
        updateProgressBar();
    }
    
    // If not seeking and recording is active but paused, update the time display slightly faster
    if (isRecording && isRecordingPaused) {
        updateRecordingTimer();
    }
});


// --- Keyboard Navigation / Accessibility ---

function getFocusableElementsInContainer(container) {
    // Include the new Guide button and P2P modal buttons
    return Array.from(container.querySelectorAll('.focusable, .channel-button, button, [tabindex="0"], input, select'));
}

document.addEventListener('keydown', (event) => {
    
    // Check for Enter key by keyCode for maximum compatibility
    const isEnterKey = event.key === 'Enter' || event.keyCode === 13;
    
    // --- Custom Alert Handling (Priority 1) ---
    if (customAlertModal.dataset.isActive === 'true') {
        const key = event.key;
        
        if (key === 'ArrowLeft') {
            event.preventDefault();
            navigateCustomAlert('left');
        } else if (key === 'ArrowRight') {
            event.preventDefault();
            navigateCustomAlert('right');
        } else if (isEnterKey) { // Check for Enter key
            event.preventDefault();
            const focusedButton = customAlertButtons.querySelector('.focused');
            if (focusedButton) {
                focusedButton.click();
            }
        } else if (key === 'Escape') {
            // Treat escape as clicking the default/first button
            event.preventDefault();
            
            // Find the default button if one exists, otherwise click the first one
            const defaultButton = activeAlertButtons.find(btn => btn.textContent.toLowerCase().includes('cancel')) || activeAlertButtons[0];
            if (defaultButton) {
                defaultButton.click();
            }
        }
        return; // Block all other input while alert is active
    }


    // --- P2P Modal Handling (Priority 2) ---
    if (!p2pTransferModal.classList.contains('hidden')) {
        const key = event.key;
        const focused = document.activeElement;
        const focusables = getFocusableElementsInContainer(p2pTransferModal);
        const currentIndex = focusables.indexOf(focused);
        
        if (key === 'Escape') {
            event.preventDefault();
            hideTransferModal();
            return;
        }
        
        if (key === 'ArrowUp' || key === 'ArrowDown') {
            event.preventDefault();
            if (focusables.length === 0) return;
            
            let nextIndex = currentIndex;
            
            if (key === 'ArrowDown') {
                nextIndex = (currentIndex + 1) % focusables.length;
            } else { // ArrowUp
                nextIndex = (currentIndex - 1 + focusables.length) % focusables.length;
            }
            
            if (nextIndex !== currentIndex && nextIndex >= 0) {
                 focusables[nextIndex].focus();
                 focusables[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
            return;
        }
        
        if (isEnterKey) { // Check for Enter key
            if (focused && focused.click) {
                focused.click();
                event.preventDefault();
            }
            return;
        }
        
        // Allow typing in input box
        if (focused && focused.tagName === 'INPUT') {
            return;
        }

        return; // Block other interactions
    }


    // If in fullscreen mode (Player)
    if (!videoContainer.classList.contains('hidden')) {
        
        resetUITimer(); // Always reset UI timer on key press (only shows UI if guide isn't open)

        const key = event.key;
        const keyCode = event.keyCode; // Use keyCode for non-standard keys 168 and 208
        
        // 1. Exit (Escape/Backspace)
        if (key === 'Escape' || key === 'Backspace') {
            event.preventDefault(); 
            
            // If Seek Overlay is open, close it first
            if (isSeeking) {
                hideSeekOverlay();
                return;
            }

            // If Guide is open, close guide first
            if (!guideOverlay.classList.contains('hidden')) {
                hideGuideOverlay();
            } else {
                exitFullscreenPlayer();
            }
            return;
        }
        
        // If seek overlay is open, handle R/FF keys but block other commands
        if (isSeeking) {
            // Only allow R/FF or Exit/Pause if seeking is active
            if (key === ' ' && tvPlayer.style.display === 'block') {
                 event.preventDefault();
                 togglePlayPause(); // Allow pausing while seek overlay is active
                 hideSeekOverlay(); // Hide overlay after action
            }
            
            // Allow L/R arrows to continue seeking
            if (key === 'ArrowLeft') {
                 event.preventDefault();
                 seekBackward(SEEK_INTERVAL); // Do not pass true, overlay is already shown/updated
            } else if (key === 'ArrowRight') {
                 event.preventDefault();
                 seekForward(SEEK_INTERVAL); // Do not pass true, overlay is already shown/updated
            }
            
            // Allow media keys 168 and 208 to continue seeking
            if (keyCode === 168) { // Rewind/R/Skip Back
                event.preventDefault();
                seekBackward(SEEK_INTERVAL); // Do not pass true
            } else if (keyCode === 208) { // Fast Forward/FF/Skip Forward
                event.preventDefault();
                seekForward(SEEK_INTERVAL); // Do not pass true
            }
            
            return; // Block other interactions while seeking UI is active
        }
        
        // --- Recording Status Overlay Controls (If active) ---
        // If recording is active and player UI is hidden, check for R/P/S keys to control recording
        if (isRecording && playerUI.classList.contains('hidden')) {
             if (key === 'r' || key === 'R') {
                event.preventDefault();
                // Treat R as stop if recording is already active
                uiRecordStopButton.click(); 
                return;
             }
             if (key === 'p' || key === 'P' || key === ' ') {
                 event.preventDefault();
                 pauseResumeRecording();
                 return;
             }
             if (key === 's' || key === 'S') {
                 event.preventDefault();
                 uiRecordStopButton.click(); 
                 return;
             }
             // Allow Escape to close UI, but it's handled above
        }


        // --- Guide Overlay Navigation ---
        if (!guideOverlay.classList.contains('hidden')) {
             const focused = document.activeElement;
             const guideFocusables = getFocusableElementsInContainer(guideOverlay);
             const currentIndex = guideFocusables.indexOf(focused);

             if (guideFocusables.length === 0) return;
             
             // Handle Enter/Click in Guide
             if (isEnterKey) { // Check for Enter key
                 if (focused && guideOverlay.contains(focused)) {
                     focused.click();
                     event.preventDefault();
                     // If clicking a program or channel entry, it triggers a channel switch AND hideGuideOverlay
                     return;
                 }
             }

             // Use generic navigation for robustness in older browsers
             if (key === 'ArrowLeft' || key === 'ArrowRight' || key === 'ArrowUp' || key === 'ArrowDown') {
                 event.preventDefault();
                 
                 let direction;
                 if (key === 'ArrowLeft') direction = 'left';
                 else if (key === 'ArrowRight') direction = 'right';
                 else if (key === 'ArrowUp') direction = 'up';
                 else direction = 'down';

                 const nextElement = navigateGeneric(guideOverlay, direction);
                 
                 if (nextElement) {
                     nextElement.focus();
                     nextElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
                 }
                 return; 
             }

             return; // Stop processing player controls if guide is open
        }
        
        // --- Player Controls (when Guide is NOT open and Seek Overlay is NOT open) ---
        
        // 2. Play/Pause (Spacebar) - Only applicable if watching video
        if (key === ' ' && tvPlayer.style.display === 'block') {
            event.preventDefault();
            togglePlayPause();
            return;
        }

        // 3. Navigation within Player UI (Arrow keys, Enter)
        const focused = document.activeElement;
        
        if (key === 'ArrowLeft' || key === 'ArrowRight' || key === 'ArrowUp' || key === 'ArrowDown') {
            
            // Check if focus is on UI controls or if we should initiate focus
            const focusables = getFocusableElementsInContainer(playerUI).filter(el => el.offsetWidth > 0 || el.offsetHeight > 0);
            
            // Only perform UI navigation if we are actively focused on a UI element OR if we press UP/DOWN
            if (playerUI.contains(focused) || focused === tvPlayer || key === 'ArrowUp' || key === 'ArrowDown') {
                 
                let direction;
                if (key === 'ArrowLeft') direction = 'left';
                else if (key === 'ArrowRight') direction = 'right';
                else if (key === 'ArrowUp') direction = 'up';
                else direction = 'down';
                
                // For player UI, we simplify navigation to L/R if focus is inside the UI bar.
                if (key === 'ArrowLeft' || key === 'ArrowRight') {
                    event.preventDefault(); 
                    
                    const currentIndex = focusables.indexOf(focused);
                    if (currentIndex === -1) {
                        // If unfocused, focus the first element
                        if (focusables.length > 0) focusables[0].focus();
                        return;
                    }
                    
                    let nextIndex = (currentIndex + (key === 'ArrowRight' ? 1 : -1) + focusables.length) % focusables.length;
                    focusables[nextIndex].focus();
                    return;
                }
                
                // UP/DOWN in player mode is less common for navigation, 
                // but if implemented, it should move focus from the video/off-UI to the UI bar.
                if (key === 'ArrowDown') {
                    // Try to focus the first element in the UI bar
                    event.preventDefault();
                    if (!playerUI.contains(focused) && focusables.length > 0) {
                        focusables[0].focus();
                        return;
                    }
                }
            }
            
            // If horizontal arrows are pressed AND we are in video mode (not image, not guide), perform seeking
            if (tvPlayer.style.display === 'block' && uiRecordButton.style.display !== 'none' && (key === 'ArrowLeft' || key === 'ArrowRight')) {
                 event.preventDefault(); // Consume arrow key press
                 if (key === 'ArrowLeft') {
                    seekBackward(SEEK_INTERVAL, true); // Show overlay for keyboard arrows
                 } else {
                    seekForward(SEEK_INTERVAL, true); // Show overlay for keyboard arrows
                 }
                 // Do not return here, we proceed to check other key mappings
            }
        } 
        
        if (isEnterKey) { // Check for Enter key
            const focusedElement = document.activeElement;
            if (focusedElement && focusedElement.click) {
                focusedElement.click();
                event.preventDefault();
            } else if (tvPlayer.style.display === 'block') {
                // If nothing specific focused, treat Enter as Play/Pause
                togglePlayPause();
                event.preventDefault();
            }
            return;
        }
        
        // Only allow channel switching/R/C/G/P2P if watching a LIVE stream 
        if (tvPlayer.style.display === 'block' && uiRecordButton.style.display !== 'none') {
            
            // 3. Horizontal seeking using Media Keys (168, 208) - handled in the seek overlay block, but repeated here for when overlay is hidden
            if (keyCode === 168) { // Rewind/R/Skip Back
                event.preventDefault();
                seekBackward(SEEK_INTERVAL, true); // Show overlay
                return;
            } else if (keyCode === 208) { // Fast Forward/FF/Skip Forward
                event.preventDefault();
                seekForward(SEEK_INTERVAL, true); // Show overlay
                return;
            }

            // 4. Media Keys for Recording and Playback (New)
            if (keyCode === 167) { // REC button
                event.preventDefault();
                handleRecord();
                return;
            } else if (keyCode === 128) { // STOP button
                event.preventDefault();
                if (isRecording) {
                    uiRecordStopButton.click(); // Trigger stop confirmation flow
                } else if (tvPlayer.style.display === 'block') {
                    // If not recording, treat as full stop/exit if video is playing
                    exitFullscreenPlayer();
                }
                return;
            } else if (keyCode === 119 || keyCode === 207) { // Pause (119) or Play (207)
                // Prioritize recording pause/resume if recording is active
                if (isRecording) {
                    event.preventDefault();
                    pauseResumeRecording();
                } else if (tvPlayer.style.display === 'block') {
                    // Otherwise, toggle live TV pause/play
                    event.preventDefault();
                    togglePlayPause();
                }
                return;
            }
            
            // 5. Channel Switching (Numbers 0-9) (was 4)
            if (key >= '1' && key <= '9') {
                event.preventDefault();
                const newChannelId = parseInt(key);
                
                displayNumberInput(key);
                
                if (channelMap[newChannelId]) {
                    handleChannelSwitch(newChannelId);
                }
            }
            
            // 4. Page Up/Page Down switching
            if (key === 'PageUp' || key === 'PageDown') {
                event.preventDefault();
                
                let currentIndex = channelIds.findIndex(id => id === parseInt(currentChannelId));
                let newIndex;
                
                if (key === 'PageUp') {
                    newIndex = (currentIndex - 1 + channelIds.length) % channelIds.length;
                } else { // PageDown
                    newIndex = (currentIndex + 1) % channelIds.length;
                }
                
                const newChannelId = channelIds[newIndex];
                
                displayNumberInput(newChannelId.toString());
                handleChannelSwitch(newChannelId);
            }

            // 6. Specific control keys (R for Record, C for Capture, G for Guide, T for Transfer)
            if (key === 'r' || key === 'R') {
                 // If not recording, start recording
                 if (!isRecording && uiRecordButton.style.display !== 'none') {
                     handleRecord();
                 } else if (isRecording) {
                    // If recording is active, stop it via dedicated button click flow
                    uiRecordStopButton.click(); 
                 }
            }
            if (key === 'c' || key === 'C') {
                 if (uiCaptureButton.style.display !== 'none') {
                     handleCapture();
                 }
            }
            if (key === 'g' || key === 'G') {
                 if (uiGuideButton.style.display !== 'none') {
                     showGuideOverlay(); // Trigger guide overlay
                 }
            }
            // NEW: Transfer Key
            if (key === 't' || key === 'T') {
                 showTransferModal();
            }
        }
    } else {
        // If not in fullscreen mode (Main UI/Tabs/Lists)
        
        const key = event.key;
        const focused = document.activeElement;
        
        // --- Generic Main Menu Navigation ---
        if (key === 'ArrowLeft' || key === 'ArrowRight' || key === 'ArrowUp' || key === 'ArrowDown') {
             event.preventDefault();

             let direction;
             if (key === 'ArrowLeft') direction = 'left';
             else if (key === 'ArrowRight') direction = 'right';
             else if (key === 'ArrowUp') direction = 'up';
             else direction = 'down';

             // Determine the container based on the currently focused element
             let container = document.getElementById(`${currentView}-view`);
             if (focused.closest('#main-nav')) {
                 container = document.getElementById('main-nav'); // Treat nav bar as a separate horizontal container
             } else if (!container) {
                 // Fallback if view is not found, use body
                 container = document.body;
             }
             
             // If navigating the top nav bar, force horizontal navigation
             if (container.id === 'main-nav') {
                 const nextElement = navigateGeneric(container, direction === 'up' || direction === 'down' ? 'right' : direction); // Treat U/D as L/R wrap
                 if (nextElement) nextElement.focus();
                 return;
             }
             
             // For general view navigation, use the complex logic
             const nextElement = navigateGeneric(container, direction);
             
             if (nextElement) {
                 nextElement.focus();
                 // Ensure visibility when navigating lists
                 nextElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
             } else if (direction === 'up') {
                 // If at the top of a list, try to jump to the nav bar
                 const navButtonsArray = Array.from(navButtons);
                 if (navButtonsArray.length > 0) {
                     navButtonsArray.find(btn => btn.dataset.view === currentView)?.focus();
                 }
             }

        }


        if (isEnterKey) { // Check for Enter key
            const focusedElement = document.activeElement;
            if (focusedElement && focusedElement.click) {
                focusedElement.click();
                event.preventDefault();
            }
        }
    }
});


// --- P2P Event Listeners ---

p2pCloseButton.addEventListener('click', hideTransferModal);

transferShareModeButton.addEventListener('click', () => {
    transferShareUI.classList.remove('hidden');
    transferReceiveUI.classList.add('hidden');
    // Ensure focus jumps to the share select
    setTimeout(() => transferContentSelect.focus(), 0);
});

transferReceiveModeButton.addEventListener('click', () => {
    transferReceiveUI.classList.remove('hidden');
    transferShareUI.classList.add('hidden');
    transferCodeDisplay.classList.add('hidden'); // Hide code display when switching to receive
    if (transferInterval) clearInterval(transferInterval); // Stop polling if sharing was active
    // Ensure focus jumps to the input box
    setTimeout(() => transferCodeInput.focus(), 0);
});

transferGenerateCodeButton.addEventListener('click', initiateTransfer);
transferStartReceiveButton.addEventListener('click', receiveTransfer);


// Initial Setup
renderRecordingsList();
setupRecordingListeners();
renderCapturesList(); // Initialize captures list
setupCaptureListeners(); // Setup capture list listeners
renderGuide(); // Initial guide render (to populate the overlay structure)

// Load and apply all settings before anything else
const initialSettings = loadSettings();
applySettings(initialSettings);

// Check if HLS object is available globally as expected
if (typeof Hls === 'undefined') {
    console.error("Hls.js failed to load globally. Check index.html script tag.");
}

// Initial focus setup (optional, but good for immediate use)
setTimeout(() => {
    // Give focus to the active tab, which should allow arrow keys to immediately navigate to channel buttons
    const initialFocus = document.querySelector('.nav-button.active');
    if (initialFocus) {
        initialFocus.focus();
    }
}, 0);


// --- Generic Keyboard Navigation Helper ---

/**
 * Finds the next focusable element (native focusable or .focusable class) within a container
 * @param {HTMLElement} container The root element to search within (e.g., document.body or a specific view)
 * @param {string} direction 'up', 'down', 'left', or 'right'
 * @returns {HTMLElement | null} The next element to focus, or null if none found.
 */
function navigateGeneric(container, direction) {
    // Only search within the visible, active view or the player UI
    let focusables = getFocusableElementsInContainer(container).filter(el => {
        // Filter out hidden elements by checking offsetParent and display/visibility styles
        const style = window.getComputedStyle(el);
        return (el.offsetWidth > 0 || el.offsetHeight > 0) && style.visibility !== 'hidden' && style.display !== 'none';
    });
    
    // Sort focusables by their top/left position for predictable navigation
    focusables = focusables.map(el => {
        const rect = el.getBoundingClientRect();
        return { el, x: rect.left, y: rect.top };
    }).sort((a, b) => {
        // Sort primarily by Y (top) and secondarily by X (left)
        if (a.y !== b.y) return a.y - b.y;
        return a.x - b.x;
    }).map(item => item.el);

    if (focusables.length === 0) return null;

    const focused = document.activeElement;
    let currentIndex = focusables.indexOf(focused);

    // If nothing is focused, start from the beginning for UP/DOWN/LEFT/RIGHT
    if (currentIndex === -1) {
        // Fallback: If current focus is not in the list, start at the beginning
        return focusables[0];
    }
    
    // Simple linear navigation for L/R in a single row (like nav bars or player controls)
    const isHorizontalContainer = container.id === 'main-nav' || container.id === 'player-ui';

    if (isHorizontalContainer && (direction === 'left' || direction === 'right')) {
        let nextIndex;
        if (direction === 'right') {
            nextIndex = (currentIndex + 1) % focusables.length;
        } else { // left
            nextIndex = (currentIndex - 1 + focusables.length) % focusables.length;
        }
        return focusables[nextIndex];
    }
    
    // Complex UP/DOWN navigation (finding the nearest element vertically) and L/R in complex grid
    const currentRect = focused.getBoundingClientRect();
    let nearest = null;
    let shortestDistance = Infinity;
    
    for (let i = 0; i < focusables.length; i++) {
        const el = focusables[i];
        if (el === focused) continue;

        const rect = el.getBoundingClientRect();
        
        let isCandidate = false;
        
        // UP: Candidate must be above the current element
        if (direction === 'up' && rect.top < currentRect.top) {
            isCandidate = true;
        }
        // DOWN: Candidate must be below the current element
        else if (direction === 'down' && rect.top > currentRect.top) {
            isCandidate = true;
        }
        // LEFT: Candidate must be to the left of the current element (only check if not horizontal container)
        else if (!isHorizontalContainer && direction === 'left' && rect.left < currentRect.left) {
             isCandidate = true;
        }
        // RIGHT: Candidate must be to the right of the current element (only check if not horizontal container)
        else if (!isHorizontalContainer && direction === 'right' && rect.left > currentRect.left) {
             isCandidate = true;
        }
        
        if (isCandidate) {
            // Calculate a combined distance (Euclidean distance might be too complex for a grid, 
            // prioritizing vertical distance + small horizontal penalty works well)
            const dx = Math.abs(rect.left - currentRect.left);
            const dy = Math.abs(rect.top - currentRect.top);
            
            // Prioritize primary direction
            let distance;
            if (direction === 'up' || direction === 'down') {
                distance = dy + dx * 0.1; // Vertical priority
            } else { // left or right (grid navigation)
                distance = dx + dy * 0.1; // Horizontal priority
            }
            
            if (distance < shortestDistance) {
                shortestDistance = distance;
                nearest = el;
            }
        }
    }
    
    if (!nearest) {
        // If spatial navigation fails, fall back to linear navigation based on DOM sort order (especially for lists)
        if (direction === 'down' || direction === 'right') {
            nextIndex = currentIndex + 1;
            if (nextIndex < focusables.length) return focusables[nextIndex];
        } else if (direction === 'up' || direction === 'left') {
            nextIndex = currentIndex - 1;
            if (nextIndex >= 0) return focusables[nextIndex];
        }
        
        return null; 
    }
    
    return nearest;
}

// Function to update the recording status overlay content for processing state
function showProcessingUI(progress = 0) {
    const contentDiv = recordingStatusOverlay.querySelector('.recording-status-content');
    
    // Clear existing content and set new structure for progress
    contentDiv.innerHTML = `
        <span class="finalizing-text">Processing Recording...</span>
        <div id="finalizing-progress-percent">${Math.round(progress * 100)}%</div>
        <div class="finalizing-progress-bar">
            <div id="finalizing-progress-fill" class="finalizing-progress-bar-fill" style="width: ${progress * 100}%;"></div>
        </div>
    `;
    
    recordingStatusOverlay.classList.remove('hidden');
}

// Callback function used by Remotion Player to update progress
function updateProcessingProgress(overallProgress) {
    const percentElement = document.getElementById('finalizing-progress-percent');
    const fillElement = document.getElementById('finalizing-progress-fill');
    
    // We now receive the overall progress from 0.0 to 1.0 from processRecordedData or the Remotion wrapper
    const percentage = Math.round(overallProgress * 100);

    // Clamp the percentage display just in case of over-estimation
    const displayPercentage = Math.min(100, Math.max(0, percentage));

    
    // Check for null before attempting to set properties
    if (percentElement && fillElement) {
        percentElement.textContent = `${displayPercentage}%`;
        fillElement.style.width = `${displayPercentage}%`;
    }
}

// Function to restore the recording status overlay content to active recording state
function restoreActiveRecordingUI() {
    const contentDiv = recordingStatusOverlay.querySelector('.recording-status-content');
    
    // FIX: Calculate current time correctly for restoration
    let currentRecordingSeconds = 0;
    if (isRecording) {
        // Use the corrected formula for total elapsed time
        const currentElapsedMs = (Date.now() - recordingStartTime) + recordingDurationOffset;
        currentRecordingSeconds = Math.floor(currentElapsedMs / 1000);
    }
    
    // Rebuild the active recording UI structure
    contentDiv.innerHTML = `
        <div class="recording-indicator">
            <span class="red-dot"></span>
            <span class="status-text">${isRecordingPaused ? 'Paused' : 'Recording...'}</span>
        </div>
        <div id="recording-timestamp">${formatSecondsToHHMMSS(currentRecordingSeconds)}</div>
        <div class="recording-controls">
            <button id="ui-record-pause" class="focusable ${isRecordingPaused ? 'paused' : ''}">${isRecordingPaused ? 'Resume' : 'Pause'}</button>
            <button id="ui-record-stop" class="focusable">Stop</button>
        </div>
    `;
    
    // Reattach listeners to the new buttons
    const newPauseButton = contentDiv.querySelector('#ui-record-pause');
    const newStopButton = contentDiv.querySelector('#ui-record-stop');

    if (newPauseButton) newPauseButton.addEventListener('click', pauseResumeRecording);
    if (newStopButton) newStopButton.addEventListener('click', handleDedicatedStopClick);
    
    // Ensure recording controls are visible initially if recording is active
    if (isRecording) {
        newPauseButton.style.display = 'inline-block';
        newStopButton.style.display = 'inline-block';
    }
}

// Initial restoration of UI structure when app loads, in case it wasn't done before
// We call this right away to ensure the default structure is present for the first recording
restoreActiveRecordingUI();