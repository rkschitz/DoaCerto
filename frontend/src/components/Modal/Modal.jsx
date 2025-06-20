import { Button, Modal } from 'react-bootstrap';
import styles from "./Modal.module.css";

export default function CustomModal({
  title,
  children,
  show,
  setShow,
  submitText = "Salvar Alterações",
  resetText = "Cancelar",
  submitDisable,
  handleSubmit,
  handleClose
}) {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      dialogClassName={styles.largeModal}
    >
      <Modal.Header closeButton className={styles.modalHeader}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} className={styles.modalButton}>
          {resetText}
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={submitDisable}>
          {submitText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
