const container = document.querySelector('.content');
console.log(container);

const dataTable = () => {
    fetch('http://localhost:8080/category/')
    .then(res=>res.json())
    .then(data=>{
        console.log(data);

        container.innerHTML = data.categories.map(
            (category) => 
            `
            <div class="card">
                <img src=${category.imageUrl} alt="">
            </div>
            `
        );
    })
    .catch((err)=>console.log(err));
};

dataTable();