import * as React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
          <meta name="theme-color" content="#000000" />
          <link rel="manifest" href="static/manifest.json" />
          <link rel="shortcut icon" href="static/favicon.ico" />
          <link
            rel="stylesheet"
            href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
