import * as React from "react";
import { BrowserRouter, Switch, Route, Link, RouteComponentProps } from "react-router-dom";
import { Grid, Container, Header, Modal, Button, Icon, Loader } from "semantic-ui-react";

import "./App.css";
import { PackageList } from "./List";
import { Package, PackageView } from "./Package";

interface Props {}
interface State {
    error: string;
    list?: Package[];
}

class App extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
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

    render() {
        return (
            <BrowserRouter>
                <Container>
                    <Grid relaxed divided>
                        <Grid.Row>
                            <Grid.Column>
                                <Header>
                                    <Link to="/">Pawndex</Link>
                                    {" - "}
                                    <Modal trigger={<Button size="tiny">?</Button>}>
                                        <Modal.Header>Help</Modal.Header>
                                        <Modal.Content>
                                            <Modal.Description>
                                                <p>
                                                    This index lists valid Pawn packages from
                                                    GitHub.
                                                </p>
                                                <p>
                                                    The icons indicate the classification of the
                                                    package:
                                                </p>
                                                <ul>
                                                    <li>
                                                        <Icon
                                                            size="large"
                                                            name="check circle"
                                                            color="yellow"
                                                            verticalAlign="middle"
                                                        />
                                                        A full Pawn Package that contains package
                                                        definition file
                                                    </li>
                                                    <li>
                                                        <Icon
                                                            size="large"
                                                            name="check circle"
                                                            color="teal"
                                                            verticalAlign="middle"
                                                        />
                                                        Contains .inc or .pwn files at the top-most
                                                        level, still compatible with{" "}
                                                        <a href="http://bit.ly/sampctl">sampctl</a>.
                                                    </li>
                                                    <li>
                                                        <Icon
                                                            size="large"
                                                            name="circle outline"
                                                            disabled
                                                            verticalAlign="middle"
                                                        />
                                                        A repository that contains .inc or .pwn
                                                        files somewhere, requires user to specify
                                                        include path.
                                                    </li>
                                                </ul>
                                            </Modal.Description>
                                        </Modal.Content>
                                    </Modal>
                                </Header>
                                <Container>
                                    An automated list of Pawn Packages from GitHub - fully
                                    compatible with <a href="http://bit.ly/sampctl">sampctl</a>!
                                </Container>
                            </Grid.Column>
                        </Grid.Row>
                        <Switch>
                            <Route
                                exact
                                path="/"
                                render={() => <PackageList list={this.state.list} />}
                            />
                            <Route
                                path="/:user/:repo"
                                render={(
                                    props: RouteComponentProps<{ user: string; repo: string }>
                                ) => {
                                    if (this.state.list === undefined) {
                                        return <Loader active content="Loading" />;
                                    }
                                    let target: Package | undefined = undefined;
                                    for (let index = 0; index < this.state.list.length; index++) {
                                        const pkg = this.state.list[index];

                                        if (
                                            pkg.user === props.match.params.user &&
                                            pkg.repo === props.match.params.repo
                                        ) {
                                            target = pkg;
                                            break;
                                        }
                                    }
                                    if (target !== undefined) {
                                        return <PackageView pkg={target} />;
                                    } else {
                                        return <Loader active content="Loading" />;
                                    }
                                }}
                            />
                        </Switch>
                    </Grid>
                </Container>
            </BrowserRouter>
        );
    }
}

export default App;
