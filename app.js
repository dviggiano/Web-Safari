// create references for page elements
function element(name) {
    return document.getElementById(name);

}

const home = element('home');
const mammals = element('mammals');
const birds = element('birds');
const reptiles = element('reptiles');
const amphibians = element('amphibians');
const fish = element('fish');

const signin = element('signin');
const signinModal = element('signin-modal');
const signinBackground = element('signin-modalbg');
const signinButton = element('signinin-button');
const signinForm = element('signin-form');
const signinClose = element('signin-close');
const signinError = element('signin-error');
const forgot = element('forgot');
const recover = element('recover');

const signup = element('signup');
const signupModal = element('signup-modal');
const signupBackground = element('signup-modalbg');
const signupButton = element('signup-button');
const signupForm = element('signup-form');
const signupClose = element('signup-close');
const signupError = element('signin-error');

const admin = element('admin');
const inboxModal = element('inbox-modal');
const inboxBackground = element('inbox-modalbg');
const inboxClose = element('inbox-close');
const inboxContent = element('inbox-content');
const unapproved = element('unapproved');

const feedbackButton = element('feedback-button');

const sources = element('sources');

const content = element('content');

function data(name) { 
    // create array
    const arr = Array();

    // get data from collection
    db.collection(`${name}`).get().then(response => { 
    // loop through each datapoint
    response.docs.forEach(datapoint => {
        // put attributes in array
        arr.push(datapoint.data())

        });

    });

    // return array
    return arr;

}

// import collections
const users = data('users');
const animals = data('animals')
const zoos = data('zoos');

let unapprovedReviews = Array();

// create a reference for the current user data
function currUser() {
    let current = {
        email: 'Anonymous',
        uid: null,
        favorites: null,
        admin: false
    }

    // loop through all user data
    if (auth.currentUser) {
        users.forEach(user => {
            // if the current user has the active user's id...
            if (user.uid === auth.currentUser.uid) {
                // save that user
                current = user

            }

        });

    }
    // return value
    return current;

}

// create favorites array
let favorites = Array();

if (auth.currentUser) {
    favorites = currUser().favorites;

}

// create functions
function showModal(trigger, modal) {
    trigger.onclick = () => {
        modal.classList.add('is-active');

    }

}

function hideModal(trigger, modal) {
    trigger.onclick = () => {
        modal.classList.remove('is-active');
    }

}

function removeItem(arr, value) {
    const index = arr.indexOf(value);

    if (index > -1) {
      arr.splice(index, 1);

    }

    return arr;

}

const loader = '<br><div class="loader"></div><br>';

