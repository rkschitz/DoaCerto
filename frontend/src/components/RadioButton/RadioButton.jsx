import { Form } from 'react-bootstrap';

function RadioGroup({ title, name, options, selectedValue, onChange, disabledOptions = [] }) {
  return (
    <Form.Group className="mb-3">
      {title && <Form.Label>{title}</Form.Label>}
      <div>
        {options.map((option, index) => (
          <Form.Check
            key={`${name}-${index}`}
            inline
            type="radio"
            name={name}
            label={option.label}
            id={`${name}-${index}`}
            value={option.value}
            checked={selectedValue === option.value}
            onChange={onChange}
            disabled={disabledOptions.includes(option.value)}
          />
        ))}
      </div>
    </Form.Group>
  );
}

export default RadioGroup;
