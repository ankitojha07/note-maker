const val = document.getElementById('val')

let t = 0;
const test = (t)=>{
    t+=1;
    val.innerHTML = t
}
window.addEventListener('load', () => {
    console.log("Page loaded. Initial t value:", t);
});

// Event listener for page reload
window.addEventListener('beforeunload', () => {
    console.log("Page is about to reload. Final t value:", t);
});
document.getElementById('btnPress').addEventListener('click',()=> test(t++))