function homePage() {
    // clear content
    content.innerHTML = loader;
    // create checkboxes
    let checkboxes = '';
    // loop through each animal
    animals.forEach(animal => {
        // if the animal is a favorite, add additional HTML to check the box
        let checked = '';

        if (favorites.includes(animal.name)) { checked = ' checked' }

        // add animal to list of checkboxes
        checkboxes += `
            <div class="panel-block">
                <input type="checkbox" value="${animal.name}"${checked} class="search">
                ${animal.name}
            </div>
            `;

    });

    // create function for producing zoos
    function loadZooContent() {
        // clear zoo content
        let zooContent = '';
        let currZoos = '';
        // create reference for inserted zoos
        let activeZoos = Array()

        // loop through each zoo
        zoos.forEach(zoo => {
            // add zoo to review options
            currZoos += `<option value="${zoo.name}">${zoo.name}</option>`;

            // create list of reviews
            let reviews = '';

            // loop through each review
            zoo.reviews.forEach(review => {
                const reviewHTML = `
                    <b>Score:</b>&nbsp;${review.score} &bull; ${review.text}
                    `;

                // if no reviews have yet been identified, just add the review
                if (reviews === '') {
                    reviews += '<b class="is-size-5">Reviews</b><br>' + reviewHTML;

                }
                // otherwise, add a break line and the review
                else {
                    reviews = `${reviews}<br>${reviewHTML}`;
                }

            });

            // if there are no reviews, replace list with alert
            if (reviews === '') {
                reviews = '<i>No reviews have been left for this zoo yet!</i>';

            }

            // collect all checked animals
            let checkedArray = Array();

            document.querySelectorAll('.search').forEach(box => {
                if (box.checked) {
                    checkedArray.push(box)

                }

            });
            // if the zoo is not missing any checked animals, add zoo
            let include = true;

            checkedArray.forEach(box => {
                if (!zoo.animals.includes(box.value)) {
                    include = false;

                }

            });

            if (include && !activeZoos.includes(zoo)) {
                zooContent += `
                    <h3>
                        <a href="${zoo.link}" class="has-text-weight-semibold">${zoo.name}</a>
                    </h3>
                    <h5 class="is-size-5">
                        <a href="${zoo.maps}">${zoo.location}</a>
                    </h5>
                    <p class="is-size-6">
                        ${reviews}
                    </p>
                    <br>
                `;

                activeZoos.push(zoo);

            }

        });

        // if there are no zoos, display error message
        if (zooContent === '') {
            zooContent = `
                <p class="is-size-5 has-text-centered m-3">
                    <i>There are no zoos with all of your selected animals!</i>
                </p>
                `

        }
        return zooContent;

    }

    // replace content with main content
    content.innerHTML = `
        <img src="images/logo.png" style="height: 90px" alt="Web Safari">
        <hr>
        <div class="title">
            Plan your safari today!
        </div>
        <div class="columns">
            <div class="column is-one-fifth"></div>
            <div class="column is-size-5">
                <p>
                    <b>Web Safari</b> is a tool for identifying which midwestern zoo is right for you. Select which animals you would most like to see and check out which zoos have them all!
                </p>
            </div>
            <div class="column is-one-fifth"></div>
        </div>
        <div class="columns p-5">
            <!-- Animal Selector -->
            <div class="card column has-background-info-light p-5 is-one-quarter">
                <p class="panel-heading">
                    Choose your animals:
                </p>
                <div class="panel-block">
                <button id="go" class="button has-text-info-light has-text-weight-bold is-primary is-large is-fullwidth">Go!</button>
                </div>
                <div id="checkboxes">${checkboxes}</div>
            </div>
            <!-- Zoos -->
            <div class="column has-text-left is-size-4 px-6" id="zoo-content">
                ${loadZooContent()}
            </div>
            <!-- Interactive sidebar -->
            <div class="card column has-background-info-light is-one-quarter">
                <p class="panel-heading">
                    Been to a zoo?
                    <br>
                    Leave a review!
                </p>
                <form id="review">
                    <p class="p-1">
                        <div class="select">
                            <select id="zoo-selector">
                                <option value="Columbus Zoo and Aquarium">Columbus Zoo And Aquarium</option>
                                <option value="Henry Vilas Zoo">Henry Vilas Zoo</option>
                                <option value="Lincoln Park Zoo">Lincoln Park Zoo</option>
                                <option value="Milwaukee County Zoo">Milwaukee County Zoo</option>
                                <option value="Minnesota Zoo">Minnesota Zoo</option>
                            </select>
                        </div>
                        <textarea class="textarea mt-2" id="review-text" placeholder="Your review" lines="12"></textarea>
                        <p class="p-1">
                            <b>Score</b>:&nbsp;
                            <input type="radio" name="score" value="1"> 1&nbsp;
                            <input type="radio" name="score" value="2"> 2&nbsp;
                            <input type="radio" name="score" value="3"> 3&nbsp;
                            <input type="radio" name="score" value="4"> 4&nbsp;
                            <input type="radio" name="score" value="5"> 5&nbsp;
                        </p>
                        <button class="button" id="submit-review">Submit for approval</button>
                    </p>
                </form>
                <p class="panel-heading my-3">
                    About
                </p>
                <p class="mb-2">
                    <b>Web Safari</b> was first developed in late 2021 and has been guiding animal lovers to the best exhibits all around the midwest ever since. Issues? Feedback? Are we missing your local zoo or favorite animal? <b>Contact us</b> below!
                </p>
                <form id="feedback">
                    <p class="p-1 is-centered">
                        <input id="feedback-email" class="input signedout" type="text" placeholder="Your email">
                        <textarea id="feedback-text" class="textarea mt-2 mb-1" placeholder="Your message" lines="12"></textarea>
                    </p>
                    <button class="button" id="submit-feedback">Submit</button>
                </form>
            </div>
        </div>
        `;

    const reviewForm = element('review');
    const submitReview = element('submit-review');

    const feedbackForm = element('feedback');
    const submitFeedback = element('submit-feedback');

    // review form
    submitReview.onclick = () => {
        // prevent auto refresh on the page
        event.preventDefault();

        // get review data
        const score = document.querySelector('input[type="radio"]:checked').value;
        const text = element('review-text').value;
        const reviewZoo = element('zoo-selector').value;

        // create review
        const newReview = {
            zoo: reviewZoo,
            user: currUser().email,
            score: score,
            text: text
        }

        // add to the database to be reviewed
        db.collection('unapproved').add(newReview).then(() => {
            // reset the form
            reviewForm.reset();

        });

        // import new reviews
        if (currUser().admin) {
            unapprovedReviews = data('unapproved');

        }


    }

    // feedback form
    submitFeedback.onclick = () => {
        // prevent auto refresh on the page
        event.preventDefault();

        let email;

        // if the user is signed in, then get their email
        if (auth.currentUser) { email = auth.currentUser.email }
        // otherwise, pull from the email field
        else { email = element('feedback-email').value; }

        // get feedback
        const text = element('feedback-text').value;
        // create message
        const newMessage = {
            email: email,
            message: text
        }

        // add to the database
        db.collection('messages').add(newMessage).then(() => {
            // reset the form
            feedbackForm.reset();

        });

    }

    go.onclick = () => {
        element('zoo-content').innerHTML = loadZooContent();

    }

}

