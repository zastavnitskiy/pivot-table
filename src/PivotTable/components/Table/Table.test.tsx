import React from "react";
import ReactDOM from "react-dom";
import { Table } from "./Table";
import data from "../../../mockedData/small-subset.json";
import renderer from "react-test-renderer";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <Table
      data={data}
      rows={["category", "subCategory"]}
      columns={["states"]}
      valueProperty="sales"
      aggregationType="sum"
    />,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});

it("matches snapshot", () => {
  const tree = renderer
    .create(
      <Table
        data={data}
        rows={["category", "subCategory"]}
        columns={["states"]}
        valueProperty="sales"
        aggregationType="sum"
        labelOverrides={{
          category: "Category",
          subCategory: "Sub-Category"
        }}
      />
    )
    .toJSON();

  expect(tree).toMatchInlineSnapshot(`
    <div
      className="tableContainer"
    >
      <table
        className="table"
      >
        <thead>
          <tr
            className="topHeaderRow topHeaderRow__primary"
          >
            <th
              className=" element"
              colSpan={2}
              style={
                Object {
                  "left": "auto",
                }
              }
            />
            <th
              colSpan={2}
            />
          </tr>
          <tr
            className="topHeaderRow"
          >
            <th
              className=" element"
              style={
                Object {
                  "left": "auto",
                }
              }
            >
              Category
            </th>
            <th
              className=" element"
              style={
                Object {
                  "left": "auto",
                }
              }
            >
              Sub-Category
            </th>
            <th
              className="topHeaderCell__value"
            >
              undefined
            </th>
            <th
              className="topHeaderCell__value"
            >
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            className="row"
          >
            <th
              className="headerColumn headerColumn__primary element"
              style={
                Object {
                  "left": "auto",
                }
              }
            >
              Furniture
            </th>
            <th
              className="headerColumn headerColumn__secondary element"
              style={
                Object {
                  "left": "auto",
                }
              }
            >
              Bookcases
            </th>
            <td>
              262
            </td>
            <td>
              262
            </td>
          </tr>
          <tr
            className="row"
          >
            <th
              className="headerColumn headerColumn__primary element"
              style={
                Object {
                  "left": "auto",
                }
              }
            >
              
            </th>
            <th
              className="headerColumn headerColumn__secondary element"
              style={
                Object {
                  "left": "auto",
                }
              }
            >
              Chairs
            </th>
            <td>
              732
            </td>
            <td>
              732
            </td>
          </tr>
          <tr
            className="totalRow"
          >
            <th
              className=" element"
              colSpan={2}
              style={
                Object {
                  "left": "auto",
                }
              }
            >
              Furniture   total
            </th>
            <td>
              994
            </td>
            <td>
              994
            </td>
          </tr>
        </tbody>
        <tbody>
          <tr
            className="row"
          >
            <th
              className="headerColumn headerColumn__primary element"
              style={
                Object {
                  "left": "auto",
                }
              }
            >
              Office Supplies
            </th>
            <th
              className="headerColumn headerColumn__secondary element"
              style={
                Object {
                  "left": "auto",
                }
              }
            >
              Labels
            </th>
            <td>
              15
            </td>
            <td>
              15
            </td>
          </tr>
          <tr
            className="totalRow"
          >
            <th
              className=" element"
              colSpan={2}
              style={
                Object {
                  "left": "auto",
                }
              }
            >
              Office Supplies   total
            </th>
            <td>
              15
            </td>
            <td>
              15
            </td>
          </tr>
        </tbody>
        <tbody>
          <tr
            className="grandTotalRow totalRow"
          >
            <th
              className=" element"
              colSpan={2}
              style={
                Object {
                  "left": "auto",
                }
              }
            >
              Grand total
            </th>
            <td>
              1,009
            </td>
            <td>
              1,009
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `);
});
