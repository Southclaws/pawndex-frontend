import React, { useState } from 'react';
import Head from 'next/head';
import * as moment from 'moment';
import { Container, Grid, Loader, Icon, Dropdown, DropdownProps, Label } from 'semantic-ui-react';
import { InteractiveForceGraph, ForceGraphNode, ForceGraphArrowLink } from 'react-vis-force';

const pkgFromName = (name, list) => {
  let split = name.split('/');
  if (split.length !== 2) {
    return undefined;
  }

  let user = split[0];
  let repo = split[1];

  for (let index = 0; index < list.length; index++) {
    const element = list[index];
    if (element.user === user && element.repo === repo) {
      return element;
    }
  }
  return undefined;
};

const tagsDropdown = (tags) => {
  const latest = tags !== null ? tags[0] : null;
  const [tag, setTag] = useState(latest);
  if (tags === null) {
    return [null, null];
  }
  return [
    tag,
    <p>
      Version:{' '}
      <Dropdown
        inline
        defaultValue={tag}
        onChange={(_, data) => setTag(data.value)}
        options={tags.map((value) => {
          return {
            text: value,
            value: value
          };
        })}
      />
    </p>
  ];
};

const installerCommand = (pkg, tag) => {
  return (
    <p>
      <Label style={{ fontFamily: 'monospace' }}>
        <p style={{ userSelect: 'all', display: 'inline' }}>
          {`sampctl package install ${pkg.user}/${pkg.repo}` + (tag !== null ? ':' + tag : '')}
        </p>
      </Label>
    </p>
  );
};

const buildTree = (pkg, list) => {
  let result = {
    nodes: [],
    links: []
  };

  let visited = new Object();

  let recurse = (pkgName, depth) => {
    if (visited[pkgName] !== true) {
      result.nodes.push({
        id: pkgName,
        group: depth++
      });
      visited[pkgName] = true;
    }

    let pkg = pkgFromName(pkgName, list);
    if (pkg === undefined || pkg.dependencies === undefined) {
      return;
    }

    for (let i = 0; i < pkg.dependencies.length; i++) {
      const dep = pkg.dependencies[i];

      result.links.push({
        source: pkgName,
        target: dep,
        value: 1
      });

      recurse(dep, depth);
    }
  };

  recurse(pkg.user + '/' + pkg.repo, 0);

  return result;
};

const dependencyGraph = (pkg, list) => {
  const tree = buildTree(pkg, list);
  let graph = (
    <InteractiveForceGraph
      simulationOptions={{
        strengh: 0.1,
        animate: true,
        height: 400,
        width: 400,
        radiusMargin: 100
      }}
    >
      {tree.nodes.map((value, index) => {
        let r = index === 0 ? 10 : 7.5;
        r -= value.group;
        if (r < 2) {
          r = 2;
        }

        let h = Math.random() * 360;
        let s = 80 - value.group * 20;
        let l = 60 - value.group * 10;
        let fill = `hsl(${h}, ${s}%, ${l}%)`;

        return <ForceGraphNode key={index} node={{ id: value.id }} fill={fill} r={r} />;
      })}
      {tree.links.map((value, index) => {
        return (
          <ForceGraphArrowLink
            key={index}
            link={{
              source: value.source,
              target: value.target
            }}
          />
        );
      })}
    </InteractiveForceGraph>
  );

  return graph;
};

const Page = ({ user, repo, list, error }) => {
  const pkg = pkgFromName(`${user}/${repo}`, list);
  if (pkg === undefined) {
    error = `No package found named ${user}/${repo}`;
  }
  if (error !== undefined) {
    return (
      <Grid.Row>
        <Grid.Column>
          <Container>
            <Icon name="exclamation triangle" />
            Error: {JSON.stringify(error)};
          </Container>
        </Grid.Column>
      </Grid.Row>
    );
  }

  const [tag, tags] = tagsDropdown(pkg.tags);

  const graph = dependencyGraph(pkg, list);

  return (
    <>
      <Head title={`${pkg.user}/${pkg.repo} | Pawndex - The Pawn Package Index`} />

      <Grid.Row>
        <Grid.Column>
          <Container>
            <p>
              {`${pkg.stars} stars, updated ${moment(pkg.updated).fromNow()}`}
              {' - '}
              <a href={`https://github.com/${pkg.user}/${pkg.repo}`}>
                View on <Icon name="github" size="large" />
              </a>
            </p>
            {tags}
            {installerCommand(pkg, tag)}
            <p>
              {pkg.dependencies === undefined
                ? 'No dependencies listed'
                : `Depends on ${pkg.dependencies.length} packages`}
            </p>
          </Container>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>{graph}</Grid.Column>
      </Grid.Row>
    </>
  );
};

Page.getInitialProps = async ({ query: { user, repo } }) => {
  return { user, repo };
};

export default Page;
