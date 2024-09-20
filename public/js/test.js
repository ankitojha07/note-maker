const val = document.getElementById("val");

let t = 0;
const test = (t) => {
  t += 1;
  val.innerHTML = t;
};
window.addEventListener("load", () => {
  console.log("Page loaded. Initial t value:", t);
});

// Event listener for page reload
window.addEventListener("beforeunload", () => {
  console.log("Page is about to reload. Final t value:", t);
});
document.getElementById("btnPress").addEventListener("click", () => test(t++));

// form validation

function validateForm() {
  const title = document.getElementById("title").value.trim();

  if (!title) {
    alert("Please enter a title for the file.");
    return false; // Prevent form submission
  }
  return true; // Proceed with form submission
}

function validateEditForm() {
  const newTitle = document.getElementById("newTitle").value.trim();

  if (!newTitle) {
    alert("New file name cannot be empty.");
    return false; // Prevent form submission if new title is empty
  }

  return true;
}
