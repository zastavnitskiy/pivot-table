import { AggregationFn, AggregationEntry, DimensionValues } from "./aggregate";

export type DimensionKeys = string[];

export interface DimensionsGroup {
  key: Symbol;
  dimensions: DimensionValues;
  value: number;
}

function entryDimensionsKey(
  dimensions: DimensionKeys,
  entry: AggregationEntry
): Symbol {
  return Symbol.for(dimensions.map(dimension => entry[dimension]).join("--"));
}

export class Aggregator {
  constructor(
    dimensions: string[],
    value: string,
    aggregationFn: AggregationFn
  ) {
    this._dimensions = dimensions;
    this._groups = new Map();
    this._value = value;
    this._aggregationFn = aggregationFn;
  }
  private _dimensions: string[];
  private _aggregationFn: AggregationFn;
  private _groups: Map<Symbol, AggregationGroup>;
  private _value: string;
  addEntry(entry: AggregationEntry) {
    const key = entryDimensionsKey(this._dimensions, entry);
    const group = this._groups.get(key);
    if (group) {
      group.addEntry(entry);
    } else {
      this._groups.set(key, new AggregationGroup(entry, this._dimensions));
    }
  }
  groups(): DimensionsGroup[] {
    const result: DimensionsGroup[] = [];
    for (let aggregationGroup of Array.from(this._groups.values())) {
      const key = aggregationGroup.key;
      result.push({
        key,
        value: aggregationGroup.aggregate(this._aggregationFn, this._value),
        dimensions: aggregationGroup.dimensions
      });
    }
    return result;
  }
}
class AggregationGroup {
  private _entries: AggregationEntry[];
  private _dimensionsKeys: DimensionKeys;
  public constructor(entry: AggregationEntry, dimensions: DimensionKeys) {
    this._entries = [];
    this._dimensionsKeys = dimensions;
    this.addEntry(entry);
  }
  public get dimensions(): DimensionValues {
    const entry = this._entries[0];
    return this._dimensionsKeys.reduce(
      (dimensions: DimensionValues, key: string): DimensionValues => {
        dimensions[key] = entry[key];
        return dimensions;
      },
      {}
    );
  }
  public get key(): Symbol {
    return entryDimensionsKey(this._dimensionsKeys, this._entries[0]);
  }
  public addEntry(entry: AggregationEntry) {
    this._entries.push(entry);
  }
  public aggregate(aggreationFn: AggregationFn, value: string): number {
    return aggreationFn(
      this._entries.map(entry => {
        const entryValue = entry[value];
        if (typeof entryValue !== "number") {
          throw new Error("Entry _value must be a number");
        }
        return entryValue;
      })
    );
  }
}
