import { renderUploadImageComponent } from "./upload-image-component.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  let imageUrl = "";
  let description = "";

  const render = () => {
    const appHtml = `
      <div class="page-container">
        <div class="header-container"></div>
        <h3>Добавить пост</h3>
        <div class="form">
          <div class="upload-image-container"></div>
          <textarea id="description-input" class="input" placeholder="Описание поста" rows="3"></textarea>
          <div class="form-error" style="color: red; margin: 8px 0;"></div>
          <button class="button" id="add-button">Добавить</button>
        </div>
      </div>
    `;

    appEl.innerHTML = appHtml;

    const uploadImageContainer = appEl.querySelector(".upload-image-container");
    renderUploadImageComponent({
      element: uploadImageContainer,
      onImageUrlChange(newImageUrl) {
        imageUrl = newImageUrl;
      },
    });

    const descriptionInput = appEl.querySelector("#description-input");
    descriptionInput.addEventListener("input", (e) => {
      description = e.target.value;
    });

    document.getElementById("add-button").addEventListener("click", () => {
      const errorEl = appEl.querySelector(".form-error");
      errorEl.textContent = "";
      if (!imageUrl) {
        errorEl.textContent = "Пожалуйста, загрузите изображение.";
        return;
      }
      if (!descriptionInput.value.trim()) {
        errorEl.textContent = "Пожалуйста, введите описание.";
        return;
      }
      onAddPostClick({
        description: descriptionInput.value.trim(),
        imageUrl,
      });
    });
  };

  render();
}
