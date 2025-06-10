import Select from "../Select/Select";

export default function SelectSituacaoCampanha({ onChange, value }) {
    const opcoes = [
        { value: true, descricao: 'Ativas' },
        { value: false, descricao: 'Inativas' },
        { value: 'Todas', descricao: 'Todas' }
    ]

    return (
        <Select
            options={opcoes}
            onChange={onChange}
            value={value}
            label="Situação da Campanha"
        />
    )
}