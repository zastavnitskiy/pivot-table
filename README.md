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

Implement sticky headers properly.
Missing features / design alignment
Perfo rmance optimisations
Table Accessibility (ensure [WCAG guidelines](https://www.w3.org/WAI/tutorials/tables/) are met)
