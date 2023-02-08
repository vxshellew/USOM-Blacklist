// extension'ın başlangıç fonksiyonu
chrome.webNavigation.onCompleted.addListener(function(details) {
    var currentUrl = new URL(details.url);
    var domain = currentUrl.hostname;
	if (domain)
		checkBlacklist(domain);
}, {url: [{hostSuffix: '.'}]});

// domain listesini okuma fonksiyonu
function checkBlacklist(domain) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://www.usom.gov.tr/url-list.txt", true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var lines = xhr.responseText.split('\n');
            for (var i = 0; i < lines.length; i++) {
                if (domain === lines[i]) {
                    alert("Bu Domain Ulusal Siber Olaylara Müdahale Merkezi (USOM) Zararlı Bağlantılar Listesinde yer Almaktadır!");
                    break;
                }
            }
        }
    };
    xhr.send();
}
