import { aggregationFunctions } from "./aggregationFunctions";
import { dimensionGroupsForEntry, dimensionsGroupKey } from "./utilities";
import { AggregationTypes, DataEntry } from "../index";

export type DimensionKeys = string[];
export interface DimensionValues {
  [key: string]: number | string;
}

export interface DimensionsGroup {
  dimensions: DimensionValues;
  value: number;
}

interface AggregationFn {
  (entries: number[]): number;
}

interface AggregatorConfig {
  data: DataEntry[];
  dimensions: string[];
  value: string;
  aggregationType: AggregationTypes;
}
export class Aggregator {
  constructor(config: AggregatorConfig) {
    const { data, dimensions, value, aggregationType } = config;
    this._dimensions = dimensions;
    this._groups = new Map();
    this._value = value;
    this._aggregationFn = aggregationFunctions[aggregationType];
    data.forEach(entry => this.addEntry(entry));
  }
  private _dimensions: string[];
  private _aggregationFn: AggregationFn;
  private _groups: Map<String, AggregationGroup>;
  private _value: string;

  private addEntry(entry: DataEntry) {
    const dimensionGroups = dimensionGroupsForEntry(this._dimensions, entry);
    for (let dimensionGroup of dimensionGroups) {
      const key = dimensionsGroupKey(dimensionGroup);
      const group = this._groups.get(key);
      if (group) {
        group.addEntry(entry);
      } else {
        this._groups.set(key, new AggregationGroup(entry, dimensionGroup));
      }
    }
  }

  groups(): DimensionsGroup[] {
    const result: DimensionsGroup[] = [];
    for (let aggregationGroup of Array.from(this._groups.values())) {
      result.push({
        value: aggregationGroup.aggregate(this._aggregationFn, this._value),
        dimensions: aggregationGroup.dimensions
      });
    }
    return result;
  }
}
class AggregationGroup {
  private _entries: DataEntry[];
  public constructor(entry: DataEntry, dimensions: DimensionValues) {
    this._entries = [];
    this.dimensions = dimensions;
    this.addEntry(entry);
  }

  public dimensions: DimensionValues;

  public addEntry(entry: DataEntry) {
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
