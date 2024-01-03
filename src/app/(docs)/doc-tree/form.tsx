"use client";

import { DocPageEntryValue } from "@/app/lib/models/docPages/types";
import { Errors, TextInput } from "@/components/Form";
import Link from "next/link";
import { Dispatch, useEffect, useReducer, useState } from "react";
import { DocsTreeNodeWithKey } from "./page";
import { Button } from "@/components/Button";
import updateDocsTree from "@/app/lib/models/docsTree/actions/update";
import {
  DocsTreeFormErrors,
  DocsTreeFormState,
} from "@/app/lib/models/docsTree/formState";
import { useFormState } from "react-dom";

function modifyArrayAtPath(
  modify: (
    items: DocsTreeNodeWithKey[],
    index: number,
  ) => DocsTreeNodeWithKey[],
  items: DocsTreeNodeWithKey[],
  parents: number[],
  index: number,
) {
  const newItems = [...items];
  if (parents.length === 0) {
    return modify(items, index);
  } else {
    const [currentIndex, ...rest] = parents;
    const currentItem = items[currentIndex];
    const newChildItems = currentItem.children ? [...currentItem.children] : [];
    newItems.splice(currentIndex, 1, {
      ...currentItem,
      children: modifyArrayAtPath(modify, newChildItems, rest, index),
    });
  }
  return newItems;
}

function deleteAtIndex(items: DocsTreeNodeWithKey[], index: number) {
  const newItems = [...items];
  newItems.splice(index, 1);
  return newItems;
}

function deleteAtPath(
  items: DocsTreeNodeWithKey[],
  parents: number[],
  index: number,
) {
  return modifyArrayAtPath(deleteAtIndex, items, parents, index);
}

function insertAtPath(
  items: DocsTreeNodeWithKey[],
  parents: number[],
  index: number,
  newItem: DocsTreeNodeWithKey,
) {
  return modifyArrayAtPath(
    (items, index) => {
      const newItems = [...items];
      newItems.splice(index, 0, newItem);
      return newItems;
    },
    items,
    parents,
    index,
  );
}

interface TreeFormState {
  items: DocsTreeNodeWithKey[];
  nextKey: number;
}

type TreeFormAction =
  | { type: "DELETE"; parents: number[]; index: number }
  | { type: "INSERT"; parents: number[]; index: number }
  | { type: "RESET"; items: DocsTreeNodeWithKey[] };

function treeFormReducer(
  state: TreeFormState,
  action: TreeFormAction,
): TreeFormState {
  switch (action.type) {
    case "DELETE":
      return {
        ...state,
        items: deleteAtPath(state.items, action.parents, action.index),
      };
    case "INSERT":
      return {
        ...state,
        nextKey: state.nextKey + 1,
        items: insertAtPath(state.items, action.parents, action.index, {
          key: state.nextKey,
        }),
      };
    case "RESET":
      return {
        ...state,
        nextKey: 0,
        items: action.items,
      };
  }
}

function RenderedNode({
  node,
  data,
  parents,
  index,
}: {
  node: DocsTreeNodeWithKey;
  data?: DocPageEntryValue;
  dispatch: Dispatch<TreeFormAction>;
  namePrefix: string;
  index: number;
  parents: number[];
}) {
  if (data) {
    const { target } = node;
    return (
      <Link className="underline" href={`/docPage/${target}`}>
        {node.label || data.name}
      </Link>
    );
  } else {
    const { target } = node;
    return target ? (
      <span className="text-red-300">{target}</span>
    ) : (
      <span className="text-gray-400">
        New Item {parents ? `${parents.join(".")}.${index}` : index}
      </span>
    );
  }
}

function TreeFormNode({
  node,
  dataBySlug,
  dispatch,
  index,
  parents = [],
  errors,
}: {
  node: DocsTreeNodeWithKey;
  dataBySlug: Record<string, DocPageEntryValue>;
  dispatch: Dispatch<TreeFormAction>;
  index: number;
  parents?: number[];
  errors?: DocsTreeFormErrors;
}) {
  const data = node.target ? dataBySlug[node.target] : undefined;
  const newParents =
    "children" in node && node.children ? [...parents, index] : undefined;
  const deleteItem = () => {
    dispatch({ type: "DELETE", parents, index });
  };
  const insertItemAbove = () => {
    dispatch({ type: "INSERT", parents, index });
  };
  const addChildItem = () => {
    dispatch({
      type: "INSERT",
      parents: [...parents, index],
      index: node.children?.length || 0,
    });
  };
  const itemName =
    parents.reduce((acc, cur) => acc.concat(`.${cur}.children`), "items") +
    `.${index}`;
  const itemNamePrefix = itemName + ".";
  const itemErrors = errors && errors[itemName];
  const { target, label } = node;
  return (
    <div className="my-1 pl-1">
      <details className="hover:bg-slate-800 transition border pl-1 list-decimal">
        <summary className="min-h-6 pl-1">
          <Errors errors={itemErrors} />
          <RenderedNode
            namePrefix={itemNamePrefix}
            node={node}
            data={data}
            dispatch={dispatch}
            parents={parents}
            index={index}
          />
        </summary>
        <TextInput
          name={itemNamePrefix + "target"}
          label="Target"
          defaultValue={target}
          list="existingDocPages"
        />
        <TextInput
          name={itemNamePrefix + "label"}
          label="Label"
          defaultValue={label}
        />
        <div className="mb-1">
          <Button className="mr-1" onClick={deleteItem}>
            Delete
          </Button>
          <Button className="mr-1" onClick={insertItemAbove}>
            Create Above
          </Button>
          <Button className="mr-1" onClick={addChildItem}>
            Create Child
          </Button>
        </div>
      </details>
      {newParents && (
        <div className="border-l-2 mt-1 ml-0.5 pl-1">
          <ul>
            {(node.children as DocsTreeNodeWithKey[]).map(
              (child, childIndex) => (
                <li key={child.key}>
                  <TreeFormNode
                    node={child}
                    dataBySlug={dataBySlug}
                    dispatch={dispatch}
                    parents={newParents}
                    index={childIndex}
                    errors={errors}
                  />
                </li>
              ),
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function TreeForm({
  items: originalItems,
  dataBySlug,
}: {
  items: DocsTreeNodeWithKey[];
  dataBySlug: Record<string, DocPageEntryValue>;
}) {
  const [{ items }, dispatch] = useReducer(treeFormReducer, {
    items: originalItems,
    nextKey: 1,
  });
  useEffect(() => {
    dispatch({ type: "RESET", items: originalItems });
  }, [originalItems]);
  const initialState = { message: "", errors: {} } as DocsTreeFormState;
  const [formState, formDispatch] = useFormState(updateDocsTree, initialState);

  const { message, errors } = formState || {};
  return (
    <form action={formDispatch}>
      <datalist id="existingDocPages">
        {Object.entries(dataBySlug).map(([slug, { name }]) => (
          <option value={slug}>
            {slug} ({name})
          </option>
        ))}
      </datalist>
      {message && <div>{message}</div>}
      <ul>
        {items.map((node, index) => {
          return (
            <li key={node.key}>
              <TreeFormNode
                node={node}
                dataBySlug={dataBySlug}
                dispatch={dispatch}
                index={index}
                errors={errors}
              />
            </li>
          );
        })}
      </ul>

      <Button
        onClick={() => {
          dispatch({
            type: "INSERT",
            parents: [],
            index: items.length,
          });
        }}
      >
        Append
      </Button>
      <div className="pt-2">
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
}
