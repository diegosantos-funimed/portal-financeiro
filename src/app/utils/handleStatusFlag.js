export default function handleStatusFlag(ticket) {
    if (ticket.aprovadoNF && ticket.lancamentoTOTVS) {
        return "finished";
    } else if (ticket.lancamentoTOTVS) {
        return "totvs_id";
    } else if (!ticket.anexoNF) {
        return "not_send";
    } else if (ticket.anexoNF) {
        return "sended";
    } else {
        return "pending";
    }
}
