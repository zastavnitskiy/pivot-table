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

export function classnames(...args: any[]): string {
  return args.filter(arg => Boolean(arg)).join(" ");
}

export function formatNumber(number: number): string {
  return Intl.NumberFormat("en-US").format(number);
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

export const flattenAndSort = (root: Node): string[][] => {
  const result: string[][] = [];

  const visit = (root: Node, values: string[] = []) => {
    const { children, name } = root;
    const childrenToVisit = Object.keys(children).sort(sortWithTotals);
    if (!children || Object.keys(children).length === 0) {
      result.push([...values, name].slice(1));
    }
    for (let childKey of childrenToVisit) {
      visit(children[childKey], [...values, name]);
    }
  };

  visit(root);

  return result;
};

/**
 * Now we need to sort the rows and columns nicely,
 * move total and grand-total rows into their positions.
 *
 * We will do this by converting rows into a dimensions tree, and them flattening back
 * while sorting level by level.
 */
export const sortDimensions = (dimensions: string[][]): string[][] => {
  return flattenAndSort(convertToTree(dimensions));
};
