document.addEventListener("DOMContentLoaded",  () => {

  const savedDomains = document.getElementById("savedDomains");
  const domainInput = document.getElementById("domainInput");
  const addDomainButton = document.getElementById("addDomainButton");

  chrome.storage.local.get(["shadowDomains"],(results) => {
    const domains = results.shadowDomains || [];
    if(domains.length === 0){
      savedDomains.innerHTML = "<p>保存されたドメインはありません</p>";
      return;
    }
    domains.forEach((domain) => {
      const p = document.createElement("p");
      p.textContent = domain;
      savedDomains.appendChild(p);
    });
  });

  addDomainButton.addEventListener("click",() => {
    chrome.storage.local.get(["shadowDomains"],(results) => {
      let domains = results.shadowDomains || [];
      const domainInputText = domainInput.value;
      domainInput.value = "";
      if(domains.includes(domainInputText)){
        alert("このドメインはすでに保存されています");
        return;
      }else{
        domains.push(domainInputText);
        chrome.storage.local.set({shadowDomains: domains }, () => {
          console.log("shadowDomainsが保存されました");
        });
      }
    })
  });

});

const renderDomains = () => {

};
