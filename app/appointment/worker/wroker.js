

var grayscaleAlgo = require("../grayscale-algo");

onmessage = function (msg) {
    if (msg.data == "close") {
        close();
        return;
    }

    var data = msg.data;
    var bitmapSrc = data.src;
    var fileName = data.fileName;
    var appDir = data.appDir;

    var res = grayscaleAlgo.ToGrayscale(bitmapSrc, fileName, appDir, progressCallback);
    var jsStr = "" + res;
    postMessage({ res: res ? "success" : "fail", src: jsStr });
}

onerror = function (e) {
    // return true to not propagate to main
}

function progressCallback(value) {
    postMessage({ res: "progress", value: value });
}
