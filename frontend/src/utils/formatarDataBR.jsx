export default function formatarDataBR(data) {

    if (data) {
        const date = new Date(data)

        const response = new Intl.DateTimeFormat("pt-BR").format(date);
        return response
    }
}