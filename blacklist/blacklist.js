document.addEventListener("DOMContentLoaded",  () => {
  renderDomains();
  const addDomainButton = document.getElementById("addDomainButton");
  addDomainButton.addEventListener("click",handleAdd);
});

const handleAdd = () => {
  const text = document.getElementById("domainInput").value.trim();
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
  text.value = "";
  renderDomains();
  })
}


const handleDelete = (domain) => {
  chrome.storage.local.get(["shadowDomains"], (results) => {
    let domains = results.shadowDomains || [];
    domains = domains.filter((d) => d !== domain);
    chrome.storage.local.set({ shadowDomains: domains }, () => {
      renderDomains();
    });
  });
}

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
      const p = createDomainUI(domain , handleDelete );
      savedDomains.appendChild(p);
    });
  });
};

const createDomainUI = (domain, onDelete) => {
  const p = document.createElement("p");
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "削除";
  deleteButton.addEventListener("click",() => {
    const confirmed = confirm("このURLを削除しますか");
    if(confirmed){
      onDelete(domain);
    }
  });
  p.textContent = domain;
  p.appendChild(deleteButton);
  return p;
};

