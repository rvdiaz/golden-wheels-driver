import React from 'react';
import HtmlViewer from '~/codidge_components/UI/htmlViewer';

export default function DescriptionSection({ htmlDescription }: { htmlDescription: string }) {
  return <HtmlViewer htmlDescription={htmlDescription} title="Description" />;
}
