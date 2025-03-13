export default function formatCNPJ (cnpj) {
    cnpj = cnpj.replace(/\D/g, ''); // Remove tudo que não for número
    if (cnpj.length !== 14) return null; // Retorna null se não tiver 14 dígitos
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}