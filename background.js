chrome.history.onVisited.addListener((historyItem) => {
  try{
   const url = new URL(historyItem.url);
   const hostname = url.hostname;
   chrome.storage.local.get(["shadowDomains"],(result) => {
     const domains = result.shadowDomains || [];
     if(shouldDeleteHistory(hostname,domains)){
       chrome.history.deleteUrl({url:historyItem.url},() => {
         console.log(`履歴削除: ${historyItem.url}しました。`);
       })
     }
   });
  }catch(e){
     console.error("エラー", e);
  }
 })

const shouldDeleteHistory = (hostname, domains) => {
  return domains.some(domain => hostname.endsWith(domain));
}
