import * as React from "react";
import { Grid, Container, Header, Modal } from "semantic-ui-react";
import { withRouter } from "next/router";

import { PackageList, PackageDetail, HelpModal } from "../components";
import { Package } from "../types/Package";

interface Props {
    router: any;
}
interface State {
    error: string;
    list?: Package[];
}

class Index extends React.Component<Props, State> {
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
            resp = await fetch("//list.packages.sampctl.com");
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
        let target: Package | undefined = undefined;
        if (this.state.list !== undefined) {
            for (let index = 0; index < this.state.list.length; index++) {
                const pkg = this.state.list[index];

                if (
                    pkg.user === this.props.router.query.user &&
                    pkg.repo === this.props.router.query.repo
                ) {
                    target = pkg;
                    break;
                }
            }
        }

        return (
            <Container>
                <Grid relaxed divided>
                    <Grid.Row />
                    <Grid.Row>
                        <Grid.Column>
                            <Header>
                                <a href="/">Pawndex</a>
                                {" - "}
                                <HelpModal />
                            </Header>
                            <Container>
                                An automated list of Pawn Packages from GitHub -
                                fully compatible with{" "}
                                <a href="http://bit.ly/sampctl">sampctl</a>!
                            </Container>
                        </Grid.Column>
                    </Grid.Row>
                    <PackageList list={this.state.list} />
                    {target === undefined ? null : (
                        <Modal
                            open={target !== undefined}
                            closeIcon={true}
                            onClose={() => (window.location.href = "/")}
                        >
                            <Modal.Header
                                content={target.user + "/" + target.repo}
                            />
                            <Modal.Content>
                                <PackageDetail
                                    pkg={target}
                                    all={this.state.list}
                                />
                            </Modal.Content>
                        </Modal>
                    )}
                </Grid>
            </Container>
        );
    }
}
export default withRouter(Index);
