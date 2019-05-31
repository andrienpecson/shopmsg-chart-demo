import * as React from "react";
import { Spin } from "antd";

// Stateless Component for Loading
const loading = () => {
    return (
        <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 10,
            backgroundColor: "rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }}>
            <Spin />
        </div>
    );
};

export default loading;
