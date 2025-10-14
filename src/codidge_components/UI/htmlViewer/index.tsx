import React, { useState } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { WebView } from 'react-native-webview';
import Text from '~/codidge_components/UI/text';
import { theme } from '~/theme/theme';

export default function HtmlViewer({
  htmlDescription,
  title,
  containerStyle,
}: {
  htmlDescription: string;
  title?: string;
  containerStyle?: ViewStyle;
}) {
  const [webViewHeight, setWebViewHeight] = useState(200); // Increased fallback height

  const injectedJS = `
    (function() {
      function sendHeight() {
        const height = Math.max(
          document.body.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.clientHeight,
          document.documentElement.scrollHeight,
          document.documentElement.offsetHeight
        );
        window.ReactNativeWebView.postMessage(JSON.stringify({ height: height }));
      }
      
      // Send height when DOM is ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', sendHeight);
      } else {
        sendHeight();
      }
      
      // Send height after images load
      window.addEventListener('load', sendHeight);
      
      // Send height when content changes
      setTimeout(sendHeight, 100);
      setTimeout(sendHeight, 500);
      setTimeout(sendHeight, 1000);
    })();
    true;
  `;

  return (
    <View style={[styles.sectionCard, containerStyle]}>
      {title && <Text style={styles.sectionTitle}>{title}</Text>}
      <WebView
        style={[styles.webview, { height: webViewHeight }]}
        originWhitelist={['*']}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        androidLayerType="hardware"
        javaScriptEnabled={true}
        injectedJavaScript={injectedJS}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.height && data.height > 0) {
              // Add some padding to ensure nothing is cut off
              setWebViewHeight(data.height + 20);
            }
          } catch (e) {
            console.log('Error parsing WebView message:', e);
          }
        }}
        source={{
          html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
              <style>
                * {
                  box-sizing: border-box;
                }
                html, body {
                  margin: 0;
                  padding: 0;
                  width: 100%;
                  overflow-x: hidden;
                }
                body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                  font-size: 14px;
                  color: #4B5563;
                  line-height: 1.6;
                  padding: 8px;
                }
                p { 
                  margin: 8px 0; 
                  word-wrap: break-word;
                }
                ul, ol { 
                  margin: 8px 0; 
                  padding-left: 20px; 
                }
                li { 
                  margin: 4px 0;
                  word-wrap: break-word;
                }
                h1, h2, h3, h4, h5, h6 { 
                  color: #1F2937; 
                  margin: 12px 0 8px 0;
                  word-wrap: break-word;
                }
                a { 
                  color: ${theme.colors.primary};
                  word-wrap: break-word;
                }
                img {
                  max-width: 100%;
                  height: auto;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                }
                pre {
                  overflow-x: auto;
                  white-space: pre-wrap;
                  word-wrap: break-word;
                }
              </style>
            </head>
            <body>
              ${htmlDescription}
            </body>
          </html>
          `,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionCard: {
    backgroundColor: 'white',
    borderRadius: 8,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 12,
    color: '#1F2937',
  },
  webview: {
    width: '100%',
    backgroundColor: 'transparent',
  },
});
