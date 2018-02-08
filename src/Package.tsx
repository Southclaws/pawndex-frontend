import * as React from "react";
import { Grid, Loader, Header } from "semantic-ui-react";
import { InteractiveForceGraph, ForceGraphNode, ForceGraphArrowLink } from "react-vis-force";

export interface Package {
    user: string;
    repo: string;
    dependencies?: string[];
    classification: "full" | "basic" | "buried";
    stars: number;
    updated: Date;
}

interface GraphNode {
    id: string;
    group: number;
}

interface GraphLink {
    source: string;
    target: string;
    value: number;
}

interface GraphData {
    nodes: GraphNode[];
    links: GraphLink[];
}

interface Props {
    pkg?: Package;
    all: Package[];
}
interface State {}

export class PackageView extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    pkgFromName(name: string): Package | undefined {
        let split = name.split("/");
        if (split.length !== 2) {
            return undefined;
        }

        let user = split[0];
        let repo = split[1];

        for (let index = 0; index < this.props.all.length; index++) {
            const element = this.props.all[index];
            if (element.user === user && element.repo === repo) {
                return element;
            }
        }
        return undefined;
    }

    buildTree(): GraphData | undefined {
        if (this.props.pkg === undefined) {
            return undefined;
        }

        let result: GraphData = {
            nodes: [],
            links: []
        };

        let visited = new Object();

        let recurse = (pkgName: string, depth: number) => {
            if (visited[pkgName] !== true) {
                result.nodes.push({
                    id: pkgName,
                    group: depth++
                });
                visited[pkgName] = true;
            }

            let pkg = this.pkgFromName(pkgName);
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

        recurse(this.props.pkg.user + "/" + this.props.pkg.repo, 0);

        return result;
    }

    render() {
        if (this.props.pkg === undefined) {
            return <Loader active content="Loading" />;
        }

        let graph = <p>No graph for this package.</p>;
        let tree = this.buildTree();
        if (tree !== undefined) {
            graph = (
                <InteractiveForceGraph
                    simulationOptions={{
                        strengh: 0.1,
                        animate: true,
                        height: 400,
                        width: 400,
                        radiusMargin: 100
                    }}
                >
                    {tree.nodes.map((value: GraphNode, index: number, array: GraphNode[]) => {
                        let r = index === 0 ? 10 : 7.5;
                        r -= value.group;
                        if (r < 2) {
                            r = 2;
                        }

                        let h = Math.random() * 360;
                        let s = 80 - value.group * 20;
                        let l = 60 - value.group * 10;
                        let fill = `hsl(${h}, ${s}%, ${l}%)`;

                        return (
                            <ForceGraphNode key={index} node={{ id: value.id }} fill={fill} r={r} />
                        );
                    })}
                    {tree.links.map((value: GraphLink, index: number, array: GraphLink[]) => {
                        return (
                            <ForceGraphArrowLink
                                key={index}
                                link={{ source: value.source, target: value.target }}
                            />
                        );
                    })}
                </InteractiveForceGraph>
            );
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
                    <Grid.Column>{graph}</Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

export default PackageView;