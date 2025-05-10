export default function formatarDataBRCHora(data) {
    const date = new Date(data)
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };
    const response = new Intl.DateTimeFormat('pt-BR', options).format(date);
    return response.replace(',', '');
}