// VARIABLES DE CARRITO
const productoDOM = document.querySelector(".productosContenedor");
const carritoDOM = document.querySelector(".carrito");
const carritoCenter = document.querySelector(".carrito__center");
const openCarrito = document.querySelector(".carritoIcono");
const closeCarrito = document.querySelector(".close__carrito");
const overlay = document.querySelector(".carrito__overlay");
const carritoTotal = document.querySelector(".carrito__total");
const clearCarritoBtn = document.querySelector(".clear__carrito");
const itemTotales = document.querySelector(".totalCarrito");
const detalles = document.getElementById("detalles");

// ARRAY CARRITO Y ARRAY BUTTON????
let carrito = [];
let buttonDOM = [];

// FILTRO DE PRODUCTOS (SOLO APARECE EL BOTON DE CARRITO??)
class UI {
  detalleProducto(id) {
    const filtroDato = productos.filter((item) => item.id == id);
    let result = "";
    filtroDato.forEach((producto) => {
      result += `
			  <article class="detalle-grid">
				  <img src=${producto.image} alt="${producto.title}" class="img-fluid">
				  <div class="detalles-content">
					  <h3>${producto.title}</h3>
						  <p class="price"><b>Precio: </b> $${producto.price}</p>
						  <p class="description">
							  <b>Descripcion: </b> <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta quae ad ex sint expedita perspiciatis odit eligendi! Et quia ex aperiam dolorum sunt omnis maiores. Repudiandae delectus iste exercitationem vel?</span>
						  </p>
						  <p class="description">
							  <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque voluptates consequuntur in assumenda odit hic, aut cupiditate dolorem aspernatur! Quibusdam iusto magnam vero maxime quisquam voluptatibus minima aliquam molestias, iure ratione commodi, reiciendis quasi.</span>
						  </p>
						  <div class="bottom">
								  <button class="btn addToCart" data-id=${producto.id}>Añadir Carrito</button>
						  </div>
				  </div>
			  </article>
			  `;
    });
    detalles.innerHTML = result;
  }

  // RENDER O MOSTRAR PRODUCTOS (SI!!BORRE LAS ESTRELLAS)
  mostrarProductos(productos) {
    let result = "";
    productos.forEach((producto) => {
      result += `
			  <div class="producto">
			  <div class="productoImagen">
			  <img src=${producto.image} alt="">
		  </div>
			<div class="productoInfo">
			  <h1>${producto.title}</h1>
			  <div class="price">$${producto.price}</div>
			</div>
			<div class="bottom">
				<button class="btn addToCart" data-id=${producto.id}>Añadir carrito</button>

			</div>
		  </div>
				  `;
    });
    productoDOM.innerHTML = result;
  }

  // BOTON DE AGREGAR AL CARRITO
  getButtons() {
    const buttons = [...document.querySelectorAll(".addToCart")];
    buttonDOM = buttons;
    buttons.forEach((button) => {
      const id = button.dataset.id;
      const inCart = carrito.find((item) => item.id === parseInt(id, 10));

      if (inCart) {
        button.innerHTML = "En el carrito";
        button.disabled = true;
      }
      button.addEventListener("click", (e) => {
        e.preventDefault();
        e.target.innerHTML = "En el carrito";
        e.target.disabled = true;

        // GET productos al carrito
        const carritoItem = { ...Storage.getProductos(id), cantidad: 1 };

        //agregamos el producto al carrito
        carrito = [...carrito, carritoItem];

        //Guardamos el carrito al localstorage
        Storage.saveCart(carrito);

        //Set cart values
        this.setItemValues(carrito);
        this.addCarritoItem(carritoItem);
        //Show al carrito
      });
    });
  }

  // VISTA DEL CARRITO SUBIR O BAJAR CANTIDAD Y ALGO MAS...
  setItemValues(carrito) {
    let tempTotal = 0;
    let itemTotal = 0;
    carrito.map((item) => {
      tempTotal += item.price * item.cantidad;
      itemTotal += item.cantidad;
    });
    carritoTotal.innerText = parseFloat(tempTotal.toFixed(2));
    itemTotales.innerText = itemTotal;
  }

  addCarritoItem({ image, price, title, id }) {
    const div = document.createElement("div");
    div.classList.add("carrito__item");

    div.innerHTML = `
		<img src=${image} alt=${title}>
		<div>
			<h3>${title}</h3>
			<p class="price">$${price}</p>
		</div>
		<div>
			<span class="increase" data-id=${id}>
				<i class="bx bxs-up-arrow"></i>
			</span>
			<p class="item__cantidad">1</p>
			<span class="decrease" data-id=${id}>
				<i class="bx bxs-down-arrow"></i>
			</span>
		</div>
		<div>
			<span class="remove__item" data-id=${id}>
				<i class="bx bx-trash"></i>
			</span>
		</div>
		`;
    carritoCenter.appendChild(div);
  }
  show() {
    carritoDOM.classList.add("show");
    overlay.classList.add("show");
  }
  hide() {
    carritoDOM.classList.remove("show");
    overlay.classList.remove("show");
  }
  setAPP() {
    carrito = Storage.getCart();
    this.setItemValues(carrito);
    this.populate(carrito);
    openCarrito.addEventListener("click", this.show);
    closeCarrito.addEventListener("click", this.hide);
  }
  populate(carrito) {
    carrito.forEach((item) => this.addCarritoItem(item));
  }
  cartLogic() {
    clearCarritoBtn.addEventListener("click", () => {
      this.clearCarrito();
      this.hide();
    });

    carritoCenter.addEventListener("click", (e) => {
      const target = e.target.closest("span");
      const targetElement = target.classList.contains("remove__item");
      console.log(target);
      console.log(targetElement);
      if (!target) return;
      if (targetElement) {
        const id = parseInt(target.dataset.id);
        this.removeItem(id);
        carritoCenter.removeChild(target.parentElement.parentElement);
      } else if (target.classList.contains("increase")) {
        const id = parseInt(target.dataset.id, 10);
        let tempItem = carrito.find((item) => item.id === id);
        tempItem.cantidad++;
        Storage.saveCart(carrito);
        this.setItemValues(carrito);
        target.nextElementSibling.innerText = tempItem.cantidad;
      } else if (target.classList.contains("decrease")) {
        const id = parseInt(target.dataset.id, 10);
        let tempItem = carrito.find((item) => item.id === id);
        tempItem.cantidad--;

        if (tempItem.cantidad > 0) {
          Storage.saveCart(carrito);
          this.setItemValues(carrito);
          target.previousElementSibling.innerText = tempItem.cantidad;
        } else {
          this.removeItem(id);
          carritoCenter.removeChild(target.parentElement.parentElement);
        }
      }
    });
  }

