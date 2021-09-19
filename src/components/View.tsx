import { isArr, randomString, upperCase } from "@jk/utils";
import { csv } from "d3-fetch";
import { createRef, PropsWithChildren, ReactNode, useEffect, useState } from "react";
import {
    Checkbox,
    CheckboxProps,
    Grid,
    List,
    Menu,
    MenuItemProps,
    Segment,
} from "semantic-ui-react";
import { dummy } from "../dummy";
import { useQueryOrder } from "../context/QueryContext";
import { ClassName } from "../utils/string.utils";
import Canvas from "./CanvasD3";

export {};

export interface ViewProps {
    className?: string;
}

namespace View {
    export interface ControlProps {}
    export interface ControlItemProps extends MenuItemProps {
        data: EntryData<QueryEnumData>;
        // setCheck(id: string): void
    }

    export function Control(p: ControlProps) {
        const compId = useState(randomString())[0];
        const qctx = useQueryOrder<QueryEnumData>();
        const [active, setActive] = useState(-1);

        const m = qctx.data
            .filter((e) => e.check)
            .map((e, i) => {
                const key = `${compId}-${i}`;
                return <ControlItem index={i + 1} key={key} data={e} />;
            });

        return (
            <div className="control">
                <div className="control-wrap">
                    {qctx.data
                        .filter((e) => e.check)
                        .map((e, i) => {
                            const key = `${compId}-${i}`;

                            return (
                                <Menu
                                    key={key}
                                    className="control-item"
                                    vertical
                                >
                                    <ControlItem data={e} />
                                </Menu>
                            );
                        })}
                </div>
            </div>
        );
    }
    export function ControlItem(p: ControlItemProps) {
        const compId = useState(randomString(15))[0];
        const { data: entry, ...props } = p;
        const { data, id } = entry;

        const qctx = useQueryOrder();

        return (
            <Menu.Item>
                <Menu.Header as="h3">{upperCase(entry.text, true)}</Menu.Header>
                <List as="ul" bulleted={false}>
                    {Object.keys(data.value).map((e, i) => {
                        const key = `${compId}-${i}`;
                        const value = entry.data.value[e];
                        return (
                            <List.Item as="li" key={key}>
                                <Checkbox
                                    checked={isArr(value) ? value[1] : value}
                                    onClick={(ev, ed) => {
                                        qctx.setEnum(id, e, ed.checked);
                                    }}
                                    label={e}
                                />
                            </List.Item>
                        );
                    })}
                </List>
            </Menu.Item>
        );
    }

    export function Content() {
        const [dimension, setDimension] = useState<[number, number]>([] as any);

        useEffect(function() {
            // if(divRef.current) {
            //     const div = divRef.current;
            //     const css = getComputedStyle(div);

            //     setDimension([
            //         parseInt(css.width.replace("px", "")),
            //         parseInt(css.height.replace("px", "")),
            //     ])
            // }
        });

        return (
            <div className="content">
                <Canvas data={dummy.slice(0, 200)} />
                {/* <Canvas height={dimension[1]} width={dimension[0]} /> */}
            </div>
        );
    }
}

export default View;
