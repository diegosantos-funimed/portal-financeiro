export default function handleStatusFlag(ticket){
    if (ticket.anexoNF === false) {
        return "not_send"
    } else if (ticket.anexoNF === true && ticket.aprovadoNF === null){
        return "reproved"
    } else if (ticket.aprovadoNF === true){
        return "approved"
    } else if (ticket.paid === true){
        return "paid"
    } else {
        return "pending"
    }
}