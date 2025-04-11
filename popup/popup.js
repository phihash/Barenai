const extractRootDomain = (url) => {
  try {
    const hostname = new URL(url).hostname;
    const parsed = window.psl.parse(hostname); // ←ここが重要
    return parsed.domain;
  } catch (e) {
    console.error("無効なURLです:", e);
    return null;
  }
};

document.addEventListener("DOMContentLoaded",() => {
  const saveButton = document.getElementById("saveButton");
  const openListButton = document.getElementById("openListButton");
  const addDomainButton = document.getElementById("addDomainButton");
  addDomainButton.addEventListener("click",handleAdd);

  saveButton.addEventListener("click",() => {
    chrome.tabs.query({active:true,currentWindow:true},(tabs) => {
      const currentTab = tabs[0]; //tab全体の情報
      if(!currentTab) return;
      chrome.storage.local.get(["shadowBookmarks"],(results) => {
        let shadowBookmarks = results.shadowBookmarks || [];

        const isAlreadySaved = shadowBookmarks.some((bookmark) => {
           return bookmark.url === currentTab.url;
        });
        if(!isAlreadySaved){
         shadowBookmarks.push({url:currentTab.url,title:currentTab.title});
         chrome.storage.local.set({shadowBookmarks});
        }else{
          alert("すでにこのタブの情報は保存されています");
        }
      });
    });
  });

  openListButton.addEventListener("click",() => {
    chrome.runtime.openOptionsPage();
  });
});

const handleAdd = () => {
  const domainInput = document.getElementById("domainInput");
  const text = extractRootDomain(domainInput.value.trim());
    if(!text){
      alert("URLを入力してください");
      return;
    }
  chrome.storage.local.get(["shadowDomains"],(results) => {
    let domains = results.shadowDomains || [];

    if(domains.includes(text)){
      alert("このドメインはすでに保存されています");
      domainInput.value = "";
      return;
    }else{
      domains.push(text);
      chrome.storage.local.set({shadowDomains: domains }, () => {
        console.log(`${text}が保存されました`);
      });
    }
  domainInput.value = "";
  })
}

