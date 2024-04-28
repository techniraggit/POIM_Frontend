import React, { useState } from "react";
import { Collapse } from "antd";

const App = () => {
  const [expandIconPosition, setExpandIconPosition] = useState("start");
  const onPositionChange = (newExpandIconPosition) => {
    setExpandIconPosition(newExpandIconPosition);
  };

  const onChange = (key) => {
    console.log(key);
  };

  const items = [
    {
      key: "1",
      label: "Accordian",
      children: (
        <div className="displayflex-table">
          <div>23-apr-2024</div>
          <div className="border-amount">$2000</div>
        </div>
      ),
    },
  ];

  return (
    <>
      <Collapse
        defaultActiveKey={[]}
        onChange={onChange}
        expandIconPosition={expandIconPosition}
        items={items}
      />
    </>
  );
};
export default App;
