This is a demo of a Pivot table.

# Features

- [Pivot table: data aggregation functionality](https://en.wikipedia.org/wiki/Pivot_table)
- Configured in code, with possibility to build a UI configuration editor
- Async data loading
- Ability to ~Freeze~ dimension rows.

# Architecture

[ React: Loading state management, UI configuration ]
↓
[ JS: Raw data processing]
↓
[ JS: Data aggregation ]
↓
[ JS: Convert into props for rendering]
↓
[ React: Render privot table]

Data processing and Data aggregation layers are not dependant on any of the React primitives or types — hence UI framework is implementation detail that can be changed if needed; or data processing can be moved to backend once raw data is too big for a client to handle.
