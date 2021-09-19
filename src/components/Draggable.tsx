import React, { useState } from "react";

import {
    closestCenter,
    CollisionDetection,
    DndContext,
    DropAnimation,
    defaultDropAnimation,
    KeyboardSensor,
    Modifiers,
    MouseSensor,
    PointerActivationConstraint,
    TouchSensor,
    UniqueIdentifier,
    useSensor,
    useSensors,
    DraggableSyntheticListeners,
    DragStartEvent,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    useSortable,
    SortableContext,
    sortableKeyboardCoordinates,
    SortingStrategy,
    rectSortingStrategy,
    AnimateLayoutChanges,
} from "@dnd-kit/sortable";

import { Checkbox, Menu, Ref } from "semantic-ui-react";
import { randomString } from "@jk/utils";

import { ClassName } from "../utils/string.utils";
import { useQueryOrder } from "../context/QueryContext";
import "@Style/draggable.scss";

export interface DraggableProps<T extends QueryEnumData> {
    activationConstraint?: PointerActivationConstraint;
    animateLayoutChanges?: AnimateLayoutChanges;
    adjustScale?: boolean;
    collisionDetection?: CollisionDetection;
    Container?: any; // To-do: Fix me
    dropAnimation?: DropAnimation | null;
    itemCount?: number;
    items: EntryData<T>[];
    handle?: boolean;
    modifiers?: Modifiers;
    renderItem?: any;
    removable?: boolean;
    strategy?: SortingStrategy;
    useDragOverlay?: boolean;
    getItemStyles?(args: {
        id: UniqueIdentifier;
        index: number;
        isSorting: boolean;
        isDragOverlay: boolean;
        overIndex: number;
        isDragging: boolean;
    }): React.CSSProperties;
    isDisabled?(id: UniqueIdentifier): boolean;
}
interface DraggableItemProps<T extends QueryEnumData> {
    data: EntryData<T>;
    index: number;
    useDragOverlay?: boolean;
    style(values: any): React.CSSProperties;
    animateLayoutChanges?: AnimateLayoutChanges;
}
const defaultDropAnimationConfig: DropAnimation = {
    ...defaultDropAnimation,
    dragSourceOpacity: 0.5,
};
function Draggable<T extends QueryEnumData>({
    activationConstraint,
    items: initialItems,
    modifiers,
    useDragOverlay = true,
    animateLayoutChanges,
    getItemStyles = () => ({}),
    strategy = rectSortingStrategy,
    collisionDetection = closestCenter,
}: DraggableProps<T>) {
    const compId = randomString(15);
    const qctx = useQueryOrder<T>();

    const [activeId, setActiveId] = useState<string | null>(null);
    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint,
        }),
        useSensor(TouchSensor, {
            activationConstraint,
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const activeIndex = activeId ? qctx.findIndex(activeId) : -1;

    const events = {
        onDragStart(e: DragStartEvent) {
            if (!e.active) return;
            setActiveId(e.active.id);
        },
        onDragEnd({ over }: DragEndEvent) {
            setActiveId(null);

            if (over) {
                const overIndex = qctx.findIndex(over.id);
                if (activeIndex !== overIndex) {
                    qctx.setData((items) =>
                        arrayMove(items, activeIndex, overIndex)
                    );
                }
            }
        },
        onDragCancel() {
            setActiveId(null);
        },
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={collisionDetection}
            modifiers={modifiers}
            {...events}
        >
            <SortableContext items={qctx.data} strategy={strategy}>
                <Menu /* as={"ul"} */ vertical>
                    {qctx.data.map((value) => {

                        return (
                            <DraggableItem
                                key={value.id}
                                data={value}
                                index={value.index}
                                style={getItemStyles}
                                animateLayoutChanges={animateLayoutChanges}
                                useDragOverlay={useDragOverlay}
                            />
                        );
                    })}
                </Menu>
            </SortableContext>
        </DndContext>
    );
}

function DraggableItem<T extends QueryEnumData>({
    data,
    index,
    useDragOverlay,
    style,
    animateLayoutChanges,
}: DraggableItemProps<T>) {
    const qctx = useQueryOrder<T>();

    const id = data.id;
    const {
        attributes,
        isDragging,
        isSorting,
        listeners,
        overIndex,
        setNodeRef,
        transform,
        transition,
    } = useSortable({
        animateLayoutChanges,
        id,
        disabled: false,
    });

    const [check, setCheck] = useState(() => qctx.findIndex(id, true) !== -1);

    return (
        <Ref innerRef={setNodeRef}>
            <Menu.Item
                // as="li"
                className={ClassName("drag-container", {
                    sorting: isSorting,
                    dragOverlay: !useDragOverlay && isDragging,
                })}
                style={
                    {
                        transition,
                        "--translate-x": transform
                            ? `${Math.round(transform.x)}px`
                            : undefined,
                        "--translate-y": transform
                            ? `${Math.round(transform.y)}px`
                            : undefined,
                        "--scale-x": transform?.scaleX
                            ? `${transform.scaleX}`
                            : undefined,
                        "--scale-y": transform?.scaleY
                            ? `${transform.scaleY}`
                            : undefined,
                        "--index": index,
                    } as React.CSSProperties
                }
            >
                <div
                    className={ClassName("drag-item", {
                        dragging: isDragging,
                        dragOverlay: !useDragOverlay && isDragging,
                    })}
                    style={style({
                        index,
                        isDragging,
                        isSorting,
                        overIndex,
                    })}
                    data-cypress="draggable-item"
                    {...listeners}
                    {...attributes}
                    tabIndex={0}
                >
                    <Checkbox
                        checked={check}
                        style={{ marginRight: "1.5rem" }}
                        onClick={(e, cData) => {
                            qctx.setCheck(id, cData.checked);
                        }}
                    />
                    {data.text}
                </div>
            </Menu.Item>
        </Ref>
    );
}

export default Draggable;
