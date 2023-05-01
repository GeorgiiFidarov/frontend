async function jsonData(){
    const responce = await fetch("http://localhost:8080/category/");
    const jsonData = await responce.json();
    console.log(jsonData)
}