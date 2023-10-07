(() => {
  fetch("/blog-post-list", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(function (response) {
      response
        .json()
        .then(function (json) {
          console.log("Success:", json);
          let postList = document.getElementById("blog-post-list");
          json.list.forEach((element) => {
            postList.insertAdjacentHTML(
              "afterbegin",
              `<li><a href="${element.url}">${element.title}</a></li>`
            );
          });
        })
        .catch((error) => {
          if (response.status === 503) {
            console.error("tooManyRequests");
          } else {
            console.error("Got response, but had issue processing it: ", error);
          }
        });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
})();
