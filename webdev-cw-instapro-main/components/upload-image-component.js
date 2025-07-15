import { uploadImage } from "../api.js";

export function renderUploadImageComponent({ element, onImageUrlChange }) {
  let imageUrl = "";

  const render = () => {
    element.innerHTML = `
      <div class="upload-image">
        ${
          imageUrl
            ? `
            <div class="file-upload-image-container">
              <img class="file-upload-image" src="${imageUrl}" alt="Загруженное изображение">
              <button class="file-upload-remove-button button">Заменить фото</button>
            </div>
            `
            : `
            <label class="file-upload-label secondary-button">
              <input
                type="file"
                class="file-upload-input"
                style="display:none"
              />
              Выберите фото
            </label>
          `
        }
      </div>
    `;

    const fileInputElement = element.querySelector(".file-upload-input");
    fileInputElement?.addEventListener("change", () => {
      const file = fileInputElement.files[0];
      if (!file) return;

      const labelEl = document.querySelector(".file-upload-label");
      labelEl.setAttribute("disabled", true);
      labelEl.textContent = "Загружаю файл...";

      uploadImage({ file }).then((result) => {
        console.log("UPLOAD RESULT:", result);
        imageUrl = result.fileUrl;

        if (
          !imageUrl.startsWith("https://webdev-hw-api.vercel.app/media/") &&
          !imageUrl.startsWith("https://storage.yandexcloud.net/")
        ) {
          alert(
        
          );
          return;
        }

        onImageUrlChange(imageUrl);
        render();
      });
    });

    element
      .querySelector(".file-upload-remove-button")
      ?.addEventListener("click", () => {
        imageUrl = "";
        onImageUrlChange("");
        render();
      });
  };

  render();
}
