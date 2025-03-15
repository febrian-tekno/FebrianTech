alert("device mu telah diretas");
var nameInput = prompt("masukan nama untuk membuka : \nputra ", "putra");
while (nameInput !== "putra") {
  alert("nama tidak terdaftar dalam database");
  var nameInput = prompt("masukan nama untuk membuka :");
}

const nameElement = document.getElementById("names");
const names = nameElement.innerHTML;
const char = [...names].map((n) => `<span>${n}</span>`).join(" ");

nameElement.innerHTML = char;
console.log(char);
