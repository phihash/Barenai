document.addEventListener("DOMContentLoaded",() => {
  const saveButton = document.getElementById("saveButton");
  const openListButton = document.getElementById("openListButton");
  const openBlackListButton = document.getElementById("openBlackListButton");
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

  openBlackListButton.addEventListener("click",() => {
    window.open("../blacklist/blacklist.html");
  });

});

const handleAdd = () => {
  const domainInput = document.getElementById("domainInput");
  const text = domainInput.value.trim();
  chrome.storage.local.get(["shadowDomains"],(results) => {
    let domains = results.shadowDomains || [];
    if(text === ""){
      alert("ドメインを入力してください");
      return;
    }
    if(domains.includes(text)){
      alert("このドメインはすでに保存されています");
      return;
    }else{
      domains.push(text);
      chrome.storage.local.set({shadowDomains: domains }, () => {
        console.log("shadowDomainsが保存されました");
      });
    }
  domainInput.value = "";
  })
}

