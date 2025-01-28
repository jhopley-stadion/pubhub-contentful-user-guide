import { Box, Button, Paragraph, Subheading } from '@contentful/f36-components';
import { SidebarAppSDK } from '@contentful/app-sdk';
import { useSDK } from '@contentful/react-apps-toolkit';
import { ConfigProvider } from '../context/ConfigContext';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { css } from 'emotion';

const iframeContainerStyle = css({
  position: 'relative',
  paddingBottom: 'calc(50.416666666666664% + 41px)',
  height: 0,
  width: '100%',
});

const iframeStyle = css({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  colorScheme: 'light',
});

const Sidebar = () => {
  const sdk = useSDK<SidebarAppSDK>();
  const [arcadeVideoId, setArcadeVideoId] = useState<string | null>(null);
  const [showingArcadeVideo, setShowingArcadeVideo] = useState<boolean>(false);

  const findContentTypeInInstallationParameters = useCallback(
    (contentType: string) => sdk.parameters.installation.contentTypeGuides?.[contentType],
    [sdk.parameters.installation.contentTypeGuides]
  );

  useEffect(() => {
    const contentTypeUserGuide = findContentTypeInInstallationParameters(sdk.ids.contentType);
    setArcadeVideoId(contentTypeUserGuide?.guideId ?? contentTypeUserGuide?.defaultGuideId ?? null);
    sdk.window.startAutoResizer();
  }, [sdk.ids.contentType, findContentTypeInInstallationParameters, sdk.window]);

  const handleButtonClick = useCallback(() => {
    setShowingArcadeVideo(true);
  }, []);

  const iframeSrc = useMemo(() => {
    return `https://demo.arcade.software/${arcadeVideoId}?embed&embed_mobile=inline&embed_desktop=inline&show_copy_link=true`;
  }, [arcadeVideoId]);

  return (
    <ConfigProvider>
      <Box>
        <Subheading>Need Help?</Subheading>
        {!arcadeVideoId ? (
          <Paragraph marginTop="spacingM">
            Oops, it looks like we can't find a help tutorial for this. Get in touch if you have questions!
          </Paragraph>
        ) : !showingArcadeVideo ? (
          <div>
            <Paragraph marginTop="spacingM">
              Watch an interactive tutorial for this feature.
            </Paragraph>
            <Button isFullWidth variant="secondary" size="small" onClick={handleButtonClick}>
              Go
            </Button>
          </div>
        ) : (
          <div className={iframeContainerStyle}>
            <iframe
              src={iframeSrc}
              title="Uploading Assets and Creating Image Entries (single and bulk)"
              frameBorder="0"
              loading="lazy"
              allowFullScreen
              allow="clipboard-write"
              className={iframeStyle}
            />
          </div>
        )}
      </Box>
    </ConfigProvider>
  );
};

export default Sidebar;
