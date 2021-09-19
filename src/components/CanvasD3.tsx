import { isDefined, randomString } from "@jk/utils";
import { hierarchy } from "d3-hierarchy";
import { Component, Context, createRef, useContext } from "react";
import { createPortal } from "react-dom";
import {
    IQueryContext,
    QueryContext,
    QueryEnum,
} from "../context/QueryContext";
import { GgnOpen, HierarchyUtil } from "../dummy";
import { autobind } from "../utils/decorator.utils";

import Tree from "react-d3-tree";

interface CanvasProps {
    data: GgnOpen[];
}
interface CanvasState {}

class Canvas extends Component<
    CanvasProps,
    CanvasState,
    IQueryContext<QueryEnum>
> {
    static contextType = QueryContext;

    constructor(p: CanvasProps) {
        super(p);

        this.state = {};
    }

    context!: IQueryContext<QueryEnum>;
    private readonly cref = createRef<HTMLCanvasElement>();
    private readonly compId = randomString();

    @autobind
    private resizeToParent() {
        // const { cref } = this;
        // if (!cref.current) return;
        // const cvs = cref.current;
        // const parStyle = getComputedStyle(cvs.parentElement!);
        // const width = +parStyle.width.replace("px", "");
        // const height = +parStyle.height.replace("px", "");
        // cvs.width = width;
        // cvs.height = height;
    }

    @autobind
    private toHierarchy() {
        const order = this.context.data.filter((e) => e.check);

        const groupKeys = order.map((e) => e.data.column);
        const groupFns = order.map((e) => {
            const data = e.data;
            const key = data.column;
            return (d: GgnOpen) => d[key];
        });
        if (groupFns.length === 0) return;

        return {
            internal: HierarchyUtil.filterHierarchyValue(
                HierarchyUtil.toHierarchy(this.props.data, ...groupFns),
                order
            ),
            rd3: HierarchyUtil.toRD3Hierarchy(this.props.data, groupKeys)
                .map((e) => HierarchyUtil.filterRD3HierarchyValue(e, order))
                .filter(isDefined),
        };
    }

    @autobind
    private toElement<T extends ObjectType>(md: ModelEntry<T>) {}

    componentDidMount() {
        window.addEventListener("resize", this.resizeToParent);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.resizeToParent);
    }

    render() {
        const h = this.toHierarchy();
        let model: RModelEntry<GgnOpen> | undefined;
        if (h && h.rd3.length !== 0) {
            model = {
                name: "root",
                children: h.rd3,
                data: h.rd3.flatMap(e => e.data)
            }
        }

        // if(h) console.log(HierarchyUtil.modelToQuery(h));
        return <>{
            model && <Tree data={model} collapsible transitionDuration={400} enableLegacyTransitions pathFunc="step" />
        }</>;
    }
}

export default Canvas;
