import React from "react";
import PropTypes from "prop-types";

import { DAYS } from "../../../constants/index";

const RepeatMonthlyOnThe = ({
  id,
  mode,
  onThe,
  hasMoreModes,
  handleChange,
}) => {
  const isActive = mode === "on the";

  return (
    <div
      className={`form-group row d-flex align-items-sm-center ${
        !isActive && "opacity-50"
      }`}>
      <div className="col-sm-1 offset-sm-2">
        {hasMoreModes && (
          <input
            id={id}
            type="radio"
            name="repeat.monthly.mode"
            aria-label="Repeat monthly on the"
            value="on the"
            checked={isActive}
            onChange={handleChange}
          />
        )}
      </div>
      <div className="col-sm-1">on the</div>

      <div className="col-sm-2">
        <select
          id={`${id}-which`}
          name="repeat.monthly.onThe.which"
          aria-label="Repeat monthly on the which"
          className="form-control"
          value={onThe.which}
          disabled={!isActive}
          onChange={handleChange}>
          <option value="First">First</option>
          <option value="Second">Second</option>
          <option value="Third">Third</option>
          <option value="Fourth">Fourth</option>
          <option value="Last">Last</option>
        </select>
      </div>

      <div className="col-sm-3">
        <select
          id={`${id}-day`}
          name="repeat.monthly.onThe.day"
          aria-label="Repeat monthly on the day"
          className="form-control"
          value={onThe.day}
          disabled={!isActive}
          onChange={handleChange}>
          {DAYS.map((day) => (
            <option key={day} value={day}>
              {day.toLowerCase()}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
RepeatMonthlyOnThe.propTypes = {
  id: PropTypes.string.isRequired,
  mode: PropTypes.oneOf(["on", "on the"]).isRequired,
  onThe: PropTypes.shape({
    which: PropTypes.oneOf(["First", "Second", "Third", "Fourth", "Last"])
      .isRequired,
    day: PropTypes.oneOf(DAYS).isRequired,
  }).isRequired,
  hasMoreModes: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default RepeatMonthlyOnThe;
