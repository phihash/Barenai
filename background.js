const tabUrlMap = new Map();

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url) {
    tabUrlMap.set(tabId, tab.url);
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  const closedUrl = tabUrlMap.get(tabId);
  if (!closedUrl) {
    return;
  }
  const hostname = new URL(closedUrl).hostname;
  const normalized = new URL(closedUrl);
  normalized.hash = ""; // ハッシュ削除

  chrome.storage.local.get(["shadowDomains"],(result) => {
    let domains = result.shadowDomains || [];
    if(shouldDeleteHistory(hostname, domains)){
      chrome.history.deleteUrl({url: normalized.href}, () => {
        console.log(`✅ 履歴から削除しました: ${normalized.href}`);
      });
    }
  });

  tabUrlMap.delete(tabId);
});

const shouldDeleteHistory = (hostname, domains) => {
  return domains.some(domain => hostname.endsWith(domain));
}
