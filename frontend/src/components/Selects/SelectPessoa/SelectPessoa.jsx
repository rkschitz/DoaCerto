import { FloatingLabel, Form } from "react-bootstrap";
import PessoaLocalizador from "../../Localizadores/LocalizadorPessoa/LocalizadorPessoa";
import { useState } from "react";

export default function SelectPessoa({ label, onChange, value, disabled }) {

    const [openLocalizadorPessoa, setOpenLocalizadorPessoa] = useState(false);
    const [pessoa, setPessoa] = useState();

    return (
        <>
            <FloatingLabel controlId="floatingInput" label={label}>
                <Form.Control
                    type="text"
                    placeholder="Nome"
                    value={pessoa?.nome ? pessoa?.nome : value ? value : ""}
                    onClick={() => {
                        setOpenLocalizadorPessoa(true);
                    }}
                    onFocus={(e) => {
                        setOpenLocalizadorPessoa(true);
                        e.target.blur();
                    }}
                    disabled={disabled}
                />
            </FloatingLabel>
            <PessoaLocalizador
                onSelect={(pessoa) => {
                    setPessoa({
                        ...pessoa,
                        idPessoa: pessoa.idPessoa,
                        nome: pessoa.nome
                    });
                    onChange(pessoa)
                    setOpenLocalizadorPessoa(false);
                }}
                show={openLocalizadorPessoa}
                setShow={setOpenLocalizadorPessoa}
            />
        </>
    )
}