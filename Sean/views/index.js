let menuicn = document.querySelector(".menuicn"); 
let nav = document.querySelector(".navcontainer"); 

menuicn.addEventListener("click", () => { 
	nav.classList.toggle("navclose"); 
})
document.addEventListener('DOMContentLoaded', () => {
    // Fetch recent user logins from your server
    fetch('/api/recentUserLogins')
      .then(response => response.json())
      .then(userLogins => {
        // Populate the recent user logins section
        const itemsContainer = document.querySelector('.items');
  
        userLogins.forEach(userLogin => {
          const item = document.createElement('div');
          item.classList.add('item1');
          item.innerHTML = `
            <h3 class="t-op-nextlvl">${userLogin.username}</h3>
            <h3 class="t-op-nextlvl">${userLogin.name}</h3>
            <h3 class="t-op-nextlvl">${userLogin.email}</h3>
            <h3 class="t-op-nextlvl label-tag">${userLogin.lastLogin}</h3>
          `;
          itemsContainer.appendChild(item);
        });
      })
      .catch(error => console.error('Error fetching recent user logins:', error));
  });