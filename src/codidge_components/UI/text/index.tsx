import { forwardRef } from 'react';
import { Text as RNText, TextProps } from 'react-native';

const Text = forwardRef<RNText, TextProps>(({ allowFontScaling = false, ...props }, ref) => {
  return <RNText {...props} ref={ref} allowFontScaling={allowFontScaling} />;
});

export default Text;
