import * as React from "react";
import { DatePicker } from "antd";

interface Props {
    onChange: (values: Array<any>) => void
}

const { RangePicker } = DatePicker;

// Stateless Component for DateRangePicker
const dateRangePicker = ({ onChange }: Props) => {
    return (
        <RangePicker onChange={onChange} />
    );
};

export default dateRangePicker;
