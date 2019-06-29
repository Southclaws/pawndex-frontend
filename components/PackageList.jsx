import * as React from 'react';
import { Grid, Input, Checkbox, Radio, List, Segment, Loader } from 'semantic-ui-react';
import * as moment from 'moment';
import * as Fuse from 'fuse.js';

export default class PackageList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      query: '',
      lastInput: 0,
      fullOnly: false,
      sort: 'date'
    };
  }

  onQuery(query) {
    this.setState({ query: query });
  }

  onFilter(filter) {
    this.setState({ fullOnly: filter });
  }

  onSort(value) {
    this.setState({ sort: value });
  }

  filterList(list) {
    if (this.state.query !== '') {
      let fuse = new Fuse(list, {
        shouldSort: true,
        threshold: 0.2,
        location: 0,
        distance: 1,
        maxPatternLength: 32,
        minMatchCharLength: 3,
        keys: ['user', 'repo']
      });
      list = fuse.search(this.state.query);
    }

    let result = list.filter((value) => {
      if (this.state.fullOnly) {
        return value.classification === 'full';
      } else {
        return true;
      }
    });

    return result;
  }

  sortList(list) {
    let result;

    switch (this.state.sort) {
      case 'date':
        result = list.sort((a, b) => {
          if (a.updated > b.updated) {
            return -1;
          } else if (a.updated < b.updated) {
            return 1;
          }
          return 0;
        });
        break;

      case 'stars':
        result = list.sort((a, b) => {
          if (a.stars > b.stars) {
            return -1;
          } else if (a.stars < b.stars) {
            return 1;
          }
          return 0;
        });
        break;

      default:
        result = list;
        break;
    }

    return result;
  }

  renderError(message) {
    return (
      <Segment inverted color="red">
        <p>{message}</p>
      </Segment>
    );
  }
  renderList() {
    if (this.props.list === undefined) {
      return <Loader active content="Loading" />;
    }

    let list = this.sortList(this.filterList(this.props.list));

    return (
      <List divided verticalAlign="middle">
        <List.Item>
          <List.Header>{list.length} Packages</List.Header>
        </List.Item>

        {list.map((value, index) => {
          let icon;

          switch (value.classification) {
            case 'full':
              icon = (
                <List.Icon size="large" name="check circle" color="yellow" verticalAlign="middle" />
              );
              break;

            case 'basic':
              icon = (
                <List.Icon size="large" name="check circle" color="teal" verticalAlign="middle" />
              );
              break;

            case 'buried':
              icon = (
                <List.Icon size="large" name="circle outline" disabled verticalAlign="middle" />
              );
              break;

            default:
              icon = <List.Icon />;
              break;
          }

          let url = 'https://github.com/' + value.user + '/' + value.repo;
          let descriptionText = value.stars + ' stars | updated ' + moment(value.updated).fromNow();

          if (value.dependencies !== undefined) {
            descriptionText +=
              ' | ' +
              (value.dependencies.length === 1
                ? '1 dependency'
                : value.dependencies.length + ' dependencies');
          }
          let description = (
            <p>
              <a href={url}>View on GitHub | </a>
              {descriptionText}
            </p>
          );

          let route = '/' + value.user + '/' + value.repo;

          return (
            <List.Item key={index}>
              {icon}
              <List.Content>
                <List.Header>
                  <a href={`/${value.user}/${value.repo}`}>
                    {value.user}/{value.repo}
                  </a>
                </List.Header>
                <List.Description>{description}</List.Description>
              </List.Content>
            </List.Item>
          );
        })}
      </List>
    );
  }

  render() {
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={6}>
            <Input
              icon="search"
              placeholder="Search..."
              onChange={(e) => {
                this.onQuery(e.target.value);
              }}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={1}>
          <Grid.Column width={4}>
            <Checkbox
              label="Full Packages Only"
              onChange={(e, d) => {
                if (d.checked !== undefined) {
                  this.onFilter(d.checked);
                }
              }}
            />
          </Grid.Column>
          <Grid.Column width={4}>
            <Radio
              label="sort by latest"
              name="sort"
              value="date"
              checked={this.state.sort === 'date'}
              onChange={(e) => this.onSort('date')}
            />
          </Grid.Column>
          <Grid.Column width={4}>
            <Radio
              label="sort by stars"
              name="sort"
              value="stars"
              checked={this.state.sort === 'stars'}
              onChange={(e) => this.onSort('stars')}
            />
          </Grid.Column>
          <Grid.Column width={4}>
            <Radio
              label="sort by relevance"
              name="sort"
              value="rel"
              checked={this.state.sort === 'rel'}
              onChange={(e) => this.onSort('rel')}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            {this.state.error !== '' ? this.renderError(this.state.error) : this.renderList()}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
