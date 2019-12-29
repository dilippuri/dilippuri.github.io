window.onload = function() {
  var file = document.getElementById("file");

  file.addEventListener(onchange, e => {
    console.log("govind");
    console.log(e);
  });
};

// // Listen for form submit
// form.addEventListener("file", e => {
//   e.preventDefault();
//   var file = document.querySelector("[type=file]").file;
//   const formData = new FormData();
//   formData.append("file", file);
//   console.log(formData);

//   // ...
// });

// function compute(e) {
//   console.log(e);

//   console.log("compute function");
// }
