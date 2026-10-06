const loadButton = document.getElementById("load-users");
const filterInput = document.getElementById("filter-input");
const statusMessage = document.getElementById("status");
const usersList = document.getElementById("users-list");

let allUsers = [];


function renderUsers(list) {
  usersList.textContent = "";

  if (list.length === 0) {
    const item = document.createElement("li");
    item.textContent = "No users match your filter.";
    usersList.appendChild(item);
    return;
  }

  list.forEach(function (user) {
    const item = document.createElement("li");

    const name = document.createElement("strong");
    name.textContent = user.name;

    const email = document.createElement("div");
    email.textContent = "Email: " + user.email;

    const city = document.createElement("div");
    city.textContent = "City: " + user.address.city;

    const company = document.createElement("div");
    company.textContent = "Company: " + user.company.name;

    item.append(name, email, city, company);
    usersList.appendChild(item);
  });
}

async function loadUsers() {
  statusMessage.textContent = "Loading...";
  loadButton.disabled = true;

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");

    if (!response.ok) {
      throw new Error("Server problem: " + response.status);
    }

    allUsers = await response.json();
    renderUsers(allUsers);
    statusMessage.textContent = "Loaded " + allUsers.length + " users!";
  } catch (error) {
    statusMessage.textContent = "Oops! Could not load users.";
  } finally {
    loadButton.disabled = false;
  }
}

loadButton.addEventListener("click", loadUsers);

filterInput.addEventListener("input", function () {
  if (allUsers.length === 0) {
    return;
  }

  const text = filterInput.value.toLowerCase();

  const matches = allUsers.filter(function (user) {
    return user.name.toLowerCase().includes(text);
  });

  renderUsers(matches);
});

