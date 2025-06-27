document.addEventListener("DOMContentLoaded", function() {
    // Form submission handler
    const contactForm = document.querySelector("#formulario form");
    const formMessages = document.querySelector(".form-messages");

    contactForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const nome = document.getElementById("nome").value.trim();
        const email = document.getElementById("email").value.trim();
        const mensagem = document.getElementById("mensagem").value.trim();

        if (!nome || !email || !mensagem) {
            formMessages.textContent = "Todos os campos são obrigatórios!";
            return;
        }

        formMessages.textContent = "";
        alert("Formulário enviado com sucesso!");
        contactForm.reset();
    });

    // Animação ao Scroll
    const sections = document.querySelectorAll(".content");

    const options = {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px"
    };

    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            }
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        });
    }, options);

    sections.forEach(section => {
        observer.observe(section);
    });
});
