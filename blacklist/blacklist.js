document.addEventListener("DOMContentLoaded",  () => {
  renderDomains();
});

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
      const div = createDomainUI(domain , handleDelete );
      savedDomains.appendChild(div);
    });
  });
};

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

