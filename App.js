const searchInput = document.querySelector('.search');

var searchs = [];

if(searchInput){
    searchInput.addEventListener('input', e=>{
        const value = e.target.value.toLowerCase();
        searchs.forEach(search=>{

          const isVisible = search.categoryName.toLowerCase().includes(value);
          const cardElem = document.querySelector("#"+search.categoryName);
          cardElem.classList.toggle('hide',!isVisible);

    
        })
    })
}

/*************************************************************************/
const container = document.querySelector('.content');
if(container){
    const dataTable = () => {
        fetch('https://greenway-vld.ru/api/category/')
        .then(res=>res.json())
        .then(data=>{
            container.innerHTML = data.categories.map(
                (category) => 
                `
                <div class="card" id="${category.categoryName}">
                    <a href="/ProductPage.html">
                        <img onclick="javascript:getId(${category.id})" src=${category.imageUrl} alt="${category.id}">
                    </a>
                </div>
                `
            ).join("");
            searchs = data.categories;
            console.log(searchs)
        })
        .catch((err)=>console.log(err));
    };
    dataTable();
}
/*************************************************************************/
/*************************************************************************/

var productsSearchs = [];


/*************************************************************/


function getId(id){
    sessionStorage.setItem('categoryId',id)
}
const productsContent = document.querySelector('.products');

let elements = 10


if(productsContent){
    function product(){
        let categoryId = sessionStorage.getItem('categoryId');
        let page = document.querySelector(".pagination").id;
        
      

      if(document.querySelector(".search").value.length>3||document.querySelector(".search").value.length==0){

      
        searchInput.addEventListener('input', e=>{
          const value = e.target.value.toLowerCase();
        
          if(value.length>=3||value.length==0){
        fetch(`https://greenway-vld.ru/api/product/category/${categoryId}/products?elementPerPage=${elements}&direction=asc&key=id&searchKey=${value}`)
        .then(res=>res.json())
        .then(data=>{
          console.log(categoryId)
          productsContent.innerHTML = data.products.content.map(
            (product) =>
            `
            <div class="product-card" id="${product.name}_${categoryId}">
              <img src="${product.image}" alt="card-img">
              <a href="./Product.html" onclick="javascript:setProductId(${product.id})">${product.name}</a>
              <div class="bottom-product-card">
                  <h1>${product.price} &#8381</h1>
                  <button onclick="addToCart(${product.id})" class="add-to-cart">В корзину</button>
                  <button onclick="sellingProceed()" class="buy">Купить</button>
              </div>
            </div>
            `
          ).join("");
        })
      }
      })
    }
    }
    product();
}
function sellingProceed(){
  alert("buy")
}
function getAllProducts(){
  amount();
  let categoryId = sessionStorage.getItem('categoryId');
  console.log(categoryId)
  let page = document.querySelector(".pagination").id;
  document.querySelector('.currentPage').textContent = Number(page)+1;

  fetch(`https://greenway-vld.ru/api/product/category/${categoryId}/products?page=${Math.floor(page)}&elementPerPage=${elements}&direction=asc&key=id`)
        .then(res=>res.json())
        .then(data=>{
          productsContent.innerHTML = data.products.content.map(
            (product) =>
            `
            <div class="product-card" id="${product.name}_${categoryId}">
              <img src="${product.image}" alt="card-img">
              <a href="./Product.html" onclick="javascript:setProductId(${product.id})">${product.name}</a>
              <div class="bottom-product-card">
                  <h1>${product.price} &#8381</h1>
                  <button onclick="addToCart(${product.id})" class="add-to-cart">В корзину</button>
                  <button onclick="sellingProceed()" class="buy">Купить</button>
              </div>
            </div>
            `
          ).join("");
          console.log(data)
        })
        
}
function setProductId(id){
  sessionStorage.setItem('productId',id)
}


let nextPage = 0;
function next(){
  let temp = sessionStorage.getItem("amountOfProducts")

  let page = temp/elements;

  if(nextPage<page-1){ 
    nextPage++;
  }
  console.log(page);
  document.querySelector(".pagination").id = nextPage;
  getAllProducts()
}


