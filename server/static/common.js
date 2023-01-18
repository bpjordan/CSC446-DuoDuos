var parsedUrl = new URL(window.location.href);

// Function that logs the user in
function login(e) {

    // Stop form submission
    e.preventDefault();

    // Get form using id
    var form = document.getElementById("loginForm");

    // Authenticate user using form data
    fetch("http://" + parsedUrl.host + "/api/login", {
        method: "POST",
        body: new URLSearchParams(new FormData(form)),
        mode: "no-cors"
    })

        // Check for errors in request
        // If no errors, navigate to main page
        .then(res => {
            if (res.ok) {
                location.href = "/index.html";
            }
            else { throw Error(res.status) }
        })

        // Display errors to user
        .catch((error) => {
            if (error.message == 401) {
                document.getElementById("error").textContent = "Incorrect username or password, please try again.";
            }
        });
};

// Function that queries the database
function query(type) {

    // Request data using session token
    fetch("http://" + parsedUrl.host + "/api/query" + type, {
        method: "GET",
        mode: "no-cors"
    })

        // Check for errors in request
        .then(res => {
            if (res.ok) {

                // If logs, convert response into text
                if (type == "/logs") {
                    return res.text();
                }

                // Otherwise convert response into json
                else {
                    return res.json();
                }
            }
            else { throw Error(res.status); }
        })

        // Check type to determine data logic
        .then((data) => {

            // If user request, add sprite to box
            if(type == "/user"){
                // Not yet implemented
            }

            // If users request, add sprites to box
            else if (type == "/users") {
                var images = '';
                for (var i = 0; i < data.length; i++) {
                    images += '<img \
                    class="sprite" \
                    src="' + data[i]['sprite'] + '" \
                    data-name="' + data[i]['username'] + '" \
                    data-role="' + data[i]['role'] + '" \
                    data-image="' + data[i]['image'] + '" \
                    onclick="updateUserData(event)"/>';
                }
                document.getElementById('box-area-users').innerHTML = images;
            }

            // If user pokemon request, add sprite to box
            else if (type == "/user_pokemon"){
                // Not yet implemented
            }

            // If pokemon request, add sprites to box
            else if (type == "/pokemon") {
                var images = '';
                for (var i = 0; i < data.length; i++) {
                    images += '<img \
                    class="sprite" \
                    src="' + data[i]['sprite'] + '" \
                    data-name="' + data[i]['username'] + '" \
                    data-type="' + data[i]['type'] + '" \
                    data-image="' + data[i]['image'] + '" \
                    onclick="updatePokemonData(event)"/>';
                }
                document.getElementById('box-area-pokemon').innerHTML = images;
            }

            // If logs request, add log data to box
            // NOTE: Should be "access_logs"
            else if (type == "/logs") {

                // Add log data to box
                document.getElementById('box-area-logs').innerHTML = data;

                // Display log data
                document.getElementById("pokemon").style = "display:none;"
                document.getElementById("users").style = "display:none;"
                document.getElementById("logs").style = "display:flex;"
            }
        })

        // Log request errors
        .catch((error) => {

            // If token expired, alert and log out user
            if (error.message == 401) {
                alert("Session Expired: You will be redirected to the login page.");
                document.cookie = "session_token=invalid";
                location.href = "/";
            }

            // If insufficient permission, alert user
            if (error.message == 403) {
                alert("Insufficient Permissions: You do not have permission to view this information.");
            }
        })
}

// Function that gets the data for each query type
function getData(type) {

    if (type == "/user") {

        // Check if data has not been set
        if (document.getElementById("box-area-users").innerHTML == "") {

            // GET user data
            query(type);
        }

        // Display user data
        document.getElementById("error").textContent = "";
        document.getElementById("pokemon").style = "display:none;"
        document.getElementById("users").style = "display:flex;"
        document.getElementById("logs").style = "display:none;"

    }
    else if (type == "/users") {

        // GET all user data
        query(type);

    }
    else if (type == "/user_pokemon") {

        // Check if data has not been set
        if (document.getElementById("box-area-pokemon").innerHTML == "") {

            // GET user pokemon data
            query(type);
        }

        // Display user data
        document.getElementById("error").textContent = "";
        document.getElementById("pokemon").style = "display:flex;"
        document.getElementById("users").style = "display:none;"
        document.getElementById("logs").style = "display:none;"
    }
    else if (type == "/pokemon") {

        // GET all pokemon data
        query(type);

    }
    else if (type == "/access_log") {

        // NOTE: Should be "access_logs"
        query("/logs");

    }

};

// Function that updates the user data when a sprite is selected
function updateUserData(e) {

    // Update user data to display clicked sprite information
    document.getElementById("user-data-name").textContent = e.target.getAttribute('data-name').toUpperCase();
    document.getElementById("user-data-role").textContent = e.target.getAttribute('data-role').toUpperCase();
    document.getElementById("user-data-image").src = e.target.getAttribute('data-image');

    // Change color of role background and image border based on role
    role = e.target.getAttribute('data-role');
    if (role == "Trainer") {
        document.getElementById("user-data-role").style.backgroundColor = '#ff0000';
        document.getElementById("user-data-border").style.borderColor = '#ff0000';
    }
    else if (role == "Professor") {
        document.getElementById("user-data-role").style.backgroundColor = '#D0D1CD';
        document.getElementById("user-data-border").style.borderColor = '#D0D1CD';
    }
    else {
        document.getElementById("user-data-role").style.backgroundColor = '#FFDE00';
        document.getElementById("user-data-border").style.borderColor = '#FFDE00';
    }
}

// Function that updates the pokemon data when a sprite is selected
function updatePokemonData(e) {

    // Update pokemon data to display clicked sprite information
    document.getElementById("pokemon-data-name").textContent = e.target.getAttribute('data-name').toUpperCase();
    document.getElementById("pokemon-data-type").textContent = e.target.getAttribute('data-type').toUpperCase();
    document.getElementById("pokemon-data-image").src = e.target.getAttribute('data-image');

    // Change color of type background and image border based on type
    type = e.target.getAttribute('data-type');
    if (type == "fire") {
        document.getElementById("pokemon-data-type").style.backgroundColor = '#ff4422';
        document.getElementById("pokemon-data-border").style.borderColor = '#ff4422';
    }
    else if (type == "grass") {
        document.getElementById("pokemon-data-type").style.backgroundColor = '#77cc55';
        document.getElementById("pokemon-data-border").style.borderColor = '#77cc55';
    }
    else if (type == "water") {
        document.getElementById("pokemon-data-type").style.backgroundColor = '#3399ff';
        document.getElementById("pokemon-data-border").style.borderColor = '#3399ff';
    }
    else if (type == "electric") {
        document.getElementById("pokemon-data-type").style.backgroundColor = '#ffcc33';
        document.getElementById("pokemon-data-border").style.borderColor = '#ffcc33';
    }
    else if (type == "rock") {
        document.getElementById("pokemon-data-type").style.backgroundColor = '#bbaa66';
        document.getElementById("pokemon-data-border").style.borderColor = '#bbaa66';
    }
    else {
        document.getElementById("pokemon-data-type").style.backgroundColor = '#aaaa99';
        document.getElementById("pokemon-data-border").style.borderColor = '#aaaa99';
    }
}

// Function that logs the user out
function logout() {
    document.cookie = "session_token=invalid";
    location.href = "/";
}