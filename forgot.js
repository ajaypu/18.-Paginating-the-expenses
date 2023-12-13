const email = document.querySelector("#email");

function forgotPassword(e) {
  e.preventDefault();

  const form = new FormData(e.target);

  const userDetails = {
    email: form.get("email"),
  };
  // console.log(userDetails);

  axios
    .post("http://localhost:3000/password/forgotPassword", userDetails)
    .then((response) => {
      console.log(response);
      if (response.status === 200) {
        document.body.innerHTML +=
          '<div style="color:red;">Mail Successfuly sent <div>';
      } else {
        console.log("++++++");
        throw new Error("Something went wrong!!!");
      }
    })
    .catch((err) => {
      console.log("**********************");
      document.body.innerHTML += `<div style="color:red;">${err} <div>`;
    });
}