function prev(){
  if(nextPage>0){
    nextPage --;
  }
  
  document.querySelector(".pagination").id = nextPage;
  getAllProducts()
}
const productPlace = document.querySelector('.product-description');

function amount(){
  
  let categoryId = sessionStorage.getItem('categoryId');
  fetch(`https://greenway-vld.ru/api/product/${categoryId}/products`)
  .then(res=>res.json())
  .then(data=>{sessionStorage.setItem("amountOfProducts",data)})
}

function getProductDetail(id){
  
  fetch(`https://greenway-vld.ru/api/product/${id}`)
  .then(res=>res.json())
  .then(data=>{
    productPlace.innerHTML = (
      
      `
      <div class="product-description-wrapper">

          <div class="product-image-wrapper">
              <img src="${data.image}" alt="" class="product-image">
          </div>

          <div class="another-side-of-product">

            <h1 class="product-name">${data.name}</h1>

            <div class="price-with-buttons">
                <h1 class="product-price">${data.price} &#8381</h1>
                <button onclick="addToCart(${data.id})" class="product-to-cart">В корзину</button>
                <button class="product-buy">Купить</button>
            </div>

            <h1 class="product-text">
                ${data.description}
            </h1>

          </div>

       </div>
      `
    )
  })
}

/************************************************************************/


let numberOfProducts = 1;
sessionStorage.setItem("amount",numberOfProducts)


function addToCart(id){

  if(localStorage.getItem(id)!=null){

    let amountOf = localStorage.getItem(id);
    ++amountOf;
    localStorage.setItem(id,amountOf);
    document.querySelector(".total-price_"+id).textContent = amountOf
  }else{
    let numberOfProducts = 1;
    localStorage.setItem(id,numberOfProducts)
    getProductForCart(id,numberOfProducts)

    

  }
}
function increment(id){
  
  let itemIncementation = Number(localStorage.getItem(id))
  itemIncementation++;
  localStorage.setItem(id,itemIncementation);
  document.querySelector(".total-price_"+id).textContent = itemIncementation

  let price = document.querySelector(".product-price-one_"+id).textContent;
  let priceToAdd = price/(itemIncementation-1);
  document.querySelector(".product-price-one_"+id).textContent = Number(price) + Number((price/(itemIncementation-1)));
  
  let finalPrice = Number(document.querySelector(".final-price").textContent)
  
  finalPrice+=priceToAdd
  document.querySelector(".final-price").textContent = finalPrice
}




function decrement(id){
  
  let itemIncementation = Number(localStorage.getItem(id))
  itemIncementation--;
  localStorage.setItem(id,itemIncementation);
  document.querySelector(".total-price_"+id).textContent = itemIncementation

  let price = document.querySelector(".product-price-one_"+id).textContent;
  let priceToRemove = price/(itemIncementation+1);
  document.querySelector(".product-price-one_"+id).textContent = Number(price) - priceToRemove;

  let finalPrice = Number(document.querySelector(".final-price").textContent)
  
  finalPrice-=priceToRemove
  document.querySelector(".final-price").textContent = finalPrice

  if(document.querySelector(".product-price-one_"+id).textContent==0){
    removeItemFromCart(id)
  }
  

}

const cartContent = document.querySelector('.modal-content-cart');

function buildCart(){
  for (let i = 0; i < localStorage.length; i++){

    const key = localStorage.key(i)
 
    getProductForCart(key,localStorage.getItem(key))
    
  }
}


function getProductForCart(id,numberOfProducts){

  fetch(`https://greenway-vld.ru/api/product/${id}`)
  .then(res=>res.json())
  .then(data=>{

      cartContent.innerHTML += (
        `
        <div class="container-form-cart" id="cart_${data.id}">     
  
              <button onclick="removeItemFromCart(${data.id})" type="button" class="delete-product-from-cart">
                  <img src="/images/remove-image.png" alt="${data.id}">
              </button>
  
              <h1 class="cart-name">
                ${data.name}
              </h1>
  
              <div class="amountOf">
                  <button onclick="increment(${data.id})" type="button" class="up">+</button>
                  <h1 class="total-price_${data.id} amount_for_summing">${numberOfProducts}</h1>
                  <button onclick="decrement(${data.id})" type="button" class="down">-</button>
              </div>
  
              <h1 class="sum-price">
                  <p class="product-price-one_${data.id} price_for_summing">${data.price}</p>&#8381
              </h1>
  
        </div>
        
        `
      )
  })
}

