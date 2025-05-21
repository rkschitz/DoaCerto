import { Row, FloatingLabel, Form, Toast } from 'react-bootstrap';
import InputMask from 'react-input-mask';

export default function InputTelefone({ value, onChange }) {

    return (
        <FloatingLabel controlId="floatingInputTelefone" label="Telefone">
            <InputMask
                key={"(99) 99999-9999"}
                mask={"(99) 99999-9999"}
                value={value}
                onChange={(e) =>
                    onChange(e.target.value)
                }
            >
                {(inputProps) => (
                    <Form.Control
                        {...inputProps}
                        type="text"
                        placeholder="Telefone"
                    />
                )}
            </InputMask>
        </FloatingLabel>
    );
}