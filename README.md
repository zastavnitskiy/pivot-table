Pivot table demo.

# Features

- [Pivot table: data aggregation functionality](https://en.wikipedia.org/wiki/Pivot_table)
- Configured in code, with the possibility to build a UI configuration editor
- Async data loading

# How to run

The application is bootstrapped with Creat-react-app.

- `yarn install`
- `yarn start`

The latest version is deployed to https://pivot-table.netlify.com/

# Architecture Overview

Core logic of the component(aggreation and pivoting) is separated from the React UI layer.

## Data flow

[`PivotTable/components/Manager`](src/components/PivotTable/components/Manager/Manager.tsx)

1. ↓(raw data)

[`PivotTable/components/Table`](src/components/PivotTable/components/Table/Table.tsx)

2. ↓(raw data) 5. ↑(rows, columns, values)

[`PivotTable/Pivot`](src/components/PivotTable/Pivot/Pivot.ts)

3. ↓(raw data) 4. ↑(aggregated data)

[`PivotTable/Aggregator`](src/components/PivotTable/Aggregator)

## Components and Classes

### [`PivotTable/components/Manager`](src/components/PivotTable/components/Manager/Manager.tsx)

This component handles the state of the pivot table. It will fetch the data, keep track of loading state and error handling.

In the future, this component will also keep the state of the form toggles(dark mode, density, null-values).

`PivotTable/components/Manager` fetches the data and then renders `PivotTable/components/Table`

### [`PivotTable/components/Table`](src/components/PivotTable/components/Table/Table.tsx)

`PivotTable/components/Table` is a stateless component that implements table UI.

It receives raw data as props, does data processing using `Pivot` class, and then renders table nicely.

### [`PivotTable/Pivot`](src/components/PivotTable/Pivot/Pivot.ts)

`PivotTable/Pivot` is a class that does data processing:
First, it uses `PivotTable/Aggregator` to aggregate the data and then does another data transformation to create rows, columns and values.

Important architecture boundary — this class is not aware of anything UI specific, and doesn't import anything from React components.

This boundary allows us to reuse this class in the other applications if needed — for example, build a Vue version of Pivot Table, or integrate it into a command-line application.

### [`PivotTable/Aggregator`](src/components/PivotTable/Aggregator)

This class does data aggregation. It is not aware of Pivot specifics, like rows and columns — it only operates with metrics and dimensions.

Aggregator also contains [aggregation functions](src/components/PivotTable/Aggregator/aggregationFunctions.ts)

It can easily be part of Pivot class itself, but separating it simplifies testing and makes each piece easier to understand.

# Assumptions and Simplifications

## Hierarchy of the dimensions

Based on provided design and explanations, I'm assuming that row and column dimensions are hierarchical; that sub-dimension only makes sense within a dimension.

This means that we are not showing sub-dimension aggregations for all parent dimensions, e.g. a single sub-category sales from all categories.

This assumption applies in the React component(presentational) layer. `Pivot` and `Aggregator` are doing aggregations for all combinations of dimensions, so we can tweak the UI to show all dimensions, or add a parameter.

## Reasonable amount of aggregations

Given K Dimensions and N data rows, we will do K^2\*N operations, which might be a lot for the browser even with small values of K.

I'm not talking about Big O notation, as RAM model is too generic for performance evaluation of js code running in the browser. Javascript and React specifics like memory allocation and garbage collection, single thread, React tree re-rendering, are more likely candidates for performance degradation in this type of programs.

## Stickiness

Sticky behaviour of the left column is implemented using vanilla CSS. Current solution is not generic enough as it relies on several hard-coded values, for example, on the number of row dimensions or width of row dimension columns.

When more than 2 row dimensions are specified, sticky behaviour of the row headers is broken.

Stickiness is an essential part of the UI, so we would need to fix it before releasing the component to the users.

That would require handling scroll events in javascript or using a custom library.

CSS `position: sticky` won't allow required experience (freezing top tows + left column + footer column).

## No collapsing of the categories

Provided design mockup has checkboxes next to top-level categories. Assuming it means that it's possible to collapse categories, I didn't implement it to reduce the scope of the work.

## No error handling

If data fetching function will throw, or data would contain wrong values for measures or dimensions, the application will crash.

In a real-world scenario, we would think about possible error cases and handle them nicely — by retrying data fetching, or ignoring wrong data entries, or showing a clear error message to the user.

## Missing features

Density, null-values toggle, dark-mode are not implemented to reduce the scope.

## Performance

I wasn't paying much attention to the performance, as the primary goal was to make it work, and work right.

As Kent Beck said in his famous quote, making it fast is the next step.

# Next Steps

- Refactor table rendering code(needs cleaning up)
- Refactor the way I use dimensions in the code
  - Currently I use dimensions in several different ways(object, array of values, array of indexes)
  - All those ways can be combined into a single data structure and generalized
- Implement sticky headers properly
- Implement missing features
- Ensure design matches the mockup
- Ensure there are no obvious performance issues
- Ensure [accessibility guidelines](https://www.w3.org/WAI/tutorials/tables/) are met
