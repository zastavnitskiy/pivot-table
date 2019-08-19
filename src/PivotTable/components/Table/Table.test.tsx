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
              className="stickyCell"
              colSpan={2}
            />
            <th
              colSpan={2}
            />
          </tr>
          <tr
            className="topHeaderRow"
          >
            <th
              className="stickyCell"
            >
              Category
            </th>
            <th
              className="stickyCell"
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
            <td
              className="headerColumn headerColumn__primary stickyCell"
            >
              Furniture
            </td>
            <td
              className="headerColumn headerColumn__secondary stickyCell"
            >
              Bookcases
            </td>
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
            <td
              className="headerColumn headerColumn__primary stickyCell"
            >
              
            </td>
            <td
              className="headerColumn headerColumn__secondary stickyCell"
            >
              Chairs
            </td>
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
              className="stickyCell"
              colSpan={2}
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
            <td
              className="headerColumn headerColumn__primary stickyCell"
            >
              Office Supplies
            </td>
            <td
              className="headerColumn headerColumn__secondary stickyCell"
            >
              Labels
            </td>
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
              className="stickyCell"
              colSpan={2}
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
              className="stickyCell"
              colSpan={2}
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
