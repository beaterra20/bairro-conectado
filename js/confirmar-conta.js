async function ativarConta() {
    const titulo = document.getElementById("titulo-confirmacao");
    const mensagem = document.getElementById("mensagem-confirmacao");

    const parametros = new URLSearchParams(window.location.search);
    const codigo = parametros.get("code");

    if (codigo) {
        const { error: trocaError } =
            await supabaseClient.auth.exchangeCodeForSession(codigo);

        if (trocaError) {
            console.error(trocaError);
            titulo.textContent = "Não foi possível confirmar sua conta";
            mensagem.textContent =
                "O link pode estar inválido ou expirado.";
            return;
        }
    }

    const {
        data: { user },
        error: usuarioError
    } = await supabaseClient.auth.getUser();

    if (usuarioError || !user) {
        console.error(usuarioError);
        titulo.textContent = "Não foi possível identificar sua conta";
        mensagem.textContent =
            "Solicite um novo e-mail de confirmação.";
        return;
    }

    const { error: perfilError } = await supabaseClient
        .from("perfis")
        .update({ status: "Ativa" })
        .eq("id", user.id)
        .eq("status", "Pendente");

    if (perfilError) {
        console.error(perfilError);
        titulo.textContent = "E-mail confirmado";
        mensagem.textContent =
            "Mas não foi possível atualizar o status da conta.";
        return;
    }

    titulo.textContent = "Conta ativada com sucesso!";
    mensagem.textContent =
        "Seu e-mail foi confirmado e sua conta está ativa.";
}

ativarConta();