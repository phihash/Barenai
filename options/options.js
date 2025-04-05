document.addEventListener("DOMContentLoaded",() => {
  const savedUrls = document.getElementById("savedUrls");
  chrome.storage.local.get(["shadowBookmarks"],(results) => {
    let shadowBookmarks = results.shadowBookmarks || [];
    if(shadowBookmarks.length === 0){
      savedUrls.innerHTML = "<p>保存されたURLはありません</p>";
      return;
    }else{
      const ul = document.createElement("ul");
      shadowBookmarks.forEach((bookmark) => {
        const url = bookmark.url;
        const title = bookmark.title;
        const li = document.createElement("li");
        const a = document.createElement("a");
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "削除";
        deleteButton.addEventListener("click",() => {
          const confirmed = confirm("このURLを削除しますか");
          if(confirmed){
            chrome.storage.local.get(["shadowBookmarks"],(results) => {
              let shadowBookmarks = results.shadowBookmarks || [];
              shadowBookmarks = shadowBookmarks.filter((bookmark) => {
                return bookmark.url !== url;
              });
              chrome.storage.local.set({shadowBookmarks},() => {
                alert("削除しました");
                savedUrls.removeChild(li);
              });
            });
          }
        });
        a.href = url;
        a.target = "_blank";
        a.textContent = title;
        li.appendChild(a);
        li.appendChild(deleteButton);
        ul.appendChild(li);
      });
      savedUrls.appendChild(ul);
    }
  });
});
