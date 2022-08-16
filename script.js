/*

Author:Diamond Ali

*/
//element constructor
class Element{
  constructor(...args) {
    this.elements = [];
    args.map(arg => {
      arg == window ? this.elements.push(arg) : Array.from(document.querySelectorAll(arg)).map(item => this.elements.push(item))
    })
  }
  _each(fn) {
    for (let item of this.elements) {
      fn(item);
    }
    return this;
  }
  addEvent(event, fn) {
    this._each((el) => {
      el[`on${event}`] = fn;
    })
    return this;
  }
  setStyle(property, value) {
    this._each((el) => {
      el.style[property] = value;
    })
    return this;
  }
  show() {
    this.setStyle("display", "block");
    return this;
  }
  vanish() {
    this.setStyle("display", "none");
    return this;
  }
  attribute(attr, value) {
    this._each(el => {
      el.setAttribute(attr, value)
    })
    return this;
  }
  addClassList(className) {
    this._each(el => {
      el.classList.add(className);
    })
    return this;
  }
  removeClassList(className) {
    this._each(el => {
      el.classList.remove(className);
    })
    return this;
  }
  append(child) {
    this._each(el => {
      el.appendChild(child);
    })
    return this;
  }
}
//singleton Object
let store = {
  quantity:0, 
  slideTracker:1, 
  smallImages:document.querySelectorAll(".miniImg"), 
  images:[], 
  deleteIcon:elt("img", {
    "src":"./Assets/Images/icon-delete.svg", 
    "class":"deleteIcon"
  }), 
  cartItems:[], 
}
//factory function 
function $(...args) {
  let dom = new Element(...args);
  return dom;
}
//creates dom elements 
function elt(name, attrs,...children) {
  let dom = document.createElement(name);
  for (let key in attrs) {
    dom.setAttribute(key, attrs[key]);
  }
  for (let child of children) {
    dom.appendChild(child);
  }
  return dom;
}
//slidebar implementation (previous)
function prevImage() {
  if (store.slideTracker > 1) {
    store.slideTracker--;
    $(".active").removeClassList("active");
    store.images[store.slideTracker - 1].classList.add("active");
    if (innerWidth < 767) {
      $(`.img${store.slideTracker}`).show().addClassList("prevslideIn");
      $(`.img${store.slideTracker + 1}`).addClassList("prevSlideOut");
      setTimeout(() => {
        $(`.img${store.slideTracker + 1}`).vanish().removeClassList("prevSlideOut");
        $(`.img${store.slideTracker}`).removeClassList("prevSlideIn");
      }, 200)
    } else {
      $(`.img${store.slideTracker}`).show();
      $(`.img${store.slideTracker + 1}`).vanish()
    }
  }
}
//slide implementation(next)
function nextImage() {
  if (store.slideTracker < 4) {
    store.slideTracker++;
    $(".active").removeClassList("active");
    store.images[store.slideTracker - 1].classList.add("active");
    if (innerWidth < 767) {
      $(`.img${store.slideTracker}`).addClassList("slideIn").show();
      $(`.img${store.slideTracker - 1}`).addClassList("slideOut");
        setTimeout(() => {
          $(`.img${store.slideTracker - 1}`).vanish().removeClassList("slideOut")
          $(`.img${store.slideTracker}`).removeClassList("slideIn");
        },200) 
    } else {
      $(`.img${store.slideTracker}`).show();
      $(`.img${store.slideTracker - 1}`).vanish();
    }
  }
}
function createText(text) {
  let domText = document.createTextNode(text);
  return domText;
}
//adds items selected by the user to the cart
function addToCart() {
  $(".items").elements[0].innerHTML = "";
  let itemContainer = elt("div", {"class":"cart-container"},
  elt("img", {
    "src":"./Assets/Images/image-product-1-thumbnail.jpg",
    "class":"cart-img"
  }),
  elt("div", {"class":"cart-para"}, 
  elt("p", {"class":"para"}, createText("Autumn Limited Edition...")), 
  elt ("p", {"class":"para"}, createText(`$125.00 × ${store.quantity}  `),
  elt("b", {}, createText(`$${125 * store.quantity}.00`)))), 
  store.deleteIcon
  )
  let checkOutBtn = elt("button", {"class":"checkOutBtn"}, createText("CheeckOut"))
  $(".items")
  .append(itemContainer)
  .append(checkOutBtn)
}
//stores the small images
for (image of store.smallImages) {
  store.images.push(image);
}
//changes the main image when the small images is clicked
store.images.map((img, index) => {
  img.onclick = () => {
    $(".active").removeClassList("active");
    img.classList.add("active");
    $(`.img${store.slideTracker}`).vanish();
    store.slideTracker = img.getAttribute("data-help");
    $(`.img${store.slideTracker}`).show();
  }
})

//open mobile nav bar
$("#hamburger").addEvent("click", () => {
    $("nav").setStyle("marginLeft", "0")
});

//close mobile  navbar
$(".close").addEvent("click", () => {
    $("nav").setStyle("marginLeft", "-70%")
});

//increment quantity 
$(".add").addEvent("click", () => {
  store.quantity++;
});

//decreament quantity 
$(".minus",).addEvent("click", () => {
  if (store.quantity > 0) {
    store.quantity--;
  }
})

//slider previous button 
$(".prev").addEvent("click", prevImage); 

//slider next button
$(".next").addEvent("click", nextImage);

//shows full screen image
$("#main-img").addEvent("click", () => {
  if (innerWidth > 767) {
    $(".fullImg").show();
  }
})

//closes full screen image
$(".closeImage").addEvent("click", () => {
  $(".fullImg").vanish();
})

//add goods to cart
$("#addToCart").addEvent("click", () => {
  if (store.quantity > 0) {
    addToCart();
    localStorage.setItem("products", JSON.stringify(store.quantity));
     $(".noOfProducts").show().elements[0].innerHTML = store.quantity;
  }
})
//displays items in cart
$("#cart").addEvent("click", () => {
  $(".cart").show()
})

//deletes items that were added to the cart
store.deleteIcon.onclick = () => {
  localStorage.removeItem("products");
  $(".items").elements[0].innerHTML = "";
  $(".items").append(elt("p", {"class":"emptyCart"}, createText("Your cart is empty.")))
   $(".noOfProducts").vanish();
}

//closes cart
$(".closeCart").addEvent("click", () => {
  $(".cart").vanish();
})
$(window).addEvent("click", (e) => {
   $(".noOfItems").attribute("value", `${store.quantity}`); 
})
.addEvent("load", () => {
  let products = localStorage.getItem("products");
  store.quantity = JSON.parse(products);
  if (products) {
    addToCart();
    $(".noOfProducts").show().elements[0].innerHTML = store.quantity;
  } else {
    store.quantity = 0;
    $(".items").append(elt("p", {"class":"emptyCart"}, createText("Your cart is empty.")))
  }
})
