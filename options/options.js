document.addEventListener("DOMContentLoaded",() => {
  const savedUrls = document.getElementById("savedUrls");
  chrome.storage.local.get(["shadowBookmarks"],(results) => {
    const shadowBookmarks = results.shadowBookmarks || [];
    if(shadowBookmarks.length === 0){
      savedUrls.innerHTML = "<p>保存されたURLはありません</p>";
      return;
    }else{
      shadowBookmarks.forEach((bookmark) => {
        const url = bookmark.url;
        const title = bookmark.title;
        const ul = document.createElement("ul");
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
        a.textContent = title;
        li.appendChild(a);
        ul.appendChild(li);
        savedUrls.appendChild(ul);
      })
    }
  });
});
