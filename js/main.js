function filterPosts(category) {
  const buttons = document.querySelectorAll("nav[blog] button");
  buttons.forEach((button) => {
    if (button.textContent.toLowerCase() === category) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });

  const allPosts = document.querySelectorAll("#postsContainer > div[id]");
  const postsArray = Array.from(allPosts);
  postsArray.forEach((post) => {
    if (category === "all") {
      post.style.display = "";
    } else if (post.id.startsWith(category)) {
      post.style.display = "";
    } else {
      post.style.display = "none";
    }
  });

  // Sort all visible posts by date regardless of category
  sortPosts(postsArray.filter((post) => post.style.display !== "none"));
}

// Ordina tutti i post visibili per data a prescindere dalla categoria
function sortPosts(visiblePosts) {
  visiblePosts.sort((a, b) => {
    let dateA = parseDateFromId(a.id);
    let dateB = parseDateFromId(b.id);

    return (
      new Date(dateB.year, dateB.month - 1, dateB.day) -
      new Date(dateA.year, dateA.month - 1, dateA.day)
    );
  });

  // Ri-appende i post ordinati nello specifico container
  const postsContainer = document.querySelector("#postsContainer");
  visiblePosts.forEach((post) => postsContainer.appendChild(post));
}

function parseDateFromId(id) {
  const dateStr = id.slice(-6); // Prende gli ultimi 6 caratteri
  return {
    day: parseInt(dateStr.substr(0, 2), 10),
    month: parseInt(dateStr.substr(2, 2), 10),
    year: parseInt("20" + dateStr.substr(4, 2), 10), // Assumo circa anni 2000
  };
}

// Carica post
function loadPost(postId) {
  fetch(`/external/blogs/${postId}.html`)
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("postContent").innerHTML = html;
      document.getElementById("blog").style.display = "none";
      document.getElementById("blogPost").style.display = "block";
      localStorage.setItem("currentPost", postId);
      localStorage.setItem("activeSection", "blogPost");
      updateURL(`blogPost/${postId}`);
    })
    .catch((error) => console.error("Failed to load the post:", error));
}

// Torna al blog
function backToBlog() {
  document.getElementById("blog").style.display = "block";
  document.getElementById("blogPost").style.display = "none";
  localStorage.removeItem("currentPost");
  localStorage.setItem("activeSection", "blog");
  updateURL("blog");
}
