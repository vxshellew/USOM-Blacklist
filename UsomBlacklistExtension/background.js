// Extension's starting function
chrome.webNavigation.onCompleted.addListener((details) => {
    const currentUrl = new URL(details.url);
    const domain = currentUrl.hostname;
    if (domain) {
        checkBlacklist(domain, details.tabId);
    }
}, {url: [{hostSuffix: '.'}]});

// Function to check domain against the blacklist and display a central warning
function checkBlacklist(domain, tabId) {
    fetch("https://www.usom.gov.tr/url-list.txt")
        .then(response => response.text())
        .then(data => {
            const lines = data.split('\n');
            if (lines.includes(domain)) {
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    func: displayWarningMessage
                });
            }
        })
        .catch(error => console.error("Failed to fetch data:", error));
}

// Function to create a highly visible warning message on the page
function displayWarningMessage() {
    const notification = document.createElement("div");
    notification.style.position = "fixed";
    notification.style.top = "50%";
    notification.style.left = "50%";
    notification.style.transform = "translate(-50%, -50%)";
    notification.style.backgroundColor = "#ffe6e6"; // Soft, gentle pink background
    notification.style.color = "#333";
    notification.style.padding = "40px";
    notification.style.borderRadius = "12px";
    notification.style.boxShadow = "0px 0px 25px rgba(0, 0, 0, 0.2)";
    notification.style.zIndex = "10000";
    notification.style.textAlign = "center";
    notification.style.width = "500px"; // Increased width for readability
    notification.style.fontFamily = "'Arial', sans-serif";

    // Warning content with distinct font sizes and spacing for readability
    notification.innerHTML = `
        <p style="font-size: 24px; font-weight: bold; color: #b22222; margin: 0; margin-bottom: 15px;">
            ⚠️ Dikkat: Güvensiz Site ⚠️
        </p>
        <p style="font-size: 18px; line-height: 1.6; color: #333; margin: 0;">
            Bu site, Devletin Ulusal Siber Olaylara Müdahale Merkezi (USOM) tarafından zararlı olarak işaretlenmiştir.
            Güvenliğiniz için bu siteyi kullanmaktan kaçının.
        </p>
        <button id="closeNotification" style="
            margin-top: 25px;
            padding: 12px 30px;
            font-size: 16px;
            font-weight: bold;
            color: #b22222;
            background-color: #ffffff;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: background-color 0.3s;
        ">Tamam</button>
    `;

    document.body.appendChild(notification);

    // Close button hover effect and click event
    const closeButton = document.getElementById("closeNotification");
    closeButton.onmouseover = () => closeButton.style.backgroundColor = "#f5f5f5";
    closeButton.onmouseout = () => closeButton.style.backgroundColor = "#ffffff";
    closeButton.onclick = () => notification.remove();
}




