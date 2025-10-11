// WebOS Subtitle Configuration
// Media ID: _mwi

// Enable/disable subtitles
webOS.service.request("luna://com.webos.media", {
    method: "setSubtitleEnable",
    parameters: { 
        "mediaId": "_mwi",
        "enable": true
    },
    onSuccess: function (result) {
        console.log(JSON.stringify(result));
    },
    onFailure: function (result) {
        console.log("[fail][" + result.errorCode + "] " + result.errorText);
    }
});

// Set font size
webOS.service.request("luna://com.webos.media", {
    method: "setSubtitleFontSize",
    parameters: { 
        "mediaId": "_mwi",
        "fontSize": 2
    },
    onSuccess: function (result) {
        console.log("Font size set successfully");
    },
    onFailure: function (result) {
        console.log("[fail][" + result.errorCode + "] " + result.errorText);
    }
});

// Set color
webOS.service.request("luna://com.webos.media", {
    method: "setSubtitleColor",
    parameters: { 
        "mediaId": "_mwi",
        "color": 2
    },
    onSuccess: function (result) {
        console.log("Color set successfully");
    },
    onFailure: function (result) {
        console.log("[fail][" + result.errorCode + "] " + result.errorText);
    }
});

// Set position
webOS.service.request("luna://com.webos.media", {
    method: "setSubtitlePosition",
    parameters: { 
        "mediaId": "_mwi",
        "position": 0
    },
    onSuccess: function (result) {
        console.log("Position set successfully");
    },
    onFailure: function (result) {
        console.log("[fail][" + result.errorCode + "] " + result.errorText);
    }
});

// Set character opacity
webOS.service.request("luna://com.webos.media", {
    method: "setSubtitleCharacterOpacity",
    parameters: { 
        "mediaId": "_mwi",
        "charOpacity": 255
    },
    onSuccess: function (result) {
        console.log("Character opacity set successfully");
    },
    onFailure: function (result) {
        console.log("[fail][" + result.errorCode + "] " + result.errorText);
    }
});

// Set background opacity
webOS.service.request("luna://com.webos.media", {
    method: "setSubtitleBackgroundOpacity",
    parameters: { 
        "mediaId": "_mwi",
        "bgOpacity": 0
    },
    onSuccess: function (result) {
        console.log("Background opacity set successfully");
    },
    onFailure: function (result) {
        console.log("[fail][" + result.errorCode + "] " + result.errorText);
    }
});
