import React from 'react';
import App, { Container } from 'next/app';
import Link from 'next/link';
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
    console.log(this);
    const { Component, pageProps } = this.props;

    return (
      <Container>
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
      </Container>
    );
  }
}

export default MyApp;
