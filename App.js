const searchInput = document.querySelector('.search');

var searchs = [];
if(searchInput){
    searchInput.addEventListener('input', e=>{
        const value = e.target.value.toLowerCase();
        searchs.forEach(search=>{
            const isVisible = 
            search.categoryName.toLowerCase().includes(value);
        const cardElem = document.querySelector("#"+search.categoryName);
        
        cardElem.classList.toggle('hide',!isVisible);
    
        })
    })
}

/*************************************************************************/
const container = document.querySelector('.content');
if(container){
    const dataTable = () => {
        fetch('http://localhost:8080/category/')
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
function getId(id){
    sessionStorage.setItem('categoryId',id)
}
const products = document.querySelector('.products');

if(products){
    const product =()=>{
        let categoryId = sessionStorage.getItem('categoryId');
        fetch(`http://localhost:8080/product/category/${categoryId}/products`)
        .then(res=>res.json())
        .then(data=>console.log(data))
    }
    product();
}