if(document.querySelector(".shopping-cart-image-container")){
  buildCart()
}

let nodesProduct = document.getElementsByClassName("price_for_summing")

document.addEventListener("DOMContentLoaded", function(e) {
  let eval_table = document.getElementsByClassName('price_for_summing');
  console.log(eval_table, eval_table.length);
});

function showCartModal(){
  let price  = document.querySelectorAll(".price_for_summing")
  let amount = document.querySelectorAll(".amount_for_summing")
  
  

  if(document.getElementsByClassName("container-form-cart").length==0){
    
    buildCart()
    setTimeout(() => {
          let arrayOfPrices = 0;

          let price  = document.querySelectorAll(".price_for_summing")
          let amount = document.querySelectorAll(".amount_for_summing")

          for(let i = 0; i < localStorage.length; i++){

            price[i].textContent *= Number(amount[i].textContent)
        
            arrayOfPrices += Number(price[i].textContent)
          }
          document.querySelector(".final-price").textContent = arrayOfPrices
     },1000);
    
  
  }
  
  

  document.getElementById('cart-modal').style.display='flex'
  

  
  

  let arrayOfPrices = 0;
 
  
  for(let i = 0; i < price.length; i++){
    price[i].textContent *= Number(amount[i].textContent)

    arrayOfPrices += Number(price[i].textContent)
  }
  document.querySelector(".final-price").textContent = arrayOfPrices

}
function closeModal(){
  document.getElementById('cart-modal').style.display='none'

  let allCarts = document.getElementsByClassName("container-form-cart")

  for(let i = 0; i < allCarts.length; i++){
    console.log(allCarts[i].remove())
    closeModal()
  }
  
}



function checkOut(){
  // localStorage.clear()
  document.querySelector(".modal-content-cart").style.display="none"
  const temp = document.querySelector(".modal-wrapper");
  temp.innerHTML = (
    `

    <div class="check-out-wrapper">

        <div class="address-to-deliver">
            <h1>Введите адрес доставки</h1>
            <textarea id="addres" placeholder="Укажите Город,Улицу,Индекс" name="address" id="" cols="5" rows="3" autocomplete="address"></textarea>
        </div>

        <div class="time-when-to-deliver">
            <h1>Комметарии к доставке</h1>
            <textarea id="comment" placeholder="Опишите детали доставки" name="commet" cols="5" rows="3" autocomplete="comment"></textarea>                        
        </div>
        
        <div class="phoneNumber-to-submit">
            <h1>Номер телефона для подтверждения покупки</h1>
            <input id="phone" placeholder="+7987654321" type="text" autocomplete="phone_number">               
        </div>
        <div class="payment-info">
            <h1>Оплата производиться наличными или переводом курьеру при получении заказа.</h1>              
        </div>

    </div>

    `
  )
  



  document.querySelector(".check-out-button-to-change").style.display = "none";
  orderButton = document.querySelector(".check-out-button");
  orderButton.innerHTML = (
    `
    <button style="background: #37ad39" class="check-out-button-to-change" onclick="switcher()">Отправить заказ</button>

    `
  )
  let closeButton = document.querySelector(".close-cart");
  closeButton.onclick = function(){ location.reload() }
}

function switcher(){
  let address = document.querySelector("#addres").value
  let comment = document.querySelector("#comment").value
  let phone = document.querySelector("#phone").value
  console.log(address)
  if(!address&&!comment&&!phone){
      
      alert('Заполните все поля!')

     }else{
      buy()
     }
}



