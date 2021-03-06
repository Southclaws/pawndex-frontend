import React from 'react';
import { Icon, Grid, Container } from 'semantic-ui-react';

import PackageList from '../components/PackageList';

const Index = ({ list, error }) => {
  if (list === undefined) {
    error = 'No data returned.';
  }
  if (error !== undefined) {
    return <div>{JSON.stringify(error)}</div>;
  }

  return (
    <>
      <Grid.Row>
        <Container>
          <p>This index lists valid Pawn packages from GitHub.</p>
          <p>The icons indicate the classification of the package:</p>
          <ul>
            <li>
              <Icon size="large" name="check circle" color="yellow" />A full Pawn Package that
              contains package definition file
            </li>
            <li>
              <Icon size="large" name="check circle" color="teal" />
              Contains .inc or .pwn files at the top-most level, still compatible with{' '}
              <a href="http://bit.ly/sampctl">sampctl</a>.
            </li>
            <li>
              <Icon size="large" name="circle outline" disabled />A repository that contains .inc or
              .pwn files somewhere, requires user to specify include path.
            </li>
          </ul>
        </Container>
      </Grid.Row>

      <PackageList list={list} />
    </>
  );
};

export default Index;
