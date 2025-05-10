export default function calcularIdade(dataNascimento) {
    const hoje = new Date();
    
    const nascimento = new Date(dataNascimento);

    if (isNaN(nascimento)) {
        console.error("Data inválida:", dataNascimento);
        return null;
    }

    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();

    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }
    
    return idade;
}
