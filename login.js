const email = document.querySelector("#email");
const password = document.querySelector("#password");
const form = document.querySelector("#form");

const token = localStorage.getItem("token");

async function onLogin(e) {
  e.preventDefault();

  const loginDetails = {
    email: email.value,
    password: password.value,
  };
  await axios
    .post("http://localhost:3000/user/login", loginDetails)
    .then((response) => {
      if (response.status === 200) {
        alert(response.data.message);

        localStorage.setItem("token", response.data.token);

        window.location.href = "./expense.html";
      } else {
        throw new Error("Failed to login");
      }
    })
    .catch((err) => {
      document.body.innerHTML += `<div style="color:red">${err.message}</div>`;
    });
}

form.addEventListener("submit", onLogin);

const jwt =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

function forgotPassword(e) {
  window.location.href = "./forgot.html";
}
