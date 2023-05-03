const searchInput = document.querySelector('.search');

var searchs = [];

searchInput.addEventListener('input', e=>{
    const value = e.target.value.toLowerCase();
    searchs.forEach(search=>{
        const isVisible = 
        search.categoryName.toLowerCase().includes(value);
    const cardElem = document.querySelector("#"+search.categoryName);
    
    cardElem.classList.toggle('hide',!isVisible);

    })
})

/*************************************************************************/
const container = document.querySelector('.content');

const dataTable = () => {
    fetch('http://localhost:8080/category/')
    .then(res=>res.json())
    .then(data=>{
        container.innerHTML = data.categories.map(
            (category) => 
            `
            <div class="card" id="${category.categoryName}">
                <button>
                    <img src=${category.imageUrl} alt="">
                </button>
            </div>
            `
        ).join("");
        searchs = data.categories;
        
    })
    .catch((err)=>console.log(err));
};
dataTable();
/*************************************************************************/
