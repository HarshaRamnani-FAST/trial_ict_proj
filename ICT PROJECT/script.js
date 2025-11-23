<script>
  // Get current page
  const currentPage = window.location.pathname.split("/").pop();

  // Select the cart link
  const cartLink = document.getElementById('cartLink2');

  // Add 'active' class if we are on cart.html
  if (currentPage === 'cart.html') {
    cartLink.classList.add('active');
  } else {
    cartLink.classList.remove('active');
  }
</script>
