import { useState, useEffect, useCallback, useMemo } from 'react';
import { ConfigAppSDK } from '@contentful/app-sdk';
import {
  Heading,
  Flex,
  Button,
  Modal,
  Paragraph,
  ButtonGroup,
  Note,
} from '@contentful/f36-components';
import { CycleIcon, PlusCircleIcon } from '@contentful/f36-icons';
import { css } from 'emotion';
import { useSDK } from '@contentful/react-apps-toolkit';
import { ConfigProvider, useConfig } from '../context/ConfigContext';
import { AppInstallationParameters, ContentType, ContentTypeGuide } from '../@types';
import ContentTypeGuideTable from '../components/ContentTypeGuideTable';
import CreateContentTypeGuides from '../components/CreateContentTypeGuides';

const ConfigScreen = () => {
  const sdk = useSDK<ConfigAppSDK>();
  const { contentTypeGuides } = useConfig();

  const [parameters, setParameters] = useState<AppInstallationParameters>({
    contentTypeGuides: {},
  });
  const [syncPreview, setSyncPreview] = useState<AppInstallationParameters | null>(null);
  const [showAddNewGuideModal, setShowAddNewGuideModal] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [createdGuides, setCreatedGuides] = useState<string[] | null>(null);

  // Fetch current app parameters
  useEffect(() => {
    const fetchParameters = async () => {
      const currentParameters: AppInstallationParameters | null = await sdk.app.getParameters();

      if (currentParameters?.contentTypeGuides) {
        setParameters(currentParameters);
      } else {
        const defaultParameters = {
          contentTypeGuides: Object.fromEntries(
            Object.entries(contentTypeGuides).map(([key, value]) => [
              key,
              { defaultGuideId: value, guideId: null },
            ])
          ),
        };
        setParameters(defaultParameters);
      }
      sdk.app.setReady();
    };

    fetchParameters();
  }, [sdk, contentTypeGuides]);

  // Handle configuration changes
  const onConfigure = useCallback(async () => {
    const currentState = await sdk.app.getCurrentState();
    return { parameters, targetState: currentState };
  }, [parameters, sdk]);

  useEffect(() => {
    sdk.app.onConfigure(onConfigure);
  }, [sdk, onConfigure]);

  // Update app parameters
  const updateInstallationParameters = useCallback(
    (contentType: ContentType, defaultGuideId: string, guideId: string | null) => {
      setParameters((prev) => ({
        ...prev,
        contentTypeGuides: {
          ...prev.contentTypeGuides,
          [contentType]: { defaultGuideId, guideId },
        },
      }));
    },
    []
  );

  // Delete a content type from parameters
  const deleteInstallationParameter = useCallback((contentType: ContentType) => {
    setParameters((prev) => {
      const updatedContentTypeGuides = Object.fromEntries(
        Object.entries(prev.contentTypeGuides || {}).filter(([key]) => key !== contentType)
      );
      return { ...prev, contentTypeGuides: updatedContentTypeGuides };
    });
  }, []);

  // Sync with default configuration
  const syncWithDefaultConfig = useCallback(() => {
    const syncedParameters = {
      contentTypeGuides: {
        ...parameters.contentTypeGuides,
        ...Object.fromEntries(
          Object.entries(contentTypeGuides).map(([key, value]) => [
            key,
            {
              defaultGuideId: value,
              guideId: parameters.contentTypeGuides?.[key as ContentType]?.guideId || null,
            },
          ])
        ),
      },
    };
    setSyncPreview(syncedParameters);
    setIsSyncModalOpen(true);
  }, [contentTypeGuides, parameters]);

  // Accept or reject sync changes
  const acceptChanges = useCallback(() => {
    if (syncPreview) {
      setParameters(syncPreview);
    }
    setIsSyncModalOpen(false);
  }, [syncPreview]);

  const rejectChanges = useCallback(() => {
    setSyncPreview(null);
    setIsSyncModalOpen(false);
  }, []);

  // Merge newly created guides
  const mergeNewGuides = useCallback(
    (newGuides: { contentType: string; defaultGuideId: string; guideId: string }[]) => {
      const transformedGuides = newGuides.reduce((acc, guide) => {
        acc[guide.contentType as ContentType] = {
          defaultGuideId: guide.defaultGuideId,
          guideId: guide.guideId,
        };
        return acc;
      }, {} as ContentTypeGuide);

      setParameters((prev) => ({
        ...prev,
        contentTypeGuides: { ...prev.contentTypeGuides, ...transformedGuides },
      }));
      setCreatedGuides(newGuides.map((guide) => guide.contentType));
    },
    []
  );

  // Validate content types
  const checkIfContentTypeExists = useCallback(
    (contentTypes: string[]): string[] =>
      contentTypes.filter((type) => parameters.contentTypeGuides?.hasOwnProperty(type)),
    [parameters]
  );

  const contentTypeGuideEntries = useMemo(
    () => parameters.contentTypeGuides || {},
    [parameters]
  );

  return (
    <ConfigProvider>
      <Flex flexDirection="column" className={css({ margin: '80px auto', maxWidth: '1440px' })}>
        {createdGuides && (
          <Note
            variant="positive"
            title="Guides Created"
            onClose={() => setCreatedGuides(null)}
            className={css({ marginBottom: '32px' })}
            withCloseButton
          >
            <Paragraph>Successfully created guides for the following content types:</Paragraph>
            <ul>
              {createdGuides.map((contentType, index) => (
                <li key={index}>{contentType}</li>
              ))}
            </ul>
          </Note>
        )}

        <Flex justifyContent="space-between" alignItems="center">
          <Heading>Publishing Hub User Guide Config</Heading>
          <ButtonGroup variant="spaced" spacing="spacingM">
            <Button
              variant="positive"
              startIcon={<PlusCircleIcon />}
              onClick={() => setShowAddNewGuideModal(true)}
              size="small"
            >
              Add
            </Button>
            <Button
              variant="secondary"
              startIcon={<CycleIcon />}
              onClick={syncWithDefaultConfig}
              size="small"
            >
              Sync with default config
            </Button>
          </ButtonGroup>
        </Flex>

        {contentTypeGuideEntries && (
          <ContentTypeGuideTable
            entries={parameters}
            updateInstallationParameter={updateInstallationParameters}
            deleteInstallationParameter={deleteInstallationParameter}
          />
        )}

        {isSyncModalOpen && (
          <Modal onClose={rejectChanges} isShown size="fullWidth" position="top">
            <Modal.Header title="Confirm Changes" onClose={rejectChanges} />
            <Modal.Content>
              <Paragraph>Are you sure you want to apply the following changes?</Paragraph>
              {syncPreview && (
                <ContentTypeGuideTable previewMode entries={syncPreview} />
              )}
            </Modal.Content>
            <Modal.Controls>
              <Button onClick={acceptChanges} variant="positive">
                Accept
              </Button>
              <Button variant="negative" onClick={rejectChanges}>
                Reject
              </Button>
            </Modal.Controls>
          </Modal>
        )}

        {showAddNewGuideModal && (
          <CreateContentTypeGuides
            isOpen={showAddNewGuideModal}
            onClose={() => setShowAddNewGuideModal(false)}
            onSave={(newGuide) => {
              mergeNewGuides(newGuide);
              setShowAddNewGuideModal(false);
            }}
            validate={checkIfContentTypeExists}
          />
        )}
      </Flex>
    </ConfigProvider>
  );
};

export default ConfigScreen;
