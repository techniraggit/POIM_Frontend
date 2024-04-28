import React from "react";
import { Collapse } from "antd";
import dayjs from "dayjs";

const Accordian = ({ amounts }) => {
  const expandIconPosition = "start";

  const items = Object.keys(amounts || {}).map((key) => {
    console.log(amounts[key])
    return {
      key: key, label: key, children: (
        <>
          {amounts[key].map((amount) => {
            return(<>
              <div className="displayflex-table">
                <div>{dayjs(amount.datetime).format('DD-MM-YYYY HH:MM:ss')}</div>
                <div className="border-amount">${amount.amount}</div>
              </div>
            </>)
          })}
        </>
      )
    }
  })

  return (
    <>
      <Collapse
        defaultActiveKey={[]}
        expandIconPosition={expandIconPosition}
        items={items}
      />
    </>
  );
};
export default React.memo(Accordian);
