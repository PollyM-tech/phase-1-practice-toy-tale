let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  const toyForm = document.querySelector(".add-toy-form");
  toyForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const newToy = {
      name: event.target.name.value,
      image: event.target.image.value,
      likes: 0
    };

    try {
      const response = await fetch("http://localhost:3000/toys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(newToy)
      });
      const toy = await response.json();
      renderToy(toy);
      toyForm.reset();
    } catch (error) {
      console.error("Error adding toy:", error);
    }
  });

  fetchAndDisplayToys();

  async function fetchAndDisplayToys() {
    try {
      const response = await fetch("http://localhost:3000/toys");
      const toys = await response.json();
      toys.forEach(toy => renderToy(toy));
    } catch (error) {
      console.error("Error fetching toys:", error);
    }
  }

  function renderToy(toy) {
    const toyCollection = document.getElementById("toy-collection");
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like ❤️</button>
    `;
    toyCollection.appendChild(card);

    const likeBtn = card.querySelector(".like-btn");
    likeBtn.addEventListener("click", async () => {
      const newLikes = toy.likes + 1;
      try {
        const response = await fetch(`http://localhost:3000/toys/${toy.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({ likes: newLikes })
        });
        if (response.ok) {
          toy.likes = newLikes;
          card.querySelector("p").textContent = `${newLikes} Likes`;
        }
      } catch (error) {
        console.error("Error updating likes:", error);
      }
    });
  }
});