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
document.getElementById('upload-button').addEventListener('click', () => {
  document.getElementById('file-input').click();
});

document.getElementById('file-input').addEventListener('change', handleFileSelect);

function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
          const img = new Image();
          img.src = e.target.result;
          img.onload = () => {
              decodeQRCode(img);
          };
      };
      reader.readAsDataURL(file);
  }
}


function decodeQRCode(image) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = image.width;
  canvas.height = image.height;
  context.drawImage(image, 0, 0);

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const code = jsQR(imageData.data, canvas.width, canvas.height);

  if (code) {
      document.getElementById('decoded-text').textContent = `识别的二维码信息: ${code.data}`;
  } else {
      document.getElementById('decoded-text').textContent = '未识别到二维码';
  }
}