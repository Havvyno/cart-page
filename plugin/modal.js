Element.prototype.appendAfter = function (element) {
  element.parentNode.insertBefore(this, element.nextSibling);
};

function noop() {}

function _createFooter(buttons = []) {
  if (buttons.length === 0) {
    return document.createElement("div");
  }

  const wrap = document.createElement("div");
  wrap.classList.add("modal-footer");

  buttons.forEach((btn) => {
    const $btn = document.createElement("button");
    $btn.textContent = btn.text;
    $btn.classList.add("btn");
    $btn.classList.add(`btn-${btn.type || "secondary"}`);
    $btn.onclick = btn.handler || noop;

    wrap.appendChild($btn);
  });

  return wrap;
}

function _createModal(options) {
  const DEFAUTL_WIDTH = "600px";
  const modal = document.createElement("div");
  modal.classList.add("vmodal");
  modal.insertAdjacentHTML(
    "afterbegin",
    `
    <div class="modal-overlay" data-close="true">
        <div class="modal-window" style=""width: ${
          options.width || DEFAUTL_WIDTH
        }>
            <div class="modal-header">
                <span class="modal-title">${options.title || "Window"}</span>
                ${
                  options.closable
                    ? `<span class="modal-close" data-close="true">&times;</span>`
                    : ""
                }
            </div>
            <div class="modal-body" data-content>
                ${options.content || ""}
            </div>
        </div>
    </div>
    `
  );

  const footer = _createFooter(options.footerButtons);
  footer.appendAfter(modal.querySelector("[data-content]"));

  document.body.appendChild(modal);

  return modal;
}

$.modal = function (options) {
  const ANIMATION = 200;
  const $modal = _createModal(options);
  let close = false;
  let destroy = false;

  const modal = {
    open() {
      if (destroy) {
        return console.log("модальное окно уничтожено");
      }
      !close && $modal.classList.add("open");
    },
    close() {
      close = true;
      $modal.classList.remove("open");
      $modal.classList.add("hide");
      setTimeout(() => {
        $modal.classList.remove("hide");
        close = false;
        if (typeof options.onClose === "function") {
          options.onClose();
        }
      }, ANIMATION);
    },
  };

  const listener = (event) => {
    if (event.target.dataset.close) {
      modal.close();
    }
  };

  $modal.addEventListener("click", listener);

  return Object.assign(modal, {
    destroy() {
      $modal.parentNode.removeChild($modal);
      $modal.removeEventListener("click", listener);
      destroy = true;
    },
    setContent(html) {
      $modal.querySelector("[data-content]").innerHTML = html;
    },
  });
};
