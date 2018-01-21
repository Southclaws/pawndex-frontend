import * as React from "react";
import { Grid, Container, Header, Input, Checkbox, Radio, Segment, List } from "semantic-ui-react";
import * as moment from "moment";
import * as Fuse from "fuse.js";

import "./App.css";

interface Package {
    user: string;
    repo: string;
    dependencies?: string[];
    classification: "full" | "basic" | "buried";
    stars: number;
    updated: Date;
}

interface Props {}
interface State {
    query: string;
    lastInput: number;
    fullOnly: boolean;
    sort: "date" | "stars" | "rel";
    error: string;
    list?: Package[];
}

class App extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            query: "",
            lastInput: 0,
            fullOnly: false,
            sort: "date",
            error: "",
            list: undefined
        };
    }

    async componentDidMount() {
        let resp: Response;
        try {
            resp = await fetch("http://list.packages.sampctl.com");
        } catch (e) {
            this.setState({ error: (e as Error).message });
            return;
        }

        let list: Package[];
        try {
            list = await resp.json();
        } catch (e) {
            this.setState({ error: (e as Error).message });
            return;
        }

        this.setState({ list: list });
    }

    onQuery(query: string) {
        this.setState({ query: query });
    }

    onFilter(filter: boolean) {
        this.setState({ fullOnly: filter });
    }

    onSort(value: "date" | "stars" | "rel") {
        this.setState({ sort: value });
    }

    filterList(list: Package[]) {
        if (this.state.query !== "") {
            let fuse = new Fuse(list, {
                shouldSort: true,
                threshold: 0.2,
                location: 0,
                distance: 1,
                maxPatternLength: 32,
                minMatchCharLength: 3,
                keys: ["user", "repo"]
            });
            list = fuse.search(this.state.query);
        }

        let result = list.filter((value, index, array) => {
            if (this.state.fullOnly) {
                return value.classification === "full";
            } else {
                return true;
            }
        });

        return result;
    }

    sortList(list: Package[]) {
        let result;

        switch (this.state.sort) {
            case "date":
                result = list.sort((a: Package, b: Package) => {
                    if (a.updated > b.updated) {
                        return -1;
                    } else if (a.updated < b.updated) {
                        return 1;
                    }
                    return 0;
                });
                break;

            case "stars":
                result = list.sort((a: Package, b: Package) => {
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

    renderList() {
        if (this.state.list === undefined) {
            return this.renderError("Package list has not been loaded");
        }

        let list = this.sortList(this.filterList(this.state.list));

        return (
            <List divided relaxed>
                <List.Item>
                    <List.Header>{list.length} Packages</List.Header>
                </List.Item>

                {list.map((value: Package, index: number, array: Package[]) => {
                    let icon: JSX.Element;

                    switch (value.classification) {
                        case "full":
                            icon = (
                                <List.Icon
                                    size="large"
                                    name="check circle"
                                    color="yellow"
                                    verticalAlign="middle"
                                />
                            );
                            break;

                        case "basic":
                            icon = (
                                <List.Icon
                                    size="large"
                                    name="check circle"
                                    color="teal"
                                    verticalAlign="middle"
                                />
                            );
                            break;

                        case "buried":
                            icon = (
                                <List.Icon
                                    size="large"
                                    name="circle outline"
                                    disabled
                                    verticalAlign="middle"
                                />
                            );
                            break;

                        default:
                            icon = <List.Icon />;
                            break;
                    }

                    let description =
                        value.stars + " stars | updated " + moment(value.updated).fromNow();

                    if (value.dependencies !== undefined) {
                        description +=
                            " | " +
                            (value.dependencies.length === 1
                                ? "1 dependency"
                                : value.dependencies.length + " dependencies");
                    }

                    return (
                        <List.Item key={index}>
                            {icon}
                            <List.Content>
                                <List.Header
                                    as="a"
                                    href={"https://github.com/" + value.user + "/" + value.repo}
                                >
                                    {value.user}/{value.repo}
                                </List.Header>
                                <List.Description>{description}</List.Description>
                            </List.Content>
                        </List.Item>
                    );
                })}
            </List>
        );
    }

    renderError(message: string) {
        return (
            <Segment inverted color="red">
                <p>{message}</p>
            </Segment>
        );
    }

    render() {
        return (
            <Container>
                <Grid relaxed>
                    <Grid.Row />
                    <Grid.Row>
                        <Grid.Column>
                            <Header>Pawndex</Header>
                            <Container>
                                An automated list of Pawn Packages from GitHub - fully compatible
                                with <a href="http://bit.ly/sampctl">sampctl</a>!
                            </Container>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Input
                                icon="search"
                                placeholder="Search..."
                                onChange={e => {
                                    this.onQuery((e.target as HTMLInputElement).value);
                                }}
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={1}>
                        <Grid.Column width={12}>
                            <Checkbox
                                label="Full Packages Only"
                                onChange={(e, d) => {
                                    if (d.checked !== undefined) {
                                        this.onFilter(d.checked);
                                    }
                                }}
                            />
                        </Grid.Column>
                        <Grid.Column width={12}>
                            <Radio
                                label="sort by latest"
                                name="sort"
                                value="date"
                                checked={this.state.sort === "date"}
                                onChange={e => this.onSort("date")}
                            />
                        </Grid.Column>
                        <Grid.Column width={12}>
                            <Radio
                                label="sort by stars"
                                name="sort"
                                value="stars"
                                checked={this.state.sort === "stars"}
                                onChange={e => this.onSort("stars")}
                            />
                        </Grid.Column>
                        <Grid.Column width={12}>
                            <Radio
                                label="sort by relevance"
                                name="sort"
                                value="rel"
                                checked={this.state.sort === "rel"}
                                onChange={e => this.onSort("rel")}
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            {this.state.error !== ""
                                ? this.renderError(this.state.error)
                                : this.renderList()}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        );
    }
}

export default App;