function buy(){
  let address = document.querySelector("#addres").value
  let comment = document.querySelector("#comment").value
  let phone = document.querySelector("#phone").value
  

  document.querySelector(".check-out-wrapper").style.display="none"
  document.querySelector(".check-out").style.display="none"
  let temp = document.querySelector(".modal-wrapper");



  temp.innerHTML = (
    `
    <div class="check-out-wrapper">
      <div class="check-out-body">
        <h1 class="info">Спасибо за заказ!</h1>
        <h1 class="info">Ожидайте звонка оператора для подтверждения заказа.</h1>
        <img class="order-received" src="images/received.png" alt="">
      </div>
    </div>

    `
  )

  let order = [];
  let orderMap = new Map;
  let infoMap = new Map;

  infoMap.set("address",address)
  infoMap.set("comment",comment)
  infoMap.set("phone",phone)
  
 

  for (let i = 0; i < localStorage.length; i++){

    let key = localStorage.key(i)
    orderMap.set(key,localStorage.getItem(key))
    
  }
  
  let text = localStorage
  let products = JSON.stringify(text)
  console.log(products)


  fetch('http://localhost:8080/api/order/', {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json'
             },
             body: JSON.stringify(
              {
                address:address,
                comment:comment,
                phone:phone,
                products:products
              }
             )
           });

  let closeButton = document.querySelector(".close-cart");
  closeButton.onclick = function(){ location.reload(),localStorage.clear()}
  
}


function removeItemFromCart(id){

  let price = document.querySelector(".product-price-one_"+id).textContent
  let finalPrice = document.querySelector(".final-price").textContent

  document.querySelector(".final-price").textContent = finalPrice-price


  document.querySelector("#cart_"+id).remove()
  localStorage.removeItem(id)
  
}


/************************************************************************/




function login() {
    const username = document.getElementById("email").value;
    const password = document.getElementById("psw").value;
  
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "https://greenway-vld.ru/api/auth/login");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({
      "email": username,
      "password": password
    }));
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
        const objects = JSON.parse(this.responseText);
        console.log(objects.userInfo);

        const user = objects.userInfo;
        window.sessionStorage.setItem("user",JSON.stringify(user));

        if (objects['status'] == 'ok') {
            
              document.getElementById('id01').style.display="none";
              if(user.role=="ROLE_ADMIN"){
                window.location.href = './AdminPage.html';
              }else{
                window.location.href = './UserPage.html';
              }
              
            
          
        } else {
            alert("error")
        }
      }
    };
    return false;
  }
/***********************************ADMIN*************************************** */
const adminContent = document.querySelector('.admin-content');
if(adminContent){
    const dataTable = () => {
        fetch('https://greenway-vld.ru/api/category/')
        .then(res=>res.json())
        .then(data=>{
            container.innerHTML = data.categories.map(
                (category) => 
                `
                <div class="card" id="${category.categoryName}">
                    <a href="/ProductPage.html">
                        <img onclick="javascript:getId(${category.id})" src=${category.imageUrl} alt="${category.id}">
                    </a>
                </div>
                `
            ).join("");
            searchs = data.categories;
            console.log(searchs)
            
        })
        .catch((err)=>console.log(err));
    };
    dataTable();
}
/********************************Product save**************************** */
let base64String = "";
let productName = "";
let description = "";
let price = 0;
let category = 0;

async function saveProduct(){
  takeImage();
  
  productName = document.querySelector('#product-name').value;
  description = document.querySelector('.product-description').value;
  price = document.querySelector('#price').value;
  category = document.querySelector('#category-select').value;

  setTimeout(() => {
    const asyncPostCall = async () => {
      try {
          const response = await fetch('https://greenway-vld.ru/api/product/create', {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json'
             },
             body: JSON.stringify({
       // your expected POST request payload goes here
               name: productName,
               description: description,
               categoryId: category,
               price: price,
               image: base64String
              })
           });
           const data = await response.json();
        // enter you logic when the fetch is successful
           if(data.success==true){
            
            setTimeout(() => {
              document.querySelector(".ready").style.display="none"
            }, 1000);
            document.querySelector(".ready").style.display="flex"
           }
         } catch(error) {
       // enter your logic for when there is an error (ex. error toast)
    
            console.log(error)
           } 
      }
    
    asyncPostCall()

  }, 5000);
  


}
async function takeImage(){
  var file = document.querySelector('.product-image').files[0];
  var reader = new FileReader();

  reader.readAsDataURL(file);
  reader.onload = function () {
    base64String = reader.result;
  };
}

  

