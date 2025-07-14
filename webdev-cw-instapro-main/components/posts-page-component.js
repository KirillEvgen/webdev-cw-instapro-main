import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, user } from "../index.js";
import { likePost, dislikePost } from "../api.js";
import { formatDistanceToNow } from "https://cdn.jsdelivr.net/npm/date-fns@2.29.3/+esm";

export function renderPostsPageComponent({ appEl, userInfo, isUserPostsPage }) {


  const userHeaderHtml =
    isUserPostsPage && userInfo
      ? `
    <div class="posts-user-header">
      <img src="${userInfo.imageUrl}" class="posts-user-header__user-image">
      <p class="posts-user-header__user-name">${userInfo.name}</p>
    </div>
  `
      : "";

  const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      ${userHeaderHtml}
      <ul class="posts">
        ${posts
          .map(
            (post) => `
              <li class="post">
                <div class="post-header" data-user-id="${post.user.id}">
                  <img src="${post.user.imageUrl}" class="post-header__user-image">
                  <p class="post-header__user-name">${post.user.name}</p>
                </div>
                <div class="post-image-container">
                  <img class="post-image" src="${post.imageUrl}">
                </div>
                <div class="post-likes">
                  <button data-post-id="${post.id}" class="like-button">
                    <img src="./assets/images/like-${post.isLiked ? "active" : "not-active"}.svg">
                  </button>
                  <p class="post-likes-text">
                    Нравится: <strong>${post.likes.length}</strong>
                  </p>
                </div>
                <p class="post-text">
                  <span class="user-name">${post.user.name}</span>
                  ${post.description}
                </p>
                <p class="post-date">
                  ${formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </p>
              </li>
            `
          )
          .join("")}
      </ul>
    </div>`;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }

  for (let likeBtn of document.querySelectorAll(".like-button")) {
    likeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const postId = likeBtn.dataset.postId;
      const post = posts.find((p) => p.id === postId);
      if (!user) {
        alert("Только авторизованные пользователи могут ставить лайки");
        return;
      }
      const token = `Bearer ${user.token}`;
      const action = post.isLiked ? dislikePost : likePost;
      action({ postId, token })
        .then(() => {
          goToPage("POSTS_PAGE");
        })
        .catch((err) => {
          alert(err.message);
        });
    });
  }
}
