"use strict";

// element toggle function
const elementToggleFunc = function (elem) {
  elem.classList.toggle("active");
};

// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () {
  elementToggleFunc(sidebar);
});

// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
};

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {
  testimonialsItem[i].addEventListener("click", function () {
    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector(
      "[data-testimonials-title]"
    ).innerHTML;
    modalText.innerHTML = this.querySelector(
      "[data-testimonials-text]"
    ).innerHTML;

    testimonialsModalFunc();
  });
}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);

// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () {
  elementToggleFunc(this);
});

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);
  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {
  for (let i = 0; i < filterItems.length; i++) {
    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }
  }
};

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {
  filterBtn[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;
  });
}

// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {
    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }
  });
}

// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }
  });
}

const fetchArticles = () => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", "e5ec5c46-1de2-4186-89bb-ee42202c7388");
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    query:
      'query Publication{\n    publication(host: "tobiojuolape.hashnode.dev"){\n      author{\n        username\n      },\n    posts(first:10){\n      edges{\n        node{\n          id,\n          title,\n          slug, \n          readTimeInMinutes,\n          brief,\n          coverImage{\n            url\n          }\n        }\n      }\n    }\n     \n    }\n}\n',
    operationName: "Publication",
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("https://gql.hashnode.com", requestOptions)
    .then((response) => response.json()) // parse JSON
    .then((result) => {
      const articles = result.data.publication.posts.edges.map((post) => post.node); 
      displayArticles(articles); // Call function to display articles
    })
    .catch((error) => console.error(error));
};

// Function to display fetched articles
const displayArticles = (articles) => {
  const blogPostsList = document.querySelector('.blog-posts-list'); // Get the container
  blogPostsList.innerHTML = ''; // Clear any existing content

  // Loop through the articles and create HTML
  articles.forEach(article => {
    const listItem = document.createElement('li');
    listItem.classList.add('blog-post-item');

    listItem.innerHTML = `
      <a href="https://tobiojuolape.hashnode.dev/${article.slug}" target="_blank" rel="noopener">

        <figure class="blog-banner-box">
          <img src="${article.coverImage?.url || './assets/images/default-image.jpg'}" alt="${article.title}" loading="lazy">
        </figure>

        <div class="blog-content">

          <div class="blog-meta">
            <p class="blog-category">Read Time: ${article.readTimeInMinutes} min</p>
            <span class="dot"></span>
            <time>${new Date().toLocaleDateString()}</time>
          </div>

          <h3 class="h3 blog-item-title">${article.title}</h3>
          <p class="blog-text">${article.brief}</p>

        </div>
      </a>
    `;

    // Append the new article to the list
    blogPostsList.appendChild(listItem);
  });
};

// Call fetchArticles to run the whole process
fetchArticles();
