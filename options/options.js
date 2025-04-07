document.addEventListener("DOMContentLoaded",() => {
  renderBookmarks();
});

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
        const li = createBookmarkUI(bookmark, handleDelete);
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

const handleDelete = (url) => {
  chrome.storage.local.get(["shadowBookmarks"], (results) => {
    let shadowBookmarks = results.shadowBookmarks || [];
    shadowBookmarks = shadowBookmarks.filter((b) => b.url !== url);
    chrome.storage.local.set({ shadowBookmarks }, () => {
      renderBookmarks();
    });
  });
}
