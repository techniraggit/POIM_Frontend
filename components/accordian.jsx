import React, { useState } from 'react';
// import { SettingOutlined } from '@ant-design/icons';
import { Collapse, Select } from 'antd';
const { Option } = Select;
const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;
const App = () => {
  const [expandIconPosition, setExpandIconPosition] = useState('start');
  const onPositionChange = (newExpandIconPosition) => {
    setExpandIconPosition(newExpandIconPosition);
  };
  const onChange = (key) => {
    console.log(key);
  };
//   const genExtra = () => (
//     <SettingOutlined
//       onClick={(event) => {
//         // If you don't want click extra trigger collapse, you can prevent this:
//         event.stopPropagation();
//       }}
//     />
//   );
  const items = [
    {
      key: '1',
      label: 'Accordian',
      children: <div className='displayflex-table'>
<div>
23-apr-2024
</div>
<div className='border-amount'> 
    $2000
</div>
      </div>,
    //   extra: genExtra(),
    },
  ];
  return (
    <>
      <Collapse
        defaultActiveKey={['1']}
        onChange={onChange}
        expandIconPosition={expandIconPosition}
        items={items}
      />
      {/* <br />
      <span>Accordian</span>
      <Select
        value={expandIconPosition}
        style={{
          margin: '0 8px',
        }}
        onChange={onPositionChange}
      >
        <Option value="start">start</Option>
        <Option value="end">end</Option>
      </Select> */}
    </>
  );
};
export default App;