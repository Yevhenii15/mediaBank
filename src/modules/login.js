import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";

document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.querySelector(".signup");
    if (signupForm) {
        signupForm.addEventListener("submit", (e) => {
            e.preventDefault()

            const email = signupForm.email.value;
            const password = signupForm.password.value;

            createUserWithEmailAndPassword(auth, email, password)
                .then((cred) => {
                    console.log('user created:', cred.user);
                    signupForm.reset();
                })
                .catch((err) => {
                    console.log(err.message);
                });
        });
    } else {
        console.log("Signup form not found");
    }
});
