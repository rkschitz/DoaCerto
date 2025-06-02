import { Row, FloatingLabel, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import validator from 'validator';

export default function InputEmail({ value, onChange, onBlur }) {
    return (
        <FloatingLabel controlId="floatingInputEmail" label="Email">
            <Form.Control
                type="text"
                placeholder="Email"
                value={value}
                onChange={(e) =>
                    onChange(e.target.value)
                }
                onBlur={() => {
                    if (!validator.isEmail(value)) { toast.error('Email inválido'); };
                    onBlur()
                }}
            />
        </FloatingLabel>
    );
}