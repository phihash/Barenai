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
         showValidationMessage(`${currentTab.title}がリストに保存されました`);
        }else{
          showValidationMessage("すでにこのページはリストに保存されています");
        }
      });
    });
  });

  openListButton.addEventListener("click",() => {
    chrome.runtime.openOptionsPage();
  });
});

const showValidationMessage = (text) => {
  const msg = document.getElementById("validationMessage");
  msg.textContent = text;
  msg.classList.add("show");

  // 一定時間後に非表示に
  setTimeout(() => {
    msg.classList.remove("show");
    msg.textContent = "";
  }, 2500);
};

const extractRootDomain = (url) => {
  try {
    const hostname = new URL(url).hostname;
    const parsed = window.psl.parse(hostname);
    return parsed.domain;
  } catch (e) {
    console.error("無効なURLです:", e);
    return null;
  }
};


const handleAdd = () => {
  const domainInput = document.getElementById("domainInput");
  const text = extractRootDomain(domainInput.value.trim());
    if(!text){
      domainInput.value = "";
      showValidationMessage("有効なURLを入力してください");
      return;
    }
  chrome.storage.local.get(["shadowDomains"],(results) => {
    let domains = results.shadowDomains || [];
    if(domains.includes(text)){
      domainInput.value = "";
      showValidationMessage("すでにドメインリストに保存されています");
      return;
    }else{
      domains.push(text);
      chrome.storage.local.set({shadowDomains: domains }, () => {
        showValidationMessage(`${text}がドメインリストに保存されました`);
      });
    }
  domainInput.value = "";
  })
}

