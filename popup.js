document.addEventListener("DOMContentLoaded", function () {
  // 自动生成当前页面的二维码
  generatePageQR();
  // document.getElementById('generateSelectionQR').addEventListener('click', generateSelectionQR);
});

function generatePageQR() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    console.log("tabs", tabs);
    generateQRCode(tabs[0].url);
  });
}

function generateSelectionQR() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: "getSelection" },
      function (response) {
        if (response && response.selection) {
          generateQRCode(response.selection);
        } else {
          alert("No text selected. Please select some text on the page.");
        }
      }
    );
  });
}

function generateQRCode(data) {
  var qr = qrcode(0, "M");
  qr.addData(data);
  qr.make();
  document.getElementById("qrcode").innerHTML = qr.createImgTag(5);

  // var qrcode = new QRCode(document.getElementById("qrcode"), {
  //   text: data,
  //    width: 128,
  // height: 128,
  //   colorDark : "#000000",
  //   colorLight : "#ffffff",
  //   correctLevel : QRCode.CorrectLevel.H
  // });
}
