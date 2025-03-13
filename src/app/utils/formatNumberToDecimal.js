export default function formatNumberToDecimal(number) {
    if (!number) return "-";
    const parsedNumber = parseFloat(number);
    return parsedNumber.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}