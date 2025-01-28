import { Modal, Button, Paragraph } from '@contentful/f36-components';
import { ContentType } from '../@types';

type DeleteContentTypeGuideModalProps = {
  isOpen: boolean;
  contentType: ContentType;
  onClose: () => void;
  onDelete: (contentType: ContentType) => void;
};

const DeleteContentTypeGuideModal = ({
  isOpen,
  onClose,
  contentType,
  onDelete,
}: DeleteContentTypeGuideModalProps) => (
  <Modal isShown={isOpen} onClose={onClose} size="large" position="top">
    <Modal.Header title="Delete Content Type Guide" onClose={onClose} />
    <Modal.Content>
      <Paragraph>
        Are you sure you want to delete <strong>{contentType}</strong>?
      </Paragraph>
    </Modal.Content>
    <Modal.Controls>
      <Button variant="negative" onClick={() => {
        onDelete(contentType);
        onClose();
      }}>
        Delete
      </Button>
      <Button variant="secondary" onClick={onClose}>
        Cancel
      </Button>
    </Modal.Controls>
  </Modal>
);

export default DeleteContentTypeGuideModal;