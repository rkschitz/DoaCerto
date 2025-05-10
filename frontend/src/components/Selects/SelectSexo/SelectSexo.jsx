import Select from "../Select/Select"
export default function SelectSexo({ onChange, value,disabled }) {
    const opcoes = [
        { value: 'M', descricao: 'Masculino' },
        { value: 'F', descricao: 'Feminino' },
    ]
    return (
        <Select
            options={opcoes}
            onChange={onChange}
            value={value}
            label="Sexo"
            disabled={disabled}
        />
    )
}