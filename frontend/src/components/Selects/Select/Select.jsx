import { Form } from "react-bootstrap";

export default function Select({ options, value, onChange, label, disabled, className }) {
    return (
        <Form.Group className={className} controlId="formBasicSelect">
            <Form.Label>{label}</Form.Label>
            <Form.Select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
            >
                <option value="">Selecione</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.descricao}
                    </option>
                ))}
            </Form.Select>
        </Form.Group>
    );
}