function animalPage(type) {
    // clear content
    content.innerHTML = '';

    // loop through each animal
    animals.forEach(animal => {
        // if this animal is in the intended kingdom...
        if (animal.type === type) {
            // create list of zoos with this animal
            let currZoos = '';

            // loop through each zoo
            zoos.forEach(zoo => {
                // if this animal is in this zoo...
                if (zoo.animals.includes(animal.name)) {
                    // if no zoos have yet been identified, just add the zoo name
                    if (currZoos === '') {
                        currZoos += zoo.name;
                        
                    }
                    // otherwise, add a bullet point and the zoo name
                    else {
                        currZoos += ` &bull; ${zoo.name}`;

                    }

                }

            });
            // if the animal is not a favorite, show the favorite button and hide the remove favorite button
            let button = '';

            if (favorites.includes(animal.name)) {
                if (auth.currentUser) {
                    button += `
                        <span class="has-text-right">
                            <button class="button is-warning is-hidden favorite signed signedin" id="${animal.name}Favorite">Favorite</button>
                            <button class="button is-danger remove signedin" id="${animal.name}Remove">Remove favorite</button>
                        </span>
                        `;

                } else {
                    button += `
                    <span class="has-text-right">
                        <button class="button is-warning is-hidden favorite signed signedin" id="${animal.name}Favorite">Favorite</button>
                        <button class="button is-danger is-hidden remove signedin" id="${animal.name}Remove">Remove favorite</button>
                    </span>
                    `;

                }
                // otherwise, vice versa

            } else {
                if (auth.currentUser) {
                    button += `
                        <span class="has-text-right">
                            <button class="button is-warning favorite signed signedin" id="${animal.name}Favorite">Favorite</button>
                            <button class="button is-danger is-hidden remove signedin" id="${animal.name}Remove">Remove favorite</button>
                        </span>
                        `;

                } else {
                    button += `
                    <span class="has-text-right">
                        <button class="button is-warning is-hidden favorite signed signedin" id="${animal.name}Favorite">Favorite</button>
                        <button class="button is-danger is-hidden remove signedin" id="${animal.name}Remove">Remove favorite</button>
                    </span>
                    `;

                }

            }

            // add card for that animal to content
            content.innerHTML += `
                <div class="card m-4">
                    <div class="card-content">
                        <div class="media">
                            <div class="media-left">
                                <figure class="image is-128x128">
                                    <img src="images/${animal.name}.png" alt="${animal.name}">
                                </figure>
                            </div>
                            <div class="has-text-left media-content">
                                <p class="is-size-4 has-text-weight-bold">
                                    ${animal.name}&nbsp;${button}
                                </p>
                                <hr>
                                <p class="has-text-weight-bold">
                                    ${currZoos}
                                </p>
                                <hr>
                                <p>
                                    ${animal['description']}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                `;

        }

    });

    // set favorites
    const favoriteButtons = document.querySelectorAll('.favorite');
    const removeButtons = document.querySelectorAll('.remove');

    favoriteButtons.forEach(button => { 
        // when the button is clicked...
        button.onclick = () => {
            // update variables
            favorites.push(button.id.slice(0, -8));

            // add to the database
            db.collection('users').doc(auth.currentUser.uid).update({favorites: firebase.firestore.FieldValue.arrayUnion(button.id.slice(0, -8))});

            // hide button
            button.classList.add('is-hidden');

            // loop through opposite buttons
            removeButtons.forEach(remove => {
                // show opposite button
                if (remove.id.slice(0, -6) === button.id.slice(0, -8)) {
                    (remove.classList.remove('is-hidden'));

                }

            });

        }

    });

    // remove favorites
    removeButtons.forEach(button => { 
        // when the button is clicked...
        button.onclick = () => {
            // update variable
            favorites = removeItem(favorites, button.id.slice(0, -6));

            // remove from the database
            db.collection('users').doc(auth.currentUser.uid).update({favorites: firebase.firestore.FieldValue.arrayRemove(button.id.slice(0, -8))});

            // hide button
            button.classList.add('is-hidden');

            // loop through opposite buttons
            favoriteButtons.forEach(favorite => {
                // show opposite button
                if (favorite.id.slice(0, -8) === button.id.slice(0, -6)) {
                    (favorite.classList.remove('is-hidden'));

                }

            });

        }

    });

}

