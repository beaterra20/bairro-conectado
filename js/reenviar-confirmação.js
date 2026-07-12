const formReenvio = document.getElementById("form-reenvio");
const mensagemReenvio = document.getElementById("mensagem-reenvio");

formReenvio.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document
        .getElementById("email-reenvio")
        .value
        .trim();

    mensagemReenvio.textContent = "Enviando novo link...";

    const { error } = await supabaseClient.auth.resend({
        type: "signup",
        email,
        options: {
            emailRedirectTo:
                "http://127.0.0.1:5500/confirmação-conta.html"
        }
    });

    if (error) {
    console.error("Erro no reenvio:", error);

    mensagemReenvio.textContent =
        "Erro: " + error.message;

    return;
}
    mensagemReenvio.textContent =
        "Novo e-mail de confirmação enviado. Verifique sua caixa de entrada.";
});