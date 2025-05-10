import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import './styles.css'

function InputFloatingLabel(props) {
    return (
        <>
            <FloatingLabel
                controlId="floatingInput"
                label={props.label}
                className="mb-1 floatingLabel"
            >
                <Form.Control type={props.type} placeholder={props.label} value={props.value} onChange={props.onChange} />
            </FloatingLabel>
        </>
    );
}

export default InputFloatingLabel;