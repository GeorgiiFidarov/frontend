const container = document.querySelector('.content');
console.log(container);

const dataTable = () => {
    fetch('http://localhost:8080/category/')
    .then(res=>res.json())
    .then(data=>{
        console.log(data.categories.map(category=>category.imageUrl));

        container.innerHTML = data.categories.map(
            (category) => 
            `
            <div class="card">
                <img src=${category.imageUrl} alt="">
            </div>
            `
        ).join("");
    })
    .catch((err)=>console.log(err));
};

dataTable();