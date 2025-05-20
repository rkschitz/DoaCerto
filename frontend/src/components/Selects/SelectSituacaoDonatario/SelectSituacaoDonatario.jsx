import Select from "../Select/Select";

export default function SelectSituacaoDonatario({ value, onChange }) {
    return (
        <Select label={'Situação do donatário'}
            value={value}
            onChange={onChange}
            options={[{ value: 'A', descricao: 'Aprovado' }, { value: 'P', descricao: 'Pendente' }, { value: 'R', descricao: 'Reprovado' }]}
        />
    )
}