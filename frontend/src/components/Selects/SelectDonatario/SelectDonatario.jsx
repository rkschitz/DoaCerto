import { FloatingLabel, Form } from "react-bootstrap";
import { useState } from "react";
import LocalizadorDonatario from "../../Localizadores/LocalizadorDonatario/LocalizadorDonatario";

export default function SelectDonatario({ label, onChange, value, disabled }) {

    const [openLocalizadorDonatario, setOpenLocalizadorDonatario] = useState(false);
    const [donatario, setDonatario] = useState();

    return (
        <>
            <FloatingLabel controlId="floatingInput" label={'Donatário'}>
                <Form.Control
                    type="text"
                    placeholder="Nome"
                    value={donatario?.nome ? donatario?.nome : value ? value : ""}
                    disabled={disabled}
                    onClick={() => {
                        setOpenLocalizadorDonatario(true);
                    }}
                />
            </FloatingLabel>
            <LocalizadorDonatario
                onSelect={(donatario) => {
                    setDonatario({
                        ...donatario,
                        idPessoa: donatario.idPessoa,
                        nome: donatario.nome
                    });
                    onChange(donatario)

                }}
                show={openLocalizadorDonatario}
                setShow={setOpenLocalizadorDonatario}
            />
        </>
    )
}