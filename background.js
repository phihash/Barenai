const tabUrlMap = new Map();

chrome.tabs.onUpdated.addListener((tabId,changeInfo,tab) => {
  if(changeInfo.status === "complete" && tab.url){
  tabUrlMap.set(tabId,tab.url);
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url) {
    tabUrlMap.set(tabId, tab.url);
    console.log("記録:", tabId, tab.url,changeInfo.status);
  }
});


chrome.tabs.onRemoved.addListener((tabId) => {
  const closedUrl = tabUrlMap.get(tabId);
  if (!closedUrl) {
    console.log("URL見つからず:", tabId);
    return;
  }
  const hostname = new URL(closedUrl).hostname;
  console.log("→ hostname:", hostname);

  chrome.storage.local.get(["shadowDomains"],(result) => {
    let domains = result.shadowDomains || [];
    console.log("→ shadowDomains:", domains);
    console.log("→ 含まれてる？", domains.includes(hostname));
    if(domains.includes(hostname)){
      chrome.history.deleteUrl({url: closedUrl}, () => {
        console.log(`履歴から削除しました: ${closedUrl}`);
      });
    }
  });

  tabUrlMap.delete(tabId);
});
