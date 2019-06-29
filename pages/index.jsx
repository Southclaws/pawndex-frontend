import * as React from 'react';
import { Grid, Container, Header, Modal } from 'semantic-ui-react';
import { withRouter } from 'next/router';
import Router from 'next/router';
import fetch from 'isomorphic-unfetch';

import PackageList from '../components/PackageList';
import PackageDetail from '../components/PackageDetail';
import HelpModal from '../components/HelpModal';

const Index = ({ list, error }) => {
  if (list === undefined) {
    error = 'No data returned.';
  }
  if (error !== undefined) {
    return <div>{JSON.stringify(error)}</div>;
  }

  return (
    <Container>
      <Grid relaxed divided>
        <Grid.Row />
        <Grid.Row>
          <Grid.Column>
            <Header>
              <a href="/">Pawndex</a>
              {' - '}
              <HelpModal />
            </Header>
            <Container>
              An automated list of Pawn Packages from GitHub - fully compatible with{' '}
              <a href="http://bit.ly/sampctl">sampctl</a>!
            </Container>
          </Grid.Column>
        </Grid.Row>
        <PackageList list={list} />
      </Grid>
    </Container>
  );
};

Index.getInitialProps = async () => {
  console.log('getInitialProps');
  let result = {
    list: undefined,
    error: undefined
  };
  try {
    const resp = await fetch('https://api.sampctl.com/');
    result.list = await resp.json();
  } catch (e) {
    result.error = e;
  }
  return result;
};

export default withRouter(Index);
