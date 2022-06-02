import React, { Fragment, useState } from "react";
import { Pagination, Row, Table } from "react-bootstrap";

import useWindowDimensions from "../../hooks/use-window-dimensions";

import "./PagedTable.css";

// maximum number of pages displayed based on current windows width
const calculateMaxPagesDisplayed = (width) => {
  if (width <= 400) {
    return 5;
  } else if (width <= 800) {
    return 7;
  } else if (width <= 1200) {
    return 15;
  } else {
    return 20;
  }
};

// construct the available pages to be displayed for selection based on currentPage, numberOfPages and maximumPages that can be displayed
const constructAvailablePagesArray = (
  currentPage,
  numberOfPages,
  maximumPages
) => {
  let pages = [];
  if (numberOfPages >= 1) {
    // if number of pages is <= maximum number of pages, display all pages
    if (numberOfPages <= maximumPages) {
      for (let i = 1; i <= numberOfPages; i++) {
        pages.push(i);
      }
    }
    // current page is <= maximum pages-2: display all pages from 1 to maximum pages-2, then ... and the last page
    else if (currentPage <= maximumPages - 2) {
      for (let i = 1; i <= maximumPages - 2; i++) {
        pages.push(i);
      }
      pages.push("");
      pages.push(numberOfPages);
    }
    // distance from current page to last page is <= maximum pages-2: display 1, ..., last <maximumPages - 2> pages
    else if (numberOfPages - currentPage < maximumPages - 2) {
      pages.push(1);
      pages.push("");
      for (let i = maximumPages - 3; i >= 0; i--) {
        pages.push(numberOfPages - i);
      }
    } else {
      pages.push(1);
      pages.push("");
      let firstPage = currentPage - Math.trunc((maximumPages - 4) / 2);
      if (maximumPages % 2 === 0) {
        firstPage++;
      }
      for (let i = firstPage; i < currentPage; i++) {
        pages.push(i);
      }
      pages.push(currentPage);
      let lastPage = currentPage + Math.floor((maximumPages - 4) / 2);
      for (let i = currentPage + 1; i <= lastPage; i++) {
        pages.push(i);
      }
      pages.push("");
      pages.push(numberOfPages);
    }
  }

  return pages;
};

