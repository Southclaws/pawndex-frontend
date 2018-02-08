import * as React from "react";
import { Grid, Loader, Header } from "semantic-ui-react";
// import * as d3 from "d3";

export interface Package {
    user: string;
    repo: string;
    dependencies?: string[];
    classification: "full" | "basic" | "buried";
    stars: number;
    updated: Date;
}

interface Props {
    pkg?: Package;
}
interface State {}

export class PackageView extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    render() {
        if (this.props.pkg === undefined) {
            return <Loader active content="Loading" />;
        }
        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column>
                        <Header>
                            {this.props.pkg.user}/{this.props.pkg.repo}
                        </Header>
                        Depends on{" "}
                        {this.props.pkg.dependencies === undefined
                            ? 0
                            : this.props.pkg.dependencies.length}{" "}
                        packages.
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <p>(Coming soon: Graphs!)</p>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}
