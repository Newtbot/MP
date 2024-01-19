function searchFunction() {
    // Get the search input value
    var searchTerm = document.getElementById('searchInput').value.toLowerCase();

    // Get all blog entries
    var blogEntries = document.getElementById('blogEntries').getElementsByClassName('card');

    // Loop through each blog entry and hide/show based on the search term
    for (var i = 0; i < blogEntries.length; i++) {
      var title = blogEntries[i].getElementsByClassName('card-title')[0].innerText.toLowerCase();
      var text = blogEntries[i].getElementsByClassName('card-text')[0].innerText.toLowerCase();

      if (title.includes(searchTerm) || text.includes(searchTerm)) {
        blogEntries[i].style.display = 'block';
      } else {
        blogEntries[i].style.display = 'none';
      }
    }
  }