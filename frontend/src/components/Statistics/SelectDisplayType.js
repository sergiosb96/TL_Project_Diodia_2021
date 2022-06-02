import React, { Fragment, useState } from "react";
import { ToggleButton, ToggleButtonGroup } from "react-bootstrap";

import BarChart from "../Charts/BarChart";
import PieChart from "../Charts/PieChart";
import PagedTable from "../UI/PagedTable";

const SelectDisplayType = (props) => {
  // display type (0=bar chart, 1=pie chart, 2=table, 3=map (not implemented)) - initially select bar chart (=0)
  const [displayType, setDisplayType] = useState(0);

  // available display types
  const availableTypes = [
    { name: "Γράφημα Στηλών", value: 0 },
    { name: "Γράφημα Πίτας", value: 1 },
    { name: "Πίνακας", value: 2 },
    // { name: "Χάρτης", value: 3 },
  ];

  return (
    <Fragment>
      <ToggleButtonGroup
        aria-label="Select Display Type"
        className="mb-1 px-3 d-flex"
        name="display-type"
        value={displayType}
      >
        {availableTypes.map((type, index) => (
          <ToggleButton
            key={index}
            id={`radio-${index}`}
            type="radio"
            variant="outline-dark"
            name="radio"
            value={type.value}
            checked={displayType === type.value}
            onClick={(event) => setDisplayType(type.value)}
          >
            {type.name}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      {/* if displayType = 0, display data on Bar Chart */}
      {displayType === 0 && (
        <div className="mt-3" style={{ height: "500px" }}>
          <BarChart
            title="Διάγραμμα Διελεύσεων/Εσόδων"
            labels={props.stations.map((station) => station.id)}
            datasets={[
              {
                label: "Διελεύσεις",
                data: props.stations.map((station) => station.numberOfPasses),
                backgroundColor: "rgba(0, 0, 255, 0.5)",
              },
              {
                label: "Έσοδα (€)",
                data: props.stations.map((station) => station.cost),
                backgroundColor: "rgba(255, 0, 0, 0.5)",
              },
            ]}
          />
        </div>
      )}
      {/* if displayType = 1, display data on Pie Chart */}
      {displayType === 1 && (
        <div className="mt-3" style={{ height: "500px" }}>
          <PieChart
            labels={props.stations.map(
              (station) => `${station.id}` // (${station.cost} €)`
            )}
            datasets={[
              {
                label: "Διελεύσεις",
                data: props.stations.map((station) => station.numberOfPasses),
                backgroundColor: props.stations.map(
                  () => "#" + Math.floor(Math.random() * 16777215).toString(16) // generate a random color for each station
                ),
                borderColor: props.stations.map(() => "rgba(0, 0, 0, 0.5"),
              },
            ]}
          />
        </div>
      )}
      {/* if displayType = 2, display data on table */}
      {displayType === 2 && (
        <div className="mt-3">
          <PagedTable
            // set <items> prop to display all stations
            items={props.stations}
            // set table's <columns> props to all key values in each pass object, with their descriptions to be displayed as column headers
            columns={[
              { id: "id", description: "Αναγνωριστικό" },
              { id: "numberOfPasses", description: "Αριθμός Διελεύσεων" },
              { id: "cost", description: "Έσοδα (€)" },
            ]}
          />
        </div>
      )}
    </Fragment>
  );
};

export default SelectDisplayType;
