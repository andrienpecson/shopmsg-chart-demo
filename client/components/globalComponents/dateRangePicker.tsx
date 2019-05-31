import * as React from "react";
import { DatePicker } from "antd";
const { RangePicker } = DatePicker;

// Stateless Component for DateRangePicker
const dateRangePicker = ({ onChange }) => {
    return (
        <RangePicker onChange={onChange} />
    );
};

export default dateRangePicker;
