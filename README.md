This is a demo of a Pivot table.

# Features

- [Pivot table: data aggregation functionality](https://en.wikipedia.org/wiki/Pivot_table)
- Configured in code, with possibility to build a UI configuration editor
- Async data loading

# How to run

The application is bootstrapped with Creat-react-app.

- `yarn install`
- `yarn start`

# Simplifications

## Stickyness

Sticky behaviour of the left column is implemented using vanilla CSS. While this is good from the accessibility standpoint, it's not generic enough, and relies of several hard-coded values(e.g. number of row dimensions, width of row dimension columns).

## No collapsing of the categories

Design has some kind of checkboxes, I assume it means that top level categories can be collapsed. I didn't implement this.

## No error handling

Broken data or data-fetching function throws? We should handle that nicely.

## Missing features

Density, null-values toggle, dark-mode.

## Performance

I wasn't paying much attention to the performance, as the main goal was to make it work, and work right.

As Kent Beck said in his famous quote, making it fast is the next step.

# Improvements before production release.

## Sticky Behavior

In such use cases, sticky elements are helpful as they allow users to keep context while scrolling
large table.

I would spend more time to implement proper UX here — either using CSS `position:sticky`, 3rd-party component
or custom javascript magic.

## Missing features / design alignment

We need parity with provided designs — will implement missing features and align design.

## Performance optimisations

It doesn't seem like the app has performance issues with given data set, but it's good
to test with more data/slower hardware, or even add some continuos testing
to avoid regressions in the future.

## Table Accessibility

Accessibility of the applications is importand and even required by law in some countries.
Before releasing, I would ensure that the application meets some basic [Web Content Accessibility Guidelines](https://www.w3.org/WAI/tutorials/tables/)