// Table component with pages navigation
const PagedTable = (props) => {
  /*** Initialize table's columns and table's items passed in from props (if not passed, initialize as empty arrays) ***/
  const tableColumns = props.columns || []; // array of columns of the table, passed by props
  const allItems = props.items || []; // all items to be displayed, passed by props

  /*** Selected order for ordering items displayed in table ***/
  const defaultOrderByState =
    tableColumns.length > 0 ? { id: tableColumns[0].id, order: "asc" } : null;
  const [orderBy, setOrderBy] = useState(defaultOrderByState); // items order by (object containing <id> and <order>-either "asc" or "desc")

  // set selected ID to order by to the given ID.
  // if given ID is equal to the selected ID, charge order type from ascending to descending and vice versa
  const setSelectedOrder = (id) => {
    setOrderBy((prevOrder) => {
      if (prevOrder && prevOrder.id === id) {
        return {
          id,
          order: prevOrder.order === "asc" ? "desc" : "asc",
        };
      } else {
        return {
          id,
          order: "asc",
        };
      }
    });
  };

  /*** Search filter text by from input - initialize as empty string (no filtering) ***/
  const [searchFilter, setSearchFilter] = useState("");
  let displayedItems =
    !props.showSearch || !searchFilter || searchFilter.trim() === "" // if <showSearch> is not set to true, or no filter has been set (empty string, whitespaces or undefined)
      ? [...allItems] // display all available items
      : allItems.filter((item) => {
          // else filter the available items by the given filter text
          for (let key in item) {
            if (
              item[key]
                .toString()
                .toLowerCase()
                .includes(searchFilter.trim().toLowerCase())
            ) {
              return true;
            }
          }
          return false;
        });

  /*** After filtering was done, order displayed items by selected order ID and order type ***/
  const numberOfItems = displayedItems.length; // total number of items to be displayed
  if (numberOfItems > 0 && orderBy && orderBy.id) {
    displayedItems.sort((firstEl, secondEl) => {
      // order type is set to descending
      if (orderBy.order === "desc") {
        return firstEl[orderBy.id] > secondEl[orderBy.id]
          ? -1
          : firstEl[orderBy.id] < secondEl[orderBy.id]
          ? 1
          : 0;
      }
      // order type is set to ascending (or not set - assume default is ascending)
      else {
        return firstEl[orderBy.id] > secondEl[orderBy.id]
          ? 1
          : firstEl[orderBy.id] < secondEl[orderBy.id]
          ? -1
          : 0;
      }
    });
  }

  /*** Pagination for the table, to handle large number of data ***/
  const { width } = useWindowDimensions(); // get current dimensions of the window
  const itemsPerPage = 20; // maximum items (rows) to be displayed per page
  const maxPagesDisplayed = calculateMaxPagesDisplayed(width); // maximum number of pages displayed on page selection bar
  const [selectedPage, setSelectedPage] = useState(1); // currently selected page
  const numberOfPages = // number of pages needed, based on <numberOfItems> and <itemsPerPage>
    itemsPerPage > 0 && numberOfItems > 0
      ? Math.trunc(numberOfItems / itemsPerPage) +
        (numberOfItems % itemsPerPage > 0 ? 1 : 0)
      : 1;

  // in case of invalid selected page (> max), go to last page
  if (selectedPage > numberOfPages) {
    setSelectedPage(numberOfPages);
  }

  // create page selection bar
  let pages = constructAvailablePagesArray(
    selectedPage,
    numberOfPages,
    maxPagesDisplayed
  );

  return (
    <Fragment>
      <Row className="m-0 p-0">
        <Pagination className="col-sm-12 col-lg-8 ml-0">
          <Pagination.Prev
            onClick={() =>
              setSelectedPage((currentPage) =>
                currentPage > 1 ? currentPage - 1 : 1
              )
            }
          />
          {pages.length > 0 &&
            pages.map((page, index) => {
              if (page === "") {
                return <Pagination.Ellipsis key={"el-" + index} disabled />;
              } else {
                return (
                  <Pagination.Item
                    key={page}
                    active={page === selectedPage}
                    onClick={() => setSelectedPage(page)}
                  >
                    {page}
                  </Pagination.Item>
                );
              }
            })}
          <Pagination.Next
            onClick={() =>
              setSelectedPage((currentPage) =>
                currentPage < numberOfPages ? currentPage + 1 : numberOfPages
              )
            }
          />
        </Pagination>
        {/* only show search input if <showSearch> prop is set to true */}
        {props.showSearch && (
          <div className="col-sm-12 col-lg-4">
            <input
              className="bordered-input"
              type="text"
              value={searchFilter}
              placeholder="Αναζήτηση..."
              onChange={(event) => setSearchFilter(event.target.value)}
            />
          </div>
        )}
      </Row>
      {tableColumns.length > 0 && (
        <Table
          className="mt-1"
          striped
          bordered
          hover
          responsive="md"
          size="sm"
        >
          <thead>
            <tr>
              {tableColumns.map((column) => (
                <th
                  key={column.id}
                  onClick={() => setSelectedOrder(column.id)}
                  style={{ cursor: "pointer" }}
                >
                  {column.description}
                  <span
                    className={
                      column.id === orderBy.id ? "visible" : "invisible"
                    }
                  >
                    {orderBy.order === "desc" ? "▼" : "▲"}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {numberOfItems > 0 &&
              displayedItems
                .slice(
                  // slice items array to only display data according to selected page
                  (selectedPage - 1) * itemsPerPage,
                  selectedPage * itemsPerPage
                )
                .map(
                  (
                    item // for each item to be displayed, show table row
                  ) => (
                    <tr key={item.id}>
                      {tableColumns.map((column) => (
                        <td key={`${item.id}-${column.id}`}>
                          {item[column.id]}
                        </td>
                      ))}
                    </tr>
                  )
                )}
          </tbody>
        </Table>
      )}
      {allItems.length === 0 && (
        <p className="text-center text-danger">Δε βρέθηκαν δεδομένα</p>
      )}
      {allItems.length > 0 && numberOfItems === 0 && (
        <p className="text-center text-danger">
          Δε βρέθηκαν δεδομένα που να ταιριάζουν στα κριτήρια αναζήτησης
        </p>
      )}
    </Fragment>
  );
};

export default PagedTable;
