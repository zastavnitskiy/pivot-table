export interface Node {
  name: string;
  children: {
    [key: string]: Node;
  };
  value?: number;
}

export function convertToTree(rows: string[][]): Node {
  const addNode = (parent: Node, entry: string[]) => {
    if (!entry) {
      return;
    }

    if (entry.length === 0) {
      return;
    }

    const [name, ...children] = entry;

    if (!parent.children[name]) {
      parent.children[name] = {
        name,
        children: {}
      };
    }
    if (children.length) {
      addNode(parent.children[name], children);
    }
  };

  const root = {
    name: "__root__",
    children: {}
  };

  for (let row of rows) {
    addNode(root, row);
  }

  return root;
}

/**
 * We use * to mark the Total aggregations in the table.
 *
 * We want to show total at the bottom.
 *
 * This is custom localeSort function that use localeSort
 * but accounts for special meaning of "*"
 * and moves it to the bottom of the list.
 *
 */
export function sortWithTotals(a: string, b: string): number {
  if (a === "*") {
    return 1;
  } else if (b === "*") {
    return -1;
  } else {
    return a.localeCompare(b);
  }
}