function configureContent(active) {
    const signedIn = document.querySelectorAll('.signedin');
    const signedOut = document.querySelectorAll('.signedout');
    const favoriteButtons = [...document.querySelectorAll('.favorite')];
    const removeButtons = [...document.querySelectorAll('.remove')];

    function bothButtons() {
        if (favoriteButtons.length === 0) {
            return [];

        } else {
            return [...favoriteButtons, ...removeButtons];

        }

    }

    // if the user is signed in...
    if (active) {
        // create checkboxes
        let checkboxes = '';

        // loop through each animal
        animals.forEach(animal => {
            // if the animal is a favorite, add additional HTML to check the box
            let checked = '';

            if (favorites.includes(animal.name)) { checked = ' checked'; }

            // add animal to list of checkboxes
            checkboxes += `
                <div class="panel-block">
                    <input type="checkbox" value="${animal.name}"${checked} class="search">
                    ${animal.name}
                </div>
                `;

        });

        const checkdiv = element('checkboxes');

        if (checkdiv) { checkdiv.innerHTML = checkboxes; }

        // show all elements with the signedin class and hide all the elements with the signedout class
        signedIn.forEach(element => {
            if (!bothButtons().includes(element) || favoriteButtons.includes(element) && !favorites.includes(element.id.slice(0, -8)) || removeButtons.includes(element) && favorites.includes(element.id.slice(0, -6)) ) {
                element.classList.remove('is-hidden');

            }

        });

        signedOut.forEach(element => { element.classList.add('is-hidden'); });

        if (currUser().admin) { unapprovedReviews = data('unapproved'); }
        // DISABLED: access admin content
        // if (currUser().admin) {
        //     admin.classList.remove('is-hidden');
        // }
    // otherwise...
    } else {
        // hide all elements with the signedin class and show all the elements with the signedout class
        signedIn.forEach(element => {
            element.classList.add('is-hidden');

        });

        signedOut.forEach(element => {
            element.classList.remove('is-hidden');

        });

        admin.classList.add('is-hidden');

    }

}

function approve(review) {
    // if the user is an administrator...
    if (currUser().admin) {
        // encoder
        let id;

        zoos.forEach(zoo => {
            if (zoo.name === review.zoo) {
                id = zoo.id;

            }

        });

        // add review to zoo
        db.collection('zoos').doc(id).update({ 
            reviews: firebase.firestore.FieldValue.arrayUnion({
                text: review.text,
                score: review.score
            })

        });

        // remove review from unapproved
        db.collection('unapproved').doc;

    }

}

// show/hide modals
showModal(signin, signinModal);
hideModal(signinBackground, signinModal);
hideModal(signinClose, signinModal);

showModal(signup, signupModal);
hideModal(signupBackground, signupModal);
hideModal(signupClose, signupModal);

showModal(admin, inboxModal);
hideModal(inboxBackground, inboxModal);
hideModal(inboxClose, inboxModal);

