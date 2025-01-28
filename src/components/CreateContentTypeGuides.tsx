import React, { useState } from 'react';
import {
  Modal,
  TextInput,
  Button,
  Flex,
  IconButton,
  Note,
  Paragraph,
  Form,
} from '@contentful/f36-components';
import { PlusIcon, DeleteIcon } from '@contentful/f36-icons';
import { ContentTypeGuide } from '../@types';

type CreateContentTypeGuidesProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    guides: {
      contentType: string;
      defaultGuideId: string; 
      guideId: string 
    }[]
  ) => void;
  validate: (contentTypes: string[]) => string[];
};

const CreateContentTypeGuides = ({
  isOpen,
  onClose,
  onSave,
  validate,
}: CreateContentTypeGuidesProps) => {
  const [error, setError] = useState<string>('');
  const [contentTypesInUse, setContentTypesInUse] = useState<string[]>([]);
  const [guides, setGuides] = useState<{
    contentType: string;
    defaultGuideId: string;
    guideId: string;
  }[]>([{
    contentType: '',
    defaultGuideId: '', 
    guideId: '',
  }]);

  const handleAddGuide = () => {
    setGuides([...guides, {
      contentType: '',
      defaultGuideId: '',
      guideId: '',
    }]);
  };

  const handleRemoveGuide = (index: number) => {
    setGuides(guides.filter((_, i) => i !== index));
  };

  const handleGuideChange = (
    index: number,
    field: 'defaultGuideId' | 'guideId' | 'contentType',
    value: string
  ) => {
    const updatedGuides = [...guides];
    updatedGuides[index][field] = value;
    setGuides(updatedGuides);
  };

  const handleSave = () => {
    const inUse = validate(guides.map(guide => guide.contentType))


    if (inUse.length) {
      setContentTypesInUse(inUse);
      setError('One or more of the content types are already in use.');
      return;
    }

    onSave(guides);
    onClose();
  };

  return (
    <Modal isShown={isOpen} onClose={onClose} size="large" position="top">
      <Modal.Header title="Create Content Type Guides" onClose={onClose} />
      <Form onSubmit={handleSave}>
        <Modal.Content>
          {Boolean(error) && (
            <Note variant="negative" title="Error">
              <Paragraph>
                {error}
                {contentTypesInUse.length > 0 && (
                  <ul>  
                    {contentTypesInUse.map((err, index) => (
                      <li key={index}>{err}</li>
                    ))}
                  </ul>
                )}
              </Paragraph>
            </Note>
          )}
          <Flex flexDirection="column" gap="spacingL" justifyContent="space-between" marginTop="spacingL">
            {guides.map((guide, index) => (
              <Flex
                justifyContent="space-between"
                key={index} 
                alignItems="center" 
                gap="spacingL" 
              >
                <TextInput
                  hidden
                  placeholder="Default Guide ID"
                  value={guide.defaultGuideId}
                  onChange={(e) =>
                    handleGuideChange(index, 'defaultGuideId', e.target.value)
                  }
                />
                <TextInput
                  placeholder="Content Type ID"
                  value={guide.contentType}
                  isRequired
                  onChange={(e) =>
                    handleGuideChange(index, 'contentType', e.target.value)
                  }
                />
                <TextInput
                  placeholder="Guide ID"
                  value={guide.guideId}
                  isRequired
                  onChange={(e) =>
                    handleGuideChange(index, 'guideId', e.target.value)
                  }
                />
                {guides.length > 1 && (
                  <IconButton
                    variant="negative"
                    icon={<DeleteIcon />}
                    aria-label="Remove Guide"
                    onClick={() => handleRemoveGuide(index)}
                  />
                )}
              </Flex>
            ))}
          </Flex>
        </Modal.Content>
        <Modal.Controls>
          <Button variant="positive" type="submit">
            Save
          </Button>
          <Button
            variant="secondary"
            startIcon={<PlusIcon />}
            onClick={handleAddGuide}
          >
            Add Antoher
          </Button>

          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </Modal.Controls>
      </Form>
    </Modal>
  );
};

export default CreateContentTypeGuides;
