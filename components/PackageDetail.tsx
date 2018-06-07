import * as React from "react";
import {
    Grid,
    Loader,
    Icon,
    Dropdown,
    DropdownProps,
    Label
} from "semantic-ui-react";
import * as moment from "moment";
import {
    InteractiveForceGraph,
    ForceGraphNode,
    ForceGraphArrowLink
} from "react-vis-force";

import { Package } from "../types/Package";

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
    all?: Package[];
}
interface State {
    selectedVersion?: string;
}

export default class extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    pkgFromName(name: string, list: Package[]): Package | undefined {
        let split = name.split("/");
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
    }

    buildTree(list: Package[]): GraphData | undefined {
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

            let pkg = this.pkgFromName(pkgName, list);
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
        if (this.props.pkg === undefined || this.props.all === undefined) {
            return <Loader active content="Loading" />;
        }

        let graph = <p>No graph for this package.</p>;
        let tree = this.buildTree(this.props.all);
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
                    {tree.nodes.map(
                        (
                            value: GraphNode,
                            index: number,
                            array: GraphNode[]
                        ) => {
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
                                <ForceGraphNode
                                    key={index}
                                    node={{ id: value.id }}
                                    fill={fill}
                                    r={r}
                                />
                            );
                        }
                    )}
                    {tree.links.map(
                        (
                            value: GraphLink,
                            index: number,
                            array: GraphLink[]
                        ) => {
                            return (
                                <ForceGraphArrowLink
                                    key={index}
                                    link={{
                                        source: value.source,
                                        target: value.target
                                    }}
                                />
                            );
                        }
                    )}
                </InteractiveForceGraph>
            );
        }

        let selectedVersion: string | undefined;
        if (this.state.selectedVersion !== undefined) {
            selectedVersion = this.state.selectedVersion;
        } else if (this.props.pkg.tags !== null) {
            selectedVersion = this.props.pkg.tags[0];
        }

        let dropdownTags: {
            text: string;
            value: string;
        }[] = this.props.pkg.tags.map(
            (value: string, index: number, array: string[]) => {
                return {
                    text: value,
                    value: value
                };
            }
        );

        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column>
                        <p>
                            {`${this.props.pkg.stars} stars, updated ${moment(
                                this.props.pkg.updated
                            ).fromNow()}`}
                            {" - "}
                            <a
                                href={`https://github.com/${
                                    this.props.pkg.user
                                }/${this.props.pkg.repo}`}
                            >
                                View on <Icon name="github" size="large" />
                            </a>
                        </p>
                        {this.props.pkg.tags === null ? null : (
                            <p>
                                Version:{" "}
                                <Dropdown
                                    inline
                                    defaultValue={dropdownTags[0].value}
                                    onChange={(
                                        event: React.SyntheticEvent<
                                            HTMLElement
                                        >,
                                        data: DropdownProps
                                    ) => {
                                        this.setState({
                                            selectedVersion: data.value as string
                                        });
                                    }}
                                    options={dropdownTags}
                                />
                            </p>
                        )}
                        <p>
                            <Label style={{ fontFamily: "monospace" }}>
                                <img
                                    src="http://sampctl.com/sampctl-icon.png"
                                    style={{ marginRight: 10 }}
                                />
                                {`sampctl package install ${
                                    this.props.pkg.user
                                }/${this.props.pkg.repo}` +
                                    (selectedVersion !== undefined
                                        ? ":" + selectedVersion
                                        : "")}
                            </Label>
                        </p>
                        <p>
                            {this.props.pkg.dependencies === undefined
                                ? "No dependencies listed"
                                : `Depends on ${
                                      this.props.pkg.dependencies.length
                                  } packages`}
                        </p>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    {this.props.pkg.dependencies === undefined ? null : (
                        <Grid.Column>{graph}</Grid.Column>
                    )}
                </Grid.Row>
            </Grid>
        );
    }
}
