const firebaseConfig = {
    priv info
  };
  
  // initialize firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  
  // reference your database
  var contactFormDB = firebase.database().ref("contactForm");

  const getElementVal = (id) => {
    return document.getElementById(id).value;
  };

  function updateProfilePage(username, userEmail) {
    // Update the username element
    console.log("Received username:", username);
    console.log("Received userEmail:", userEmail);
    var usernameElement = document.getElementById("displayName");
    usernameElement.textContent = username;
  
    // Update the email element
    var emailElement = document.getElementById("emailid");
    console.log(emailElement.textContent);
    emailElement.textContent = "Email: " + userEmail;
  }

  function loginUser(e) {
    e.preventDefault();
    
    var email = getElementVal("email");
    var password = getElementVal("password");
    
    console.log("Email:", email);
    console.log("Password:", password);
    
    // Use Firebase Authentication to sign in the user
    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // User successfully logged in
        console.log("User logged in:", userCredential.user);
  
        var user = firebase.auth().currentUser;
  
        if (user) {
          // User is logged in, fetch the user's display name and email
          var username = user.displayName; // Get the username
          var userEmail = user.email; // Get the email
          console.log("Username:", username);
          console.log("Email:", userEmail);
  
          // Call the function to retrieve the user's data from the Realtime Database
          getUserData(user.uid);
        }
        // Redirect the user to the profile page
        window.location.href = "profile.html";
      })
      .catch((error) => {
        // Handle login errors
        console.error("Login error:", error);
        // Display an error message to the user, if needed
      });
  }

  const saveMessages = (name, emailid, password) => {
    console.log("saveMessages function called");
    var newContactForm = contactFormDB.push();
  
    newContactForm.set({
      displayName: name, // Use "displayName" here, not "displayname"
      email: emailid,
      Password: password,
    })
    .then(() => {
      console.log("User information saved in the database");
  
      // Successfully saved the user information to the database, now create the user account
      createUserAccount(emailid, password, name);
    })
    .catch((error) => {
      console.error("Error saving user information:", error);
      // Display an error message to the user, if needed
    });
  };
  
  function createUserAccount(email, password, name) {
    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // User account created successfully
        var user = userCredential.user;
        console.log("User account created:", user);
        
        // Set the display name for the user
        return user.updateProfile({
          displayName: name
        });
      })
      .then(() => {
        // Display name set successfully
        var user = auth.currentUser;
        var username = user.displayName; // Get the updated username
        var userEmail = user.email; // Get the email
        console.log("Username:", username);
        console.log("Email:", userEmail);
  
        // Save user info to the Realtime Database after successful creation
        saveMessages(username, userEmail, password);
      })
      .catch((error) => {
        // Handle account creation errors
        console.error("Account creation error:", error);
        // Display an error message to the user, if needed
      });
  }
  

  function getUserData(userId) {
    const userRef = firebase.database().ref("contactForm").child(userId);
  
    userRef.once("value")
      .then((snapshot) => {
        const userData = snapshot.val();
        if (userData) {
          const username = userData.displayName;
          const email = userData.email;
          console.log("Username:", username);
          console.log("Email:", email);
          // You can use the username and email as needed here
        } else {
          console.log("User data not found.");
        }
      })
      .catch((error) => {
        console.error("Error retrieving user data:", error);
      });
  }
  
  

var cartItems = {}; // Object to store cart items and their counts

function addToCart(productName) {
    if (cartItems[productName]) {
        cartItems[productName] += 1; // Increment count if product already exists
    } else {
        cartItems[productName] = 1; // Add product to cart with count 1 if it doesn't exist
    }
      
    updateCart();
}

function updateCart() {
    var cartItemsList = document.getElementById("cart-items");
    cartItemsList.innerHTML = ""; // Clear the cart list
      
    for (var product in cartItems) {
        var count = cartItems[product];
          
        var listItem = document.createElement("li");
        if (count >= 2) {
            listItem.textContent = product + " x " + count;
        } else {
            listItem.textContent = product;
        }
          
        cartItemsList.appendChild(listItem);
    }
}
  
function toggleSidebar() {
    var sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("active");
    var sidebarSymbol = document.getElementById("sidebar-toggle");
    sidebarSymbol.classList.toggle("symbol-open");
}
  
window.addEventListener("DOMContentLoaded", function() {
    const fileInput = document.getElementById("file-input");
    const profileImage = document.getElementById("profile-image");
  
    fileInput.addEventListener("change", function (event) {
        const file = event.target.files[0];
        const reader = new FileReader();
  
        reader.onload = function (e) {
            profileImage.src = e.target.result;
        };
  
        reader.readAsDataURL(file);
    });
});
function searchProducts() {
    const searchInput = document.getElementById('search-input');
    const searchQuery = searchInput.value.toLowerCase();
  
    const productElements = document.querySelectorAll('.product');
    let productFound = false;
  
    productElements.forEach((productElement) => {
        const productName = productElement.querySelector('h2').textContent.toLowerCase();
        const productPrice = productElement.querySelector('p').textContent.toLowerCase();
  
        if (productName.includes(searchQuery) || productPrice.includes(searchQuery)) {
            productElement.style.display = 'block';
            productFound = true;
        } else {
            productElement.style.display = 'none';
            
        }
    });
  
    const notFoundSection = document.getElementById('not-found');
    if (productFound) {
        notFoundSection.style.display = 'none';
    } else {
        notFoundSection.style.display = 'block';
    }
}

function submitForm(e) {
  e.preventDefault();
  console.log("submitForm function called");
  var name = getElementVal("name");
  var emailid = getElementVal("emailid");
  var password = getElementVal("password");

  saveMessages(name, emailid, password);

  //   enable alert
  document.querySelector(".alert").style.display = "block";

  //   remove the alert
  setTimeout(() => {
    document.querySelector(".alert").style.display = "none";
  }, 3000);

  //   reset the form
  document.getElementById("contactForm").reset();
}

document.getElementById("login-form").addEventListener("submit", loginUser);

document.getElementById("contactForm").addEventListener("submit", submitForm);

document.getElementById('search-input').addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
      console.log("Researching");
      searchProducts();
  }
});
