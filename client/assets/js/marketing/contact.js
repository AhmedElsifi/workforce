const contactForm = document.getElementById("contact-form");
const formSuccess = document.getElementById("form-success");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formSuccess.classList.add("visible");
  contactForm.reset();

  setTimeout(() => {
    formSuccess.classList.remove("visible");
  }, 5000);
});
