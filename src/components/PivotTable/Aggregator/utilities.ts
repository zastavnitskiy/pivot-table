import { DataEntry } from "../index";
import { DimensionKeys, DimensionValues } from "./Aggregator";
/**
 * Generate dimension keys pemutations
 *
 * From:
 * ['state', 'category', 'subcategory']
 *
 * To:
 * [
 * [ 'state', 'category'],
 * [ 'state', 'subcategory' ],
 * [ 'category', 'subcategory' ],
 * [ 'state', ],
 * [ 'subcategory' ],
 * [ 'category'],
 * [  ]
 * ]
 */
export function dimensionKeyPermutations(dimensionsKeys: string[]): string[][] {
  const dimensionKeyGroups = new Map<string, string[]>();
  const double = [...dimensionsKeys, ...dimensionsKeys];
  for (let length = 0; length <= dimensionsKeys.length; length++) {
    for (let start = 0; start < double.length; start++) {
      const group = double.slice(start, start + length).sort();
      dimensionKeyGroups.set(group.join("__"), group);
    }
  }
  return Array.from(dimensionKeyGroups.values());
}

/**
 * When aggregating, each entry will belong to multiple dimension groups:
 * for a combination of all dimensions, for sub-dimension total aggregations,
 * and for grand total, where all entries are combined.
 *
 * This function generates dimensionsGroups based on a given set of dimensions
 * and values for those dimensions.
 */
export function dimensionGroupsForEntry(
  dimensionsKeys: DimensionKeys,
  entry: DataEntry
): DimensionValues[] {
  const dimensionKeyGroups = dimensionKeyPermutations(dimensionsKeys);

  const dimensionValues: DimensionValues = {};
  for (let key of dimensionsKeys) {
    dimensionValues[key] = entry[key];
  }

  const result: DimensionValues[] = [];
  for (let dimensionKeysToExclude of dimensionKeyGroups) {
    const dimensions: DimensionValues = { ...dimensionValues };
    for (let key of dimensionKeysToExclude) {
      dimensions[key] = "*";
    }
    result.push(dimensions);
  }

  return result;
}

export function dimensionsGroupKey(dimensions: DimensionValues): string {
  return Object.keys(dimensions)
    .reduce((result: string[], key) => {
      result.push(`${key}:${dimensions[key]}`);
      return result;
    }, [])
    .join("__");
}
