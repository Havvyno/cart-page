let products = [
  { id: 1, title: "Ноутбук", price: 79830, img: "/images/laptop.jpg" },
  { id: 2, title: "Монитор", price: 8800, img: "/images/monitor.jpg" },
  { id: 3, title: "Консоль", price: 54595, img: "/images/console.jpg" },
];

const toHtml = (products) => `
    <div class="col">
    <div class="card">
        <img class="card-img-top" style="height: 300px; width: 300px;" src="${products.img}" alt="${products.title}">
        <div class="card-body">
            <h5 class="card-title" >${products.title}</h5>
            <a href="#" class="btn btn-primary" data-btn="price" data-id="${products.id}">Цена</a>
            <a href="#" class="btn btn-danger" data-btn="remove" data-id="${products.id}">Удалить</a>
        </div>
    </div>
    </div>
`;

function render() {
  const html = products.map(toHtml).join("");
  document.querySelector("#product").innerHTML = html;
}

render();

const priceModal = $.modal({
  title: "Цена продукта",
  cloable: true,
  width: "400px",
  footerButtons: [
    {
      text: "Закрыть",
      type: "primary",
      handler() {
        priceModal.close();
      },
    },
  ],
});

document.addEventListener("click", (event) => {
  event.preventDefault();
  const btnType = event.target.dataset.btn;
  const id = +event.target.dataset.id;
  const product = products.find((p) => p.id === id);

  if (btnType === "price") {
    priceModal.setContent(`
            <p>Цена на ${product.title}: <strong>${product.price}₽</strong> </p>
        `);
    priceModal.open();
  } else if (btnType === "remove") {
    $.confirm({
      title: "Уверены ли вы?",
      content: `<p>Вы удаляете <strong>${product.title}</strong> </p>`,
    })
      .then(() => {
        products = products.filter((p) => p.id !== id);
        render();
      })
      .catch(() => {
        // console.log('закрыть')
      });
  }
});