// sign up users
signupForm.addEventListener('submit', (event) => {
    // prevent auto refresh on the page
    event.preventDefault();

    // grab email and password
    const email = element('email-signup').value;
    const password = element('password-signup').value;

    // create user
    auth.createUserWithEmailAndPassword(email, password).then(credentials => {
        console.log("Account created!");
        console.log(`UID: ${credentials.user.uid}`);
        console.log(`Email: ${credentials.user.email}`);

        // create user data
        db.collection('users').doc(credentials.user.uid).set({
            email: credentials.user.email,
            uid: credentials.user.uid,
            favorites: [],
            admin: false
        });

        // reset the form
        signupForm.reset();

        // hide the modal
        signupModal.classList.remove('is-active');
        signupError.innerHTML = '';

    // catch errors
    }).catch(err => {
        console.log(err)

        // display error message on modal
        signupError.innerHTML = `${err.message}`;

    })

});

let invalidCredentials = 0;

// sign in users
signinForm.addEventListener('submit', (event) => {
    // prevent auto refresh on the page
    event.preventDefault();

    // grab email and password
    const email = element('email-signin').value;
    const password = element('password-signin').value;

    auth.signInWithEmailAndPassword(email, password).then(credentials => {
        console.log("Signed in!");
        console.log(`UID: ${credentials.user.uid}`);
        console.log(`Email: ${credentials.user.email}`);

        favorites = currUser().favorites;

        // reset the form 
        signinForm.reset();

        // hide the modal
        signinModal.classList.remove('is-active');
        signinError.innerHTML = '';
        forgot.classList.add('is-hidden');
        recover.classList.add('is-hidden');

    // catch errors
    }).catch(err => {
        console.log(err)
        // display error message on modal
        if (err.message === 'Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.') {
            signinError.innerHTML = `${err.message.slice(0, 88)}`;

        } else { signinError.innerHTML = `${err.message}`; }

        // if the user has entered invalid credentials 3 times, display the forgot password button
        if (invalidCredentials >= 3) { 
            forgot.classList.remove('is-hidden');

            forgot.onclick = () => {
                recover.classList.remove('is-hidden');
                db.collection('forgot').doc(email).set({ });

            }

        }
        // otherwise, if the user has entered invalid credentials, add to the counter
        else if (err.message === "The password is invalid or the user does not have a password.") { invalidCredentials++ }

    });

});

// enable sign out
element('signout').onclick = () => {
    // reset variables
    favorites = Array();
    // sign out
    auth.signOut();
    console.log("Signed out!");

}

// check status
auth.onAuthStateChanged(user => {
    // if a user is signed in...
    if (user) {
        // configure content
        configureContent(true);

    // otherwise...
    } else {
        // configure content
        configureContent();

    }

});

// initialize content
auth.signOut();

setTimeout(() => { homePage() }, 2000);

configureContent();

// nav burger
const burger = element('burger');

burger.onclick = () => {
    const navLinks = element('nav-links');

    if (navLinks.classList.contains('is-active')) {
        burger.classList.remove('is-active');
        navLinks.classList.remove('is-active');

    } else {
        burger.classList.add('is-active');
        navLinks.classList.add('is-active');

    }

}

// dynamically change content of the box div depending on different links clicked if content is ready
home.onclick = () => { 
    if (content.innerHTML !== loader) { 
        homePage() 
    
    } 

}

const animalPages = [
    [mammals, "mammal"],
    [birds, "bird"],
    [reptiles, "reptile"],
    [amphibians, "amphibian"], 
    [fish, "fish"]
];

animalPages.forEach(page => {
    page[0].onclick = () => { 
        if (content.innerHTML !== loader) {
            animalPage(page[1]);

        }

    }

});

sources.onclick = () => {
    if (content.innerHTML !== loader) {
        content.innerHTML = `
        <div class="has-text-left p-5">
            <p class="is-size-4">Animal clipart</p>
                <p>
                    <i>Clipart Library</i>, <a href="http://clipart-library.com/">http://clipart-library.com/</a>.
                </p>
            <p class="is-size-4">Favicon</p>
                <p>
                    <i>Favicon.io</i>, <a href="https://favicon.io/">https://favicon.io/</a>.
                </p>
            <p class="is-size-4">Loader</p>
                <p>
                    <i>W3Schools</i>, <a href="https://www.w3schools.com/howto/howto_css_loader.asp">https://www.w3schools.com/howto/howto_css_loader.asp</a>.
                </p>
            <p class="is-size-4">Remove item from array function</p>
                <p>
                    <i>Stack Overflow</i>, <a href="https://stackoverflow.com/a/5767357/17406015">https://stackoverflow.com/a/5767357/17406015</a>.
                </p>
        </div>
        `;

    }

}