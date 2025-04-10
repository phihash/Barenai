document.addEventListener("DOMContentLoaded",() => {
  const toggleButton = document.getElementById("toggleButton");
  const showUrls = document.querySelector(".show-urls");
  const showDomains = document.querySelector(".show-domains");
  const savedAllUrlButton = document.getElementById("savedAllUrlButton");
  const deleteAllDomainButton = document.getElementById("deleteAllDomainButton");

  toggleButton.addEventListener("click",() => {
    if(showUrls.classList.contains("is-hidden")){
      showUrls.classList.remove("is-hidden");
      showDomains.classList.add("is-hidden");
      savedAllUrlButton.className = "saved-all-url-button";
      deleteAllDomainButton.className = "is-hidden";
      toggleButton.textContent = "ドメインの表示";

    }else if(showDomains.classList.contains("is-hidden")){
      showDomains.classList.remove("is-hidden");
      showUrls.classList.add("is-hidden");
      savedAllUrlButton.className = "is-hidden";
      deleteAllDomainButton.className = "delete-all-domain-button";
      toggleButton.textContent = "URLの表示";
    }
  });
  renderBookmarks();
  renderDomains();
});

const renderDomains = () => {
  const savedDomains = document.getElementById("savedDomains");
  savedDomains.innerHTML = ""; // 一旦クリア
  chrome.storage.local.get(["shadowDomains"],(results) => {
    let domains = results.shadowDomains || [];
    if(domains.length === 0){
      savedDomains.innerHTML = "<p>保存されたドメインはありません</p>";
      return;
    }
    domains.forEach((domain) => {
      const div = createDomainUI(domain , handleDeleteDomain );
      savedDomains.appendChild(div);
    });
  });
};

const renderBookmarks = () => {
  const savedUrls = document.getElementById("savedUrls");
  savedUrls.innerHTML = ""; // 一旦クリア

  chrome.storage.local.get(["shadowBookmarks"],(results) => {
    let shadowBookmarks = results.shadowBookmarks || [];
    if(shadowBookmarks.length === 0){
      savedUrls.innerHTML = "<p>保存されたURLはありません</p>";
      return;
    }
      const ul = document.createElement("ul");
      shadowBookmarks.forEach((bookmark) => {
        const li = createBookmarkUI(bookmark, handleDeleteUrl);
        ul.appendChild(li);
      });
      savedUrls.appendChild(ul);
  });
}

const createBookmarkUI = (bookmark,onDelete) => {
   const { url,title } = bookmark;
   const li = document.createElement("li");
   const a = document.createElement("a");
   const deleteButton = document.createElement("button");
   deleteButton.className = "button";
   li.className = "list-item";
   a.className = "text";
   a.href = url;
   a.target = "_blank";
   a.textContent = title;
   deleteButton.textContent = "削除";

   deleteButton.addEventListener("click",() => {
    const confirmed = confirm("このURLを削除しますか");
    if(confirmed){
      onDelete(url);
    }
   });

   li.appendChild(a);
   li.appendChild(deleteButton);
   return li;
};

const handleDeleteUrl = (url) => {
  chrome.storage.local.get(["shadowBookmarks"], (results) => {
    let shadowBookmarks = results.shadowBookmarks || [];
    shadowBookmarks = shadowBookmarks.filter((b) => b.url !== url);
    chrome.storage.local.set({ shadowBookmarks }, () => {
      renderBookmarks();
    });
  });
}

const handleDeleteDomain = (domain) => {
  chrome.storage.local.get(["shadowDomains"], (results) => {
    let domains = results.shadowDomains || [];
    domains = domains.filter((d) => d !== domain);
    chrome.storage.local.set({ shadowDomains: domains }, () => {
      renderDomains();
    });
  });
}

const createDomainUI = (domain, onDelete) => {
  const p = document.createElement("p");
  const div = document.createElement("div");
  p.className = "text";
  div.className = "domain-item";
  const deleteButton = document.createElement("button");
  deleteButton.className = "button";
  deleteButton.textContent = "削除";
  deleteButton.addEventListener("click",() => {
    const confirmed = confirm("このURLを削除しますか");
    if(confirmed){
      onDelete(domain);
    }
  });
  p.textContent = domain;
  p.appendChild(deleteButton);
  div.appendChild(p);
  return div;
};