  // BORRAR CARRITO EASY
  clearCarrito() {
    const cartItems = carrito.map((item) => item.id);
    cartItems.forEach((id) => this.removeItem(id));

    while (carritoCenter.children.length > 0) {
      carritoCenter.removeChild(carritoCenter.children[0]);
    }
  }

  // BORRAR UN OBJETO
  removeItem(id) {
    carrito = carrito.filter((item) => item.id !== id);
    this.setItemValues(carrito);
    Storage.saveCart(carrito);
    let button = this.singleButton(id);
    if (button) {
      button.disabled = false;
      button.innerText = "Añadir carrito";
    }
  }
  singleButton(id) {
    return buttonDOM.find((button) => parseInt(button.dataset.id) === id);
  }
}

// GUARDAR COSAS EN LOCAL STORAGE
class Storage {
  static saveProduct(obj) {
    localStorage.setItem("productos", JSON.stringify(obj));
  }
  static saveCart(carrito) {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }
  static getProductos(id) {
    const producto = JSON.parse(localStorage.getItem("productos"));
    return producto.find((product) => product.id === parseFloat(id, 10));
  }
  static getCart() {
    return localStorage.getItem("carrito")
      ? JSON.parse(localStorage.getItem("carrito"))
      : [];
  }
}

// CLASES ARRAY Y USA "CATEGORY" YO NO LO USE MIRALO BIEN
class Productos {
  async getProductos() {
    try {
      const result = await fetch("productos.json");
      const data = await result.json();
      const productos = data.items;
      return productos;
    } catch (err) {
      console.log(err);
    }
  }
}

let category = "";
let productos = [];

function categoryValue() {
  const ui = new UI();

  category = document.getElementById("category").value;
  if (category.length > 0) {
    const producto = productos.filter((regx) => regx.category === category);
    ui.mostrarProductos(producto);
    ui.getButtons();
  } else {
    ui.mostrarProductos(productos);
    ui.getButtons();
  }
}

const query = new URLSearchParams(window.location.search);
let id = query.get("id");

document.addEventListener("DOMContentLoaded", async () => {
  const productosLista = new Productos();
  const ui = new UI();

  ui.setAPP();

  productos = await productosLista.getProductos();
  if (id) {
    ui.detalleProducto(id);
    Storage.saveProduct(productos);
    ui.getButtons();
    ui.cartLogic();
  } else {
    ui.mostrarProductos(productos);
    Storage.saveProduct(productos);
    ui.getButtons();
    ui.cartLogic();
  }
});

/*==============================
CODIGO JS FORMULARIO PAGAR
==============================*/

$(".contactoBtn").click((e) => {
  $(".entrega").css("visibility", "visible");
  $(".contactoBtn").toggle(2000);
});

function confirmar() {
  // Variables de Cada Input
  let email = document.getElementById("email");
  let codigoPostal = document.getElementById("codigoPostal");
  let direccion = document.getElementById("direccion");
  let nombreApellido = document.getElementById("nombreApellido");
  let telefono = document.getElementById("telefono");
  // LocalStorage de Cada Valor
  localStorage.setItem("email", email.value);
  localStorage.setItem("codigo postal", codigoPostal.value);
  localStorage.setItem("direccion", direccion.value);
  localStorage.setItem("nombreApellido", nombreApellido.value);
  localStorage.setItem("telefono", telefono.value);
}

// AJAX LO INTENTE PERO NO PUDE
// function enviar() {
//   let email = document.getElementById("email").value;
//   let codigoPostal = document.getElementById("codigoPostal").value;
//   let direccion = document.getElementById("direccion").value;
//   let nombreApellido = document.getElementById("nombreApellido").value;
//   let telefono = document.getElementById("telefono").value;

//   let info =
//     "email=" +
//     email +
//     "&codigoPostal=" +
//     codigoPostal +
//     "&direccion=" +
//     direccion +
//     "&nombreApellido=" +
//     nombreApellido +
//     "&telefono=" +
//     telefono;

//   $.ajax({
//     type: "post",
//     url: "./send.php",
//     data: info,
//     sucess: function (resp) {
//       $("#respa").html(resp);
//     },
//   });
//   return false;
// }
