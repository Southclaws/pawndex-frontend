import React from 'react';
import App from 'next/app';
import Link from 'next/link';
import Router from 'next/router';
import withGA from 'next-ga';
import { NextSeo } from 'next-seo';
import { Grid, Container as GridContainer, Header } from 'semantic-ui-react';
import fetch from 'isomorphic-unfetch';

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {
      list: undefined,
      error: undefined
    };
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    try {
      const resp = await fetch('https://api.sampctl.com/');
      pageProps.list = await resp.json();
    } catch (e) {
      pageProps.error = e;
    }
    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <NextSeo
          config={{
            title: 'Pawndex - The Pawn Package Index',
            description: 'An index of all packages on GitHub for the Pawn scripting language.',
            canonical: 'https://packages.sampctl.com/'
          }}
        />

        <GridContainer>
          <Grid relaxed divided>
            <Grid.Row />
            <Grid.Row>
              <Grid.Column>
                <Header>
                  <Link href="/">
                    <a>Pawndex</a>
                  </Link>
                </Header>
                <GridContainer>
                  An automated list of Pawn Packages from GitHub - fully compatible with{' '}
                  <a href="http://bit.ly/sampctl">sampctl</a>!
                </GridContainer>
              </Grid.Column>
            </Grid.Row>
            <Component {...pageProps} />
          </Grid>
        </GridContainer>
      </>
    );
  }
}

export default withGA('UA-78828365-10', Router)(MyApp);
