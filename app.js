// 既存の投稿を表示する関数
function displayPosts() {
  const postsDiv = document.getElementById('posts');
  postsDiv.innerHTML = '';

  const posts = JSON.parse(localStorage.getItem('posts')) || [];
  posts.slice().reverse().forEach((post, index) => {
    const postDiv = document.createElement('div');
    postDiv.classList.add('post');

    const postContent = document.createElement('p');
    postContent.innerHTML = `${post.timestamp}: ${convertToLink(post.content)}`;
    postDiv.appendChild(postContent);

    // 三点リーダーボタン
    const menuButton = document.createElement('button');
    menuButton.textContent = '⋮';
    menuButton.classList.add('menu-button');

    // ドロップダウンメニュー
    const menuContainer = document.createElement('div');
    menuContainer.classList.add('menu-container');

    // 編集と削除のオプション
    const editOption = document.createElement('button');
    editOption.textContent = 'Edit';
    editOption.addEventListener('click', () => enableEdit(posts.length - 1 - index));
    menuContainer.appendChild(editOption);

    const deleteOption = document.createElement('button');
    deleteOption.textContent = 'Delete';
    deleteOption.addEventListener('click', () => deletePost(posts.length - 1 - index));
    menuContainer.appendChild(deleteOption);

    // 三点リーダーボタンをクリックしてメニューを表示/非表示
    menuButton.addEventListener('click', (e) => {
      e.stopPropagation(); // クリックイベントが他に伝播しないようにする
      menuContainer.style.display = menuContainer.style.display === 'none' ? 'block' : 'none';
    });

    // 他の場所をクリックしたらメニューを閉じる
    document.addEventListener('click', (e) => {
      if (!postDiv.contains(e.target)) {
        menuContainer.style.display = 'none';
      }
    });

    postDiv.appendChild(menuButton);
    postDiv.appendChild(menuContainer);
    postsDiv.appendChild(postDiv);
  });
}

// URLをリンクに変換する関数
function convertToLink(content) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return content.replace(urlRegex, (url) => `<a href="${url}" target="_blank">${url}</a>`);
}

// フォーム送信時の処理
document.getElementById('postForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const content = document.getElementById('content').value;
  const timestamp = new Date().toLocaleString();

  const newPost = { content, timestamp, editing: false };

  const posts = JSON.parse(localStorage.getItem('posts')) || [];
  posts.push(newPost);

  localStorage.setItem('posts', JSON.stringify(posts));

  document.getElementById('content').value = '';
  displayPosts();
});

// 編集モードを有効にする関数
function enableEdit(index) {
  const posts = JSON.parse(localStorage.getItem('posts')) || [];
  posts[index].editing = true;
  localStorage.setItem('posts', JSON.stringify(posts));
  displayPosts();
}

// 投稿を削除する関数
function deletePost(index) {
  const posts = JSON.parse(localStorage.getItem('posts')) || [];
  posts.splice(index, 1); // 指定の投稿を削除
  localStorage.setItem('posts', JSON.stringify(posts));
  displayPosts();
}

// 初回ロード時に投稿を表示
displayPosts();
