import { useState } from 'react';
import { DeleteIcon, EditIcon  } from '@contentful/f36-icons';
import { Badge, Box, Button, ButtonGroup, MissingContent } from '@contentful/f36-components';
import { AppInstallationParameters, ContentType } from '../@types';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@contentful/f36-components';
import EditContentTypeGuideModal from './EditContentTypeGuideModal';
import { contentTypeIdToReadable } from '../utils';
import DeleteContentTypeGuideModal from './DeleteContentTypeGuideModal';

export type ContentTypeGuideTableProps = {
  entries: AppInstallationParameters;
  previewMode?: boolean;
  updateInstallationParameter?: (
    contentType: ContentType,
    defaultGuideId: string,
    guideId: string | null,
  ) => void;
  deleteInstallationParameter?: (contentType: ContentType) => void;
}

const ContentTypeGuideTable = ({ 
  entries, 
  previewMode = false, 
  updateInstallationParameter,
  deleteInstallationParameter,
}: ContentTypeGuideTableProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedContentType, setSelectedContentType] = useState<ContentType | null>(null);

  const handleEditClick = (contentType: ContentType) => {
    setSelectedContentType(contentType);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (contentType: ContentType) => {
    setSelectedContentType(contentType);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedContentType(null);
  };

  return (
    <Box marginTop="spacingXl">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>ContentType</strong></TableCell>
            <TableCell><strong>Id</strong></TableCell>
            <TableCell><strong>Default Guide ID</strong></TableCell>
            <TableCell><strong>Guide ID Override</strong></TableCell>
            {!previewMode && (
              <TableCell align="center"><strong>Actions</strong></TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(
            entries.contentTypeGuides || {}
          ).map(([contentType, { defaultGuideId, guideId }]) => (
            <TableRow key={contentType} >
              <TableCell>
                {contentTypeIdToReadable(contentType as ContentType)}
              </TableCell>
              <TableCell>{contentType}</TableCell>
              <TableCell>
                {defaultGuideId ? (
                  <Badge variant="positive" textTransform="none">
                    {defaultGuideId}
                  </Badge>
                ) : (
                  <MissingContent label="Not set"/>
                )}
              </TableCell>
              <TableCell>
                {guideId ? (
                  <Badge textTransform="none" variant="positive">
                    {guideId}
                  </Badge>
                ) : (
                  <MissingContent label="Not set"/>
                )}
              </TableCell>
              {!previewMode && (
                <TableCell align="right">
                  <ButtonGroup variant="merged">
                    <Button 
                      variant="secondary" 
                      size="small" 
                      startIcon={<EditIcon />} 
                      onClick={() => {
                        handleEditClick(contentType as ContentType)
                      }}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="negative" 
                      size="small" 
                      startIcon={<DeleteIcon />} 
                      onClick={() => {
                        handleDeleteClick(contentType as ContentType)
                      }} 
                    >
                      Delete
                    </Button>
                  </ButtonGroup>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {isEditModalOpen && selectedContentType && entries.contentTypeGuides?.[selectedContentType] && (
        <EditContentTypeGuideModal
          isOpen={isEditModalOpen}
          contentType={selectedContentType}
          defaultGuideId={entries.contentTypeGuides?.[selectedContentType]?.defaultGuideId}
          guideId={entries.contentTypeGuides[selectedContentType]?.guideId || ''}
          onSave={(contentType, defaultGuideId, guideId) => {
            if (updateInstallationParameter) {
              updateInstallationParameter(
                contentType,
                defaultGuideId,
                guideId,
              );
            }
          }}
          onClose={handleCloseModal}
        />
      )}
      {isDeleteModalOpen && selectedContentType && entries.contentTypeGuides?.[selectedContentType] && (
        <DeleteContentTypeGuideModal
          isOpen={isDeleteModalOpen}
          contentType={selectedContentType}
          onClose={() => setIsDeleteModalOpen(false)}
          onDelete={() => {
            if (deleteInstallationParameter) {
              deleteInstallationParameter(selectedContentType);
            }
            setIsDeleteModalOpen(false);
          }}
        />
      )}
    </Box>
  );
};

export default ContentTypeGuideTable;
