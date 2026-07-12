const btnContinuar = document.getElementById("btn-continuar");
const dadosCadastro = document.getElementById("dados-cadastro");
const etapaSenha = document.getElementById("etapa-senha");
const formCadastro = document.getElementById("form-cadastro");
const campoCep = document.getElementById("cep");

campoCep.addEventListener("input", () => {
    const numeros = campoCep.value.replace(/[^0-9]/g, "").slice(0, 8);

    campoCep.value =
        numeros.length > 5
            ? `${numeros.slice(0, 5)}-${numeros.slice(5)}`
            : numeros;
});

btnContinuar.addEventListener("click", async function () {
    const nome = document.getElementById("nome").value.trim();
    const sobrenome = document.getElementById("sobrenome").value.trim();
    const cep = document.getElementById("cep").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!nome || !sobrenome || !cep || !email) {
        alert("Preencha todos os campos obrigatórios.");
        return;
    }

    const cepNumerico = Number(cep.replace(/\D/g, ""));

    if (cepNumerico.toString().length !== 8) {
        alert("Informe um CEP válido com 8 números.");
        return;
    }

    const { data: regioes, error } = await supabaseClient
        .from("areas_cobertura")
        .select("id")
        .lte("cep_inicial", cepNumerico)
        .gte("cep_final", cepNumerico)
        .eq("ativo", true)
        .limit(1);

    if (error) {
        console.error(error);
        alert("Não foi possível validar o CEP.");
        return;
    }

    if (!regioes || regioes.length === 0) {
        alert("O serviço ainda não está disponível para a região informada.");
        return;
    }

    dadosCadastro.style.display = "none";
    etapaSenha.style.display = "flex";
});

formCadastro.addEventListener("submit", async function (event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const sobrenome = document.getElementById("sobrenome").value.trim();
    const cep = document.getElementById("cep").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    const confirmarSenha =
        document.getElementById("confirmar-senha").value;

    if (senha !== confirmarSenha) {
        alert("As senhas não são iguais.");
        return;
    }

    const senhaValida =
        senha.length >= 8 &&
        /[A-Z]/.test(senha) &&
        /[0-9]/.test(senha) &&
        /[^A-Za-z0-9]/.test(senha);

    if (!senhaValida) {
        alert(
            "A senha precisa ter pelo menos 8 caracteres, uma letra maiúscula, um número e um caractere especial."
        );
        return;
    }

    const { error } = await supabaseClient.auth.signUp({
        email,
    password: senha,
    options: {
        emailRedirectTo:
            "http://127.0.0.1:5500/confirmação-conta.html",

        data: {
            nome,
            sobrenome,
            cep
        }
    }
});

    if (error) {
        console.error(error);
        alert("Erro ao criar conta: " + error.message);
        return;
    }

    window.location.href = "confirmação-conta.html";
});