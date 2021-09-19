import React, { Component, useState } from "react";
// import View, { ViewControl, ViewContent } from "./View";
import {
    Assignment,
    dummy,
    GgnOpen,
    Product,
    Sto,
    Ticket,
} from "../dummy";
import * as d3 from "d3";
import { isUndef, randomString } from "@jk/utils";
import {
    Accordion,
    AccordionTitleProps,
    Grid,
    Menu,
    Sidebar,
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import Draggable from "./Draggable";
import {
    restrictToVerticalAxis,
    restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import {
    createQueryOrder,
    IQueryContext,
    QueryContext,
    QueryEnum,
} from "../context/QueryContext";
import View from "./View";

const keys: (keyof GgnOpen)[] = [
    "assign",
    "gamas",
    "product",
    "sto",
    "ticket",
    "witel",
];

const randId = randomString();

const partialData = dummy.slice(300);
const data: EntryData<QueryEnumData>[] = keys.map((e, i) => {
    const eq = (k: keyof GgnOpen) => k === e;
    const map = (o: ObjectType) => Object.fromEntries(
        Object.keys(o)
        .filter(e => /^(\d+)$/.test(e) === false)
        .map(e => [e, false])
    );

    let enumValue: ObjectType<bool|[string, bool]> = {};
    switch (e) {
        case "assign":
            enumValue = Object.fromEntries(
                Object.keys(Assignment).map(e => [e, false])
            );
            break;
        case "product":
            enumValue = map(Product);
            break;
        case "sto":
            enumValue = Object.fromEntries(
                Object.keys(Sto)
                .filter(e => /^(\d+)$/.test(e) === false)
                .map(e => [e, false])
            )
            break;
        case "ticket":
            enumValue = map(Ticket);
            break;
        case "gamas":
            enumValue = {
                True: false,
                False: false,
            };
            break;
        default:
            const m = [...new Set(partialData.map(d => d[e]))];
            for(const k of m) {
                enumValue[k] = false;
            }
            break;
    }

    return {
        id: `${randId}-${e}`,
        data: new QueryEnum(e, enumValue),
        text: e,
        index: i,
        check: false
    };
});

function App() {
    const compId = randomString();
    const [activeIndex, setActiveIndex] = useState(-1);

    const onClick: AccordionTitleProps["onClick"] = function (e, { index }) {
        setActiveIndex(activeIndex === index ? -1 : (index as int));
    };

    const titles = ["Query Order"];
    const qctx = createQueryOrder(data);

    return (
        <QueryContext.Provider value={qctx}>
            <div className="sidebar" >
                <Sidebar
                    visible
                    style={{
                        display: "block",
                        position: "relative"
                    }}
                >
                    <Menu
                        style={{
                            boxShadow: "none",
                            borderRadius: "none",
                            border: "none",
                        }}
                    ></Menu>
                    <Accordion
                        as={Menu}
                        exclusive={false}
                        vertical
                        style={{
                            width: "inherit",
                            borderRadius: 0,
                        }}
                        // styled
                    >
                        {titles.map((d, i) => {
                            return (
                                <Menu.Item
                                    key={`${compId}=${i}`}
                                    style={{
                                        // maxHeight: "500px",
                                        overflow: "auto",
                                    }}
                                >
                                    <Accordion.Title
                                        active={activeIndex === i}
                                        index={i}
                                        onClick={onClick}
                                        content={d}
                                    />
                                    <Accordion.Content
                                        active={activeIndex === i}
                                        content={
                                            d === titles[0] ? (
                                                <Draggable
                                                    items={data}
                                                    useDragOverlay={false}
                                                    modifiers={[
                                                        restrictToVerticalAxis,
                                                        restrictToWindowEdges,
                                                    ]}
                                                />
                                            ) : null
                                        }
                                    />
                                </Menu.Item>
                            );
                        })}
                    </Accordion>
                </Sidebar>
            </div>

            <main className="view">
                <View.Control />
                <View.Content />
            </main>
        </QueryContext.Provider>
    );
}

export default App;

interface TestComp {
    data: GgnOpen[];
}
interface TestItem {
    data: GgnOpen;
}
